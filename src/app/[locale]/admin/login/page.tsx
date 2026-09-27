import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { LoginForm } from "@/components/admin/login-form";
import { redirect } from "@/i18n/navigation";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { setupLocale } from "@/i18n/locale";

export const metadata: Metadata = { robots: { index: false } };

export default async function AdminLoginPage({ params }: PageProps<"/[locale]/admin/login">) {
  const { locale: rawLocale } = await params;
  const locale = setupLocale(rawLocale);
  if (await isAdmin()) redirect({ href: "/admin", locale });
  const t = await getTranslations("Admin");

  return (
    <div className="container-page max-w-sm py-20">
      <h1 className="mb-6 text-center font-display text-3xl font-semibold">{t("login")}</h1>
      {adminConfigured() ? (
        <LoginForm />
      ) : (
        <p className="card p-6 text-sm text-bark-700">{t("notConfigured")}</p>
      )}
    </div>
  );
}
