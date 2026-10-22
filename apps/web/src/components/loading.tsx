type LoadingProps = {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
};

export function Loading({ size = 'md', className = '' }: LoadingProps) {
  const wrapperSize =
    size === 'sm' ? 'gap-1' :
    size === 'lg' ? 'gap-3' : 'gap-2';

  const dotSize =
    size === 'sm' ? 'h-1.5 w-1.5' :
    size === 'lg' ? 'h-5 w-5' : 'h-3 w-3';

  const dot = `block shrink-0 aspect-square rounded-full bg-slate-800 animate-bounce ${dotSize}`;

  return (
    <span
      className={`inline-flex shrink-0 items-center ${wrapperSize} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className={`${dot} [animation-delay:-0.3s]`} />
      <span className={`${dot} [animation-delay:-0.15s]`} />
      <span className={dot} />
    </span>
  );
}