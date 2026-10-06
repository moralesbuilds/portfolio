import { type IconProps } from "./types";

export function ExternalLinkIcon({ className }: IconProps) {
  return (
    <svg className={className ?? "h-6 w-6"} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H18m0 0v4.5m0-4.5L8.25 15.75M6 18.75h12" />
    </svg>
  )
}
