import { ProjectCard } from "@/features/project";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

type ProjectItem = {
  key: string;
  image: string;
  title: string;
  description: string;
  tags?: string[];
};

export async function FeaturedProjectsSection() {
  const t = await getTranslations("project");
  const viewDetailsLabel = t("view_details");
  const projects = t.raw("projects") as ProjectItem[];

  return (
    <section className="py-16 md:py-24 border-t border-slate-200">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <h2 className="ttext-sm font-bold tracking-tight text-indigo-600 uppercase">
          {t("section_title")}
        </h2>

        <Link href="/project" className="inline-flex items-center text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors group shrink-0">
          {t("see_all")} <span className="ml-1 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all">&rarr;</span>
        </Link>
      </div>

      {/* Project entry cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {projects.map((p) => (<ProjectCard
          key={p.key}
          image={p.image}
          title={p.title}
          description={p.description}
          tags={p.tags}
          viewDetailsLabel={viewDetailsLabel}
        />))}
      </div>
    </section>
  );
}
