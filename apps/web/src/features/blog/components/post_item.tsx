import { Tag } from "@/components";
import { getLink } from "../utils/link";
import { Link } from "@/i18n/navigation";

type PostItemProps = {
  publishedAt: string;
  category: string;
  slug: string;
  title: string;
  summary: string;
  readMoreLabel: string;
};

export default function PostItem({ publishedAt, category, slug, title, summary, readMoreLabel }: PostItemProps) {
  const link = getLink(slug);

  return (
    <li className="py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-start gap-4 md:gap-8">
      {/* Published Date */}
      <div className="w-32 shrink-0 text-sm font-medium text-gray-500 pt-0.5">
        {publishedAt}
      </div>

      {/* Post details */}
      <div className="flex flex-col items-start gap-2.5 flex-1">
        <Tag label={category} />

        <h2 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors">
          <Link href={link}>{title}</Link>
        </h2>

        <p className="text-gray-600 text-sm leading-relaxed">{summary}</p>

        <Link href={link} className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors pt-1 group">
          {readMoreLabel} <span className="ml-1 group-hover:translate-x-1 transition-transform">&rarr;</span>
        </Link>
      </div>
    </li>
  );
}
