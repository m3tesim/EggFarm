import { Star } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { formatMoney, localized } from "@/lib/format";
import type { ProductWithBird } from "@/lib/product-utils";
import { BirdPhoto } from "./bird-photo";

export async function ProductCard({ product }: { product: ProductWithBird }) {
  const locale = await getLocale();
  const t = await getTranslations("Product");
  const soldOut = product.stock < product.minOrder;
  const breed = localized(product, "breed", locale);
  const bird = localized(product.bird, "name", locale);

  return (
    <Link
      href={`/eggs/${product.slug}`}
      className="card group flex flex-col overflow-hidden transition hover:-translate-y-0.5 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-b from-cream-100 to-cream-200">
        <BirdPhoto
          src={product.imageUrl}
          alt={t("photoAlt", { breed, bird })}
          fallback={{ color: product.shellColor, speckled: product.speckled, seed: product.slug }}
          className="transition duration-500 group-hover:scale-105"
        />
        <span className="absolute start-3 top-3 rounded-full bg-white/85 px-2.5 py-1 text-xs font-semibold text-meadow-700 backdrop-blur">
          {bird}
        </span>
        {product.featured && (
          <span className="absolute end-3 top-3 grid size-7 place-items-center rounded-full bg-yolk-400 text-bark-900" title={t("featured")}>
            <Star className="size-3.5 fill-current" />
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-display text-lg font-semibold leading-snug">
          {breed}
        </h3>
        <p className="line-clamp-2 text-sm text-bark-500">
          {localized(product, "description", locale)}
        </p>
        <div className="mt-auto flex items-end justify-between pt-3">
          <p>
            <span className="text-lg font-bold text-meadow-700">
              {formatMoney(product.priceCents, locale)}
            </span>{" "}
            <span className="text-xs text-bark-500">{t("perEgg")}</span>
          </p>
          <span className={soldOut ? "text-xs font-medium text-red-600" : "text-xs text-bark-500"}>
            {soldOut ? t("outOfStock") : t("minOrder", { count: product.minOrder })}
          </span>
        </div>
      </div>
    </Link>
  );
}
