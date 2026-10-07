import { type Locale } from "@moralesbuilds/contents-db";

export function getProjectUrl(slug: string): string {
  return `/project/${slug}`;
}

export function getAbsoluteProjectUrl(slug: string, locale?: Locale) {
  const relativeUrl = getProjectUrl(slug);
  return locale
    ? `${process.env.BASE_URL}/${locale}${relativeUrl}`
    : `${process.env.BASE_URL}${relativeUrl}`; 
}
