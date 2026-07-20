const { createClient } = require('@supabase/supabase-js');

const env = require('fs').readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => { 
  const [k, v] = line.split('='); 
  if(k) acc[k] = v; 
  return acc; 
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

const DEFAULT_VENDORS = [
  { name: "Pravindra" },
  { name: "Ginar" },
  { name: "Sunshine" },
  { name: "Starline" },
  { name: "Rightsure" },
  { name: "Silver Square" },
  { name: "Manvendra" },
  { name: "Care Code" },
  { name: "Techwheel Dealer" },
  { name: "Maruti Sanga" },
];

const DEFAULT_COMPANIES = [
  { name: "Tata AIG" },
  { name: "Go Digit" },
  { name: "ICICI Lombard" },
  { name: "United India Insurance" },
  { name: "Bajaj Allianz" },
  { name: "Liberty General Insurance" },
  { name: "Future Generali" },
  { name: "Reliance General Insurance" },
  { name: "Universal Sompo" },
  { name: "IFFCO Tokio" },
  { name: "SBI General Insurance" },
  { name: "Care Health Insurance" },
  { name: "LIC" },
  { name: "New India Assurance" },
  { name: "Raheja QBE General Insurance" },
  { name: "Shriram General Insurance" },
];

async function seed() {
  console.log("Seeding vendors...");
  for (const v of DEFAULT_VENDORS) {
    const { data: existing, error: e1 } = await supabase.from('insurance_vendors').select('*').eq('name', v.name);
    if (!existing || existing.length === 0) {
      const { error } = await supabase.from('insurance_vendors').insert({ name: v.name });
      if (error) console.error("Error inserting vendor", v.name, error);
      else console.log("Inserted vendor:", v.name);
    }
  }

  console.log("Seeding companies...");
  for (const c of DEFAULT_COMPANIES) {
    const { data: existing } = await supabase.from('insurance_companies').select('*').eq('name', c.name);
    if (!existing || existing.length === 0) {
      const { error } = await supabase.from('insurance_companies').insert({ name: c.name });
      if (error) console.error("Error inserting company", c.name, error);
      else console.log("Inserted company:", c.name);
    }
  }
  console.log("Done!");
}

seed().catch(console.error);
