const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ukulozcniyiaheuvnptl.supabase.co', 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV');
async function run() {
  const dummyRow = {
    id: "TEST-123",
    name: "Test Name",
    phone: "1234567890",
    service: "General Insurance",
    status: "New Lead",
  };
  const { data, error } = await supabase.from('insurance_leads').insert([dummyRow]).select();
  console.log('Insert error:', error);
  console.log('Insert data:', data);
}
run();
