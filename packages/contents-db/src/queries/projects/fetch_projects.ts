import type { Db } from "../../client";
import type { Locale, Page, Project } from "../../types"

type FetchProjectsParams = {
  locale?: Locale;
  pageSize?: number;
  pageIndex?: number;
};

export async function fetchProjects(db: Db, params?: FetchProjectsParams): Promise<Page<Project>> {
  const locale = params?.locale ?? 'en';
  const limit = params?.pageSize ?? 10;
  const offset = ((params?.pageIndex ?? 1) - 1) * limit;

  const countResult = await db.prepare(
    `SELECT COUNT(*) AS count FROM projects p WHERE p.locale = ? AND p.status = 'published'`
  )
  .bind(locale)
  .first<{ count: number }>();

  const { results } = await db.prepare(
    `SELECT p.id, p.slug, p.title, p.summary, p.published_at AS publishedAt, NULLIF(json_group_array(t.label), '[null]') as tags_str, p.is_featured
    FROM projects p
    LEFT JOIN project_tags pt ON p.id = pt.project_id
    LEFT JOIN tags t ON pt.tag_id = t.id
    WHERE p.locale = ? AND p.status = 'published'
    GROUP BY p.id
    ORDER BY p.published_at DESC
    LIMIT ? OFFSET ?`
  )
  .bind(locale, limit, offset)
  .all<Project & { tags_str?: string; is_featured: number; }>();

  return {
    items: results.map(({ tags_str, is_featured, ...rest }) => ({ 
      ...rest,
      tags: tags_str ? JSON.parse(tags_str) : undefined,
      isFeatured: Boolean(is_featured)
    })),
    count: countResult?.count ?? 0,
    size: limit,
  };
}
