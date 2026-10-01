import { render, screen } from "@testing-library/react";
import { vi, describe, expect, test } from "vitest";
import { FillSlot, LayoutPortalProvider, LayoutSlot } from "./layout_portal";
import React from "react";
import { Breadcrumbs } from "./breadcrumbs";
import { NextIntlClientProvider } from "next-intl";
import { usePathname } from "@/i18n/navigation";

vi.mock('@/i18n/navigation', async (importActual) => {
  const actual = await importActual<typeof import('@/i18n/navigation')>();
  return {
    ...actual,
    usePathname: vi.fn()
  };
});

function renderLayoutPortal(ui: React.ReactNode) {
  return render(
    <NextIntlClientProvider locale="en" messages={{ root: { home: "Home" } }}>
      <LayoutPortalProvider>
        <div data-testid="header">
          <LayoutSlot name="header" />
        </div>

        <div data-testid="container">
          {ui}
        </div>
      </LayoutPortalProvider>
    </NextIntlClientProvider>
  );
}

describe("LayoutPortal (unit)", () => {
  test("render the slot content in the LayoutSlot place", () => {
    renderLayoutPortal(
      <>
        <FillSlot name="header">
          <span>Example text</span>
        </FillSlot>

        <div>Some content</div>
      </>
    );

    expect(screen.getByTestId("header")).toHaveTextContent("Example text");
    const container = screen.getByTestId("container");
    expect(container).toHaveTextContent("Some content");
    expect(container).not.toHaveTextContent("Example text");
  });

  test("renders nothing in the LayoutSlot when no FillSlot is passed", () => {
    renderLayoutPortal(
      <div>Some content</div>
    );

    expect(screen.getByTestId("header")).toHaveTextContent('');
    expect(screen.getByTestId("container")).toHaveTextContent("Some content");
  });

  test("renders nothing if there is no slot with the specific name", () => {
    renderLayoutPortal(
      <>
        <FillSlot name="title">
          <span>Example text</span>
        </FillSlot>

        <div>Some content</div>
      </>
    );

    expect(screen.getByTestId("header")).toHaveTextContent('');
    expect(screen.getByTestId("container")).toHaveTextContent("Some content");
  });

  test("share the title with the breadcrumbs", () => {
    vi.mocked(usePathname).mockReturnValue("/a-title")
    const { container } = renderLayoutPortal(
      <>
        <Breadcrumbs />
        <FillSlot name="header" title="A title">
          <h1>The title</h1>
        </FillSlot>
      </>
    );

    expect(container.querySelector("[aria-current='page']")).toHaveTextContent("A title");
    expect(screen.getByTestId("header")).toHaveTextContent("The title");
  });

  test("render multiple slots", () => {
    render(
      <LayoutPortalProvider>
        <div data-testid="header">
          <LayoutSlot name="header" />
        </div>

        <div data-testid="container">
          <FillSlot name="footer">
            <span>This is a footer</span>
          </FillSlot>

          <FillSlot name="header">
            <span>This is a header</span>
          </FillSlot>

          <span>This is a content</span>
        </div>

        <div data-testid="footer">
          <LayoutSlot name="footer" />
        </div>
      </LayoutPortalProvider>
    );

    expect(screen.getByTestId("header")).toHaveTextContent("This is a header");
    expect(screen.getByTestId("footer")).toHaveTextContent("This is a footer");

    const container = screen.getByTestId("container");
    expect(container).toHaveTextContent("This is a content");
    expect(container).not.toHaveTextContent("This is a header");
    expect(container).not.toHaveTextContent("This is footer");
  });
});
