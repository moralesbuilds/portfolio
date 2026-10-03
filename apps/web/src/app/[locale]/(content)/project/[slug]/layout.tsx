import React from "react";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";
import { FillSlot, Tab, Tabs, Tag } from "@/components";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, type Locale } from "@moralesbuilds/contents-db";
import { fetchProjectDetails } from "@/features/project/utils/db";

type ProjectDetailsLayoutProps = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export default async function ProjectDetailsLayout({ params, children }: ProjectDetailsLayoutProps) {
  const t = await getTranslations("project");
  const { slug } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const db = getDb(env.CONTENTS_DB);
  const locale = await getLocale() as Locale;

  const details = await fetchProjectDetails(db, { locale, slug });
  if (!details) {
    notFound();
  }

  const hasTags = (details.tags?.length ?? 0) > 0;

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
          {details.isFeatured && <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
              {t("featured")}
            </span>
          </div>}

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            {details.title}
          </h1>
          <p className="sm:text-lg text-gray-600 leading-relaxed max-w-3xl">
            {details.summary}
          </p>
        </div>

        {hasTags && <div className="flex flex-wrap gap-2 pt-2">
          {details.tags?.map((t) => (<Tag key={t} label={t} />))}
        </div>}
      </FillSlot>

      {/* Navigation Tabs */}
      <Tabs>
        <Tab href="#" exact>{t("summary")}</Tab>
      </Tabs>

      {/* Tab content */}
      {children}
    </>
  );
}
