import "server-only";
import { cookies } from "next/headers";
import crypto from "crypto";

/**
 * Lightweight, self-contained admin authentication — separate from Clerk
 * (which handles customers). A single set of constant admin credentials lives
 * in env vars; a successful login sets a signed, httpOnly session cookie.
 *
 * Env:
 *   ADMIN_EMAIL           the admin login email
 *   ADMIN_PASSWORD        the admin login password
 *   ADMIN_SESSION_SECRET  random secret used to sign the session cookie
 */

const COOKIE = "ca_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 hours

function secret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? "";
}

function sign(payload: string): string {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

/** Constant-time string comparison that tolerates length differences. */
function safeEqual(a: string, b: string): boolean {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) {
    crypto.timingSafeEqual(ab, ab); // burn time, avoid early return leak
    return false;
  }
  return crypto.timingSafeEqual(ab, bb);
}

export function verifyCredentials(email: string, password: string): boolean {
  const adminEmail = (process.env.ADMIN_EMAIL ?? "").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!adminEmail || !adminPassword || !secret()) return false;
  const emailOk = safeEqual(email.trim().toLowerCase(), adminEmail);
  const passOk = safeEqual(password, adminPassword);
  return emailOk && passOk;
}

export const SESSION_COOKIE = COOKIE;

/** Build the signed session cookie (name/value/options) for a Route Handler. */
export function buildSessionCookie() {
  const exp = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `admin.${exp}`;
  const token = `${payload}.${sign(payload)}`;
  return {
    name: COOKIE,
    value: token,
    options: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      maxAge: MAX_AGE_SECONDS,
    },
  };
}

export async function createAdminSession(): Promise<void> {
  const exp = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = `admin.${exp}`;
  const token = `${payload}.${sign(payload)}`;
  const store = await cookies();
  store.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SECONDS,
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  if (!secret()) return false;
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [prefix, exp, sig] = parts;
  const payload = `${prefix}.${exp}`;
  if (!safeEqual(sig, sign(payload))) return false;
  if (!Number.isFinite(Number(exp)) || Number(exp) < Date.now()) return false;
  return prefix === "admin";
}
