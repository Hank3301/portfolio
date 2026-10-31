from datetime import datetime
from typing import List, Optional
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field, HttpUrl

class ProjectBase(BaseModel):
    """Campos compartilhados."""
    title: str = Field(..., min_length=1, max_length=200)
    description: str = Field(..., min_length=1)
    tech_stack: List[str] = Field(default_factory=list)
    github_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None
    is_visible: bool = True

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    tech_stack: Optional[List[str]] = None
    github_url: Optional[HttpUrl] = None
    live_url: Optional[HttpUrl] = None
    is_visible: Optional[bool] = None

class ProjectResponse(ProjectBase):
    model_config = ConfigDict(from_attributes=True)
    id: UUID
    created_at: datetime
    updated_at: datetime

class ProjectListResponse(BaseModel):
    items: List[ProjectResponse]
    total: int
    page: int
    page_size: int