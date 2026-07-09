import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ukulozcniyiaheuvnptl.supabase.co', 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV');
async function run() {
  const { data, error } = await supabase.rpc('get_schema_for_table', { table_name: 'tasks' });
  console.log('RPC Error:', error); // Probably doesn't exist
  // We can just try to insert a dummy row with an ID to see what column fails
}
run();
