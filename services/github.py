import asyncio
import logging
from typing import List

import httpx
from cachetools import TTLCache

from core.config import settings
from schemas.github import GithubRepoResponse

logger = logging.getLogger(__name__)

# Cache in-memory: max 100 entradas, TTL 30 minutos (1800 segundos).
# Obs.: o decorator `cachetools.cached` não funciona com funções async (ele
# guardaria a corrotina, que só pode ser awaited uma vez), por isso o cache
# é feito manualmente. Erros nunca são cacheados.
_github_cache: TTLCache = TTLCache(maxsize=100, ttl=1800)
_cache_lock = asyncio.Lock()

GITHUB_API_BASE = "https://api.github.com"
DEFAULT_HEADERS = {
    "Accept": "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
}


def _get_github_headers() -> dict[str, str]:
    """Constrói headers com autenticação opcional."""
    headers = DEFAULT_HEADERS.copy()
    if settings.GITHUB_TOKEN:
        headers["Authorization"] = f"Bearer {settings.GITHUB_TOKEN}"
    return headers


async def _fetch_repos_from_github() -> List[GithubRepoResponse]:
    """Faz a chamada HTTP à API do GitHub e mapeia o resultado."""
    url = f"{GITHUB_API_BASE}/users/{settings.GITHUB_USERNAME}/repos"
    params = {
        "sort": "updated",
        "direction": "desc",
        "per_page": 100,  # máximo por página
        "type": "owner",  # apenas repos onde o usuário é owner
    }

    timeout = httpx.Timeout(connect=15.0, read=10.0, write=5.0, pool=5.0)
    # Força IPv4 (evita travar em redes com IPv6 mal configurado) e tenta de novo se a conexão falhar
    transport = httpx.AsyncHTTPTransport(local_address="0.0.0.0", retries=2)

    async with httpx.AsyncClient(
        timeout=timeout,
        headers=_get_github_headers(),
        transport=transport,
    ) as client:
    
        try:
            response = await client.get(url, params=params)
            response.raise_for_status()
            repos_data = response.json()

        except httpx.TimeoutException as e:
            logger.error("Timeout ao buscar repositórios do GitHub: %s", e)
            raise
        except httpx.HTTPStatusError as e:
            logger.error(
                "Erro HTTP da API do GitHub: %s - %s",
                e.response.status_code,
                e.response.text,
            )
            raise
        except httpx.RequestError as e:
            logger.error("Erro de rede ao acessar GitHub API: %s", e)
            raise

    # Filtra forks e mapeia para schema
    filtered_repos: List[GithubRepoResponse] = []
    for repo in repos_data:
        if repo.get("fork", False):
            continue  # pula forks

        filtered_repos.append(
            GithubRepoResponse(
                id=repo["id"],
                name=repo["name"],
                description=repo.get("description"),
                html_url=repo["html_url"],
                # GitHub pode devolver "" quando não há homepage; HttpUrl rejeita string vazia
                homepage=repo.get("homepage") or None,
                language=repo.get("language"),
                stargazers_count=repo.get("stargazers_count", 0),
                forks_count=repo.get("forks_count", 0),
                updated_at=repo["updated_at"],
            )
        )

    logger.info("Repositórios buscados do GitHub: %d (após filtro de forks)", len(filtered_repos))
    return filtered_repos


async def fetch_user_repos() -> List[GithubRepoResponse]:
    """
    Retorna os repositórios públicos do usuário no GitHub.

    - Cache: TTLCache 30 min (evita rate limit e melhora performance)
    - Filtro: ignora forks (apenas repos originais)
    - Ordenação: por updated_at decrescente (mais recentes primeiro)
    """
    key = settings.GITHUB_USERNAME

    cached = _github_cache.get(key)
    if cached is not None:
        return cached

    # Lock evita várias chamadas simultâneas ao GitHub quando o cache está vazio
    async with _cache_lock:
        cached = _github_cache.get(key)
        if cached is not None:
            return cached

        repos = await _fetch_repos_from_github()
        _github_cache[key] = repos
        return repos


async def clear_github_cache() -> None:
    """Utilitário para limpar cache manualmente (ex: endpoint admin)."""
    _github_cache.clear()
    logger.info("Cache do GitHub limpo manualmente")
