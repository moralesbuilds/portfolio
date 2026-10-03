import { Db } from "../../src";

export async function seedCategory(
  db: Db,
  overrides: {
    name: string;
    locale: string;
    slug: string;
    label: string;
  }
): Promise<number> {
  const result = await db
    .prepare(
      `INSERT INTO categories (name, locale, slug, label)
       VALUES (?, ?, ?, ?)
       RETURNING id`
    )
    .bind(
      overrides.name,
      overrides.locale,
      overrides.slug,
      overrides.label
    )
    .first<{ id: number; }>();
  return result!.id;
}

export async function seedBlogPost(
  db: Db,
  overrides: {
    name: string,
    slug: string;
    title: string;
    publishedAt: string;
    locale?: string;
    status?: string;
    categoryId: number;
  }
): Promise<number> {
  const result = await db
    .prepare(
      `INSERT INTO blog_posts (name, slug, title, locale, status, published_at, category_id, author_id, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 1, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
      RETURNING id`
    )
    .bind(
      overrides.name,
      overrides.slug,
      overrides.title,
      overrides.locale ?? "en",
      overrides.status ?? "published",
      overrides.publishedAt,
      overrides.categoryId
    )
    .first<{ id: number; }>();
  return result!.id;
}

export async function seedBlogPostTag(
  db: Db,
  overrides: {
    blogPostId: number;
    tagId: number;
  }
) {
  await db
    .prepare(
      `INSERT INTO blog_post_tags (blog_post_id, tag_id)
      VALUES (?1, ?2)`
    )
    .bind(
      overrides.blogPostId,
      overrides.tagId
    )
    .run();
}
