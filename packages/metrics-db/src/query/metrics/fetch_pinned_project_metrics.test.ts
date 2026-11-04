import { describe, expect, test } from "vitest";
import { getDb } from "../../client";
import { env } from "cloudflare:workers";
import { seedMetricDefinition, seedMetricSample, seedProjectMetric } from "../../../test/seed/metrics";
import { fetchPinnedProjectMetrics } from "./fetch_pinned_project_metrics";

describe("fetchPinnedProjectMetrics", () => {
  test("returns public and pinned project metric summaries respecting limits", async () => {
    const db = getDb(env.METRICS_DB);
    const metricDef1 = await seedMetricDefinition(db, { name: "metric-1", unit: "bytes", better: "higher", tagType: "none" });
    const projectMetric1 = await seedProjectMetric(db, { projectName: "project-1", metricDefinitionId: metricDef1, isPublic: true, pinned: true, sortOrder: 3 });
    await seedMetricSample(db, { projectMetricId: projectMetric1, timestamp: 1, value: 100 });
    await seedMetricSample(db, { projectMetricId: projectMetric1, timestamp: 2, value: 90 });
    await seedMetricSample(db, { projectMetricId: projectMetric1, timestamp: 3, value: 95 });

    const metricDef2 = await seedMetricDefinition(db, { name: "metric-2", unit: "count", better: "lower", referenceValue: 200, tagType: "commit_sha" });
    const projectMetric2 = await seedProjectMetric(db, { projectName: "project-1", metricDefinitionId: metricDef2, isPublic: true, pinned: true, sortOrder: 1 });
    await seedMetricSample(db, { projectMetricId: projectMetric2, timestamp: 1, value: 45, tag: "sha1" });
    await seedMetricSample(db, { projectMetricId: projectMetric2, timestamp: 2, value: 46, tag: "sha2" });
    await seedMetricSample(db, { projectMetricId: projectMetric2, timestamp: 3, value: 47, tag: "sha3" });

    const metricDef3 = await seedMetricDefinition(db, { name: "metric-3", unit: "ms", better: "lower", tagType: "none" });
    const projectMetric3 = await seedProjectMetric(db, { projectName: "project-1", metricDefinitionId: metricDef3, isPublic: true, pinned: true, sortOrder: 2 });
    await seedMetricSample(db, { projectMetricId: projectMetric3, timestamp: 10, value: 63 });
    await seedMetricSample(db, { projectMetricId: projectMetric3, timestamp: 20, value: 52 });
    await seedMetricSample(db, { projectMetricId: projectMetric3, timestamp: 30, value: 78 });

    const summaries = await fetchPinnedProjectMetrics(db, { projectName: "project-1", limit: 2 });
    expect(summaries).toHaveLength(2);
    
    const metric1 = summaries[0];
    expect(metric1.id).toBe(projectMetric2);
    expect(metric1.name).toBe("metric-2");
    expect(metric1.referenceValue).toBe(200);
    expect(metric1.tag).toBe("sha3");
    expect(metric1.tagType).toBe("commit_sha");
    expect(metric1.timestamp).toBe(3);
    expect(metric1.unit).toBe("count");
    expect(metric1.value).toBe(47);

    const metric2 = summaries[1];
    expect(metric2.id).toBe(projectMetric3);
    expect(metric2.name).toBe("metric-3");
    expect(metric2.referenceValue).toBeNull();
    expect(metric2.tag).toBeNull();
    expect(metric2.tagType).toBe("none");
    expect(metric2.timestamp).toBe(30);
    expect(metric2.unit).toBe("ms");
    expect(metric2.value).toBe(78);
  });

  test("returns empty results when there is no public metric for project", async () => {
    const db = getDb(env.METRICS_DB);
    const metricDef1 = await seedMetricDefinition(db, { name: "metric-1", unit: "bytes", better: "higher", tagType: "none" });
    const projectMetric1 = await seedProjectMetric(db, { projectName: "project-1", metricDefinitionId: metricDef1, isPublic: false, pinned: true, sortOrder: 1 });
    await seedMetricSample(db, { projectMetricId: projectMetric1, timestamp: 1, value: 100 });
    await seedMetricSample(db, { projectMetricId: projectMetric1, timestamp: 2, value: 90 });

    const summaries = await fetchPinnedProjectMetrics(db, { projectName: "project-1", limit: 2 });
    expect(summaries).toHaveLength(0);
  });

  test("returns empty results when there is no pinned metric for project", async () => {
    const db = getDb(env.METRICS_DB);
    const metricDef1 = await seedMetricDefinition(db, { name: "metric-1", unit: "bytes", better: "higher", tagType: "none" });
    const projectMetric1 = await seedProjectMetric(db, { projectName: "project-1", metricDefinitionId: metricDef1, isPublic: true, pinned: false, sortOrder: 1 });
    await seedMetricSample(db, { projectMetricId: projectMetric1, timestamp: 1, value: 100 });

    const summaries = await fetchPinnedProjectMetrics(db, { projectName: "project-1", limit: 2 });
    expect(summaries).toHaveLength(0);
  });

  test("returns empty results when there is no metrics for the searched project", async () => {
    const db = getDb(env.METRICS_DB);
    const metricDef1 = await seedMetricDefinition(db, { name: "metric-1", unit: "bytes", better: "higher", tagType: "none" });
    const projectMetric1 = await seedProjectMetric(db, { projectName: "project-1", metricDefinitionId: metricDef1, isPublic: true, pinned: true, sortOrder: 1 });
    await seedMetricSample(db, { projectMetricId: projectMetric1, timestamp: 1, value: 100 });

    const summaries = await fetchPinnedProjectMetrics(db, { projectName: "alternative-project" });
    expect(summaries).toHaveLength(0);
  });

  test("returns summary row even when there is no metric sample yet", async () => {
    const db = getDb(env.METRICS_DB);
    const metricDef1 = await seedMetricDefinition(db, { name: "metric-1", unit: "bytes", better: "higher", tagType: "none" });
    const projectMetricId = await seedProjectMetric(db, { projectName: "project-1", metricDefinitionId: metricDef1, isPublic: true, pinned: true, sortOrder: 1 });

    const summaries = await fetchPinnedProjectMetrics(db, { projectName: "project-1" });
    expect(summaries).toHaveLength(1);

    const metric1 = summaries[0];
    expect(metric1.id).toBe(projectMetricId);
    expect(metric1.name).toBe("metric-1");
    expect(metric1.referenceValue).toBeNull();
    expect(metric1.tagType).toBe("none");
    expect(metric1.unit).toBe("bytes");
    expect(metric1.timestamp).toBeNull();
    expect(metric1.value).toBeNull();
    expect(metric1.tag).toBeNull();
  });
});
