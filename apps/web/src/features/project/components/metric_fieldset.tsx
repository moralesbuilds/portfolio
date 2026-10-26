"use client";

import { type ProjectMetricSummary } from "@moralesbuilds/metrics-db";
import { useTranslations } from "next-intl";
import { MetricField } from "./metric_field";
import { useState } from "react";
import { MetricChartDialog } from "./metric_chart_dialog";

type MetricFieldsetProps = {
  repositoryUrl?: string;
  summaries: ProjectMetricSummary[];
  noValueLabel: string;
};

export function MetricFieldset({ repositoryUrl, summaries, noValueLabel }: MetricFieldsetProps) {
  const m = useTranslations("project.metrics");
  const [currentMetric, setCurrentMetric] = useState<ProjectMetricSummary | undefined>(undefined);
  const [currentMetricTitle, setCurrentMetricTitle] = useState<string | undefined>(undefined);

  const hasSummaries = (summaries?.length ?? 0) > 0;

  function setCurrentMetricState(metric: ProjectMetricSummary, title: string) {
    setCurrentMetric(metric);
    setCurrentMetricTitle(title);
  }

  function unsetCurrentMetricState() {
    setCurrentMetric(undefined);
    setCurrentMetricTitle(undefined);
  }

  return (
    <>
      {summaries.map((metric) => (
        <MetricField
          key={metric.id}
          metric={metric}
          label={m(metric.name)}
          noValueLabel={noValueLabel}
          onChartButtonClicked={setCurrentMetricState}
        />
      ))}

      {hasSummaries && <MetricChartDialog
        repositoryUrl={repositoryUrl}
        projectMetric={currentMetric}
        title={currentMetricTitle}
        onClose={unsetCurrentMetricState}
      />}
    </>
  )
}