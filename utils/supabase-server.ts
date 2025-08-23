import { createClient } from "@supabase/supabase-js";

// Server-side Supabase client with service role key for full database access
const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for server operations
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Export both named and default for consistency
export const supabase = supabaseServer;
export default supabaseServer;