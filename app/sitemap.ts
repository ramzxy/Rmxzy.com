import type { MetadataRoute } from "next";
import { getAllPostSummaries } from "../lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPostSummaries();
  const latestUpdate = posts[0]
    ? new Date(posts[0].updatedAt ?? posts[0].publishedAt)
    : new Date("2024-01-01T00:00:00.000Z");

  return [
    {
      url: "https://rmxzy.com",
      lastModified: latestUpdate,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: "https://rmxzy.com/blog",
      lastModified: latestUpdate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: "https://rmxzy.com/privacy",
      lastModified: new Date("2026-08-29T00:00:00.000Z"),
      changeFrequency: "yearly",
      priority: 0.2,
    },
    ...posts.map((post) => ({
      url: `https://rmxzy.com/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
