import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";

export const revalidate = 60;

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllArticles().map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.excerpt,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.date,
      images: [article.coverImage],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: [article.coverImage],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();
  const generatedAt = new Date().toISOString();

  return (
    <main className="pb-20">
      <article>
        <header className="mx-auto max-w-4xl px-5 py-16 sm:px-8 sm:py-24">
          <Link className="font-bold text-brand" href="/articles">← All articles</Link>
          <div className="mt-8 flex flex-wrap gap-2">{article.tags.map((tag) => <span className="rounded-full bg-brand/8 px-3 py-1 text-sm font-bold text-brand" key={tag}>{tag}</span>)}</div>
          <h1 className="mt-6 text-5xl font-black tracking-[-0.04em] sm:text-7xl">{article.title}</h1>
          <p className="mt-7 text-lg text-muted">By <strong>{article.author}</strong> · <time dateTime={article.date}>{new Date(article.date).toLocaleDateString("en", { dateStyle: "long" })}</time></p>
          <p className="mt-2 text-sm text-muted">Generated: <time dateTime={generatedAt}>{new Date(generatedAt).toLocaleString("en")}</time></p>
        </header>
        <div className="mx-auto max-w-6xl px-5 sm:px-8"><Image className="aspect-[16/9] w-full rounded-3xl object-cover shadow-2xl shadow-brand/10" src={article.coverImage} alt="" width={1672} height={941} priority sizes="(max-width: 768px) 100vw, 1152px" /></div>
        <div className="article-body mx-auto max-w-3xl px-5 py-12 sm:px-8" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
      </article>
    </main>
  );
}
