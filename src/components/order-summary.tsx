"use client";

import { useLocale, useTranslations } from "next-intl";
import { type CartItem, cartSubtotal } from "@/lib/cart-store";
import { shippingFor, storeConfig } from "@/lib/config";
import { formatMoney } from "@/lib/format";

export function OrderTotals({ items }: { items: CartItem[] }) {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const subtotal = cartSubtotal(items);
  const shipping = shippingFor(subtotal);
  const remaining = storeConfig.freeShippingThresholdCents - subtotal;

  return (
    <dl className="space-y-2.5 text-sm">
      <div className="flex justify-between">
        <dt className="text-bark-500">{t("subtotal")}</dt>
        <dd className="font-medium">{formatMoney(subtotal, locale)}</dd>
      </div>
      <div className="flex justify-between">
        <dt className="text-bark-500">{t("shipping")}</dt>
        <dd className="font-medium">{shipping === 0 ? t("free") : formatMoney(shipping, locale)}</dd>
      </div>
      {remaining > 0 && (
        <p className="rounded-xl bg-yolk-300/30 px-3 py-2 text-xs text-bark-700">
          {t("freeShippingHint", { amount: formatMoney(remaining, locale) })}
        </p>
      )}
      <div className="flex justify-between border-t border-bark-900/10 pt-3 text-base">
        <dt className="font-semibold">{t("total")}</dt>
        <dd className="font-bold text-meadow-700">{formatMoney(subtotal + shipping, locale)}</dd>
      </div>
    </dl>
  );
}
