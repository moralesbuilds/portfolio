import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyPostList } from "./empty_post_list";

describe("EmptyPostList (unit)", () => {
  test("show title and description", () => {
    render(
      <EmptyPostList title="This is empty" description="My blog list is empty" />
    );

    expect(screen.getByText("This is empty")).toBeInTheDocument();
    expect(screen.getByText("My blog list is empty")).toBeInTheDocument();
  });
});
