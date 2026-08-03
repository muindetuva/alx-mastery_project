"""Configure structured logging that redacts sensitive vault fields."""

import logging
import re


SENSITIVE_FIELDS = ("password", "access_token", "note_content")


class RedactingFormatter(logging.Formatter):
    """Replace values belonging to sensitive fields before log emission."""

    def format(self, record: logging.LogRecord) -> str:
        """Format a record and redact common key-value representations."""
        message = super().format(record)
        for field in SENSITIVE_FIELDS:
            pattern = rf"({field}\s*[:=]\s*)([^,\s}}]+)"
            message = re.sub(pattern, rf"\1[REDACTED]", message)
        return message


def get_vault_logger() -> logging.Logger:
    """Return the configured non-propagating application logger."""
    logger = logging.getLogger("secure_vault")
    logger.setLevel(logging.INFO)
    logger.propagate = False
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(
            RedactingFormatter("%(asctime)s %(levelname)s %(message)s")
        )
        logger.addHandler(handler)
    return logger
