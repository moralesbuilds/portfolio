import { describe, expect, test } from "vitest";
import { getLink } from "./link";

describe("Blog link functions", () => {
  test("returns partial link from slug", () => {
    const link = getLink("some-blog");
    expect(link).toBe("/blog/some-blog");
  });
});
