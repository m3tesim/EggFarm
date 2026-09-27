"use client";

import { Languages } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

export function LocaleSwitcher({ label }: { label: string }) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function switchLocale() {
    const next = locale === "ar" ? "en" : "ar";
    const query = searchParams.toString();
    startTransition(() => {
      router.replace(query ? `${pathname}?${query}` : pathname, { locale: next });
    });
  }

  return (
    <button
      type="button"
      onClick={switchLocale}
      disabled={pending}
      lang={locale === "ar" ? "en" : "ar"}
      className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-bark-700 transition hover:bg-cream-200 disabled:opacity-60"
    >
      <Languages className="size-4" />
      {label}
    </button>
  );
}
