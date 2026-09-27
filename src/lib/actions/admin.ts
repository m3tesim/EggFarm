"use server";

import { revalidatePath } from "next/cache";
import { getLocale } from "next-intl/server";
import { z } from "zod";
import { redirect } from "@/i18n/navigation";
import {
  checkPassword,
  createAdminSession,
  destroyAdminSession,
  requireAdmin,
} from "@/lib/admin-auth";
import { ORDER_STATUSES } from "@/lib/config";
import { db } from "@/lib/db";

export type LoginState = { error?: "wrongPassword" };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) {
    // Slow down brute-force attempts a little.
    await new Promise((r) => setTimeout(r, 600));
    return { error: "wrongPassword" };
  }
  await createAdminSession();
  redirect({ href: "/admin", locale: await getLocale() });
  return {};
}

export async function logout() {
  await destroyAdminSession();
  redirect({ href: "/admin/login", locale: await getLocale() });
}

const statusSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(ORDER_STATUSES),
});

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const parsed = statusSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const { orderId, status } = parsed.data;

  await db.$transaction(async (tx) => {
    const order = await tx.order.findUnique({ where: { id: orderId }, include: { items: true } });
    // Cancelled orders are final: their stock has already been returned.
    if (!order || order.status === status || order.status === "CANCELLED") return;

    if (status === "CANCELLED") {
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { increment: item.quantity } },
        });
      }
    }
    await tx.order.update({ where: { id: orderId }, data: { status } });
  });

  revalidatePath("/[locale]/admin", "layout");
}

const productSchema = z.object({
  id: z.string().optional(),
  birdId: z.string().min(1),
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
    .max(80),
  breedEn: z.string().trim().min(2).max(120),
  breedAr: z.string().trim().min(2).max(120),
  descriptionEn: z.string().trim().min(10).max(2000),
  descriptionAr: z.string().trim().min(10).max(2000),
  price: z.coerce.number().positive().max(100000),
  stock: z.coerce.number().int().min(0).max(1_000_000),
  minOrder: z.coerce.number().int().min(1).max(500),
  hatchRate: z.coerce.number().int().min(0).max(100),
  shellColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  speckled: z.boolean(),
  featured: z.boolean(),
  active: z.boolean(),
});

export type ProductFormState = {
  fieldErrors?: Partial<Record<keyof z.infer<typeof productSchema>, true>>;
  slugTaken?: boolean;
};

export async function saveProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin();
  const raw = Object.fromEntries(formData);
  const parsed = productSchema.safeParse({
    ...raw,
    id: raw.id || undefined,
    speckled: formData.has("speckled"),
    featured: formData.has("featured"),
    active: formData.has("active"),
  });
  if (!parsed.success) {
    const fieldErrors: ProductFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[issue.path[0] as keyof typeof fieldErrors] = true;
    }
    return { fieldErrors };
  }

  const { id, price, ...rest } = parsed.data;
  const data = { ...rest, priceCents: Math.round(price * 100) };

  const clash = await db.product.findFirst({
    where: { slug: data.slug, NOT: id ? { id } : undefined },
    select: { id: true },
  });
  if (clash) return { slugTaken: true, fieldErrors: { slug: true } };

  if (id) await db.product.update({ where: { id }, data });
  else await db.product.create({ data });

  revalidatePath("/", "layout");
  redirect({ href: "/admin/products", locale: await getLocale() });
  return {};
}

export async function deleteProduct(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const orders = await db.orderItem.count({ where: { productId: id } });
  // Products referenced by orders are hidden instead of deleted to keep order history intact.
  if (orders > 0) await db.product.update({ where: { id }, data: { active: false } });
  else await db.product.delete({ where: { id } });

  revalidatePath("/", "layout");
  redirect({
    href: { pathname: "/admin/products", query: orders > 0 ? { deactivated: "1" } : {} },
    locale: await getLocale(),
  });
}
