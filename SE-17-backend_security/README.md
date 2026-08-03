# SE-17 Backend Security — Secure Vault API

This mastery project is a FastAPI secure-note service demonstrating layered
backend security: bcrypt password hashing, short-lived JWT authentication,
owner-only authorization, Fernet encryption at rest, redacted logging, and a
deliberately ordered middleware stack.

## Run locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
```

Export real values for `JWT_SECRET_KEY`, `VAULT_ENCRYPTION_KEY`, and
`VAULT_DB_URL` before any non-development deployment. Generate a Fernet key
with `Fernet.generate_key()`; do not invent one manually or commit it.

## Security architecture

- Registration stores only salted bcrypt hashes and rejects duplicates with
  HTTP 409.
- Login returns a short-lived HS256 bearer token. Protected routes validate the
  signature and expiry through one `get_current_user` dependency.
- Private note text is encrypted before storage and decrypted only after an
  ownership check.
- A redacting formatter prevents passwords, access tokens, and note content
  from reaching logs.
- Security headers are registered outermost after CORS and GZip middleware, so
  the final response retains all protections. Credentialed CORS uses one named
  trusted origin rather than `*`.

See `SECURITY_AUDIT.md` for OWASP-oriented findings and production hardening
recommendations.
