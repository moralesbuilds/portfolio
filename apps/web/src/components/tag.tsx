type TagProps = {
  label: string;
};

export function Tag({ label }: TagProps) {
  return (
    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">{label}</span>
  );
}
