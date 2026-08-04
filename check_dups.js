import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function run() {
  const { data } = await supabase.from('quotations').select('id');
  console.log("Quotations:", data.length);
  const counts = {};
  for(let row of data) {
    counts[row.id] = (counts[row.id] || 0) + 1;
  }
  for(let id in counts) {
    if(counts[id] > 1) {
      console.log("Duplicate:", id, counts[id]);
    }
  }
}
run();
