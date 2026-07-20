const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const env = fs.readFileSync('.env', 'utf-8').split('\n').reduce((acc, line) => {
  const [key, ...val] = line.split('=');
  if (key && val.length) acc[key.trim()] = val.join('=').trim();
  return acc;
}, {});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function check() {
  const { data, error } = await supabase.from('insurance_vendors').insert({ 
    id: "d07172fa-7b95-4fb5-901b-c6b2df401825",
    name: "Test",
    contact_person: "Test",
    mobile: "123",
    email: "test@test.com",
    office_city: "city",
    website: "web"
  });
  console.log(error);
}

check();
