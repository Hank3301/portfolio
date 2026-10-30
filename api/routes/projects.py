from typing import List
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from api.deps import get_db_session
from crud.project import project
from schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse

router = APIRouter(prefix="/projects", tags=["Projects"])


@router.post(
    "",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Criar novo projeto",
)
async def create_project(
    project_in: ProjectCreate,
    db: AsyncSession = Depends(get_db_session),
):
    return await project.create(db, obj_in=project_in)


@router.get(
    "",
    response_model=List[ProjectResponse],
    summary="Listar projetos visíveis",
)
async def list_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db_session),
):
    return await project.get_multi(db, skip=skip, limit=limit)


@router.get(
    "/{project_id}",
    response_model=ProjectResponse,
    summary="Obter projeto por ID",
)
async def get_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db_session),
):
    db_project = await project.get(db, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return db_project


@router.patch(
    "/{project_id}",
    response_model=ProjectResponse,
    summary="Atualizar projeto parcialmente",
)
async def update_project(
    project_id: UUID,
    project_in: ProjectUpdate,
    db: AsyncSession = Depends(get_db_session),
):
    db_project = await project.get(db, project_id)
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    return await project.update(db, db_obj=db_project, obj_in=project_in)


@router.delete(
    "/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Deletar projeto",
)
async def delete_project(
    project_id: UUID,
    db: AsyncSession = Depends(get_db_session),
):
    deleted = await project.delete(db, id=project_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Project not found")
