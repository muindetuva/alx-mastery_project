# The Instant Notification Engine

This project demonstrates a high-performance backend architecture in which a
FastAPI server accepts jobs, Celery processes heavy work in a separate worker,
and Redis acts as both the Celery transport and a short-lived status cache.
Clients can poll job status or receive completion messages over WebSocket.

## Components

- `main.py` exposes job submission, status, health, and WebSocket endpoints.
- `celery_app.py` configures the Redis-backed Celery application.
- `tasks.py` implements heavy work, retries, and the success signal handler.
- `notifications.py` implements polling, Redis status caching, and delivery.
- `retry_strategy.py` documents and implements jittered exponential backoff.

Run Redis locally, install the requirements, start the API with
`uvicorn main:app --reload`, and start a worker with
`celery -A celery_app.celery_app worker --loglevel=info` from this directory.

The heavy job belongs in a worker process because CPU-bound or long-running
work would otherwise occupy the request-serving process. Cheap best-effort
logging remains an in-process FastAPI background task.
