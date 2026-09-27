"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { type FormEvent, useOptimistic, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";

type BirdOption = { slug: string; name: string; count: number };

type Props = {
  birds: BirdOption[];
  priceBounds: { min: number; max: number };
  currencySymbol: string;
};

export function ShopFilters({ birds, priceBounds, currencySymbol }: Props) {
  const t = useTranslations("Shop");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  // Optimistic copy of the URL state so checkboxes respond instantly while navigating.
  const [optimisticParams, setOptimisticParams] = useOptimistic(searchParams.toString());
  const current = new URLSearchParams(optimisticParams);
  const selectedBirds = (current.get("bird") ?? "").split(",").filter(Boolean);

  function navigate(update: (params: URLSearchParams) => void) {
    const params = new URLSearchParams(optimisticParams);
    update(params);
    params.delete("page");
    const query = params.toString();
    startTransition(() => {
      setOptimisticParams(query);
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
    });
  }

  function setParam(params: URLSearchParams, key: string, value: string | null | undefined) {
    if (value) params.set(key, value);
    else params.delete(key);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    navigate((params) => {
      setParam(params, "q", String(form.get("q") ?? "").trim());
      setParam(params, "min", String(form.get("min") ?? ""));
      setParam(params, "max", String(form.get("max") ?? ""));
    });
  }

  function toggleBird(slug: string) {
    const next = selectedBirds.includes(slug)
      ? selectedBirds.filter((b) => b !== slug)
      : [...selectedBirds, slug];
    navigate((params) => setParam(params, "bird", next.join(",")));
  }

  const minPlaceholder = Math.floor(priceBounds.min / 100).toString();
  const maxPlaceholder = Math.ceil(priceBounds.max / 100).toString();
  const hasFilters = ["q", "bird", "min", "max", "stock"].some((k) => current.has(k));

  return (
    <div className={pending ? "opacity-70 transition" : "transition"}>
      <form onSubmit={onSubmit} key={searchParams.toString()} className="space-y-6">
        <div className="relative">
          <Search className="pointer-events-none absolute start-3.5 top-1/2 size-4 -translate-y-1/2 text-bark-500" />
          <input
            type="search"
            name="q"
            defaultValue={searchParams.get("q") ?? ""}
            placeholder={t("searchPlaceholder")}
            aria-label={t("search")}
            className="input ps-10"
          />
        </div>

        <details open>
          <summary className="flex cursor-pointer list-none items-center gap-2 font-semibold md:hidden">
            <SlidersHorizontal className="size-4" />
            {t("filters")}
          </summary>

          <div className="mt-4 space-y-6 md:mt-0">
            <fieldset>
              <legend className="label">{t("bird")}</legend>
              <div className="flex flex-wrap gap-2 md:flex-col md:gap-1">
                {birds.map((bird) => {
                  const checked = selectedBirds.includes(bird.slug);
                  return (
                    <label
                      key={bird.slug}
                      className={`flex cursor-pointer items-center gap-2.5 rounded-xl border px-3 py-2 text-sm transition md:border-transparent ${
                        checked
                          ? "border-meadow-500 bg-meadow-50 font-semibold text-meadow-800"
                          : "border-bark-900/10 hover:bg-cream-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleBird(bird.slug)}
                        className="size-4 accent-meadow-600"
                      />
                      <span className="flex-1">{bird.name}</span>
                      <span className="text-xs text-bark-500">{bird.count}</span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <fieldset>
              <legend className="label">
                {t("price")} ({currencySymbol})
              </legend>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  name="min"
                  min={0}
                  step="0.1"
                  inputMode="decimal"
                  defaultValue={searchParams.get("min") ?? ""}
                  placeholder={minPlaceholder}
                  aria-label={t("min")}
                  className="input"
                />
                <span className="text-bark-500">–</span>
                <input
                  type="number"
                  name="max"
                  min={0}
                  step="0.1"
                  inputMode="decimal"
                  defaultValue={searchParams.get("max") ?? ""}
                  placeholder={maxPlaceholder}
                  aria-label={t("max")}
                  className="input"
                />
              </div>
            </fieldset>

            <label className="flex cursor-pointer items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={current.get("stock") === "1"}
                onChange={(e) =>
                  navigate((params) => setParam(params, "stock", e.target.checked ? "1" : null))
                }
                className="size-4 accent-meadow-600"
              />
              {t("inStock")}
            </label>

            <div className="flex gap-2">
              <button type="submit" className="btn-primary flex-1">
                {t("apply")}
              </button>
              {hasFilters && (
                <button
                  type="button"
                  className="btn-ghost"
                  onClick={() =>
                    navigate((params) => {
                      for (const key of ["q", "bird", "min", "max", "stock"]) params.delete(key);
                    })
                  }
                >
                  <X className="size-4" />
                  {t("clear")}
                </button>
              )}
            </div>
          </div>
        </details>
      </form>
    </div>
  );
}

export function SortSelect({ value }: { value: string }) {
  const t = useTranslations("Shop");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const options = [
    ["featured", t("sortFeatured")],
    ["price-asc", t("sortPriceAsc")],
    ["price-desc", t("sortPriceDesc")],
    ["newest", t("sortNewest")],
    ["name", t("sortName")],
  ] as const;

  return (
    <label className="flex items-center gap-2 text-sm">
      <span className="text-bark-500">{t("sort")}</span>
      <select
        value={value}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value === "featured") params.delete("sort");
          else params.set("sort", e.target.value);
          params.delete("page");
          const query = params.toString();
          router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
        }}
        className="input w-auto py-2"
      >
        {options.map(([key, label]) => (
          <option key={key} value={key}>
            {label}
          </option>
        ))}
      </select>
    </label>
  );
}
