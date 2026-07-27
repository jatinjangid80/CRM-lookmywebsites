const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const VITE_SUPABASE_ANON_KEY = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data, error } = await supabase.from('leads').update({ notes: "test note", noteDate: new Date().toISOString(), allNotes: [{ text: "test note", date: new Date().toISOString() }] }).eq('id', 'some-id');
  console.log('Update Error:', error);
}
run();
