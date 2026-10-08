import { describe, expect, test } from "vitest";
import { getDb } from "../../client";
import { env } from "cloudflare:workers";
import { seedProject } from "../../../test/seed/projects";
import { fetchProjectSitemapEntries } from "./fetch_project_sitemap_entries";

describe("fetchProjectSitemapEntries", () => {
  test("returns sitemap entries for projects with spanish alternative", async () => {
    const db = getDb(env.CONTENTS_DB);
    await seedProject(db, { name: "project-1", slug: "project-1", title: "Project 1", summary: "Summary 1", publishedAt: "2026-10-01T00:00:00.000Z", locale: "en", status: "published" });
    await seedProject(db, { name: "project-1", slug: "proyecto-1", title: "Proyecto 1", summary: "Resumen 1", publishedAt: "2026-10-01T00:00:00.000Z", locale: "es", status: "published" });
    await seedProject(db, { name: "project-2", slug: "project-2", title: "Project 2", summary: "Summary 2", publishedAt: "2026-10-02T00:00:00.000Z", locale: "en", status: "published", updatedAt: "2026-10-05T00:00:00.000Z" });

    const entries = await fetchProjectSitemapEntries(db);
    expect(entries).toHaveLength(2);
    expect(entries[0].slug).toBe("project-1");
    expect(entries[0].lastModified).toBe("2026-10-01T00:00:00.000Z");
    expect(entries[0].alternates).toEqual({ en: "project-1", es: "proyecto-1" });

    expect(entries[1].slug).toBe("project-2");
    expect(entries[1].lastModified).toBe("2026-10-05T00:00:00.000Z");
    expect(entries[1].alternates).toEqual({ en: "project-2" });
  });

  test("returns empty array for unpublished projects", async () => {
    const db = getDb(env.CONTENTS_DB);
    await seedProject(db, { name: "project-1", slug: "project-1", title: "Project 1", summary: "Summary 1", publishedAt: "2026-10-01T00:00:00.000Z", locale: "en", status: "draft" });
    await seedProject(db, { name: "project-2", slug: "project-2", title: "Project 2", summary: "Summary 2", publishedAt: "2026-10-02T00:00:00.000Z", locale: "en", status: "archived" });

    const entries = await fetchProjectSitemapEntries(db);
    expect(entries).toEqual([]);
  });
});
