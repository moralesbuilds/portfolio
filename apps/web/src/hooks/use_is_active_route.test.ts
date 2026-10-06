import { usePathname } from "@/i18n/navigation";
import { renderHook } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import { useIsActiveRoute } from "./use_is_active_route";

vi.mock('@/i18n/navigation', () => ({
  usePathname: vi.fn()
}));

describe("useIsActiveRoute", () => {
  test("returns true when pathname matches the target path exactly", () => {
    vi.mocked(usePathname).mockReturnValue("/parent");

    const { result } = renderHook(() => useIsActiveRoute("/parent"));
    expect(result.current).toBe(true);
  });

  test("returns true when path name is a child sub-route of the target path", () => {
    vi.mocked(usePathname).mockReturnValue("/parent/leaf");

    const { result } = renderHook(() => useIsActiveRoute("/parent"));
    expect(result.current).toBe(true);
  });

  test("returns true for deeply nested child routes", () => {
    vi.mocked(usePathname).mockReturnValue("/parent/leaf/sub-leaf/details");

    const { result } = renderHook(() => useIsActiveRoute("/parent"));
    expect(result.current).toBe(true);
  });

  test("returns false for completely unrelated routes", () => {
    vi.mocked(usePathname).mockReturnValue("/dashboard");

    const { result } = renderHook(() => useIsActiveRoute("/parent"));
    expect(result.current).toBe(false);
  });

  test("returns false for similar strings prefixes that are NOT sub-routes", () => {
    vi.mocked(usePathname).mockReturnValue("/parent-other");

    const { result } = renderHook(() => useIsActiveRoute("/parent"));
    expect(result.current).toBe(false);
  });

  test("handles trailing slashes on target or pathname gracefully", () => {
    vi.mocked(usePathname).mockReturnValue("/parent/");
    const { result: r1 } = renderHook(() => useIsActiveRoute("/parent"));
    expect(r1.current).toBe(true);

    vi.mocked(usePathname).mockReturnValue("/parent");
    const { result: r2 } = renderHook(() => useIsActiveRoute("/parent/"));
    expect(r2.current).toBe(true);
  });

  test("handles the root path ('/') correctly", () => {
    vi.mocked(usePathname).mockReturnValue("/");
    const { result: r1 } = renderHook(() => useIsActiveRoute("/"));
    expect(r1.current).toBe(true);

    vi.mocked(usePathname).mockReturnValue("/account");
    const { result: r2 } = renderHook(() => useIsActiveRoute("/"));
    expect(r2.current).toBe(false);
  });

  test("returns false when usePathname returns empty string", () => {
    vi.mocked(usePathname).mockReturnValue("");

    const { result } = renderHook(() => useIsActiveRoute("/parent"));
    expect(result.current).toBe(false);
  });

  test("returns true for exact matches when exact is true", () => {
    vi.mocked(usePathname).mockReturnValue("/parent");

    const { result } = renderHook(() => useIsActiveRoute("/parent", true));
    expect(result.current).toBe(true);
  });

  test("returns false for child sub-routes when exact is true", () => {
    vi.mocked(usePathname).mockReturnValue("/parent/leaf");

    const { result } = renderHook(() => useIsActiveRoute("/parent", true));
    expect(result.current).toBe(false);
  });

  test("returns false for parent route when the page is in root path ('/') and route is exact", () => {
    vi.mocked(usePathname).mockReturnValue("/");

    const { result } = renderHook(() => useIsActiveRoute("/parent", true));
    expect(result.current).toBe(false);
  });
});
