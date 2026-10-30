from fastapi import APIRouter

from api.routes import health, projects

api_router = APIRouter()
api_router.include_router(health.router, prefix="/api")
api_router.include_router(projects.router, prefix="/api")

__all__ = ["api_router"]
