import { Link } from "@/i18n/navigation";
import { getLink } from "../utils/link";
import { Date } from "@/components";

type LatestPostItemProps = {
  title: string;
  publishedAt: string;
  slug: string;
};

export function LatestPostItem({ title, publishedAt, slug }: LatestPostItemProps) {
  const link = getLink(slug);

  return (
    <article className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 last:border-0 last:pb-0">
      <h3 className="text-lg font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
        <Link href={link}>{title}</Link>
      </h3>
      <Date value={publishedAt} className="text-sm text-slate-500 mt-1 sm:mt-0 sm:ml-4 shrink-0" />
    </article>
  );
}
