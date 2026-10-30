import { beforeEach, describe, expect, test, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET } from "./route";

const mocks = vi.hoisted(() => ({
  fakeDb: { __fake: "db" },
  metricsDbBinding: { __fake: "binding" },
  getDb: vi.fn(),
  fetchProjectMetricData: vi.fn(),
  getCloudflareContext: vi.fn(),
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: mocks.getCloudflareContext,
}));

vi.mock("@moralesbuilds/metrics-db", () => ({
  getDb: mocks.getDb,
  fetchProjectMetricData: mocks.fetchProjectMetricData,
}));

function callRoute(projectMetricId: string) {
  return GET(new NextRequest(`http://localhost/api/metrics/${projectMetricId}`), {
    params: Promise.resolve({ projectMetricId }),
  });
}

describe("GET /api/metrics/[projectMetricId]", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mocks.getCloudflareContext.mockResolvedValue({ env: { METRICS_DB: mocks.metricsDbBinding } });
    mocks.getDb.mockReturnValue(mocks.fakeDb);
  });

  test("returns the metric samples as JSON", async () => {
    const samples = [
      { timestamp: 1, value: 10, tag: "abc123" },
      { timestamp: 2, value: 20, tag: "def456" },
    ];
    mocks.fetchProjectMetricData.mockResolvedValue(samples);

    const res = await callRoute("7");

    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toContain("application/json");
    expect(await res.json()).toEqual(samples);
  });

  test("queries the metrics database with the numeric id", async () => {
    mocks.fetchProjectMetricData.mockResolvedValue([]);

    await callRoute("7");

    expect(mocks.getCloudflareContext).toHaveBeenCalledWith({ async: true });
    expect(mocks.getDb).toHaveBeenCalledExactlyOnceWith(mocks.metricsDbBinding);
    expect(mocks.fetchProjectMetricData).toHaveBeenCalledExactlyOnceWith(mocks.fakeDb, { projectMetricId: 7 });
  });

  test("returns an empty list when the metric has no samples", async () => {
    mocks.fetchProjectMetricData.mockResolvedValue([]);

    const res = await callRoute("7");

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });

  const invalidIdCases: [string, string][] = [
    ["zero", "0"],
    ["a negative number", "-1"],
    ["a decimal number", "1.5"],
    ["a non numeric value", "abc"],
    ["an empty value", ""],
    ["infinity", "Infinity"],
  ] as const;
  test.each(invalidIdCases)("returns 400 without querying the database when the id is %s", async (_, projectMetricId) => {
    const res = await callRoute(projectMetricId);

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "Invalid metric id" });
    expect(mocks.getCloudflareContext).not.toHaveBeenCalled();
    expect(mocks.fetchProjectMetricData).not.toHaveBeenCalled();
  });

  test("propagates database errors", async () => {
    mocks.fetchProjectMetricData.mockRejectedValue(new Error("D1 is down"));

    await expect(callRoute("7")).rejects.toThrow("D1 is down");
  });
});
