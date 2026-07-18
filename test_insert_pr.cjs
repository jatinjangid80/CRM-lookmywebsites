const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) acc[match[1]] = match[2];
  return acc;
}, {});
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const row = {
    id: 'PRQ-TEST-999',
    date: '2026-07-18',
    submittedBy: 'Test User',
    supplier: 'Test Vendor',
    clientName: 'Test Client',
    amount: 100,
    status: 'Pending',
    remarks: JSON.stringify({ _isMeta: true, text: '', entityType: 'Vendor', entityName: 'Test Vendor' })
  };
  const { data, error } = await supabase.from('payment_requests').insert([row]).select();
  console.log('Insert payment_requests:', error ? error : 'SUCCESS', data);

  // Also test expenses
  const expRow = {
    id: 'EXP-TEST-999',
    date: '2026-07-18',
    category: 'Food',
    amount: 50,
    paymentMode: 'Cash',
    reference: '',
    description: JSON.stringify({ _isMeta: true, text: '', createdBy: 'Test' }),
    status: 'Paid'
  };
  const { data: d2, error: e2 } = await supabase.from('expenses').insert([expRow]).select();
  console.log('Insert expenses:', e2 ? e2 : 'SUCCESS', d2);
}
test();
