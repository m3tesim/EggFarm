"use client";

import { ArrowRight, ShoppingBasket, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { refreshCartProducts } from "@/lib/actions/cart";
import { syncCart, useCart, useCartHydrated } from "@/lib/cart-store";
import { storeConfig } from "@/lib/config";
import { formatMoney } from "@/lib/format";
import { EggArt } from "./egg-art";
import { OrderTotals } from "./order-summary";
import { QuantityStepper } from "./quantity-stepper";

export function CartView() {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const hydrated = useCartHydrated();
  const items = useCart((s) => s.items);
  const setQuantity = useCart((s) => s.setQuantity);
  const remove = useCart((s) => s.remove);

  useEffect(() => {
    if (!hydrated) return;
    const ids = useCart.getState().items.map((i) => i.productId);
    if (ids.length) refreshCartProducts(ids).then(syncCart);
  }, [hydrated]);

  if (!hydrated) {
    return <div className="card h-64 animate-pulse bg-cream-100" />;
  }

  if (items.length === 0) {
    return (
      <div className="card grid place-items-center px-6 py-20 text-center">
        <ShoppingBasket className="size-12 text-bark-500" />
        <p className="mt-4 text-lg font-semibold">{t("empty")}</p>
        <Link href="/eggs" className="btn-primary mt-6">
          {t("continue")}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
      <ul className="card divide-y divide-bark-900/10">
        {items.map((item) => {
          const name = locale === "ar" ? item.breedAr : item.breedEn;
          return (
            <li key={item.productId} className="flex flex-wrap items-center gap-4 p-4 sm:flex-nowrap">
              <Link
                href={`/eggs/${item.slug}`}
                className="grid size-20 shrink-0 place-items-center rounded-2xl bg-cream-100"
              >
                <EggArt color={item.shellColor} speckled={item.speckled} seed={item.slug} className="h-14" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/eggs/${item.slug}`} className="font-semibold hover:text-meadow-700">
                  {name}
                </Link>
                <p className="text-sm text-bark-500">
                  {formatMoney(item.priceCents, locale)} × {t("eggs", { count: item.quantity })}
                </p>
              </div>
              <QuantityStepper
                size="sm"
                value={item.quantity}
                min={item.minOrder}
                max={Math.min(item.stock, storeConfig.maxPerLine)}
                onChange={(v) => setQuantity(item.productId, v)}
              />
              <p className="w-24 text-end font-bold">
                {formatMoney(item.priceCents * item.quantity, locale)}
              </p>
              <button
                type="button"
                onClick={() => remove(item.productId)}
                className="grid size-9 place-items-center rounded-full text-bark-500 hover:bg-red-50 hover:text-red-600"
                aria-label={t("remove")}
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          );
        })}
      </ul>

      <aside className="card h-fit space-y-5 p-5 lg:sticky lg:top-24">
        <OrderTotals items={items} />
        <Link href="/checkout" className="btn-primary w-full py-3">
          {t("checkout")}
          <ArrowRight className="size-4 rtl:rotate-180" />
        </Link>
        <Link href="/eggs" className="block text-center text-sm font-medium text-bark-500 hover:text-bark-900">
          {t("continue")}
        </Link>
      </aside>
    </div>
  );
}
