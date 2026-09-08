import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async () => {
  const locale = "en"; // Static for now, we'll change this later
  const messages = (await import(`../../messages/${locale}.json`)).default;
  return { locale, messages };
});
