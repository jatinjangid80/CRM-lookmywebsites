import re

with open("src/routes/crm.taxi-booking.tsx", "r") as f:
    content = f.read()

# 1. Add imports
content = content.replace(
    'from "lucide-react";',
    ', ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";'
)
# Ensure we don't have duplicated } from "lucide-react"
content = content.replace("} , ArrowUp", ", ArrowUp")

# 2. Add state and logic
sort_logic = """  const [sortField, setSortField] = useState<"supplier" | "customer_name" | "mobile_number" | "vehicle_type" | "route" | "travel_date" | "purchase_price" | "selling_price">("travel_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (field: any) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredBookings = [...bookings].sort((a, b) => {
    let cmp = 0;
    if (sortField === "travel_date") cmp = new Date(a.travel_date || 0).getTime() - new Date(b.travel_date || 0).getTime();
    else if (sortField === "supplier") cmp = (a.supplier || "").localeCompare(b.supplier || "");
    else if (sortField === "customer_name") cmp = (a.customer_name || "").localeCompare(b.customer_name || "");
    else if (sortField === "mobile_number") cmp = (a.mobile_number || "").localeCompare(b.mobile_number || "");
    else if (sortField === "vehicle_type") cmp = (a.vehicle_type || "").localeCompare(b.vehicle_type || "");
    else if (sortField === "route") cmp = (a.route || "").localeCompare(b.route || "");
    else if (sortField === "purchase_price") cmp = (a.purchase_price || 0) - (b.purchase_price || 0);
    else if (sortField === "selling_price") cmp = (a.selling_price || 0) - (b.selling_price || 0);
    return sortOrder === "asc" ? cmp : -cmp;
  });"""

content = content.replace("  const filteredBookings = bookings;", sort_logic)

# 3. Replace TableHeads
table_heads = """              <TableRow>
                <TableHead className="cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort("supplier")}>
                  <div className="flex items-center gap-1">Supplier {sortField === "supplier" ? (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort("customer_name")}>
                  <div className="flex items-center gap-1">Customer {sortField === "customer_name" ? (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort("mobile_number")}>
                  <div className="flex items-center gap-1">Mobile {sortField === "mobile_number" ? (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort("vehicle_type")}>
                  <div className="flex items-center gap-1">Vehicle {sortField === "vehicle_type" ? (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort("route")}>
                  <div className="flex items-center gap-1">Route {sortField === "route" ? (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort("travel_date")}>
                  <div className="flex items-center gap-1">Travel Date {sortField === "travel_date" ? (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort("purchase_price")}>
                  <div className="flex items-center gap-1">Purchase {sortField === "purchase_price" ? (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort("selling_price")}>
                  <div className="flex items-center gap-1">Selling {sortField === "selling_price" ? (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}</div>
                </TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>"""

old_table_heads = """              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Mobile</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Travel Date</TableHead>
                <TableHead>Purchase</TableHead>
                <TableHead>Selling</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>"""

content = content.replace(old_table_heads, table_heads)

with open("src/routes/crm.taxi-booking.tsx", "w") as f:
    f.write(content)

print("Sorting added.")
