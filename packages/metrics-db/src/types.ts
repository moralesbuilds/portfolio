export type MetricUnit = "bytes" | "ms" | "score" | "count" | "percent";

export type BetterUnit = "lower" | "higher";

export type TagType = "none" | "commit_sha";

export type ProjectMetricSummary = {
  id: number;
  name: string;
  unit: MetricUnit;
  better: BetterUnit;
  referenceValue?: number;
  tagType: TagType;
  value: number;
  timestamp: number;
  tag?: string;
};
