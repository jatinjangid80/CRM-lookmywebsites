import re

with open("src/routes/crm.taxi-booking.tsx", "r") as f:
    content = f.read()

# Add total_km to state
if "total_km: 0," not in content:
    content = content.replace('pricing_type: "day-wise",', 'pricing_type: "day-wise",\n    total_km: 0,')

# Add otherStation calculations
calc_str = """  const baseRate = (Number(form.rate) || 0) * (Number(form.no_of_days) || 0);
  const totalCost = baseRate + 
    (Number(form.extra_km_charge) || 0) +
    (Number(form.extra_hrs_charge) || 0) + 
    (Number(form.driver_charge) || 0) + 
    (Number(form.parking_charge) || 0) + 
    (Number(form.nights_charge) || 0);

  const otherStationBaseRate = (Number(form.rate) || 0) * (Number(form.total_km) || 0);
  const otherStationTotalCost = otherStationBaseRate + 
    (Number(form.nights_charge) || 0) + 
    (Number(form.driver_charge) || 0) + 
    (Number(form.parking_charge) || 0) + 
    (Number(form.toll_tax) || 0) + 
    (Number(form.other_charges) || 0);"""

if "const otherStationBaseRate" not in content:
    content = re.sub(r'  const baseRate =.*?\n.*?\n.*?\n.*?\n.*?\n.*?\n.*?;', calc_str, content, flags=re.MULTILINE | re.DOTALL)

# Replace Section 3 placeholder with actual JSX
section_3_jsx = """        {/* SECTION 3: OTHER STATION */}
        <AccordionItem value="item-3" className="border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">3</span>
              OTHER STATION
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-muted/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Travel Date *</Label>
                <Input type="date" value={form.travel_date} onChange={(e) => handleChange({ travel_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Location / City Route *</Label>
                <Input placeholder="Enter route" value={form.route} onChange={(e) => handleChange({ route: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Vehicle Type *</Label>
                <Input placeholder="Vehicle type" value={form.vehicle_type} onChange={(e) => handleChange({ vehicle_type: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Vehicle No.</Label>
                <Input placeholder="Vehicle number" value={form.vehicle_no} onChange={(e) => handleChange({ vehicle_no: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>Rate per KM *</Label>
                <Input type="number" placeholder="0" value={form.rate} onChange={(e) => handleChange({ rate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Total KM *</Label>
                <Input type="number" placeholder="0" value={form.total_km} onChange={(e) => handleChange({ total_km: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Night Charge</Label>
                <Input type="number" placeholder="0" value={form.nights_charge} onChange={(e) => handleChange({ nights_charge: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Driver Charge</Label>
                <Input type="number" placeholder="0" value={form.driver_charge} onChange={(e) => handleChange({ driver_charge: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>Parking Charge</Label>
                <Input type="number" placeholder="0" value={form.parking_charge} onChange={(e) => handleChange({ parking_charge: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Toll Tax</Label>
                <Input type="number" placeholder="0" value={form.toll_tax} onChange={(e) => handleChange({ toll_tax: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Other Charges</Label>
                <Input type="number" placeholder="0" value={form.other_charges} onChange={(e) => handleChange({ other_charges: e.target.value })} />
              </div>
            </div>

            {/* Pricing Estimate */}
            <div className="mt-6 bg-[#faf9f8] p-4 rounded-xl border col-span-2 md:col-span-4">
              <h4 className="font-semibold mb-3">PRICING ESTIMATE</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Rate ({form.rate || 0} × {form.total_km || 0} km):</span>
                  <span className="font-medium">₹ {otherStationBaseRate}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Total Cost:</span>
                  <span className="text-[#E12D39] text-lg">₹ {otherStationTotalCost}</span>
                </div>
              </div>
              <Button 
                type="button"
                variant="outline" 
                className="w-full mt-4" 
                onClick={() => handleChange({ selling_price: otherStationTotalCost, purchase_price: otherStationTotalCost })}
              >
                Apply to Total Amount
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>"""

old_section_3 = r"""        {/\* SECTION 3: OTHER STATION \*/}
        <AccordionItem value="item-3" className="border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">3</span>
              OTHER STATION
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-muted/20">
            <div className="text-muted-foreground text-sm">No fields added yet.</div>
          </AccordionContent>
        </AccordionItem>"""

content = re.sub(old_section_3, section_3_jsx, content, flags=re.MULTILINE)

with open("src/routes/crm.taxi-booking.tsx", "w") as f:
    f.write(content)
print("Updated successfully")
