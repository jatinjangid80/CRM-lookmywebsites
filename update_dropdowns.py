import re

with open("src/routes/crm.taxi-booking.tsx", "r") as f:
    content = f.read()

# Add missing icons to import
imports = "User, Map, Navigation, Paperclip, FileText, "
if "User" not in content[:1000]:
    content = content.replace('MapPin,', 'MapPin, User, Map, Navigation, Paperclip, ')

old_dropdown_1 = """                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingBooking(b)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(b.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>"""

new_dropdown_1 = """                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingBooking(b)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            Driver details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Map className="mr-2 h-4 w-4" />
                            Other stations
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Navigation className="mr-2 h-4 w-4" />
                            Local stations
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Paperclip className="mr-2 h-4 w-4" />
                            Attachments
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="mr-2 h-4 w-4" />
                            Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(b.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>"""

content = content.replace(old_dropdown_1, new_dropdown_1)

# Now check the other dropdown (it might have slightly different indentation)
old_dropdown_2 = """                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingBooking(b)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(b.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>"""

new_dropdown_2 = """                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingBooking(b)}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <User className="mr-2 h-4 w-4" />
                          Driver details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Map className="mr-2 h-4 w-4" />
                          Other stations
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Navigation className="mr-2 h-4 w-4" />
                          Local stations
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Paperclip className="mr-2 h-4 w-4" />
                          Attachments
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="mr-2 h-4 w-4" />
                          Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(b.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>"""

content = content.replace(old_dropdown_2, new_dropdown_2)

with open("src/routes/crm.taxi-booking.tsx", "w") as f:
    f.write(content)

print("Dropdown options added.")
