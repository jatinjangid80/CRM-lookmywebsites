const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) acc[match[1]] = match[2];
  return acc;
}, {});
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.rpc('get_schema_info', { table_name: 'leads' });
  // If rpc doesn't exist, just get a single row
  const { data: d2 } = await supabase.from('leads').select('*');
  d2.forEach(row => {
    if (typeof row.id !== 'string') {
       console.log('ID IS NOT A STRING', row.id, typeof row.id);
    }
    if (!row.id) {
       console.log('ID IS FALSY', row);
    }
  });
  console.log('Checked', d2.length, 'rows');
}
test();
