import { getTranslations } from "next-intl/server";
import ServiceCard from "./service_card";

type ServiceItem = {
  key: string;
  title: string;
  description: string;
};

export async function AboutMeAndServicesSection() {
  const t = await getTranslations("home.about");
  const services = t.raw("service_list") as ServiceItem[];

  return (
    <section className="py-16 md:py-24 border-t border-slate-200">
      {/* Section Title & Bio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

        {/* Bio Text (Left Side) */}
        <div className="lg:col-span-1 space-y-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">{t("title")}</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {t("heading")}
          </h2>
          <p className="text-slate-600 leading-relaxed">
            {t("content")}
          </p>

          {/* Photos/Visual placeholders */}
          <div className="lg:col-span-1 grid grid-cols-2 gap-4">
            <div className="h-48 rounded-2xl bg-slate-200 object-cover shadow-sm flex items-center justify-center text-slate-400 font-medium">
              {t("photo1")}
            </div>
            <div className="h-48 rounded-2xl bg-slate-300 object-cover shadow-sm flex items-center justify-center text-slate-400 font-medium">
              {t("photo2")}
            </div>
          </div>
        </div>

        {/* Services provided (Right side) */}
        <div className="lg:col-span-1 grid grid-cols-1 gap-4">
          <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">{t("services")}</p>
          {services.map((s, idx) => <ServiceCard key={s.key} index={idx + 1} title={s.title} description={s.description} />)}
        </div>
      </div>
    </section>
  );
}
