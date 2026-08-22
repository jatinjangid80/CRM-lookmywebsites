import re

with open("src/routes/crm.taxi-booking.tsx", "r") as f:
    content = f.read()

old_table_header = r"""            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Travel Date</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead className="w-\[80px\]"></TableHead>
              </TableRow>
            </TableHeader>"""

new_table_header = """            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Travel Date</TableHead>
                <TableHead>Purchase</TableHead>
                <TableHead>Selling</TableHead>
                <TableHead>Profit</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>"""

old_table_body = r"""                  <TableRow key={b\.id}>
                    <TableCell className="font-medium">{b\.customer_name}</TableCell>
                    <TableCell>{b\.route}</TableCell>
                    <TableCell>{b\.travel_date}</TableCell>
                    <TableCell>₹ {b\.selling_price || 0}</TableCell>
                    <TableCell>"""

new_table_body = """                  <TableRow key={b.id}>
                    <TableCell>{b.supplier || "-"}</TableCell>
                    <TableCell className="font-medium">{b.customer_name}</TableCell>
                    <TableCell>{b.mobile_number || "-"}</TableCell>
                    <TableCell>{b.vehicle_type || "-"} {b.vehicle_no ? `(${b.vehicle_no})` : ""}</TableCell>
                    <TableCell>{b.route || b.from_location ? `${b.from_location} to ${b.to_location}` : "-"}</TableCell>
                    <TableCell>{b.travel_date}</TableCell>
                    <TableCell>₹ {b.purchase_price || 0}</TableCell>
                    <TableCell className="font-semibold text-primary">₹ {b.selling_price || 0}</TableCell>
                    <TableCell className={b.profit >= 0 ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
                      ₹ {b.profit || 0}
                    </TableCell>
                    <TableCell>"""

content = re.sub(old_table_header, new_table_header, content, flags=re.MULTILINE)
content = re.sub(old_table_body, new_table_body, content, flags=re.MULTILINE)

with open("src/routes/crm.taxi-booking.tsx", "w") as f:
    f.write(content)
print("Updated successfully")
