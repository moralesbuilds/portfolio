import { applyD1Migrations } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { beforeEach } from "vitest";
import { getDb } from "../src";

await applyD1Migrations(env.CONTENTS_DB, env.TEST_MIGRATIONS);

beforeEach(async () => {
  const db = getDb(env.CONTENTS_DB);
  await db.prepare("DELETE FROM blog_posts").run();
  await db.prepare("DELETE FROM projects").run();
  await db.prepare("DELETE FROM leads").run();
  await db.prepare("DELETE FROM rate_limit_hits").run();
  await db.prepare("DELETE FROM tags").run();
});
