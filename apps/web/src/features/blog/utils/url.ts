import { type Locale } from "@moralesbuilds/contents-db";

export function getBlogPostUrl(slug: string): string {
  return `/blog/${slug}`;
}

export function getAbsoluteBlogPostUrl(slug: string, locale?: Locale) {
  const relativeUrl = getBlogPostUrl(slug);
  return locale
    ? `${process.env.BASE_URL}/${locale}${relativeUrl}`
    : `${process.env.BASE_URL}${relativeUrl}`;
}
