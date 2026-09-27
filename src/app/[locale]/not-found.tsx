import { useTranslations } from "next-intl";
import { EggArt } from "@/components/egg-art";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("NotFound");
  return (
    <div className="container-page grid place-items-center py-24 text-center">
      <EggArt color="#efe2cc" seed="404" className="h-28 -rotate-12" />
      <h1 className="mt-8 font-display text-4xl font-semibold">{t("title")}</h1>
      <p className="mt-2 text-bark-500">{t("text")}</p>
      <Link href="/" className="btn-primary mt-8">
        {t("home")}
      </Link>
    </div>
  );
}
