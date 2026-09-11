import { Link } from "@/i18n/navigation";

type BlogPostItemProps = {
  title: string;
  date: string;
};

export default function BlogPostItem({ title, date }: BlogPostItemProps) {
  return (
    <article className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-100 last:border-0 last:pb-0">
      <h3 className="text-lg font-semibold text-slate-900 hover:text-indigo-600 transition-colors">
        <Link href="#">{title}</Link>
      </h3>
      <time dateTime="2026-08-28" className="text-sm text-slate-500 mt-1 sm:mt-0 sm:ml-4 shrink-0">{date}</time>
    </article>
  );
}
