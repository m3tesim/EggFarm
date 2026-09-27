import { Egg, Mail, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { storeConfig } from "@/lib/config";

export async function Footer() {
  const t = await getTranslations("Footer");
  const nav = await getTranslations("Nav");
  const brand = await getTranslations("Brand");

  return (
    <footer className="mt-24 bg-meadow-900 text-cream-100">
      <div className="container-page grid gap-10 py-14 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-yolk-400 text-bark-900">
              <Egg className="size-5" strokeWidth={2.25} />
            </span>
            <span className="font-display text-xl font-semibold">{brand("name")}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream-200/80">{t("about")}</p>
        </div>
        <nav className="flex flex-col gap-2 text-sm">
          <Link href="/eggs" className="hover:text-yolk-300">{nav("shop")}</Link>
          <Link href="/track" className="hover:text-yolk-300">{nav("track")}</Link>
          <Link href="/cart" className="hover:text-yolk-300">{nav("cart")}</Link>
          <Link href="/admin" className="hover:text-yolk-300">{nav("admin")}</Link>
        </nav>
        <div className="text-sm">
          <h2 className="font-semibold text-cream-50">{t("contact")}</h2>
          <p className="mt-3 flex items-center gap-2 text-cream-200/80">
            <Phone className="size-4" />
            <span dir="ltr">{storeConfig.phone}</span>
          </p>
          <p className="mt-2 flex items-center gap-2 text-cream-200/80">
            <Mail className="size-4" />
            {storeConfig.email}
          </p>
        </div>
      </div>
      <div className="border-t border-cream-50/10 py-5 text-center text-xs text-cream-200/60">
        © {new Date().getFullYear()} {brand("name")}. {t("rights")}
      </div>
    </footer>
  );
}
