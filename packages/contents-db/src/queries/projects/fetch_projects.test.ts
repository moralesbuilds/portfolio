import { describe, expect, test } from "vitest";
import { getDb } from "../../client";
import { env } from "cloudflare:workers";
import { fetchProjects } from "./fetch_projects";
import { seedProject, seedProjectTag } from "../../../test/seed/projects";
import { seedTag } from "../../../test/seed/tags";

describe("fetchProjects", () => {
  test("returns published projects for the locale, newest first, respecting the page size", async () => {
    const db = getDb(env.CONTENTS_DB);
    await seedProject(db, { name: "project-1", slug: "project-1", title: "Project 1", summary: "Summary 1", publishedAt: "2026-10-01T00:00:00.000Z", locale: "en", status: "published" });
    await seedProject(db, { name: "project-2", slug: "project-2", title: "Project 2", summary: "Summary 2", publishedAt: "2026-10-02T00:00:00.000Z", locale: "en", status: "published" });
  
    const projectId = await seedProject(db, { name: "project-3", slug: "project-3", title: "Project 3", summary: "Summary 3", publishedAt: "2026-10-03T00:00:00.000Z", locale: "en", status: "published", tags: ["a", "b", "c"] });
    const tagAId = await seedTag(db, { name: "a", locale: "en", slug: "a", label: "A" });
    const tagBId = await seedTag(db, { name: "b", locale: "en", slug: "b", label: "B" });
    const tagCId = await seedTag(db, { name: "c", locale: "en", slug: "c", label: "C" })
    await seedProjectTag(db, { projectId, tagId: tagAId });
    await seedProjectTag(db, { projectId, tagId: tagBId });
    await seedProjectTag(db, { projectId, tagId: tagCId });

    const posts = await fetchProjects(db, { locale: "en", pageSize: 2 });
    expect(posts.count).toBe(3);
    expect(posts.size).toBe(2);
    expect(posts.items).toHaveLength(2);
    expect(posts.items?.map((p) => p.slug)).toEqual(["project-3", "project-2"]);
    expect(posts.items?.[0].tags).toEqual(["A", "B", "C"]);
    expect(posts.items?.[1].tags).toBeNullable();
  });

  test("excludes projects that are not published", async () => {
    const db = getDb(env.CONTENTS_DB);
    await seedProject(db, { name: "draft", slug: "draft-project", title: "Draft project", summary: "Working on it", publishedAt: "2026-10-01T00:00:00.000Z", locale: "en", status: "draft" });
    await seedProject(db, { name: "published", slug: "published-project", title: "Published project", summary: "Available to the public", publishedAt: "2026-10-02T00:00:00.000Z", locale: "en", status: "published" });

    const posts = await fetchProjects(db, { locale: "en" });
    expect(posts.count).toBe(1);
    expect(posts.size).toBe(10);
    expect(posts.items).toHaveLength(1);
    expect(posts.items?.map((p) => p.slug)).toEqual(["published-project"]);
  });

  test("excludes projects from a different locale", async () => {
    const db = getDb(env.CONTENTS_DB);
    await seedProject(db, { name: "same-project", slug: "en-project", title: "Project", summary: "Summary", publishedAt: "2026-10-01T00:00:00.000Z", locale: "en", status: "published" });
    await seedProject(db, { name: "same-project", slug: "es-project", title: "Proyecto", summary: "Resumen", publishedAt: "2026-10-01T00:00:00.000Z", locale: "es", status: "published" });

    const posts = await fetchProjects(db, { locale: "es" });
    expect(posts.count).toBe(1);
    expect(posts.items).toHaveLength(1);
    expect(posts.items?.map((p) => p.slug)).toEqual(["es-project"]);
  });

  test("fetchs only featured projects", async () => {
    const db = getDb(env.CONTENTS_DB);
    await seedProject(db, { name: "project-1", slug: "project-1", title: "Project 1", summary: "Summary 1", publishedAt: "2026-10-01T00:00:00.000Z", locale: "en", status: "published" });
    await seedProject(db, { name: "project-2", slug: "project-2", title: "Project 2", summary: "Summary 2", publishedAt: "2026-10-02T00:00:00.000Z", locale: "en", status: "published", isFeatured: true });
  
    const posts = await fetchProjects(db, { locale: "en", pageSize: 3, onlyFeatured: true });
    expect(posts.count).toBe(1);
    expect(posts.size).toBe(3);
    expect(posts.items).toHaveLength(1);
    expect(posts.items?.map((p) => p.slug)).toEqual(["project-2"]);
  });

  test("returns empty page when there are no published projects", async () => {
    const db = getDb(env.CONTENTS_DB);
    const posts = await fetchProjects(db, { locale: "en", pageSize: 3, onlyFeatured: false });
    expect(posts.count).toBe(0);
    expect(posts.size).toBe(3);
    expect(posts.items).toHaveLength(0);
  });
});
