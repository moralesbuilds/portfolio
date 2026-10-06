type TabsProps = {
  children: React.ReactNode;
};

export function Tabs({ children }: TabsProps) {
  return (
    <div className="border-b border-slate-200">
      <nav className="-mb-px flex space-x-8 text-sm font-semibold" aria-label="Project Tabs">
        {children}
      </nav>
    </div>
  );
}
