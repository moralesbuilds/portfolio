import { describe, expect, test } from "vitest";
import { sha256Hex } from "./crypto";

describe("sha256Hex", () => {
  test("is deterministic and returns 64 hex characters", async () => {
    const hex = await sha256Hex("1.2.3.4salt");
    expect(hex).toBe(await sha256Hex("1.2.3.4salt"));
    expect(hex).toMatch(/^[0-9a-f]{64}$/);
  });

  test("a different salt gives a different hash", async () => {
    expect(await sha256Hex("1.2.3.4salt1")).not.toBe(await sha256Hex("1.2.3.4salt2"));
  });
});
