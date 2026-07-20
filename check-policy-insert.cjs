const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const env = fs.readFileSync('.env', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim();
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function check() {
    const payload = {
    school_name: "",
    reference_name: "",
    customer_name: "jatin jangid",
    mobile_number: "7340098982",
    alternate_mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    customer_id: null,
    company_id: null,
    vendor_id: null,
    policy_number: "",
    issue_date: "2026-07-20",
    expiry_date: null,
    vehicle_number: "",
    vehicle_model: "",
    seating_capacity: null,
    chassis_number: "",
    engine_number: "",
    fuel_type: "Petrol",
    registration_date: null,
    policy_type: "Comprehensive",
    idv_value: null,
    previous_policy_number: "",
    previous_insurer: "",
    ncb_percentage: null,
    od_premium: 0,
    tp_premium: 0,
    net_premium: 0,
    gst: 0,
    total_premium: 0,
    customer_paid: 0,
    vendor_paid: 0,
    profit: 0,
    payment_date: null,
    payment_mode: "Bank Transfer",
    transaction_reference: "",
    payment_status: "Pending",
    notes: "",
    id: "a3a2d3c9-82cf-4b95-a226-9d3cc1f54cf2",
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from('insurance_policies').insert(payload);
  console.log("Error:", error);
}

check();
