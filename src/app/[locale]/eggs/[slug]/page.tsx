import { ArrowLeft, CalendarDays, Egg, Package, Percent } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AddToCart } from "@/components/add-to-cart";
import { EggArt } from "@/components/egg-art";
import { ProductCard } from "@/components/product-card";
import { Link } from "@/i18n/navigation";
import { formatMoney, localized } from "@/lib/format";
import { toCartProduct } from "@/lib/product-utils";
import { getProductBySlug, getRelatedProducts } from "@/lib/queries";
import { setupLocale } from "@/i18n/locale";

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/eggs/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: localized(product, "breed", locale),
    description: localized(product, "description", locale),
  };
}

export default async function ProductPage({ params }: PageProps<"/[locale]/eggs/[slug]">) {
  const { locale: rawLocale, slug } = await params;
  const locale = setupLocale(rawLocale);

  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [t, related] = await Promise.all([
    getTranslations("Product"),
    getRelatedProducts(product.birdId, product.id),
  ]);
  const birdName = localized(product.bird, "name", locale);

  const stats = [
    { icon: Percent, label: t("hatchRate"), value: `${product.hatchRate}%` },
    { icon: CalendarDays, label: t("incubation"), value: t("days", { days: product.bird.incubationDays }) },
    { icon: Egg, label: t("shell"), value: product.speckled ? t("speckled") : t("plain"), swatch: product.shellColor },
    {
      icon: Package,
      label: t("minOrder", { count: product.minOrder }),
      value: product.stock > 0 ? t("inStock", { count: product.stock }) : t("outOfStock"),
    },
  ];

  return (
    <div className="container-page py-10">
      <Link href="/eggs" className="inline-flex items-center gap-1.5 text-sm font-medium text-bark-500 hover:text-bark-900">
        <ArrowLeft className="size-4 rtl:rotate-180" />
        {t("back")}
      </Link>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <div className="card relative grid aspect-square place-items-center overflow-hidden bg-gradient-to-br from-cream-100 via-cream-200 to-yolk-300/40">
          <div className="absolute h-1/2 w-2/3 translate-y-1/4 rounded-[50%] bg-bark-900/10 blur-2xl" />
          <EggArt
            color={product.shellColor}
            speckled={product.speckled}
            seed={product.slug}
            className="relative h-3/5"
          />
        </div>

        <div className="flex flex-col">
          <Link
            href={{ pathname: "/eggs", query: { bird: product.bird.slug } }}
            className="w-fit rounded-full bg-meadow-100 px-3 py-1 text-xs font-semibold text-meadow-700 hover:bg-meadow-50"
          >
            {birdName}
          </Link>
          <h1 className="mt-3 font-display text-4xl font-semibold leading-tight md:text-5xl">
            {localized(product, "breed", locale)}
          </h1>
          <p className="mt-4 text-2xl font-bold text-meadow-700">
            {formatMoney(product.priceCents, locale)}{" "}
            <span className="text-base font-normal text-bark-500">{t("perEgg")}</span>
          </p>
          <p className="mt-5 text-lg leading-relaxed text-bark-700">
            {localized(product, "description", locale)}
          </p>

          <dl className="mt-8 grid grid-cols-2 gap-3">
            {stats.map(({ icon: Icon, label, value, swatch }) => (
              <div key={label} className="rounded-2xl bg-cream-100 p-4">
                <dt className="flex items-center gap-1.5 text-xs font-medium text-bark-500">
                  <Icon className="size-3.5" />
                  {label}
                </dt>
                <dd className="mt-1 flex items-center gap-2 font-semibold">
                  {swatch && (
                    <span className="size-3.5 rounded-full border border-bark-900/20" style={{ background: swatch }} />
                  )}
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="card mt-8 p-5">
            <AddToCart product={toCartProduct(product)} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-semibold">{t("related", { bird: birdName })}</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
