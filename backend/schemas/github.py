from datetime import datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict, HttpUrl


class GithubRepoResponse(BaseModel):
    """Schema de resposta padronizado para repositórios do GitHub."""
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: Optional[str] = None
    html_url: HttpUrl
    homepage: Optional[HttpUrl] = None
    language: Optional[str] = None
    stargazers_count: int = 0
    forks_count: int = 0
    updated_at: datetime
