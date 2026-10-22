import { describe, expect, test } from "vitest";
import { NextIntlClientProvider } from "next-intl";
import React from "react";
import { render, screen } from "@testing-library/react";
import { Dialog } from "./dialog";

function renderDialog(title: React.ReactNode, children: React.ReactNode, onClose: (() => void) | undefined = undefined) {
  render(
    <NextIntlClientProvider locale="en" messages={{}}>
      <Dialog id="test-dialog" title={title} onClose={onClose}>
        {children}
      </Dialog>
    </NextIntlClientProvider>
  );
}

describe("Dialog (unit)", () => {
  test("render default dialog modal", () => {
    renderDialog("My dialog", "Here some content");

    expect(screen.getByRole("dialog", { hidden: true })).toHaveAttribute("id", "test-dialog");
    expect(screen.getByText("My dialog")).toBeInTheDocument();
    expect(screen.getByText("Here some content")).toBeInTheDocument();
  });0
});
