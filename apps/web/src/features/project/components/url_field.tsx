import { CodeIcon, ExternalLinkIcon } from "@/components/icons";

type UrlFieldProps = {
  isCode: boolean;
  url: string;
  label: string;
};

export function UrlField({ isCode, url, label }: UrlFieldProps) {
  return (
    <div className="py-4 space-y-2 mb-0">
      <span className="block text-xs font-medium text-slate-500">
        {label}
      </span>

      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-between w-full text-sm font-semibold text-slate-800 hover:text-indigo-600 transition-colors group"
        data-testid="url-field-anchor"
      >
        <span className="inline-flex items-center gap-2">
          {isCode && <CodeIcon className="h-4 w-4 text-slate-500 group-hover:text-indigo-600 transition-colors" />}
          {url}
        </span>

        <ExternalLinkIcon className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </a>
    </div>
  );
}
