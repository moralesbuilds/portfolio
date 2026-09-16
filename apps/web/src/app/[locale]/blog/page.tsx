import { PostList } from "@/features/blog";
import { fetchBlogPosts, getDb } from "@moralesbuilds/contents-db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getTranslations } from "next-intl/server";

export default async function BlogListPage() {
  const { env } = await getCloudflareContext({ async: true });
  const db = getDb(env.CONTENTS_DB);
  const items = await fetchBlogPosts(db);
  const t = await getTranslations("blog");

  return (
    <>
      <PostList
        items={items}
        readMoreLabel={t("read_more")}
        emptyTitle={t("empty_title")}
        emptyDescritpion={t("empty_description")}
      />
    </>
  );
}
