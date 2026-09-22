import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, ping } from "@moralesbuilds/contents-db";

export async function GET() {
  const { env } = getCloudflareContext();
  const db = getDb(env.CONTENTS_DB);
  const ok = await ping(db);
  return Response.json({ ok });
}
