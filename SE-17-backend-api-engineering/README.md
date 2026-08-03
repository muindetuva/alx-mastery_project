# Task Management API

A production-oriented REST API for creating and managing tasks. It combines
FastAPI's validated request/response contracts with SQLAlchemy persistence,
consistent errors, generated OpenAPI documentation, automated tests, and a
container-ready runtime.

## Features

- Full create, list, retrieve, replace, partial-update, and delete operations
- Filtering by workflow status and priority
- SQLite persistence through request-scoped SQLAlchemy sessions
- Validated Pydantic schemas and consistent structured errors
- Swagger UI, ReDoc, tagged operations, examples, and a branded OpenAPI schema
- Configurable CORS, request logging, Docker packaging, and tests

## Tech Stack

- FastAPI
- SQLAlchemy
- Pydantic and pydantic-settings
- Uvicorn
- pytest and HTTPX
- Docker

## Quick Start

1. Clone the repository and enter this project directory.
2. Create an environment: `python3 -m venv .venv`.
3. Activate it: `source .venv/bin/activate`.
4. Install packages: `pip install -r requirements.txt`.
5. Run the API: `uvicorn main:app --reload`.
6. Open `http://localhost:8000/docs`.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/` | Check application health |
| POST | `/tasks` | Create a task |
| GET | `/tasks` | List and optionally filter tasks |
| GET | `/tasks/{task_id}` | Retrieve one task |
| PUT | `/tasks/{task_id}` | Fully replace a task |
| PATCH | `/tasks/{task_id}` | Partially update a task |
| DELETE | `/tasks/{task_id}` | Delete a task |

## Documentation

- Swagger UI: [`/docs`](http://localhost:8000/docs)
- ReDoc: [`/redoc`](http://localhost:8000/redoc)
- [Consumer usage guide](docs/USAGE_GUIDE.md)
- [Getting started guide](docs/GETTING_STARTED.md)

## Project Structure

```text
SE-17-backend-api-engineering/
├── config.py
├── database.py
├── errors.py
├── main.py
├── models/
│   └── task.py
├── routers/
│   └── tasks.py
├── schemas/
│   └── task.py
├── tests/
│   └── test_tasks.py
├── docs/
│   ├── GETTING_STARTED.md
│   └── USAGE_GUIDE.md
├── requirements.txt
└── Dockerfile
```
