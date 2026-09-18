import type { BlogPostItem, Locale } from "../types";
import type { Db } from "../client";

type FetchBlogPostParams = {
  locale?: Locale;
  pageSize?: number;
  pageIndex?: number;
};

export async function fetchBlogPosts(db: Db, params?: FetchBlogPostParams): Promise<BlogPostItem[]> {
  const locale = params?.locale ?? 'en';
  const limit = params?.pageSize ?? 10;
  const offset = (params?.pageIndex ?? 0) * limit;

  const { results } = await db.prepare(`
      SELECT p.id, p.slug, p.title, p.summary, p.published_at AS publishedAt, c.label AS category
      FROM blog_posts p
      JOIN categories c on p.category_id = c.id 
      WHERE p.locale = ? AND p.status = 'published'
      ORDER BY p.published_at DESC
      LIMIT ? OFFSET ?;`)
    .bind(locale, limit, offset)
    .all<BlogPostItem>();
  return results;
}
