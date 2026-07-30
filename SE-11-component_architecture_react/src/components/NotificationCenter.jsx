import { useDispatch, useSelector } from "react-redux";
import {
  clearNotifications,
  dismissNotification,
} from "../store/notificationSlice";

const colors = {
  info: "border-blue-300 bg-blue-50 text-blue-950 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-100",
  success: "border-emerald-300 bg-emerald-50 text-emerald-950 dark:border-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100",
  warning: "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950/50 dark:text-amber-100",
  error: "border-red-300 bg-red-50 text-red-950 dark:border-red-900 dark:bg-red-950/50 dark:text-red-100",
};

function NotificationCenter() {
  const notifications = useSelector((state) => state.notifications);
  const dispatch = useDispatch();

  return (
    <section aria-labelledby="notifications-title">
      <div className="mb-3 flex items-center justify-between"><h2 id="notifications-title" className="text-lg font-black">Notifications</h2>{notifications.length > 0 && <button className="text-sm font-bold text-muted hover:text-brand dark:text-white/55" type="button" onClick={() => dispatch(clearNotifications())}>Clear all</button>}</div>
      <div className="grid gap-3" aria-live="polite">
        {notifications.length === 0 ? <p className="text-sm text-muted dark:text-white/50">You are all caught up.</p> : notifications.map((notification) => (
          <article className={`flex items-start justify-between gap-4 rounded-2xl border p-4 transition hover:-translate-y-0.5 ${colors[notification.type]}`} key={notification.id}>
            <div><p className="font-bold">{notification.message}</p><time className="mt-1 block text-xs opacity-70" dateTime={notification.timestamp}>{new Date(notification.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</time></div>
            <button className="grid size-8 shrink-0 place-items-center rounded-full hover:bg-black/10" type="button" aria-label={`Dismiss notification: ${notification.message}`} onClick={() => dispatch(dismissNotification(notification.id))}>×</button>
          </article>
        ))}
      </div>
    </section>
  );
}

export default NotificationCenter;
