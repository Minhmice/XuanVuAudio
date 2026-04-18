/**
 * Pure helpers for inventory adjustment recording (testable without DB).
 */

/** Returns true when a ledger write should occur (quantity actually changes). */
export function inventoryQuantityChanged(priorOnHand: number, nextOnHand: number): boolean {
  return priorOnHand !== nextOnHand;
}
