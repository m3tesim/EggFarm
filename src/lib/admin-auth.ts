import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";

const COOKIE = "eggfarm-admin";
const SESSION_SECONDS = 60 * 60 * 12;

function secret() {
  const value = process.env.AUTH_SECRET;
  return value && value.length >= 16 ? value : null;
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD && secret());
}

function sign(payload: string) {
  return createHmac("sha256", secret()!).update(payload).digest("base64url");
}

function safeEqual(a: string, b: string) {
  // Hash first so inputs of different length compare in constant time.
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function checkPassword(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected && secret() && safeEqual(password, expected));
}

export async function createAdminSession() {
  const expires = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const payload = `admin.${expires}`;
  (await cookies()).set(COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function destroyAdminSession() {
  (await cookies()).delete(COOKIE);
}

export async function isAdmin() {
  if (!adminConfigured()) return false;
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return false;
  const [role, expires, signature] = token.split(".");
  if (role !== "admin" || !expires || !signature) return false;
  if (Number(expires) < Date.now() / 1000) return false;
  return safeEqual(signature, sign(`${role}.${expires}`));
}

/** Call at the top of every admin page and server action. */
export async function requireAdmin() {
  if (!(await isAdmin())) {
    redirect({ href: "/admin/login", locale: await getLocale() });
  }
}
