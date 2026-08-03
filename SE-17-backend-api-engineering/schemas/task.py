"""Validation schemas for Task API requests and responses."""

from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field, field_validator


TaskStatus = Literal["pending", "in_progress", "completed"]
TaskPriority = Literal["low", "medium", "high"]


class TaskBase(BaseModel):
    """Define fields shared by task creation and responses."""

    title: str = Field(min_length=1, max_length=200)
    description: str | None = None
    status: TaskStatus = "pending"
    priority: TaskPriority = "medium"

    @field_validator("title")
    @classmethod
    def title_must_not_be_blank(cls, value: str) -> str:
        """Strip a title and reject values containing only whitespace."""
        value = value.strip()
        if not value:
            raise ValueError("title must not be blank")
        return value


class TaskCreate(TaskBase):
    """Validate the body used to create or fully replace a task."""

    model_config = ConfigDict(
        json_schema_extra={
            "examples": [
                {
                    "title": "Publish release notes",
                    "description": "Summarize the changes in version 1.0",
                    "status": "pending",
                    "priority": "high",
                }
            ]
        }
    )


class TaskUpdate(BaseModel):
    """Validate optional fields used to partially update a task."""

    title: str | None = Field(default=None, min_length=1, max_length=200)
    description: str | None = None
    status: TaskStatus | None = None
    priority: TaskPriority | None = None

    @field_validator("title")
    @classmethod
    def optional_title_must_not_be_blank(cls, value: str | None) -> str | None:
        """Strip a supplied title and reject whitespace-only values."""
        if value is None:
            return value
        value = value.strip()
        if not value:
            raise ValueError("title must not be blank")
        return value


class TaskResponse(TaskBase):
    """Describe the public representation returned for a task."""

    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        json_schema_extra={
            "examples": [
                {
                    "id": 1,
                    "title": "Publish release notes",
                    "description": "Summarize the changes in version 1.0",
                    "status": "pending",
                    "priority": "high",
                    "created_at": "2026-01-01T09:00:00Z",
                    "updated_at": "2026-01-01T09:00:00Z",
                }
            ]
        },
    )
