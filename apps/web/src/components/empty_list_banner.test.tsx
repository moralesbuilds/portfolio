import { describe, expect, test } from "vitest";
import { render, screen } from "@testing-library/react";
import { EmptyListBanner } from "./empty_list_banner";

describe("EmptyPostList (unit)", () => {
  test("show title and description", () => {
    render(
      <EmptyListBanner title="This is empty" description="My blog list is empty" />
    );

    expect(screen.getByText("This is empty")).toBeInTheDocument();
    expect(screen.getByText("My blog list is empty")).toBeInTheDocument();
  });
});
