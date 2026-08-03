# Task Management API Usage Guide

## Introduction

The Task Management API is a REST service for creating, listing, retrieving,
updating, and deleting task resources. Tasks carry a title, optional
description, workflow status, and priority.

## Base URL

Local development uses `http://localhost:8000`. Paths below are relative to
that base URL.

## Authentication

No authentication is required for version 1. Deployments should add an
authentication layer before exposing private task data.

## Create a task

### cURL

```bash
curl -X POST http://localhost:8000/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Ship release","description":"Publish v1","priority":"high"}'
```

### Python

```python
import requests

response = requests.post(
    "http://localhost:8000/tasks",
    json={"title": "Ship release", "description": "Publish v1", "priority": "high"},
)
response.raise_for_status()
print(response.json())
```

### JavaScript

```javascript
const response = await fetch("http://localhost:8000/tasks", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ title: "Ship release", description: "Publish v1", priority: "high" }),
});
console.log(await response.json());
```

## List tasks

Use optional `status` and `priority` query parameters to filter results.

### cURL

```bash
curl "http://localhost:8000/tasks?status=pending&priority=high"
```

### Python

```python
import requests

response = requests.get(
    "http://localhost:8000/tasks",
    params={"status": "pending", "priority": "high"},
)
print(response.json())
```

### JavaScript

```javascript
const query = new URLSearchParams({ status: "pending", priority: "high" });
const response = await fetch(`http://localhost:8000/tasks?${query}`);
console.log(await response.json());
```

## Get a task

### cURL

```bash
curl http://localhost:8000/tasks/1
```

### Python

```python
import requests

response = requests.get("http://localhost:8000/tasks/1")
response.raise_for_status()
print(response.json())
```

### JavaScript

```javascript
const response = await fetch("http://localhost:8000/tasks/1");
if (!response.ok) throw new Error(`Request failed: ${response.status}`);
console.log(await response.json());
```

## Update a task

Use `PUT` with all editable fields for replacement, or `PATCH` with only the
fields that should change.

### cURL

```bash
curl -X PATCH http://localhost:8000/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"completed"}'
```

### Python

```python
import requests

response = requests.patch(
    "http://localhost:8000/tasks/1",
    json={"status": "completed"},
)
response.raise_for_status()
print(response.json())
```

### JavaScript

```javascript
const response = await fetch("http://localhost:8000/tasks/1", {
  method: "PATCH",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ status: "completed" }),
});
console.log(await response.json());
```

## Delete a task

### cURL

```bash
curl -i -X DELETE http://localhost:8000/tasks/1
```

### Python

```python
import requests

response = requests.delete("http://localhost:8000/tasks/1")
assert response.status_code == 204
```

### JavaScript

```javascript
const response = await fetch("http://localhost:8000/tasks/1", { method: "DELETE" });
if (response.status !== 204) throw new Error("Task was not deleted");
```

## Error Handling

Missing tasks return HTTP `404` with a stable machine-readable response:

```json
{
  "detail": "Task 999 not found",
  "error_code": "TASK_NOT_FOUND",
  "status_code": 404
}
```

Invalid request bodies return `422` with `error_code` set to
`VALIDATION_ERROR` and an `errors` array. Clients should branch on the status
and `error_code`, not parse the human-readable detail.

## Rate Limiting

Version 1 does not enforce rate limits. Production deployments should place a
gateway or application limiter in front of the API and communicate limit,
remaining, and reset values through standard response headers.
