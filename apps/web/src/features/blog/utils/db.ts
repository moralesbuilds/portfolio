import { cache } from "react";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { fetchBlogPostDetails as _fetchBlogPostDetails, getDb, type Locale } from "@moralesbuilds/contents-db";

export const fetchBlogPostDetails = cache(async (locale: Locale, slug: string) => {
  const { env } = await getCloudflareContext({ async: true });
  return _fetchBlogPostDetails(getDb(env.CONTENTS_DB), { locale, slug });
});
