"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { storeConfig } from "./config";

export type CartProduct = {
  productId: string;
  slug: string;
  breedEn: string;
  breedAr: string;
  priceCents: number;
  minOrder: number;
  stock: number;
  shellColor: string;
  speckled: boolean;
  imageUrl: string | null;
};

export type CartItem = CartProduct & { quantity: number };

type CartState = {
  items: CartItem[];
  add: (product: CartProduct, quantity: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  remove: (productId: string) => void;
  clear: () => void;
};

export function clampQuantity(
  quantity: number,
  item: Pick<CartProduct, "minOrder" | "stock">,
) {
  const max = Math.min(item.stock, storeConfig.maxPerLine);
  return Math.max(item.minOrder, Math.min(max, Math.round(quantity)));
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (product, quantity) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === product.productId);
          const nextQuantity = clampQuantity((existing?.quantity ?? 0) + quantity, product);
          const rest = state.items.filter((i) => i.productId !== product.productId);
          return { items: [...rest, { ...product, quantity: nextQuantity }] };
        }),
      setQuantity: (productId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId ? { ...i, quantity: clampQuantity(quantity, i) } : i,
          ),
        })),
      remove: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
      clear: () => set({ items: [] }),
    }),
    { name: "eggfarm-cart", storage: createJSONStorage(() => localStorage) },
  ),
);

/** True once the persisted cart has been read from localStorage. */
export function useCartHydrated() {
  return useSyncExternalStore(
    (onChange) => useCart.persist.onFinishHydration(onChange),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.priceCents * i.quantity, 0);
}

/** Replace cached product data with fresh server data, dropping unavailable items. */
export function syncCart(fresh: CartProduct[]) {
  const byId = new Map(fresh.map((p) => [p.productId, p]));
  useCart.setState((state) => ({
    items: state.items.flatMap((item) => {
      const product = byId.get(item.productId);
      if (!product || product.stock < product.minOrder) return [];
      return [{ ...product, quantity: clampQuantity(item.quantity, product) }];
    }),
  }));
}
