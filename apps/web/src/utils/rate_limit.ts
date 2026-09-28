import { RateLimitStore } from "@moralesbuilds/contents-db";

export type RateLimitOptions = {
  max: number;
  windowMs: number;
};

export async function isRateLimited(store: RateLimitStore, key: string, now: number, { max, windowMs }: RateLimitOptions): Promise<boolean> {
  const window = now - windowMs;
  await store.prune(window); // Drop the expired rows so the table doesn't group forever
  await store.record(key, now);
  
  const count = await store.countSince(key, window);
  return count > max;
}
