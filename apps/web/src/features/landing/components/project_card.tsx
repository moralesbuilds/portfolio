import { Link } from "@/i18n/navigation";

type ProjectCardProps = {
  image: string;
  title: string;
  description: string;
  tags?: string[];
  viewDetailsLabel: string;
};

export default function ProjectCard({ image, title, description, tags, viewDetailsLabel }: ProjectCardProps) {
  return (
    <article className="flex flex-col border border-slate-200 bg-base shadow-sm transition-all hover:shadow-md hover:border-slate-300">
      <img src={image} alt={title} className="h-48 w-full object-cover" />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
        <p className="mt-2 flex-1 text-sm text-slate-600 leading-relaxed">{description}</p>
        {(tags && tags.length > 0) && <div className="mt-4 flex flex-wrap gap-2">
          {tags.map((t) => (<span key={t} className="rounded-mf bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{t}</span>))}
        </div>}
        <div className="mt-6 pt-4 border-t border-slate-100">
          <Link href="#" className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-500">
            {viewDetailsLabel} &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
