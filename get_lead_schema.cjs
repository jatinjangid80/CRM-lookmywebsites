const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const VITE_SUPABASE_ANON_KEY = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data: leads, error: e1 } = await supabase.from('leads').select('*').limit(1);
  console.log("Leads columns:", leads ? Object.keys(leads[0] || {}) : e1);
  const { data: insLeads, error: e2 } = await supabase.from('insurance_leads').select('*').limit(1);
  console.log("Insurance Leads columns:", insLeads ? Object.keys(insLeads[0] || {}) : e2);
}
run();
