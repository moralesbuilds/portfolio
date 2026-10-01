import { Project } from "@moralesbuilds/contents-db"
import { ProjectCard } from "./project_card";
import { EmptyListBanner } from "@/components";

type ProjectListProps = {
  items?: Project[] | null;
  viewDetailsLabel: string;
  emptyTitle: string;
  emptyDescription: string;
};

export function ProjectList({ items, viewDetailsLabel, emptyTitle, emptyDescription }: ProjectListProps) {
  const hasItems = (items?.length ?? 0) > 0;

  return hasItems ? (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {items!.map((p) => (
        <ProjectCard
          key={p.id}
          image=""
          title={p.title!}
          description={p.summary!}
          viewDetailsLabel={viewDetailsLabel}
          tags={p.tags}
        />
      ))}
    </div>
  ) : (
    <div className="w-full p-6 bg-base border border-gray-200 rounded-md shadow-sm">
      <EmptyListBanner title={emptyTitle} description={emptyDescription} />
    </div>
  );
}
