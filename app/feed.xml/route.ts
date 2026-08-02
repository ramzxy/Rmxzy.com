import { getAllPosts } from "../../lib/blog";

export const dynamic = "force-static";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const posts = getAllPosts();
  const items = posts.map((post) => {
    const url = `https://rmxzy.com/blog/${post.slug}`;
    return `
      <item>
        <title>${escapeXml(post.title)}</title>
        <link>${url}</link>
        <guid isPermaLink="true">${url}</guid>
        <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
        <description>${escapeXml(post.description)}</description>
        ${post.categories.map((category) => `<category>${escapeXml(category)}</category>`).join("")}
      </item>`;
  }).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Ilia Mirzaali — rmxzy writing</title>
        <link>https://rmxzy.com/blog</link>
        <atom:link href="https://rmxzy.com/feed.xml" rel="self" type="application/rss+xml" />
        <description>Notes on systems, security, and software by Ilia Mirzaali.</description>
        <language>en</language>
        <lastBuildDate>${new Date(posts[0]?.publishedAt ?? Date.now()).toUTCString()}</lastBuildDate>
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

