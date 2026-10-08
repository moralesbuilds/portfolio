import type { Db } from "../../client";
import type { ProjectSitemapEntry } from "../../types";

export async function fetchProjectSitemapEntries(db: Db): Promise<ProjectSitemapEntry[]> {
  const { results } = await db
    .prepare(
      `SELECT en.slug, COALESCE(en.updated_at, en.published_at) AS lastModified, COALESCE(json_group_object(other.locale, other.slug) FILTER (WHERE other.locale IS NOT NULL), '{}') AS alternates
      FROM projects en
      LEFT JOIN projects other ON en.name = other.name AND other.status = 'published'
      WHERE en.locale = 'en' AND en.status = 'published'
      GROUP BY en.name, en.slug
      ORDER BY en.name`
    )
    .all<{ slug: string; lastModified: string; alternates: string; }>();

  return results.map(({ alternates, ...rest }) => ({
    ...rest,
    alternates: JSON.parse(alternates)
  }));
}
