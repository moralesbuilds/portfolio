import { getLocale, getTranslations } from "next-intl/server";
import { LatestPostItem } from "@/features/blog";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { fetchLatestBlogPosts, getDb, type Locale } from "@moralesbuilds/contents-db";
import { EmptyListBanner } from "@/components";

export async function LatestBlogPostsSection() {
  const t = await getTranslations("blog");
  const locale = await getLocale() as Locale;

  const { env } = await getCloudflareContext({ async: true });
  const db = getDb(env.CONTENTS_DB);
  const blogPosts = await fetchLatestBlogPosts(db, { locale });
  const hasItems = (blogPosts?.length ?? 0) > 0;

  return (
    <section className="py-16 md:py-24 border-t border-slate-200">
      <h2 className="text-small font-bold tracking-tight text-indigo-600 mb-8">
        {t("section_title")}
      </h2>

      {/* Posts list */}
      {hasItems ? (
        <div className="flex flex-col border border-slate-200 p-6 bg-white shadow-sm space-y-6">
          {blogPosts.map((b) => (<LatestPostItem key={b.id} title={b.title} publishedAt={b.publishedAt} slug={b.slug} />))}
        </div>
      ) : (
        <EmptyListBanner title={t("empty_title")} description={t("empty_description")} />
      )}
    </section>
  );
}
