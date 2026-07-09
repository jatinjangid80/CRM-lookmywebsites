import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf-8');
const envVars = Object.fromEntries(envFile.split('\n').filter(l => l && !l.startsWith('#')).map(l => l.split('=')));
const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase.from('tasks').select('*').limit(1);
  console.log("Tasks columns:", data && data[0] ? Object.keys(data[0]) : "No data");
}
test();
