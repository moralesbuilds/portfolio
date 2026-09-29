import { afterEach, describe, expect, type Mock, test, vi } from "vitest";
import { mockFetch, json } from "../../tests/mock_fetch";
import { sendEmail } from "./resend";

afterEach(() => {
  vi.unstubAllGlobals();
});

const emailContent = {
  from: "test@tester.com",
  to: "test@testee.com",
  subject: "This is a test",
  html: "<h1>Hello world!</h1>"
};

describe("sendEmail", () => {
  test("returns true when Resend says success", async () => {
    mockFetch(() => json({ id: "abc" }));
    expect(await sendEmail("api_key", emailContent)).toBeTruthy();
  });

  test("returns false when Resend says failure", async () => {
    mockFetch(() => json({ id: "" }));
    expect(await sendEmail("api_key", emailContent)).toBeFalsy();
  });

  test("returns false without calling Resend when the token is empty", async () => {
    const fn = mockFetch(() => json({ id: "abc" }));
    expect(await sendEmail("", emailContent)).toBeFalsy();
    expect(fn).not.toHaveBeenCalled();
  });

  test("returns false on a non-2xx response", async () => {
    mockFetch(() => json({ id: "abc" }, { status: 403 }));
    expect(await sendEmail("api_key", emailContent)).toBeFalsy();
  });

  test("fails closed on a network error", async () => {
    mockFetch(() => Promise.reject(new Error("network down!")));
    expect(await sendEmail("api_key", emailContent)).toBeFalsy();
  });

  test("sends the email to Resend", async () => {
    const fn = mockFetch(() => json({ id: "abc" }));
    await sendEmail("api_key", emailContent);

    const requestData = (fn.mock.calls[0] as unknown as [string, RequestInit])[1];
    const body = requestData.body as string;
    const content = JSON.parse(body);
    expect(content.from).toBe(emailContent.from);
    expect(content.to).toBe(emailContent.to);
    expect(content.subject).toBe(emailContent.subject);
    expect(content.html).toBe(emailContent.html);

    const headers = requestData.headers as Record<string, string>;
    expect(headers["Authorization"]).toBe("Bearer api_key");
    expect(headers["Content-Type"]).toBe("application/json");
  });
});
