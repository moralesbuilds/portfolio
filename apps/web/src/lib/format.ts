import { type MetricUnit } from "@moralesbuilds/metrics-db";

const METRIC_UNITS = ['kB', 'MB', 'GB', 'TB', 'PB']; // BASE 1000
const BINARY_UNITS = ['KiB', 'MiB', 'GiB', 'TiB', 'PiB'] // BASE 1024

export function formatBytes(bytes: number, si: boolean = false, dp: number = 1): string {
  const threshold = si ? 1000 : 1024;
  if (Math.abs(bytes) < threshold) {
    return bytes.toLocaleString() + ' B';
  }

  let u = -1;
  const r = 10 ** dp;
  const units = si ? METRIC_UNITS : BINARY_UNITS;
  do {
    bytes /= threshold;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= threshold && u < units.length - 1);

  return `${bytes.toLocaleString(undefined, {
    minimumFractionDigits: dp,
    maximumFractionDigits: dp
  })} ${units[u]}`;
}

export function formatUnit(value: number, unit: MetricUnit): string {
  switch (unit) {
    case "bytes":
      return formatBytes(value);
    case "ms":
      return `${value.toLocaleString()} ms`;
    case "count":
      return value.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      });
    case "percent":
      return value.toLocaleString(undefined, {
        style: 'percent',
        maximumFractionDigits: 2
      });
    case "score":
      return value.toLocaleString(undefined, {
        style: 'decimal'
      });
  }
}

export function toLocalDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString(undefined, { dateStyle: 'medium' });
}

