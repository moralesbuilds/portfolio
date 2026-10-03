import { ProjectList } from "@/features/project/components/project_list";
import { Link } from "@/i18n/navigation";
import { fetchProjects, getDb, type Locale } from "@moralesbuilds/contents-db";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getLocale, getTranslations } from "next-intl/server";

export async function FeaturedProjectsSection() {
  const t = await getTranslations("project");
  const { env } = await getCloudflareContext({ async: true });
  const db = getDb(env.CONTENTS_DB);
  const locale = await getLocale() as Locale;
  const projects = await fetchProjects(db, { locale, pageSize: 3, onlyFeatured: true });

  return (
    <section className="py-16 md:py-24 border-t border-slate-200">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <h2 className="ttext-sm font-bold tracking-tight text-indigo-600 uppercase">
          {t("section_title")}
        </h2>

        {(projects.count > 0) && <Link href="/project" className="inline-flex items-center text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors group shrink-0">
          {t("see_all")} <span className="ml-1 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all">&rarr;</span>
        </Link>}
      </div>

      {/* Project entry cards */}
      <ProjectList
        items={projects.items}
        viewDetailsLabel={t("view_details")}
        emptyTitle={t("empty_title")}
        emptyDescription={t("empty_description")}
      />
    </section>
  );
}
