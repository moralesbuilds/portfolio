import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

export async function HeroSection() {
  const t = await getTranslations("home.hero");
  return (
    <section className="py-20 md:py-32 text-center max-w-3xl mx-auto">
      {/* Headline */}
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl sm:leading-tight">
        {t("heading")}
      </h1>

      {/* Subtitle */}
      <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
        {t("subtitle")}
      </p>

      {/* Access buttons */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="#" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-inding-600 px-6 py-3.5 bg-primary text-base font-semibold shadow-md hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">
          {t("projects")}
        </Link>

        <Link href="#" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-inding-600 px-6 py-3.5 text-text-primary font-semibold shadow-md hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all">
          {t("contact")}
        </Link>
      </div>
    </section>
  );
}
