import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { ProductCard } from "@/components/product-card";
import { ShopFilters, SortSelect } from "@/components/shop-filters";
import { Link } from "@/i18n/navigation";
import { storeConfig } from "@/lib/config";
import { localized } from "@/lib/format";
import { getBirds, getPriceBounds, searchProducts, shopFiltersSchema } from "@/lib/queries";
import { asLocale, setupLocale } from "@/i18n/locale";

export async function generateMetadata({ params }: PageProps<"/[locale]/eggs">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: asLocale(locale), namespace: "Shop" });
  return { title: t("title") };
}

function currencySymbol(locale: string) {
  return (
    new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
      style: "currency",
      currency: storeConfig.currency,
    })
      .formatToParts(0)
      .find((p) => p.type === "currency")?.value ?? storeConfig.currency
  );
}

export default async function ShopPage({ params, searchParams }: PageProps<"/[locale]/eggs">) {
  const { locale: rawLocale } = await params;
  const locale = setupLocale(rawLocale);
  const t = await getTranslations("Shop");

  const rawParams = await searchParams;
  const filters = shopFiltersSchema.parse(rawParams);
  const [birds, bounds, result] = await Promise.all([
    getBirds(),
    getPriceBounds(),
    searchProducts(filters),
  ]);

  const pageHref = (page: number) => {
    const query: Record<string, string> = {};
    for (const [key, value] of Object.entries(rawParams)) {
      if (typeof value === "string" && key !== "page") query[key] = value;
    }
    if (page > 1) query.page = String(page);
    return { pathname: "/eggs" as const, query };
  };

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="font-display text-4xl font-semibold">{t("title")}</h1>
        <p className="mt-2 text-bark-500">{t("subtitle")}</p>
      </header>

      <div className="grid gap-8 md:grid-cols-[16rem_1fr] lg:grid-cols-[18rem_1fr]">
        <aside className="md:sticky md:top-24 md:self-start">
          <Suspense>
            <ShopFilters
              birds={birds.map((b) => ({
                slug: b.slug,
                name: localized(b, "name", locale),
                count: b._count.products,
              }))}
              priceBounds={bounds}
              currencySymbol={currencySymbol(locale)}
            />
          </Suspense>
        </aside>

        <section>
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-bark-700" aria-live="polite">
              {t("results", { count: result.total })}
            </p>
            <Suspense>
              <SortSelect value={filters.sort ?? "featured"} />
            </Suspense>
          </div>

          {result.products.length === 0 ? (
            <div className="card grid place-items-center px-6 py-20 text-center">
              <SearchX className="size-10 text-bark-500" />
              <p className="mt-4 text-lg font-semibold">{t("empty")}</p>
              <p className="mt-1 text-sm text-bark-500">{t("emptyHint")}</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {result.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {result.pageCount > 1 && (
            <nav className="mt-10 flex items-center justify-center gap-3">
              {result.page > 1 && (
                <Link href={pageHref(result.page - 1)} className="btn-ghost">
                  <ChevronLeft className="size-4 rtl:rotate-180" />
                  {t("previous")}
                </Link>
              )}
              <span className="text-sm text-bark-500">
                {t("page", { page: result.page, total: result.pageCount })}
              </span>
              {result.page < result.pageCount && (
                <Link href={pageHref(result.page + 1)} className="btn-ghost">
                  {t("next")}
                  <ChevronRight className="size-4 rtl:rotate-180" />
                </Link>
              )}
            </nav>
          )}
        </section>
      </div>
    </div>
  );
}
