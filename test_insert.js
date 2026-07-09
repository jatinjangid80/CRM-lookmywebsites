import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ukulozcniyiaheuvnptl.supabase.co', 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV');
async function run() {
  const { error: err } = await supabase.from('tasks').insert([{ id: 'test-id', title: 'test', type: 'test' }]);
  console.log('Insert error:', err);
}
run();
