import { getRedisConfig, redisCommand } from "@/lib/product-store";

const CLICKS_STORAGE_KEY = "ege-sales-clicks";

type ClickStoreData = Record<string, number>;

function emptyClicks(): ClickStoreData {
  return {};
}

function parseClicks(raw: string | null): ClickStoreData {
  if (!raw) return emptyClicks();

  try {
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([slug]) => Boolean(slug))
        .map(([slug, value]) => [slug, typeof value === "number" && Number.isFinite(value) ? value : 0])
    );
  } catch {
    return emptyClicks();
  }
}

export function isClickStoreConfigured() {
  return Boolean(getRedisConfig());
}

export async function incrementClick(slug: string) {
  if (!isClickStoreConfigured()) {
    throw new Error("Armazenamento persistente nao configurado.");
  }

  const normalizedSlug = slug.trim();
  if (!normalizedSlug) throw new Error("Slug obrigatorio.");

  const script = `
    local key = KEYS[1]
    local slug = ARGV[1]
    local raw = redis.call("GET", key)
    local clicks = {}

    if raw then
      local ok, decoded = pcall(cjson.decode, raw)
      if ok and type(decoded) == "table" then
        clicks = decoded
      end
    end

    local current = tonumber(clicks[slug] or 0) or 0
    local nextValue = current + 1
    clicks[slug] = nextValue
    redis.call("SET", key, cjson.encode(clicks))
    return nextValue
  `;

  return redisCommand<number>(["EVAL", script, 1, CLICKS_STORAGE_KEY, normalizedSlug]);
}

export async function listAllClicks() {
  if (!isClickStoreConfigured()) return emptyClicks();

  const raw = await redisCommand<string | null>(["GET", CLICKS_STORAGE_KEY]);
  return parseClicks(raw ?? null);
}

export async function getClicks(slug: string) {
  const clicks = await listAllClicks();
  return clicks[slug] || 0;
}

export async function resetClicks(slug: string) {
  if (!isClickStoreConfigured()) {
    throw new Error("Armazenamento persistente nao configurado.");
  }

  const normalizedSlug = slug.trim();
  if (!normalizedSlug) throw new Error("Slug obrigatorio.");

  const clicks = await listAllClicks();
  clicks[normalizedSlug] = 0;

  await redisCommand<string>(["SET", CLICKS_STORAGE_KEY, JSON.stringify(clicks)]);
  return clicks;
}
