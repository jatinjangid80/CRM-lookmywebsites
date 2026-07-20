const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const env = fs.readFileSync('.env', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim();
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.rpc('get_table_schema', { table_name: 'insurance_policies' });
  if (error) {
    console.log("No rpc. Let's just insert an empty object and see the exact error.");
    const { error: insertError } = await supabase.from('insurance_policies').insert({ customer_name: null });
    console.log("Insert error details:", JSON.stringify(insertError, null, 2));
  }
}
check();
