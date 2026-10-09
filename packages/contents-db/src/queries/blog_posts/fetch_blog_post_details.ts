import type { BlogPost, Locale } from "../../types";
import type { Db } from "../../client";

type FetchBlogPostDetailsParams = {
  locale: Locale;
  slug: string;
};

export async function fetchBlogPostDetails(db: Db, params: FetchBlogPostDetailsParams): Promise<BlogPost | null> {
  const locale = params?.locale ?? 'en';
  const slug = params?.slug || (() => { throw new Error("Slug is required"); })();

  const item = await db
    .prepare(`
      SELECT p.id, p.slug, p.title, p.locale, p.published_at AS publishedAt, c.label AS category, p.summary, NULLIF(json_group_array(t.label), '[null]') AS tags_str, p.updated_at AS updatedAt
      FROM blog_posts p
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN blog_post_tags pbt ON p.id = pbt.blog_post_id
      LEFT JOIN tags t ON pbt.tag_id = t.id
      WHERE p.slug = ? AND p.locale = ? AND p.status = 'published'
      GROUP BY p.id;`)
    .bind(slug, locale)
    .first<BlogPost & { tags_str?: string }>();
  if (!item) {
    return null;
  }

  const { tags_str, ...rest } = item;
  return {
    ...rest,
    tags: tags_str ? JSON.parse(tags_str) : undefined,
  };
}
