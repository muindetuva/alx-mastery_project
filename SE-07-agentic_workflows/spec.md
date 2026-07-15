# TaskFlow Specification

## Problem

TaskFlow helps a user manage projects and tasks from a terminal. The user needs
a small local tool that can create work items, connect tasks to projects, track
progress, and persist data between sessions without a web app or database.

The system should feel similar to the AirBnB console project: a command-line
REPL controls object-oriented models, and all objects are saved to a JSON file.

## Data Model

### BaseModel

Shared model fields:

- `id`: unique string identifier
- `created_at`: creation timestamp
- `updated_at`: last update timestamp

Shared model methods:

- `save()`: updates `updated_at` and persists data
- `to_dict()`: returns a serialisable dictionary representation

### Project

Fields:

- `name`: project name
- `description`: short project description

### Task

Fields:

- `title`: task title
- `description`: task details
- `status`: one of `todo`, `in_progress`, `done`
- `priority`: one of `low`, `medium`, `high`
- `due_date`: date string for when the task is due
- `project_id`: optional id of the linked project

## Persistence

All objects are persisted to `taskflow.json`.

The storage layer should:

- save all objects to JSON
- reload objects when the app starts
- preserve object class information
- support adding, updating, and deleting objects

## Commands

### create

Creates a new object.

Expected forms:

```text
create Project name="Website" description="Portfolio rebuild"
create Task title="Write copy" description="Draft homepage text" priority=high due_date=2026-07-30
```

Acceptance criterion:

- Given a valid class and required fields, when `create` is run, then a new
  object is saved and its id is printed.
- Given an invalid class, when `create` is run, then an error message is shown
  and no object is saved.

### show

Displays one object by class and id.

Expected form:

```text
show Task <task_id>
```

Acceptance criterion:

- Given an existing object id, when `show` is run, then the object details are
  printed.
- Given a missing id, when `show` is run, then a not-found message is printed.

### update

Updates attributes on an object.

Expected form:

```text
update Task <task_id> status in_progress
```

Acceptance criterion:

- Given an existing object and valid attribute, when `update` is run, then the
  attribute changes, `updated_at` changes, and the change is persisted.
- Given an invalid object id, when `update` is run, then no object changes.

### destroy

Deletes one object by class and id.

Expected form:

```text
destroy Project <project_id>
```

Acceptance criterion:

- Given an existing object id, when `destroy` is run, then the object is removed
  from storage.
- Given a missing id, when `destroy` is run, then a not-found message is shown.

### all

Lists all objects, or all objects of a specific class.

Expected forms:

```text
all
all Task
all Project
```

Acceptance criterion:

- Given stored objects, when `all` is run, then every object is printed.
- Given a class name, when `all <class>` is run, then only objects of that class
  are printed.

### complete

Advances a task's status.

Status progression:

```text
todo -> in_progress -> done
```

Expected form:

```text
complete <task_id>
```

Acceptance criterion:

- Given a task with status `todo`, when `complete <task_id>` is run, then the
  status becomes `in_progress`.
- Given a task with status `in_progress`, when `complete <task_id>` is run, then
  the status becomes `done`.
- Given a task with status `done`, when `complete <task_id>` is run, then the
  status remains `done`.

### assign

Links a task to a project.

Expected form:

```text
assign <task_id> <project_id>
```

Acceptance criterion:

- Given an existing task and project, when `assign` is run, then the task's
  `project_id` is set to the project id and persisted.
- Given a missing task or project, when `assign` is run, then no assignment is
  saved and an error message is printed.

### overdue

Lists tasks past their `due_date` that are not done.

Expected form:

```text
overdue
```

Acceptance criterion:

- Given a task with a due date before today and status other than `done`, when
  `overdue` is run, then the task is listed.
- Given a task with status `done`, when `overdue` is run, then the task is not
  listed even if its due date is in the past.

### summary

Shows task counts by status and priority.

Expected form:

```text
summary
```

Acceptance criterion:

- Given stored tasks, when `summary` is run, then counts are printed for
  `todo`, `in_progress`, and `done`.
- Given stored tasks, when `summary` is run, then counts are printed for
  `low`, `medium`, and `high` priorities.
- Given no tasks, when `summary` is run, then zero counts are shown instead of
  crashing.

## Error Handling

The console should avoid crashing on bad input. Missing class names, missing ids,
unknown attributes, invalid statuses, invalid priorities, and invalid dates
should produce readable error messages.

## Definition of Done

TaskFlow is done when:

- The console starts from `python3 console.py`.
- Projects and Tasks can be created, shown, updated, destroyed, and listed.
- Domain commands `complete`, `assign`, `overdue`, and `summary` work.
- Data persists to `taskflow.json` across console restarts.
- Unit tests cover models, storage, and console commands.
