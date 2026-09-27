import { getTranslations } from "next-intl/server";
import { clsx } from "clsx";
import type { OrderStatus } from "@/lib/config";

const styles: Record<OrderStatus, string> = {
  PENDING: "bg-yolk-300/40 text-bark-900",
  CONFIRMED: "bg-sky-100 text-sky-800",
  SHIPPED: "bg-violet-100 text-violet-800",
  DELIVERED: "bg-meadow-100 text-meadow-800",
  CANCELLED: "bg-red-100 text-red-700",
};

export async function StatusBadge({ status }: { status: string }) {
  const t = await getTranslations("Order.statuses");
  const key = (status in styles ? status : "PENDING") as OrderStatus;
  return (
    <span className={clsx("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", styles[key])}>
      {t(key)}
    </span>
  );
}
