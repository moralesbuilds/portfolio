"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Slots = Record<string, React.ReactNode>;

export const LayoutPortalContext = createContext<{
  title?: string | null;
  setTitle: (title: string | null | undefined) => void;
  slotContents: Slots;
  setSlotContents: React.Dispatch<React.SetStateAction<Slots>>;
}>({
  title: null,
  setTitle: () => { },
  slotContents: {},
  setSlotContents: () => { }
});

export function LayoutPortalProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState<string | undefined | null>(null);
  const [slotContents, setSlotContents] = useState<Slots>({});

  return (
    <LayoutPortalContext value={{ title, setTitle, slotContents, setSlotContents }}>
      {children}
    </LayoutPortalContext>
  );
}

export function LayoutSlot({ name }: { name: string }) {
  const { slotContents } = useContext(LayoutPortalContext);
  return (
    <>{slotContents[name]}</>
  );
}

type FillSlotProps = {
  name: string;
  title?: string | null;
  children?: React.ReactNode;
};

export function FillSlot({ name, title, children }: FillSlotProps) {
  const { setTitle, setSlotContents } = useContext(LayoutPortalContext);

  useEffect(() => {
    setTitle(title);
    setSlotContents((prevSlots) => ({ ...prevSlots, [name]: children }));
    return () => {
      setTitle(null);
      setSlotContents((prevSlots) => ({ ...prevSlots, [name]: undefined }));
    };
  }, [children, setSlotContents, title, setTitle]);

  return null;
}
