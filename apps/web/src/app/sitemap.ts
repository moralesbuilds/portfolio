import { getAbsoluteBlogPostUrl } from "@/features/blog";
import { getAbsoluteProjectUrl } from "@/features/project";
import {
  type BlogPostSitemapEntry,
  fetchBlogPostSitemapEntries,
  fetchProjectSitemapEntries,
  getDb,
  type Locale,
  type ProjectSitemapEntry
} from "@moralesbuilds/contents-db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { MetadataRoute } from "next";

function mapSitemapEntry(
  entry: BlogPostSitemapEntry | ProjectSitemapEntry,
  getAbsoluteUrl: (slug: string, locale?: Locale) => string
): MetadataRoute.Sitemap[number] {
  let hasLanguages = false;
  const languages: Record<string, string> = {};
  for (const [locale, slug] of Object.entries(entry.alternates)) {
    languages[locale] = getAbsoluteUrl(slug, locale as Locale);
    hasLanguages = true;
  }
  return {
    url: getAbsoluteUrl(entry.slug),
    lastModified: entry.lastModified,
    alternates: hasLanguages ? { languages } : undefined
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { env } = await getCloudflareContext({ async: true });
  const db = getDb(env.CONTENTS_DB);
  const blogPosts = await fetchBlogPostSitemapEntries(db);
  const projects = await fetchProjectSitemapEntries(db);

  return [
    {
      url: process.env.BASE_URL!
    },
    {
      url: `${process.env.BASE_URL}/contact`
    },
    {
      url: `${process.env.BASE_URL}/blog`
    },
    ...blogPosts.map((b) => mapSitemapEntry(b, getAbsoluteBlogPostUrl)),
    
    {
      url: `${process.env.BASE_URL}/project`
    },
    ...projects.map((p) => mapSitemapEntry(p, getAbsoluteProjectUrl)),
  ];
}
