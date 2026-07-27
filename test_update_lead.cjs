const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ukulozcniyiaheuvnptl.supabase.co', 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV');
async function run() {
  const { data, error } = await supabase.from('leads').select('*').limit(1);
  console.log('Select:', data, error);
  if (data && data.length > 0) {
    const lead = data[0];
    const { data: upData, error: upError } = await supabase.from('leads').update({ status: 'Quotation Sent' }).eq('id', lead.id).select();
    console.log('Update:', upData, upError);
  }
}
run();
