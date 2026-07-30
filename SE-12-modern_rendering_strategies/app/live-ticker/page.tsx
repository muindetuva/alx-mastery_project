import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";
import { getTickerData } from "@/lib/ticker";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Live performance ticker",
  description: "Request-time performance and readership signals rendered fresh on every visit.",
};

export default async function LiveTickerPage() {
  noStore();
  const data = getTickerData();

  return (
    <main className="mx-auto min-h-[70vh] max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <header className="max-w-3xl"><p className="font-black uppercase tracking-[0.18em] text-accent">SSR · no-store</p><h1 className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">Live performance ticker</h1><p className="mt-5 text-xl leading-8 text-muted">This server-rendered view resolves fresh data for every request without fetching its own API during the build.</p><p className="mt-4 text-sm font-bold">Generated at <time dateTime={data.generatedAt}>{new Date(data.generatedAt).toLocaleString("en")}</time></p></header>
      <section className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Current performance signals">{data.items.map((item) => <article className="rounded-3xl border border-black/5 bg-white p-6 shadow-lg shadow-black/5" key={item.id}><p className="font-bold text-muted">{item.label}</p><p className="mt-4 text-4xl font-black">{item.value}</p><p className={`mt-3 text-sm font-bold ${item.direction === "up" ? "text-emerald-600" : "text-brand"}`}>{item.direction === "up" ? "↑" : "↓"} {item.change}</p></article>)}</section>
    </main>
  );
}
