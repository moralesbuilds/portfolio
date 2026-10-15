import { LineChartIcon } from "@/components/icons";
import { formatUnit } from "@/lib/format";
import { type MetricUnit } from "@moralesbuilds/metrics-db";

type MetricFieldProps = {
  id: number;
  label: string;
  unit: MetricUnit;
  value?: number;
  referenceValue?: number;
  noValueLabel?: string;
  onChartButtonClicked: (id: number, label: string) => void;
};

type InternalMetricProps = {
  formattedValue: string;
  noValueLabel?: string;
};

function StandaloneMetricValue({ formattedValue, noValueLabel }: InternalMetricProps) {
  return (
    <div className="flex items-baseline justify-between">
      {formattedValue ? (
        <span className="font-bold text-slate-900">{formattedValue}</span>
      ) : (
        <em className="text-slate-600">{noValueLabel}</em>
      )}
    </div>
  );
}

type ProgressMetricProps = InternalMetricProps & {
  value?: number;
  unit: MetricUnit;
  referenceValue: number
};

function ProgressMetricValue({ value, formattedValue, referenceValue, unit }: ProgressMetricProps) {
  const formattedReference = formatUnit(referenceValue, unit)
  const progress = value ? `${((value / referenceValue) * 100)}%` : "0%";

  return (
    <div className="flex items-center gap-3">
      <div role="progressbar" className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
        <div data-testid="progress-level" className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: progress }} />
      </div>
      <span className="text-xs font-semibold text-slate-800">
        {formattedValue || "?"} <span className="text-slate-400 font-normal">/ {formattedReference}</span>
      </span>
    </div>
  );
}

export function MetricField({ id, label, unit, value, referenceValue, noValueLabel, onChartButtonClicked }: MetricFieldProps) {
  const formattedValue = value ? formatUnit(value, unit) : "";

  return (
    <div className="py-4 space-y-2 mb-0">
      <div className="flex items-center justify-between">
        <span className="block text-xs font-medium text-slate-500">
          {label}
        </span>

        {value && <button
          command="show-modal"
          commandfor="metric-chart-dialog"
          onClick={() => onChartButtonClicked(id, label)}
          aria-label="View metric graph"
          className="h-6 w-6 inline-flex items-center justify-center rounded-md text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition-colors cursor-pointer"
          data-testid="chart-button"
        >
          <LineChartIcon />
        </button>}
      </div>

      {referenceValue ? (
        <ProgressMetricValue value={value} unit={unit} formattedValue={formattedValue} referenceValue={referenceValue} />
      ) : (
        <StandaloneMetricValue formattedValue={formattedValue} noValueLabel={noValueLabel} />
      )}
    </div>
  );
}
