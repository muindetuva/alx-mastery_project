import { useDashboardStore } from "../store/dashboardStore";

const statusStyles = {
  complete: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  review: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  info: "bg-brand/10 text-brand dark:bg-brand/20 dark:text-indigo-200",
};

function ActivityFeed() {
  const activities = useDashboardStore((state) => state.activities);
  const clearActivities = useDashboardStore((state) => state.clearActivities);

  return (
    <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-lg shadow-black/5 dark:border-white/10 dark:bg-panel">
      <div className="flex items-center justify-between gap-4">
        <div><p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Live stream</p><h2 className="mt-1 text-2xl font-black">Activity feed</h2></div>
        <button className="rounded-lg px-3 py-2 text-sm font-bold text-muted transition hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/10" type="button" onClick={clearActivities}>Clear</button>
      </div>
      {activities.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-canvas p-5 text-muted dark:bg-night dark:text-white/55">No activity yet. New updates will appear here.</p>
      ) : (
        <ul className="mt-6 divide-y divide-black/5 dark:divide-white/10">
          {activities.map((activity) => (
            <li className="flex gap-4 py-4 first:pt-0 last:pb-0" key={activity.id}>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-brand font-black text-white" aria-hidden="true">{activity.user.slice(0, 1).toUpperCase()}</span>
              <div className="min-w-0 flex-1"><p><strong>{activity.user}</strong> {activity.message}</p><div className="mt-2 flex items-center gap-3 text-xs text-muted dark:text-white/50"><time>{activity.time}</time><span className={`rounded-full px-2 py-1 font-bold ${statusStyles[activity.status] || statusStyles.info}`}>{activity.status}</span></div></div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default ActivityFeed;
