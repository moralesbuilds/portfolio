import type { MetricsDb } from "../../client";
import type { ProjectMetricSummary } from "../../types";

type FetchPinnedProjectMetricsParams = {
  projectName: string;
  limit?: number
};

export async function fetchPinnedProjectMetrics(db: MetricsDb, params: FetchPinnedProjectMetricsParams): Promise<ProjectMetricSummary[]> {
  const projectName = params.projectName || (() => { throw new Error("Project name is required"); })();
  const limit = params.limit ?? 3;

  const { results } = await db
    .prepare(
      `WITH pinned_metrics AS (
        SELECT pm.id, pm.metric_definition_id, pm.sort_order
        FROM project_metrics pm
        WHERE pm.project_name = ?1 AND pm.is_public = TRUE AND pm.pinned = TRUE
        ORDER BY pm.sort_order
        LIMIT ?2
      ),
      latest_samples AS (
        SELECT ms.project_metric_id, ms.timestamp, ms.value, ms.tag
        FROM pinned_metrics p
        INNER JOIN metric_samples ms ON ms.project_metric_id = p.id
          AND ms.timestamp = (SELECT MAX(timestamp) FROM metric_samples WHERE project_metric_id = p.id)
      )
      SELECT
        p.id,
        md.name,
        md.unit,
        md.better,
        md.reference_value AS referenceValue,
        md.tag_type AS tagType,
        ls.value,
        ls.timestamp,
        ls.tag
      FROM pinned_metrics p
      INNER JOIN metric_definitions md ON md.id = p.metric_definition_id
      LEFT JOIN latest_samples ls ON ls.project_metric_id = p.id
      ORDER BY p.sort_order`
    )
    .bind(projectName, limit)
    .all<ProjectMetricSummary>();
  return results;
}
