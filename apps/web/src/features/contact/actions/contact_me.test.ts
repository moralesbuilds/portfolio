import { describe, expect, test, vi } from "vitest";
import { contactMeAction } from "./contact_me";
import { createLead, createRateLimitStore, type Locale } from "@moralesbuilds/contents-db";
import { headers } from "next/headers";
import { type ContactMeActionState } from "../schemas";
import { createInMemoryRateLimitStore } from "../../../../tests/rate_limit_store";
import { verifyTurnstile } from "@/lib/turnstile";
import { getLocale } from "next-intl/server";

const { mockGetCloudflareContext, mockSend } = vi.hoisted(() => {
  const mockSend = vi.fn();
  const mockGetCloudflareContext = vi.fn(() => ({
    env: {
      EMAIL: {
        send: mockSend
      },
      CONTENTS_DB: {},
      APP_EMAIL: "app@test.com",
      CONTACT_EMAIL: "my_inbox@test.com",
      MIN_FORM_FILL_MS: "3000",
      RATE_LIMIT_MAX_ATTEMPTS: "3",
      RATE_LIMIT_WINDOW_MS: "60_000",
      CONTACT_FORM_SALT: "salt",
      TURNSTILE_SECRET: "my_tt_secret"
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
    createLead: vi.fn(),
    createRateLimitStore: vi.fn()
  };
});

vi.mock('next/headers', async () => {
  return { headers: vi.fn() };
});

vi.mock('@/lib/turnstile', async () => {
  return { verifyTurnstile: vi.fn() };
});

vi.mock('next-intl/server', async () => {
  return { getLocale: vi.fn() };
});

function expectLeadToBeCreatedAndNotificationSent(result: ContactMeActionState, ipAddress: string, locale: Locale) {
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
      locale,
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

function expectFalsifiedSuccess(result: ContactMeActionState) {
  expect(result.success).toBeTruthy();
  expect(createLead).not.toHaveBeenCalled();
  expect(mockSend).not.toHaveBeenCalled();
}

function expectFailedOperation(result: ContactMeActionState) {
  expect(result.success).toBeFalsy();
  expect(result.error).toEqual(expect.stringMatching(/\S/));
  expect(createLead).not.toHaveBeenCalled();
  expect(mockSend).not.toHaveBeenCalled();
}

function getTestFormData(params: { t?: string; message?: string; } | undefined = undefined): FormData {
  const formData = new FormData();
  formData.append("name", "Tester");
  formData.append("email", "tester@external.com");
  formData.append("message", params?.message ?? "I want to test your product");
  formData.append("t", params?.t ?? (Date.now() - 4000).toString());
  formData.append("turnstileToken", "my_tt_token");
  return formData;
}

describe("contactMeAction", () => {
  test("validates the input and return validation errors", async () => {
    const formData = new FormData();
    const tValue = (Date.now() - 4000).toString();
    formData.append("name", "");
    formData.append("email", "");
    formData.append("message", "");
    formData.append("t", tValue);

    const mockHeaders = new Headers();
    mockHeaders.append("cf-connecting-ip", "1.1.1.1");
    vi.mocked(headers).mockResolvedValue(mockHeaders);

    const result = await contactMeAction({ success: false }, formData);
    expect(result.success).toBeFalsy();
    expect(result.form).toStrictEqual({
      name: "",
      email: "",
      message: "",
      t: tValue,
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
    const formData = getTestFormData();
    vi.mocked(createRateLimitStore).mockReturnValue(createInMemoryRateLimitStore());
    vi.mocked(verifyTurnstile).mockResolvedValue(true);
    vi.mocked(getLocale).mockResolvedValue("en");

    const result = await contactMeAction({ success: false }, formData);
    expect(verifyTurnstile).toHaveBeenCalledWith("my_tt_token", "my_tt_secret", "1.1.1.1");
    expectLeadToBeCreatedAndNotificationSent(result, "1.1.1.1", "en");
  });

  test("saves valid form submission getting the ip address from x-forwarded-for header", async () => {
    const formData = getTestFormData();
    const mockHeaders = new Headers();
    mockHeaders.append("x-forwarded-for", "2.2.2.2");
    vi.mocked(headers).mockResolvedValue(mockHeaders);
    vi.mocked(createRateLimitStore).mockReturnValue(createInMemoryRateLimitStore())
    vi.mocked(verifyTurnstile).mockResolvedValue(true);
    vi.mocked(getLocale).mockResolvedValue("es")

    const result = await contactMeAction({ success: false }, formData);
    expect(verifyTurnstile).toHaveBeenCalledWith("my_tt_token", "my_tt_secret", "2.2.2.2");
    expectLeadToBeCreatedAndNotificationSent(result, "2.2.2.2", "es");
  });

  test("triggering the honeypot trap", async () => {
    const formData = getTestFormData();
    formData.append("website", "This is a trap");

    const result = await contactMeAction({ success: false }, formData);
    expectFalsifiedSuccess(result);
  });

  test("should not trigger the honeypot trap when website is empty string", async () => {
    const formData = getTestFormData();
    formData.append("website", "");
    vi.mocked(getLocale).mockResolvedValue("en");

    const result = await contactMeAction({ success: false }, formData);
    expectLeadToBeCreatedAndNotificationSent(result, "2.2.2.2", "en");
  });

  test("triggering the timetrap", async () => {
    const formData = getTestFormData({ t: (Date.now() - 1000).toString() });
    const result = await contactMeAction({ success: false }, formData);
    expectFalsifiedSuccess(result);
  });

  test("triggering the spam heuristics filter", async () => {
    const message = `
Check report: https://seo-boost-analytics.net/report
Book call: https://growth-cal-booking.org/meet
Unsubscribe: www.optout-digital-marketing.com/unsubscribe
    `;
    const formData = getTestFormData({ message });
    const result = await contactMeAction({ success: false }, formData);
    expectFalsifiedSuccess(result);
  });

  test("fails the operation if the call is rate limited", async () => {
    const formData = getTestFormData();
    vi.mocked(createRateLimitStore).mockReturnValue({
      record: async function (key: string, now: number): Promise<void> {
        // noop
      },
      countSince: function (key: string, since: number): Promise<number> {
        return Promise.resolve(5);
      },
      prune: async function (before: number): Promise<void> {
        // noop
      }
    });
    vi.mocked(verifyTurnstile).mockResolvedValue(true);

    const result = await contactMeAction({ success: false }, formData);
    expectFailedOperation(result);
  });

  test("fails the operation if turnstile fails the verification", async () => {
    const formData = getTestFormData();
    vi.mocked(createRateLimitStore).mockReturnValue(createInMemoryRateLimitStore());
    vi.mocked(verifyTurnstile).mockResolvedValue(false);

    const result = await contactMeAction({ success: false }, formData);
    expectFailedOperation(result);
    expect(verifyTurnstile).toHaveBeenCalledWith("my_tt_token", "my_tt_secret", "2.2.2.2");
  });

  test("fails the operation when unexpected database failure", async () => {
    const formData = getTestFormData();
    vi.mocked(createRateLimitStore).mockReturnValue(createInMemoryRateLimitStore());
    vi.mocked(verifyTurnstile).mockResolvedValue(true);
    vi.mocked(createLead).mockRejectedValue(new Error("database error"));

    const result = await contactMeAction({ success: false }, formData);
    expect(result.success).toBeFalsy();
    expect(result.error).toBe("unexpected_error");
    expect(createLead).toHaveBeenCalled();
    expect(mockSend).not.toHaveBeenCalled();
  });
});
