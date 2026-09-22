import type { readD1Migrations } from "@cloudflare/vitest-plugin";

type Migrations = Awaited<ReturnType<typeof readD1Migrations>>;

declare global {
  interface Env {
    TEST_MIGRATIONS: Migrations;
  }
  namespace Cloudflare {
    interface Env {
      TEST_MIGRATIONS: Migrations;
    }
  }
}

export {};