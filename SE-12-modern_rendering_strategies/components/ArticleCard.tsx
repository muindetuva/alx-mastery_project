import Image from "next/image";
import Link from "next/link";
import type { ArticleSummary } from "@/lib/articles";

type ArticleCardProps = {
  article: ArticleSummary;
  priority?: boolean;
};

export default function ArticleCard({ article, priority = false }: ArticleCardProps) {
  return (
    <article className="group overflow-hidden rounded-3xl border border-black/5 bg-white shadow-lg shadow-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link className="block overflow-hidden" href={`/articles/${article.slug}`}>
        <Image
          className="aspect-[16/9] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          src={article.coverImage}
          alt=""
          width={1672}
          height={941}
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </Link>
      <div className="p-6">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => <span className="rounded-full bg-brand/8 px-3 py-1 text-xs font-bold text-brand" key={tag}>{tag}</span>)}
        </div>
        <h2 className="mt-4 text-2xl font-black tracking-tight"><Link className="hover:text-brand" href={`/articles/${article.slug}`}>{article.title}</Link></h2>
        <p className="mt-3 text-muted">{article.excerpt}</p>
        <p className="mt-5 text-sm font-semibold text-muted"><time dateTime={article.date}>{new Date(article.date).toLocaleDateString("en", { dateStyle: "long" })}</time> · {article.author}</p>
      </div>
    </article>
  );
}
