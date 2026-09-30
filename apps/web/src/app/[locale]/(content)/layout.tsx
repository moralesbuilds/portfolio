import React from "react";
import { Breadcrumbs, LayoutPortalProvider, LayoutSlot } from "@/components";

export default async function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutPortalProvider>
      <div className="w-full py-8 space-y-8">
        {/* Header Section */}
        <header className="space-y-4">
          <Breadcrumbs />

          {/* Page tile & description */}
          <LayoutSlot />
        </header>
        {children}
      </div>
    </LayoutPortalProvider>
  );
}
