import { createClient } from "@supabase/supabase-js";
import { leads } from "./src/lib/mock-data";
import { INITIAL_EMPLOYEES } from "./extract-employees";
import { INITIAL_EMPLOYEE_DETAILS } from "./src/lib/employee-profile-defaults";

const supabase = createClient("https://ukulozcniyiaheuvnptl.supabase.co", "sb_publishable_1NH9AknLm-Fz9MIpcpPunw_nLsT9crV");

async function run() {
  console.log("Reseeding employees...");

  const employeesToInsert = INITIAL_EMPLOYEES.map(emp => {
    // Add the details for Supabase metadata storage
    const customFields: any = { profile_details: INITIAL_EMPLOYEE_DETAILS[emp.id] };
    const newRow = { ...emp };
    delete newRow.profile_details; // will store inside description
    
    // Convert meta-fields into the "description" column for useSupabaseTable JSON blob support
    const existingDesc = newRow.description || "";
    newRow.description = JSON.stringify({ _isMeta: true, text: existingDesc, ...customFields });

    return newRow;
  });

  const { error: empError } = await supabase.from("employees").upsert(employeesToInsert);
  console.log("Done inserting employees. Error:", empError);
  
}
run();
