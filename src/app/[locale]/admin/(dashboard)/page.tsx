import { AlertTriangle, Clock, Wallet } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { StatusBadge } from "@/components/status-badge";
import { Link } from "@/i18n/navigation";
import type { Prisma } from "@/generated/prisma/client";
import { updateOrderStatus } from "@/lib/actions/admin";
import { requireAdmin } from "@/lib/admin-auth";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/config";
import { db } from "@/lib/db";
import { formatDate, formatMoney } from "@/lib/format";
import { setupLocale } from "@/i18n/locale";

export default async function AdminOrdersPage({ params, searchParams }: PageProps<"/[locale]/admin">) {
  const { locale: rawLocale } = await params;
  const locale = setupLocale(rawLocale);
  await requireAdmin();
  const t = await getTranslations("Admin");
  const statusT = await getTranslations("Order.statuses");

  const sp = await searchParams;
  const status = ORDER_STATUSES.includes(sp.status as OrderStatus) ? (sp.status as OrderStatus) : undefined;
  const q = typeof sp.q === "string" ? sp.q.trim().slice(0, 60) : "";

  const where: Prisma.OrderWhereInput = {
    status,
    OR: q
      ? [{ code: { contains: q.toUpperCase() } }, { customerName: { contains: q } }, { phone: { contains: q } }]
      : undefined,
  };

  const [orders, revenue, pending, lowStock] = await Promise.all([
    db.order.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 100,
    }),
    db.order.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { totalCents: true } }),
    db.order.count({ where: { status: "PENDING" } }),
    db.product.count({ where: { active: true, stock: { lt: 20 } } }),
  ]);

  const stats = [
    { icon: Wallet, label: t("revenue"), value: formatMoney(revenue._sum.totalCents ?? 0, locale) },
    { icon: Clock, label: t("pendingOrders"), value: pending.toLocaleString(locale) },
    { icon: AlertTriangle, label: t("lowStock"), value: lowStock.toLocaleString(locale) },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map(({ icon: Icon, label, value }) => (
          <div key={label} className="card flex items-center gap-4 p-5">
            <span className="grid size-11 place-items-center rounded-2xl bg-yolk-300/40">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-sm text-bark-500">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Link href="/admin" className={!status ? "btn-primary" : "btn-ghost"}>{t("all")}</Link>
        {ORDER_STATUSES.map((s) => (
          <Link key={s} href={{ pathname: "/admin", query: { status: s } }} className={status === s ? "btn-primary" : "btn-ghost"}>
            {statusT(s)}
          </Link>
        ))}
        <form className="ms-auto">
          {status && <input type="hidden" name="status" value={status} />}
          <input type="search" name="q" defaultValue={q} placeholder={t("search")} className="input w-56" />
        </form>
      </div>

      <div className="card overflow-x-auto">
        {orders.length === 0 ? (
          <p className="p-10 text-center text-bark-500">{t("noOrders")}</p>
        ) : (
          <table className="w-full min-w-[56rem] text-sm">
            <thead className="bg-cream-100 text-start text-xs uppercase tracking-wide text-bark-500">
              <tr>
                <th className="p-3 text-start">#</th>
                <th className="p-3 text-start">{t("customer")}</th>
                <th className="p-3 text-start">{t("items")}</th>
                <th className="p-3 text-start">{t("total")}</th>
                <th className="p-3 text-start">{t("date")}</th>
                <th className="p-3 text-start">{t("status")}</th>
                <th className="p-3 text-start">{t("actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-bark-900/10">
              {orders.map((order) => (
                <tr key={order.id} className="align-top">
                  <td className="p-3 font-mono text-xs" dir="ltr">{order.code}</td>
                  <td className="p-3">
                    <p className="font-medium">{order.customerName}</p>
                    <p className="text-xs text-bark-500" dir="ltr">{order.phone}</p>
                    <p className="text-xs text-bark-500">{order.city} — {order.address}</p>
                    {order.notes && <p className="mt-1 text-xs italic text-bark-500">{order.notes}</p>}
                  </td>
                  <td className="p-3 text-xs">
                    {order.items.map((i) => (
                      <p key={i.id}>{locale === "ar" ? i.nameAr : i.nameEn} × {i.quantity}</p>
                    ))}
                  </td>
                  <td className="p-3 font-semibold">{formatMoney(order.totalCents, locale)}</td>
                  <td className="p-3 text-xs text-bark-500">{formatDate(order.createdAt, locale)}</td>
                  <td className="p-3"><StatusBadge status={order.status} /></td>
                  <td className="p-3">
                    {order.status !== "CANCELLED" && (
                      <form action={updateOrderStatus} className="flex gap-2">
                        <input type="hidden" name="orderId" value={order.id} />
                        <select name="status" defaultValue={order.status} className="input w-auto py-1.5 text-xs">
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{statusT(s)}</option>
                          ))}
                        </select>
                        <button type="submit" className="btn-ghost px-3 py-1.5 text-xs">{t("update")}</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
