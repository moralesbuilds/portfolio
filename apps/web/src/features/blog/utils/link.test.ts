import { describe, expect, test } from "vitest";
import { getBlogPostLink } from "./link";

describe("getBlogPostLink", () => {
  test("returns partial link from slug", () => {
    const link = getBlogPostLink("some-blog");
    expect(link).toBe("/blog/some-blog");
  });
});
