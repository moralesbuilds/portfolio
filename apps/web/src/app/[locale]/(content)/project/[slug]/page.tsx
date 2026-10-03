import { CodeIcon, ExternalLinkIcon } from "@/components/icons";
import { LatestPostItem } from "@/features/blog";
import { getProjectSummaryFilename } from "@/features/project/utils/contents";
import { fetchProjectDetails } from "@/features/project/utils/db";
import { getDb, type Locale } from "@moralesbuilds/contents-db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import matter from "gray-matter";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ProjectDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const t = await getTranslations("project");
  const { slug } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const db = getDb(env.CONTENTS_DB);
  const locale = await getLocale() as Locale;
  const details = (await fetchProjectDetails(db, { locale, slug }))!;

  const filename = getProjectSummaryFilename(details);
  const object = await env.BLOG_CONTENTS.get(filename);
  if (!object) {
    notFound();
  }

  const raw = await object.text();
  const { data: _, content } = matter(raw);
  const hasRelatedBlogPosts = (details.relatedBlogPosts?.length ?? 0) > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-4">

      {/* Left Column: Main Content (Spans 8 cols on desktop) */}
      <div className="lg:col-span-8 space-y-12">
        {/* Markdown Content */}
        <article className="prose max-w-none mx-auto">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </article>

        {/* Related blog post sections */}
        {hasRelatedBlogPosts && <section className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            {t("related_blogs")}
          </h2>

          <div className="flex flex-col border border-slate-200 p-6 bg-white shadow-sm space-y-6">
            {details.relatedBlogPosts?.map((p) => (<LatestPostItem key={p.id} title={p.title} slug={p.slug} publishedAt={p.publishedAt} />))}
          </div>
        </section>}
      </div>

      {/* Right Column: Details panel (Spans 4 cols on desktop) */}
      <aside className="lg:col-span-4 bg-white space-y-4 divide-y divide-slate-200 [&>:nth-child(n+2)]:pt-4">
        <div className="pb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            {t("details")}
          </h2>
        </div>

        {details.repositoryUrl && <div className="py-4 space-y-2">
          <span className="block text-xs font-medium text-slate-500">
            {t("repository")}
          </span>

          <a href={details.repositoryUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-between w-full text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors group">
            <span className="inline-flex items-center gap-2">
              <CodeIcon className="h-4 w-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
              {details.repositoryUrl}
            </span>

            <ExternalLinkIcon className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>
        </div>}
      </aside>
    </div>
  );
}