"use client";

import { ShoppingBasket } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { useCart, useCartHydrated } from "@/lib/cart-store";

export function CartButton({ label }: { label: string }) {
  const hydrated = useCartHydrated();
  const count = useCart((s) => s.items.length);

  return (
    <Link
      href="/cart"
      aria-label={label}
      className="relative grid size-10 place-items-center rounded-full text-bark-700 transition hover:bg-cream-200"
    >
      <ShoppingBasket className="size-5" />
      {hydrated && count > 0 && (
        <span className="absolute -end-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-meadow-700 px-1 text-[11px] font-bold text-cream-50">
          {count}
        </span>
      )}
    </Link>
  );
}
