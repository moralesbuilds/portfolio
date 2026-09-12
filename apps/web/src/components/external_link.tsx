import React from "react";

type ExternalLinkProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
};

export default function ExternalLink({ href, label, icon }: ExternalLinkProps) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-gray-700 bg-blue-100 rounded-full hover:bg-gray-200 transition-colors" aria-label={label}>
      {icon}
      {label}
    </a>
  );
}
