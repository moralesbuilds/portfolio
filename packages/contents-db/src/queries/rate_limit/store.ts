import type { Db } from "../../client";
import { RateLimitStore } from "../../types";

export function createRateLimitStore(db: Db): RateLimitStore {
  return {
    async record(key, now) {
      await db
        .prepare("INSERT INTO rate_limit_hits (key, created_at) VALUES (?, ?)")
        .bind(key, now)
        .run();
    },

    async countSince(key, since) {
      const row = await db
        .prepare("SELECT COUNT(*) AS n FROM rate_limit_hits WHERE key = ? AND created_at > ?")
        .bind(key, since)
        .first<{ n: number }>();
      return row?.n ?? 0;
    },

    async prune(before) {
      await db
        .prepare("DELETE FROM rate_limit_hits WHERE created_at < ?")
        .bind(before)
        .run();
    }
  };
}
