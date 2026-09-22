import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { PostList } from "./post_list";
import { BlogPostItem } from "@moralesbuilds/contents-db";
import { NextIntlClientProvider } from "next-intl";

function MockPostList({ items }: { items?: BlogPostItem[] | null }) {
  return (
    <NextIntlClientProvider locale="en" messages={{}}>
      <PostList
        items={items}
        readMoreLabel="Read more"
        emptyTitle="This is empty"
        emptyDescritpion="No blog posts yet!"
      />
    </NextIntlClientProvider>
  );
}

describe("PostList (unit)", () => {
  const emptyCases: [string, BlogPostItem[] | null | undefined][] = [
    ["null", null],
    ["undefined", undefined],
    ["empty array", []]
  ];

  for (const [name, items] of emptyCases) {
    test(`display empty message when items is ${name}`, () => {
      render(<MockPostList items={items} />);

      expect(screen.getByText("This is empty")).toBeInTheDocument();
      expect(screen.getByText("No blog posts yet!")).toBeInTheDocument();
      expect(screen.queryByText("Read more")).not.toBeInTheDocument();
    });
  }

  test("display blog items", () => {
    render(<MockPostList items={[
      {
        id: 1,
        publishedAt: '2026-09-01T23:10:32Z',
        category: 'Testing',
        title: 'First blog post',
        summary: 'My first published blog post',
        slug: 'first-blog'
      },
      {
        id: 2,
        publishedAt: '2026-09-17T23:10:32Z',
        category: 'Testing',
        title: 'Second blog post',
        summary: 'My second published blog post',
        slug: 'second-blog'
      }
    ]} />);

    expect(screen.queryByText("This is empty")).not.toBeInTheDocument();
    expect(screen.queryByText("No blog posts yet!")).not.toBeInTheDocument();
    expect(screen.getAllByText("Testing")).toHaveLength(2);

    const readMoreLinks = screen.getAllByText("Read more");
    expect(readMoreLinks).toHaveLength(2);

    // First item
    expect(screen.getByText("Sep 1, 2026")).toBeInTheDocument();
    expect(screen.getByText("First blog post")).toBeInTheDocument();
    expect(screen.getByText("My first published blog post")).toBeInTheDocument();
    expect(readMoreLinks[0]).toHaveAttribute("href", "/blog/first-blog");

    // Second item
    expect(screen.getByText("Sep 17, 2026")).toBeInTheDocument();
    expect(screen.getByText("Second blog post")).toBeInTheDocument();
    expect(screen.getByText("My second published blog post")).toBeInTheDocument();
    expect(readMoreLinks[1]).toHaveAttribute("href", "/blog/second-blog");
  });
});
