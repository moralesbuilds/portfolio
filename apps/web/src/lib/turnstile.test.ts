import { afterEach, describe, expect, test, vi } from "vitest";
import { verifyTurnstile } from "./turnstile";
import { json, mockFetch } from "../../tests/mock_fetch";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("verifyTurnstile", () => {
  test("returns true when Cloudflare says success", async () => {
    mockFetch(() => json({ success: true }));
    expect(await verifyTurnstile("token", "secret", "1.1.1.1")).toBeTruthy();
  });

  test("returns false when Cloudflare says failure", async () => {
    mockFetch(() => json({ success: false }));
    expect(await verifyTurnstile("token", "secret", "1.1.1.1")).toBeFalsy();
  });

  test("returns false without calling Cloudflare when the token is empty", async () => {
    const fn = mockFetch(() => json({ success: true }));
    expect(await verifyTurnstile("", "secret", "1.1.1.1")).toBeFalsy();
    expect(fn).not.toHaveBeenCalled();
  });

  test("returns false on a non-2xx response", async () => {
    mockFetch(() => json({ success: true }, { status: 500 }));
    expect(await verifyTurnstile("token", "secret", "1.1.1.1")).toBeFalsy();    
  });

  test("fails closed on a network error", async () => {
    mockFetch(() => Promise.reject(new Error("network down!")));
    expect(await verifyTurnstile("token", "secret", "1.1.1.1")).toBeFalsy();    
  });

  test("sends secret, token and ip to Cloudflare", async () => {
    const fn = mockFetch(() => json({ success: true }));
    await verifyTurnstile("token", "secret", "1.1.1.1");

    const requestData = (fn.mock.calls[0] as unknown as [string, RequestInit])[1];
    const body = requestData.body as string;
    const content = JSON.parse(body);
    expect(content.secret).toBe("secret");
    expect(content.response).toBe("token");
    expect(content.remoteip).toBe("1.1.1.1");

    const headers = requestData.headers as Record<string, string>;
    expect(headers["Content-Type"]).toBe("application/json");
  });
});
