import { Breadcrumbs } from "@/components";
import { PostList } from "@/features/blog";
import { fetchBlogPosts, getDb } from "@moralesbuilds/contents-db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getTranslations } from "next-intl/server";

export default async function BlogListPage() {
  const { env } = await getCloudflareContext({ async: true });
  const db = getDb(env.CONTENTS_DB);
  const items = await fetchBlogPosts(db);
  const t = await getTranslations("blog");
  const r = await getTranslations("root");

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
        items={items}
        readMoreLabel={t("read_more")}
        emptyTitle={t("empty_title")}
        emptyDescritpion={t("empty_description")}
      />

      {/* Pagination Navigation */}
      <nav className="flex items-center justify-between border-t border-gray-200 pt-6 text-sm font-medium text-gray-600" aria-label="Pagination">
        {/* Previous button */}
        <a href="#" className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors">
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          {r("prev")}
        </a>

        {/* Page numbers */}
        <div className="hidden sm:flex items-center gap-1">
          <a href="#" className="px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">1</a>
          <span className="px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-600 font-semibold border border-indigo-100">2</span>
          <a href="#" className="px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">3</a>
          <span className="px-2 text-gray-400">…</span>
          <a href="#" className="px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">8</a>
        </div>

        {/* Next button */}
        <a href="#" className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors">
          {r("next")}
          <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </a>
      </nav>
    </div>
  );
}
