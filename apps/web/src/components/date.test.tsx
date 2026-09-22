import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Date } from "./date";

describe("Date (unit)", () => {
  test("Display human readable date", () => {
    render(<Date value="2026-09-17T23:10:32Z" />);

    const date = screen.getByText("Sep 17, 2026");
    expect(date).toBeInTheDocument();
    expect(date).toHaveAttribute("datetime", "2026-09-17T23:10:32Z");
  });
});
