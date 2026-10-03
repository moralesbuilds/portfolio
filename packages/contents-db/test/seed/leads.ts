import { Db, LeadStatus, Locale } from "../../src";

export async function seedLead(
  db: Db,
  overrides: {
    leadSourceId: number;
    name: string;
    email: string;
    message: string;
    status: LeadStatus;
    locale: Locale;
    ipAddress: string;
    isSpam: boolean;
    createdAt?: string;
  }
): Promise<number> {
  const result = await db
    .prepare(
      `INSERT INTO leads (lead_source_id, name, email, message, status, locale, ip_address, is_spam, created_at)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
      RETURNING id`
    )
    .bind(
      overrides.leadSourceId,
      overrides.name,
      overrides.email,
      overrides.message,
      overrides.status,
      overrides.locale,
      overrides.ipAddress,
      Number(overrides.isSpam),
      overrides.createdAt
    )
    .first<{ id: number }>();
  return result!.id;
}

export async function seedLeadSource(db: Db, overrides: { name: string; }): Promise<number> {
  const result =  await db
    .prepare(
      `INSERT INTO lead_sources (name)
      VALUES (?1)
      RETURNING id`
    )
    .bind(overrides.name)
    .first<{ id: number }>();
  return result!.id;
}
