import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { DeleteProductButton } from "@/components/admin/delete-button";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { localized } from "@/lib/format";
import { setupLocale } from "@/i18n/locale";

export default async function EditProductPage({ params }: PageProps<"/[locale]/admin/products/[id]">) {
  const { locale: rawLocale, id } = await params;
  const locale = setupLocale(rawLocale);
  await requireAdmin();
  const t = await getTranslations("Admin");

  const [product, birds] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.bird.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">
          {t("editProduct")}: {localized(product, "breed", locale)}
        </h2>
        <DeleteProductButton id={product.id} label={t("delete")} confirmText={t("deleteConfirm")} />
      </div>
      <ProductForm
        birds={birds.map((b) => ({ id: b.id, name: localized(b, "name", locale) }))}
        product={{
          id: product.id,
          birdId: product.birdId,
          slug: product.slug,
          breedEn: product.breedEn,
          breedAr: product.breedAr,
          descriptionEn: product.descriptionEn,
          descriptionAr: product.descriptionAr,
          price: (product.priceCents / 100).toFixed(2),
          stock: product.stock,
          minOrder: product.minOrder,
          hatchRate: product.hatchRate,
          shellColor: product.shellColor,
          speckled: product.speckled,
          featured: product.featured,
          active: product.active,
        }}
      />
    </div>
  );
}
