type TabsProps = {
  "aria-label"?: string;
  children: React.ReactNode;
};

export function Tabs({ children, "aria-label": ariaLabel }: TabsProps) {
  return (
    <div className="border-b border-slate-200">
      <nav className="-mb-px flex space-x-8 text-sm font-semibold" aria-label={ariaLabel}>
        {children}
      </nav>
    </div>
  );
}
