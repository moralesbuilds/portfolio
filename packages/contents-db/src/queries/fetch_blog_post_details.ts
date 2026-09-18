import type { BlogPostItem, Locale } from "../types";
import type { Db } from "../client";

type FetchBlogPostDetailsParams = {
  locale: Locale;
  slug: string;
};

export async function fetchBlogPostDetails(db: Db, params: FetchBlogPostDetailsParams): Promise<BlogPostItem | null> {
  const item = await db.prepare(`
      SELECT p.id, p.slug, p.title, p.locale, p.published_at AS publishedAt, c.label AS category, json_group_array(t.label) as tags_str
      FROM blog_posts p
      JOIN categories c on p.category_id = c.id
      LEFT JOIN blog_post_tags pbt ON p.id = pbt.blog_post_id
      LEFT JOIN tags t ON pbt.tag_id = t.id
      WHERE p.slug = ? AND p.locale = ? AND p.status = 'published'
      GROUP BY p.id;`)
    .bind(params.slug, params.locale)
    .first<BlogPostItem & { tags_str?: string }>();

  if (item?.tags_str) {
    item.tags = JSON.parse(item.tags_str)
    item.tags_str = undefined;
  }

  return item;
}
