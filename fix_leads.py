import re

with open("src/routes/crm.insurance-leads.tsx", "r") as f:
    content = f.read()

# Replace dummy data in 'generateLead'
content = re.sub(
    r"function generateLead\(\) {.*?return {.*?};.*?}",
    """function generateLead() {
  const types = ["Car", "Bike", "Health", "Home", "Travel", "Commercial"];
  const companies = ["ICICI Lombard", "HDFC Ergo", "Bajaj Allianz", "Star Health"];
  const names = ["Rahul Sharma", "Amit Singh", "Priya Patel", "Vikram Rathore"];
  
  return {
    id: "LEAD-" + Math.floor(1000 + Math.random() * 9000),
    created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    customer_name: names[Math.floor(Math.random() * names.length)],
    mobile: "9" + Math.floor(100000000 + Math.random() * 900000000).toString(),
    email: "test@example.com",
    city: "Mumbai",
    status: LEAD_STATUSES[0],
    insurance_type: types[Math.floor(Math.random() * types.length)],
    insurance_company: companies[Math.floor(Math.random() * companies.length)],
    prev_policy_number: "POL" + Math.floor(100000 + Math.random() * 900000),
    expiry_date: new Date(Date.now() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
    sum_insured: "5,00,000",
    premium: Math.floor(5000 + Math.random() * 20000),
    idv: Math.floor(200000 + Math.random() * 500000),
    ncb: "20%",
    executive: "Manvendra",
    notes: ""
  };
}""",
    content,
    flags=re.DOTALL
)

# Fix empty lead state
content = re.sub(
    r"const \[newLead, setNewLead\] = useState<Partial<Lead>>\({.*?}\);",
    """const [newLead, setNewLead] = useState<Partial<Lead>>({
    customer_name: "",
    mobile: "",
    email: "",
    city: "",
    status: "New Lead",
    insurance_type: "",
    insurance_company: "",
    prev_policy_number: "",
    expiry_date: "",
    sum_insured: "",
    premium: 0,
    idv: 0,
    ncb: "",
    executive: "",
    notes: ""
  });""",
    content,
    flags=re.DOTALL
)

with open("src/routes/crm.insurance-leads.tsx", "w") as f:
    f.write(content)
