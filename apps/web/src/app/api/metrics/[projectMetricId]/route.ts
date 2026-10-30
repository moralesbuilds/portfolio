import { fetchProjectMetricData, getDb } from "@moralesbuilds/metrics-db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: Promise<{ projectMetricId: string }>;
};

export async function GET(_: NextRequest, { params }: Props) {
  const { projectMetricId } = await params;
  const id = Number(projectMetricId);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid metric id" }, { status: 400 });
  }

  const { env } = await getCloudflareContext({ async: true });
  const db = getDb(env.METRICS_DB);
  const data = await fetchProjectMetricData(db, {
    projectMetricId: id
  });
  return NextResponse.json(data);
}
