import { describe, expect, test } from "vitest";
import { getDb, MetricsDb } from "../../client";
import { env } from "cloudflare:workers";
import { seedMetricDefinition, seedMetricSample, seedProjectMetric } from "../../../test/seed/metrics";
import { fetchProjectMetricData } from "./fetch_project_metric_data";

async function seedMetricSamples(db: MetricsDb, isPublic: boolean): Promise<number> {
  const metricDefinitionId = await seedMetricDefinition(db, { name: "metric-1", unit: "bytes", better: "higher", tagType: "commit_sha" });
  const projectMetricId = await seedProjectMetric(db, { projectName: "project-1", metricDefinitionId, isPublic: isPublic, pinned: true, sortOrder: 3 });
  await seedMetricSample(db, { projectMetricId, timestamp: 1, value: 100, tag: "abc" });
  await seedMetricSample(db, { projectMetricId, timestamp: 3, value: 95, tag: "def" });
  await seedMetricSample(db, { projectMetricId, timestamp: 2, value: 90, tag: "xyz" });
  return projectMetricId;
}

describe("fetchProjectMetricData", () => {
  test("returns sample data from public public metric", async () => {
    const db = getDb(env.METRICS_DB);
    const projectMetricId = await seedMetricSamples(db, true);

    const data = await fetchProjectMetricData(db, { projectMetricId });
    expect(data).toEqual([
      { timestamp: 1, value: 100, tag: "abc" },
      { timestamp: 2, value: 90, tag: "xyz" },
      { timestamp: 3, value: 95, tag: "def" }
    ]);
  });

  test("returns empty data from private project metric", async () => {
    const db = getDb(env.METRICS_DB);
    const projectMetricId = await seedMetricSamples(db, false);

    const data = await fetchProjectMetricData(db, { projectMetricId });
    expect(data).toEqual([]);
  });
});
