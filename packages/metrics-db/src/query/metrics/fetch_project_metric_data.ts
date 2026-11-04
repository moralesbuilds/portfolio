import { MetricsDb } from "../../client";
import { MetricSample } from "../../types";

type fetchProjectMetricDataParams = {
  projectMetricId: number;
};

export async function fetchProjectMetricData(db: MetricsDb, params: fetchProjectMetricDataParams): Promise<MetricSample[]> {
  const projectMetricId = params.projectMetricId || (() => { throw new Error("Project metric ID is required")})();
  
  const { results } = await db
    .prepare(
      `SELECT ms.timestamp, ms.value, ms.tag
      FROM metric_samples ms
      INNER JOIN project_metrics pm ON ms.project_metric_id = pm.id
      WHERE pm.is_public = TRUE AND ms.project_metric_id = ?1
      ORDER BY ms.timestamp`
    )
    .bind(projectMetricId)
    .all<MetricSample>();

  return results;
}
