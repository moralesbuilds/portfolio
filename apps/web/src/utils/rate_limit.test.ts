import { beforeEach, describe, expect, test } from "vitest";
import { createInMemoryRateLimitStore, type InMemoryRateLimitStore } from "../../tests/rate_limit_store";
import { isRateLimited } from "./rate_limit";

const options = { max: 3, windowMs: 1000 };

describe("isRateLimited", () => {
  let store: InMemoryRateLimitStore;
  beforeEach(() => {
    store = createInMemoryRateLimitStore();
  });

  test("allows attempts up to the max", async () => {
    for (const t of [0, 1, 2]) {
      expect(await isRateLimited(store, "a", t, options)).toBeFalsy();
    }
  });

  test("blocks the attempt that exceeds the max", async () => {
    for (const t of [0, 1, 2]) {
      await isRateLimited(store, "a", t, options);
    }
    expect(await isRateLimited(store, "a", 3, options)).toBeTruthy();
  });

  test("tracks each key independently", async () => {
    for (const t of [0, 1, 2, 3]) {
      await isRateLimited(store, "a", t, options);
    }
    expect(await isRateLimited(store, "b", 4, options)).toBeFalsy();
  });

  test("allows again once the window has slid past the old attemps", async () => {
    for (const t of [0, 1, 2, 3]) {
      await isRateLimited(store, "a", t, options);
    }
    expect(await isRateLimited(store, "a", 1004, options)).toBeFalsy();
  });

  test("an attempt exactly one window old no longer counts", async () => {
    for (const t of [0, 0, 0]) {
      await isRateLimited(store, "a", t, options);
    }
    expect(await isRateLimited(store, "a", 1000, options)).toBeFalsy();
  });

  test("blocked attemps are recorded too, so hammering keeps you blocked", async () => {
    for (const t of [0, 1, 2, 3, 4, 5]) {
      await isRateLimited(store, "a", t, options);
    }
    expect(await isRateLimited(store, "a", 900, options)).toBeTruthy();
  });

  test("prunes expired rows", async () => {
    await isRateLimited(store, "a", 0, options);
    await isRateLimited(store, "a", 5000, options);
    expect(store.rows).toHaveLength(1);
  });
});
