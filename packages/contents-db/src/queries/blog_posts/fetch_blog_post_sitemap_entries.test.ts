import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { getDb } from "../../client";
import { env } from "cloudflare:workers";
import { seedBlogPost, seedCategory } from "../../../test/seed/blog_posts";
import { fetchBlogPostSitemapEntries } from "./fetch_blog_post_sitemap_entries";

describe("fetchBlogPostSitemapEntries", () => {
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

  test("returns sitemap entries for blog post with spanish alternative", async () => {
    const db = getDb(env.CONTENTS_DB);
    await seedBlogPost(db, { name: "post-1", slug: "post-1", title: "Post 1", publishedAt: "2026-10-01T00:00:00.000Z", categoryId: categoryEnId, locale: "en" });
    await seedBlogPost(db, { name: "post-1", slug: "publicacion-1", title: "Publicacion 1", publishedAt: "2026-10-03T00:00:00.000Z", categoryId: categoryEnId, locale: "es" });
    await seedBlogPost(db, { name: "post-2", slug: "post-2", title: "Post 2", publishedAt: "2026-10-02T00:00:00.000Z", updatedAt: "2026-10-04T00:00:00.000Z", categoryId: categoryEnId, locale: "en" });

    const entries = await fetchBlogPostSitemapEntries(db);
    expect(entries).toHaveLength(2);
    expect(entries[0].slug).toBe("post-1");
    expect(entries[0].lastModified).toBe("2026-10-01T00:00:00.000Z");
    expect(entries[0].alternates).toEqual({ en: "post-1", es: "publicacion-1" });

    expect(entries[1].slug).toBe("post-2");
    expect(entries[1].lastModified).toBe("2026-10-04T00:00:00.000Z");
    expect(entries[1].alternates).toEqual({ en: "post-2" });
  });

  test("returns empty array for unpublished blog posts", async () => {
    const db = getDb(env.CONTENTS_DB);
    await seedBlogPost(db, { name: "post-1", slug: "post-1", title: "Post 1", publishedAt: "2026-10-01T00:00:00.000Z", categoryId: categoryEnId, locale: "en", status: "draft" });
    await seedBlogPost(db, { name: "post-2", slug: "post-2", title: "Post 2", publishedAt: "2026-10-02T00:00:00.000Z", categoryId: categoryEnId, locale: "en", status: "archived" });

    const entries = await fetchBlogPostSitemapEntries(db);
    expect(entries).toEqual([]);
  });
});
