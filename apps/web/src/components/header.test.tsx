import { NextIntlClientProvider } from "next-intl";
import { describe, expect, test } from "vitest";
import { Header } from "./header";
import { render, screen } from "@testing-library/react";

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
});
