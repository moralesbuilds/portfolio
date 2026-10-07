import { describe, expect, test } from "vitest";
import { getAbsoluteBlogPostUrl, getBlogPostUrl } from "./url";

describe("getBlogPostUrl", () => {
  test("returns partial url from slug", () => {
    const url = getBlogPostUrl("some-blog");
    expect(url).toBe("/blog/some-blog");
  });
});

describe("getAbsoluteBlogPostUrl", () => {
  test("returns absolute url from slug without locale", () => {
    process.env.BASE_URL = "https://example.com";
    const url = getAbsoluteBlogPostUrl("some-blog");
    expect(url).toBe("https://example.com/blog/some-blog");
  });

  test("returns absolute url from slug with locale", () => {
    process.env.BASE_URL = "https://example.com";
    const url = getAbsoluteBlogPostUrl("algun-blog", "es");
    expect(url).toBe("https://example.com/es/blog/algun-blog");
  });
});
