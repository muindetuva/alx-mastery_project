"""Define Celery work and success-triggered notification integration."""

import asyncio
import time

from celery.signals import task_success

from celery_app import celery_app
from notifications import cache_job_status, notify_job_complete
from retry_strategy import compute_backoff_with_jitter


@celery_app.task(bind=True)
def process_heavy_data(self, job_id: str) -> dict:
    """Simulate heavy processing and retry failures with jittered backoff."""
    try:
        time.sleep(2)
        return {"job_id": job_id, "status": "complete"}
    except Exception as exc:
        raise self.retry(
            exc=exc,
            countdown=compute_backoff_with_jitter(self.request.retries),
        ) from exc


async def _record_and_notify(result: dict) -> None:
    """Cache a successful result and notify connected clients."""
    job_id = result["job_id"]
    await cache_job_status(job_id, result)
    await notify_job_complete(job_id, method="websocket")


@task_success.connect
def on_process_heavy_data_success(
    sender=None,
    result=None,
    **kwargs,
) -> None:
    """Close the loop when the heavy Celery task completes successfully."""
    del kwargs
    if sender is process_heavy_data and isinstance(result, dict):
        asyncio.run(_record_and_notify(result))
