"""SQLAlchemy model for task records."""

from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, String

from database import Base


def utc_now() -> datetime:
    """Return the current timezone-aware UTC time."""
    return datetime.now(timezone.utc)


class Task(Base):
    """Represent a task stored in the database."""

    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False)
    description = Column(String, nullable=True)
    status = Column(String(20), nullable=False, default="pending")
    priority = Column(String(20), nullable=False, default="medium")
    created_at = Column(DateTime(timezone=True), nullable=False, default=utc_now)
    updated_at = Column(
        DateTime(timezone=True), nullable=False, default=utc_now, onupdate=utc_now
    )
