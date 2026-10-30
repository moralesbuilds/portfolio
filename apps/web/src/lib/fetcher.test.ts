import { afterEach, describe, expect, test, vi } from "vitest";
import { fetchWithStatusHandling, HTTPError } from "./fetcher";
import { json, mockFetch } from "../../tests/mock_fetch";

afterEach(() => {
  vi.unstubAllGlobals();
});

async function captureError<E extends Error = HTTPError>(promise: Promise<unknown>): Promise<E> {
  return promise.then(
    () => { throw new Error("Expected the promise to reject"); },
    (error: E) => error,
  );
}

describe("HTTPError", () => {
  test("keeps the message, status and info", () => {
    const error = new HTTPError("Not found", 404, { message: "Missing metric" });

    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe("HTTPError");
    expect(error.message).toBe("Not found");
    expect(error.status).toBe(404);
    expect(error.info).toEqual({ message: "Missing metric" });
  });
});

describe("fetchWithStatusHandling", () => {
  test("requests the given url", async () => {
    const fn = mockFetch(() => json([]));
    await fetchWithStatusHandling("/api/metrics/1");

    expect(fn).toHaveBeenCalledExactlyOnceWith("/api/metrics/1");
  });

  test("returns the parsed body on a 2xx response", async () => {
    mockFetch(() => json([{ timestamp: 1, value: 10 }]));

    expect(await fetchWithStatusHandling("/api/metrics/1")).toEqual([{ timestamp: 1, value: 10 }]);
  });

  const statusCases: [number][] = [[400], [404], [429], [500], [503]];
  test.each(statusCases)("throws an HTTPError with the error body on a %i response", async (status) => {
    mockFetch(() => json({ message: "Something went wrong" }, { status }));

    const error = await captureError(fetchWithStatusHandling("/api/metrics/1"));

    expect(error).toBeInstanceOf(HTTPError);
    expect(error.message).toBe("An error ocurred while fetching the data.");
    expect(error.status).toBe(status);
    expect(error.info).toEqual({ message: "Something went wrong" });
  });

  test("throws an HTTPError with a fallback info when the error body is not JSON", async () => {
    mockFetch(() => Promise.resolve(new Response("<h1>Bad gateway</h1>", { status: 502 })));

    const error = await captureError(fetchWithStatusHandling("/api/metrics/1"));

    expect(error).toBeInstanceOf(HTTPError);
    expect(error.status).toBe(502);
    expect(error.info).toEqual({ message: "Failed to parse error response" });
  });

  test("throws an HTTPError with a fallback info when the error body is empty", async () => {
    mockFetch(() => Promise.resolve(new Response(null, { status: 500 })));

    const error = await captureError(fetchWithStatusHandling("/api/metrics/1"));

    expect(error).toBeInstanceOf(HTTPError);
    expect(error.status).toBe(500);
    expect(error.info).toEqual({ message: "Failed to parse error response" });
  });

  test("propagates network errors as they are", async () => {
    mockFetch(() => Promise.reject(new TypeError("network down!")));

    const error = await captureError<TypeError>(fetchWithStatusHandling("/api/metrics/1"));

    expect(error).not.toBeInstanceOf(HTTPError);
    expect(error).toBeInstanceOf(TypeError);
    expect(error.message).toBe("network down!");
  });

  test("rejects when a 2xx response body is not JSON", async () => {
    mockFetch(() => Promise.resolve(new Response("not json", { status: 200 })));

    await expect(fetchWithStatusHandling("/api/metrics/1")).rejects.toThrow(SyntaxError);
  });
});
