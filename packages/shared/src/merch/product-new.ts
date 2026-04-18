/** Days a product stays "new" after first publish (Phase 8 CONTEXT). */
export const MERCH_NEW_WINDOW_DAYS = 30;

/**
 * True when `firstPublishedAt` is within MERCH_NEW_WINDOW_DAYS of `now` (UTC).
 */
export function isProductInNewWindow(
  firstPublishedAt: string | null,
  now: Date = new Date(),
): boolean {
  if (!firstPublishedAt) return false;
  const start = new Date(firstPublishedAt);
  if (Number.isNaN(start.getTime())) return false;
  const end = new Date(start.getTime());
  end.setUTCDate(end.getUTCDate() + MERCH_NEW_WINDOW_DAYS);
  const t = now.getTime();
  return t >= start.getTime() && t < end.getTime();
}
