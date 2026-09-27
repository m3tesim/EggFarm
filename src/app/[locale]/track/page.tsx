import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { TrackForm } from "@/components/track-form";
import { asLocale, setupLocale } from "@/i18n/locale";

export async function generateMetadata({ params }: PageProps<"/[locale]/track">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: asLocale(locale), namespace: "Track" });
  return { title: t("title") };
}

export default async function TrackPage({ params, searchParams }: PageProps<"/[locale]/track">) {
  const { locale: rawLocale } = await params;
  setupLocale(rawLocale);
  const { code } = await searchParams;
  const t = await getTranslations("Track");

  return (
    <div className="container-page max-w-lg py-14">
      <h1 className="font-display text-4xl font-semibold">{t("title")}</h1>
      <p className="mb-8 mt-2 text-bark-500">{t("text")}</p>
      <TrackForm defaultCode={typeof code === "string" ? code : undefined} />
    </div>
  );
}
