import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const contentDirectory = path.join(process.cwd(), "content");

export type ArticleSummary = {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  coverImage: string;
  tags: string[];
};

export type Article = ArticleSummary & {
  contentHtml: string;
};

type ArticleFrontmatter = Omit<ArticleSummary, "slug">;

function readArticleFile(fileName: string) {
  const slug = fileName.replace(/\.md$/, "");
  const fileContents = fs.readFileSync(path.join(contentDirectory, fileName), "utf8");
  const { data, content } = matter(fileContents);
  const frontmatter = data as ArticleFrontmatter;

  return { slug, frontmatter, content };
}

export function getAllArticles(): ArticleSummary[] {
  return fs
    .readdirSync(contentDirectory)
    .filter((fileName) => /^article-.*\.md$/.test(fileName))
    .map((fileName) => {
      const { slug, frontmatter } = readArticleFile(fileName);
      return { slug, ...frontmatter };
    })
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, "");
  const filePath = path.join(contentDirectory, `${safeSlug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const { frontmatter, content } = readArticleFile(`${safeSlug}.md`);
  const processed = await remark().use(html).process(content);
  return { slug: safeSlug, ...frontmatter, contentHtml: processed.toString() };
}

export const getBySlug = getArticleBySlug;
