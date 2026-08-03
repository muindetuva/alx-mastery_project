"""Load security settings from environment variables."""

import os


# Development defaults make the lab runnable. Production deployments must
# override all three values through a secret manager or environment variables.
JWT_SECRET_KEY = os.environ.get(
    "JWT_SECRET_KEY", "development-only-change-this-jwt-secret"
)
VAULT_ENCRYPTION_KEY = os.environ.get(
    "VAULT_ENCRYPTION_KEY",
    "MDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA=",
)
VAULT_DB_URL = os.environ.get("VAULT_DB_URL", "sqlite:///./vault.db")
