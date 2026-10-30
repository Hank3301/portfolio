from typing import AsyncGenerator
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    """Wrapper para tipagem explícita nas rotas."""
    async for session in get_db():
        yield session
