import { type RateLimitStore } from "@moralesbuilds/contents-db";

type RateLimitRow = {
  key: string;
  at: number;
};

export interface InMemoryRateLimitStore extends RateLimitStore {
  rows: RateLimitRow[];
}

export function createInMemoryRateLimitStore(): InMemoryRateLimitStore {
  const rows: RateLimitRow[] = [];
  return {
    rows,

    async record(key, now) {
      rows.push({ key, at: now });
    },

    async countSince(key, since) {
      return rows.filter((r) => r.key === key && r.at > since).length;
    },
    
    async prune(before) {
      for (let i = rows.length - 1; i >= 0; i--) {
        if (rows[i].at < before) {
          rows.splice(i, 1);
        }
      }
    }
  }
}
