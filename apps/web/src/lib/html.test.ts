import { describe, expect, test } from "vitest";
import { escapeHtml } from "./html";

describe("escapeHtml", () => {
  const escapedCases: [string, string | undefined, string | undefined][] = [
    ["ampersand", "This string contains & and more", "This string contains &amp; and more"],
    ["opening angle bracket", "Apples cost < oranges", "Apples cost &lt; oranges"],
    ["closing angle bracket", "Oranges cost > apples", "Oranges cost &gt; apples"],
    ["double quote", "This is an \"apparent\" result", "This is an &quot;apparent&quot; result"],
    ["apostrophe", "Mike's house is pretty", "Mike&#39;s house is pretty"],
    ["undefined", undefined, undefined],
    ["without changes", "ABC", "ABC"]
  ];

  for (const [name, rawString, expectedResult] of escapedCases) {
    test(`should escape ${name}`, () => {
      expect(escapeHtml(rawString)).toBe(expectedResult);
    });
  }  
});
