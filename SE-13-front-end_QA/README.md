# SE-13 — Real-Time Incident Intelligence Platform

Sentinel is a fully local incident-response dashboard built with Vite, React,
strict TypeScript, Zod, TanStack Query, React Router, and Playwright.

## Capabilities

- Runtime-validated incident, user, token, REST, and stream payloads.
- Protected authentication restored from local storage.
- TanStack Query REST cache with timed refresh and focus refresh.
- WebSocket manager with subscribers, lifecycle cleanup, safe parsing, and
  capped exponential reconnection.
- Local schema-valid weighted incident stream: 10% critical, 20% high,
  40% medium, and 30% low.
- Optimistic acknowledge and resolve actions with snapshots and rollback.
- Severity and status filters with a responsive incident dashboard.
- Deterministic, mock-backed Playwright authentication and dashboard tests.

## Local API and stream

`installMockApi()` intercepts only same-origin `/api/*` calls. It implements
login, incident listing/detail, acknowledge, and resolve without a backend.
Other requests fall through to the browser's native `fetch` implementation.

`WebSocketManager` supports real WebSocket URLs and uses `mock://incidents` in
this curriculum build. The **Start Mock Stream** control sends generated,
Zod-validated incidents through the same subscriber path used for socket
messages. No external service is required.

## Run locally

```sh
npm install
npm run dev
```

Use any valid email and a password of six or more characters.

## Verification

```sh
npm run typecheck
npm run build
npm run test:e2e:list
npm run test:e2e
```

Playwright execution requires its local Chromium browser binary. Test
discovery and TypeScript compilation can still run when that optional binary
is not installed.

## Project structure

- `src/types` — Zod schemas and inferred domain types.
- `src/services` — validated API client and WebSocket manager.
- `src/hooks` — query, socket, and optimistic mutation hooks.
- `src/mocks` — local fetch handlers and weighted incident generator.
- `src/context` — authentication provider and hook.
- `src/components` and `src/pages` — accessible interface composition.
- `e2e` — authentication and dashboard Playwright scenarios.
- `ai-prompt.md` — exact AI prompts and reviewed customizations.
