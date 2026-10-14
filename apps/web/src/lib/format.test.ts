import { describe, expect, test } from "vitest";
import { formatBytes, formatUnit, toLocalDate } from "./format";
import { MetricUnit } from "@moralesbuilds/metrics-db";

describe("formatBytes", () => {
  const binaryBaseCases: [string, number, string][] = [
    ["bytes (binary)", 1023, "1,023 B"],
    ["kibibytes", 2048, "2.0 KiB"],
    ["mebibytes", 5242880, "5.0 MiB"],
    ["gibibytes", 10737418240, "10.0 GiB"],
    ["tebibytes", 2199023255552, "2.0 TiB"],
    ["pebibytes", 1125899906842624, "1.0 PiB"],
  ];
  for (const [name, bytes, expectedResult] of binaryBaseCases) {
    test(`Convert bytes into human readable ${name}`, () => {
      expect(formatBytes(bytes, false, 1)).toBe(expectedResult);
    });
  }

  const metricBaseCases: [string, number, string][] = [
    ["bytes (metric)", 999, "999 B"],
    ["kilobytes", 2000, "2.0 kB"],
    ["megabytes", 5000000, "5.0 MB"],
    ["gigabytes", 10000000000, "10.0 GB"],
    ["terabytes", 2000000000000, "2.0 TB"],
    ["petabytes", 3000000000000000, "3.0 PB"]
  ];
  for (const [name, bytes, expectedResult] of metricBaseCases) {
    test(`Convert bytes into human readable ${name}`, () => {
      expect(formatBytes(bytes, true, 1)).toBe(expectedResult);
    });
  }
});

describe("formatUnit", () => {
  const cases: [MetricUnit, number, string][] = [
    ["bytes", 2621440, "2.5 MiB"],
    ["ms", 450, "450 ms"],
    ["count", 1495, "1,495"],
    ["percent", 0.8601, "86.01%"],
    ["score", 78.4, "78.4"]
  ];

  for (const [unit, value, expectedResult] of cases) {
    test(`Convert value into human readable ${unit}`, () =>{
      expect(formatUnit(value, unit)).toBe(expectedResult);
    });
  }
});

describe("toLocalDate", () => {
  test("Convert ISO 8601 format into medium lenght display date", () => {
    const displayDate = toLocalDate("2026-08-11T23:10:32");
    expect(displayDate).toBe("Aug 11, 2026");
  });
});

