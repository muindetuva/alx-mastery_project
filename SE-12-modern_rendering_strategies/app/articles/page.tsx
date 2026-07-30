import type { Metadata } from "next";
import ArticleCard from "@/components/ArticleCard";
import { getAllArticles } from "@/lib/articles";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Articles",
  description: "Browse Signal articles about SSG, SSR, ISR, server components, images, and content performance.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();
  const generatedAt = new Date().toISOString();

  return (
    <main className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
      <header className="max-w-3xl"><p className="font-black uppercase tracking-[0.18em] text-brand">Signal library</p><h1 className="mt-3 text-5xl font-black tracking-tight sm:text-6xl">Articles</h1><p className="mt-5 text-xl leading-8 text-muted">Clear architectural decisions for modern content products.</p><p className="mt-4 text-sm text-muted">Last updated: <time dateTime={generatedAt}>{new Date(generatedAt).toLocaleString("en")}</time></p></header>
      <section className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="All articles">{articles.map((article, index) => <ArticleCard article={article} priority={index === 0} key={article.slug} />)}</section>
    </main>
  );
}
