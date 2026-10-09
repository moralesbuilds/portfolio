import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, test } from "vitest";
import { ProjectList } from "./project_list";

describe("ProjectList (unit)", () => {
  test("renders with one project card", () => {
    render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <ProjectList
          items={[
            {
              id: 1,
              slug: "project",
              title: "A project",
              summary: "The brief",
              tags: ["Testing"],
              publishedAt: "",
              isFeatured: false
            }
          ]}
          viewDetailsLabel="View details"
          emptyTitle="This is empty"
          emptyDescription="Wait for more later"
        />
      </NextIntlClientProvider>
    );

    expect(screen.queryAllByText(/View details/i)).toHaveLength(1);
    expect(screen.queryByText("This is empty")).not.toBeInTheDocument();
    expect(screen.queryByText("Wait for more later")).not.toBeInTheDocument();
  });

  test("renders empty message when there are no items", () => {
    render(
      <ProjectList
        items={[]}
        viewDetailsLabel="View details"
        emptyTitle="This is empty"
        emptyDescription="Wait for more later"
      />
    );

    expect(screen.queryAllByText(/View details/i)).toHaveLength(0);
    expect(screen.getByText("This is empty")).toBeInTheDocument();
    expect(screen.getByText("Wait for more later")).toBeInTheDocument();
  });
});