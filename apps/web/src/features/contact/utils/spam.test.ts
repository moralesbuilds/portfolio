import { describe, expect, test } from "vitest";
import { countLinks, hasTooManyLinks } from "./spam";

describe("countLinks", () => {
  const cases: [string, string, number][] = [
    ["plain text", "Hi, I'd like a quote", 0],
    ["empty string", "", 0],
    ["one http link", "see http://a.com", 1],
    ["one https link", "see https://a.com/path?x=1", 1],
    ["bare www link", "visit www.a.com", 1],
    ["uppercase protocol and www", "HTTP://A.COM and WWW.B.COM", 2],
    ["links on separate lines", "a\nhttp://x.com\nhttp://y.com", 2],
    ["glued links", "https://a.comhttps://b.com", 2],
    ["link nested in a query string", "http://a.com/?u=http://b.com", 2],
  ];
  for (const [testCase, message, expectedCount] of cases) {
    test(testCase, () => {
      expect(countLinks(message)).toBe(expectedCount);
    });
  }

  test("does not double count http://www.", () => {
    expect(countLinks("http://www.a.com")).toBe(1);
  });

  test("ignores 'www.' inside another word", () => {
    expect(countLinks("hellowww.x")).toBe(0);
  });

  test("ignores domains without protocol or www (known limitation)", () => {
    expect(countLinks("buy at cheap-pills.xyz")).toBe(0);
  });
});

describe("hasTooManyLinks", () => {
  test("allows up to the default limit of 2", () => {
    expect(hasTooManyLinks("http://a.com http://b.com")).toBe(false);
  });

  test("rejects above the default limit", () => {
    expect(hasTooManyLinks("http://a.com http://b.com www.c.com")).toBe(true);
  });

  test("respects a custom limit", () => {
    expect(hasTooManyLinks("http://a.com", 0)).toBe(true);
    expect(hasTooManyLinks("http://a.com", 1)).toBe(false);
  });
});
