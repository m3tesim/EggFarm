"use client";

import { Loader2, Save } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState, useState } from "react";
import { Link } from "@/i18n/navigation";
import { type ProductFormState, saveProduct } from "@/lib/actions/admin";
import { EggArt } from "../egg-art";

type ProductValues = {
  id?: string;
  birdId: string;
  slug: string;
  breedEn: string;
  breedAr: string;
  descriptionEn: string;
  descriptionAr: string;
  price: string;
  stock: number;
  minOrder: number;
  hatchRate: number;
  shellColor: string;
  speckled: boolean;
  featured: boolean;
  active: boolean;
};

type Props = {
  birds: { id: string; name: string }[];
  product?: ProductValues;
};

export function ProductForm({ birds, product }: Props) {
  const t = useTranslations("Admin");
  const [state, action, pending] = useActionState<ProductFormState, FormData>(saveProduct, {});
  const [color, setColor] = useState(product?.shellColor ?? "#efe2cc");
  const [speckled, setSpeckled] = useState(product?.speckled ?? false);
  const err = (key: keyof NonNullable<ProductFormState["fieldErrors"]>) =>
    state.fieldErrors?.[key] ? true : undefined;

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-[1fr_16rem]">
      {product?.id && <input type="hidden" name="id" value={product.id} />}
      <div className="card space-y-4 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="birdId">{t("bird")}</label>
            <select id="birdId" name="birdId" defaultValue={product?.birdId} className="input" aria-invalid={err("birdId")}>
              {birds.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="slug">{t("slug")}</label>
            <input id="slug" name="slug" required dir="ltr" defaultValue={product?.slug} className="input font-mono" aria-invalid={err("slug")} placeholder="rhode-island-red" />
          </div>
          <div>
            <label className="label" htmlFor="breedEn">{t("breedEn")}</label>
            <input id="breedEn" name="breedEn" required dir="ltr" defaultValue={product?.breedEn} className="input" aria-invalid={err("breedEn")} />
          </div>
          <div>
            <label className="label" htmlFor="breedAr">{t("breedAr")}</label>
            <input id="breedAr" name="breedAr" required dir="rtl" lang="ar" defaultValue={product?.breedAr} className="input" aria-invalid={err("breedAr")} />
          </div>
        </div>
        <div>
          <label className="label" htmlFor="descriptionEn">{t("descriptionEn")}</label>
          <textarea id="descriptionEn" name="descriptionEn" rows={3} required dir="ltr" defaultValue={product?.descriptionEn} className="input" aria-invalid={err("descriptionEn")} />
        </div>
        <div>
          <label className="label" htmlFor="descriptionAr">{t("descriptionAr")}</label>
          <textarea id="descriptionAr" name="descriptionAr" rows={3} required dir="rtl" lang="ar" defaultValue={product?.descriptionAr} className="input" aria-invalid={err("descriptionAr")} />
        </div>
        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <label className="label" htmlFor="price">{t("priceLabel")}</label>
            <input id="price" name="price" type="number" step="0.01" min="0.01" required defaultValue={product?.price} className="input" aria-invalid={err("price")} />
          </div>
          <div>
            <label className="label" htmlFor="stock">{t("stock")}</label>
            <input id="stock" name="stock" type="number" min="0" required defaultValue={product?.stock ?? 0} className="input" aria-invalid={err("stock")} />
          </div>
          <div>
            <label className="label" htmlFor="minOrder">{t("minOrder")}</label>
            <input id="minOrder" name="minOrder" type="number" min="1" required defaultValue={product?.minOrder ?? 6} className="input" aria-invalid={err("minOrder")} />
          </div>
          <div>
            <label className="label" htmlFor="hatchRate">{t("hatchRate")}</label>
            <input id="hatchRate" name="hatchRate" type="number" min="0" max="100" required defaultValue={product?.hatchRate ?? 80} className="input" aria-invalid={err("hatchRate")} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="card grid place-items-center gap-4 p-6">
          <EggArt color={color} speckled={speckled} seed={product?.slug ?? "new"} className="h-32" />
          <label className="flex w-full items-center justify-between gap-2 text-sm font-medium">
            {t("shellColor")}
            <input type="color" name="shellColor" value={color} onChange={(e) => setColor(e.target.value)} className="h-9 w-14 cursor-pointer rounded-lg border border-bark-900/15" />
          </label>
        </div>
        <div className="card space-y-3 p-5 text-sm">
          <label className="flex items-center gap-2.5">
            <input type="checkbox" name="speckled" checked={speckled} onChange={(e) => setSpeckled(e.target.checked)} className="size-4 accent-meadow-600" />
            {t("speckled")}
          </label>
          <label className="flex items-center gap-2.5">
            <input type="checkbox" name="featured" defaultChecked={product?.featured} className="size-4 accent-meadow-600" />
            {t("featured")}
          </label>
          <label className="flex items-center gap-2.5">
            <input type="checkbox" name="active" defaultChecked={product?.active ?? true} className="size-4 accent-meadow-600" />
            {t("active")}
          </label>
        </div>
        <button type="submit" disabled={pending} className="btn-primary w-full py-3">
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          {t("save")}
        </button>
        <Link href="/admin/products" className="btn-ghost w-full">
          {t("cancel")}
        </Link>
      </div>
    </form>
  );
}
