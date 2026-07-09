import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://ukulozcniyiaheuvnptl.supabase.co', 'sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV');
async function run() {
  const { error: err } = await supabase.from('tasks').insert([{ 
    id: 'test-id-1', 
    title: 'test title', 
    type: 'Task',
    note: JSON.stringify({ _isMeta: true, text: 'some note', progress: 50, task_number: 10 })
  }]);
  console.log('Insert error:', err);
  if (!err) {
    const { data } = await supabase.from('tasks').select('*').eq('id', 'test-id-1');
    console.log('Inserted data:', data);
    
    // clean up
    await supabase.from('tasks').delete().eq('id', 'test-id-1');
  }
}
run();
