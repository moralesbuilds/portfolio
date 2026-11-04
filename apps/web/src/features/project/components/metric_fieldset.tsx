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
  graphButtonLabel: string;
};

export function MetricFieldset({ repositoryUrl, summaries, noValueLabel, graphButtonLabel }: MetricFieldsetProps) {
  const m = useTranslations("project.metrics");
  const [currentMetric, setCurrentMetric] = useState<ProjectMetricSummary | undefined>(undefined);
  const [currentMetricTitle, setCurrentMetricTitle] = useState<string | undefined>(undefined);

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
          label={m.has(metric.name) ? m(metric.name) : metric.name}
          noValueLabel={noValueLabel}
          graphButtonLabel={graphButtonLabel}
          onChartButtonClicked={setCurrentMetricState}
        />
      ))}

      <MetricChartDialog
        repositoryUrl={repositoryUrl}
        projectMetric={currentMetric}
        title={currentMetricTitle}
        onClose={unsetCurrentMetricState}
      />
    </>
  )
}