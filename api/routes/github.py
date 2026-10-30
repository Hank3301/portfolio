import logging

import httpx
from fastapi import APIRouter, HTTPException, status

from core.config import settings
from schemas.github import GithubRepoResponse
from services.github import fetch_user_repos

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/github", tags=["GitHub"])


@router.get(
    "/repos",
    response_model=list[GithubRepoResponse],
    summary="Lista repositórios públicos do GitHub",
    description=(
        "Retorna repositórios originais (não forks) do usuário configurado, "
        "ordenados por atualização mais recente. Cache de 30 minutos."
    ),
    responses={
        200: {"description": "Lista de repositórios"},
        503: {"description": "GitHub API indisponível ou rate limit excedido"},
        504: {"description": "Timeout na requisição à GitHub API"},
    },
)
async def list_github_repos() -> list[GithubRepoResponse]:
    """
    Busca repositórios do GitHub com cache.

    - **Cache**: 30 minutos (TTL) para evitar rate limit
    - **Filtro**: Apenas repositórios onde o usuário é owner (não forks)
    - **Ordenação**: Mais recentes primeiro (updated_at desc)
    """
    try:
        return await fetch_user_repos()

    except httpx.TimeoutException:
        logger.exception("Timeout ao buscar repositórios do GitHub")
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="Timeout ao conectar com a API do GitHub. Tente novamente em instantes.",
        )

    except httpx.HTTPStatusError as e:
        logger.exception("Erro HTTP da GitHub API: %s", e.response.status_code)

        if e.response.status_code in (403, 429):
            # Rate limit excedido
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="Rate limit da API do GitHub excedido. Configure GITHUB_TOKEN no .env para limites maiores.",
            )
        if e.response.status_code == 404:
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail=f"Usuário GitHub '{settings.GITHUB_USERNAME}' não encontrado.",
            )

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Serviço do GitHub temporariamente indisponível.",
        )

    except httpx.RequestError:
        logger.exception("Erro de rede ao acessar GitHub API")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Erro de conectividade com a API do GitHub.",
        )

    except Exception:
        logger.exception("Erro inesperado ao buscar repositórios")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Erro interno ao processar requisição.",
        )
