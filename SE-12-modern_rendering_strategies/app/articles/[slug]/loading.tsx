export default function ArticleLoading() {
  return (
    <main className="mx-auto max-w-4xl animate-pulse px-5 py-20 sm:px-8" aria-label="Loading article">
      <div className="h-5 w-28 rounded bg-black/10" />
      <div className="mt-10 h-16 w-full rounded-2xl bg-black/10" />
      <div className="mt-4 h-16 w-4/5 rounded-2xl bg-black/10" />
      <div className="mt-12 aspect-[16/9] rounded-3xl bg-black/10" />
      <span className="sr-only">Loading article…</span>
    </main>
  );
}
