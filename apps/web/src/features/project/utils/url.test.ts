import { describe, expect, test } from "vitest";
import { getProjectUrl } from "./url";

describe("getProjectUrl", () => {
  test("returns relative url from slug", () => {
    const url = getProjectUrl("some-project");
    expect(url).toBe("/project/some-project");
  });
});
