import { ArrowRight, HeartPulse, PackageCheck, Sprout, Thermometer } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { EggArt } from "@/components/egg-art";
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

  const heroEggs = featured.slice(0, 5);

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

          <div className="relative mx-auto aspect-square w-full max-w-md" aria-hidden="true">
            <div className="absolute inset-6 rounded-full bg-yolk-300/50 blur-3xl" />
            <div className="absolute inset-10 rounded-full border-2 border-dashed border-bark-500/20" />
            {heroEggs.map((egg, i) => {
              const angle = (i / heroEggs.length) * Math.PI * 2 - Math.PI / 2;
              return (
                <EggArt
                  key={egg.id}
                  color={egg.shellColor}
                  speckled={egg.speckled}
                  seed={egg.slug}
                  className="absolute w-[22%]"
                  style={{
                    left: `${50 + Math.cos(angle) * 34 - 11}%`,
                    top: `${50 + Math.sin(angle) * 34 - 14}%`,
                    rotate: `${(i % 2 ? 1 : -1) * (8 + i * 3)}deg`,
                  }}
                />
              );
            })}
            <EggArt
              color="#f3d9a4"
              seed="hero-center"
              className="absolute left-1/2 top-1/2 w-[34%] -translate-x-1/2 -translate-y-1/2"
            />
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
                <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-cream-100">
                  <EggArt
                    color={sample?.shellColor ?? "#efe2cc"}
                    speckled={sample?.speckled}
                    seed={`bird-${bird.slug}`}
                    className="h-10 transition group-hover:-rotate-12"
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
