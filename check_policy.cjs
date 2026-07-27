const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ukulozcniyiaheuvnptl.supabase.co', 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV');
async function run() {
  const { data, error } = await supabase.from('vendors').select('id').limit(1);
  console.log('Select:', data, error);
  // We can't really read pg_policies without a service key, but we can see if select works.
}
run();
