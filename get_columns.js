import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ukulozcniyiaheuvnptl.supabase.co', 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV');
async function run() {
  const { data, error } = await supabase.from('tasks').select('id').limit(1);
  if (error) console.log("Error:", error);
  else console.log("Success:", data);
}
run();
