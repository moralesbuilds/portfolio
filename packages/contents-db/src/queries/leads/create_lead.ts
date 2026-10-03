import type { Db } from "../../client";
import type { LeadStatus, Locale } from "../../types";

type CreateLeadInput = {
  leadSource: "website";
  name: string;
  email: string;
  message: string;
  status?: LeadStatus;
  locale?: Locale;
  ipAddress: string;
};

export async function createLead(db: Db, input: CreateLeadInput): Promise<void> {
  const status = input.status ?? 'new';
  const locale = input.locale ?? 'en';

  await db
    .prepare(
      `INSERT INTO leads (lead_source_id, name, email, message, status, locale, ip_address, created_at)
      VALUES ((SELECT id FROM lead_sources WHERE name = ?), ?, ?, ?, ?, ?, ?, strftime('%Y-%m-%dT%H:%M:%SZ', 'now'))`
    )
    .bind(input.leadSource, input.name, input.email, input.message, status, locale, input.ipAddress)
    .run();
}
