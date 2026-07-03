import { createClient } from "@supabase/supabase-js";

const supabase = createClient("https://ukulozcniyiaheuvnptl.supabase.co", "sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV");

async function run() {
  console.log("Deleting all employees...");

  const { error } = await supabase.from("employees").delete().neq("id", "00000000-0000-0000-0000-000000000000"); // deletes all rows

  console.log("Done deleting. Error:", error);
}
run();
