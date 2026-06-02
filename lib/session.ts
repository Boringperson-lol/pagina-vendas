import type { NextRequest } from "next/server";

export const ADMIN_SESSION_COOKIE = "ege_admin_session";

const encoder = new TextEncoder();

function base64UrlEncode(value: string) {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlDecode(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
  return atob(padded);
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASS || "ege-dev-session-secret";
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function createAdminSessionToken(username: string) {
  const expiresAt = Date.now() + 1000 * 60 * 60 * 8;
  const payload = `${username}:${expiresAt}`;
  const signature = await sign(payload);

  return `${base64UrlEncode(payload)}.${signature}`;
}

export async function isValidAdminSession(token?: string) {
  if (!token) return false;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  try {
    const payload = base64UrlDecode(encodedPayload);
    const [, expiresAt] = payload.split(":");

    if (!expiresAt || Number(expiresAt) < Date.now()) return false;

    return signature === (await sign(payload));
  } catch {
    return false;
  }
}

export async function requestHasAdminSession(request: NextRequest) {
  return isValidAdminSession(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
}
