# SE-20 Production Engineering

This project takes an original FastAPI quote service from source code to a
production-style deployment. It includes automated linting, tests, a
commit-SHA-tagged Docker build, SSH deployment, Nginx HTTPS termination, a UFW
firewall, systemd process management, Sentry monitoring, and incident planning.

## Local development

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Run the checks with `ruff check .` and `pytest`.
