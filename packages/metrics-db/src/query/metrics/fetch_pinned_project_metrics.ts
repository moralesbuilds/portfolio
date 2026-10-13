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
      `WITH ranked_samples AS (
        SELECT
          ms.project_metric_id,
          ms.timestamp,
          ms.value,
          ms.tag,
          ROW_NUMBER() OVER (PARTITION BY ms.project_metric_id ORDER BY ms.timestamp DESC) AS rn
        FROM metric_samples ms
      )
      SELECT
        md.id,
        md.name,
        md.unit,
        md.better,
        md.reference_value AS referenceValue,
        md.tag_type AS tagType,
        rs.value,
        rs.timestamp,
        rs.tag
      FROM metric_definitions md
      INNER JOIN project_metrics pm ON md.id = pm.metric_definition_id
      LEFT JOIN ranked_samples rs ON pm.id = rs.project_metric_id AND rs.rn = 1
      WHERE pm.project_name = ?1 AND pm.is_public = TRUE AND pm.pinned = TRUE
      ORDER BY pm.sort_order
      LIMIT ?2`
    )
    .bind(projectName, limit)
    .all<ProjectMetricSummary>();
  return results;
}
