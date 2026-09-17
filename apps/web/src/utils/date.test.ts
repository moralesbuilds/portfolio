
import { describe, expect, test } from "vitest";
import { toLocalDate } from "./date";

describe("date utilities functions", () => {
  test("Convert ISO 8601 format into medium lenght display date", () => {
    const displayDate = toLocalDate("2026-08-11T23:10:32");
    expect(displayDate).toBe("Aug 11, 2026");
  });
});
