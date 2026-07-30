# AI Prompt and Review Log

## WebSocket hook

**Tool:** ChatGPT

**Exact prompt:**

> Design a reusable React hook named useWebSocket(url). It must expose status,
> messages, readyState, and a stable sendMessage callback; report connecting,
> open, closed, and error states; parse JSON without crashing on plain text;
> clean up sockets and timers; and reconnect with capped exponential backoff.
> Use functional React hooks and explain race conditions I should review.

**Raw direction received:** ChatGPT proposed `useState` for messages and status,
`useRef` for the socket, a `useCallback` sender, and a reconnecting `useEffect`.

**Customizations after review:**

1. Added an `active` guard so stale socket callbacks cannot update state after
   unmount or a URL change.
2. Stored the reconnection timer in a ref and clear it during cleanup.
3. Capped exponential backoff at 30 seconds instead of allowing indefinite
   delay growth.
4. Preserved non-JSON frames as `{ message, type: "raw" }` rather than dropping
   them or crashing.
5. Made `sendMessage` return a boolean so callers can provide a local fallback.

## Redux Toolkit notifications

**Tool:** ChatGPT

**Exact prompt:**

> Propose a Redux Toolkit notification slice for a React dashboard. Each
> notification needs id, type, message, and timestamp. Include add, dismiss by
> id, and clear actions. Validate type against info, success, warning, and
> error; default invalid values safely. Show how to configure the store and
> connect React Redux Provider.

**Raw direction received:** ChatGPT proposed an array state, `createSlice`, a
prepare callback for IDs, and reducers using Immer mutations.

**Customizations after review:**

1. Added a strict set of accepted types and normalized everything else to
   `info`.
2. Coerced missing or non-string messages to a safe display string.
3. Allowed deterministic IDs and timestamps to be supplied for testing while
   generating sensible defaults in normal use.
4. Kept dismissal as an explicit filter by ID and made clear return a new
   empty array.

## Error boundaries and failure states

**Tool:** ChatGPT

**Exact prompt:**

> Review a React real-time dashboard for failure isolation. Recommend an error
> boundary pattern with getDerivedStateFromError, componentDidCatch, a fallback,
> and a Try Again reset. Also list visible states needed for asynchronous socket
> work. Do not suggest one boundary around the entire app.

**Customizations after review:**

1. Wrapped activity, presence, and notification panels separately so one
   failure does not blank the dashboard.
2. Added a reset button that clears only the failed boundary state.
3. Added connecting spinner, connected state, and a combined unavailable state
   that explains the local fallback and reconnection behavior.
4. Kept asynchronous login work inside `try/catch` with an accessible error.

## Final human review

The final code uses AI as a review partner, not an unchecked generator. Hook
cleanup, data validation, accessibility, route behavior, local fallback logic,
dark-mode persistence, and state ownership were all verified and adapted by
hand before the project was saved.
