"use client";

import { Loader2, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { type TrackState, trackOrder } from "@/lib/actions/orders";

export function TrackForm({ defaultCode }: { defaultCode?: string }) {
  const t = useTranslations("Track");
  const [state, action, pending] = useActionState<TrackState, FormData>(trackOrder, {});

  return (
    <form action={action} className="card space-y-4 p-6">
      {state.notFound && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {t("notFound")}
        </p>
      )}
      <div>
        <label htmlFor="code" className="label">
          {t("code")}
        </label>
        <input
          id="code"
          name="code"
          required
          dir="ltr"
          placeholder="EGG-XXXXXXXXXX"
          defaultValue={state.values?.code ?? defaultCode}
          className="input font-mono uppercase"
        />
      </div>
      <div>
        <label htmlFor="phone" className="label">
          {t("phone")}
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          dir="ltr"
          defaultValue={state.values?.phone}
          className="input"
        />
      </div>
      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <Search className="size-4" />}
        {t("submit")}
      </button>
    </form>
  );
}
