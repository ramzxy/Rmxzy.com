"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import type { BlogPostSummary } from "../../../lib/blog";

type Props = {
  posts: BlogPostSummary[];
};

function shortDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function BlogExplorer({ posts }: Props) {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("all");

  useEffect(() => {
    const requestedTopic = new URLSearchParams(window.location.search).get("topic");
    if (requestedTopic) setTopic(requestedTopic);
  }, []);

  const topics = useMemo(() => {
    const counts = new Map<string, number>();
    posts.forEach((post) => {
      post.categories.forEach((item) => {
        counts.set(item, (counts.get(item) ?? 0) + 1);
      });
    });
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, 8)
      .map(([name]) => name);
  }, [posts]);

  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return posts.filter((post) => {
      const matchesQuery = !normalizedQuery || post.searchText.includes(normalizedQuery);
      const matchesTopic =
        topic === "all" || post.categories.includes(topic);
      return matchesQuery && matchesTopic;
    });
  }, [posts, query, topic]);

  const clearFilters = () => {
    setQuery("");
    setTopic("all");
    window.history.replaceState({}, "", "/blog");
  };

  const selectTopic = (nextTopic: string) => {
    setTopic(nextTopic);
    const url = new URL(window.location.href);
    if (nextTopic === "all") url.searchParams.delete("topic");
    else url.searchParams.set("topic", nextTopic);
    window.history.replaceState({}, "", `${url.pathname}${url.search}`);
  };

  const visibleTopics =
    topic !== "all" && !topics.includes(topic) ? [topic, ...topics] : topics;

  return (
    <section aria-labelledby="all-writing-title" className="blog-explorer">
      <div className="blog-explorer__heading">
        <div>
          <span className="eyebrow">// archive</span>
          <h2 id="all-writing-title">All writing</h2>
          <p className="blog-explorer__order">newest first · {filtered.length} entries</p>
        </div>
        <label className="blog-search">
          <span className="sr-only">Search posts</span>
          <span aria-hidden>$</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="search titles, topics, or text"
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
              clear
            </button>
          )}
        </label>
      </div>

      <div className="topic-filter" aria-label="Filter by topic">
        {["all", ...visibleTopics].map((item) => (
          <button
            key={item}
            type="button"
            className={topic === item ? "is-active" : undefined}
            onClick={() => selectTopic(item)}
            aria-pressed={topic === item}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="blog-results" aria-live="polite">
        {filtered.length === 0 ? (
          <div className="blog-empty">
            <span className="font-mono">0 matches</span>
            <h3>Nothing in the notebook fits that search.</h3>
            <p>Try a broader term, or return to the complete archive.</p>
            <button type="button" onClick={clearFilters}>show everything</button>
          </div>
        ) : (
          <div className="post-stream">
            {filtered.map((post, index) => (
              <article
                className="post-row"
                key={post.slug}
                style={{ "--post-accent": post.accent } as CSSProperties}
              >
                <Link href={`/blog/${post.slug}`} className="post-row__link">
                  <span className="post-row__index">{String(index + 1).padStart(2, "0")}</span>
                  {post.thumbnail && (
                    <div className="post-row__image">
                      <Image
                        src={post.thumbnail}
                        alt=""
                        fill
                        quality={95}
                        sizes="(max-width: 640px) calc(100vw - 4rem), (max-width: 1100px) 32vw, 320px"
                      />
                    </div>
                  )}
                  <div className="post-row__content">
                    <div className="post-row__meta">
                      <time dateTime={post.publishedAt}>{shortDate(post.publishedAt)}</time>
                      <span>{post.readingTime} min read</span>
                    </div>
                    <h3>{post.title}</h3>
                    <p>{post.description}</p>
                    <div className="post-row__topics">
                      {post.categories.map((item) => <span key={item}>{item}</span>)}
                    </div>
                  </div>
                  <span className="post-row__arrow" aria-hidden>↗</span>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
