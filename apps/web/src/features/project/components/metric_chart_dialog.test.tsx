import { describe, expect, test, vi } from "vitest";
import useSWR from "swr";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MetricChartDialog } from "./metric_chart_dialog";
import { NextIntlClientProvider } from "next-intl";
import type { ComponentProps } from "react";
import { ProjectMetricSummary } from "@moralesbuilds/metrics-db";
import { HTTPError } from "@/lib/fetcher";

vi.mock("swr", () => ({
  default: vi.fn(),
}));

vi.mock("recharts", async (importOriginal) => {
  const recharts = await importOriginal<typeof import("recharts")>();
  return {
    ...recharts,
    ResponsiveContainer: (props: ComponentProps<typeof recharts.ResponsiveContainer>) => (
      <recharts.ResponsiveContainer {...props} initialDimension={{ width: 800, height: 400 }} />
    ),
  };
});

function renderMetricChartDialog(projectMetric: ProjectMetricSummary | undefined = undefined, repositoryUrl: string | undefined = undefined) {
  render(
    <NextIntlClientProvider locale="en" messages={{ root: { loading: "Loading" }, project: { metric_error: "A metric error", metric_not_found: "A missing metric", metric_retry: "Just retry" } }}>
      <MetricChartDialog onClose={() => { }} repositoryUrl={repositoryUrl} projectMetric={projectMetric ?? { id: 1, unit: "count", better: "higher", name: "test_count", tagType: "commit_sha" }} />
    </NextIntlClientProvider>
  );
}

describe("MetricChartDialog (unit)", () => {
  test("render loading state", () => {
    vi.mocked(useSWR).mockReturnValue({
      isLoading: true,
      mutate: vi.fn(),
      data: undefined,
      error: undefined,
      isValidating: false
    });

    renderMetricChartDialog();

    expect(screen.queryByRole("status", { name: "Loading", hidden: true })).toBeInTheDocument();
    expect(screen.queryByText("A metric error")).not.toBeInTheDocument();
    expect(screen.queryByText("Just retry")).not.toBeInTheDocument();
    expect(screen.queryByRole("application")).not.toBeInTheDocument();
  });

  test("render error state", () => {
    vi.mocked(useSWR).mockReturnValue({
      isLoading: false,
      mutate: vi.fn(),
      data: undefined,
      error: new HTTPError("Server error", 500),
      isValidating: false
    });

    renderMetricChartDialog();

    expect(screen.queryByRole("status", { name: "Loading", hidden: true })).not.toBeInTheDocument();
    expect(screen.queryByText("A metric error")).toBeInTheDocument();
    expect(screen.queryByText("A missing metric")).not.toBeInTheDocument();
    expect(screen.queryByText("Just retry")).toBeInTheDocument();
    expect(screen.queryByRole("application")).not.toBeInTheDocument();
  });

  test("retry fetching when clicking the retry button", () => {
    const mutate = vi.fn();
    vi.mocked(useSWR).mockReturnValue({
      isLoading: false,
      mutate,
      data: undefined,
      error: new HTTPError("Server error", 500),
      isValidating: false
    });

    renderMetricChartDialog();
    fireEvent.click(screen.getByText("Just retry"));

    expect(mutate).toHaveBeenCalledOnce();
  });

  test("render not found state without retry button", () => {
    vi.mocked(useSWR).mockReturnValue({
      isLoading: false,
      mutate: vi.fn(),
      data: undefined,
      error: new HTTPError("Not found", 404),
      isValidating: false
    });

    renderMetricChartDialog();

    expect(screen.queryByRole("status", { name: "Loading", hidden: true })).not.toBeInTheDocument();
    expect(screen.queryByText("A missing metric")).toBeInTheDocument();
    expect(screen.queryByText("A metric error")).not.toBeInTheDocument();
    expect(screen.queryByText("Just retry")).not.toBeInTheDocument();
    expect(screen.queryByRole("application")).not.toBeInTheDocument();
  });

  test("render line graph data", () => {
    vi.mocked(useSWR).mockReturnValue({
      isLoading: false,
      mutate: vi.fn(),
      data: [
        { timestamp: 1, value: 1 },
        { timestamp: 2, value: 2 }
      ],
      error: undefined,
      isValidating: false
    });

    renderMetricChartDialog();

    expect(screen.queryByRole("status", { name: "Loading", hidden: true })).not.toBeInTheDocument();
    expect(screen.queryByText("A metric error")).not.toBeInTheDocument();
    expect(screen.queryByText("Just retry")).not.toBeInTheDocument();
    expect(screen.queryByRole("application", { hidden: true })).toBeInTheDocument();
    expect(document.querySelector(".recharts-reference-line-line")).not.toBeInTheDocument();
  });

  test("render high reference line", () => {
    vi.mocked(useSWR).mockReturnValue({
      isLoading: false,
      mutate: vi.fn(),
      data: [
        { timestamp: 1, value: 1 },
      ],
      error: undefined,
      isValidating: false
    });

    renderMetricChartDialog({ 
      id: 1,
      unit: "count",
      better: "higher",
      name: "test_count",
      tagType: "commit_sha",
      referenceValue: 3
    });

    const referenceLine = document.querySelector(".recharts-reference-line-line");
    expect(referenceLine).toBeInTheDocument();
    expect(referenceLine).toHaveAttribute("stroke", "green");
  });

  test("render low reference line", () => {
    vi.mocked(useSWR).mockReturnValue({
      isLoading: false,
      mutate: vi.fn(),
      data: [
        { timestamp: 1, value: 1 },
      ],
      error: undefined,
      isValidating: false
    });

    renderMetricChartDialog({
      id: 1,
      unit: "count",
      better: "lower",
      name: "test_count",
      tagType: "commit_sha",
      referenceValue: 3
    });

    const referenceLine = document.querySelector(".recharts-reference-line-line");
    expect(referenceLine).toBeInTheDocument();
    expect(referenceLine).toHaveAttribute("stroke", "red");
  });

  test("open commit in a new tab when clicking a dot of a commit_sha metric", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    vi.mocked(useSWR).mockReturnValue({
      isLoading: false,
      mutate: vi.fn(),
      data: [
        { timestamp: 1, value: 1, tag: "abc123" },
      ],
      error: undefined,
      isValidating: false
    });

    renderMetricChartDialog({
      id: 1,
      unit: "count",
      better: "higher",
      name: "test_count",
      tagType: "commit_sha",
    }, "https://github.com/moralesbuilds/portfolio");

    fireEvent.mouseMove(document.querySelector(".recharts-wrapper")!, { clientX: 400, clientY: 200 });
    const activeDot = await waitFor(() => {
      const dot = document.querySelector(".recharts-active-dot circle");
      expect(dot).toBeInTheDocument();
      return dot!;
    });
    fireEvent.click(activeDot);

    expect(openSpy).toHaveBeenCalledExactlyOnceWith("https://github.com/moralesbuilds/portfolio/commit/abc123", "_blank", "noopener,noreferrer");
    openSpy.mockRestore();
  });

  test("do nothing when clicking a dot of a metric without tag type", async () => {
    const openSpy = vi.spyOn(window, "open").mockImplementation(() => null);
    vi.mocked(useSWR).mockReturnValue({
      isLoading: false,
      mutate: vi.fn(),
      data: [
        { timestamp: 1, value: 1, tag: "abc123" },
      ],
      error: undefined,
      isValidating: false
    });

    renderMetricChartDialog({
      id: 1,
      unit: "count",
      better: "higher",
      name: "test_count",
      tagType: "none",
    }, "https://github.com/moralesbuilds/portfolio");

    fireEvent.mouseMove(document.querySelector(".recharts-wrapper")!, { clientX: 400, clientY: 200 });
    const activeDot = await waitFor(() => {
      const dot = document.querySelector(".recharts-active-dot circle");
      expect(dot).toBeInTheDocument();
      return dot!;
    });
    fireEvent.click(activeDot);

    expect(openSpy).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });
});
