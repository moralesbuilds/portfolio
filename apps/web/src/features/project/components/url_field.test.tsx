import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { UrlField } from "./url_field";

describe("UrlField (unit)", () => {
  test("renders as code repository link", () => {
    render(
      <UrlField url="https://example.com" label="Repository" isCode />
    );

    expect(screen.getByText("Repository")).toBeInTheDocument();

    const link = screen.getByTestId("url-field-anchor");
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");

    expect(screen.getByTestId("code-icon")).toBeInTheDocument();
    expect(screen.getByTestId("external-link-icon")).toBeInTheDocument();
  });

  test("renders as simple external link", () => {
    render(
      <UrlField url="https://example.com" label="Live demo" isCode={false} />
    );

    expect(screen.getByText("Live demo")).toBeInTheDocument();
    expect(screen.getByTestId("url-field-anchor")).toBeInTheDocument();
    expect(screen.queryByTestId("code-icon")).not.toBeInTheDocument();
    expect(screen.getByTestId("external-link-icon")).toBeInTheDocument();
  });
});