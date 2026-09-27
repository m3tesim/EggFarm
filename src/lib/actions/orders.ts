"use server";

import { randomInt } from "node:crypto";
import { getLocale } from "next-intl/server";
import { z } from "zod";
import { redirect } from "@/i18n/navigation";
import { shippingFor, storeConfig } from "@/lib/config";
import { db } from "@/lib/db";
import { grantOrderAccess, normalizePhone } from "@/lib/order-access";

export type CheckoutField = "name" | "phone" | "email" | "city" | "address";

export type CheckoutState = {
  /** Translation key under Checkout.errors plus its values. */
  error?: { key: "generic" | "invalid" | "stock" | "unavailable" | "minOrder" | "empty"; values?: Record<string, string | number> };
  fieldErrors?: Partial<Record<CheckoutField, true>>;
  /** Echo back what the user typed so the form keeps its values. */
  values?: Record<string, string>;
};

const checkoutSchema = z.object({
  name: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine((v) => /^\+?\d{7,15}$/.test(normalizePhone(v))),
  email: z.union([z.literal(""), z.email().max(200)]),
  city: z.string().trim().min(2).max(100),
  address: z.string().trim().min(5).max(300),
  notes: z.string().trim().max(1000),
  items: z
    .array(
      z.object({
        productId: z.string().min(1).max(64),
        quantity: z.number().int().positive().max(storeConfig.maxPerLine),
      }),
    )
    .min(1)
    .max(50),
});

class CheckoutError extends Error {
  constructor(public state: CheckoutState["error"]) {
    super(state?.key);
  }
}

const CODE_ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

function generateOrderCode() {
  let code = "";
  for (let i = 0; i < 10; i++) code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return `EGG-${code}`;
}

export async function placeOrder(_prev: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const locale = await getLocale();
  const values = Object.fromEntries(
    ["name", "phone", "email", "city", "address", "notes"].map((k) => [k, String(formData.get(k) ?? "")]),
  );

  let items: unknown;
  try {
    items = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    items = [];
  }

  const parsed = checkoutSchema.safeParse({ ...values, items });
  if (!parsed.success) {
    const fieldErrors: CheckoutState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0];
      if (field === "items") return { error: { key: "empty" }, values };
      fieldErrors[field as CheckoutField] = true;
    }
    return { error: { key: "invalid" }, fieldErrors, values };
  }

  const data = parsed.data;
  // Merge duplicate lines for the same product.
  const quantities = new Map<string, number>();
  for (const item of data.items) {
    quantities.set(item.productId, (quantities.get(item.productId) ?? 0) + item.quantity);
  }

  let code: string;
  try {
    code = await db.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: [...quantities.keys()] } },
      });
      const byId = new Map(products.map((p) => [p.id, p]));

      const lines = [...quantities].map(([productId, quantity]) => {
        const product = byId.get(productId);
        const name = (p: { breedEn: string; breedAr: string }) => (locale === "ar" ? p.breedAr : p.breedEn);
        if (!product || !product.active) {
          throw new CheckoutError({ key: "unavailable", values: { name: product ? name(product) : "?" } });
        }
        if (quantity < product.minOrder) {
          throw new CheckoutError({ key: "minOrder", values: { name: name(product), min: product.minOrder } });
        }
        return { product, quantity, name: name(product) };
      });

      // Conditional decrement guards against overselling under concurrent orders.
      for (const { product, quantity, name } of lines) {
        const { count } = await tx.product.updateMany({
          where: { id: product.id, stock: { gte: quantity } },
          data: { stock: { decrement: quantity } },
        });
        if (count === 0) {
          throw new CheckoutError({ key: "stock", values: { name, available: product.stock } });
        }
      }

      const subtotal = lines.reduce((sum, l) => sum + l.product.priceCents * l.quantity, 0);
      const shipping = shippingFor(subtotal);

      const order = await tx.order.create({
        data: {
          code: generateOrderCode(),
          customerName: data.name,
          phone: normalizePhone(data.phone),
          email: data.email || null,
          city: data.city,
          address: data.address,
          notes: data.notes || null,
          locale,
          subtotalCents: subtotal,
          shippingCents: shipping,
          totalCents: subtotal + shipping,
          items: {
            create: lines.map(({ product, quantity }) => ({
              productId: product.id,
              nameEn: product.breedEn,
              nameAr: product.breedAr,
              unitPriceCents: product.priceCents,
              quantity,
            })),
          },
        },
      });
      return order.code;
    });
  } catch (error) {
    if (error instanceof CheckoutError) return { error: error.state, values };
    console.error("placeOrder failed", error);
    return { error: { key: "generic" }, values };
  }

  await grantOrderAccess(code);
  redirect({ href: { pathname: `/orders/${code}`, query: { placed: "1" } }, locale });
  return {};
}

export type TrackState = { notFound?: boolean; values?: { code: string; phone: string } };

export async function trackOrder(_prev: TrackState, formData: FormData): Promise<TrackState> {
  const locale = await getLocale();
  const code = String(formData.get("code") ?? "").trim().toUpperCase().slice(0, 20);
  const phone = String(formData.get("phone") ?? "").slice(0, 30);
  const normalizedCode = code.startsWith("EGG-") ? code : `EGG-${code}`;

  const order = await db.order.findUnique({
    where: { code: normalizedCode },
    select: { code: true, phone: true },
  });
  if (!order || order.phone !== normalizePhone(phone)) {
    return { notFound: true, values: { code, phone } };
  }

  await grantOrderAccess(order.code);
  redirect({ href: `/orders/${order.code}`, locale });
  return {};
}
