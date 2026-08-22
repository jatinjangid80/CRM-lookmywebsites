import re

with open("src/routes/crm.taxi-booking.tsx", "r") as f:
    content = f.read()

# 1. Remove the placeholder modals entirely
pattern = r'      {/\* Modals for extra options \*/}.*?<DialogTitle>Booking Details</DialogTitle>.*?</div>\n        </DialogContent>\n      </Dialog>'
content = re.sub(pattern, '', content, flags=re.DOTALL)

# 2. Update state definition
content = content.replace(
    'const [activeModal, setActiveModal] = useState<"driver_details" | "other_stations" | "local_stations" | "attachments" | "details" | null>(null);',
    'const [activeModal, setActiveModal] = useState<string | null>(null);'
)
# We can remove selectedBooking since we just use editingBooking.
content = content.replace('  const [selectedBooking, setSelectedBooking] = useState<any>(null);\n', '')

# 3. Update onClick handlers
# For Mobile Dropdown
old_items_1 = """                          <DropdownMenuItem onClick={() => { setSelectedBooking(b); setActiveModal("driver_details"); }}>
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

new_items_1 = """                          <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal("item-2"); setIsAdding(true); }}>
                            <User className="mr-2 h-4 w-4" />
                            Driver details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal("item-3"); setIsAdding(true); }}>
                            <Map className="mr-2 h-4 w-4" />
                            Other stations
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal("item-4"); setIsAdding(true); }}>
                            <Navigation className="mr-2 h-4 w-4" />
                            Local stations
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal("item-6"); setIsAdding(true); }}>
                            <Paperclip className="mr-2 h-4 w-4" />
                            Attachments
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal(null); setIsAdding(true); }}>
                            <FileText className="mr-2 h-4 w-4" />
                            Details
                          </DropdownMenuItem>"""

content = content.replace(old_items_1, new_items_1)

# For Desktop Dropdown
old_items_2 = """                        <DropdownMenuItem onClick={() => { setSelectedBooking(b); setActiveModal("driver_details"); }}>
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

new_items_2 = """                        <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal("item-2"); setIsAdding(true); }}>
                          <User className="mr-2 h-4 w-4" />
                          Driver details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal("item-3"); setIsAdding(true); }}>
                          <Map className="mr-2 h-4 w-4" />
                          Other stations
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal("item-4"); setIsAdding(true); }}>
                          <Navigation className="mr-2 h-4 w-4" />
                          Local stations
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal("item-6"); setIsAdding(true); }}>
                          <Paperclip className="mr-2 h-4 w-4" />
                          Attachments
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal(null); setIsAdding(true); }}>
                          <FileText className="mr-2 h-4 w-4" />
                          Details
                        </DropdownMenuItem>"""

content = content.replace(old_items_2, new_items_2)

# Now, we also need to make Edit open the modal normally (without specific activeModal).
# Wait, Edit already sets setEditingBooking(b) and setIsAdding(true). Let's clear activeModal.
content = content.replace('onClick={() => setEditingBooking(b)}', 'onClick={() => { setEditingBooking(b); setActiveModal(null); setIsAdding(true); }}')

# Update AddTaxiBookingForm definition
content = content.replace(
    'function AddTaxiBookingForm({ onCancel, onSave, initialData }: { onCancel: () => void, onSave?: (booking: any) => void, initialData?: any }) {',
    'function AddTaxiBookingForm({ onCancel, onSave, initialData, activeAccordion }: { onCancel: () => void, onSave?: (booking: any) => void, initialData?: any, activeAccordion?: string | null }) {'
)

# Pass activeAccordion
content = content.replace(
    '<AddTaxiBookingForm \n              initialData={editingBooking}',
    '<AddTaxiBookingForm \n              initialData={editingBooking}\n              activeAccordion={activeModal}'
)
# Note: there is another place where it's used for adding:
content = content.replace(
    '<AddTaxiBookingForm onCancel={() => setIsAdding(false)} />',
    '<AddTaxiBookingForm onCancel={() => setIsAdding(false)} activeAccordion={null} />'
)

# Update Accordion inside AddTaxiBookingForm
# We need to add value and onValueChange to Accordion to make it fully controlled so we can force it open when activeAccordion changes.
# Or just defaultValue is fine since it mounts fresh.
old_accordion = '      <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3", "item-4", "item-5", "item-6", "item-7"]} className="w-full space-y-4">'
new_accordion = '      <Accordion type="multiple" defaultValue={activeAccordion ? [activeAccordion] : ["item-1", "item-2", "item-3", "item-4", "item-5", "item-6", "item-7"]} className="w-full space-y-4">'
content = content.replace(old_accordion, new_accordion)

# Let's add an id to AccordionItems so we can scroll to them if we want?
# Just defaultValue is usually enough because it's at the top.

with open("src/routes/crm.taxi-booking.tsx", "w") as f:
    f.write(content)

print("Modals converted to use Accordion sections.")
