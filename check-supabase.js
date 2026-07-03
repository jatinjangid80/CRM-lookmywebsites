import fs from 'fs';
import { createClient } from '@supabase/supabase-js';

const env = fs.readFileSync('.env', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key) acc[key] = val.join('=');
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data, error } = await supabase.from('vendors').select('*').limit(1);
  if (error) {
    console.error('Error fetching vendors table:', error.message);
  } else {
    console.log('Vendors table exists. Success!');
  }
}
test();
