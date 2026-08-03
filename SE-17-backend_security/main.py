"""Run a compact FastAPI service demonstrating layered backend security."""

from typing import Annotated

import jwt
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field

from auth import create_access_token, decode_access_token, hash_password
from auth import verify_password
from crypto_utils import decrypt_note, encrypt_note
from logging_utils import get_vault_logger
from middlewares import SecurityHeadersMiddleware


app = FastAPI(title="Secure Vault API")

# Starlette executes the last registered middleware first. Security headers are
# deliberately outermost so they survive CORS and compression processing.
app.add_middleware(GZipMiddleware, minimum_size=500)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://vault.example.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["Authorization", "Content-Type"],
)
# A wildcard origin is intentionally avoided when credentials are allowed.
app.add_middleware(SecurityHeadersMiddleware)

logger = get_vault_logger()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


class User(BaseModel):
    """Represent credentials accepted by registration and login routes."""

    username: str = Field(min_length=3)
    password: str = Field(min_length=8)


class Note(BaseModel):
    """Represent private note content supplied by an authenticated owner."""

    content: str = Field(min_length=1)


stored_users: dict[str, bytes] = {}
stored_notes: dict[int, dict[str, object]] = {}


def credentials_error() -> HTTPException:
    """Create the single public error used for all invalid bearer tokens."""
    return HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> str:
    """Return the subject from a valid, unexpired access token."""
    try:
        payload = decode_access_token(token)
        username = payload.get("sub")
        if not username or username not in stored_users:
            raise credentials_error()
        return str(username)
    except jwt.PyJWTError as exc:
        raise credentials_error() from exc


@app.get("/health")
def health() -> dict[str, str]:
    """Return a small public liveness response."""
    return {"status": "healthy"}


@app.post("/register", status_code=status.HTTP_201_CREATED)
def register(user: User) -> dict[str, str]:
    """Register a unique user and retain only the bcrypt password hash."""
    if user.username in stored_users:
        raise HTTPException(status_code=409, detail="User already exists")
    stored_users[user.username] = hash_password(user.password)
    logger.info("user_registered username=%s", user.username)
    return {"username": user.username}


@app.post("/login")
def login(user: User) -> dict[str, str]:
    """Return a bearer token when the submitted credentials are valid."""
    password_hash = stored_users.get(user.username)
    if password_hash is None or not verify_password(user.password, password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token({"sub": user.username})
    logger.info("user_logged_in username=%s", user.username)
    return {"access_token": token, "token_type": "bearer"}


@app.get("/me")
def me(current_user: Annotated[str, Depends(get_current_user)]):
    """Return the authenticated user's public identity."""
    return {"username": current_user}


@app.post("/notes", status_code=status.HTTP_201_CREATED)
def create_note(
    note: Note,
    current_user: Annotated[str, Depends(get_current_user)],
):
    """Encrypt a new note before storing it for its authenticated owner."""
    note_id = len(stored_notes) + 1
    stored_notes[note_id] = {
        "owner": current_user,
        "ciphertext": encrypt_note(note.content),
    }
    logger.info("note_created note_id=%s owner=%s", note_id, current_user)
    return {"id": note_id, "owner": current_user}


@app.get("/notes/{note_id}")
def read_note(
    note_id: int,
    current_user: Annotated[str, Depends(get_current_user)],
):
    """Decrypt and return a note only when requested by its owner."""
    record = stored_notes.get(note_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Note not found")
    if record["owner"] != current_user:
        raise HTTPException(status_code=403, detail="Forbidden")
    ciphertext = record["ciphertext"]
    if not isinstance(ciphertext, bytes):
        raise HTTPException(status_code=500, detail="Invalid stored note")
    return {
        "id": note_id,
        "owner": current_user,
        "content": decrypt_note(ciphertext),
    }
