"use client";

import { usePathname } from "@/i18n/navigation";

export function useIsActiveRoute(targetPath: string, exact: boolean = false): boolean {
  const pathname = usePathname();
  if (!pathname) {
    return false;
  }

  const currentNormalized = pathname.replace(/\/$/, '') || '/';
  const targetNormalized = targetPath.replace(/\/$/, '') || '/';
  if (currentNormalized === targetNormalized) {
    return true;
  }

  if (exact || targetNormalized === '/') {
    return currentNormalized === '/';
  }

  return currentNormalized.startsWith(`${targetNormalized}/`);
}
