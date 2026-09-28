import { afterEach, describe, expect, type Mock, test, vi } from "vitest";
import { verifyTurnstile } from "./turnstile";

afterEach(() => {
  vi.unstubAllGlobals();
});

function mockFetch(impl: () => Promise<Response>): Mock<() => Promise<Response>> {
  const fn = vi.fn(impl);
  vi.stubGlobal("fetch", fn);
  return fn;
}

const json = (body: unknown, init?: ResponseInit) =>
  Promise.resolve(new Response(JSON.stringify(body), init));

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

    const body = (fn.mock.calls[0] as unknown as [string, RequestInit])[1].body as string;
    const content = JSON.parse(body);
    expect(content.secret).toBe("secret");
    expect(content.response).toBe("token");
    expect(content.remoteip).toBe("1.1.1.1");
  });
});
