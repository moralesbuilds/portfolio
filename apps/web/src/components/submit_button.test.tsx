import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { SubmitButton } from "./submit_button";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";

function renderSubmitButton(isSubmitting: boolean = false) {
  const handleSubmit = vi.fn((e) => e.preventDefault());
  const { container } = render(
    <NextIntlClientProvider locale="en" messages={{ root: { loading: "Loading" } }}>
      <form onSubmit={handleSubmit}>
        <SubmitButton label="Label" isSubmitting={isSubmitting} />
      </form>
    </NextIntlClientProvider>
  );
  return { handleSubmit, container };
}

describe("SubmitButton (unit)", () => {
  test("show the button as not submitting", async () => {
    const { handleSubmit } = renderSubmitButton();

    const button = screen.getByText("Label");
    expect(button).toBeInTheDocument();
    await userEvent.click(button);
    expect(handleSubmit).toHaveBeenCalledOnce();
  });

  test("show the button as submitting", async () => {
    const { handleSubmit, container } = renderSubmitButton(true);

    expect(screen.queryByText("Label")).not.toBeInTheDocument();
    await userEvent.click(container.querySelector("button")!);
    expect(handleSubmit).not.toHaveBeenCalled();
  });
});
