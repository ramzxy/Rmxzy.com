"use client";

import { useEffect, useState } from "react";
import { Bot, Eye, Flame, ScanEye } from "lucide-react";
import styles from "./article-engagement.module.css";

const reactions = [
  { id: "defiant", label: "cooked" },
  { id: "signal", label: "fedpost" },
  { id: "brain", label: "slop" },
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

function ReactionMark({ reaction }: { reaction: Reaction }) {
  const Icon = reaction === "brain"
    ? Bot
    : reaction === "signal"
      ? ScanEye
      : Flame;

  return <Icon aria-hidden focusable="false" />;
}

function ViewMark() {
  return <Eye aria-hidden focusable="false" />;
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

  return (
    <section
      className={styles.engagement}
      data-failed={failed || undefined}
      aria-label="Article views and reactions"
    >
      <div className={styles.views} aria-label="Article views" aria-live="polite">
        <span className={styles.viewMark}><ViewMark /></span>
        <strong>{failed ? "off" : loaded ? formatCount(metrics.views) : "—"}</strong>
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
              data-reaction={reaction.id}
              onClick={() => toggleReaction(reaction.id)}
              disabled={failed || !loaded || busy}
              aria-pressed={selected}
              aria-busy={busy}
              aria-label={loaded
                ? `${reaction.label}: ${metrics.reactions[reaction.id]} reactions`
                : reaction.label}
              title={`${selected ? "Remove" : "Add"} ${reaction.label} reaction`}
            >
              <span className={styles.mark}><ReactionMark reaction={reaction.id} /></span>
              <span className={styles.label}>
                <span>{reaction.label}</span>
              </span>
              <strong className={styles.count}>{loaded ? formatCount(metrics.reactions[reaction.id]) : "—"}</strong>
            </button>
          );
        })}
      </div>
    </section>
  );
}
