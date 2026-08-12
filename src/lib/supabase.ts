import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://ejmuvdsqpbfnqzodxkgg.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVqbXV2ZHNxcGJmbnF6b2R4a2dnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA0OTExNjQsImV4cCI6MjA5NjA2NzE2NH0.LMmCf-hRTxtAzI2U90uhys5h6rZQVmGbyztxkTEZvxw";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
