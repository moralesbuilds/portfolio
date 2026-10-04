import { describe, expect, test } from "vitest";
import { getProjectLink } from "./link";

describe("getProjectLink", () => {
  test("returns partial link from slug", () => {
    const link = getProjectLink("some-project");
    expect(link).toBe("/project/some-project");
  });
});
