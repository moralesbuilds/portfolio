import { type Project } from "@moralesbuilds/contents-db";
import { getTranslations } from "next-intl/server";
import { getDb, fetchPinnedProjectMetrics } from "@moralesbuilds/metrics-db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { UrlField } from "./url_field";
import { MetricFieldset } from "./metric_fieldset";

type ProjectDetailsPanelProps = {
  details: Project;
};

export async function ProjectDetailsPanel({ details }: ProjectDetailsPanelProps) {
  const t = await getTranslations("project");
  const { env } = await getCloudflareContext({ async: true });
  const metricSummaries = await fetchPinnedProjectMetrics(getDb(env.METRICS_DB), { projectName: details.name });
  const hasDetails = !!details.repositoryUrl || metricSummaries.length > 0;
  const noValueLabel = t("no_value");

  return (
    <aside className="bg-white space-y-4 divide-y divide-slate-200 [&>:nth-child(n+2)]:pt-4">
      <div className="pb-4 mb-0">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
          {t("details")}
        </h2>
      </div>

      {!hasDetails && <div className="py-4 space-y-2 mb-0 w-100 flex items-center justify-center">
        <em>{t("no_details")}</em>
      </div>}

      {details.repositoryUrl && <UrlField isCode label={t("repository")} url={details.repositoryUrl} />}

      {metricSummaries.length > 0 && <MetricFieldset repositoryUrl={details.repositoryUrl} summaries={metricSummaries} noValueLabel={noValueLabel} />}
    </aside>
  );
}
