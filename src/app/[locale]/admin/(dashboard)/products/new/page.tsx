import { getTranslations } from "next-intl/server";
import { ProductForm } from "@/components/admin/product-form";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { localized } from "@/lib/format";
import { setupLocale } from "@/i18n/locale";

export default async function NewProductPage({ params }: PageProps<"/[locale]/admin/products/new">) {
  const { locale: rawLocale } = await params;
  const locale = setupLocale(rawLocale);
  await requireAdmin();
  const t = await getTranslations("Admin");
  const birds = await db.bird.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <h2 className="mb-6 text-xl font-semibold">{t("newProduct")}</h2>
      <ProductForm birds={birds.map((b) => ({ id: b.id, name: localized(b, "name", locale) }))} />
    </div>
  );
}
