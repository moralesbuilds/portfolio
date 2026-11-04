import { applyD1Migrations } from "cloudflare:test";
import { env } from "cloudflare:workers";
import { beforeEach } from "vitest";
import { getDb } from "../src";

await applyD1Migrations(env.METRICS_DB, env.TEST_MIGRATIONS);

beforeEach(async () => {
  const db = getDb(env.METRICS_DB);
  await db.prepare("DELETE FROM metric_samples;").run();
  await db.prepare("DELETE FROM project_metrics;").run();
  await db.prepare("DELETE FROM metric_definitions;").run();
});
