import { type Project } from "@moralesbuilds/contents-db";
import { getTranslations } from "next-intl/server";
import { getDb, fetchPinnedProjectMetrics } from "@moralesbuilds/metrics-db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { UrlField } from "./url_field";
import { MetricField } from "./metric_field";

type ProjectDetailsPanelProps = {
  details: Project;
};

export async function ProjectDetailsPanel({ details }: ProjectDetailsPanelProps) {
  const t = await getTranslations("project");
  const m = await getTranslations("project.metrics");
  const { env } = await getCloudflareContext({ async: true });
  const metricSummaries = await fetchPinnedProjectMetrics(getDb(env.METRICS_DB), { projectName: details.name });
  const hasDetails = !!details.repositoryUrl || metricSummaries.length > 0;
  const noValueLabel = t("no_value");

  return (
    <aside className="lg:col-span-4 bg-white space-y-4 divide-y divide-slate-200 [&>:nth-child(n+2)]:pt-4">
      <div className="pb-4 mb-0">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
          {t("details")}
        </h2>
      </div>

      {!hasDetails && <div className="py-4 space-y-2 mb-0 w-100 flex items-center justify-center">
        <em>{t("no_details")}</em>
      </div>}

      {details.repositoryUrl && <UrlField isCode label={t("repository")} url={details.repositoryUrl} />}

      {metricSummaries.map((metric) => (
        <MetricField
          key={metric.id}
          label={m(metric.name)}
          unit={metric.unit}
          value={metric.value}
          referenceValue={metric.referenceValue}
          noValueLabel={noValueLabel}
        />
      ))}
    </aside>
  );
}
