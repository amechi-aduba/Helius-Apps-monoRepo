import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lkuivrbgovgdgbqiijdb.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxrdWl2cmJnb3ZnZGdicWlpamRiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM0NDI4NTYsImV4cCI6MjA0OTAxODg1Nn0.LjtDxVqRVQUTQJYbn_XwcrWxoazyACAFbtNb4wnQsqM";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
