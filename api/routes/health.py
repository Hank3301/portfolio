from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_db_session
from core.config import settings

router = APIRouter(tags=["Health"])


@router.get("/health", summary="Health check da API e Banco de Dados")
async def health_check(db: AsyncSession = Depends(get_db_session)):
    """
    Verifica se a API está respondendo e se o banco está acessível.
    """
    # Check DB
    db_status = "healthy"
    db_error = None
    try:
        await db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = "unhealthy"
        db_error = str(e)

    response = {
        "status": "ok" if db_status == "healthy" else "degraded",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "database": {
            "status": db_status,
            "error": db_error,
        },
    }

    if db_status == "unhealthy":
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=response,
        )

    return response
