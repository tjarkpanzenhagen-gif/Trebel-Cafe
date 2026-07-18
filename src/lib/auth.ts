import { createHash, createHmac, timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export const SESSION_COOKIE = "admin_session";
export const SESSION_MAX_AGE_S = 60 * 60 * 8;

// Dev-only fallbacks. In production the env vars are required — without them
// login and session verification fail closed.
const DEV_SECRET = "dev-secret-change-in-production";
const isProduction = process.env.NODE_ENV === "production";

function getSecret(): string | null {
  if (process.env.ADMIN_SESSION_SECRET) return process.env.ADMIN_SESSION_SECRET;
  return isProduction ? null : DEV_SECRET;
}

export function getAdminCredentials(): { username: string; password: string } | null {
  const username = process.env.ADMIN_USERNAME || (isProduction ? null : "1");
  const password = process.env.ADMIN_PASSWORD || (isProduction ? null : "1");
  if (!username || !password) return null;
  return { username, password };
}

export function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

export function createSessionToken(): string | null {
  const secret = getSecret();
  if (!secret) return null;
  const exp = Date.now() + SESSION_MAX_AGE_S * 1000;
  return `${exp}.${sign(String(exp), secret)}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  const secret = getSecret();
  if (!secret || !token) return false;
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const exp = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  return safeEqual(sig, sign(exp, secret));
}

export function isAuthenticated(request: NextRequest): boolean {
  return verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value);
}
