const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
async function test() {
  const { data: expenses, error: err1 } = await supabase.from('expenses').select('*').limit(1);
  console.log('expenses:', err1 ? err1.message : 'OK');
  
  const { data: followups, error: err2 } = await supabase.from('payment_followups').select('*').limit(1);
  console.log('payment_followups:', err2 ? err2.message : 'OK');
  
  const { data: transactions, error: err3 } = await supabase.from('transactions').select('*').limit(1);
  console.log('transactions:', err3 ? err3.message : 'OK');
  
  const { data: reqs, error: err4 } = await supabase.from('payment_requests').select('*').limit(1);
  console.log('payment_requests:', err4 ? err4.message : 'OK');
}
test();
