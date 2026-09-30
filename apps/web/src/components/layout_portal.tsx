"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export const LayoutPortalContext = createContext<{
  title?: string | null;
  setTitle: (title: string | null | undefined) => void;
  slotContent: React.ReactNode;
  setSlotContent: (content: React.ReactNode) => void;
}>({
  title: null,
  setTitle: () => { },
  slotContent: null,
  setSlotContent: () => { }
});

export function LayoutPortalProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState<string | undefined | null>(null);
  const [slotContent, setSlotContent] = useState<React.ReactNode>(null);

  return (
    <LayoutPortalContext value={{ title, setTitle, slotContent, setSlotContent }}>
      {children}
    </LayoutPortalContext>
  );
}

export function LayoutSlot() {
  const { slotContent } = useContext(LayoutPortalContext);
  return (
    <>{slotContent}</>
  );
}

type FillSlotProps = {
  title?: string | null;
  children?: React.ReactNode;
};

export function FillSlot({ title, children }: FillSlotProps) {
  const { setTitle, setSlotContent } = useContext(LayoutPortalContext);

  useEffect(() => {
    setTitle(title);
    setSlotContent(children);
    return () => {
      setTitle(null);
      setSlotContent(null);
    };
  }, [children, setSlotContent, title, setTitle]);

  return null;
}
