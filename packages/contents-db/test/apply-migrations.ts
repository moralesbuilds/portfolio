import { applyD1Migrations } from "cloudflare:test";
import { env } from "cloudflare:workers";

await applyD1Migrations(env.CONTENTS_DB, env.TEST_MIGRATIONS);