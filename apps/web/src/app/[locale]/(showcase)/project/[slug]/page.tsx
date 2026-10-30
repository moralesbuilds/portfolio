import { Loading } from "@/components";
import { LatestPostItem } from "@/features/blog";
import { ProjectDetailsPanel } from "@/features/project";
import { getProjectSummaryFilename } from "@/features/project/utils/contents";
import { fetchProjectDetails } from "@/features/project/utils/db";
import { type Locale } from "@moralesbuilds/contents-db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import matter from "gray-matter";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ProjectDetailsPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProjectDetailsPage({ params }: ProjectDetailsPageProps) {
  const t = await getTranslations("project");
  const { slug } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const locale = await getLocale() as Locale;
  const details = await fetchProjectDetails(locale, slug);
  if (!details) {
    notFound();
  }

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
      <div className="lg:col-span-4">
        <Suspense fallback={<div className="w-full flex justify-center"><Loading size="md" /></div>}>
          <ProjectDetailsPanel details={details} />
        </Suspense>
      </div>
    </div >
  );
}