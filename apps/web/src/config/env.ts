/**
 * Typed accessors for public env used by the web app.
 * Server-only secrets must not be imported into client components.
 */
export function getPublicEnv() {
  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "",
  } as const;
}
