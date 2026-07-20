const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const env = fs.readFileSync('.env', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim();
  return acc;
}, {});
const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const dummyPolicy = {
    school_name: "",
    reference_name: "",
    customer_name: "Test Customer",
    mobile_number: "1234567890",
    alternate_mobile: "",
    email: "",
    address: "",
    city: "",
    state: "",
    customer_id: null,
    company_id: null,
    vendor_id: null,
    policy_number: "123",
    issue_date: "2026-07-20",
    expiry_date: "2027-07-20",
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
    notes: ""
};

supabase.from('insurance_policies').insert([dummyPolicy]).then(res => {
    console.log('Insert result:', res.error ? res.error : 'Success!');
});
