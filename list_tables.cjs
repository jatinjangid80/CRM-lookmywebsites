const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://ukulozcniyiaheuvnptl.supabase.co', 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV');

async function run() {
  const { data, error } = await supabase.rpc('get_tables'); // Or try to query pg_class, but we can't do that easily via API unless exposed.
  // Instead we can just try querying known tables or ask the REST API for OpenAPI spec
  const res = await fetch('https://ukulozcniyiaheuvnptl.supabase.co/rest/v1/', {
    headers: { apikey: 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV' }
  });
  const json = await res.json();
  const tables = Object.keys(json.paths).map(p => p.split('/')[1]);
  console.log('Tables:', [...new Set(tables)].join(', '));
}
run();
