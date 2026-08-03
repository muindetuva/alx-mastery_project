# Standalone container verification

The intended standalone verification commands are:

```sh
docker build -t cluster-auth ./auth-service
docker run --env JWT_SECRET_KEY=dev-only -p 8001:8000 cluster-auth
curl http://localhost:8001/health

docker build -t cluster-data ./data-service
docker run --env JWT_SECRET_KEY=dev-only -p 8002:8000 cluster-data
curl http://localhost:8002/health
```

These commands document the explicit host-to-container port mappings that
Docker Compose automates. They were not run in the curriculum workspace because
building the images requires downloading external base images and packages.
