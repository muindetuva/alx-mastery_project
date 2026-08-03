"""Provide job-status persistence, polling, and notification delivery."""

import asyncio
import json
from typing import Any

import redis.asyncio as redis


status_redis_client = redis.Redis(host="localhost", port=6379, db=0)


def _status_key(job_id: str) -> str:
    """Return the shared Redis key for a job's status."""
    return f"job_status:{job_id}"


async def cache_job_status(
    job_id: str,
    status: dict,
    ttl_seconds: int = 3600,
) -> None:
    """Cache a JSON-encoded job status with a bounded lifetime."""
    await status_redis_client.setex(
        _status_key(job_id),
        ttl_seconds,
        json.dumps(status),
    )


async def get_job_status(job_id: str) -> dict | None:
    """Return a decoded cached job status when one exists."""
    raw = await status_redis_client.get(_status_key(job_id))
    if raw is None:
        return None
    return json.loads(raw)


async def watch_job_status(job_id: str, poll_interval: float = 1.0):
    """Yield status updates until the specified job is complete."""
    while True:
        await asyncio.sleep(poll_interval)
        status = await get_job_status(job_id)
        if status is None:
            status = {"job_id": job_id, "status": "pending"}
        yield status
        if status.get("status") == "complete":
            return


async def wait_for_completion(job_id: str) -> dict:
    """Consume job updates and return the first completed status."""
    async for status in watch_job_status(job_id):
        if status.get("status") == "complete":
            return status
    raise RuntimeError("Job status stream ended before completion")


class ConnectionManager:
    """Manage live WebSocket connections grouped by job identifier."""

    def __init__(self) -> None:
        """Initialize the active-connection registry."""
        self.active_connections: dict[str, list[Any]] = {}

    async def connect(self, job_id: str, websocket) -> None:
        """Accept and register a WebSocket for one job."""
        await websocket.accept()
        self.active_connections.setdefault(job_id, []).append(websocket)

    def disconnect(self, job_id: str, websocket) -> None:
        """Remove a closed WebSocket from the connection registry."""
        connections = self.active_connections.get(job_id, [])
        if websocket in connections:
            connections.remove(websocket)
        if not connections:
            self.active_connections.pop(job_id, None)

    async def send_notification(self, job_id: str, message: dict) -> None:
        """Send a JSON notification to every listener for a job."""
        failed = []
        for websocket in self.active_connections.get(job_id, []).copy():
            try:
                await websocket.send_json(message)
            except Exception:
                failed.append(websocket)
        for websocket in failed:
            self.disconnect(job_id, websocket)


manager = ConnectionManager()


def send_email_notification(email: str, job_id: str) -> None:
    """Represent an email delivery without contacting an external service."""
    print(f"Email notification for job {job_id} would be sent to {email}")


async def notify_job_complete(
    job_id: str,
    method: str,
    email: str = None,
) -> None:
    """Dispatch a completed-job notification through the chosen channel."""
    message = {"job_id": job_id, "status": "complete"}
    if method == "websocket":
        await manager.send_notification(job_id, message)
    elif method == "email" and email is not None:
        send_email_notification(email, job_id)
