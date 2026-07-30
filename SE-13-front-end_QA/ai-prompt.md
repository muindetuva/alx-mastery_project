# AI Prompt and Review Log

## Domain and Zod schemas

**Tool:** ChatGPT

**Exact prompt:**

> Design strict TypeScript and Zod schemas for an incident platform. Incident
> must have UUID id, title, description, severity critical/high/medium/low,
> status open/acknowledged/resolved, and ISO datetime createdAt/updatedAt. Also
> model User and AuthTokens. Export inferred types, a list schema, and an auth
> response schema. Avoid `any` and make runtime validation match compile-time
> types.

**Output summary:** ChatGPT proposed shared enum schemas, object schemas for
each domain type, `z.array` for lists, and `z.infer` exports.

**Changes after review:**

1. Required UUID validation for both incident and user IDs.
2. Used `datetime()` rather than a loose string for both timestamps.
3. Added minimum useful lengths for title and description.
4. Added a combined auth response schema so the login boundary is parsed once.

## Mock incident content and API

**Tool:** ChatGPT

**Exact prompt:**

> Propose realistic mock incidents and a local browser fetch layer for an
> incident dashboard. Severity generation must be weighted 10% critical, 20%
> high, 40% medium, and 30% low. Implement GET list/detail, POST acknowledge,
> POST resolve, and login without a real backend. Every generated or returned
> incident must pass the same Zod schema used by the UI.

**Output summary:** ChatGPT suggested a threshold-based random selector, an
in-memory incident array, route matching, and JSON `Response` objects.

**Changes after review:**

1. Preserved native fetch for every request outside the `/api/` namespace.
2. Added a small deterministic delay so loading and mutation states are
   observable without making tests slow.
3. Parsed each generated and updated incident through `incidentSchema`.
4. Used stable seeded starting incidents while leaving the stream configurable.
5. Routed mock stream items through `WebSocketManager` subscribers rather than
   updating React Query through a separate shortcut.

## Playwright scenarios

**Tool:** ChatGPT

**Exact prompt:**

> Draft deterministic Playwright tests for a Vite React incident dashboard
> backed entirely by local mocks. auth.spec.ts needs exactly four scenarios:
> protected redirect, valid login, invalid login, and logout. dashboard.spec.ts
> must verify incident listing, acknowledge, resolve, severity filtering, and
> WebSocket/mock-stream status. Prefer accessible labels and roles.

**Output summary:** ChatGPT proposed shared login setup, role-based selectors,
URL assertions, card-scoped action assertions, and one status/stream test.

**Changes after review:**

1. Kept authentication at exactly four independently named scenarios.
2. Scoped status assertions to the action's ancestor article so another card
   cannot satisfy the test accidentally.
3. Asserted the deterministic initial list count before mutating it.
4. Verified every visible severity badge after filtering, not only the first.
5. Configured a local Vite web server and a single Chromium project to remove
   external dependencies and cross-browser nondeterminism from this task.

## Final review

AI supplied useful checklists and initial structures. The final cache ownership,
rollback contexts, native-fetch fallthrough, socket lifecycle, validation
boundaries, accessible selectors, local-only behavior, and all error states
were reviewed and implemented by hand.
