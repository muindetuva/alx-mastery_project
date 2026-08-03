"""API tests for the engineering quote service."""

from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_health_check() -> None:
    """The health endpoint reports that the process is available."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_get_quote() -> None:
    """A known quote is returned as a structured JSON object."""
    response = client.get("/quote", params={"quote_id": 2})
    assert response.status_code == 200
    assert response.json()["author"] == "Austin Freeman"
    assert "quote" in response.json()


def test_unknown_quote() -> None:
    """An unknown quote identifier produces an explicit not-found response."""
    response = client.get("/quote", params={"quote_id": 999})
    assert response.status_code == 404
