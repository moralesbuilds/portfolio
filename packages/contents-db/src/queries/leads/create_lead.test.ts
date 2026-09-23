import { env } from "cloudflare:workers";
import { beforeEach, describe, expect, test } from "vitest";
import { getDb } from "../../client";
import { createLead } from "./create_lead";
import { Lead } from "../../types";

const iso8601Regex =  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(\.\d+)?(Z|[+-]\d{2}:\d{2})$/;

describe("createLead", () => {
  beforeEach(async () => {
    const db = getDb(env.CONTENTS_DB);
    await db.prepare("DELETE FROM leads;").run();
  });

  test("creates a lead row with default status and locale", async () => {
    const db = getDb(env.CONTENTS_DB);
    await createLead(db, {
      leadSource: "website",
      name: "Tester test",
      email: "tester@test.com",
      message: "I'm here to test your methods",
      ipAddress: "1.1.1.1"
    });

    const rows = await db.prepare(
      "SELECT id, lead_source_id AS leadSourceId, name, email, message, status, locale, ip_address AS ipAddress, is_spam AS isSpam, created_at AS createdAt FROM leads"
    )
    .all<Lead>();

    expect(rows.success).toBeTruthy();
    expect(rows.results).toHaveLength(1);

    const newLead = rows.results[0];
    expect(newLead.id).toBeGreaterThan(0);
    expect(newLead.leadSourceId).toBe(1);
    expect(newLead.name).toBe("Tester test");
    expect(newLead.email).toBe("tester@test.com");
    expect(newLead.message).toBe("I'm here to test your methods");
    expect(newLead.status).toBe("new");
    expect(newLead.locale).toBe("en");
    expect(newLead.ipAddress).toBe("1.1.1.1");
    expect(newLead.isSpam).toBe(0);
    expect(newLead.createdAt).toMatch(iso8601Regex);
  });
});
