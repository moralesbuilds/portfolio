import type { Db } from "../client";

export async function ping(db: Db): Promise<boolean> {
  const row = await db.prepare("SELECT 1 AS ok").first<{ ok: number }>();
  return row?.ok === 1;
}

