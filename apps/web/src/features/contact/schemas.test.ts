import { describe, expect, test } from "vitest";
import { contactMeSchema } from "./schemas";

const valid = {
  name: "Ana Perez",
  email: "ana@example.com",
  message: "Hi, I would like a quote for a project.",
};

function failedFields(input: unknown): string[] {
  const result = contactMeSchema.safeParse(input);
  if (result.success) return [];
  return [...new Set(result.error.issues.map((i) => String(i.path[0])))];
}

describe("contactMeSchema", () => {
  describe("valid input", () => {
    test("accepts a correct contact", () => {
      expect(contactMeSchema.safeParse(valid).success).toBe(true);
    });

    test("trims whitespace in name and message", () => {
      const result = contactMeSchema.parse({ ...valid, name: "  Ana  ", message: "  Hi  " });
      expect(result.name).toBe("Ana");
      expect(result.message).toBe("Hi");
    });

    test("normalizes email: trims whitespace and lowercases", () => {
      const result = contactMeSchema.parse({ ...valid, email: "  Ana@Example.COM " });
      expect(result.email).toBe("ana@example.com");
    });

    test("ignores extra fields (honeypot 'website', timestamp 't')", () => {
      const result = contactMeSchema.parse({ ...valid, website: "spam", t: "123" });
      expect(result).toEqual(valid);
    });
  });

  describe("name", () => {
    const cases: [string, string][] = [
      ["empty", ""],
      ["whitespace only", "   "],
    ];
    for (const [name, value] of cases) {
      test(`rejects ${name}`, () => {
        expect(failedFields({ ...valid, name: value })).toEqual(["name"]);
      })
    }

    test("accepts exactly 100 characters", () => {
      expect(contactMeSchema.safeParse({ ...valid, name: "a".repeat(100) }).success).toBe(true);
    });

    test("rejects 101 characters", () => {
      expect(failedFields({ ...valid, name: "a".repeat(101) })).toEqual(["name"]);
    });
  });

  describe("email", () => {
    const cases: [string, string][] = [
      ["empty", ""],
      ["missing @", "ana.example.com"],
      ["missing domain", "ana@"],
      ["missing local part", "@example.com"],
      ["inner whitespace", "ana perez@example.com"],
    ];
    for (const [name, value] of cases) {
      test(`rejects ${name}`, () => {
        expect(failedFields({ ...valid, email: value })).toEqual(["email"]);
      })
    }

    test("accepts exactly 100 characters", () => {
      const email = `${"a".repeat(64)}@${"b".repeat(31)}.com`; // 100
      expect(email).toHaveLength(100);
      expect(contactMeSchema.safeParse({ ...valid, email }).success).toBe(true);
    });

    test("rejects more than 100 characters even if the format is valid", () => {
      const email = `${"a".repeat(64)}@${"b".repeat(32)}.com`; // 101
      expect(email).toHaveLength(101);
      expect(failedFields({ ...valid, email })).toEqual(["email"]);
    });
  });

  describe("message", () => {
    const cases: [string, string][] = [
      ["empty", ""],
      ["whitespace only", "   \n  "],
    ];
    for (const [name, value] of cases) {
      test(`rejects ${name}`, () => {
        expect(failedFields({ ...valid, message: value })).toEqual(["message"]);
      })
    }

    test("accepts exactly 2000 characters", () => {
      expect(contactMeSchema.safeParse({ ...valid, message: "a".repeat(2000) }).success).toBe(true);
    });

    test("rejects 2001 characters", () => {
      expect(failedFields({ ...valid, message: "a".repeat(2001) })).toEqual(["message"]);
    });
  });

  describe("structure", () => {
    test("reports every invalid field at once", () => {
      expect(failedFields({ name: "", email: "x", message: "" }).sort()).toEqual([
        "email",
        "message",
        "name",
      ]);
    });

    const cases: [string, object | null][] = [
      ["empty object", {}],
      ["null", null],
      ["fields with the wrong type", { name: 1, email: true, message: [] }]
    ];
    for (const [name, input] of cases) {
      test(`rejects ${name}`, () => {
        expect(contactMeSchema.safeParse(input).success).toBe(false);
      });
    }
  });
});
