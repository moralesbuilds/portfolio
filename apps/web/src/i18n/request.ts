import * as rootParams from "next/root-params";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

export default getRequestConfig(async ({ locale }) => {
  if (!locale) {
    const paramValue = await rootParams.locale();
    if (hasLocale(routing.locales, paramValue)) {
      locale = paramValue;
    } else {
      notFound();
    }
  }
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return { locale, messages };
});
