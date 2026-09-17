import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { LatestPostItem } from "./latest_post_item";
import { NextIntlClientProvider } from "next-intl";

describe("LatestBlogItem (unit)", () => {
  test("show latest blog item title and date", () => {
    render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <LatestPostItem title="My last post" publishedAt="2026-09-17" slug="very-important" />
      </NextIntlClientProvider>
    );

    const title = screen.getByText("My last post");
    expect(title).toBeInTheDocument();
    expect(title).toHaveAttribute("href", "/blog/very-important");

    expect(screen.getByText("Sep 17, 2026")).toBeInTheDocument();
  });
});
