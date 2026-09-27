import type { Bird, Product } from "@/generated/prisma/client";
import type { CartProduct } from "./cart-store";

export type ProductWithBird = Product & { bird: Bird };

export function toCartProduct(p: Product): CartProduct {
  return {
    productId: p.id,
    slug: p.slug,
    breedEn: p.breedEn,
    breedAr: p.breedAr,
    priceCents: p.priceCents,
    minOrder: p.minOrder,
    stock: p.stock,
    shellColor: p.shellColor,
    speckled: p.speckled,
  };
}
