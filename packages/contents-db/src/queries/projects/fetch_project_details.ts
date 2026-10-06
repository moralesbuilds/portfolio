import { Db } from "../../client";
import type { Locale, Project, RelatedBlogPost } from "../../types"

type FetchProjectDetailsParams = {
  locale: Locale;
  slug: string;
};

export async function fetchProjectDetails(db: Db, params: FetchProjectDetailsParams): Promise<Project | null> {
  const locale = params.locale ?? "en";
  const slug = params.slug || (() => { throw new Error("Slug is required"); })();

  const item = await db
    .prepare(
      `SELECT p.id, p.slug, p.title, p.summary, p.repository_url AS repositoryUrl, p.is_featured, p.published_at AS publishedAt, NULLIF(json_group_array(t.label), '[null]') AS tags_str, p.locale
      FROM projects p
      LEFT JOIN project_tags pt ON p.id = pt.project_id
      LEFT JOIN tags t ON pt.tag_id = t.id
      WHERE p.slug = ?1 AND p.locale = ?2 AND p.status = 'published'
      GROUP BY p.id`
    )
    .bind(slug, locale)
    .first<Project & { tags_str?: string; is_featured: number; }>();
  if (!item) {
    return null;
  }

  const { results } = await db
    .prepare(
      `SELECT p.id, p.slug, p.title, p.published_at AS publishedAt
      FROM blog_posts p
      JOIN project_blog_posts pbp ON p.id = pbp.blog_post_id
      WHERE pbp.project_id = ?1 AND p.status = 'published'
      ORDER BY p.published_at DESC`
    )
    .bind(item.id)
    .all<RelatedBlogPost>();
  const { tags_str, is_featured, ...rest } = item;
  return {
    ...rest,
    isFeatured: Boolean(is_featured),
    tags: tags_str ? JSON.parse(tags_str) : undefined,
    relatedBlogPosts: results,
  };
}
