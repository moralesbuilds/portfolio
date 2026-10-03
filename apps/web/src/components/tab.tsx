"use client";

import { useIsActiveRoute } from "@/hooks/use_is_active_route";
import { Link } from "@/i18n/navigation";

const ACTIVE_STYLE = "border-b-2 border-indigo-600 py-4 text-indigo-600 flex items-center gap-2";
const INACTIVE_STYLE = "border-b-2 border-transparent py-4 text-slate-500 hover:border-slate-300 hover:text-slate-700 transition-colors";

type TabProps = {
  href: string;
  exact?: boolean;
  children: React.ReactNode;
};

export function Tab({ href, exact = false, children }: TabProps) {
  const isActive = useIsActiveRoute(href, exact);

  return isActive ? (
    <span role="tab" aria-selected="true" aria-current="page" className={ACTIVE_STYLE}>
      {children}
    </span>
  ) : (
    <Link href={href} role="tab" aria-selected="false" className={INACTIVE_STYLE}>
      {children}
    </Link>
  );
}
