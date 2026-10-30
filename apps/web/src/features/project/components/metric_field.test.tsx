import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MetricField } from "./metric_field";
import userEvent from "@testing-library/user-event";
import { type ProjectMetricSummary } from "@moralesbuilds/metrics-db";

function renderMetricField(metric: Partial<ProjectMetricSummary>, onChartButtonClicked: (() => void) | undefined = undefined) {
  render(
    <MetricField
      metric={metric as ProjectMetricSummary}
      label="Example"
      noValueLabel="Missing value"
      onChartButtonClicked={onChartButtonClicked ?? (() => { })}
      graphButtonLabel="View Metric"
    />
  );
}

function expectChartButtonToBeInTheDocument() {
  const chartButton = screen.getByTestId("chart-button");
  expect(chartButton).toBeInTheDocument();
  expect(chartButton).toBeEnabled();
  expect(chartButton).toHaveAttribute("aria-label", "View Metric");
  expect(screen.getByTestId("line-chart-icon")).toBeInTheDocument();
}

function expectChartButtonNotToBeInTheDocument() {
  expect(screen.queryByTestId("chart-button")).not.toBeInTheDocument();
  expect(screen.queryByTestId("line-chart-icon")).not.toBeInTheDocument();
}

describe("MetricField (unit)", () => {
  test("render metric unit without reference value", () => {
    renderMetricField({
      id: 1,
      unit: "count",
      value: 120,
    });

    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.queryByText("Missing value")).not.toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expectChartButtonToBeInTheDocument();
  });

  test("render metric unit with no value and no reference value", () => {
    renderMetricField({
      id: 1,
      unit: "count"
    });

    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("Missing value")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expectChartButtonNotToBeInTheDocument();
  });

  test("render metric unit with zero as value", () => {
    renderMetricField({
          id: 1,
          unit: "count",
          value: 0,
        });

    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.queryByText("Missing value")).not.toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    expectChartButtonToBeInTheDocument();
  });

  test("render metric unit with value and reference value", () => {
    renderMetricField({
          id: 1,
          unit: "percent",
          value: 0.5,
          referenceValue: 1
        });

    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByTestId("progress-level")).toHaveStyle({
      width: '50.0%'
    });
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("/ 100%")).toBeInTheDocument();
    expectChartButtonToBeInTheDocument();
  });

  test("render metric unit with zero as reference value", () => {
    renderMetricField({
          id: 1,
          unit: "score",
          value: 1,
          referenceValue: 0
        });

    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("/ 0")).toBeInTheDocument();
    expectChartButtonToBeInTheDocument();
  });

  test("render metric unit without value and with reference value", () => {
    renderMetricField({
          id: 1,
          unit: "count",
          referenceValue: 1000
        });

    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByTestId("progress-level")).toHaveStyle({
      width: '0%'
    });
    expect(screen.getByText("?")).toBeInTheDocument();
    expect(screen.getByText("/ 1,000")).toBeInTheDocument();
    expectChartButtonNotToBeInTheDocument();
  });

  test("onChartButtonClicked callback called when the visualize chart button is pressed", async () => {
    const fn = vi.fn();
    const metric = {
      id: 1,
      unit: "count",
      referenceValue: 100,
      value: 20
    } as ProjectMetricSummary;

    renderMetricField(metric, fn);

    await userEvent.click(screen.getByTestId("chart-button"));

    expect(fn).toHaveBeenNthCalledWith(1, metric, "Example");
  });
});
