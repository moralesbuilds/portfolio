import { getTranslations } from "next-intl/server";
import { EmptyPostList, LatestPostItem } from "@/features/blog";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { fetchLatestBlogPosts, getDb } from "@moralesbuilds/contents-db";

export async function LatestBlogPostsSection() {
  const t = await getTranslations("home.latest_blog_posts");
  const e = await getTranslations("blog");

  const { env } = await getCloudflareContext({ async: true });
  const db = getDb(env.CONTENTS_DB);
  const blogPosts = await fetchLatestBlogPosts(db)
  const hasItems = (blogPosts?.length ?? 0) > 0;

  return (
    <section className="py-16 md:py-24 border-t border-slate-200">
      <h2 className="text-small font-bold tracking-tight text-indigo-600 mb-8">
        {t("title")}
      </h2>

      {/* Posts list */}
      {hasItems && <div className="flex flex-col border border-slate-200 p-6 bg-white shadow-sm space-y-6">
        {blogPosts.map((b) => (<LatestPostItem key={b.id} title={b.title} publishedAt={b.publishedAt} slug={b.slug} />))}
      </div>}

      {!hasItems && <EmptyPostList title={e("empty_title")} description={e("empty_description")} />}
    </section>
  );
}
