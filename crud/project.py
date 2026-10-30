from typing import List, Optional
from uuid import UUID

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from models.project import Project
from schemas.project import ProjectCreate, ProjectUpdate


class CRUDProject:
    async def create(self, db: AsyncSession, *, obj_in: ProjectCreate) -> Project:
        db_obj = Project(**obj_in.model_dump())
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
        update_data = obj_in.model_dump(exclude_unset=True)
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
