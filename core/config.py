from functools import lru_cache
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
