import React from "react";
import { Breadcrumbs } from "./breadcrumbs";

type PageHeaderProps = {
  breadcrumbTitle?: string;
  children: React.ReactNode;
};

export function PageHeader({ breadcrumbTitle, children }: PageHeaderProps) {
  return (
    <header className="space-y-4">
      <Breadcrumbs title={breadcrumbTitle} />
      {children}
    </header>
  );
}
