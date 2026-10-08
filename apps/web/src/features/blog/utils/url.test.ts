import { describe, expect, test } from "vitest";
import { getBlogPostUrl } from "./url";

describe("getBlogPostUrl", () => {
  test("returns partial url from slug", () => {
    const url = getBlogPostUrl("some-blog");
    expect(url).toBe("/blog/some-blog");
  });
});
