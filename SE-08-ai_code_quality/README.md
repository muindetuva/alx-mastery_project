# SE-08 AI Code Quality

This directory contains the starting point for a quality pass on a legacy
library catalog module. The first task keeps `legacy.py` unchanged and adds
characterization tests that pin the current behavior before any refactor.

## Baseline

The current tool stores books, members, and loans in a single `Library` class.
It can add books and members, search by title or author, detect duplicate
titles, loan available copies, list overdue loans, and produce a text report.

Visible code smells:

- One class owns storage, search, loaning, duplicate detection, and reporting.
- Internal names such as `b`, `m`, `l`, `x`, and `s` are cryptic.
- `search_by_title` and `search_by_author` duplicate the same loop structure.
- `duplicate_titles` uses a nested loop, making it an O(n²) hot path.
- Search is intended to be case-insensitive, but current behavior is
  case-sensitive.

Metrics to improve later:

- Keep characterization tests green while refactoring.
- Reduce duplication in search behavior.
- Replace the duplicate-title nested loop with a linear approach.
- Add regression coverage for case-insensitive search.
- Improve naming and separation of responsibilities without changing behavior
  until the bug-fix step explicitly requires it.

## Running Tests

From this directory:

```bash
python3 -m unittest discover tests -v
```
