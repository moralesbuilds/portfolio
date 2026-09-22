import { NextIntlClientProvider } from "next-intl";
import { describe, expect, test, vi } from "vitest";
import { Header } from "./header";
import { render, screen } from "@testing-library/react";
import { useSelectedLayoutSegments } from "next/navigation";

vi.mock('next/navigation', async (importActual) => {
  const actual = await importActual<typeof import('next/navigation')>();
  return {
    ...actual,
    useSelectedLayoutSegments: vi.fn()
  };
});

function renderHeader() {
  render(
    <NextIntlClientProvider locale="en" messages={{}}>
      <Header
        brandLabel="My brand"
        blogLabel="Blog"
        contactLabel="Contact"
        openMenuLabel="Open menu"
        githubLabel="My github"
        githubUrl="https://github.com/test/test"
      />
    </NextIntlClientProvider>
  );
};

describe("Header (unit)", () => {
  test("show the brand, the main links and github link", () => {
    renderHeader();

    const brand = screen.getByLabelText("My brand");
    expect(brand).toBeInTheDocument();

    const blog = screen.getAllByText("Blog");
    expect(blog[0]).toBeInTheDocument();

    const contact = screen.getAllByText("Contact");
    expect(contact[0]).toBeInTheDocument();

    const github = screen.getAllByTestId("github-link");
    expect(github[0]).toHaveAttribute("href", "https://github.com/test/test");
  });

  test("show no menu as selected", () => {
    vi.mocked(useSelectedLayoutSegments).mockReturnValue([]);
    
    renderHeader();

    expect(screen.getByTestId("blog-link")).toHaveAttribute("aria-selected", "false");
    expect(screen.getByTestId("mobile-blog-link")).toHaveAttribute("aria-selected", "false");

    expect(screen.getByTestId("contact-link")).toHaveAttribute("aria-selected", "false");
    expect(screen.getByTestId("mobile-contact-link")).toHaveAttribute("aria-selected", "false");
  });

  test("show the blog menu as selected", () => {
    vi.mocked(useSelectedLayoutSegments).mockReturnValue(["blog"]);
    
    renderHeader();

    expect(screen.getByTestId("blog-link")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("mobile-blog-link")).toHaveAttribute("aria-selected", "true");

    expect(screen.getByTestId("contact-link")).toHaveAttribute("aria-selected", "false");
    expect(screen.getByTestId("mobile-contact-link")).toHaveAttribute("aria-selected", "false");
  });

  test("show the blog menu as selected", () => {
    vi.mocked(useSelectedLayoutSegments).mockReturnValue(["contact"]);
    
    renderHeader();

    expect(screen.getByTestId("blog-link")).toHaveAttribute("aria-selected", "false");
    expect(screen.getByTestId("mobile-blog-link")).toHaveAttribute("aria-selected", "false");

    expect(screen.getByTestId("contact-link")).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("mobile-contact-link")).toHaveAttribute("aria-selected", "true");
  });
});
