import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ukulozcniyiaheuvnptl.supabase.co",
  "sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV"
);

async function run() {
  const { data, error } = await supabase.from('employees').select('*').limit(1);
  console.log("Error:", error);
  console.log("Data keys:", Object.keys(data[0]));
  console.log("Data profile_details:", data[0].profile_details);
}

run();
