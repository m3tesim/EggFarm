import { LogOut } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { logout } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = { robots: { index: false } };

export default async function AdminLayout({ children }: LayoutProps<"/[locale]/admin">) {
  await requireAdmin();
  const t = await getTranslations("Admin");

  return (
    <div className="container-page py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-semibold">{t("title")}</h1>
        <div className="flex items-center gap-2">
          <Link href="/admin" className="btn-ghost">{t("orders")}</Link>
          <Link href="/admin/products" className="btn-ghost">{t("products")}</Link>
          <form action={logout}>
            <button type="submit" className="btn text-bark-500 hover:text-bark-900">
              <LogOut className="size-4 rtl:rotate-180" />
              {t("signOut")}
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
}
