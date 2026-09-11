import { getTranslations } from "next-intl/server";
import BlogPostItem from "./blog_post_item";

type BlogPostItem = {
  key: string;
  title: string;
  date: string;
};

export async function LatestBlogPostsSection() {
  const t = await getTranslations("home.latest_blog_posts");
  const blogPosts = t.raw("blog_posts") as BlogPostItem[];

  return (
    <section className="py-16 md:py-24 border-t border-slate-200">
      <h2 className="text-small font-bold tracking-tight text-indigo-600 mb-8">
        {t("title")}
      </h2>

      {/* Posts list */}
      <div className="flex flex-col border border-slate-200 p-6 bg-white shadow-sm space-y-6">
        {blogPosts.map((b) => (<BlogPostItem key={b.key} title={b.title} date={b.date} />))}
      </div>
    </section>
  );
}
