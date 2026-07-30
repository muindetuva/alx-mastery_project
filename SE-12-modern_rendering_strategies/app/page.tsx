import type { Metadata } from "next";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Modern rendering, clearly explained",
  description: "Explore practical guidance for static generation, server rendering, incremental regeneration, and content performance.",
};

export default function HomePage() {
  const articles = getAllArticles().slice(0, 3);

  return (
    <main>
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute -left-24 top-10 size-80 rounded-full bg-accent/15 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-20 top-20 size-96 rounded-full bg-brand/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          <p className="font-black uppercase tracking-[0.2em] text-brand">Modern rendering, useful decisions</p>
          <h1 className="mt-5 max-w-5xl text-5xl font-black tracking-[-0.045em] sm:text-7xl">Build content experiences that stay fast as they grow.</h1>
          <p className="mt-7 max-w-2xl text-xl leading-8 text-muted">Signal turns SSG, SSR, ISR, metadata, and media optimization into practical publishing patterns.</p>
          <div className="mt-9 flex flex-wrap gap-3"><Link className="rounded-full bg-brand px-6 py-3 font-bold text-white shadow-xl shadow-brand/25" href="/articles">Read the articles</Link><Link className="rounded-full border border-black/15 bg-white px-6 py-3 font-bold" href="/live-ticker">Open live ticker</Link></div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8" aria-labelledby="latest-title">
        <div className="flex items-end justify-between gap-5"><div><p className="font-black uppercase tracking-[0.18em] text-brand">Latest thinking</p><h2 id="latest-title" className="mt-2 text-4xl font-black tracking-tight">Recent articles</h2></div><Link className="font-bold text-brand" href="/articles">View all articles →</Link></div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{articles.map((article, index) => <ArticleCard article={article} priority={index === 0} key={article.slug} />)}</div>
      </section>
    </main>
  );
}
