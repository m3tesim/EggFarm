"use client";

import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  size?: "sm" | "md";
};

export function QuantityStepper({ value, min, max, onChange, size = "md" }: Props) {
  const t = useTranslations("Product");
  const btn =
    size === "sm"
      ? "grid size-8 place-items-center rounded-full hover:bg-cream-200 disabled:opacity-40"
      : "grid size-10 place-items-center rounded-full hover:bg-cream-200 disabled:opacity-40";

  return (
    <div className="inline-flex items-center rounded-full border border-bark-900/15 bg-white p-0.5">
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value - 1)}
        disabled={value <= min}
        aria-label={t("decrease")}
      >
        <Minus className="size-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        aria-label={t("quantity")}
        onChange={(e) => {
          const next = Number(e.target.value);
          if (Number.isFinite(next)) onChange(next);
        }}
        onBlur={(e) => onChange(Math.min(max, Math.max(min, Number(e.target.value) || min)))}
        className="w-12 bg-transparent text-center text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button
        type="button"
        className={btn}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label={t("increase")}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
