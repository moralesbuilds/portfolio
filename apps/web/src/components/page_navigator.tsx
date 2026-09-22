"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { LeftArrowIcon, RightArrowIcon } from "./icons";
import { type ReadonlyURLSearchParams, useSearchParams } from "next/navigation";

export type PageNavigationProps = {
  total: number;
  pageIndex: number;
  pageSize: number;
};

type NavButtonProps = {
  pageIndex: number;
  enabled: boolean;
  label: string;
  pathname: string;
  searchParams: ReadonlyURLSearchParams;
}

function PreviousButton({ pageIndex, enabled, label, pathname, searchParams }: NavButtonProps) {
  if (enabled) {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set('page', pageIndex.toString());

    return (
      <Link href={`${pathname}?${currentParams.toString()}`} className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors">
        <LeftArrowIcon />
        {label}
      </Link>
    );
  } else {
    return (
      <span className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 text-gray-300">
        <LeftArrowIcon />
        {label}
      </span>
    );
  }
}

function NextButton({ pageIndex, enabled, label, pathname, searchParams }: NavButtonProps) {
  if (enabled) {
    const currentParams = new URLSearchParams(searchParams);
    currentParams.set('page', pageIndex.toString());

    return (
      <Link href={`${pathname}?${currentParams.toString()}`} className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-gray-700 transition-colors">
        {label}
        <RightArrowIcon />
      </Link>
    );
  } else {
    return (
      <span className="inline-flex items-center px-3 py-2 rounded-lg border border-gray-300 text-gray-300">
        {label}
        <RightArrowIcon />
      </span>
    );
  }
}

export function PageNavigation({ total, pageIndex, pageSize }: PageNavigationProps) {
  const r = useTranslations("root");
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / pageSize);

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 pt-6 text-sm font-medium text-gray-600" aria-label="Pagination">
      <PreviousButton
        pageIndex={pageIndex - 1}
        enabled={pageIndex > 1}
        label={r("prev")}
        pathname={pathname}
        searchParams={searchParams}
      />

      {/* Page numbers */}
      <div className="hidden sm:flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, index) => {
          const value = index + 1;
          if (value === pageIndex) {
            return <span key={value} data-page={value} className="px-3 py-1.5 rounded-md bg-indigo-50 text-indigo-600 font-semibold border border-indigo-100">{value}</span>;
          } else {
            const currentParams = new URLSearchParams(searchParams);
            currentParams.set('page', value.toString());
            return <Link key={value} data-page={value} href={`${pathname}?${currentParams.toString()}`} className="px-3 py-1.5 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">{value}</Link>
          }
        })}
      </div>

      <NextButton
        pageIndex={pageIndex + 1}
        enabled={pageIndex < totalPages}
        label={r("next")}
        pathname={pathname}
        searchParams={searchParams}
      />
    </nav>
  );
}
