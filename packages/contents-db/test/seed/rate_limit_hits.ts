import { Db } from "../../src";

export async function seedRateLimitHit(
  db: Db,
  overrides: {
    key: string;
    createdAt: number
  }
): Promise<number> {
  const result = await db
    .prepare(
      `INSERT INTO rate_limit_hits (key, created_at)
      VALUES (?1, ?2)
      RETURNING id`
    )
    .bind(
      overrides.key,
      overrides.createdAt
    )
    .first<{ id: number }>();
  return result!.id;
}
