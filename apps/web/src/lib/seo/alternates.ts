import type { Metadata } from "next";
import type { Locale } from "@moralesbuilds/contents-db";
import { getPathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

export function absoluteUrl(locale: Locale, href: string): string {
  return `${process.env.BASE_URL}${getPathname({ locale, href })}`;
}

export function sitemapLanguages(hrefs: Partial<Record<Locale, string>>): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    if (hrefs[l]) languages[l] = absoluteUrl(l, hrefs[l]!);
  }
  const def = hrefs[routing.defaultLocale];
  if (def) languages["x-default"] = absoluteUrl(routing.defaultLocale, def);
  return languages;
}

export function alternates(locale: Locale, hrefs: Partial<Record<Locale, string>>): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of routing.locales) {
    if (hrefs[l]) languages[l] = getPathname({ locale: l, href: hrefs[l]! });
  }
  const def = hrefs[routing.defaultLocale];
  if (def) {
    languages["x-default"] = getPathname({ locale: routing.defaultLocale, href: def });
  }

  return { canonical: getPathname({ locale, href: hrefs[locale]! }), languages };
}
