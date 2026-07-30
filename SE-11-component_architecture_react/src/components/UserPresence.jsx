const users = [
  { id: 1, name: "Amara Okafor", role: "Product", initials: "AO" },
  { id: 2, name: "Kwesi Boateng", role: "Design", initials: "KB" },
  { id: 3, name: "Zoe Lin", role: "Engineering", initials: "ZL" },
  { id: 4, name: "Roberto Silva", role: "Research", initials: "RS" },
];

function UserPresence() {
  return (
    <aside className="hidden rounded-3xl border border-black/5 bg-white p-5 shadow-lg shadow-black/5 md:block dark:border-white/10 dark:bg-panel" aria-labelledby="presence-title">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-brand">Online now</p>
      <h2 id="presence-title" className="mt-1 text-xl font-black">Team presence</h2>
      <ul className="mt-5 space-y-2">
        {users.map((user) => (
          <li className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-canvas dark:hover:bg-white/5" key={user.id}>
            <span className="relative grid size-10 place-items-center rounded-full bg-ink text-xs font-black text-white dark:bg-brand">{user.initials}<span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-emerald-500 dark:border-panel" aria-label="Online"></span></span>
            <span><strong className="block text-sm">{user.name}</strong><span className="text-xs text-muted dark:text-white/50">{user.role}</span></span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default UserPresence;
