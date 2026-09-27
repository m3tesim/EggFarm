import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { CartView } from "@/components/cart-view";
import { asLocale, setupLocale } from "@/i18n/locale";

export async function generateMetadata({ params }: PageProps<"/[locale]/cart">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: asLocale(locale), namespace: "Cart" });
  return { title: t("title") };
}

export default async function CartPage({ params }: PageProps<"/[locale]/cart">) {
  const { locale: rawLocale } = await params;
  setupLocale(rawLocale);
  const t = await getTranslations("Cart");

  return (
    <div className="container-page py-10">
      <h1 className="mb-8 font-display text-4xl font-semibold">{t("title")}</h1>
      <CartView />
    </div>
  );
}
