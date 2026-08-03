"""FastAPI entry point for the Instant Notification Engine."""

from fastapi import BackgroundTasks, FastAPI, WebSocket, WebSocketDisconnect

from notifications import get_job_status, manager
from tasks import process_heavy_data


app = FastAPI(title="Instant Notification Engine")


def should_use_worker_process(
    is_cpu_bound: bool,
    is_long_running: bool,
) -> bool:
    """Return whether either workload property requires a worker process."""
    return is_cpu_bound or is_long_running


@app.get("/health")
def health() -> dict[str, str]:
    """Return a lightweight service health response."""
    return {"status": "ok"}


def log_job_submission(job_id: str) -> None:
    """Append one accepted job identifier to the submission log."""
    with open("submissions.log", "a", encoding="utf-8") as log_file:
        log_file.write(f"Job {job_id} submitted\n")


@app.post("/jobs")
def submit_job(
    job_id: str,
    background_tasks: BackgroundTasks,
) -> dict[str, str]:
    """Queue heavy work and return immediately to the submitting client."""
    background_tasks.add_task(log_job_submission, job_id)
    process_heavy_data.delay(job_id)
    return {"job_id": job_id, "status": "queued"}


@app.websocket("/ws/{job_id}")
async def job_updates(websocket: WebSocket, job_id: str) -> None:
    """Keep a live connection available for completed-job notifications."""
    await manager.connect(job_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(job_id, websocket)


@app.get("/jobs/{job_id}/status")
async def get_status(job_id: str) -> dict | None:
    """Return the latest status cached for a submitted job."""
    return await get_job_status(job_id)
