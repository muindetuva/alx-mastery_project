# SE-11 — Component Architecture with React

PulseBoard is a resilient real-time activity dashboard built to demonstrate
modern React component architecture.

## Architecture

- Functional React components, with a class component only for
  `ErrorBoundary`.
- `useWebSocket` custom hook with lifecycle cleanup, JSON parsing, connection
  status, stable sending, and exponential-backoff reconnection.
- Authentication state shared through Context and persisted in local storage.
- Protected routes implemented with React Router.
- Activity state managed with Zustand.
- Notification state managed with Redux Toolkit and React Redux.
- Tailwind CSS v4 integrated through the Vite plugin.

## Run locally

```sh
npm install
npm run dev
```

Build the production bundle with `npm run build`.

The dashboard attempts `ws://localhost:8080` for live messages. No external
service is required: while the socket is unavailable, the interface reports
the state, retries safely, and provides a local simulated-update fallback.

## Project structure

```text
src/
├── components/
├── context/
├── hooks/
├── pages/
└── store/
```

`ai-prompt.md` documents all AI-assisted design and implementation review.
