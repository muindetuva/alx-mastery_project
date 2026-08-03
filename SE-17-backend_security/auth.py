"""Provide password hashing and short-lived JWT authentication helpers."""

from datetime import datetime, timedelta, timezone
from typing import Any

import bcrypt
import jwt

from config import JWT_SECRET_KEY


JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15


def hash_password(password: str) -> bytes:
    """Hash a password using bcrypt and a unique random salt."""
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())


def verify_password(password: str, password_hash: bytes) -> bool:
    """Return whether a password matches a stored bcrypt hash."""
    return bcrypt.checkpw(password.encode("utf-8"), password_hash)


def create_access_token(
    data: dict[str, Any], expires_minutes: int = ACCESS_TOKEN_EXPIRE_MINUTES
) -> str:
    """Create a signed JWT containing a short expiration time."""
    payload = data.copy()
    payload["exp"] = datetime.now(timezone.utc) + timedelta(
        minutes=expires_minutes
    )
    return jwt.encode(payload, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> dict[str, Any]:
    """Validate and decode a JWT using the configured algorithm."""
    return jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
