import "server-only";

import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "content", "posts");

export type TocItem = {
  id: string;
  text: string;
  depth: number;
};

export type BlogPostSummary = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  tags: string[];
  categories: string[];
  thumbnail?: string;
  accent: string;
  readingTime: number;
  wordCount: number;
  searchText: string;
};

export type BlogPost = BlogPostSummary & {
  author: string;
  keywords: string[];
  content: string;
  toc: TocItem[];
};

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(String).map((item) => item.trim()).filter(Boolean);
  }

  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }

  return [];
}

function toIsoDate(value: unknown): string {
  const date = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid blog post date: ${String(value)}`);
  }
  return date.toISOString();
}

function slugFromFilename(filename: string): string {
  return path.basename(filename, path.extname(filename)).replace(/\./g, "-").toLowerCase();
}

function textFromMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[#>*_`~|\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  const headings: TocItem[] = [];
  let insideFence = false;

  for (const line of markdown.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      insideFence = !insideFence;
      continue;
    }
    if (insideFence) continue;

    const match = /^(#{1,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const text = match[2]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[*_`~]/g, "")
      .trim();

    headings.push({
      id: slugger.slug(text),
      text,
      depth: match[1].length,
    });
  }

  return headings;
}

function readPost(filename: string): BlogPost {
  const source = fs.readFileSync(path.join(postsDirectory, filename), "utf8");
  const { data, content } = matter(source);
  const title = String(data.title ?? "").trim();
  const description = String(data.description ?? "").trim();

  if (!title || !description || !data.date) {
    throw new Error(`${filename} is missing a title, description, or date`);
  }

  const plainText = textFromMarkdown(content);
  const wordCount = plainText ? plainText.split(/\s+/).length : 0;
  const tags = toStringArray(data.tags);
  const categories = toStringArray(data.categories);

  return {
    slug: slugFromFilename(filename),
    title,
    description,
    publishedAt: toIsoDate(data.date),
    updatedAt: data.updated ? toIsoDate(data.updated) : undefined,
    author: String(data.author ?? "Ilia Mirzaali"),
    tags,
    categories,
    thumbnail: data.thumbnail ? String(data.thumbnail) : undefined,
    accent: String(data.accent ?? "#c65a38"),
    keywords: toStringArray(data.keywords),
    readingTime: Math.max(1, Math.ceil(wordCount / 220)),
    wordCount,
    searchText: [title, description, plainText, ...tags, ...categories]
      .join(" ")
      .toLocaleLowerCase(),
    content,
    toc: extractToc(content),
  };
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) return [];

  return fs
    .readdirSync(postsDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .map(readPost)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getAllPostSummaries(): BlogPostSummary[] {
  return getAllPosts().map(({ author, content, keywords, toc, ...summary }) => summary);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug.toLowerCase());
}

export function getAdjacentPosts(slug: string): {
  newer?: BlogPostSummary;
  older?: BlogPostSummary;
} {
  const posts = getAllPostSummaries();
  const index = posts.findIndex((post) => post.slug === slug);

  return {
    newer: index > 0 ? posts[index - 1] : undefined,
    older: index >= 0 && index < posts.length - 1 ? posts[index + 1] : undefined,
  };
}

export function formatPostDate(date: string): string {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}
