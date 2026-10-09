import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, test } from "vitest";
import { ProjectCard } from "./project_card";

describe("ProjectCard (unit)", () => {
  test("renders a project card", () => {
    render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <ProjectCard
          slug="example"
          image="/images/example.png"
          title="This is an example"
          summary="What the project does"
          tags={["A", "B", "C"]}
          viewDetailsLabel="View details"
          publishedAt="2026-09-17T23:10:32Z"
        />
      </NextIntlClientProvider>
    );

    const link = screen.getByText(/View details/i);
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/project/example");

    expect(screen.getByText("This is an example")).toBeInTheDocument();
    expect(screen.getByText("What the project does")).toBeInTheDocument();
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("C")).toBeInTheDocument();
    expect(screen.getByText("Sep 17, 2026")).toBeInTheDocument();

    const image = screen.getByAltText("This is an example");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/images/example.png");
  });

  test("renders with featured badge", () => {
    render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <ProjectCard
          slug="example"
          image="/images/example.png"
          title="This is an example"
          summary="What the project does"
          tags={["A", "B", "C"]}
          viewDetailsLabel="View details"
          isFeatured
          featuredLabel="This is featured"
        />
      </NextIntlClientProvider>
    );

    expect(screen.getByText("This is featured")).toBeInTheDocument();
  });

  test("renders without featured badge", () => {
    render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <ProjectCard
          slug="example"
          image="/images/example.png"
          title="This is an example"
          summary="What the project does"
          tags={["A", "B", "C"]}
          viewDetailsLabel="View details"
          isFeatured={false}
          featuredLabel="This is featured"
        />
      </NextIntlClientProvider>
    );

    expect(screen.queryByText("This is featured")).not.toBeInTheDocument();
  });
});
