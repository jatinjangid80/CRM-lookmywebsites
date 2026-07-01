require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function clearBookings() {
  const { data, error } = await supabase.from("bookings").delete().neq("id", "none");

  if (error) {
    console.error("Error clearing bookings:", error);
  } else {
    console.log("Cleared all bookings. New ones will be seeded on refresh.");
  }
}

clearBookings();
