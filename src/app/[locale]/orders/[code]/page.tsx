import { CheckCircle2 } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { ClearCart } from "@/components/clear-cart";
import { StatusBadge } from "@/components/status-badge";
import { redirect } from "@/i18n/navigation";
import { ORDER_STATUSES } from "@/lib/config";
import { db } from "@/lib/db";
import { formatDate, formatMoney } from "@/lib/format";
import { getAccessibleOrderCodes } from "@/lib/order-access";
import { setupLocale } from "@/i18n/locale";

export const metadata: Metadata = { robots: { index: false } };

export default async function OrderPage({ params, searchParams }: PageProps<"/[locale]/orders/[code]">) {
  const { locale: rawLocale, code } = await params;
  const locale = setupLocale(rawLocale);
  const { placed } = await searchParams;

  const allowed = (await getAccessibleOrderCodes()).includes(code);
  const order = allowed
    ? await db.order.findUnique({ where: { code }, include: { items: true } })
    : null;
  if (!order) redirect({ href: { pathname: "/track", query: { code } }, locale });

  const t = await getTranslations("Order");
  const cart = await getTranslations("Cart");
  const steps = ORDER_STATUSES.filter((s) => s !== "CANCELLED");
  const currentStep = steps.indexOf(order!.status as (typeof steps)[number]);

  return (
    <div className="container-page max-w-3xl py-12">
      {placed && <ClearCart />}
      {placed && (
        <div className="mb-8 text-center">
          <CheckCircle2 className="mx-auto size-14 text-meadow-600" />
          <h1 className="mt-4 font-display text-4xl font-semibold">
            {t("thanks", { name: order!.customerName.split(" ")[0] })}
          </h1>
          <p className="mt-2 text-bark-500">{t("received")}</p>
        </div>
      )}

      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-cream-100 p-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-bark-500">{t("reference")}</p>
            <p className="mt-1 font-mono text-2xl font-bold" dir="ltr">
              {order!.code}
            </p>
            <p className="mt-1 text-xs text-bark-500">{t("keep")}</p>
          </div>
          <div className="text-end">
            <StatusBadge status={order!.status} />
            <p className="mt-2 text-xs text-bark-500">
              {t("placedOn")}: {formatDate(order!.createdAt, locale)}
            </p>
          </div>
        </div>

        {order!.status !== "CANCELLED" && (
          <ol className="grid grid-cols-4 gap-2 border-b border-bark-900/10 px-6 py-5">
            {steps.map((step, i) => (
              <li key={step} className="text-center">
                <div
                  className={`mx-auto h-1.5 rounded-full ${i <= currentStep ? "bg-meadow-600" : "bg-cream-300"}`}
                />
                <p className={`mt-2 text-xs ${i <= currentStep ? "font-semibold" : "text-bark-500"}`}>
                  {t(`statuses.${step}`)}
                </p>
              </li>
            ))}
          </ol>
        )}

        <div className="grid gap-8 p-6 md:grid-cols-2">
          <section>
            <h2 className="font-semibold">{t("items")}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {order!.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <span>
                    {locale === "ar" ? item.nameAr : item.nameEn}{" "}
                    <span className="text-bark-500">× {item.quantity}</span>
                  </span>
                  <span className="font-medium">
                    {formatMoney(item.unitPriceCents * item.quantity, locale)}
                  </span>
                </li>
              ))}
            </ul>
            <dl className="mt-4 space-y-1.5 border-t border-bark-900/10 pt-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-bark-500">{cart("subtotal")}</dt>
                <dd>{formatMoney(order!.subtotalCents, locale)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-bark-500">{cart("shipping")}</dt>
                <dd>{order!.shippingCents === 0 ? cart("free") : formatMoney(order!.shippingCents, locale)}</dd>
              </div>
              <div className="flex justify-between text-base font-bold">
                <dt>{cart("total")}</dt>
                <dd className="text-meadow-700">{formatMoney(order!.totalCents, locale)}</dd>
              </div>
            </dl>
          </section>
          <section>
            <h2 className="font-semibold">{t("deliverTo")}</h2>
            <address className="mt-3 space-y-1 text-sm not-italic text-bark-700">
              <p className="font-medium text-bark-900">{order!.customerName}</p>
              <p dir="ltr" className="text-start">{order!.phone}</p>
              {order!.email && <p>{order!.email}</p>}
              <p>
                {order!.address}, {order!.city}
              </p>
              {order!.notes && <p className="pt-2 text-bark-500">{order!.notes}</p>}
            </address>
          </section>
        </div>
      </div>
    </div>
  );
}
