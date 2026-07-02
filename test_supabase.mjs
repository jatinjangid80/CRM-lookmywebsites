import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ukulozcniyiaheuvnptl.supabase.co",
  "sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV"
);

async function run() {
  const { data, error } = await supabase.from('employees').update({ username: 'testuser', password: 'testpassword' }).eq('id', 'LMH-05');
  console.log("Error:", error);
  console.log("Data:", data);
}

run();
