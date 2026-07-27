const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const VITE_SUPABASE_ANON_KEY = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
async function run() {
  // First, find a lead ID
  const { data: leads, error: fetchError } = await supabase.from('leads').select('id').limit(1);
  if (fetchError || !leads.length) return console.log('No leads found', fetchError);
  const id = leads[0].id;
  
  const notes = [{ text: "this is a test note " + Date.now(), date: new Date().toISOString() }];
  const updates = { allNotes: notes };
  
  const { data: updateData, error: updateError } = await supabase.from('leads').update(updates).eq('id', id).select();
  console.log('Update Error:', updateError);
  console.log('Updated Data:', updateData[0].allNotes);
}
run();
