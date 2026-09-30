"use client";

import React, { useContext } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LayoutPortalContext } from "./layout_portal";

export function Breadcrumbs() {
  const t = useTranslations("root");
  const pathname = usePathname();
  const { title } = useContext(LayoutPortalContext);
  const segments = pathname.split('/').filter((segment) => segment);

  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2 text-sm text-gray-500 font-mono">
        <li>
          <a href="/" className="hover:text-gray-700 transition-colors">
            {t("home")}
          </a>
        </li>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`;
          const isLast = index === segments.length - 1;

          return (
            <React.Fragment key={href}>
              <li>
                <span className="text-gray-400">/</span>
              </li>
              <li>
                {!isLast ? (
                  <Link href={href} className="hover:text-gray-700 transition-color">{t(segment)}</Link>
                ) : (
                  <span className="font-medium text-gray-900" aria-current="page">{title ? title : t(segment)}</span>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
