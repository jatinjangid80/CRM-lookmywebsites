import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function fix() {
  const { data: bookings } = await supabase.from('bookings').select('*');
  const { data: transactions } = await supabase.from('transactions').select('*');
  
  for (const b of bookings) {
    const txs = transactions.filter(tx => tx.type === 'Receipt' && tx.invoiceId && (tx.invoiceId === b.id || tx.invoiceId === b.saleInvoiceNo));
    if (txs.length > 0) {
      const txPaid = txs.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
      
      // If we are overriding b.paid entirely, we might lose early payments made before the Accounts module.
      // So we assume the max of (txPaid) and what's in the DB? Wait!
      // If the DB has 3,00,000 but txPaid is 0?
      console.log(`Booking ${b.id}: dbPaid=${b.paid}, txPaid=${txPaid}, total=${b.amount}`);
    }
  }
}
fix();
