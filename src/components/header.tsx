import { Egg } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { Link } from "@/i18n/navigation";
import { CartButton } from "./cart-button";
import { LocaleSwitcher } from "./locale-switcher";
import { MobileMenu } from "./mobile-menu";

export async function Header() {
  const t = await getTranslations("Nav");
  const brand = await getTranslations("Brand");

  const links = [
    { href: "/", label: t("home") },
    { href: "/eggs", label: t("shop") },
    { href: "/track", label: t("track") },
  ] as const;

  return (
    <header className="sticky top-0 z-40 border-b border-bark-900/10 bg-cream-50/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center gap-4">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full bg-yolk-400 text-bark-900 shadow-sm">
            <Egg className="size-5" strokeWidth={2.25} />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-semibold">{brand("name")}</span>
            <span className="block text-xs text-bark-500">{brand("tagline")}</span>
          </span>
        </Link>

        <nav className="ms-8 hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-bark-700 transition hover:bg-cream-200 hover:text-bark-900"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex items-center gap-2">
          <Suspense>
            <LocaleSwitcher label={t("language")} />
          </Suspense>
          <CartButton label={t("cart")} />
          <MobileMenu
            links={links.map((l) => ({ href: l.href, label: l.label }))}
            openLabel={t("openMenu")}
            closeLabel={t("closeMenu")}
          />
        </div>
      </div>
    </header>
  );
}
