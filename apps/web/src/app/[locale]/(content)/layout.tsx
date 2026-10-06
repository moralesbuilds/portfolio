import React from "react";
import { Container } from "@/components";

export default function ContentLayout({ children }: { children: React.ReactNode }) {
  return (
    <Container>
      <div className="w-full py-8 space-y-8">{children}</div>
    </Container>
  );
}
