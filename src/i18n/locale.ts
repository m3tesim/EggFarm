import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { type Locale, routing } from "./routing";

/** Validates the `[locale]` segment, enables static rendering and returns the typed locale. */
export function setupLocale(value: string): Locale {
  if (!hasLocale(routing.locales, value)) notFound();
  setRequestLocale(value);
  return value;
}

export function asLocale(value: string): Locale {
  return hasLocale(routing.locales, value) ? value : routing.defaultLocale;
}
