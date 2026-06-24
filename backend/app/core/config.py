"""Application settings loaded from environment / .env."""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Family Organizer API"
    database_url: str = (
        "postgresql+asyncpg://postgres:postgres@localhost:5433/familyapp"
    )


settings = Settings()
