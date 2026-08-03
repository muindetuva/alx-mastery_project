"""Custom exception hierarchy for consistent API errors."""


class APIError(Exception):
    """Represent an application error with a stable client-facing code."""

    def __init__(self, detail: str, error_code: str, status_code: int):
        """Initialize an API error with response metadata."""
        self.detail = detail
        self.error_code = error_code
        self.status_code = status_code
        super().__init__(detail)


class TaskNotFoundError(APIError):
    """Report that no task exists for a requested identifier."""

    def __init__(self, task_id: int):
        """Initialize a not-found error for *task_id*."""
        self.task_id = task_id
        super().__init__(
            detail=f"Task {task_id} not found",
            error_code="TASK_NOT_FOUND",
            status_code=404,
        )
