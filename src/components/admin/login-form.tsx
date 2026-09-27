"use client";

import { Loader2, LockKeyhole } from "lucide-react";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { type LoginState, login } from "@/lib/actions/admin";

export function LoginForm() {
  const t = useTranslations("Admin");
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={action} className="card space-y-4 p-6">
      {state.error && (
        <p role="alert" className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">
          {t(state.error)}
        </p>
      )}
      <div>
        <label htmlFor="password" className="label">
          {t("password")}
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="input" />
      </div>
      <button type="submit" disabled={pending} className="btn-primary w-full py-3">
        {pending ? <Loader2 className="size-4 animate-spin" /> : <LockKeyhole className="size-4" />}
        {t("signIn")}
      </button>
    </form>
  );
}
