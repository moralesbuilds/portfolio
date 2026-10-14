import { describe, test, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import type { Project } from "@moralesbuilds/contents-db";
import { ProjectDetailsPanel } from "./project_details_panel";

const mocks = vi.hoisted(() => ({
  fakeDb: { __fake: "db" },
  fetchPinnedProjectMetrics: vi.fn(),
}));

vi.mock("next-intl/server", () => ({
  getTranslations: vi.fn(async (namespace: string) => (key: string) => `${namespace}.${key}`),
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: vi.fn(async () => ({ env: { METRICS_DB: {} } })),
}));

vi.mock("@moralesbuilds/metrics-db", () => ({
  getDb: vi.fn(() => mocks.fakeDb),
  fetchPinnedProjectMetrics: mocks.fetchPinnedProjectMetrics,
}));

const project = {
  name: "moralesbuilds",
  repositoryUrl: "https://github.com/lumoralz/moralesbuilds",
} as Project;

const projectNoRepo = {
  name: "moralesbuilds"
} as Project;

const metric = {
  id: "m1",
  name: "lighthouse_performance",
  unit: "%",
  value: 98,
  referenceValue: 90,
};

// --- Test ------------------------------------------------------------
describe("ProjectDetailsPanel", () => {
  beforeEach(() => {
    mocks.fetchPinnedProjectMetrics.mockReset();
  });

  test("shows the repository url and the metrics when the project has details", async () => {
    mocks.fetchPinnedProjectMetrics.mockResolvedValue([metric]);

    render(await ProjectDetailsPanel({ details: project }));

    expect(screen.getByRole("heading", { name: "project.details" })).toBeInTheDocument();
    expect(screen.getByText("project.repository")).toBeInTheDocument();
    expect(screen.getByText("project.metrics.lighthouse_performance")).toBeInTheDocument();
    expect(screen.queryByText("project.no_details")).not.toBeInTheDocument();

    expect(mocks.fetchPinnedProjectMetrics).toHaveBeenCalledWith(mocks.fakeDb, {
      projectName: "moralesbuilds",
    });
  });

  test("shows no details when there is no metrics nor repository url", async () => {
    mocks.fetchPinnedProjectMetrics.mockResolvedValue([]);

    render(await ProjectDetailsPanel({ details: projectNoRepo }));

    expect(screen.getByRole("heading", { name: "project.details" })).toBeInTheDocument();
    expect(screen.queryByText("project.repository")).not.toBeInTheDocument();
    expect(screen.queryByText("project.metrics.lighthouse_performance")).not.toBeInTheDocument();
    expect(screen.getByText("project.no_details")).toBeInTheDocument();
  });

  test("shows repository url field only", async () => {
    mocks.fetchPinnedProjectMetrics.mockResolvedValue([]);

    render(await ProjectDetailsPanel({ details: project }));

    expect(screen.getByRole("heading", { name: "project.details" })).toBeInTheDocument();
    expect(screen.getByText("project.repository")).toBeInTheDocument();
    expect(screen.queryByText("project.metrics.lighthouse_performance")).not.toBeInTheDocument();
    expect(screen.queryByText("project.no_details")).not.toBeInTheDocument();
  });

  test("shows metric field only", async () => {
    mocks.fetchPinnedProjectMetrics.mockResolvedValue([metric]);

    render(await ProjectDetailsPanel({ details: projectNoRepo }));

    expect(screen.getByRole("heading", { name: "project.details" })).toBeInTheDocument();
    expect(screen.queryByText("project.repository")).not.toBeInTheDocument();
    expect(screen.getByText("project.metrics.lighthouse_performance")).toBeInTheDocument();
    expect(screen.queryByText("project.no_details")).not.toBeInTheDocument();
  });
});