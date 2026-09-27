"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { toCartProduct } from "@/lib/product-utils";
import type { CartProduct } from "@/lib/cart-store";

/** Returns the current price/stock for the given products (inactive ones are omitted). */
export async function refreshCartProducts(ids: unknown): Promise<CartProduct[]> {
  const parsed = z.array(z.string().max(64)).max(100).safeParse(ids);
  if (!parsed.success || parsed.data.length === 0) return [];
  const products = await db.product.findMany({
    where: { id: { in: parsed.data }, active: true },
  });
  return products.map(toCartProduct);
}
