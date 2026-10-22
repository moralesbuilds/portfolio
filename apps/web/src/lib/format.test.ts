import { describe, expect, test } from "vitest";
import { formatBytes, formatUnit, toLocalDate, unixTimestampToShortDate, unixTimestampToShortDateTime } from "./format";
import { MetricUnit } from "@moralesbuilds/metrics-db";

describe("formatBytes", () => {
  const binaryBaseCases: [string, number, string][] = [
    ["bytes (binary)", 1023, "1,023 B"],
    ["kibibytes", 2048, "2.0 KiB"],
    ["mebibytes", 5242880, "5.0 MiB"],
    ["gibibytes", 10737418240, "10.0 GiB"],
    ["tebibytes", 2199023255552, "2.0 TiB"],
    ["pebibytes", 1125899906842624, "1.0 PiB"],
  ] as const;
  test.each(binaryBaseCases)("Convert bytes into human readable %s", (_, bytes, expectedResult) => {
    expect(formatBytes(bytes, false, 1)).toBe(expectedResult);
  });

  const metricBaseCases: [string, number, string][] = [
    ["bytes (metric)", 999, "999 B"],
    ["kilobytes", 2000, "2.0 kB"],
    ["megabytes", 5000000, "5.0 MB"],
    ["gigabytes", 10000000000, "10.0 GB"],
    ["terabytes", 2000000000000, "2.0 TB"],
    ["petabytes", 3000000000000000, "3.0 PB"]
  ] as const;
  test.each(metricBaseCases)("Convert bytes into human readable %s", (_, bytes, expectedResult) => {
    expect(formatBytes(bytes, true, 1)).toBe(expectedResult);
  });
});

describe("formatUnit", () => {
  const cases: [MetricUnit, number, string][] = [
    ["bytes", 2621440, "2.5 MiB"],
    ["ms", 450, "450 ms"],
    ["count", 1495, "1,495"],
    ["percent", 0.8601, "86.01%"],
    ["score", 78.4, "78.4"]
  ] as const;
  test.each(cases)("Convert value into human readable %s", (unit, value, expectedResult) => {
    expect(formatUnit(value, unit)).toBe(expectedResult);
  });
});

describe("toLocalDate", () => {
  test("Convert ISO 8601 format into medium lenght display date", () => {
    expect(toLocalDate("2026-08-11T23:10:32")).toBe("Aug 11, 2026");
  });
});

describe("unixTimestampToShortDate", () => {
  test("Convert unix timestamp into short date only string", () => {
    expect(unixTimestampToShortDate(1064532199)).toBe("Sep 25, 03");
  });
});

describe("unixTimestampToShortDateTime", () => {
  test("Convert unix timestamp into short date time string", () => {
    expect(unixTimestampToShortDateTime(1010280643)).toBe("Jan 6, 2002, 01:30 AM")
  });
});
