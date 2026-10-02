import { FillSlot, Tag } from "@/components";
import { Link } from "@/i18n/navigation";
import React from "react";

export default async function ProjectDetailsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <FillSlot name="banner">
        <div className="w-full h-64 sm:h-80 md:h-95 bg-slate-900 border-b border-slate-200 relative overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1920&q=80"
            alt="Project Banner Placeholder"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-900/40 to-transparent"></div>
        </div>
      </FillSlot>

      <FillSlot name="title">
        <div className="space-y-2">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
              Featured
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Project tile
          </h1>
          <p className="sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            Project summary
          </p>
        </div>

        <div className="flex flex-wrap gap-2 pt-2">
          <Tag label="TypeScript" />
          <Tag label="Cloudflare Workers" />
        </div>
      </FillSlot>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="-mb-px flex space-x-8 text-sm font-semibold" aria-label="Project Tabs">
          <Link href="#" className="border-b-2 border-indigo-600 py-4 text-indigo-600 flex items-center gap-2" aria-current="page">
            <span>Summary</span>
          </Link>

          <Link href="#" className="border-b-2 border-transparent py-4 text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors">
            Details
          </Link>
        </nav>
      </div>


      {/* Tab content */}
      {children}
    </>
  );
}
