import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ukulozcniyiaheuvnptl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrdWxvemNuaXlpYWhldXZucHRsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjU0MzQ1MywiZXhwIjoyMDk4MTE5NDUzfQ.-Mqy1iZljV89F7jhzS9qTS_savZAQLtTE7euIx9JUvc';


export const supabase = createClient(supabaseUrl, supabaseAnonKey);
