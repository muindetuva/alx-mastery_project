# Gap Analysis

## Timer Behaviour

- What happens when the timer reaches zero?
  - The app should log the completed focus session, play or show a completion cue, and prompt the user to start a break.
- Can the user pause mid-session?
  - Yes. Pause and resume should be part of the MVP because interruptions are common.
- Can the user reset a session?
  - Yes. Reset should stop the timer and return it to the default focus duration.
- Does reset log the session?
  - No. Reset or abandon should not count as completed focus time.

## Browser and Persistence

- What happens if the browser refreshes mid-session?
  - Tasks and completed sessions must persist. For the MVP, an active timer can restore its last known state from local storage.
- What if the browser closes for longer than the remaining timer duration?
  - The app should calculate elapsed real time from a saved timestamp. If the session should have ended, it should show the completed state when reopened.
- Where is data stored?
  - For MVP, localStorage is enough. Server sync can be a future feature.

## Task Handling

- Can a timer start without a task?
  - The app should require either a selected task or a typed task name before starting a focus session.
- What happens if a task is deleted after sessions were logged?
  - Logged sessions should keep the task name as text so history remains readable.
- Can multiple sessions be logged for the same task?
  - Yes. Long tasks may require multiple focus blocks.

## Break Handling

- Are break durations configurable?
  - Not in MVP. Use a default short break duration first, then add configurable durations in V2.
- Can a user skip a break?
  - Yes. The break prompt should allow start break or skip.
- Are breaks logged?
  - MVP should focus on work sessions only. Break logs can be future work.

## Session Log and Insights

- Can a session be abandoned, and is it logged?
  - A user can abandon/reset a session, but it should not be logged as completed.
- What counts as completed?
  - A session counts only when the focus timer reaches zero.
- How are daily totals calculated?
  - Use the completion date of each logged session.
- What if localStorage is full or unavailable?
  - Show a friendly error and keep the current session in memory where possible.

## UX and Edge Cases

- What if the user starts a timer and then edits the selected task?
  - The session should keep the task name captured at start time.
- What if the user tries to start another timer while one is running?
  - Disable the start button or require stopping the current session first.
- What if the page is opened in two tabs?
  - MVP can warn that multi-tab timer state may conflict. Robust sync is future work.
- Does the app need login?
  - No. MVP is single-device and local-first.
