import { Breadcrumbs, Date, Tag } from "@/components";
import { getBlogPostFilename } from "@/features/blog/utils/contents";
import { fetchBlogPostDetails, getDb, type Locale } from "@moralesbuilds/contents-db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import matter from "gray-matter";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const t = await getTranslations("root");
  const { env } = await getCloudflareContext({ async: true });
  const db = getDb(env.CONTENTS_DB);
  const locale = await getLocale() as Locale;
  const { slug } = await params;

  const details = await fetchBlogPostDetails(db, { locale, slug });
  if (!details) {
    notFound();
  }
  
  const filename = getBlogPostFilename(details);
  const object = await env.BLOG_CONTENTS.get(filename);
  if (!object) {
    notFound();
  }

  const raw = await object.text();
  const { data: _, content } = matter(raw);
  const hasTags = (details.tags?.length ?? 0) > 0

  return (
    <div className="w-full py-8 space-y-8">
      {/*Header section */}
      <header className="space-y-4">
        <Breadcrumbs overrides={{ [slug]: details.title }} />

        <div className="space-y-2">
          <div>
            <Tag label={details.category} />
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            {details.title}
          </h1>
          <p className="sm:text-md text-gray-600 leading-relaxed max-w-3xl">
            <Date value={details.publishedAt} />
          </p>
        </div>
      </header>

      {/* The content */}
      <article className="prose max-w-none mx-auto">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {content}
        </ReactMarkdown>
      </article>

      {/* Tags and share buttons */}
      <div className="border-t-2 border-dotted border-gray-400 pt-4 space-y-2">
        <div className="space-x-2">
          {hasTags ? (
            details.tags?.map((t) => <Tag key={t} label={t} />)
          ) : (
            <em className="text-gray-500 text-sm">{t("no_tags")}</em>
          )}
        </div>
      </div>
    </div>
  );
}
