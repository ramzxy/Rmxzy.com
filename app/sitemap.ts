import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: "https://rmxzy.com",
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: "https://blog.rmxzy.com",
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];
}
