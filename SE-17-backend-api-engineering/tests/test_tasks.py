"""Route-level tests for task CRUD behavior."""

from fastapi.testclient import TestClient

from database import Base, engine
from main import app


client = TestClient(app)


def setup_function():
    """Reset database tables before each test."""
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)


def create_sample_task() -> dict:
    """Create and return a task using the public API."""
    response = client.post(
        "/tasks",
        json={"title": "Test task", "priority": "high"},
    )
    assert response.status_code == 201
    return response.json()


def test_create_task():
    """Creating a valid task returns its persisted fields."""
    task = create_sample_task()
    assert task["title"] == "Test task"
    assert task["status"] == "pending"


def test_list_tasks():
    """Listing tasks returns a JSON array."""
    create_sample_task()
    response = client.get("/tasks")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_task():
    """Getting a task by id returns the matching resource."""
    task = create_sample_task()
    response = client.get(f"/tasks/{task['id']}")
    assert response.status_code == 200
    assert response.json()["id"] == task["id"]


def test_update_task():
    """Patching a task persists only the requested changes."""
    task = create_sample_task()
    response = client.patch(
        f"/tasks/{task['id']}", json={"status": "completed"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "completed"
    assert response.json()["title"] == task["title"]


def test_delete_task():
    """Deleting a task returns an empty 204 response."""
    task = create_sample_task()
    response = client.delete(f"/tasks/{task['id']}")
    assert response.status_code == 204
    assert client.get(f"/tasks/{task['id']}").status_code == 404


def test_get_missing_task():
    """Requesting a missing task returns the custom error contract."""
    response = client.get("/tasks/9999")
    assert response.status_code == 404
    assert response.json()["error_code"] == "TASK_NOT_FOUND"
