import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import PostItem from "./post_item";
import { NextIntlClientProvider } from "next-intl";

describe("PostItem (unit)", () => {
  test("show item information", () => {
    render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <PostItem
          publishedAt="2026-09-17"
          category="Testing"
          slug="testing"
          title="Unit testing the component"
          summary="Check if the component is working or not"
          readMoreLabel="Read more"
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText("2026-09-17")).toBeInTheDocument();
    expect(screen.getByText("Testing")).toBeInTheDocument();

    const link = "/blog/testing";
    const title = screen.getByText("Unit testing the component");
    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute("href", link);

    expect(screen.getByText("Check if the component is working or not")).toBeInTheDocument();

    const readMore = screen.getByText("Read more");
    expect(readMore).toBeInTheDocument();
    expect(readMore).toHaveAttribute("href", link);
  });
});
