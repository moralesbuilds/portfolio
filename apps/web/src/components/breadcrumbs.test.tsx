import { NextIntlClientProvider } from "next-intl";
import { describe, expect, test, vi } from "vitest";
import { Breadcrumbs } from "./breadcrumbs";
import { render, screen } from "@testing-library/react";
import { usePathname } from "@/i18n/navigation";

vi.mock('@/i18n/navigation', async (importActual) => {
  const actual = await importActual<typeof import('@/i18n/navigation')>();
  return {
    ...actual,
    usePathname: vi.fn()
  };
});

function renderBreadcrumbs() {
  render(
    <NextIntlClientProvider locale="en" messages={{ root: { home: "Home", parent: "Parent", leaf: "Leaf" } }}>
      <Breadcrumbs />
    </NextIntlClientProvider>
  );
}

describe("Breadcrumbs (unit)", () => {
  test("display only home", () => {
    vi.mocked(usePathname).mockReturnValue("/")

    renderBreadcrumbs();

    const home = screen.getByText("Home");
    expect(home).toBeInTheDocument();
    expect(home).toHaveAttribute("href", "/");

    expect(screen.queryByText("Parent")).not.toBeInTheDocument();
    expect(screen.queryByText("Leaf")).not.toBeInTheDocument();
  });

  test("display parent route", () => {
    vi.mocked(usePathname).mockReturnValue("/parent")

    renderBreadcrumbs();

    const home = screen.getByText("Home");
    expect(home).toBeInTheDocument();
    expect(home).toHaveAttribute("href", "/");

    const parent = screen.getByText("Parent");
    expect(parent).toBeInTheDocument();
    expect(parent).not.toBe("A");

    expect(screen.queryByText("Leaf")).not.toBeInTheDocument();
  });

  test("display leaf route", () => {
    vi.mocked(usePathname).mockReturnValue("/parent/leaf")

    renderBreadcrumbs();

    const home = screen.getByText("Home");
    expect(home).toBeInTheDocument();
    expect(home).toHaveAttribute("href", "/");

    const parent = screen.getByText("Parent");
    expect(parent).toBeInTheDocument();
    expect(parent).toHaveAttribute("href", "/parent");

    const leaf = screen.getByText("Leaf");
    expect(leaf).toBeInTheDocument();
    expect(leaf).not.toBe("A");
  });
});
