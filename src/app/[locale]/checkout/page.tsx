import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CheckoutForm } from "@/components/checkout-form";
import { asLocale, setupLocale } from "@/i18n/locale";

export async function generateMetadata({ params }: PageProps<"/[locale]/checkout">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: asLocale(locale), namespace: "Checkout" });
  return { title: t("title") };
}

export default async function CheckoutPage({ params }: PageProps<"/[locale]/checkout">) {
  const { locale: rawLocale } = await params;
  setupLocale(rawLocale);
  const t = await getTranslations("Checkout");

  return (
    <div className="container-page py-10">
      <h1 className="mb-8 font-display text-4xl font-semibold">{t("title")}</h1>
      <CheckoutForm />
    </div>
  );
}
