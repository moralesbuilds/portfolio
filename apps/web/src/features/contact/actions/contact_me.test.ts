import { describe, expect, test, vi } from "vitest";
import { contactMeAction } from "./contact_me";
import { createLead } from "@moralesbuilds/contents-db";
import { headers } from "next/headers";
import { type ContactMeActionState } from "../schemas";

const { mockGetCloudflareContext, mockSend } = vi.hoisted(() => {
  const mockSend = vi.fn();
  const mockGetCloudflareContext = vi.fn(() => ({
    env: {
      EMAIL: {
        send: mockSend
      },
      CONTENTS_DB: {},
      APP_EMAIL: "app@test.com",
      CONTACT_EMAIL: "my_inbox@test.com"
    }
  }));
  return { mockSend, mockGetCloudflareContext };
});

vi.mock('@opennextjs/cloudflare', async () => ({
  getCloudflareContext: mockGetCloudflareContext
}));

vi.mock('@moralesbuilds/contents-db', async (importActual) => {
  const actual = await importActual<typeof import('@moralesbuilds/contents-db')>();
  return {
    ...actual,
    createLead: vi.fn()
  };
});

vi.mock('next/headers', async () => {
  return { headers: vi.fn() };
});

function expectLeadToBeCreatedAndNotificationSent(result: ContactMeActionState, ipAddress: string) {
  expect(result.success).toBeTruthy();
  expect(result.form).toBeNullable();
  expect(result.errors).toBeNullable();

  // Expect the form submission is saved as lead
  expect(createLead).toHaveBeenCalledWith(
    expect.anything(),
    {
      name: "Tester",
      email: "tester@external.com",
      message: "I want to test your product",
      leadSource: "website",
      ipAddress,
    }
  );

  // Expect the email is sent
  expect(mockSend).toHaveBeenCalledWith(
    expect.objectContaining({
      from: "app@test.com",
      to: "my_inbox@test.com",
      subject: expect.stringMatching(/\S/),
      html: expect.stringMatching(/\S/),
    })
  );
}

describe("contactMeAction", () => {
  test("validates the input and return validation errors", async () => {
    const formData = new FormData();
    formData.append("name", "");
    formData.append("email", "");
    formData.append("message", "");

    const mockHeaders = new Headers();
    mockHeaders.append("cf-connecting-ip", "1.1.1.1");
    vi.mocked(headers).mockResolvedValue(mockHeaders);

    const result = await contactMeAction({ success: false }, formData);
    expect(result.success).toBeFalsy();
    expect(result.form).toStrictEqual({
      name: "",
      email: "",
      message: ""
    });

    expect(result.errors?.name).toEqual(
      expect.arrayContaining([expect.stringMatching(/\S/)])
    );
    expect(result.errors?.email).toEqual(
      expect.arrayContaining([expect.stringMatching(/\S/)])
    );
    expect(result.errors?.message).toEqual(
      expect.arrayContaining([expect.stringMatching(/\S/)])
    );
  });

  test("saves valid form submission, save to database and send notificaiton", async () => {
    const formData = new FormData();
    formData.append("name", "Tester");
    formData.append("email", "tester@external.com");
    formData.append("message", "I want to test your product");

    const result = await contactMeAction({ success: false }, formData);
    expectLeadToBeCreatedAndNotificationSent(result, "1.1.1.1");
  });

  test("saves valid form submission getting the ip address from x-forwarded-for header", async () => {
    const formData = new FormData();
    formData.append("name", "Tester");
    formData.append("email", "tester@external.com");
    formData.append("message", "I want to test your product");

    const mockHeaders = new Headers();
    mockHeaders.append("x-forwarded-for", "2.2.2.2");
    vi.mocked(headers).mockResolvedValue(mockHeaders);

    const result = await contactMeAction({ success: false }, formData);
    expectLeadToBeCreatedAndNotificationSent(result, "2.2.2.2");
  });
});
