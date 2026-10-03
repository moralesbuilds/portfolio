import { Db } from "../../src";

export async function seedTag(
  db: Db,
  overrides: {
    name: string;
    locale: string;
    slug: string;
    label: string;
  }
): Promise<number> {
  const result = await db
    .prepare(
      `INSERT INTO tags (name, locale, slug, label)
      VALUES (?1, ?2, ?3, ?4)
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
