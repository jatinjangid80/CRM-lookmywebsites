const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ukulozcniyiaheuvnptl.supabase.co', 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV');
async function run() {
  const { data, error } = await supabase.rpc('get_rls_policies'); // assuming we might not have it, let's just do a dummy insert/delete to test RLS
  
  // Test deleting a dummy lead to see if RLS blocks it. Or just inserting and deleting a vendor.
  console.log("Testing RLS on vendors...");
  const dummyId = 'V-TEST-' + Math.floor(Math.random()*1000);
  const { error: insErr } = await supabase.from('vendors').insert({ id: dummyId, name: 'Test Vendor' });
  if (insErr) {
    console.error("Insert blocked:", insErr.message);
  } else {
    console.log("Insert allowed.");
    const { error: delErr } = await supabase.from('vendors').delete().eq('id', dummyId);
    if (delErr) {
      console.error("Delete blocked:", delErr.message);
    } else {
      console.log("Delete allowed.");
    }
  }
}
run();
