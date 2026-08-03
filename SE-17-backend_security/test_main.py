"""Exercise the security middleware stack through the public health route."""

from fastapi.testclient import TestClient

from main import app


client = TestClient(app)


def test_security_headers_coexist_with_cors_and_compression():
    """Verify outer security headers remain on a middleware response."""
    response = client.get(
        "/health",
        headers={"Origin": "https://vault.example.com"},
    )
    assert response.status_code == 200
    assert response.headers["x-content-type-options"] == "nosniff"
    assert response.headers["x-frame-options"] == "DENY"
    assert response.headers["x-request-id"]
    assert response.headers["access-control-allow-origin"] == (
        "https://vault.example.com"
    )
