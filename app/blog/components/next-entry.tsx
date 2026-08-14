import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { BlogPostSummary } from "../../../lib/blog";

type Props = {
  post: BlogPostSummary;
  direction: "older" | "newer";
};

function shortDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function NextEntry({ post, direction }: Props) {
  return (
    <aside
      className="next-note"
      style={{ "--next-accent": post.accent } as CSSProperties}
      aria-labelledby="next-note-title"
    >
      <Link href={`/blog/${post.slug}`} className="next-note__link">
        <div className="next-note__media">
          {post.thumbnail && (
            <Image
              src={post.thumbnail}
              alt=""
              fill
              quality={82}
              sizes="(max-width: 720px) 38vw, 25rem"
            />
          )}
        </div>
        <div className="next-note__copy">
          <div className="next-note__meta">
            <span>{direction === "older" ? "read next" : "newer note"}</span>
            <time dateTime={post.publishedAt}>{shortDate(post.publishedAt)}</time>
          </div>
          <h2 id="next-note-title">{post.title}</h2>
          <p>{post.description}</p>
        </div>
        <span className="next-note__arrow" aria-hidden>↗</span>
      </Link>
    </aside>
  );
}
