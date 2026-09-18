import type { BlogPostItem, Locale } from "../types";
import type { Db } from "../client";

type LatestBlogPost = Pick<BlogPostItem, "id" | "title" | "publishedAt" | "slug">;

type FetchLatestBlogPostParams = {
  locale?: Locale;
  limit?: number;
};

export async function fetchLatestBlogPosts(db: Db, params?: FetchLatestBlogPostParams): Promise<LatestBlogPost[]> {
  const locale = params?.locale ?? 'en';
  const limit = params?.limit ?? 3;

  const { results } =  await db.prepare(`
      SELECT p.id, p.slug, p.title, p.published_at AS publishedAt
      FROM blog_posts p
      WHERE p.locale = ? AND p.status = 'published'
      ORDER BY p.published_at DESC
      LIMIT ?;`)
    .bind(locale, limit)
    .all<LatestBlogPost>();
  return results;
}
