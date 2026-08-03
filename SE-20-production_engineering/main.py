"""A small FastAPI service that returns curated engineering quotes."""

import sentry_sdk
from fastapi import FastAPI, HTTPException

from config import settings


sentry_sdk.init(
    dsn=settings.sentry_dsn,
    environment=settings.environment,
    traces_sample_rate=0.1,
)

app = FastAPI(title="Engineering Quote Service", version="1.0.0")

QUOTES = [
    {
        "id": 1,
        "quote": "Make it work, make it right, make it fast.",
        "author": "Kent Beck",
    },
    {
        "id": 2,
        "quote": "Simplicity is the soul of efficiency.",
        "author": "Austin Freeman",
    },
    {
        "id": 3,
        "quote": "First, solve the problem. Then, write the code.",
        "author": "John Johnson",
    },
]


@app.get("/health")
def health_check() -> dict[str, str]:
    """Report that the API process is ready to receive requests."""
    return {"status": "ok"}


@app.get("/quote")
def get_quote(quote_id: int = 1) -> dict[str, int | str]:
    """Return one curated quote selected by its stable identifier."""
    for quote in QUOTES:
        if quote["id"] == quote_id:
            return quote
    raise HTTPException(status_code=404, detail="Quote not found")


@app.get("/quotes")
def list_quotes() -> dict[str, list[dict[str, int | str]]]:
    """Return every quote in the small curated collection."""
    return {"quotes": QUOTES}
