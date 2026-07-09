import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
const supabase = createClient('https://ukulozcniyiaheuvnptl.supabase.co', 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV');
async function run() {
  const { data, error } = await supabase.from('tasks').insert([{ id: crypto.randomUUID(), title: 'test2', type: 'test' }]);
  console.log("Insert result:", data, error);
}
run();
