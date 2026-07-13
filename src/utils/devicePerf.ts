/**
 * Detects whether the current device is low-end based on:
 * - CPU core count (≤ 6 cores)
 * - Device memory (≤ 4 GB, Chrome only)
 * - prefers-reduced-motion media query
 *
 * Used to scale back expensive animations on old / weak hardware.
 */
export function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return false;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return true;

  const cores = navigator.hardwareConcurrency ?? 8;
  if (cores <= 6) return true;

  // deviceMemory is a Chrome-only API (in GB)
  const mem = (navigator as any).deviceMemory as number | undefined;
  if (mem !== undefined && mem <= 4) return true;

  return false;
}
