import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { FieldErrors } from "./field_errors";

describe("FieldErrors (unit)", () => {
  const nothingCases: [string, null | undefined | string[]][] = [
    ["null", null],
    ["undefined", undefined],
    ["empty array", []]
  ];

  for (const [name, errors] of nothingCases) {
    test(`renders nothing when errors is ${name}`, () => {
      const { container } = render(
        <FieldErrors id="errors" errors={errors} />
      );
      expect(container.firstChild).toBeNull();
    });
  }

  test("renders error list", () => {
    render(
      <FieldErrors id="errors" errors={["First error", "Second Error"]} />
    );

    expect(screen.getByText("First error")).toBeInTheDocument();
    expect(screen.getByText("Second Error")).toBeInTheDocument();
  });
});
