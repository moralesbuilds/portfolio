import type { BlogPostItem, Locale, Page } from "../types";
import type { Db } from "../client";

type FetchBlogPostParams = {
  locale?: Locale;
  pageSize?: number;
  pageIndex?: number;
};

export async function fetchBlogPosts(db: Db, params?: FetchBlogPostParams): Promise<Page<BlogPostItem>> {
  const locale = params?.locale ?? 'en';
  const limit = params?.pageSize ?? 10;
  const offset = ((params?.pageIndex ?? 1) - 1) * limit;

  const countResult = await db.prepare(`
      SELECT COUNT(*) AS count
      FROM blog_posts p
      WHERE p.locale = ? AND p.status = 'published'`)
    .bind(locale)
    .first<{ count: number }>();

  const { results } = await db.prepare(`
      SELECT p.id, p.slug, p.title, p.summary, p.published_at AS publishedAt, c.label AS category
      FROM blog_posts p
      JOIN categories c on p.category_id = c.id 
      WHERE p.locale = ? AND p.status = 'published'
      ORDER BY p.published_at DESC
      LIMIT ? OFFSET ?;`)
    .bind(locale, limit, offset)
    .all<BlogPostItem>();
  return {
    items: results,
    count: countResult?.count ?? 0,
    size: limit,
  };
}
