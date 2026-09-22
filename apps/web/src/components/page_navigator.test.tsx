import { NextIntlClientProvider } from "next-intl";
import { describe, expect, test, vi } from "vitest";
import { PageNavigation, PageNavigationProps } from "./page_navigator";
import { render, screen } from "@testing-library/react";
import { usePathname } from "@/i18n/navigation";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

vi.mock('@/i18n/navigation', async (importActual) => {
  const actual = await importActual<typeof import('@/i18n/navigation')>();
  return {
    ...actual,
    usePathname: vi.fn()
  };
});

vi.mock('next/navigation', async (importActual) => {
  const actual = await importActual<typeof import('next/navigation')>();
  return {
    ...actual,
    useSearchParams: vi.fn()
  };
});

function renderPageNavigator(props: PageNavigationProps) {
  return render(
    <NextIntlClientProvider locale="en" messages={{ root: { prev: "Prev", next: "Next" } }}>
      <PageNavigation {...props} />
    </NextIntlClientProvider>
  );
}

describe("PageNavigator (unit)", () => {
  test("shows no page", () => {
    const { container } = renderPageNavigator({ pageIndex: 1, pageSize: 10, total: 0 });

    const prev = screen.getByText("Prev");
    expect(prev).toBeInTheDocument();
    expect(prev).not.toHaveAttribute("href")

    const next = screen.getByText("Next");
    expect(next).toBeInTheDocument();
    expect(next).not.toHaveAttribute("href");

    const pages = container.querySelectorAll("[data-page]");
    expect(pages).toHaveLength(0);
  });

  test("shows a single page", () => {
    const { container } = renderPageNavigator({ pageIndex: 1, pageSize: 10, total: 2 });

    const prev = screen.getByText("Prev");
    expect(prev).toBeInTheDocument();
    expect(prev).not.toHaveAttribute("href")

    const next = screen.getByText("Next");
    expect(next).toBeInTheDocument();
    expect(next).not.toHaveAttribute("href");

    const pages = container.querySelectorAll("[data-page]");
    expect(pages).toHaveLength(1);
    expect(pages[0]).toHaveTextContent("1");
    expect(pages[0]).not.toHaveAttribute("href");
  });

  test("shows two pages with current page at one", () => {
    vi.mocked(usePathname).mockReturnValue("/test");
    vi.mocked(useSearchParams).mockReturnValue(new ReadonlyURLSearchParams());

    const { container } = renderPageNavigator({ pageIndex: 1, pageSize: 10, total: 12 });

    const prev = screen.getByText("Prev");
    expect(prev).toBeInTheDocument();
    expect(prev).not.toHaveAttribute("href");

    const next = screen.getByText("Next");
    expect(next).toBeInTheDocument();
    expect(next).toHaveAttribute("href", "/test?page=2");

    const pages = container.querySelectorAll("[data-page]");
    expect(pages).toHaveLength(2);

    expect(pages[0]).toHaveTextContent("1");
    expect(pages[0]).not.toHaveAttribute("href");

    expect(pages[1]).toHaveTextContent("2");
    expect(pages[1]).toHaveAttribute("href", "/test?page=2")
  });

  test("shows two pages with current page at two", () => {
    vi.mocked(usePathname).mockReturnValue("/test");
    vi.mocked(useSearchParams).mockReturnValue(new ReadonlyURLSearchParams());

    const { container } = renderPageNavigator({ pageIndex: 2, pageSize: 10, total: 12 });

    const prev = screen.getByText("Prev");
    expect(prev).toBeInTheDocument();
    expect(prev).toHaveAttribute("href", "/test?page=1");

    const next = screen.getByText("Next");
    expect(next).toBeInTheDocument();
    expect(next).not.toHaveAttribute("href");

    const pages = container.querySelectorAll("[data-page]");
    expect(pages).toHaveLength(2);

    expect(pages[0]).toHaveTextContent("1");
    expect(pages[0]).toHaveAttribute("href", "/test?page=1");

    expect(pages[1]).toHaveTextContent("2");
    expect(pages[1]).not.toHaveAttribute("href")
  });

  test("show three pages with current page at two", () => {
    vi.mocked(usePathname).mockReturnValue("/test");
    vi.mocked(useSearchParams).mockReturnValue(new ReadonlyURLSearchParams());

    const { container } = renderPageNavigator({ pageIndex: 2, pageSize: 5, total: 12 });

    const prev = screen.getByText("Prev");
    expect(prev).toBeInTheDocument();
    expect(prev).toHaveAttribute("href", "/test?page=1");

    const next = screen.getByText("Next");
    expect(next).toBeInTheDocument();
    expect(next).toHaveAttribute("href", "/test?page=3");

    const pages = container.querySelectorAll("[data-page]");
    expect(pages).toHaveLength(3);

    expect(pages[0]).toHaveTextContent("1");
    expect(pages[0]).toHaveAttribute("href", "/test?page=1");

    expect(pages[1]).toHaveTextContent("2");
    expect(pages[1]).not.toHaveAttribute("href")

    expect(pages[2]).toHaveTextContent("3");
    expect(pages[2]).toHaveAttribute("href", "/test?page=3")
  });

  test("show two pages preserving other query string", () => {
    vi.mocked(usePathname).mockReturnValue("/test");
    vi.mocked(useSearchParams).mockReturnValue(new ReadonlyURLSearchParams({
      foo: "bar"
    }));

    renderPageNavigator({ pageIndex: 2, pageSize: 10, total: 12 });

    const prev = screen.getByText("Prev");
    expect(prev).toBeInTheDocument();
    expect(prev).toHaveAttribute("href", "/test?foo=bar&page=1");
  });
});
