/** Store-wide settings. Adjust these to match the farm. */
export const storeConfig = {
  /** ISO 4217 currency code used for every price. */
  currency: "USD",
  /** Flat shipping fee in cents; eggs are shipped in insulated boxes. */
  shippingCents: 1500,
  /** Orders at or above this subtotal ship for free (cents). */
  freeShippingThresholdCents: 15000,
  /** Maximum eggs of a single breed per order. */
  maxPerLine: 120,
  phone: "+1 555 0100",
  email: "hello@eggfarm.example",
} as const;

export const ORDER_STATUSES = [
  "PENDING",
  "CONFIRMED",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export function shippingFor(subtotalCents: number) {
  if (subtotalCents === 0) return 0;
  return subtotalCents >= storeConfig.freeShippingThresholdCents
    ? 0
    : storeConfig.shippingCents;
}
