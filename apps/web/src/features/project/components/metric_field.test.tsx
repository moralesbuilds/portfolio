import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MetricField } from "./metric_field";
import userEvent from "@testing-library/user-event";
import { type ProjectMetricSummary } from "@moralesbuilds/metrics-db";

function expectChartButtonToBeInTheDocument() {
  const chartButton = screen.getByTestId("chart-button");
  expect(chartButton).toBeInTheDocument();
  expect(chartButton).toBeEnabled();
  expect(screen.getByTestId("line-chart-icon")).toBeInTheDocument();
}

function expectChartButtonNotToBeInTheDocument() {
  expect(screen.queryByTestId("chart-button")).not.toBeInTheDocument();
  expect(screen.queryByTestId("line-chart-icon")).not.toBeInTheDocument();
}

describe("MetricField (unit)", () => {
  test("render metric unit without reference value", () => {
    render(
      <MetricField
        metric={{
          id: 1,
          unit: "count",
          value: 120,
        } as ProjectMetricSummary}
        label="Example"
        noValueLabel="Missing value"
        onChartButtonClicked={() => { }}
      />
    );

    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.queryByText("Missing value")).not.toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expectChartButtonToBeInTheDocument();
  });

  test("render metric unit with no value and no reference value", () => {
    render(
      <MetricField
        metric={{
          id: 1,
          unit: "count"
        } as ProjectMetricSummary}
        label="Example"
        noValueLabel="Missing value"
        onChartButtonClicked={() => { }}
      />
    );

    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("Missing value")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expectChartButtonNotToBeInTheDocument();
  });

  test("render metric unit with value and reference value", () => {
    render(
      <MetricField
        metric={{
          id: 1,
          unit: "percent",
          value: 0.5,
          referenceValue: 1
        } as ProjectMetricSummary}
        label="Example"
        noValueLabel="Missing value"
        onChartButtonClicked={() => { }}
      />
    );

    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByTestId("progress-level")).toHaveStyle({
      width: '50.0%'
    });
    expect(screen.getByText("50%")).toBeInTheDocument();
    expect(screen.getByText("/ 100%")).toBeInTheDocument();
    expectChartButtonToBeInTheDocument();
  });

  test("render metric unit without value and with reference value", () => {
    render(
      <MetricField
        metric={{
          id: 1,
          unit: "count",
          referenceValue: 1000
        } as ProjectMetricSummary}
        label="Example"
        noValueLabel="Missing value"
        onChartButtonClicked={() => { }}
      />
    );

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

    render(
      <MetricField
        metric={metric}
        label="Example"
        noValueLabel="Missing value"
        onChartButtonClicked={fn}
      />
    );

    await userEvent.click(screen.getByTestId("chart-button"));

    expect(fn).toHaveBeenNthCalledWith(1, metric, "Example");
  });
});
