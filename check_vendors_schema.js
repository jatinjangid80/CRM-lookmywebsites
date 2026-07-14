import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ukulozcniyiaheuvnptl.supabase.co', 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV');
async function run() {
  const { data, error } = await supabase.from('vendors').select('*').limit(1);
  if (data && data.length > 0) {
     console.log('Columns:', Object.keys(data[0]));
  }
}
run();
