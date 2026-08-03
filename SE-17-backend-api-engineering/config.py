"""Environment-backed configuration for the Task Management API."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Store application settings loaded from environment variables."""

    DATABASE_URL: str = "sqlite:///./tasks.db"
    API_VERSION: str = "1.0.0"
    DEBUG: bool = False
    ALLOWED_ORIGINS: str = "http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def allowed_origins(self) -> list[str]:
        """Return the configured comma-separated origins as a list."""
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]


settings = Settings()
