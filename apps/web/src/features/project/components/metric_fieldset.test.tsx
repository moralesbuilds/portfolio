import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NextIntlClientProvider } from "next-intl";
import { type ProjectMetricSummary } from "@moralesbuilds/metrics-db";
import { MetricFieldset } from "./metric_fieldset";

vi.mock("./metric_chart_dialog", () => ({
  MetricChartDialog: ({ repositoryUrl, projectMetric, title, onClose }: {
    repositoryUrl?: string;
    projectMetric?: ProjectMetricSummary;
    title?: string;
    onClose: () => void;
  }) => (
    <div data-testid="metric-chart-dialog">
      <span data-testid="dialog-repository-url">{repositoryUrl}</span>
      <span data-testid="dialog-metric-id">{projectMetric?.id}</span>
      <span data-testid="dialog-title">{title}</span>
      <button data-testid="dialog-close" onClick={onClose} />
    </div>
  ),
}));

const sizeMetric: ProjectMetricSummary = {
  id: 1,
  name: "worker.size.gzip",
  unit: "bytes",
  better: "lower",
  tagType: "commit_sha",
  value: 2048,
};

const countMetric: ProjectMetricSummary = {
  id: 2,
  name: "worker.size.uncompressed",
  unit: "count",
  better: "higher",
  tagType: "none",
  value: 120,
};

const emptyMetric: ProjectMetricSummary = {
  id: 3,
  name: "worker.size.uncompressed",
  unit: "count",
  better: "higher",
  tagType: "none",
};

function renderMetricFieldset(summaries: ProjectMetricSummary[], repositoryUrl: string | undefined = undefined) {
  render(
    <NextIntlClientProvider
      locale="en"
      messages={{ project: { metrics: { worker: { size: { gzip: "Compressed size", uncompressed: "Uncompressed size" } } } } }}
    >
      <MetricFieldset
        repositoryUrl={repositoryUrl}
        summaries={summaries}
        noValueLabel="Missing value"
        graphButtonLabel="View graph"
      />
    </NextIntlClientProvider>
  );
}

describe("MetricFieldset (unit)", () => {
  test("render a field for each metric with its translated label", () => {
    renderMetricFieldset([sizeMetric, countMetric]);

    expect(screen.getByText("Compressed size")).toBeInTheDocument();
    expect(screen.getByText("Uncompressed size")).toBeInTheDocument();
    expect(screen.getAllByTestId("chart-button")).toHaveLength(2);
  });

  test("render the no value label for metrics without value", () => {
    renderMetricFieldset([emptyMetric]);

    expect(screen.getByText("Uncompressed size")).toBeInTheDocument();
    expect(screen.getByText("Missing value")).toBeInTheDocument();
    expect(screen.queryByTestId("chart-button")).not.toBeInTheDocument();
  });

  test("render neither fields nor dialog when there are no metrics", () => {
    renderMetricFieldset([]);

    expect(screen.queryByTestId("chart-button")).not.toBeInTheDocument();
    expect(screen.queryByTestId("metric-chart-dialog")).not.toBeInTheDocument();
  });

  test("mount the dialog when there are metrics", () => {
    renderMetricFieldset([emptyMetric]);

    expect(screen.getByTestId("metric-chart-dialog")).toBeInTheDocument();
  });

  test("render the dialog without metric nor title initially", () => {
    renderMetricFieldset([sizeMetric], "https://github.com/moralesbuilds/portfolio");

    expect(screen.getByTestId("dialog-repository-url")).toHaveTextContent("https://github.com/moralesbuilds/portfolio");
    expect(screen.getByTestId("dialog-metric-id")).toBeEmptyDOMElement();
    expect(screen.getByTestId("dialog-title")).toBeEmptyDOMElement();
  });

  test("pass the clicked metric and its label to the dialog", async () => {
    const user = userEvent.setup();
    renderMetricFieldset([sizeMetric, countMetric]);

    const [, countChartButton] = screen.getAllByTestId("chart-button");
    await user.click(countChartButton);

    expect(screen.getByTestId("dialog-metric-id")).toHaveTextContent("2");
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("Uncompressed size");
  });

  test("switch the dialog metric when clicking another chart button", async () => {
    const user = userEvent.setup();
    renderMetricFieldset([sizeMetric, countMetric]);

    const [sizeChartButton, countChartButton] = screen.getAllByTestId("chart-button");
    await user.click(countChartButton);
    await user.click(sizeChartButton);

    expect(screen.getByTestId("dialog-metric-id")).toHaveTextContent("1");
    expect(screen.getByTestId("dialog-title")).toHaveTextContent("Compressed size");
  });

  test("clear the dialog metric and title when the dialog is closed", async () => {
    const user = userEvent.setup();
    renderMetricFieldset([sizeMetric]);

    await user.click(screen.getByTestId("chart-button"));
    await user.click(screen.getByTestId("dialog-close"));

    expect(screen.getByTestId("dialog-metric-id")).toBeEmptyDOMElement();
    expect(screen.getByTestId("dialog-title")).toBeEmptyDOMElement();
  });
});
