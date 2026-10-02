import { CodeIcon, ExternalLinkIcon } from "@/components/icons";
import { LatestPostItem } from "@/features/blog";

export default async function ProjectDetailsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start pt-4">

      {/* Left Column: Main Content (Spans 8 cols on desktop) */}
      <div className="lg:col-span-8 space-y-12">
        {/* Markdown Content */}
        <article className="prose max-w-none mx-auto">
          <div className="flex items-center justify-center bg-slate-50 border-2 border-dashed border-slate-200 rounded-lg p-6">
            <p className="text-sm font-mono text-slate-500 text-center">
              &lt;!-- Insert Markdown Content Renderer Here --&gt;
            </p>
          </div>
        </article>

        {/* Related blog post sections */}
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Related Blog Posts
          </h2>

          <div className="flex flex-col border border-slate-200 p-6 bg-white shadow-sm space-y-6">
            <LatestPostItem title="Example 1" publishedAt="2026-09-01T00:00:00.000Z" slug="example-1" />
            <LatestPostItem title="Example 2" publishedAt="2026-09-01T00:00:00.000Z" slug="example-2" />
            <LatestPostItem title="Example 3" publishedAt="2026-09-01T00:00:00.000Z" slug="example-3" />
          </div>
        </section>
      </div>

      {/* Right Column: Details panel (Spans 4 cols on desktop) */}
      <aside className="lg:col-span-4 bg-white space-y-4 divide-y divide-slate-200 [&>:nth-child(n+2)]:pt-4">
        <div className="pb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900">
            Details
          </h2>
        </div>

        <div className="py-4 space-y-2">
          <span className="block text-xs font-medium text-slate-500">
            Repository
          </span>

          <a href="https://github.com/example/project" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-between w-full text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors group">
            <span className="inline-flex items-center gap-2">
              <CodeIcon className="h-4 w-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />
              github.com/example/project
            </span>

            <ExternalLinkIcon className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>
        </div>

        <div className="pt-4 space-y-2">
          <span className="block text-xs font-medium text-slate-500">
            Documentation
          </span>

          <a href="https://docs.example.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-between w-full text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors group">
            <span className="inline-flex items-center gap-2">
              <svg className="h-4 w-4 text-slate-500 group-hover:text-indigo-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18c-2.305 0-4.408.867-6 2.292m0-14.25v14.25" />
              </svg>
              docs.example.com
            </span>

            <ExternalLinkIcon className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </a>
        </div>

      </aside>
    </div>
  );
}