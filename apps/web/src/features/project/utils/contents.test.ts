import { describe, expect, test } from "vitest";
import { getProjectSummaryFilename } from "./contents";

describe("getProjectSummaryFilename", () => {
  test("returns the project summary markdown filename", () => {
    const result = getProjectSummaryFilename({ locale: "es", slug: "test" });
    expect(result).toBe("projects/es/test.md");
  });

  test("return the project summary markdown filename for default locale (EN)", () => {
    const result = getProjectSummaryFilename({ slug: "test" });
    expect(result).toBe("projects/en/test.md");
  });
});
