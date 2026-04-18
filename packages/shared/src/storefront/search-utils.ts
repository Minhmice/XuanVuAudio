/**
 * Prepare a user query for safe use inside PostgreSQL ILIKE `%…%` patterns
 * via PostgREST (no ESCAPE clause). Strips `%`, `_`, `\`, and `,` (comma breaks
 * PostgREST `.or()` lists) so the substring cannot act as LIKE wildcards.
 */
export function escapeIlikePattern(input: string): string {
  return input.trim().replace(/[%_\\,]/g, "");
}
