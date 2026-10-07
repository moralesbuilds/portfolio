import { PageNavigation, PageHeader } from "@/components";
import { ProjectList } from "@/features/project";
import { queryToNumber, type SearchParams } from "@/lib/query";
import { alternates } from "@/lib/seo";
import { fetchProjects, getDb, type Locale } from "@moralesbuilds/contents-db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { type Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

type ProjectListPageProps = {
  searchParams: SearchParams;
};

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("project");
  const locale = await getLocale() as Locale;

  return {
    title: t("short_title"),
    description: t("brief"),
    alternates: alternates(locale, { en: "/project" })
  };
}

export default async function ProjectListPage({ searchParams }: ProjectListPageProps) {
  const t = await getTranslations("project");
  const locale = await getLocale() as Locale;

  const resolvedParams = await searchParams;
  const pageIndex = queryToNumber(resolvedParams.page, 1);

  const { env } = await getCloudflareContext({ async: true });
  const db = getDb(env.CONTENTS_DB);
  const page = await fetchProjects(db, { locale, pageIndex });

  return (
    <>
      {/* Page title & description */}
      <PageHeader>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
          {t("title")}
        </h1>
        <p className="sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
          {t("brief")}
        </p>
      </PageHeader>

      <ProjectList
        items={page.items}
        viewDetailsLabel={t("view_details")}
        emptyTitle={t("empty_title")}
        emptyDescription={t("empty_description")}
      />

      <PageNavigation total={page.count} pageIndex={pageIndex} pageSize={page.size} />
    </>
  );
}
