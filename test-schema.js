import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ukulozcniyiaheuvnptl.supabase.co', 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV');
async function run() {
  const { data, error } = await supabase.rpc('get_table_columns', { table_name: 'tasks' });
  console.log("RPC:", data, error);
}
run();
