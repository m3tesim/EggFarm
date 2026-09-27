import "server-only";
import { cookies } from "next/headers";

const COOKIE = "eggfarm-orders";
const MAX_CODES = 20;

/** Order codes this browser placed or verified; used to authorise viewing an order. */
export async function getAccessibleOrderCodes() {
  const store = await cookies();
  return (store.get(COOKIE)?.value ?? "").split(",").filter(Boolean);
}

export async function grantOrderAccess(code: string) {
  const store = await cookies();
  const codes = [code, ...(await getAccessibleOrderCodes()).filter((c) => c !== code)];
  store.set(COOKIE, codes.slice(0, MAX_CODES).join(","), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 180,
  });
}

export function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "");
}
