import type { Db, Project } from "../../src";

export async function seedProject(db: Db, project: Partial<Project>): Promise<number> {
  const result = await db
    .prepare(
      `INSERT INTO projects (name, locale, slug, title, summary, repository_url, status, is_featured, author_id, published_at, created_at, updated_at)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, 1, ?9, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'), ?10)
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
      project.publishedAt,
      project.updatedAt ?? null,
    )
    .first<{ id: number }>();
  return result!.id;
}

export async function seedProjectTag(
  db: Db,
  overrides: {
    projectId: number;
    tagId: number;
  }
) {
  await db
    .prepare(
      `INSERT INTO project_tags (project_id, tag_id)
      VALUES (?1, ?2)`
    )
    .bind(
      overrides.projectId,
      overrides.tagId
    )
    .run();
}

export async function seedProjectBlogPost(
  db: Db,
  overrides: {
    projectId: number;
    blogPostId: number
  }
) {
  await db
    .prepare(
      `INSERT INTO project_blog_posts (project_id, blog_post_id)
      VALUES (?1, ?2)`
    )
    .bind(
      overrides.projectId,
      overrides.blogPostId
    )
    .run();
}
