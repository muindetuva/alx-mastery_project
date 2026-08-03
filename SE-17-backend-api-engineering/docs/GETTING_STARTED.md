# Getting Started

## Prerequisites

- Python 3.11 or newer
- `pip` and the standard-library `venv` module

## Installation

```bash
git clone https://github.com/muindetuva/alx-mastery_project.git
cd alx-mastery_project/SE-17-backend-api-engineering
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Copy `.env.example` to `.env` if you want to override the SQLite database,
API version, debug mode, or allowed origins.

## Run the server

```bash
uvicorn main:app --reload
```

The API is available at `http://localhost:8000`. Interactive Swagger UI and
ReDoc are available at `/docs` and `/redoc` respectively.

## Make your first API call

```bash
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Read the API guide","priority":"high"}'
```
