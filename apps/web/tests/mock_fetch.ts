import { type Mock, vi } from "vitest";

export function mockFetch(impl: () => Promise<Response>): Mock<() => Promise<Response>> {
  const fn = vi.fn(impl);
  vi.stubGlobal("fetch", fn);
  return fn;
}

export const json = (body: unknown, init?: ResponseInit) =>
  Promise.resolve(new Response(JSON.stringify(body), init));
