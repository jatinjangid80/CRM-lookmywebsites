import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
const { data, error } = await supabase.from('insurance_claims').select('*').limit(1);
console.log(error ? "Error: " + error.message : "Success: " + JSON.stringify(data));
