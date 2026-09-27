"use client";

import { Check, ShoppingBasket } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { type CartProduct, clampQuantity, useCart } from "@/lib/cart-store";
import { storeConfig } from "@/lib/config";
import { formatMoney } from "@/lib/format";
import { QuantityStepper } from "./quantity-stepper";

export function AddToCart({ product }: { product: CartProduct }) {
  const t = useTranslations("Product");
  const locale = useLocale();
  const add = useCart((s) => s.add);
  const [quantity, setQuantity] = useState(product.minOrder);
  const [added, setAdded] = useState(false);
  const soldOut = product.stock < product.minOrder;
  const max = Math.min(product.stock, storeConfig.maxPerLine);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1800);
    return () => clearTimeout(timer);
  }, [added]);

  if (soldOut) {
    return (
      <button type="button" className="btn-ghost w-full" disabled>
        {t("outOfStock")}
      </button>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <QuantityStepper
          value={quantity}
          min={product.minOrder}
          max={max}
          onChange={(v) => setQuantity(clampQuantity(v, product))}
        />
        <p className="text-sm text-bark-500">
          {t("lineTotal")}:{" "}
          <span className="text-base font-bold text-bark-900">
            {formatMoney(product.priceCents * quantity, locale)}
          </span>
        </p>
      </div>
      <button
        type="button"
        className="btn-primary w-full py-3.5 text-base"
        onClick={() => {
          add(product, quantity);
          setAdded(true);
        }}
      >
        {added ? <Check className="size-5" /> : <ShoppingBasket className="size-5" />}
        {added ? t("added") : t("addToCart")}
      </button>
    </div>
  );
}
