const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ukulozcniyiaheuvnptl.supabase.co', 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV');
async function run() {
  const { data: v1 } = await supabase.from('vendors').select('count');
  const { data: v2 } = await supabase.from('insurance_vendors').select('count');
  console.log('vendors count:', v1);
  console.log('insurance_vendors count:', v2);
}
run();
