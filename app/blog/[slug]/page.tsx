import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { ScrollProgress } from "../../components/scroll-progress";
import {
  formatPostDate,
  getAdjacentPosts,
  getAllPosts,
  getPostBySlug,
} from "../../../lib/blog";
import { CodeBlock } from "../components/code-block";
import { CopyLink } from "../components/copy-link";
import { ArticleScrollIntro } from "../components/article-scroll-intro";
import { LinkPreview } from "../components/link-preview";
import { TableOfContents } from "../components/table-of-contents";
import { ArticleReadingFrame } from "../components/article-reading-frame";
import { NextEntry } from "../components/next-entry";

type Props = {
  params: { slug: string };
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: Props): Metadata {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author, url: "https://rmxzy.com" }],
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: ["Ilia Mirzaali"],
      tags: post.tags,
      images: post.thumbnail ? [{ url: post.thumbnail, alt: post.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.thumbnail ? [post.thumbnail] : undefined,
    },
  };
}

const markdownComponents: Components = {
  a({ node, href = "", children, ...props }) {
    const external = /^https?:\/\//.test(href);
    if (external) {
      return <LinkPreview url={href}>{children}</LinkPreview>;
    }
    return <Link href={href} {...props}>{children}</Link>;
  },
  img({ node, src, alt, ...props }) {
    return <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" {...props} />;
  },
  pre({ node, children }) {
    return <CodeBlock>{children}</CodeBlock>;
  },
  table({ node, children, ...props }) {
    return <div className="article-table"><table {...props}>{children}</table></div>;
  },
};

export default function ArticlePage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const { newer, older } = getAdjacentPosts(post.slug);
  const nextPost = older ?? newer;
  const nextDirection = older ? "older" : "newer";
  const canonicalUrl = `https://rmxzy.com/blog/${post.slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.thumbnail ? `https://rmxzy.com${post.thumbnail}` : undefined,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: canonicalUrl,
    author: {
      "@type": "Person",
      name: post.author,
      url: "https://rmxzy.com",
    },
    publisher: {
      "@type": "Person",
      name: "Ilia Mirzaali",
      url: "https://rmxzy.com",
    },
    keywords: [...post.categories, ...post.tags].join(", "),
    wordCount: post.wordCount,
  };

  return (
    <main
      id="blog-content"
      className="article-page article-page--scrolled"
      style={{ "--article-accent": post.accent } as CSSProperties}
    >
      <ScrollProgress />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <article>
        <ArticleScrollIntro
          post={{
            slug: post.slug,
            title: post.title,
            description: post.description,
            publishedAt: post.publishedAt,
            readingTime: post.readingTime,
            thumbnail: post.thumbnail,
            category: post.categories[0] ?? "Writing",
          }}
        />

        <ArticleReadingFrame items={post.toc}>
          <div className="article-reading-meta">
            <div>
              <span>Written by</span>
              <strong>{post.author}</strong>
            </div>
            <div>
              <span>Published</span>
              <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
            </div>
            <div>
              <span>Reading time</span>
              <strong>{post.readingTime} minutes</strong>
            </div>
            <CopyLink />
          </div>

          <div className="article-layout">
            <div className="article-main">
              <div className="article-prose">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeSlug, rehypeHighlight]}
                  components={markdownComponents}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              <footer className="article-end">
                <div>
                  <span className="eyebrow">filed under</span>
                  <div className="article-tags">
                    {Array.from(new Set([...post.categories, ...post.tags])).map((tag) => (
                      <Link key={tag} href={`/blog?topic=${encodeURIComponent(tag)}`}>{tag}</Link>
                    ))}
                  </div>
                </div>
                <p>
                  Found something wrong or want to talk about it?{" "}
                  <a href="mailto:me@rmxzy.com">Send me a note.</a>
                </p>
              </footer>
            </div>

            <aside className="article-aside">
              <TableOfContents items={post.toc} />
            </aside>
          </div>
        </ArticleReadingFrame>
      </article>

      {nextPost && <NextEntry post={nextPost} direction={nextDirection} />}

      <nav className="article-after-links" aria-label="More writing">
        <Link href="/blog">← all writing</Link>
        {older && newer && (
          <Link href={`/blog/${newer.slug}`}>previous entry: {newer.title} →</Link>
        )}
      </nav>
    </main>
  );
}
