#!/usr/bin/env python3
"""Script para criar/atualizar arquivos do Módulo 3 automaticamente."""
from pathlib import Path

BASE = Path(__file__).parent

FILES = {
    # ===== REQUIREMENTS =====
    "requirements.txt": """# Core
fastapi==0.115.0
uvicorn[standard]==0.32.0
python-dotenv==1.0.1

# Database
sqlalchemy[asyncio]==2.0.36
asyncpg==0.30.0
alembic==1.13.2

# Validation & Serialization
pydantic==2.9.2
pydantic[email]==2.9.2
pydantic-settings==2.5.2

# Utils
python-multipart==0.0.9
httpx==0.27.2

# GitHub Integration
cachetools==5.5.0

# Auth
passlib[bcrypt]==1.7.4
python-jose[cryptography]==3.3.0
""",

    # ===== ENV EXAMPLE =====
    ".env.example": """# App
APP_NAME=Portfolio API
APP_VERSION=1.0.0
DEBUG=true

# Database (PostgreSQL async)
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/portfolio_db

# CORS
ALLOWED_ORIGINS=["http://localhost:3000"]

# GitHub Integration
GITHUB_USERNAME=seu-usuario-github
# GITHUB_TOKEN=ghp_xxxxxxxxxxxx  # Opcional

# Auth / Admin
# Gere SECRET_KEY: python -c "import secrets; print(secrets.token_hex(32))"
SECRET_KEY=coloque-uma-chave-secreta-forte-aqui-com-pelo-menos-32-caracteres
ACCESS_TOKEN_EXPIRE_MINUTES=10080
ADMIN_USERNAME=admin
# Hash bcrypt - GERE COM: python -c "from passlib.context import CryptContext; pwd=CryptContext(schemes=['bcrypt'],
deprecated='auto'); print(pwd.hash('sua-senha'))"
ADMIN_PASSWORD_HASH=$2b$12$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
""",

    # ===== CORE/CONFIG.PY =====
    "core/config.py": '''from functools import lru_cache
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore",
    )

    # App
    APP_NAME: str = "Portfolio API"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str

    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000"]

    # GitHub Integration
    GITHUB_USERNAME: str
    GITHUB_TOKEN: str | None = None

    # Auth / Admin
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 10080
    ADMIN_USERNAME: str
    ADMIN_PASSWORD_HASH: str


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
''',

    # ===== CORE/SECURITY.PY (NOVO) =====
    "core/security.py": '''from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext
from core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def create_access_token(
    subject: str,
    expires_delta: Optional[timedelta] = None,
) -> str:
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode = {"sub": str(subject), "exp": expire}
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm="HS256"
    )
    return encoded_jwt


def decode_access_token(token: str) -> Optional[str]:
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=["HS256"]
        )
        return payload.get("sub")
    except JWTError:
        return None
''',

    # ===== SCHEMAS/AUTH.PY (NOVO) =====
    "schemas/auth.py": '''from pydantic import BaseModel, ConfigDict


class Token(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    username: str | None = None
''',

    # ===== CRUD/PROJECT.PY (ATUALIZADO) =====
    "crud/project.py": '''from typing import List, Optional
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
''',

    # ===== API/DEPS.PY (ATUALIZADO) =====
    "api/deps.py": '''from typing import AsyncGenerator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import settings
from core.database import get_db
from core.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async for session in get_db():
        yield session


async def get_current_admin_user(
    token: str = Depends(oauth2_scheme),
) -> str:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Credenciais inválidas ou token expirado",
        headers={"WWW-Authenticate": "Bearer"},
    )

    username = decode_access_token(token)
    if username is None:
        raise credentials_exception

    if username != settings.ADMIN_USERNAME:
        raise credentials_exception

    return username


CurrentAdmin = Depends(get_current_admin_user)
''',

    # ===== API/ROUTES/AUTH.PY (NOVO) =====
    "api/routes/auth.py": '''import logging
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
''',

    # ===== API/ROUTES/PROJECTS.PY (ATUALIZADO) =====
    "api/routes/projects.py": '''import logging
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
''',

    # ===== API/__INIT__.PY (ATUALIZADO) =====
    "api/__init__.py": '''from fastapi import APIRouter

from api.routes import auth, github, health, projects

api_router = APIRouter()

api_router.include_router(health.router, prefix="/api")
api_router.include_router(projects.router, prefix="/api")
api_router.include_router(github.router, prefix="/api")
api_router.include_router(auth.router, prefix="/api")

__all__ = ["api_router"]
''',
}


def main():
    print("🔧 Criando/atualizando arquivos do Módulo 3...\n")

    for rel_path, content in FILES.items():
        file_path = BASE / rel_path
        file_path.parent.mkdir(parents=True, exist_ok=True)

        # Backup se já existe
        if file_path.exists():
            backup = file_path.with_suffix(file_path.suffix + ".bak")
            file_path.rename(backup)
            print(f"  📦 Backup: {rel_path} → {backup.name}")

        file_path.write_text(content, encoding="utf-8")
        print(f"  ✅ {rel_path}")

    print("\n✨ Arquivos criados/atualizados com sucesso!")
    print("\n📋 Próximos passos:")
    print("  1. pip install -r requirements.txt")
    print("  2. cp .env.example .env")
    print("  3. Edite .env com SECRET_KEY, ADMIN_PASSWORD_HASH, etc.")
    print("  4. uvicorn main:app --reload")


if __name__ == "__main__":
    main()