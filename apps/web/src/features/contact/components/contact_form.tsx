import { getTranslations } from "next-intl/server";

export async function ContactForm() {
  const t = await getTranslations("contact");

  return (
    <div className="w-full max-w-4xl md:p-8">
      <form action="#" method="POST" className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-900 md-2">
            {t("fields.name.label")}
          </label>
          <input
            type="text"
            id="name"
            required
            placeholder={t("fields.name.placeholder")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-colors"
          />
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-900 md-2">
            {t("fields.email.label")}
          </label>
          <input
            type="email"
            id="email"
            required
            placeholder={t("fields.email.placeholder")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-colors"
          />
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-slate-900 md-2">
            {t("fields.message.label")}
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            required
            placeholder={t("fields.message.placeholder")}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-600 transition-colors"
          />
        </div>

        {/* Submit button */}
        <button type="submit" className="w-full inline-flex justify-center items-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all cursor-pointer">
          Send
        </button>
      </form>
    </div>
  );
}
