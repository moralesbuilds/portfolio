import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SubmitButton } from "./submit_button";
import userEvent from "@testing-library/user-event";

describe("SubmitButton (unit)", () => {
  test("show the button as not submitting", async () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    render(
      <form onSubmit={handleSubmit}>
        <SubmitButton label="Label" />
      </form>
    );

    const button = screen.getByText("Label");
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(handleSubmit).toHaveBeenCalledOnce();
  });

  test("show the button as submitting", async () => {
    const handleSubmit = vi.fn((e) => e.preventDefault());
    const { container } = render(
      <form onSubmit={handleSubmit}>
        <SubmitButton label="Label" isSubmitting />
      </form>
    );

    expect(screen.queryByText("Label")).not.toBeInTheDocument();
    await userEvent.click(container.querySelector("button")!);
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});