import type { Metadata } from "next";
import type { Locale } from "@moralesbuilds/contents-db"
import { alternates } from "./alternates";
import { getPathname } from "@/i18n/navigation";

type PageMetadataInput = {
  locale: Locale;
  hrefs: Partial<Record<Locale, string>>;
  title?: string;
  description: string;
  type?: "website" | "article";
};

export function pageMetadata({ locale, hrefs, title, description, type = "website" }: PageMetadataInput): Metadata {
  return {
    ...(title && { title }),
    description,
    alternates: alternates(locale, hrefs),
    openGraph: {
      type,
      siteName: "MoralesBuilds",
      locale,
      url: getPathname({ locale, href: hrefs[locale]! }),
      ...(title && { title }),
      description
    }
  };
}
