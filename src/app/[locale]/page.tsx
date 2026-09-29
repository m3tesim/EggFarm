import { ArrowRight, HeartPulse, PackageCheck, Sprout, Thermometer } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { BirdPhoto } from "@/components/bird-photo";
import { ProductCard } from "@/components/product-card";
import { Link } from "@/i18n/navigation";
import { localized } from "@/lib/format";
import { getBirds, getFeaturedProducts } from "@/lib/queries";
import { setupLocale } from "@/i18n/locale";

export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale: rawLocale } = await params;
  const locale = setupLocale(rawLocale);
  const t = await getTranslations("Home");
  const [birds, featured] = await Promise.all([getBirds(), getFeaturedProducts()]);

  const reasons = [
    { icon: HeartPulse, title: t("why1Title"), text: t("why1Text") },
    { icon: Sprout, title: t("why2Title"), text: t("why2Text") },
    { icon: PackageCheck, title: t("why3Title"), text: t("why3Text") },
    { icon: Thermometer, title: t("why4Title"), text: t("why4Text") },
  ];

  const heroBirds = featured.filter((p) => p.imageUrl).slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-cream-200 to-cream-50">
        <div className="container-page grid items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <div>
            <p className="inline-flex rounded-full bg-meadow-100 px-3 py-1 text-xs font-semibold tracking-wide text-meadow-700">
              {t("eyebrow")}
            </p>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] text-balance md:text-6xl">
              {t("heroTitle")}
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-bark-700">{t("heroText")}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/eggs" className="btn-primary px-6 py-3 text-base">
                {t("shopNow")}
                <ArrowRight className="size-4 rtl:rotate-180" />
              </Link>
              <a href="#birds" className="btn-ghost px-6 py-3 text-base">
                {t("browseBirds")}
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-8 rounded-full bg-yolk-300/50 blur-3xl" aria-hidden="true" />
            <div className="relative grid grid-cols-2 gap-4 pb-8">
              {heroBirds.map((product, i) => (
                <Link
                  key={product.id}
                  href={`/eggs/${product.slug}`}
                  className={`group relative aspect-[4/5] overflow-hidden rounded-[2rem] border-4 border-white shadow-xl ${
                    i % 2 === 1 ? "translate-y-8" : ""
                  }`}
                >
                  <BirdPhoto
                    src={product.imageUrl}
                    alt={localized(product, "breed", locale)}
                    priority={i < 2}
                    sizes="(min-width: 1024px) 240px, 45vw"
                    fallback={{ color: product.shellColor, speckled: product.speckled, seed: product.slug }}
                    className="transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute inset-x-2 bottom-2 rounded-full bg-white/85 px-3 py-1 text-center text-xs font-semibold backdrop-blur">
                    {localized(product, "breed", locale)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="birds" className="container-page scroll-mt-20 py-16">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">{t("birdsTitle")}</h2>
          <p className="mt-2 text-bark-500">{t("birdsText")}</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {birds.map((bird) => {
            const sample = bird.products[0];
            return (
              <Link
                key={bird.id}
                href={{ pathname: "/eggs", query: { bird: bird.slug } }}
                className="card group flex items-center gap-4 p-4 transition hover:border-meadow-500/40 hover:bg-meadow-50"
              >
                <span className="relative size-16 shrink-0 overflow-hidden rounded-2xl bg-cream-100">
                  <BirdPhoto
                    src={sample?.imageUrl}
                    alt=""
                    sizes="64px"
                    fallback={{ color: sample?.shellColor ?? "#efe2cc", speckled: sample?.speckled, seed: `bird-${bird.slug}` }}
                    className="transition duration-500 group-hover:scale-110"
                    eggClassName="h-10"
                  />
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold">{localized(bird, "name", locale)}</span>
                  <span className="block text-xs text-bark-500">
                    {t("breeds", { count: bird._count.products })}
                  </span>
                  <span className="block text-xs text-bark-500">
                    {t("incubation", { days: bird.incubationDays })}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="container-page py-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">{t("featuredTitle")}</h2>
            <p className="mt-2 text-bark-500">{t("featuredText")}</p>
          </div>
          <Link href="/eggs" className="btn-ghost">
            {t("viewAll")}
            <ArrowRight className="size-4 rtl:rotate-180" />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <div className="rounded-[2rem] bg-meadow-800 px-6 py-12 text-cream-50 md:px-12">
          <h2 className="font-display text-3xl font-semibold md:text-4xl">{t("whyTitle")}</h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ icon: Icon, title, text }) => (
              <div key={title}>
                <span className="grid size-12 place-items-center rounded-2xl bg-yolk-400 text-bark-900">
                  <Icon className="size-6" />
                </span>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-cream-200/80">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
