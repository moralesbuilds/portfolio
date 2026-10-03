import { useIsActiveRoute } from "@/hooks/use_is_active_route";
import { render, screen } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { Tab } from "./tab";
import { NextIntlClientProvider } from "next-intl";

vi.mock("@/hooks/use_is_active_route", () => ({
  useIsActiveRoute: vi.fn()
}));

function renderTab() {
  render(
    <NextIntlClientProvider locale="en" messages={{}}>
      <Tab href="/parent">Parent</Tab>
    </NextIntlClientProvider>
  );
}

describe("Tab (unit)", () => {
  test("renders tab as active", () => {
    vi.mocked(useIsActiveRoute).mockReturnValue(true);

    renderTab();

    const link = screen.getByText("Parent");
    expect(link).toBeInTheDocument();
    expect(link).not.toHaveAttribute("href");
    expect(link).toHaveRole("tab");
    expect(link).toHaveAttribute("aria-selected", "true");
    expect(link).toHaveAttribute("aria-current", "page");
  });

  test("renders tab as inactive", () => {
    vi.mocked(useIsActiveRoute).mockReturnValue(false);

    renderTab();

    const link = screen.getByText("Parent");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/parent");
    expect(link).toHaveRole("tab");
    expect(link).toHaveAttribute("aria-selected", "false");
    expect(link).not.toHaveAttribute("aria-current");
  });
});
