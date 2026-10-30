from typing import List, Optional
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.project import Project
from schemas.project import ProjectCreate, ProjectUpdate


def _is_pydantic_url(value) -> bool:
    """Verifica se o valor é um tipo URL do Pydantic (AnyUrl, HttpUrl, etc.)."""
    # Verifica pelo nome da classe e módulo
    if value is None:
        return False
    class_name = value.__class__.__name__
    module_name = value.__class__.__module__
    return (
        class_name in ("Url", "AnyUrl", "HttpUrl", "FileUrl", "PostgresDsn", "RedisDsn", "MongoDsn")
        or module_name.startswith("pydantic")
        and "url" in class_name.lower()
    )


def _convert_urls_to_str(data: dict) -> dict:
    """Converte quaisquer objetos URL do Pydantic para string nativa."""
    converted = {}
    for key, value in data.items():
        if _is_pydantic_url(value):
            converted[key] = str(value)
        elif isinstance(value, dict):
            converted[key] = _convert_urls_to_str(value)
        elif isinstance(value, list):
            converted[key] = [
                str(item) if _is_pydantic_url(item) else item
                for item in value
            ]
        else:
            converted[key] = value
    return converted


class CRUDProject:
    async def create(self, db: AsyncSession, *, obj_in: ProjectCreate) -> Project:
        # mode="json" + conversão forçada dos campos URL
        data = obj_in.model_dump(mode="json")

        # Força conversão de campos URL conhecidos (proteção extra)
        for field in ("github_url", "live_url"):
            if field in data and data[field] is not None:
                data[field] = str(data[field])

        db_obj = Project(**data)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def get(self, db: AsyncSession, id: UUID) -> Optional[Project]:
        result = await db.execute(select(Project).where(Project.id == id))
        return result.scalar_one_or_none()

    async def get_multi(
        self,
        db: AsyncSession,
        *,
        skip: int = 0,
        limit: int = 100,
        visible_only: bool = True,
    ) -> List[Project]:
        stmt = select(Project)
        if visible_only:
            stmt = stmt.where(Project.is_visible.is_(True))
        stmt = stmt.order_by(Project.created_at.desc()).offset(skip).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()

    async def count(self, db: AsyncSession, *, visible_only: bool = True) -> int:
        stmt = select(func.count(Project.id))
        if visible_only:
            stmt = stmt.where(Project.is_visible.is_(True))
        result = await db.execute(stmt)
        return result.scalar_one()

    async def update(
        self, db: AsyncSession, *, db_obj: Project, obj_in: ProjectUpdate
    ) -> Project:
        # mode="json" + conversão forçada dos campos URL
        update_data = obj_in.model_dump(exclude_unset=True, mode="json")

        # Força conversão de campos URL conhecidos
        for field in ("github_url", "live_url"):
            if field in update_data and update_data[field] is not None:
                update_data[field] = str(update_data[field])

        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        return db_obj

    async def delete(self, db: AsyncSession, *, id: UUID) -> Optional[Project]:
        obj = await self.get(db, id)
        if obj:
            await db.delete(obj)
            await db.commit()
        return obj


project = CRUDProject()