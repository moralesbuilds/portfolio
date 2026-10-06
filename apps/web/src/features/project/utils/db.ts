import { cache } from "react";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { fetchProjectDetails as _fetchProjectDetails, getDb, type Locale } from "@moralesbuilds/contents-db";

export const fetchProjectDetails = cache(async (locale: Locale, slug: string) => {
  const { env } = await getCloudflareContext({ async: true });
  return _fetchProjectDetails(getDb(env.CONTENTS_DB), { locale, slug });
});