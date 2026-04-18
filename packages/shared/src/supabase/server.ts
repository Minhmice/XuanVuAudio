import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type CreateSupabaseServerClientOptions = {
  sessionMaxAgeSeconds?: number;
};

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
}

if (!supabaseAnonKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");
}

const url = supabaseUrl;
const anonKey = supabaseAnonKey;

export async function createSupabaseServerClient(
  options: CreateSupabaseServerClientOptions = {},
) {
  const cookieStore = await cookies();

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value, options: cookieOptions } of cookiesToSet) {
          try {
            cookieStore.set(name, value, cookieOptions);
          } catch {
            // noop: cookie mutation can fail in pure Server Component reads
          }
        }
      },
    },
    cookieOptions: options.sessionMaxAgeSeconds
      ? {
          maxAge: options.sessionMaxAgeSeconds,
        }
      : undefined,
  });
}
