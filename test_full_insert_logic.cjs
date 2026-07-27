const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const VITE_SUPABASE_URL = env.match(/VITE_SUPABASE_URL=(.*)/)[1];
const VITE_SUPABASE_ANON_KEY = env.match(/VITE_SUPABASE_ANON_KEY=(.*)/)[1];
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY);
const crypto = require('crypto');

async function run() {
  const updatedData = {
    client_company: "Acme",
    customer_name: "Test Frontend Save",
    mobile_number: "9998887776",
    policy_number: "P-12345",
    gst_percentage: 18,
    status: "Active",
    RC_copy: "some_file.png"
  };

  const validColumns = [
    'id', 'school_name', 'reference_name', 'customer_name', 'mobile_number', 'alternate_mobile', 
    'email', 'address', 'city', 'state', 'customer_id', 'company_id', 'vendor_id', 'policy_number', 
    'issue_date', 'expiry_date', 'vehicle_number', 'vehicle_model', 'seating_capacity', 'chassis_number', 
    'engine_number', 'fuel_type', 'registration_date', 'policy_type', 'idv_value', 'previous_policy_number', 
    'previous_insurer', 'ncb_percentage', 'od_premium', 'tp_premium', 'net_premium', 'gst', 'total_premium', 
    'customer_paid', 'vendor_paid', 'profit', 'payment_date', 'payment_mode', 'transaction_reference', 
    'payment_status', 'notes', 'status', 'created_at', 'paid_by', 'amount_paid'
  ];

  const dbPayload = {};
  const metaObj = {};
  let hasMeta = false;

  Object.keys(updatedData).forEach(key => {
    if (validColumns.includes(key)) {
      dbPayload[key] = updatedData[key];
    } else {
      metaObj[key] = updatedData[key];
      hasMeta = true;
    }
  });

  if (hasMeta) {
    const currentNotes = dbPayload.notes || "";
    dbPayload.notes = JSON.stringify({ _isMeta: true, text: currentNotes, ...metaObj });
  }

  dbPayload.id = crypto.randomUUID();
  dbPayload.created_at = new Date().toISOString();
  
  const { data, error } = await supabase.from('insurance_policies').insert([dbPayload]).select();
  console.log('Insert Error:', error);
  console.log('Inserted Data:', data);
}
run();
