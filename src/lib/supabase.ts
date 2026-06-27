import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ukulozcniyiaheuvnptl.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV';


export const supabase = createClient(supabaseUrl, supabaseAnonKey);
