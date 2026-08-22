import re

with open("src/routes/crm.taxi-booking.tsx", "r") as f:
    content = f.read()

# Ensure imports
if "MapPin" not in content:
    content = content.replace(', ArrowUpDown } from "lucide-react";', ', ArrowUpDown, MapPin, ArrowRight } from "lucide-react";')
else:
    # Just to be safe, add ArrowRight if MapPin exists but not ArrowRight
    if "ArrowRight" not in content:
        content = content.replace("MapPin,", "MapPin, ArrowRight,")


table_content = """        <CardContent>
          <div className="hidden md:block">
            <Table>"""

content = content.replace("<CardContent>\n          <Table>", table_content)

dropdown_logic = """                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingBooking(b)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(b.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
          <div className="grid gap-4 md:hidden mt-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No bookings found.</div>
            ) : (
              filteredBookings.map((b) => (
                <div key={b.id} className="rounded-[1.25rem] border border-[#E5E5E5] bg-[#FAF5F0]/50 p-4 shadow-sm relative">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-gray-900">{b.customer_name}</span>
                    <span className="text-yellow-300 font-black px-1">—</span>
                    <span className="text-sm font-medium text-gray-700">{b.vehicle_type || ""}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{b.from_location || ""}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>{b.to_location || ""}</span>
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingBooking(b)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(b.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>"""

# Find the place to inject
import re
pattern = r'                        <DropdownMenuContent align="end">.*?Delete\n                          </DropdownMenuItem>\n                        </DropdownMenuContent>\n                      </DropdownMenu>\n                    </TableCell>\n                  </TableRow>\n                \)\)\n              \)}\n            </TableBody>\n          </Table>'
content = re.sub(pattern, dropdown_logic, content, flags=re.DOTALL)

with open("src/routes/crm.taxi-booking.tsx", "w") as f:
    f.write(content)

print("Mobile view added.")
