import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ukulozcniyiaheuvnptl.supabase.co";
const supabaseKey = "sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV";
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: insertData, error: insertError } = await supabase
    .from("tasks")
    .insert([
      {
        id: "TEST-1235",
        title: "Test Task 2",
        type: "Other",
        priority: "Low",
        status: "Pending",
        assignee: "System",
        dueDate: "2026-06-27",
      },
    ])
    .select();

  if (insertError) {
    console.error("INSERT ERROR:", insertError);
  } else {
    console.log("INSERT SUCCESS:", insertData);
    await supabase.from("tasks").delete().eq("id", "TEST-1235");
  }
}
test();
