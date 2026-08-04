import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL as string, process.env.VITE_SUPABASE_ANON_KEY as string);
async function run() {
  const { data } = await supabase.from('quotations').select('id');
  if(!data) return;
  console.log("Quotations:", data.length);
  const counts: Record<string, number> = {};
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
