"use client";

import { Banknote, Loader2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useActionState } from "react";
import { Link } from "@/i18n/navigation";
import { type CheckoutField, type CheckoutState, placeOrder } from "@/lib/actions/orders";
import { useCart, useCartHydrated } from "@/lib/cart-store";
import { formatMoney } from "@/lib/format";
import { EggArt } from "./egg-art";
import { OrderTotals } from "./order-summary";

export function CheckoutForm() {
  const t = useTranslations("Checkout");
  const locale = useLocale();
  const hydrated = useCartHydrated();
  const items = useCart((s) => s.items);
  const [state, action, pending] = useActionState<CheckoutState, FormData>(placeOrder, {});

  if (!hydrated) return <div className="card h-96 animate-pulse bg-cream-100" />;

  if (items.length === 0) {
    return (
      <div className="card px-6 py-16 text-center">
        <p className="text-lg font-semibold">{t("emptyCart")}</p>
        <Link href="/eggs" className="btn-primary mt-6">
          {t("title")}
        </Link>
      </div>
    );
  }

  const field = (name: CheckoutField | "notes", label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}) => {
    const invalid = name !== "notes" && state.fieldErrors?.[name];
    return (
      <div>
        <label htmlFor={name} className="label">
          {label}
        </label>
        <input
          id={name}
          name={name}
          defaultValue={state.values?.[name]}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid ? `${name}-error` : undefined}
          className="input"
          {...props}
        />
        {invalid && (
          <p id={`${name}-error`} className="mt-1 text-xs text-red-600">
            {t(`validation.${name}`)}
          </p>
        )}
      </div>
    );
  };

  return (
    <form action={action} className="grid gap-8 lg:grid-cols-[1fr_24rem]">
      <input
        type="hidden"
        name="items"
        value={JSON.stringify(items.map((i) => ({ productId: i.productId, quantity: i.quantity })))}
      />

      <div className="space-y-6">
        {state.error && (
          <p role="alert" className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {t(`errors.${state.error.key}`, state.error.values as Record<string, string>)}
          </p>
        )}

        <section className="card space-y-4 p-6">
          <h2 className="text-lg font-semibold">{t("details")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {field("name", t("name"), { autoComplete: "name", required: true, minLength: 2 })}
            {field("phone", t("phone"), { type: "tel", autoComplete: "tel", required: true, dir: "ltr" })}
          </div>
          {field("email", t("email"), { type: "email", autoComplete: "email", dir: "ltr" })}
          <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
            {field("city", t("city"), { autoComplete: "address-level2", required: true })}
            {field("address", t("address"), { autoComplete: "street-address", required: true })}
          </div>
          <div>
            <label htmlFor="notes" className="label">
              {t("notes")}
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              maxLength={1000}
              defaultValue={state.values?.notes}
              placeholder={t("notesPlaceholder")}
              className="input"
            />
          </div>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-semibold">{t("payment")}</h2>
          <div className="mt-4 flex gap-3 rounded-2xl border-2 border-meadow-500 bg-meadow-50 p-4">
            <Banknote className="size-6 shrink-0 text-meadow-700" />
            <div>
              <p className="font-semibold">{t("cod")}</p>
              <p className="text-sm text-bark-500">{t("codText")}</p>
            </div>
          </div>
        </section>
      </div>

      <aside className="card h-fit space-y-5 p-5 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold">{t("summary")}</h2>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-3 text-sm">
              <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-cream-100">
                <EggArt color={item.shellColor} speckled={item.speckled} seed={item.slug} className="h-8" />
              </span>
              <span className="flex-1">
                <span className="block font-medium">{locale === "ar" ? item.breedAr : item.breedEn}</span>
                <span className="text-bark-500">× {item.quantity}</span>
              </span>
              <span className="font-semibold">{formatMoney(item.priceCents * item.quantity, locale)}</span>
            </li>
          ))}
        </ul>
        <OrderTotals items={items} />
        <button type="submit" disabled={pending} className="btn-primary w-full py-3 text-base">
          {pending && <Loader2 className="size-4 animate-spin" />}
          {pending ? t("placing") : t("placeOrder")}
        </button>
      </aside>
    </form>
  );
}
