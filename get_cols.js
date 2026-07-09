import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ukulozcniyiaheuvnptl.supabase.co', 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV');
async function run() {
  const { data, error } = await supabase.from('tasks').select('*').limit(1);
  if (data && data.length > 0) {
    console.log(Object.keys(data[0]));
  } else {
    // try inserting a dummy to see error
    const { error: err } = await supabase.from('tasks').insert([{ title: 'test', type: 'test' }]);
    console.log('Insert error:', err);
  }
}
run();
