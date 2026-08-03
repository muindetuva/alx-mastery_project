"""Configure the notification engine's Celery application."""

from celery import Celery


celery_app = Celery(
    "notification_engine",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
)
