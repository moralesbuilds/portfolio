import { Date, Tag } from "@/components";
import { Link } from "@/i18n/navigation";
import { getProjectUrl } from "../utils/url";

type ProjectCardProps = {
  slug: string;
  image: string;
  title: string;
  summary: string;
  tags?: string[];
  isFeatured?: boolean;
  publishedAt?: string;
  featuredLabel?: string;
  viewDetailsLabel: string;
};

export function ProjectCard({ slug, image, title, summary, tags, isFeatured, publishedAt, featuredLabel, viewDetailsLabel }: ProjectCardProps) {
  const link = getProjectUrl(slug);
  const showFeatured = isFeatured && featuredLabel;

  return (
    <article className="flex flex-col border border-slate-200 bg-base shadow-sm transition-all hover:shadow-md hover:border-slate-300">
      <div className="relative">
        <img src={image} alt={title} className="h-48 w-full object-cover" />
        {showFeatured && (
          <span className="absolute top-3 left-3 inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/60">
            {featuredLabel}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        {publishedAt && (
          <Date value={publishedAt} className="text-xs font-medium text-slate-500" />
        )}
        <h3 className={`text-xl font-semibold text-slate-900 ${publishedAt ? "mt-1" : ""}`}>
          {title}
        </h3>
        <p className="mt-2 flex-1 text-sm text-slate-600 leading-relaxed">
          {summary}
        </p>
        {(tags && tags.length > 0) && <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => (<Tag key={t} label={t} />))}
        </div>}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <Link href={link} className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            {viewDetailsLabel} &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
