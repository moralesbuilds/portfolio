"use client";

import useSWR from "swr";
import { useTranslations } from "next-intl";
import { Dialog, Loading } from "@/components";
import { fetchWithStatusHandling, type HTTPError } from "@/lib/fetcher";
import { type ProjectMetricSummary, type MetricSample } from "@moralesbuilds/metrics-db";
import { formatUnit, unixTimestampToShortDate, unixTimestampToShortDateTime } from "@/lib/format";
import { Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { ActiveDotType } from "recharts/types/util/types";

type MetricChartDialogProps = {
  repositoryUrl?: string;
  projectMetric?: ProjectMetricSummary;
  title?: string;
  onClose: () => void;
};

function activeDotProps(repositoryUrl: string | undefined, projectMetric: ProjectMetricSummary | undefined): ActiveDotType {
  if (repositoryUrl && projectMetric?.tagType === 'commit_sha') {
    return {
      r: 5,
      cursor: 'pointer',
      // @ts-expect-error: Recharts pass dot's data props as 2º argument, not at event arg
      onClick: (_: unknown, dot: { payload: MetricSample }) => {
        window.open(`${repositoryUrl}/commit/${dot.payload.tag}`, "_blank", "noopener,noreferrer");
      },
    }
  } else {
    return {
      r: 5
    };
  }
}

export function MetricChartDialog({ repositoryUrl, projectMetric, title, onClose }: MetricChartDialogProps) {
  const t = useTranslations("project");
  const { data, error, isLoading, mutate } = useSWR<MetricSample[], HTTPError>(
    projectMetric?.id ? [`/api/metrics/${projectMetric.id}`] : null,
    fetchWithStatusHandling<MetricSample[]>,
    { shouldRetryOnError: false }
  );

  return (
    <Dialog id="metric-chart-dialog" onClose={onClose} title={title}>
      {isLoading && (
        <div className="flex justify-center align-center h-20">
          <Loading size="lg" />
        </div>
      )}

      {error && !isLoading && (
        <div className="flex flex-col items-center gap-4 w-full">
          <p className="text-red-500">
            {t("metric_error")}
          </p>
          <button className="w-50 px-4 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer" onClick={() => mutate()}>
            {t("metric_retry")}
          </button>
        </div>
      )}

      {(data && data.length === 0) && (
        <div className="flex flex-col items-center gap-4 w-full">
          <p>
            {t("empty_metric_data")}
          </p>
        </div>
      )}

      {(data && data.length > 0) && (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data} margin={{ top: 20 }} style={{ pointerEvents: 'auto' }}>
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={['dataMin', 'dataMax']}
              tickFormatter={unixTimestampToShortDate}
            />
            <YAxis
              dataKey="value"
              tickFormatter={(value) => formatUnit(value, projectMetric!.unit)}
            />
            <Tooltip
              labelFormatter={(label) => unixTimestampToShortDateTime(label as number)}
              formatter={(value) => [formatUnit(value as number, projectMetric!.unit), 'Value']}
            />
            <Line
              dataKey="value"
              type="monotone"
              stroke="#8884d8"
              activeDot={activeDotProps(repositoryUrl, projectMetric)}
            />
            {(projectMetric?.referenceValue ?? 0) !== 0 && <ReferenceLine
              y={projectMetric!.referenceValue!}
              stroke={projectMetric?.better === 'higher' ? 'green' : 'red'}
              strokeDasharray="3 3"
              ifOverflow="extendDomain"
            />}
          </LineChart>
        </ResponsiveContainer>
      )}
    </Dialog>
  );
}
