import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ActivityFeed from "../components/ActivityFeed";
import ErrorBoundary from "../components/ErrorBoundary";
import NotificationCenter from "../components/NotificationCenter";
import UserPresence from "../components/UserPresence";
import { useAuth } from "../context/AuthContext";
import useWebSocket from "../hooks/useWebSocket";
import { useDashboardStore } from "../store/dashboardStore";
import { addNotification } from "../store/notificationSlice";

function initialTheme() {
  return localStorage.getItem("theme") || "light";
}

function DashboardPage() {
  const [theme, setTheme] = useState(initialTheme);
  const { user, logout } = useAuth();
  const { status, messages, sendMessage, readyState } = useWebSocket(
    "ws://localhost:8080",
  );
  const addActivity = useDashboardStore((state) => state.addActivity);
  const setConnectionStatus = useDashboardStore(
    (state) => state.setConnectionStatus,
  );
  const dispatch = useDispatch();
  const notificationCount = useSelector((state) => state.notifications.length);
  const handledMessages = useRef(0);

  useEffect(() => {
    const darkMode = theme === "dark";
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    setConnectionStatus(status);
  }, [setConnectionStatus, status]);

  useEffect(() => {
    if (notificationCount === 0) {
      dispatch(addNotification({
        type: "success",
        message: `Welcome back, ${user.name}.`,
      }));
    }
  }, [dispatch, notificationCount, user.name]);

  useEffect(() => {
    const unhandled = messages.slice(handledMessages.current);
    unhandled.forEach((message) => {
      addActivity({
        id: message.id,
        message: message.message || "Shared a real-time update",
        user: message.user || "Live workspace",
        time: message.time || "Just now",
        status: message.status || "info",
      });
    });
    handledMessages.current = messages.length;
  }, [addActivity, messages]);

  function addDemoUpdate() {
    const update = {
      message: "created a locally simulated dashboard update",
      user: user.name,
      status: "info",
    };
    const sent = sendMessage(update);
    if (!sent) {
      addActivity(update);
      dispatch(addNotification({
        message: "Live service unavailable; update added locally.",
        type: "warning",
      }));
    }
  }

  return (
    <div className="min-h-screen bg-canvas transition-colors duration-300 dark:bg-night">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-night/90">
        <nav className="mx-auto flex min-h-18 max-w-7xl items-center justify-between gap-5 px-5 sm:px-8" aria-label="Dashboard navigation">
          <a className="flex items-center gap-2 font-black text-ink dark:text-white" href="#main-content"><span className="grid size-9 place-items-center rounded-xl bg-brand text-white">P</span>PulseBoard</a>
          <div className="hidden items-center gap-6 text-sm font-bold text-muted sm:flex dark:text-white/55"><a className="hover:text-brand" href="#activity">Activity</a><a className="hover:text-brand" href="#team">Team</a><a className="hover:text-brand" href="#notifications">Notifications</a></div>
          <div className="flex items-center gap-2">
            <button className="grid size-10 place-items-center rounded-full border border-black/10 bg-white transition hover:-translate-y-0.5 dark:border-white/15 dark:bg-panel" type="button" aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`} onClick={() => setTheme((current) => current === "dark" ? "light" : "dark")}>◐</button>
            <span className="hidden text-sm font-bold md:inline">{user.name}</span>
            <button className="rounded-xl bg-ink px-4 py-2 text-sm font-bold text-white transition hover:bg-brand dark:bg-brand" type="button" onClick={logout}>Log out</button>
          </div>
        </nav>
      </header>

      <main id="main-content" className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12">
        <section className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><p className="text-sm font-black uppercase tracking-[0.18em] text-brand">Team workspace</p><h1 className="mt-2 text-4xl font-black tracking-tight sm:text-5xl">Good work moves together.</h1><p className="mt-3 max-w-2xl text-muted dark:text-white/55">Follow decisions, activity, and the people shaping today’s progress.</p></div>
          <button className="rounded-xl bg-brand px-5 py-3 font-bold text-white shadow-lg shadow-brand/25 transition hover:-translate-y-1" type="button" onClick={addDemoUpdate}>Add demo update</button>
        </section>

        <section className="mt-8 rounded-2xl border border-black/5 bg-white px-5 py-4 dark:border-white/10 dark:bg-panel" aria-live="polite">
          {status === "connecting" && <p className="flex items-center gap-3 text-sm font-bold"><span className="size-4 animate-spin rounded-full border-2 border-brand border-r-transparent" aria-hidden="true"></span>Connecting to live updates…</p>}
          {status === "open" && <p className="text-sm font-bold text-emerald-600">Live updates connected · readyState {readyState}</p>}
          {(status === "error" || status === "closed") && <p className="text-sm font-bold text-amber-700 dark:text-amber-300">Live service is unavailable. Local dashboard features remain active while reconnection continues.</p>}
        </section>

        <div className="mt-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_18rem] lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div id="activity">
            <ErrorBoundary><ActivityFeed /></ErrorBoundary>
          </div>
          <div id="team">
            <ErrorBoundary><UserPresence /></ErrorBoundary>
          </div>
        </div>

        <div id="notifications" className="mt-8 max-w-2xl">
          <ErrorBoundary><NotificationCenter /></ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
