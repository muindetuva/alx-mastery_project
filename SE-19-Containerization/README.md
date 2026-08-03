# The Containerized Microservice Cluster

This project splits a small FastAPI application into independently deployable
authentication and data services. Each service has its own dependency list and
production Dockerfile. Docker Compose builds, configures, networks, and launches
both services while a development override adds live reload.

## Run the complete development cluster

Copy `.env.example` to `.env`, replace the placeholder secret, and use exactly
one launch command:

```sh
docker compose up --build
```

Request a token and use it to call the protected data service:

```sh
TOKEN=$(curl -s -X POST http://localhost:8001/token \
  -H 'Content-Type: application/json' \
  -d '{"username":"learner","password":"container-ready"}' \
  | python3 -c 'import json,sys; print(json.load(sys.stdin)["access_token"])')
curl -H "Authorization: Bearer $TOKEN" http://localhost:8002/items
```

Compose gives both services a default network and resolves `auth` by service
name, so data-service calls `http://auth:8000/verify` without custom networks.
The base Compose file remains deployable; bind mounts and `--reload` exist only
in `docker-compose.override.yml`.
