import type { Db, Project } from "../../src";

export async function seedProject(db: Db, project: Project) {
  let tags: number[] = [];
  if ((project.tags?.length ?? 0) > 0) {
    const statements = project.tags?.map((t) => db.prepare(
      "INSERT INTO tags (name, slug, label, locale) VALUES (?1, ?2, ?3, ?4) RETURNING id"
    ).bind(t, t, t, project.locale))!;
    const batchResults = await db.batch<{ id: number }>(statements);
    tags = batchResults.map((statementResult) => statementResult.results[0].id);
  }

  const result = await db
    .prepare(
      `INSERT INTO projects (name, locale, slug, title, summary, repository_url, status, is_featured, author_id, published_at, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))
      RETURNING id`
    )
    .bind(
      project.name,
      project.locale,
      project.slug,
      project.title,
      project.summary,
      project.repositoryUrl ?? null,
      project.status,
      Number(project.isFeatured ?? 0),
      project.publishedAt
    )
    .first<{ id: number }>();

  if (tags.length > 0) {
    const pid = result?.id;
    const statements = tags.map((tid) => db.prepare(
      "INSERT INTO project_tags (project_id, tag_id) VALUES (?1, ?2)"
    ).bind(pid, tid));
    await db.batch(statements);
  }
}