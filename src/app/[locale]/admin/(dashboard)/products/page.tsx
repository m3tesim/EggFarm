import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { EggArt } from "@/components/egg-art";
import { Link } from "@/i18n/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { formatMoney, localized } from "@/lib/format";
import { setupLocale } from "@/i18n/locale";

export default async function AdminProductsPage({ params, searchParams }: PageProps<"/[locale]/admin/products">) {
  const { locale: rawLocale } = await params;
  const locale = setupLocale(rawLocale);
  await requireAdmin();
  const t = await getTranslations("Admin");
  const { deactivated } = await searchParams;

  const products = await db.product.findMany({
    include: { bird: true },
    orderBy: [{ bird: { sortOrder: "asc" } }, { breedEn: "asc" }],
  });

  return (
    <div className="space-y-4">
      {deactivated && (
        <p className="rounded-2xl bg-yolk-300/30 px-4 py-3 text-sm">{t("cannotDelete")}</p>
      )}
      <div className="flex justify-end">
        <Link href="/admin/products/new" className="btn-primary">
          <Plus className="size-4" />
          {t("newProduct")}
        </Link>
      </div>
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[44rem] text-sm">
          <thead className="bg-cream-100 text-xs uppercase tracking-wide text-bark-500">
            <tr>
              <th className="p-3 text-start">{t("products")}</th>
              <th className="p-3 text-start">{t("bird")}</th>
              <th className="p-3 text-start">{t("priceLabel")}</th>
              <th className="p-3 text-start">{t("stock")}</th>
              <th className="p-3 text-start">{t("status")}</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-bark-900/10">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <EggArt color={p.shellColor} speckled={p.speckled} seed={p.slug} className="h-8" />
                    <span className="font-medium">{localized(p, "breed", locale)}</span>
                  </div>
                </td>
                <td className="p-3">{localized(p.bird, "name", locale)}</td>
                <td className="p-3">{formatMoney(p.priceCents, locale)}</td>
                <td className={`p-3 font-semibold ${p.stock < 20 ? "text-red-600" : ""}`}>{p.stock}</td>
                <td className="p-3 text-xs">
                  {p.active ? t("active") : <span className="text-bark-500">{t("hidden")}</span>}
                  {p.featured && <span className="ms-2 rounded-full bg-yolk-300/50 px-2 py-0.5">{t("featured")}</span>}
                </td>
                <td className="p-3 text-end">
                  <Link href={`/admin/products/${p.id}`} className="btn-ghost px-3 py-1.5 text-xs">
                    {t("edit")}
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
