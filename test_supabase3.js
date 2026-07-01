import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ukulozcniyiaheuvnptl.supabase.co";
const supabaseKey = "sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV";
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const tables = [
    "employees",
    "tasks",
    "leads",
    "customers",
    "packages",
    "bookings",
    "visa_apps",
    "vendors",
  ];
  for (const table of tables) {
    const { data } = await supabase.from(table).select("*").limit(1);
    if (data && data.length > 0) {
      console.log(`Table ${table} columns:`, Object.keys(data[0]));
    } else {
      console.log(`Table ${table} is empty. Error?`, data);
    }
  }
}
test();
