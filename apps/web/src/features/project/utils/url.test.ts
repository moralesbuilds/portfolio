import { describe, expect, test } from "vitest";
import { getAbsoluteProjectUrl, getProjectUrl } from "./url";

describe("getProjectUrl", () => {
  test("returns relative url from slug", () => {
    const url = getProjectUrl("some-project");
    expect(url).toBe("/project/some-project");
  });
});

describe("getAbsoluteProjectUrl", () => {
  test("returns absolute url from slug without locale", () => {
    process.env.BASE_URL = "https://example.com";
    const url = getAbsoluteProjectUrl("some-project");
    expect(url).toBe("https://example.com/project/some-project");
  });

  test("returns absolute url from slug with locale", () => {
    process.env.BASE_URL = "https://example.com";
    const url = getAbsoluteProjectUrl("algun-proyecto", "es");
    expect(url).toBe("https://example.com/es/project/algun-proyecto");
  });
});
