import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://ukulozcniyiaheuvnptl.supabase.co",
  "sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV"
);

async function run() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  console.log("users table:", error || "exists");
  const { data: d2, error: e2 } = await supabase.from('credentials').select('*').limit(1);
  console.log("credentials table:", e2 || "exists");
}

run();
