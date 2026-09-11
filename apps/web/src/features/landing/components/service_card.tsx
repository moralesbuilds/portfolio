type ServiceCardProps = {
  index: number;
  title: string;
  description: string;
};

export default function ServiceCard({ index, title, description }: ServiceCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-base p-6 shadow-sm transition-all hover:shadow-md hover:border-slate-300">
      <div className="flex items-center space-x-4">
        <div className="h-10 w-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg shrink-0">
          0{index}
        </div>
        <h4 className="text-xl font-semibold text-slate-900">{title}</h4>
      </div>
      <p className="mt-3 text-sm text-slate-600 leading-relaxed">{description}</p>
    </div>
  );
}
