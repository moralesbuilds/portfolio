import { getBlogPostUrl } from "@/features/blog";
import { getProjectUrl } from "@/features/project";
import { routing } from "@/i18n/routing";
import { absoluteUrl, sitemapLanguages } from "@/lib/seo";
import { fetchBlogPostSitemapEntries, fetchProjectSitemapEntries, getDb, type Locale } from "@moralesbuilds/contents-db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { MetadataRoute } from "next";

// Renderizar en cada request: si se prerenderiza, `next build` lee el D1 local y no producción
export const dynamic = "force-dynamic";

type Entry = MetadataRoute.Sitemap[number];

function staticEntry(href: string): Entry {
  const hrefs = Object.fromEntries(routing.locales.map((l) => [l, href])) as Record<Locale, string>;
  return {
    url: absoluteUrl(routing.defaultLocale, href),
    alternates: { languages: sitemapLanguages(hrefs) }
  };
}

function contentEntry(
  entry: { slug: string; lastModified: string; alternates: Partial<Record<Locale, string>> },
  toHref: (slug: string) => string
): Entry {
  const hrefs: Partial<Record<Locale, string>> = {};
  for (const [locale, slug] of Object.entries(entry.alternates)) {
    hrefs[locale as Locale] = toHref(slug);
  }
  return {
    url: absoluteUrl(routing.defaultLocale, toHref(entry.slug)),
    lastModified: entry.lastModified,
    alternates: { languages: sitemapLanguages(hrefs) }
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { env } = await getCloudflareContext({ async: true });
  const db = getDb(env.CONTENTS_DB);
  const [blogPosts, projects] = await Promise.all([
    fetchBlogPostSitemapEntries(db),
    fetchProjectSitemapEntries(db)
  ]);

  return [
    staticEntry("/"),
    staticEntry("/contact"),
    staticEntry("/blog"),
    ...blogPosts.map((b) => contentEntry(b, getBlogPostUrl)),
    staticEntry("/project"),
    ...projects.map((p) => contentEntry(p, getProjectUrl))
  ];
}
