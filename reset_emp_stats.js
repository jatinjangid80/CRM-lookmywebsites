import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

async function resetStats() {
  const { data: employees, error: fetchError } = await supabase.from('employees').select('id, name, leads, closedDeals, revenue')
  if (fetchError) {
    console.error("Fetch Error:", fetchError)
    return
  }
  
  console.log("Current stats:", employees)

  for (const emp of employees) {
    if (emp.leads > 0 || emp.closedDeals > 0 || emp.revenue > 0) {
      console.log(`Resetting stats for ${emp.name} (${emp.id})`)
      const { error: updateError } = await supabase
        .from('employees')
        .update({ leads: 0, closedDeals: 0, revenue: 0 })
        .eq('id', emp.id)
      
      if (updateError) {
         console.error(`Error updating ${emp.name}:`, updateError)
      }
    }
  }
  console.log("Done resetting stats.")
}

resetStats()
