import { render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { MetricField } from "./metric_field";
import userEvent from "@testing-library/user-event";

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
      <MetricField id={1} label="Example" unit="count" value={120} noValueLabel="Missing value" onChartButtonClicked={() => {}} />
    );

    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
    expect(screen.queryByText("Missing value")).not.toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expectChartButtonToBeInTheDocument();
  });

  test("render metric unit with no value and no reference value", () => {
    render(
      <MetricField id={1} label="Example" unit="count" noValueLabel="Missing value" onChartButtonClicked={() => {}} />
    );

    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("Missing value")).toBeInTheDocument();
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
    expectChartButtonNotToBeInTheDocument();
  });

  test("render metric unit with value and reference value", () => {
    render(
      <MetricField id={1} label="Example" unit="percent" value={0.5} referenceValue={1} onChartButtonClicked={() => {}} />
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
      <MetricField id={1} label="Example" unit="count" referenceValue={1000} onChartButtonClicked={() => {}} />
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

  test("onChartButtonClicked callback called when the visualize chart button is pressed", async () =>{
    const fn = vi.fn();
    render(
      <MetricField id={1} label="Example" unit="count" referenceValue={1000} onChartButtonClicked={fn} />
    );

    await userEvent.click(screen.getByTestId("chart-button"));

    expect(fn).toHaveBeenNthCalledWith(1, "Example");    
  });
});