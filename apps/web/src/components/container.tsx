import React from "react"

type ContainerProps = {
  children: React.ReactNode;
};

export function Container({ children }: ContainerProps) {
  return (
    <div className="w-full mx-auto max-w-7xl px-6 sm:px-8">
      {children}
    </div>
  );
}
