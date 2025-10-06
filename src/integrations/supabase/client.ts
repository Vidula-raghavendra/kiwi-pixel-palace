import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://wuetwwdfqellisyxpivr.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1ZXR3d2RmcWVsbGlzeXhwaXZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5MjQyOTcsImV4cCI6MjA2NTUwMDI5N30.AgHBTCAlehgvgBW5YvXzPjFQZtx6RtUp518WdjGZHU4";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);