import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Browser/client-side Supabase client
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    // During build-time prerendering, env vars may not be available.
    // Return a dummy client that doesn't crash the build.
    if (typeof window === 'undefined') {
      // SSR / build time — return a placeholder
      return createSupabaseClient('https://placeholder.supabase.co', 'placeholder');
    }
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Add them to your .env.local file and Vercel environment variables.'
    );
  }

  return createSupabaseClient(url, key);
}

// Singleton instance for client-side use
let client: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!client) {
    client = createClient();
  }
  return client;
}

