import type { MetadataRoute } from "next";
import { getAllPostSummaries } from "../lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = getAllPostSummaries();

  return [
    {
      url: "https://rmxzy.com",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: "https://rmxzy.com/blog",
      lastModified: posts[0] ? new Date(posts[0].publishedAt) : now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `https://rmxzy.com/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
