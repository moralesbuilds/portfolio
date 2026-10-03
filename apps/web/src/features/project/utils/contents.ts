import { type Project } from "@moralesbuilds/contents-db";

export function getProjectSummaryFilename(details: Partial<Project>): string {
  return `projects/${details.locale ?? 'en'}/${details.slug}.md`;
}
