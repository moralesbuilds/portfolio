import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { getDb } from "../../client";
import { seedBlogPost, seedBlogPostTag, seedCategory } from "../../../test/seed/blog_posts";
import { env } from "cloudflare:workers";
import { seedTag } from "../../../test/seed/tags";
import { fetchBlogPostDetails } from "./fetch_blog_post_details";

describe("fetchBlogPostDetails", () => {
  let categoryEnId: number;

  beforeAll(async () => {
    const db = getDb(env.CONTENTS_DB);
    categoryEnId = await seedCategory(db, { name: "test", slug: "test-category", locale: "en", label: "Test" });
  });

  afterAll(async () => {
    const db = getDb(env.CONTENTS_DB);
    await db.prepare("DELETE FROM blog_posts").run();
    await db.prepare("DELETE FROM categories").run();
  });

  test("returns published blog post details for the locale by slug", async () => {
    const db = getDb(env.CONTENTS_DB);
    const blogPostId = await seedBlogPost(db, { name: "post-1", slug: "post-1", title: "Post 1", summary: "This summary", publishedAt: "2026-10-02T00:00:00.000Z", categoryId: categoryEnId });
    const tagXId = await seedTag(db, { name: "x", locale: "en", slug: "x", label: "X" });
    const tagYId = await seedTag(db, { name: "y", locale: "en", slug: "y", label: "Y" });
    await seedBlogPostTag(db, { blogPostId, tagId: tagXId });
    await seedBlogPostTag(db, { blogPostId, tagId: tagYId });

    const blogPost = (await fetchBlogPostDetails(db, { slug: "post-1", locale: "en" }))!;
    expect(blogPost).not.toBeNull();
    expect(blogPost.id).toBeGreaterThan(0);
    expect(blogPost.category).toBe("Test");
    expect(blogPost.locale).toBe("en");
    expect(blogPost.publishedAt).toBe("2026-10-02T00:00:00.000Z");
    expect(blogPost.slug).toBe("post-1");
    expect(blogPost.title).toBe("Post 1");
    expect(blogPost.summary).toBe("This summary");
    expect(blogPost.tags).toEqual(["X", "Y"]);
  });

  test("returns pubished blog post details for the locale by slug and without tags", async () => {
    const db = getDb(env.CONTENTS_DB);
    await seedBlogPost(db, { name: "post-without-tags", slug: "post-without-tags", title: "Post without tags", publishedAt: "2026-10-02T00:00:00.000Z", categoryId: categoryEnId });

    const blogPost = await fetchBlogPostDetails(db, { slug: "post-without-tags", locale: "en" });
    expect(blogPost).not.toBeNull();
    expect(blogPost!.id).toBeGreaterThan(0);
    expect(blogPost!.tags).toBeNullable(); 
  });

  test("returns null when the blog post is not found", async () => {
    const db = getDb(env.CONTENTS_DB);
    const blogPost = await fetchBlogPostDetails(db, { slug: "post-1", locale: "en" });
    expect(blogPost).toBeNull();
  });

  test("returns null when fetching a non-published blog post", async () => {
    const db = getDb(env.CONTENTS_DB);
    await seedBlogPost(db, { name: "post-1", slug: "post-1", title: "Post 1", publishedAt: "2026-10-02T00:00:00.000Z", categoryId: categoryEnId, status: "draft" });

    const blogPost = await fetchBlogPostDetails(db, { slug: "post-1", locale: "en" });
    expect(blogPost).toBeNull();
  });
});
