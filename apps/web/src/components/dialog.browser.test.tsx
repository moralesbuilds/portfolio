import { describe, expect, test, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Dialog } from "./dialog";
import { userEvent } from "vitest/browser";

function renderDialog(title: React.ReactNode, children: React.ReactNode, onClose: (() => void) | undefined = undefined) {
  render(
    <NextIntlClientProvider locale="en" messages={{}}>
      <Dialog id="test-dialog" title={title} onClose={onClose}>
        {children}
      </Dialog>
    </NextIntlClientProvider>
  );
}

describe("Dialog (browser)", () => {
  test("opening the dialog", async () => {
    render(
      <NextIntlClientProvider locale="en" messages={{}}>
        <button command="show-modal" commandfor="test-dialog">Click me</button>
        <Dialog id="test-dialog" title="Title">
          Content
        </Dialog>
      </NextIntlClientProvider>
    );

    expect(screen.getByRole("dialog")).not.toBeVisible();
    await userEvent.click(screen.getByText("Click me"));
    expect(screen.getByRole("dialog")).toBeVisible();
  });

  test("clicking the title close button", async () => {
    const fn = vi.fn();
    renderDialog("T", "C", fn);

    await userEvent.click(screen.getByTestId("button-close-dialog"));

    expect(fn).toHaveBeenCalled();
  });

  test("clicking the footer close button", async () => {
    const fn = vi.fn();
    renderDialog("T", "C", fn);

    await userEvent.click(screen.getByTestId("button-close-footer"));

    expect(fn).toHaveBeenCalled();
  });
});
