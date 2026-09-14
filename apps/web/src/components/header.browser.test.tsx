import { describe, expect, test } from "vitest";
import { page, userEvent } from "vitest/browser";
import { Header } from "./header";
import { render } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";

function renderHeader() {
  render(
    <NextIntlClientProvider locale="en" messages={{}}>
      <Header
        brandLabel="My brand"
        blogLabel="Blog"
        contactLabel="Contact"
        openMenuLabel=""
        githubLabel="My github"
        githubUrl="https://github.com/test/test"
      />
    </NextIntlClientProvider>
  );
};

describe("Header", () => {
  test("desktop mode shows all links", async () => {
    await page.viewport(1366, 768); // Desktop
    renderHeader();

    // Check what should and shouldn't be visible by default
    const brandLink = page.getByTestId("brand-link");
    await expect.element(brandLink).toBeVisible();

    const blogLink = page.getByTestId("blog-link");
    await expect.element(blogLink).toBeVisible();

    const contactLink = page.getByTestId("contact-link");
    await expect.element(contactLink).toBeVisible();

    const githubLink = page.getByTestId("github-link").first();
    await expect.element(githubLink).toBeVisible();

    const mobileBlogLink = page.getByTestId("mobile-blog-link");
    await expect.element(mobileBlogLink).not.toBeVisible();

    const mobileContactLink = page.getByTestId("mobile-contact-link");
    await expect.element(mobileContactLink).not.toBeVisible();

    const mobileButtons = page.getByTestId("mobile-buttons");
    const menu = mobileButtons.getByTestId("mobile-menu");
    await expect.element(menu).not.toBeVisible();
  });

  test("mobile mode starts closed and opens when the clicking the button", async () => {
    await page.viewport(375, 667); // iPhone SE
    renderHeader();

    // Check what should and shouldn't be visible by default
    const mobileButtons = page.getByTestId("mobile-buttons");

    const brandLink = page.getByTestId("brand-link");
    await expect.element(brandLink).toBeVisible();

    const blogLink = page.getByTestId("blog-link");
    await expect.element(blogLink).not.toBeVisible();

    const contactLink = page.getByTestId("contact-link");
    await expect.element(contactLink).not.toBeVisible();

    const githubLink = mobileButtons.getByTestId("github-link");
    await expect.element(githubLink).toBeVisible();

    const mobileBlogLink = page.getByTestId("mobile-blog-link");
    await expect.element(mobileBlogLink).not.toBeVisible();

    const mobileContactLink = page.getByTestId("mobile-contact-link");
    await expect.element(mobileContactLink).not.toBeVisible();

    // Act: Click the mobile menu button
    const menu = mobileButtons.getByTestId("mobile-menu");
    await expect.element(menu).toBeVisible();
    await userEvent.click(menu);

    await expect.element(mobileBlogLink).toBeVisible();
    await expect.element(mobileContactLink).toBeVisible();
  });
});
