import logging
from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_db_session, get_current_admin_user, CurrentAdmin
from crud.project import project as crud_project
from schemas.project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
    ProjectListResponse,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/projects", tags=["Projects"])


# ==================== PÚBLICAS ====================

@router.get(
    "",
    response_model=ProjectListResponse,
    summary="Lista projetos públicos",
)
async def list_projects(
    db: AsyncSession = Depends(get_db_session),
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
) -> ProjectListResponse:
    skip = (page - 1) * page_size
    items = await crud_project.get_multi(db, skip=skip, limit=page_size, visible_only=True)
    total = await crud_project.count(db, visible_only=True)

    return ProjectListResponse(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
    summary="Busca projeto por ID",
)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db_session),
) -> ProjectResponse:
    obj = await crud_project.get(db, project_id)
    if not obj or not obj.is_visible:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Projeto não encontrado",
        )
    return obj


# ==================== PROTEGIDAS (ADMIN) ====================

@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Cria novo projeto",
    dependencies=[CurrentAdmin],
)
async def create_project(
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_db_session),
    current_user: str = Depends(get_current_admin_user),
) -> ProjectResponse:
    logger.info("Admin %s criando projeto: %s", current_user, project_in.title)
    return await crud_project.create(db, obj_in=project_in)


@router.put(
    "/{project_id}",
    response_model=ProjectResponse,
    summary="Atualiza projeto",
    dependencies=[CurrentAdmin],
)
async def update_project(
    project_id: UUID,
    project_in: ProjectUpdate,
    db: AsyncSession = Depends(get_db_session),
    current_user: str = Depends(get_current_admin_user),
) -> ProjectResponse:
    obj = await crud_project.get(db, project_id)
    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Projeto não encontrado",
        )
    logger.info("Admin %s atualizando projeto: %s", current_user, project_id)
    return await crud_project.update(db, db_obj=obj, obj_in=project_in)


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Deleta projeto",
    dependencies=[CurrentAdmin],
)
async def delete_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db_session),
    current_user: str = Depends(get_current_admin_user),
) -> None:
    obj = await crud_project.delete(db, id=project_id)
    if not obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Projeto não encontrado",
        )
    logger.info("Admin %s deletou projeto: %s", current_user, project_id)
