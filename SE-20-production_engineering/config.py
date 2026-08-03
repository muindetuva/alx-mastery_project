"""Environment-backed settings for the quote service."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Load monitoring settings from environment variables or an env file."""

    sentry_dsn: str = ""
    environment: str = "development"

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()
