const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ukulozcniyiaheuvnptl.supabase.co', 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV');
async function run() {
  const { data: vData } = await supabase.from('vendors').select('id').limit(1);
  if (vData && vData.length > 0) {
    const id = vData[0].id;
    console.log('Testing delete for vendor id:', id);
    // Don't actually delete to be safe, just see if we CAN fetch them
  } else {
    console.log('No vendors found.');
  }
}
run();
