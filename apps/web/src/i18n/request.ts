import { locale as getRootLocale } from "next/root-params";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const paramValue = await getRootLocale();
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue;
    } else {
      notFound();
    }
  }

  const localeMessages = (await import(`../../messages/${locale}.json`)).default;
  const sharedMessages = (await import("../../messages/shared.json")).default;
  
  return { locale, messages: { ...localeMessages, ...sharedMessages } };
});
