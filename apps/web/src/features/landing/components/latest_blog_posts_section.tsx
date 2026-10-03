import { getLocale, getTranslations } from "next-intl/server";
import { LatestPostItem } from "@/features/blog";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { fetchLatestBlogPosts, getDb, type Locale } from "@moralesbuilds/contents-db";
import { EmptyListBanner } from "@/components";
import { Link } from "@/i18n/navigation";

export async function LatestBlogPostsSection() {
  const t = await getTranslations("blog");
  const locale = await getLocale() as Locale;

  const { env } = await getCloudflareContext({ async: true });
  const db = getDb(env.CONTENTS_DB);
  const blogPosts = await fetchLatestBlogPosts(db, { locale });
  const hasItems = (blogPosts?.length ?? 0) > 0;

  return (
    <section className="py-16 md:py-24 border-t border-slate-200">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <h2 className="text-small font-bold tracking-tight text-indigo-600">
          {t("section_title")}
        </h2>
        {hasItems && <Link href="/blog" className="inline-flex items-center text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors group shrink-0">
          {t("see_all")} <span className="ml-1 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all">&rarr;</span>
        </Link>}
      </div>

      {/* Posts list */}
      <div className="w-full p-6 bg-base border border-gray-200 rounded-md shadow-sm">
        {hasItems ? (
          <div className="flex flex-col border border-slate-200 p-6 bg-white shadow-sm space-y-6">
            {blogPosts.map((b) => (<LatestPostItem key={b.id} title={b.title} publishedAt={b.publishedAt} slug={b.slug} />))}
          </div>
        ) : (
          <EmptyListBanner title={t("empty_title")} description={t("empty_description")} />
        )}
      </div>
    </section>
  );
}
