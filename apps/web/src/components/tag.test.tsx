import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Tag } from "./tag";

describe("Tag (unit)", () => {
  test("display label", () => {
    render(<Tag label="My label" />);
    expect(screen.getByText("My label")).toBeInTheDocument();
  });
});
