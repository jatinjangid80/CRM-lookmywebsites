import re

with open("src/routes/crm.taxi-booking.tsx", "r") as f:
    content = f.read()

# Fix table cell logic
old_table_cell = "<TableCell>{b.route || b.from_location ? `${b.from_location} to ${b.to_location}` : \"-\"}</TableCell>"
new_table_cell = "<TableCell>{b.from_location && b.to_location ? `${b.from_location} to ${b.to_location}` : b.route || b.from_location || \"-\"}</TableCell>"
content = content.replace(old_table_cell, new_table_cell)

# Fix mobile view logic
old_mobile_view = """                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{b.from_location || ""}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>{b.to_location || ""}</span>
                  </div>"""

new_mobile_view = """                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {b.from_location && b.to_location ? (
                      <>
                        <span className="truncate">{b.from_location}</span>
                        <ArrowRight className="h-3 w-3 shrink-0" />
                        <span className="truncate">{b.to_location}</span>
                      </>
                    ) : (
                      <span className="truncate">{b.route || b.from_location || "No route specified"}</span>
                    )}
                  </div>"""

content = content.replace(old_mobile_view, new_mobile_view)

with open("src/routes/crm.taxi-booking.tsx", "w") as f:
    f.write(content)

print("Route display fixed.")
