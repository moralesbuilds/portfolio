import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { ExternalLink } from "./external_link";

describe("ExternalLink (unit)", () => {
  test("display link with label and icon", () => {
    render(
      <ExternalLink href="https://domain.com/example" label="Example" icon={<div>D</div>} />
    );

    const anchor = screen.getByText("Example");
    expect(anchor).toHaveAttribute("href", "https://domain.com/example");
    expect(anchor).toHaveAttribute("target", "_blank");
    expect(anchor).toHaveAttribute("rel", "noopener noreferrer");

    expect(screen.getByText("D")).toBeInTheDocument();
  })
});
