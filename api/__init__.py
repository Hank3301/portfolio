from fastapi import APIRouter

from api.routes import github, health, projects

api_router = APIRouter()
api_router.include_router(health.router, prefix="/api")
api_router.include_router(projects.router, prefix="/api")
api_router.include_router(github.router, prefix="/api")  # /api/github/repos

__all__ = ["api_router"]
