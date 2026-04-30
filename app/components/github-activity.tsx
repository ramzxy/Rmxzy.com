"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Stats = {
  recentRepos: number;
  lastRepo: string;
  lastUrl: string;
  lastAt: string;
};

const formatRelative = (iso: string) => {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.round(ms / 60_000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  return `${d}d ago`;
};

type Repo = {
  name: string;
  full_name: string;
  html_url: string;
  pushed_at: string;
  fork: boolean;
};

export const GitHubActivity = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(
      "https://api.github.com/users/ramzxy/repos?sort=pushed&per_page=30",
      { headers: { Accept: "application/vnd.github+json" } },
    )
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((repos: Repo[]) => {
        if (cancelled) return;
        const owned = repos.filter((r) => !r.fork);
        const since = Date.now() - 7 * 24 * 60 * 60 * 1000;
        const recent = owned.filter(
          (r) => new Date(r.pushed_at).getTime() >= since,
        );
        const last = owned[0];
        if (!last) {
          setError(true);
          return;
        }
        setStats({
          recentRepos: recent.length,
          lastRepo: last.name,
          lastUrl: last.html_url,
          lastAt: last.pushed_at,
        });
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Hide silently on rate-limit / network failure rather than show broken UI.
  if (error || !stats) return null;

  return (
    <div className="font-mono text-xs text-[var(--text-dim)] flex items-center gap-2">
      <span className="relative flex h-1.5 w-1.5 shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--phosphor)] opacity-60" />
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--phosphor)]" />
      </span>
      <Link
        href={stats.lastUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-[var(--phosphor)] transition-colors"
      >
        last push:{" "}
        <span className="text-[var(--text-bright)]">{stats.lastRepo}</span>{" "}
        ({formatRelative(stats.lastAt)})
      </Link>
    </div>
  );
};
