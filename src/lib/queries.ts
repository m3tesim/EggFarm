import "server-only";
import { z } from "zod";
import type { Prisma } from "@/generated/prisma/client";
import { db } from "./db";

export const PAGE_SIZE = 12;

export const SORTS = ["featured", "price-asc", "price-desc", "newest", "name"] as const;
export type Sort = (typeof SORTS)[number];

const optionalNumber = z.preprocess(
  (v) => (v === "" || v === undefined ? undefined : Number(v)),
  z.number().finite().nonnegative().optional().catch(undefined),
);

/** Parses and sanitises the shop page's URL search params. */
export const shopFiltersSchema = z.object({
  q: z.string().trim().max(80).optional().catch(undefined),
  bird: z
    .union([z.string(), z.array(z.string())])
    .transform((v) => (Array.isArray(v) ? v : v.split(",")).filter(Boolean))
    .optional()
    .catch(undefined),
  min: optionalNumber,
  max: optionalNumber,
  stock: z.literal("1").optional().catch(undefined),
  sort: z.enum(SORTS).optional().catch(undefined),
  page: z.coerce.number().int().min(1).optional().catch(undefined),
});

export type ShopFilters = z.infer<typeof shopFiltersSchema>;

export async function getBirds() {
  return db.bird.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { products: { where: { active: true } } } },
      products: {
        where: { active: true },
        orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
        take: 1,
        select: { shellColor: true, speckled: true, slug: true },
      },
    },
  });
}

export async function getFeaturedProducts(take = 8) {
  return db.product.findMany({
    where: { active: true, featured: true },
    include: { bird: true },
    orderBy: { createdAt: "asc" },
    take,
  });
}

export async function getPriceBounds() {
  const agg = await db.product.aggregate({
    where: { active: true },
    _min: { priceCents: true },
    _max: { priceCents: true },
  });
  return { min: agg._min.priceCents ?? 0, max: agg._max.priceCents ?? 0 };
}

export async function searchProducts(filters: ShopFilters) {
  const where: Prisma.ProductWhereInput = { active: true };
  const and: Prisma.ProductWhereInput[] = [];

  if (filters.q) {
    const q = filters.q;
    // SQLite's LIKE is case-insensitive for ASCII, so `contains` works for both languages.
    and.push({
      OR: [
        { breedEn: { contains: q } },
        { breedAr: { contains: q } },
        { descriptionEn: { contains: q } },
        { descriptionAr: { contains: q } },
        { bird: { nameEn: { contains: q } } },
        { bird: { nameAr: { contains: q } } },
      ],
    });
  }
  if (filters.bird?.length) and.push({ bird: { slug: { in: filters.bird } } });
  if (filters.min !== undefined || filters.max !== undefined) {
    and.push({
      priceCents: {
        gte: filters.min !== undefined ? Math.round(filters.min * 100) : undefined,
        lte: filters.max !== undefined ? Math.round(filters.max * 100) : undefined,
      },
    });
  }
  if (filters.stock) and.push({ stock: { gt: 0 } });
  if (and.length) where.AND = and;

  const orderBy: Prisma.ProductOrderByWithRelationInput[] = {
    featured: [{ featured: "desc" as const }, { bird: { sortOrder: "asc" as const } }],
    "price-asc": [{ priceCents: "asc" as const }],
    "price-desc": [{ priceCents: "desc" as const }],
    newest: [{ createdAt: "desc" as const }],
    name: [{ breedEn: "asc" as const }],
  }[filters.sort ?? "featured"];

  const page = filters.page ?? 1;
  const [total, products] = await db.$transaction([
    db.product.count({ where }),
    db.product.findMany({
      where,
      include: { bird: true },
      orderBy: [...orderBy, { id: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return { products, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) };
}

export async function getProductBySlug(slug: string) {
  return db.product.findFirst({
    where: { slug, active: true },
    include: { bird: true },
  });
}

export async function getRelatedProducts(birdId: string, excludeId: string) {
  return db.product.findMany({
    where: { birdId, active: true, id: { not: excludeId } },
    include: { bird: true },
    take: 4,
  });
}
