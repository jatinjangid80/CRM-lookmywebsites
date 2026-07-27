const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const VITE_SUPABASE_ANON_KEY = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
async function run() {
  const sql = fs.readFileSync('add_lead_number.sql', 'utf8');
  // Wait, we can't run raw SQL from supabase-js anon key!
  // We need to use postgres connection string, but we don't have it.
}
run();
