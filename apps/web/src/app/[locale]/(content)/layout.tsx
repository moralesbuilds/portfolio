import React from "react";
import { Breadcrumbs, LayoutSlot } from "@/components";

export default async function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full py-8 space-y-8">
      {/* Header Section */}
      <header className="space-y-4">
        <Breadcrumbs />

        {/* Page tile & description */}
        <LayoutSlot name="title" />
      </header>
      {children}
    </div>
  );
}
