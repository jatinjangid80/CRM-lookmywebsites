const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const env = fs.readFileSync('.env', 'utf-8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const VITE_SUPABASE_ANON_KEY = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

async function addColumn() {
  const { data, error } = await supabase.rpc('execute_sql', {
    query: 'ALTER TABLE public.attendance ADD COLUMN IF NOT EXISTS remarks TEXT;'
  });
  console.log("RPC Error:", error);
}

addColumn();
