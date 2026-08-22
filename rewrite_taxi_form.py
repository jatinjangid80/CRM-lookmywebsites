import re

with open('src/routes/crm.taxi-booking.tsx', 'r') as f:
    content = f.read()

# 1. Add Accordion imports
if "Accordion" not in content:
    content = content.replace(
        'import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";',
        'import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";\nimport { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";'
    )

# The form starts around line 433 and goes until the end of the file (around line 770).
# Let's do a regex replacement for the entire AddTaxiBookingForm function.

# We will just write a new version of AddTaxiBookingForm and replace the old one.
new_form = """function AddTaxiBookingForm({ onCancel, onSave, initialData }: { onCancel: () => void, onSave?: (booking: any) => void, initialData?: any }) {
  const auth = getAuth();
  const isAdmin = auth?.role === "admin" || auth?.role === "manager";
  
  const [vendors] = useSupabaseTable<any[]>("vendors", []);
  const [customers] = useSupabaseTable<any[]>("customers", []);
  
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);

  const [form, setForm] = useState<any>(initialData || {
    // Common Details
    supplier: "",
    booking_date: new Date().toISOString().split('T')[0],
    customer_name: "",
    mobile_number: "",
    email_address: "",
    booked_by: "",
    reference: "",
    
    // Driver Details
    driver_name: "",
    driver_mobile: "",
    vehicle_type: "",
    vehicle_no: "",
    driver_license: "",
    pickup_location: "",
    reporting_time: "",
    driver_remarks: "",
    
    // Outstanding Details
    selling_price: 0,
    purchase_price: 0,
    received_amount: 0,
    payment_status: "Pending",
    payment_due_date: "",
    payment_mode: "",
    payment_remarks: "",
    
    // Local Details
    pricing_type: "day-wise",
    travel_date: "",
    from_location: "",
    to_location: "",
    route: "",
    no_of_days: 0,
    no_of_nights: 0,
    rate: 0,
    extra_km_charge: 0,
    extra_hrs_charge: 0,
    driver_charge: 0,
    parking_charge: 0,
    nights_charge: 0,
    other_charges: 0,
    
    // Attachments & Taxes
    toll_tax: 0,
    parking_tax: 0,
    state_tax: 0,
    duty_slip: 0,
    other_tax_charges: 0,
    
    // Legacy fields that might still be needed
    bank_details: "",
    remarks: "",
  });

  const handleChange = (updates: any) => {
    setForm((prev: any) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    if (!form.customer_name || !form.mobile_number || !form.travel_date) {
      toast.error("Please fill required fields (Customer Name, Mobile, Travel Date)");
      return;
    }
    
    const profit = (Number(form.selling_price) || 0) - (Number(form.purchase_price) || 0);
    const payload = { ...form, profit };

    try {
      if (initialData?.id) {
        const { error } = await supabase.from("crm_taxi_bookings").update(payload).eq("id", initialData.id);
        if (error) throw error;
        toast.success("Booking updated successfully");
      } else {
        const { error } = await supabase.from("crm_taxi_bookings").insert([payload]);
        if (error) throw error;
        toast.success("Booking added successfully");
      }
      if (onSave) onSave(payload);
    } catch (err: any) {
      toast.error("Error saving booking: " + err.message);
    }
  };

  const profit = (Number(form.selling_price) || 0) - (Number(form.purchase_price) || 0);
  const marginPercentage = form.selling_price ? ((profit / Number(form.selling_price)) * 100).toFixed(1) : "0.0";
  const outstandingAmount = (Number(form.selling_price) || 0) - (Number(form.received_amount) || 0);

  return (
    <div className="p-6 max-w-5xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-display">{initialData ? 'Edit Taxi Booking' : 'New Taxi Booking'}</h1>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={["item-1", "item-2", "item-3", "item-4", "item-5"]} className="w-full space-y-4">
        {/* SECTION 1: COMMON DETAILS */}
        <AccordionItem value="item-1" className="border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">1</span>
              COMMON DETAILS
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-muted/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Supplier *</Label>
                <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={supplierOpen} className="w-full justify-between">
                      {form.supplier || "Select Supplier..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search supplier..." />
                      <CommandEmpty>No supplier found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {vendors.filter((v: any) => v.service_type === "Taxi").map((v: any) => (
                            <CommandItem
                              key={v.id}
                              value={v.name}
                              onSelect={(currentValue) => {
                                handleChange({ supplier: currentValue });
                                setSupplierOpen(false);
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", form.supplier === v.name ? "opacity-100" : "opacity-0")} />
                              {v.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Booking Date *</Label>
                <Input type="date" value={form.booking_date} onChange={(e) => handleChange({ booking_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Customer Name *</Label>
                <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={customerOpen} className="w-full justify-between">
                      {form.customer_name || "Select Customer..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search customer..." />
                      <CommandEmpty>No customer found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {customers.map((c: any) => (
                            <CommandItem
                              key={c.id}
                              value={c.name}
                              onSelect={(currentValue) => {
                                handleChange({
                                  customer_name: c.name,
                                  mobile_number: c.mobile,
                                  email_address: c.email || "",
                                });
                                setCustomerOpen(false);
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", form.customer_name === c.name ? "opacity-100" : "opacity-0")} />
                              {c.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Mobile Number *</Label>
                <Input placeholder="Enter mobile" value={form.mobile_number} onChange={(e) => handleChange({ mobile_number: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input placeholder="Enter email" type="email" value={form.email_address} onChange={(e) => handleChange({ email_address: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Booked By</Label>
                <Input placeholder="Agent Name" value={form.booked_by} onChange={(e) => handleChange({ booked_by: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Reference / Booking ID</Label>
                <Input placeholder="e.g. REF-12345" value={form.reference} onChange={(e) => handleChange({ reference: e.target.value })} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 2: DRIVER DETAILS */}
        <AccordionItem value="item-2" className="border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">2</span>
              DRIVER DETAILS
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-muted/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Driver Name *</Label>
                <Input placeholder="Enter driver name" value={form.driver_name} onChange={(e) => handleChange({ driver_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Driver Mobile *</Label>
                <Input placeholder="Enter mobile number" value={form.driver_mobile} onChange={(e) => handleChange({ driver_mobile: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Vehicle Type *</Label>
                <Input placeholder="e.g. Sedan, SUV" value={form.vehicle_type} onChange={(e) => handleChange({ vehicle_type: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Vehicle Number *</Label>
                <Input placeholder="e.g. MH 01 AB 1234" value={form.vehicle_no} onChange={(e) => handleChange({ vehicle_no: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>License No.</Label>
                <Input placeholder="Enter license number" value={form.driver_license} onChange={(e) => handleChange({ driver_license: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Reporting Time</Label>
                <Input type="time" value={form.reporting_time} onChange={(e) => handleChange({ reporting_time: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Pickup Location</Label>
                <Input placeholder="Enter pickup address" value={form.pickup_location} onChange={(e) => handleChange({ pickup_location: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-4">
                <Label>Driver Remarks</Label>
                <Input placeholder="Any notes for the driver..." value={form.driver_remarks} onChange={(e) => handleChange({ driver_remarks: e.target.value })} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 3: OUTSTANDING DETAILS */}
        <AccordionItem value="item-3" className="border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">3</span>
              OUTSTANDING DETAILS
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-muted/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Selling Price (₹)</Label>
                <Input type="number" placeholder="0" value={form.selling_price} onChange={(e) => handleChange({ selling_price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Purchase Price (₹)</Label>
                <Input type="number" placeholder="0" value={form.purchase_price} onChange={(e) => handleChange({ purchase_price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Received Amount (₹)</Label>
                <Input type="number" placeholder="0" value={form.received_amount} onChange={(e) => handleChange({ received_amount: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Outstanding Amount</Label>
                <div className="h-9 px-3 py-1 bg-muted rounded-md flex items-center font-bold text-[#f97316]">
                  ₹ {outstandingAmount}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select value={form.payment_status} onValueChange={(v) => handleChange({ payment_status: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Input placeholder="e.g. Cash, UPI, Bank Transfer" value={form.payment_mode} onChange={(e) => handleChange({ payment_mode: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Payment Remarks</Label>
                <Input placeholder="Any notes regarding payment..." value={form.payment_remarks} onChange={(e) => handleChange({ payment_remarks: e.target.value })} />
              </div>
            </div>
            
            {isAdmin && (
              <div className="mt-4 p-4 rounded-xl border bg-primary/5 flex gap-8">
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider mb-1">Profit</p>
                  <p className="font-bold text-[#059669] text-xl">₹ {profit}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider mb-1">Margin %</p>
                  <p className="font-bold text-foreground text-xl">{marginPercentage}%</p>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 4: LOCAL DETAILS */}
        <AccordionItem value="item-4" className="border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">4</span>
              LOCAL DETAILS
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-muted/20">
            <div className="mb-4 space-y-2 border-b pb-4">
              <Label>Pricing Type</Label>
              <div className="flex bg-muted p-1 rounded-lg w-max">
                <Button
                  type="button"
                  variant={form.pricing_type === "day-wise" ? "default" : "ghost"}
                  className="rounded-md h-8 px-4"
                  onClick={() => handleChange({ pricing_type: "day-wise" })}
                >
                  Day Wise Pricing
                </Button>
                <Button
                  type="button"
                  variant={form.pricing_type === "km-wise" ? "default" : "ghost"}
                  className="rounded-md h-8 px-4"
                  onClick={() => handleChange({ pricing_type: "km-wise" })}
                >
                  KM Wise Pricing
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Travel Date *</Label>
                <Input type="date" value={form.travel_date} onChange={(e) => handleChange({ travel_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>From Location *</Label>
                <Input placeholder="Start point" value={form.from_location} onChange={(e) => handleChange({ from_location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>To Location *</Label>
                <Input placeholder="End point" value={form.to_location} onChange={(e) => handleChange({ to_location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Via / Route</Label>
                <Input placeholder="Enter route" value={form.route} onChange={(e) => handleChange({ route: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>No. of Days *</Label>
                <Input type="number" placeholder="0" value={form.no_of_days} onChange={(e) => handleChange({ no_of_days: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>No. of Nights</Label>
                <Input type="number" placeholder="0" value={form.no_of_nights} onChange={(e) => handleChange({ no_of_nights: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Rate (₹)</Label>
                <Input type="number" placeholder="0" value={form.rate} onChange={(e) => handleChange({ rate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Extra KM (₹)</Label>
                <Input type="number" placeholder="0" value={form.extra_km_charge} onChange={(e) => handleChange({ extra_km_charge: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>Extra Hours (₹)</Label>
                <Input type="number" placeholder="0" value={form.extra_hrs_charge} onChange={(e) => handleChange({ extra_hrs_charge: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Driver Charge (₹)</Label>
                <Input type="number" placeholder="0" value={form.driver_charge} onChange={(e) => handleChange({ driver_charge: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Parking Charge (₹)</Label>
                <Input type="number" placeholder="0" value={form.parking_charge} onChange={(e) => handleChange({ parking_charge: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Night Charge (₹)</Label>
                <Input type="number" placeholder="0" value={form.nights_charge} onChange={(e) => handleChange({ nights_charge: e.target.value })} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 5: ATTACHMENTS & TAXES */}
        <AccordionItem value="item-5" className="border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">5</span>
              ATTACHMENTS & TAXES
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-muted/20">
            <div className="space-y-4">
              {[
                { label: "Toll Tax", stateKey: "toll_tax" },
                { label: "Parking Tax", stateKey: "parking_tax" },
                { label: "State Tax", stateKey: "state_tax" },
                { label: "Duty Slip", stateKey: "duty_slip" },
                { label: "Other Document", stateKey: "other_tax_charges" },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-background p-3 rounded-lg border">
                  <div className="w-1/4 font-semibold text-sm">{item.label}</div>
                  <div className="w-1/4">
                    <Input 
                      type="number" 
                      placeholder="Amount (₹)" 
                      value={form[item.stateKey]} 
                      onChange={(e) => handleChange({ [item.stateKey]: e.target.value })} 
                    />
                  </div>
                  <div className="flex-1">
                    <Input type="file" className="w-full text-xs" />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 space-y-2">
              <Label>Other Remarks / Bank Details</Label>
              <Textarea 
                placeholder="Any other comments or bank details..." 
                value={form.remarks} 
                onChange={(e) => handleChange({ remarks: e.target.value })} 
                rows={3} 
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
        <Button variant="outline" onClick={onCancel} className="px-6 rounded-xl">Cancel</Button>
        <Button onClick={handleSave} className="px-6 rounded-xl">Save Booking</Button>
      </div>
    </div>
  );
}
"""

start_idx = content.find("function AddTaxiBookingForm")
if start_idx != -1:
    content = content[:start_idx] + new_form + "\n"

with open('src/routes/crm.taxi-booking.tsx', 'w') as f:
    f.write(content)

print("Updated taxi booking form successfully.")
