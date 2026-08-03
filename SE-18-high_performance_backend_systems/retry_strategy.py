"""AI-Assisted Retry Strategy Design

Plain exponential backoff can make many failed jobs retry simultaneously,
creating a thundering herd. Random jitter spreads retries over a time window
so the broker and downstream services recover under smoother load.
"""

import random


def compute_backoff_with_jitter(
    retry_count: int,
    base_delay: float = 2,
) -> float:
    """Return exponential backoff plus a randomized jitter component."""
    return base_delay ** retry_count + random.uniform(0, 1)
