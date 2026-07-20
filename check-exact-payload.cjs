const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const env = fs.readFileSync('.env', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim();
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const form = {
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

    company_id: "",
    vendor_id: "",

    policy_number: "",
    issue_date: new Date().toISOString().split('T')[0],
    expiry_date: "",
    vehicle_number: "",
    vehicle_model: "",
    seating_capacity: "",
    chassis_number: "",
    engine_number: "",
    fuel_type: "Petrol",
    registration_date: "",
    policy_type: "Comprehensive",
    idv_value: "",
    previous_policy_number: "",
    previous_insurer: "",
    ncb_percentage: "",

    od_premium: 0,
    tp_premium: 0,
    net_premium: 0,
    gst: 0,
    total_premium: 0,

    customer_paid: 0,
    vendor_paid: 0,
    profit: 0,
    payment_date: "",
    payment_mode: "Bank Transfer",
    transaction_reference: "",
    payment_status: "Pending",
    notes: ""
  };

  const payload = { ...form };
  const fieldsToScrub = [
      "customer_id", "company_id", "vendor_id", 
      "registration_date", "payment_date", "issue_date", "expiry_date",
      "seating_capacity", "idv_value", "ncb_percentage",
      "od_premium", "tp_premium", "net_premium", "gst", "total_premium", 
      "customer_paid", "vendor_paid", "profit"
  ];
  
  fieldsToScrub.forEach(field => {
    if (payload[field] === "") {
      payload[field] = null;
    }
  });

  if (payload.company_id === "other") {
    payload.company_id = null;
    if (payload.custom_company) {
      payload.notes = (payload.notes ? payload.notes + "\n" : "") + `Custom Company: ${payload.custom_company}`;
    }
  }
  
  if (payload.vendor_id === "other") {
    payload.vendor_id = null;
    if (payload.custom_vendor) {
      payload.notes = (payload.notes ? payload.notes + "\n" : "") + `Custom Vendor: ${payload.custom_vendor}`;
    }
  }

  delete payload.custom_company;
  delete payload.custom_vendor;
  delete payload.gst_percentage;

  // Add the metadata that crm.insurance.tsx adds
  const newPolicy = {
    ...payload,
    id: "f3a2d3c9-82cf-4b95-a226-9d3cc1f54cf2", // dummy UUID
    created_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from('insurance_policies').insert(newPolicy);
  console.log("Error:", error);
}

check();
