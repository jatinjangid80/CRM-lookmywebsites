with open('src/routes/crm.taxi-booking.tsx', 'r') as f:
    content = f.read()

# Replace the filter
old_str = '{vendors.filter((v: any) => v.service_type === "Taxi").map((v: any) => ('
new_str = '{vendors.map((v: any) => ('

if old_str in content:
    content = content.replace(old_str, new_str)
    with open('src/routes/crm.taxi-booking.tsx', 'w') as f:
        f.write(content)
    print("Fixed!")
else:
    print("String not found!")
