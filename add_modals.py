import re

with open("src/routes/crm.taxi-booking.tsx", "r") as f:
    content = f.read()

# Add state
if "const [activeModal," not in content:
    state_injection = """  const [activeModal, setActiveModal] = useState<"driver_details" | "other_stations" | "local_stations" | "attachments" | "details" | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);"""
    
    content = content.replace('const [searchQuery, setSearchQuery] = useState("");', 'const [searchQuery, setSearchQuery] = useState("");\n' + state_injection)

# Add onclicks to Dropdown 1 (Mobile)
old_items_1 = """                          <DropdownMenuItem>
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
                          </DropdownMenuItem>"""

new_items_1 = """                          <DropdownMenuItem onClick={() => { setSelectedBooking(b); setActiveModal("driver_details"); }}>
                            <User className="mr-2 h-4 w-4" />
                            Driver details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedBooking(b); setActiveModal("other_stations"); }}>
                            <Map className="mr-2 h-4 w-4" />
                            Other stations
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedBooking(b); setActiveModal("local_stations"); }}>
                            <Navigation className="mr-2 h-4 w-4" />
                            Local stations
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedBooking(b); setActiveModal("attachments"); }}>
                            <Paperclip className="mr-2 h-4 w-4" />
                            Attachments
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedBooking(b); setActiveModal("details"); }}>
                            <FileText className="mr-2 h-4 w-4" />
                            Details
                          </DropdownMenuItem>"""

content = content.replace(old_items_1, new_items_1)

# Add onclicks to Dropdown 2 (Desktop)
old_items_2 = """                        <DropdownMenuItem>
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
                        </DropdownMenuItem>"""

new_items_2 = """                        <DropdownMenuItem onClick={() => { setSelectedBooking(b); setActiveModal("driver_details"); }}>
                          <User className="mr-2 h-4 w-4" />
                          Driver details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedBooking(b); setActiveModal("other_stations"); }}>
                          <Map className="mr-2 h-4 w-4" />
                          Other stations
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedBooking(b); setActiveModal("local_stations"); }}>
                          <Navigation className="mr-2 h-4 w-4" />
                          Local stations
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedBooking(b); setActiveModal("attachments"); }}>
                          <Paperclip className="mr-2 h-4 w-4" />
                          Attachments
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSelectedBooking(b); setActiveModal("details"); }}>
                          <FileText className="mr-2 h-4 w-4" />
                          Details
                        </DropdownMenuItem>"""

content = content.replace(old_items_2, new_items_2)

# Add Dialog components
dialogs = """      {/* Modals for extra options */}
      <Dialog open={activeModal === "driver_details"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Driver Details</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Driver details for {selectedBooking?.customer_name}</p>
            <p className="text-sm mt-2">This feature is under development.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "other_stations"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Other Stations</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-muted-foreground">
            <Map className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Other stations for {selectedBooking?.customer_name}</p>
            <p className="text-sm mt-2">This feature is under development.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "local_stations"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Local Stations</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-muted-foreground">
            <Navigation className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Local stations for {selectedBooking?.customer_name}</p>
            <p className="text-sm mt-2">This feature is under development.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "attachments"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Attachments</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-muted-foreground">
            <Paperclip className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Attachments for {selectedBooking?.customer_name}</p>
            <p className="text-sm mt-2">This feature is under development.</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={activeModal === "details"} onOpenChange={(open) => !open && setActiveModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Booking Details</DialogTitle>
          </DialogHeader>
          <div className="py-6 text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Full details for {selectedBooking?.customer_name}</p>
            <p className="text-sm mt-2">This feature is under development.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>"""

# Insert dialogs right before the final closing div
content = content.replace("    </div>\n  );\n}", dialogs + "\n  );\n}")

with open("src/routes/crm.taxi-booking.tsx", "w") as f:
    f.write(content)

print("Modals and onClick logic added.")
