import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "../../../../lib/blog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const redisUrl = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;
const redis = redisUrl && redisToken
  ? new Redis({ url: redisUrl, token: redisToken })
  : null;
const visitorCookie = "rmxzy-reader";
const reactions = ["signal", "brain", "defiant"] as const;

type Reaction = (typeof reactions)[number];

type MemoryStore = {
  sets: Map<string, Set<string>>;
};

const engagementGlobal = globalThis as typeof globalThis & {
  __rmxzyEngagement?: MemoryStore;
};

const memoryStore = engagementGlobal.__rmxzyEngagement ?? { sets: new Map() };
if (process.env.NODE_ENV !== "production") {
  engagementGlobal.__rmxzyEngagement = memoryStore;
}

function isReaction(value: unknown): value is Reaction {
  return typeof value === "string" && reactions.includes(value as Reaction);
}

function postKey(slug: string, suffix: string) {
  return `rmxzy:blog:${slug}:${suffix}`;
}

function memorySet(key: string) {
  const existing = memoryStore.sets.get(key);
  if (existing) return existing;
  const created = new Set<string>();
  memoryStore.sets.set(key, created);
  return created;
}

function ensureBackend() {
  if (!redis && process.env.NODE_ENV === "production") {
    throw new Error("Upstash Redis is not configured.");
  }
}

async function memberCount(key: string) {
  ensureBackend();
  return redis ? redis.scard(key) : memorySet(key).size;
}

async function hasMember(key: string, member: string) {
  ensureBackend();
  return redis ? Boolean(await redis.sismember(key, member)) : memorySet(key).has(member);
}

async function addMember(key: string, member: string) {
  ensureBackend();
  if (redis) return redis.sadd(key, member);
  const set = memorySet(key);
  const existed = set.has(member);
  set.add(member);
  return existed ? 0 : 1;
}

async function removeMember(key: string, member: string) {
  ensureBackend();
  if (redis) return redis.srem(key, member);
  return memorySet(key).delete(member) ? 1 : 0;
}

function readerFor(request: NextRequest) {
  const existing = request.cookies.get(visitorCookie)?.value;
  return existing
    ? { id: existing, isNew: false }
    : { id: crypto.randomUUID(), isNew: true };
}

function json(
  body: unknown,
  status = 200,
  reader?: { id: string; isNew: boolean },
) {
  const response = NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "private, no-store" },
  });

  if (reader?.isNew) {
    response.cookies.set(visitorCookie, reader.id, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

async function getMetrics(slug: string, readerId: string) {
  const [views, ...reactionData] = await Promise.all([
    memberCount(postKey(slug, "views")),
    ...reactions.map((reaction) =>
      memberCount(postKey(slug, `reaction:${reaction}`)),
    ),
    ...reactions.map((reaction) =>
      hasMember(postKey(slug, `reaction:${reaction}`), readerId),
    ),
  ]);

  const counts = reactionData.slice(0, reactions.length);
  const selected = reactionData.slice(reactions.length);

  return {
    views: Number(views ?? 0),
    reactions: Object.fromEntries(
      reactions.map((reaction, index) => [reaction, Number(counts[index] ?? 0)]),
    ) as Record<Reaction, number>,
    mine: reactions.filter((_, index) => Boolean(selected[index])),
  };
}

function validPost(slug: unknown): slug is string {
  return (
    typeof slug === "string" &&
    slug.length <= 100 &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) &&
    Boolean(getPostBySlug(slug))
  );
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!validPost(slug)) return json({ error: "Unknown article." }, 404);

  const reader = readerFor(request);
  try {
    return json(await getMetrics(slug, reader.id), 200, reader);
  } catch {
    return json({ error: "Engagement is temporarily unavailable." }, 503);
  }
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== request.nextUrl.host) {
    return json({ error: "Cross-origin request rejected." }, 403);
  }

  let body: { slug?: unknown; action?: unknown; reaction?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request." }, 400);
  }

  if (!validPost(body.slug)) return json({ error: "Unknown article." }, 404);
  const slug = body.slug;
  const reader = readerFor(request);

  try {
    if (body.action === "view") {
      await addMember(postKey(slug, "views"), reader.id);
    } else if (body.action === "reaction" && isReaction(body.reaction)) {
      const key = postKey(slug, `reaction:${body.reaction}`);
      const selected = await hasMember(key, reader.id);
      if (selected) await removeMember(key, reader.id);
      else await addMember(key, reader.id);
    } else {
      return json({ error: "Unknown action." }, 400, reader);
    }

    return json(await getMetrics(slug, reader.id), 200, reader);
  } catch {
    return json({ error: "Engagement is temporarily unavailable." }, 503, reader);
  }
}
