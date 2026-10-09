import type { Db } from "../../client";
import type { Locale, Page, ProjectItem } from "../../types"

type FetchProjectsParams = {
  locale?: Locale;
  pageSize?: number;
  pageIndex?: number;
  onlyFeatured?: boolean;
};

export async function fetchProjects(db: Db, params?: FetchProjectsParams): Promise<Page<ProjectItem>> {
  const locale = params?.locale ?? 'en';
  const limit = params?.pageSize ?? 10;
  const offset = ((params?.pageIndex ?? 1) - 1) * limit;
  const onlyFeaturedClause = (params?.onlyFeatured ?? false) ? "AND p.is_featured = 1" : "";

  const countResult = await db
    .prepare(
      `SELECT COUNT(*) AS count FROM projects p WHERE p.locale = ? AND p.status = 'published' ${onlyFeaturedClause}`
    )
    .bind(locale)
    .first<{ count: number }>();
  const count = countResult?.count ?? 0;
  if (count === 0) {
    return { items: [], count, size: limit };
  }

  const { results } = await db
    .prepare(
      `SELECT p.id, p.slug, p.title, p.summary, p.published_at AS publishedAt, NULLIF(json_group_array(t.label), '[null]') as tags_str, p.is_featured
      FROM projects p
      LEFT JOIN project_tags pt ON p.id = pt.project_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.locale = ? AND p.status = 'published' ${onlyFeaturedClause}
      GROUP BY p.id
      ORDER BY p.published_at DESC
      LIMIT ? OFFSET ?`
    )
    .bind(locale, limit, offset)
    .all<ProjectItem & { tags_str?: string; is_featured: number; }>();

  return {
    items: results.map(({ tags_str, is_featured, ...rest }) => ({
      ...rest,
      tags: tags_str ? JSON.parse(tags_str) : undefined,
      isFeatured: Boolean(is_featured)
    })),
    count,
    size: limit,
  };
}
