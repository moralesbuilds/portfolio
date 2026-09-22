import { describe, expect, test } from "vitest";
import { queryToNumber, type QueryValue } from "./query";

describe("query utilities fucntions", () => {
  const emptyCases: [string, QueryValue][] = [
    ["undefined", undefined],
    ["empty string", ""],
    ["empty array", []],
    ["array with empty string", [""]],
    ["not a number string", "xyz"],
    ["not a number in array", ["abc"]]
  ];

  for (const [name, values] of emptyCases) {
    test(`returns default value when query value is ${name}`, () => {
      expect(queryToNumber(values, 2)).toBe(2);
    });
  }

  const successCases: [string, QueryValue][] = [
    ["integer number", "8"],
    ["floating number", "8.0"],
    ["integer number in array", ["8"]],
    ["floating number in array", ["8.0"]]
  ];

  for (const [name, values] of successCases) {
    test(`returns value converted from ${name}`, () => {
      expect(queryToNumber(values, 5)).toBe(8);
    });
  }
});
