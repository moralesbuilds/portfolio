import { describe, expect, test, vi } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import React from "react";
import { render } from "@testing-library/react";
import { page, userEvent } from "vitest/browser";
import { Dialog } from "./dialog";

function renderDialog(title: React.ReactNode, children: React.ReactNode, onClose: (() => void) | undefined = undefined) {
  render(
    <NextIntlClientProvider locale="en" messages={{ root: { close: "Close", close_modal: "Close modal" } }}>
      <button command="show-modal" commandfor="test-dialog">Open dialog</button>
      <Dialog id="test-dialog" title={title} onClose={onClose}>
        {children}
      </Dialog>
    </NextIntlClientProvider>
  );
}

async function openDialog() {
  await userEvent.click(page.getByRole("button", { name: "Open dialog" }));
  await expect.element(page.getByRole("dialog")).toBeVisible();
}

describe("Dialog (browser)", () => {
  test("is closed until the opener button is clicked", async () => {
    renderDialog("Title", "Content");

    await expect.element(page.getByRole("dialog", { includeHidden: true })).not.toBeVisible();

    await openDialog();

    await expect.element(page.getByRole("dialog")).toHaveAttribute("open");
  });

  test("renders the title, content and close buttons", async () => {
    renderDialog("Metric title", <p>Metric content</p>);
    await openDialog();

    await expect.element(page.getByRole("heading", { name: "Metric title" })).toBeVisible();
    await expect.element(page.getByText("Metric content")).toBeVisible();
    await expect.element(page.getByRole("button", { name: "Close modal" })).toBeVisible();
    await expect.element(page.getByRole("button", { name: "Close", exact: true })).toBeVisible();
  });

  test("closes and calls onClose when clicking the title close button", async () => {
    const onClose = vi.fn();
    renderDialog("Title", "Content", onClose);
    await openDialog();

    await userEvent.click(page.getByRole("button", { name: "Close modal" }));

    await expect.element(page.getByRole("dialog", { includeHidden: true })).not.toBeVisible();
    expect(onClose).toHaveBeenCalledOnce();
  });

  test("closes and calls onClose when clicking the footer close button", async () => {
    const onClose = vi.fn();
    renderDialog("Title", "Content", onClose);
    await openDialog();

    await userEvent.click(page.getByRole("button", { name: "Close", exact: true }));

    await expect.element(page.getByRole("dialog", { includeHidden: true })).not.toBeVisible();
    expect(onClose).toHaveBeenCalledOnce();
  });

  test("closes and calls onClose when pressing Escape", async () => {
    const onClose = vi.fn();
    renderDialog("Title", "Content", onClose);
    await openDialog();

    await userEvent.keyboard("{Escape}");

    await expect.element(page.getByRole("dialog", { includeHidden: true })).not.toBeVisible();
    expect(onClose).toHaveBeenCalledOnce();
  });

  test("closes without onClose handler", async () => {
    renderDialog("Title", "Content");
    await openDialog();

    await userEvent.click(page.getByRole("button", { name: "Close modal" }));

    await expect.element(page.getByRole("dialog", { includeHidden: true })).not.toBeVisible();
  });

  test("can be reopened after being closed", async () => {
    const onClose = vi.fn();
    renderDialog("Title", "Content", onClose);

    await openDialog();
    await userEvent.click(page.getByRole("button", { name: "Close modal" }));
    await expect.element(page.getByRole("dialog", { includeHidden: true })).not.toBeVisible();

    await openDialog();
    await userEvent.click(page.getByRole("button", { name: "Close", exact: true }));

    await expect.element(page.getByRole("dialog", { includeHidden: true })).not.toBeVisible();
    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
