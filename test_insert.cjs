const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ukulozcniyiaheuvnptl.supabase.co', 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV');
async function run() {
  const { data, error } = await supabase.from('leads').insert([{ id: 'TEST-1', name: 'Test' }]);
  console.log("Insert Error:", error);
  const { data: fetch, error: fetchErr } = await supabase.from('leads').select('*');
  console.log("Fetch Data:", fetch, "Fetch Error:", fetchErr);
}
run();
