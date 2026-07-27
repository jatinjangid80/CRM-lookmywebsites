const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const VITE_SUPABASE_ANON_KEY = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
async function run() {
  const newPolicy = {
    customer_name: "Test Customer",
    mobile_number: "1234567890",
    policy_number: "POL123",
    status: "Active"
  };
  const { data, error } = await supabase.from('insurance_policies').insert([newPolicy]).select();
  console.log('Insert Error:', error);
  console.log('Inserted Data:', data);
}
run();
