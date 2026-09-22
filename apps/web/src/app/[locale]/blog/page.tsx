import { Breadcrumbs, PageNavigation } from "@/components";
import { PostList } from "@/features/blog";
import { queryToNumber, type SearchParams } from "@/utils/query";
import { fetchBlogPosts, getDb } from "@moralesbuilds/contents-db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getTranslations } from "next-intl/server";

type BlogListPageProps = {
  searchParams: SearchParams;
};

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const resolvedParams = await searchParams;
  const pageIndex = queryToNumber(resolvedParams.page, 1);

  const { env } = await getCloudflareContext({ async: true });
  const db = getDb(env.CONTENTS_DB);
  const page = await fetchBlogPosts(db, { pageIndex });
  const t = await getTranslations("blog");

  return (
    <div className="w-full py-8 space-y-8">
      {/* Header Section */}
      <header className="space-y-4">
        <Breadcrumbs />

        {/*Page tile & description */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            {t("title")}
          </h1>
          <p className="sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            {t("brief")}
          </p>
        </div>
      </header>

      <PostList
        items={page.items}
        readMoreLabel={t("read_more")}
        emptyTitle={t("empty_title")}
        emptyDescritpion={t("empty_description")}
      />

      <PageNavigation total={page.count} pageIndex={pageIndex} pageSize={page.size} />
    </div>
  );
}
