import { PageNavigation, PageHeader } from "@/components";
import { PostList } from "@/features/blog";
import { queryToNumber, type SearchParams } from "@/lib/query";
import { pageMetadata } from "@/lib/seo";
import { fetchBlogPosts, getDb, type Locale } from "@moralesbuilds/contents-db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { type Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

type BlogListPageProps = {
  searchParams: SearchParams;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("blog");
  const locale = await getLocale() as Locale;

  return pageMetadata({ locale, hrefs: { en: "/blog" }, title: t("title"), description: t("brief") });
}

export default async function BlogListPage({ searchParams }: BlogListPageProps) {
  const t = await getTranslations("blog");
  const locale = await getLocale() as Locale;

  const resolvedParams = await searchParams;
  const pageIndex = queryToNumber(resolvedParams.page, 1);

  const { env } = await getCloudflareContext({ async: true });
  const db = getDb(env.CONTENTS_DB);
  const page = await fetchBlogPosts(db, { locale, pageIndex });

  return (
    <>
      {/* Page tile & description */}
      <PageHeader>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
          {t("title")}
        </h1>
        <p className="sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
          {t("brief")}
        </p>
      </PageHeader>

      <PostList
        items={page.items}
        readMoreLabel={t("read_more")}
        emptyTitle={t("empty_title")}
        emptyDescritpion={t("empty_description")}
      />

      <PageNavigation total={page.count} pageIndex={pageIndex} pageSize={page.size} />
    </>
  );
}
