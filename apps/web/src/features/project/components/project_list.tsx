import { type ProjectItem } from "@moralesbuilds/contents-db"
import { ProjectCard } from "./project_card";
import { EmptyListBanner } from "@/components";

type ProjectListProps = {
  items?: ProjectItem[] | null;
  featuredLabel?: string;
  viewDetailsLabel: string;
  emptyTitle: string;
  emptyDescription: string;
};

export function ProjectList({ items, featuredLabel, viewDetailsLabel, emptyTitle, emptyDescription }: ProjectListProps) {
  const hasItems = (items?.length ?? 0) > 0;

  return hasItems ? (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {items!.map((p) => (
        <ProjectCard
          key={p.id}
          slug={p.slug!}
          image={`https://picsum.photos/seed/${encodeURIComponent(p.slug!)}/800/400`}
          title={p.title!}
          summary={p.summary!}
          tags={p.tags}
          isFeatured={p.isFeatured}
          publishedAt={p.publishedAt}
          featuredLabel={featuredLabel}
          viewDetailsLabel={viewDetailsLabel}
        />
      ))}
    </div>
  ) : (
    <div className="w-full p-6 bg-base border border-gray-200 rounded-md shadow-sm">
      <EmptyListBanner title={emptyTitle} description={emptyDescription} />
    </div>
  );
}
