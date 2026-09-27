import { storeConfig } from "./config";

export function formatMoney(cents: number, locale: string) {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en-US", {
    style: "currency",
    currency: storeConfig.currency,
  }).format(cents / 100);
}

export function formatDate(date: Date | string, locale: string) {
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-EG" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

/** Pick the English or Arabic variant of a bilingual field. */
export function localized<T extends Record<string, unknown>>(
  record: T,
  field: string,
  locale: string,
): string {
  const suffix = locale === "ar" ? "Ar" : "En";
  return String(record[`${field}${suffix}`] ?? "");
}
