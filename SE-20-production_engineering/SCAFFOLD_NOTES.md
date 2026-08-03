# Scaffold Notes

## Prompt given to the AI tool

I asked ChatGPT: "Scaffold a small original FastAPI engineering-quote service.
Add `GET /quote` with a numeric quote identifier, `GET /health`, a hardcoded
list of structured quotes, and pytest coverage using `TestClient` from
`fastapi.testclient`. Return JSON objects and do not add a database or external
API."

## What I reviewed and changed

The first draft selected a random quote, which made its test depend on chance.
I changed the endpoint to accept a stable `quote_id`, added an explicit 404
response for unknown identifiers, and added a test for that failure path. I
also split environment-backed monitoring settings into `config.py` and checked
that the Sentry defaults keep local tests independent of production secrets.
