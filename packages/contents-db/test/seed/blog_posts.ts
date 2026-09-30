import { Db } from "../../src";

export async function seedCategory(
  db: Db,
  overrides: {
    name: string;
    locale: string;
    slug: string;
    label: string;
  }
) {
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
) {
  await db
    .prepare(
      `INSERT INTO blog_posts (name, slug, title, locale, status, published_at, category_id, author_id, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, 1, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`
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
    .run();
}
