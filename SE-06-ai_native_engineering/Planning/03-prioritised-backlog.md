# Prioritised Backlog

## MVP

### 25-minute focus timer

- Build a countdown timer that starts at 25:00.
- Acceptance criterion: Given the timer is idle, when the user clicks Start, then the countdown begins from 25:00.

### Pause and resume

- Allow the user to pause and continue the active timer.
- Acceptance criterion: Given the timer is running, when the user clicks Pause, then the displayed time stops changing until Resume is clicked.

### Reset or abandon session

- Allow the user to stop a session without logging it.
- Acceptance criterion: Given the timer is running, when the user clicks Reset, then the timer returns to 25:00 and no session is added to the log.

### Task creation and selection

- Let users add tasks and choose one for the current session.
- Acceptance criterion: Given a user adds a task, when they select it and start the timer, then the active session displays that task name.

### Completion flow and break prompt

- When the timer reaches zero, log the session and prompt for a break.
- Acceptance criterion: Given the timer is running, when it reaches 00:00, then a break prompt appears automatically and the completed session is saved.

### Session history

- Store completed sessions with task name, duration, and completion time.
- Acceptance criterion: Given a session completes, when the user views the history, then the session appears with task name, 25-minute duration, and timestamp.

### Local persistence

- Persist tasks and session history across browser refreshes.
- Acceptance criterion: Given tasks and completed sessions exist, when the browser refreshes, then the same tasks and sessions are still visible.

### Basic insights

- Show total focused time and daily total.
- Acceptance criterion: Given completed sessions exist, when the insights section loads, then total focus time equals the sum of completed session durations.

## V2

- Configurable focus and break durations.
- Task-level statistics showing which tasks took the longest.
- Daily pattern chart grouped by date.
- Sound notification when a session or break ends.
- Export session history as CSV or JSON.
- Edit task names.
- Filter session history by date or task.

## Future

- Account login and cloud sync.
- Multi-device session continuity.
- Calendar integration.
- Team or shared focus rooms.
- Browser notification permissions.
- Offline-first service worker.
- AI-generated focus summaries from session history.
