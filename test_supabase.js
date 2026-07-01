import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ukulozcniyiaheuvnptl.supabase.co";
const supabaseKey = "sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV";
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  console.log("Testing Supabase connection...");

  const { data: readData, error: readError } = await supabase.from("tasks").select("*").limit(1);
  if (readError) {
    console.error("READ ERROR:", readError);
  } else {
    console.log("READ SUCCESS:", readData);
  }

  const { data: insertData, error: insertError } = await supabase
    .from("tasks")
    .insert([
      {
        id: "TEST-1234",
        title: "Test Task",
        type: "Other",
        priority: "Low",
        status: "Pending",
        assignee: "System",
      },
    ])
    .select();

  if (insertError) {
    console.error("INSERT ERROR:", insertError);
  } else {
    console.log("INSERT SUCCESS:", insertData);

    // clean up
    await supabase.from("tasks").delete().eq("id", "TEST-1234");
  }
}

test();
