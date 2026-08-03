"""Application entry point for the Task Management API."""

import logging
import time

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from fastapi.responses import JSONResponse

from config import settings
from database import Base, engine
from errors import APIError
from routers.tasks import router as tasks_router


logging.basicConfig(
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s %(message)s",
)
logger = logging.getLogger("task_api")

tags_metadata = [
    {
        "name": "Tasks",
        "description": "Create, read, update, filter, and delete tasks.",
    },
    {
        "name": "System",
        "description": "Health and operational status endpoints.",
    },
]

app = FastAPI(
    title="Task Management API",
    description="""
## Task Management

A public REST API for organizing tasks, priorities, and workflow status.

### Features
- Complete CRUD operations
- Filtering by status and priority
- Consistent validation and error responses
""",
    version=settings.API_VERSION,
    contact={"name": "Task API Support", "email": "api-support@example.com"},
    license_info={"name": "MIT", "identifier": "MIT"},
    openapi_tags=tags_metadata,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def log_requests(request: Request, call_next):
    """Log the method, path, status, and duration for every request."""
    started = time.perf_counter()
    response = await call_next(request)
    elapsed_ms = (time.perf_counter() - started) * 1000
    logger.info(
        "%s %s status=%s duration_ms=%.2f",
        request.method,
        request.url.path,
        response.status_code,
        elapsed_ms,
    )
    return response


@app.exception_handler(APIError)
async def api_error_handler(request: Request, exc: APIError) -> JSONResponse:
    """Convert application exceptions into a consistent JSON response."""
    logger.warning("API error on %s: %s", request.url.path, exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "error_code": exc.error_code,
            "status_code": exc.status_code,
        },
    )


@app.exception_handler(RequestValidationError)
async def validation_error_handler(
    request: Request, exc: RequestValidationError
) -> JSONResponse:
    """Return predictable details for invalid request data."""
    logger.info("Validation error on %s", request.url.path)
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Request validation failed",
            "error_code": "VALIDATION_ERROR",
            "status_code": 422,
            "errors": exc.errors(),
        },
    )


@app.get(
    "/",
    tags=["System"],
    summary="Health check",
    operation_id="health_check",
)
def health_check() -> dict[str, str]:
    """Report that the application process is healthy."""
    return {"status": "healthy"}


app.include_router(tasks_router)
Base.metadata.create_all(bind=engine)


def custom_openapi():
    """Build and cache an OpenAPI schema with branded API information."""
    if app.openapi_schema:
        return app.openapi_schema
    schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    schema["info"]["x-logo"] = {
        "url": "https://fastapi.tiangolo.com/img/logo-margin/logo-teal.png"
    }
    schema["info"]["contact"] = app.contact
    schema["info"]["license"] = app.license_info
    app.openapi_schema = schema
    return app.openapi_schema


app.openapi = custom_openapi
