import type { MetricsDb } from "../../src";
import type { BetterUnit, MetricUnit, TagType } from "../../src/types";

export async function seedMetricDefinition(
  db: MetricsDb,
  overrides: {
    name: string;
    unit: MetricUnit;
    better: BetterUnit;
    referenceValue?: number;
    tagType: TagType;
    createdAt?: string;
  }
): Promise<number> {
  const result = await db
    .prepare(
      `INSERT INTO metric_definitions (name, unit, better, reference_value, tag_type, created_at) VALUES
      (?1, ?2, ?3, ?4, ?5, COALESCE(?6, strftime('%Y-%m-%dT%H:%M:%SZ', 'now')))
      RETURNING id`
    )
    .bind(
      overrides.name,
      overrides.unit,
      overrides.better,
      overrides.referenceValue ?? null,
      overrides.tagType,
      overrides.createdAt ?? null
    )
    .first<{ id: number }>();
  return result!.id;
}


export async function seedProjectMetric(
  db: MetricsDb,
  overrides: {
    projectName: string;
    metricDefinitionId: number;
    isPublic: boolean;
    pinned: boolean;
    sortOrder: number;
    createdAt?: string;
  }
): Promise<number> {
  const result = await db
    .prepare(
      `INSERT INTO project_metrics (project_name, metric_definition_id, is_public, pinned, sort_order, created_at) VALUES
      (?1, ?2, ?3, ?4, ?5, COALESCE(?6, strftime('%Y-%m-%dT%H:%M:%SZ', 'now')))
      RETURNING id`
    )
    .bind(
      overrides.projectName,
      overrides.metricDefinitionId,
      Number(overrides.isPublic),
      Number(overrides.pinned),
      overrides.sortOrder,
      overrides.createdAt ?? null
    )
    .first<{ id: number }>();
  return result!.id;
}

export async function seedMetricSample(
  db: MetricsDb,
  overrides: {
    projectMetricId: number;
    timestamp: number;
    value: number;
    tag?: string;
  }
) : Promise<void> {
  await db
    .prepare(
      `INSERT INTO metric_samples (project_metric_id, timestamp, value, tag) VALUES
      (?1, ?2, ?3, ?4)`
    )
    .bind(
      overrides.projectMetricId,
      overrides.timestamp,
      overrides.value,
      overrides.tag ?? null,
    )
    .run();
}
