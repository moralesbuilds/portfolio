import { env } from "cloudflare:workers";
import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { getDb } from "../../client";
import { seedBlogPost, seedCategory } from "../../../test/seed/blog_posts";
import { fetchBlogPosts } from "./fetch_blog_posts";

describe("fetchBlogPosts", () => {
  let categoryEnId: number;
  let categoryEsId: number;

  beforeAll(async () => {
    const db = getDb(env.CONTENTS_DB);
    categoryEnId = await seedCategory(db, { name: "test", slug: "test-category", locale: "en", label: "Test" });
    categoryEsId = await seedCategory(db, { name: "test", slug: "categoria-prueba", locale: "es", label: "Categoria de prueba" });
  });

  afterAll(async () => {
    const db = getDb(env.CONTENTS_DB);
    await db.prepare("DELETE FROM blog_posts").run();
    await db.prepare("DELETE FROM categories").run();
  });

  test("returns published blog posts for the locale, newests first, respecting the page size", async () => {
    const db = getDb(env.CONTENTS_DB);
    await seedBlogPost(db, { name: "post-1", slug: "post-1", title: "Post 1", publishedAt: "2026-10-01T00:00:00.000Z", categoryId: categoryEnId });
    await seedBlogPost(db, { name: "post-2", slug: "post-2", title: "Post 2", publishedAt: "2026-10-03T00:00:00.000Z", categoryId: categoryEnId });
    await seedBlogPost(db, { name: "post-3", slug: "post-3", title: "Post 3", publishedAt: "2026-10-02T00:00:00.000Z", categoryId: categoryEnId });

    const postsPage = await fetchBlogPosts(db, { locale: "en", pageSize: 2 });
    expect(postsPage.count).toBe(3);
    expect(postsPage.size).toBe(2);
    expect(postsPage.items).toHaveLength(2);
    expect(postsPage.items?.map((p) => p.slug)).toEqual(["post-2", "post-3"]);
  });

  test("excludes blog posts that are not published", async () => {
    const db = getDb(env.CONTENTS_DB);
    await seedBlogPost(db, { name: "draft", slug: "draft-post", title: "Draft", status: "draft", publishedAt: "2026-09-05T00:00:00.000Z", categoryId: categoryEnId });
    await seedBlogPost(db, { name: "published", slug: "published-post", title: "Published", publishedAt: "2026-09-04T00:00:00.000Z", categoryId: categoryEnId });

    const postsPage = await fetchBlogPosts(db, { locale: "en" });
    expect(postsPage.count).toBe(1);
    expect(postsPage.size).toBe(10);
    expect(postsPage.items).toHaveLength(1);
    expect(postsPage.items?.map((p) => p.slug)).toEqual(["published-post"]);
  });

  test("excludes blog posts from a different locale", async () => {
    const db = getDb(env.CONTENTS_DB);
    await seedBlogPost(db, { name: "same-post", slug: "es-post", title: "Publicación", locale: "es", publishedAt: "2026-09-05T00:00:00.000Z", categoryId: categoryEsId });
    await seedBlogPost(db, { name: "same-post", slug: "en-post", title: "Post", locale: "en", publishedAt: "2026-09-04T00:00:00.000Z", categoryId: categoryEnId });

    const postsPage = await fetchBlogPosts(db, { locale: "es" });
    expect(postsPage.count).toBe(1);
    expect(postsPage.items).toHaveLength(1);
    expect(postsPage.items?.map((p) => p.slug)).toEqual(["es-post"]);
  });
});
