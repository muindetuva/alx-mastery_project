"""CRUD endpoints for task resources."""

from __future__ import annotations

from fastapi import APIRouter, Depends, Response, status as http_status
from sqlalchemy.orm import Session

from database import get_db
from errors import TaskNotFoundError
from models.task import Task
from schemas.task import TaskCreate, TaskResponse, TaskUpdate


router = APIRouter(prefix="/tasks", tags=["Tasks"])


def find_task(db: Session, task_id: int) -> Task:
    """Return a task by id or raise the shared not-found error."""
    task = db.query(Task).filter(Task.id == task_id).first()
    if task is None:
        raise TaskNotFoundError(task_id)
    return task


@router.post(
    "",
    response_model=TaskResponse,
    status_code=http_status.HTTP_201_CREATED,
    summary="Create a task",
    description="Create and persist a validated task resource.",
    operation_id="create_task",
)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)) -> Task:
    """Create a task and return its persisted representation."""
    task = Task(**payload.model_dump())
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


@router.get("", response_model=list[TaskResponse], operation_id="list_tasks")
def list_tasks(
    status: str | None = None,
    priority: str | None = None,
    db: Session = Depends(get_db),
) -> list[Task]:
    """List tasks, optionally filtered by status and priority."""
    query = db.query(Task)
    if status is not None:
        query = query.filter(Task.status == status)
    if priority is not None:
        query = query.filter(Task.priority == priority)
    return query.order_by(Task.id).all()


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    summary="Get one task",
    description="Retrieve a task by its integer identifier.",
    operation_id="get_task",
)
def get_task(task_id: int, db: Session = Depends(get_db)) -> Task:
    """Return one task by identifier."""
    return find_task(db, task_id)


@router.put(
    "/{task_id}", response_model=TaskResponse, operation_id="replace_task"
)
def replace_task(
    task_id: int, payload: TaskCreate, db: Session = Depends(get_db)
) -> Task:
    """Replace every client-editable field on an existing task."""
    task = find_task(db, task_id)
    for field, value in payload.model_dump().items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


@router.patch(
    "/{task_id}", response_model=TaskResponse, operation_id="update_task"
)
def update_task(
    task_id: int, payload: TaskUpdate, db: Session = Depends(get_db)
) -> Task:
    """Update only fields explicitly supplied for an existing task."""
    task = find_task(db, task_id)
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(task, field, value)
    db.commit()
    db.refresh(task)
    return task


@router.delete(
    "/{task_id}",
    status_code=http_status.HTTP_204_NO_CONTENT,
    operation_id="delete_task",
)
def delete_task(task_id: int, db: Session = Depends(get_db)) -> Response:
    """Delete a task and return an empty successful response."""
    task = find_task(db, task_id)
    db.delete(task)
    db.commit()
    return Response(status_code=http_status.HTTP_204_NO_CONTENT)
