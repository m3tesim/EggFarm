"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart-store";

/** Empties the cart once an order has been placed. */
export function ClearCart() {
  useEffect(() => {
    useCart.getState().clear();
  }, []);
  return null;
}
