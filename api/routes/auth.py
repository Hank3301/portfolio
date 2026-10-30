import logging
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm

from core.config import settings
from core.security import verify_password, create_access_token
from schemas.auth import Token
from api.deps import get_current_admin_user

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/auth", tags=["Auth"])


@router.post(
    "/login",
    response_model=Token,
    summary="Login do administrador",
    responses={
        200: {"description": "Login realizado com sucesso"},
        401: {"description": "Credenciais inválidas"},
    },
)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Token:
    if form_data.username != settings.ADMIN_USERNAME:
        logger.warning("Tentativa de login com username inválido: %s", form_data.username)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not verify_password(form_data.password, settings.ADMIN_PASSWORD_HASH):
        logger.warning("Tentativa de login com senha incorreta para: %s", form_data.username)
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(subject=settings.ADMIN_USERNAME)
    logger.info("Login realizado com sucesso: %s", settings.ADMIN_USERNAME)

    return Token(access_token=access_token, token_type="bearer")


@router.get(
    "/me",
    summary="Verifica token atual",
)
async def get_current_user(username: str = Depends(get_current_admin_user)) -> dict:
    return {"username": username, "message": "Token válido"}
