import type { MetadataRoute } from "next";
import { getAllArticles } from "@/lib/articles";

const baseUrl = "https://signal-content.example.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const articlePages = getAllArticles().map((article) => ({
    url: `${baseUrl}/articles/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/articles`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/live-ticker`, lastModified: new Date(), changeFrequency: "always", priority: 0.6 },
    ...articlePages,
  ];
}
