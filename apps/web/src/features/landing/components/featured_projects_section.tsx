import ProjectCard from "./project_card";
import { getTranslations } from "next-intl/server";

type ProjectItem = {
  key: string;
  image: string;
  title: string;
  description: string;
  tags?: string[];
};

export async function FeaturedProjectsSection() {
  const t = await getTranslations("home.projects");
  const viewDetailsLabel = t("view_details");
  const projects = t.raw("projects") as ProjectItem[];

  return (
    <section className="py-16 md:py-24 border-t border-slate-200">
      <h2 className="text-small font-bold tracking-tight text-indigo-600 mb-8">
        {t("title")}
      </h2>

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
