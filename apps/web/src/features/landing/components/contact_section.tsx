import { ContactForm } from "@/features/contact";
import { getTranslations } from "next-intl/server";

export async function ContactSection() {
  const t = await getTranslations("home.contact");
  
  return (
    <section className="py-16 md:py-24 border-t border-slate-200 flex flex-col items-center bg-base">
      {/* Header block */}
      <div className="text-center max-w-xl mb-8">
        <h2 className="text-small font-bold tracking-tight text-indigo-600 mb-6">
          {t("title")}
        </h2>
        <p className="mt-2 text-3xl font-bold text-slate-600">
          {t("subtitle")}
        </p>
      </div>

      {/* Contact form block */ }
      <ContactForm />
    </section>
  );
}
