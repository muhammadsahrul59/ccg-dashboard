import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.SUPABASE_DATABASE_URL;
const supabaseServiceRoleKey = import.meta.env.SUPABASE_SERVICE_ROLE_KEY;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;
const supabaseJwtSecret = import.meta.env.SUPABASE_JWT_SECRET;
const viteSupabaseUrl = import.meta.env.VITE_SUPABASE_DATABASE_URL;
const viteSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey,
  supabaseAnonKey,
  supabaseJwtSecret,
  viteSupabaseUrl,
  viteSupabaseAnonKey
);
