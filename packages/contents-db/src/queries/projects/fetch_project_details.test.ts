import { afterAll, beforeAll, describe, expect, test } from "vitest";
import { getDb } from "../../client";
import { env } from "cloudflare:workers";
import { seedBlogPost, seedCategory } from "../../../test/seed/blog_posts";
import { seedProject, seedProjectBlogPost, seedProjectTag } from "../../../test/seed/projects";
import { seedTag } from "../../../test/seed/tags";
import { fetchProjectDetails } from "./fetch_project_details";

describe("fetchProjectDetails", () => {
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

  test("returns published project details for the locale by slug", async () => {
    const db = getDb(env.CONTENTS_DB);
    const blogPostId = await seedBlogPost(db, { name: "post-1", slug: "post-1", title: "Post 1", publishedAt: "2026-10-02T00:00:00.000Z", categoryId: categoryEnId });
    const projectId = await seedProject(db, { isFeatured: true, name: "project-1", slug: "project-1", title: "Project 1", repositoryUrl: "https://example.com", summary: "Summary 1", publishedAt: "2026-10-01T00:00:00.000Z", locale: "en", status: "published" });
    const tagId = await seedTag(db, { name: "testing", locale: "en", slug: "testing", label: "Testing" });
    await seedProjectTag(db, { projectId, tagId });
    await seedProjectBlogPost(db, { blogPostId, projectId });

    const project = (await fetchProjectDetails(db, { locale: "en", slug: "project-1" }))!;
    expect(project).not.toBeNull();
    expect(project.id).toBeGreaterThan(0);
    expect(project.isFeatured).toBe(true);
    expect(project.slug).toBe("project-1");
    expect(project.title).toBe("Project 1");
    expect(project.summary).toBe("Summary 1");
    expect(project.repositoryUrl).toBe("https://example.com");
    expect(project.publishedAt).toBe("2026-10-01T00:00:00.000Z");
    expect(project.tags).toEqual(["Testing"]);
    expect(project.locale).toBe("en");

    expect(project?.relatedBlogPosts?.length).toBe(1);
    const relatedBlog = project.relatedBlogPosts?.[0]!;
    expect(relatedBlog.id).toBeGreaterThan(0);
    expect(relatedBlog.slug).toBe("post-1");
    expect(relatedBlog.title).toBe("Post 1");
    expect(relatedBlog.publishedAt).toBe("2026-10-02T00:00:00.000Z");
  });

  test("returns pubished project details for the locale by slug and without tags", async () => {
    const db = getDb(env.CONTENTS_DB);
    await seedProject(db, { name: "project-without-tags", slug: "project-without-tags", title: "Post without tags", summary: "It lacks tags", publishedAt: "2026-10-02T00:00:00.000Z", locale: "en", status: "published" });

    const project = (await fetchProjectDetails(db, { slug: "project-without-tags", locale: "en" }))!;
    expect(project).not.toBeNull();
    expect(project.id).toBeGreaterThan(0);
    expect(project.tags).toBeNullable();
    expect(project.isFeatured).toBe(false);
  });

  test("returns null when the project is not found", async () => {
    const db = getDb(env.CONTENTS_DB);
    const project = await fetchProjectDetails(db, { locale: "en", slug: "project-1" });
    expect(project).toBeNull();
  });

  test("returns null when fetching a non-published project", async () => {
    const db = getDb(env.CONTENTS_DB);
    await seedProject(db, { isFeatured: true, name: "project-1", slug: "project-1", title: "Project 1", repositoryUrl: "https://example.com", summary: "Summary 1", publishedAt: "2026-10-01T00:00:00.000Z", locale: "en", status: "draft" });

    const project = await fetchProjectDetails(db, { locale: "en", slug: "project-1" });
    expect(project).toBeNull();
  });
});