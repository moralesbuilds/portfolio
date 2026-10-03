import { describe, expect, test } from "vitest";
import { getBlogPostFilename } from "./contents";

describe("getBlogPostFilename", () => {
  test("returns the blog post markdown filename", () => {
    const result = getBlogPostFilename({ locale: "es", slug: "test" });
    expect(result).toBe("blog_posts/es/test.md");
  });

  test("return the blog post markdown filename for default locale (EN)", () => {
    const result = getBlogPostFilename({ slug: "test" });
    expect(result).toBe("blog_posts/en/test.md");
  });
});
