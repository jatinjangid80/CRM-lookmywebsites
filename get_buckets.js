import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://ukulozcniyiaheuvnptl.supabase.co";
const supabaseAnonKey = "sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkBuckets() {
  const { data, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error(error);
  } else {
    console.log("Buckets:", data.map(b => b.name));
  }
}
checkBuckets();
