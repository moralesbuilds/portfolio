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

    const image = screen.getByAltText("This is an example");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/images/example.png");
  });
});
