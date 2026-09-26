import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { describe, expect, test, vi } from "vitest";
import { ContactForm } from "./contact_form";
import { contactMeAction } from "../actions/contact_me";
import userEvent from "@testing-library/user-event";

vi.mock("../actions/contact_me", async () => ({ contactMeAction: vi.fn() }));

const MESSAGES = {
  contact: {
    fields: {
      name: {
        label: "Name",
        placeholder: "Name"
      },
      email: {
        label: "Email",
        placeholder: "Email"
      },
      message: {
        label: "Message",
        placeholder: "Message"
      }
    },
    submit: "Submit",
    success: "Success!",
    success_message: "You did it"
  }
};

function renderContactForm() {
  render(
    <NextIntlClientProvider locale="en" messages={MESSAGES}>
      <ContactForm />
    </NextIntlClientProvider>
  );
}

describe("ContactForm (unit)", () => {
  test("render ContactForm in initial state", () => {
    renderContactForm();

    const nameInput = screen.getByLabelText("Name");
    expect(nameInput).toBeInTheDocument();
    expect(nameInput).toHaveValue('');
    expect(nameInput).toBeEnabled();
    expect(nameInput).toHaveAttribute("placeholder", "Name");
    expect(nameInput).not.toHaveAccessibleDescription();

    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toBeInTheDocument();
    expect(emailInput).toHaveValue('');
    expect(emailInput).toBeEnabled();
    expect(emailInput).toHaveAttribute("placeholder", "Email");
    expect(emailInput).not.toHaveAccessibleDescription();

    const messageInput = screen.getByLabelText("Message");
    expect(messageInput).toBeInTheDocument();
    expect(messageInput).toHaveValue('');
    expect(messageInput).toBeEnabled();
    expect(messageInput).toHaveAttribute("placeholder", "Message");
    expect(messageInput).not.toHaveAccessibleDescription();

    const websiteInput = screen.getByTestId("field-website");
    expect(websiteInput).toBeInTheDocument();
    expect(websiteInput).toHaveAttribute("aria-hidden", "true");

    const submitButton = screen.getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toBeEnabled();
  });

  test("render ContactForm with field validation errors", async () => {
    vi.mocked(contactMeAction).mockResolvedValue({
      success: false,
      errors: {
        name: ["Invalid name"],
        email: ["Invalid email"],
        message: ["Invalid message"]
      }
    });

    renderContactForm();

    const submitButton = screen.getByText("Submit");
    await userEvent.click(submitButton);

    const nameInput = screen.getByLabelText("Name");
    expect(nameInput).toHaveAccessibleDescription("Invalid name");

    const emailInput = screen.getByLabelText("Email");
    expect(emailInput).toHaveAccessibleDescription("Invalid email");

    const messageInput = screen.getByLabelText("Message");
    expect(messageInput).toHaveAccessibleDescription("Invalid message");
  });

  test("render ContactForm after successful submission", async () => {
    vi.mocked(contactMeAction).mockResolvedValue({
      success: true
    });

    renderContactForm();

    const submitButton = screen.getByText("Submit");
    await userEvent.click(submitButton);

    expect(screen.getByText("Success!"));
    expect(screen.getByText("You did it"));
  });
});