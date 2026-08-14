"use client";

import { useEffect, useState } from "react";
import styles from "./article-engagement.module.css";

const reactions = [
  { id: "signal", emoji: "📡", label: "signal boost" },
  { id: "brain", emoji: "🧠", label: "stuck with me" },
  { id: "defiant", emoji: "🖕", label: "fuck yeah" },
] as const;

type Reaction = (typeof reactions)[number]["id"];

type Metrics = {
  views: number;
  reactions: Record<Reaction, number>;
  mine: Reaction[];
};

const emptyMetrics: Metrics = {
  views: 0,
  reactions: { signal: 0, brain: 0, defiant: 0 },
  mine: [],
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en", {
    notation: value >= 1000 ? "compact" : "standard",
    maximumFractionDigits: 1,
  }).format(value);
}

export function ArticleEngagement({ slug }: { slug: string }) {
  const [metrics, setMetrics] = useState<Metrics>(emptyMetrics);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pending, setPending] = useState<Reaction[]>([]);

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/blog/engagement", {
      method: "POST",
      body: JSON.stringify({ slug, action: "view" }),
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Engagement request failed");
        return response.json() as Promise<Metrics>;
      })
      .then((nextMetrics) => {
        setMetrics(nextMetrics);
        setLoaded(true);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setFailed(true);
      });

    return () => controller.abort();
  }, [slug]);

  const toggleReaction = async (reaction: Reaction) => {
    if (!loaded || pending.includes(reaction)) return;

    const wasSelected = metrics.mine.includes(reaction);
    const previous = metrics;
    setPending((current) => [...current, reaction]);
    setMetrics((current) => ({
      ...current,
      reactions: {
        ...current.reactions,
        [reaction]: Math.max(0, current.reactions[reaction] + (wasSelected ? -1 : 1)),
      },
      mine: wasSelected
        ? current.mine.filter((item) => item !== reaction)
        : [...current.mine, reaction],
    }));

    try {
      const response = await fetch("/api/blog/engagement", {
        method: "POST",
        body: JSON.stringify({ slug, action: "reaction", reaction }),
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
      });
      if (!response.ok) throw new Error("Reaction request failed");
      setMetrics((await response.json()) as Metrics);
    } catch {
      setMetrics(previous);
    } finally {
      setPending((current) => current.filter((item) => item !== reaction));
    }
  };

  if (failed) return null;

  return (
    <section className={styles.engagement} aria-label="Article views and reactions">
      <div className={styles.views} aria-live="polite">
        <span>views</span>
        <strong>{loaded ? formatCount(metrics.views) : "—"}</strong>
      </div>

      <div className={styles.reactions} aria-label="React to this article">
        {reactions.map((reaction) => {
          const selected = metrics.mine.includes(reaction.id);
          const busy = pending.includes(reaction.id);

          return (
            <button
              key={reaction.id}
              type="button"
              className={selected ? styles.selected : undefined}
              onClick={() => toggleReaction(reaction.id)}
              disabled={!loaded || busy}
              aria-pressed={selected}
              aria-label={`${reaction.label}: ${metrics.reactions[reaction.id]} reactions`}
              title={reaction.label}
            >
              <span className={styles.emoji} aria-hidden>{reaction.emoji}</span>
              <span className={styles.label}>{reaction.label}</span>
              <strong>{loaded ? formatCount(metrics.reactions[reaction.id]) : "—"}</strong>
            </button>
          );
        })}
      </div>
    </section>
  );
}
