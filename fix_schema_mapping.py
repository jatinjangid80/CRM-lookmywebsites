import re

with open("src/routes/crm.taxi-booking.tsx", "r") as f:
    content = f.read()

# 1. Rename total_km to total_quantity
content = content.replace("total_km: 0", "total_quantity: 0")
content = content.replace("form.total_km", "form.total_quantity")
content = content.replace("total_km:", "total_quantity:")

# 2. Restore numeric inputs in Section 6
old_section_6 = r"""        {/\* SECTION 6: ATTACHMENTS DETAILS \*/}
        <AccordionItem value="item-6" className="border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">6</span>
              ATTACHMENTS DETAILS
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-muted/20">
            <div className="space-y-4">
              {\[
                { label: "Toll Tax", stateKey: "toll_tax" },
                { label: "Parking Tax", stateKey: "parking_tax" },
                { label: "State Tax", stateKey: "state_tax" },
                { label: "Duty Slip", stateKey: "duty_slip" },
                { label: "Other Document", stateKey: "other_tax_charges" },
              \]\.map\(\(item, idx\) => \(
                <div key={idx} className="flex items-center gap-4 bg-background p-3 rounded-lg border">
                  <div className="w-1/3 font-semibold text-sm">{item.label}</div>
                  <div className="flex-1">
                    <Input type="file" className="w-full text-xs" />
                  </div>
                </div>
              \)\)}
            </div>
          </AccordionContent>
        </AccordionItem>"""

new_section_6 = """        {/* SECTION 6: ATTACHMENTS DETAILS */}
        <AccordionItem value="item-6" className="border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">6</span>
              ATTACHMENTS DETAILS
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
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-4 bg-background p-3 rounded-lg border">
                  <div className="w-full sm:w-1/4 font-semibold text-sm">{item.label}</div>
                  <div className="w-full sm:w-1/4">
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
          </AccordionContent>
        </AccordionItem>"""

content = re.sub(old_section_6, new_section_6, content, flags=re.MULTILINE)

with open("src/routes/crm.taxi-booking.tsx", "w") as f:
    f.write(content)
print("Updated successfully")
