import { env } from "cloudflare:workers";
import { beforeAll, beforeEach, describe, expect, test } from "vitest";
import { type Db, getDb } from "../client";
import { fetchLatestBlogPosts } from "./fetch_latest_blog_posts";

async function seedCategory(
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

async function seedBlogPost(
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
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`
    )
    .bind(
      overrides.name,
      overrides.slug,
      overrides.title,
      overrides.locale ?? "en",
      overrides.status ?? "published",
      overrides.publishedAt,
      overrides.categoryId,
      1
    )
    .run();
}

describe("fetchLatestBlogPosts", () => {
  let categoryEnId: number;
  let categoryEsId: number;

  beforeAll(async () => {
    const db = getDb(env.CONTENTS_DB);
    categoryEnId = await seedCategory(db, { name: "test", slug: "test-category", locale: "en", label: "Test" });
    categoryEsId = await seedCategory(db, { name: "test", slug: "categoria-prueba", locale: "es", label: "Categoria de prueba" });
  });

  beforeEach(async () => {
    const db = getDb(env.CONTENTS_DB);
    await db.prepare(`DELETE FROM blog_posts;`).run();
  });

  test("returns published posts for the locale, newest first, respecting the limit", async () => {
    const db = getDb(env.CONTENTS_DB);

    await seedBlogPost(db, { name: "post-1", slug: "post-1", title: "Post 1", publishedAt: "2026-09-01T00:00:00.000Z", categoryId: categoryEnId });
    await seedBlogPost(db, { name: "post-2", slug: "post-2", title: "Post 2", publishedAt: "2026-09-03T00:00:00.000Z", categoryId: categoryEnId });
    await seedBlogPost(db, { name: "post-3", slug: "post-3", title: "Post 3", publishedAt: "2026-09-02T00:00:00.000Z", categoryId: categoryEnId });

    const posts = await fetchLatestBlogPosts(db, { locale: "en", limit: 2 });

    expect(posts).toHaveLength(2);
    expect(posts.map((p) => p.slug)).toEqual(["post-2", "post-3"]);
  });

  test("excludes posts that are not published", async () => {
    const db = getDb(env.CONTENTS_DB);

    await seedBlogPost(db, { name: "draft", slug: "draft-post", title: "Draft", status: "draft", publishedAt: "2026-09-05T00:00:00.000Z", categoryId: categoryEnId });
    await seedBlogPost(db, { name: "published", slug: "published-post", title: "Published", publishedAt: "2026-09-04T00:00:00.000Z", categoryId: categoryEnId });

    const posts = await fetchLatestBlogPosts(db, { locale: "en" });

    expect(posts.map((p) => p.slug)).toEqual(["published-post"]);
  });

  test("excludes posts from a different locale", async () => {
    const db = getDb(env.CONTENTS_DB);

    await seedBlogPost(db, { name: "same-post", slug: "es-post", title: "Publicación", locale: "es", publishedAt: "2026-09-05T00:00:00.000Z", categoryId: categoryEsId });
    await seedBlogPost(db, { name: "same-post", slug: "en-post", title: "Post", locale: "en", publishedAt: "2026-09-04T00:00:00.000Z", categoryId: categoryEnId });

    const posts = await fetchLatestBlogPosts(db, { locale: "en" });

    expect(posts.map((p) => p.slug)).toEqual(["en-post"]);
  });

  test("defaults to locale 'en' and limit 3 when no params are given", async () => {
    const db = getDb(env.CONTENTS_DB);

    for (let i = 1; i <= 4; i++) {
      await seedBlogPost(db, {
        name: `post-${i}`, 
        slug: `post-${i}`,
        title: `Post ${i}`,
        publishedAt: `2026-09-0${i}T00:00:00.000Z`,
        categoryId: categoryEnId
      });
    }

    const posts = await fetchLatestBlogPosts(db);

    expect(posts).toHaveLength(3);
    expect(posts.map((p) => p.slug)).toEqual(["post-4", "post-3", "post-2"]);
  });
});
