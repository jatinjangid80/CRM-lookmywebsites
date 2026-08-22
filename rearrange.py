import re

with open('src/routes/crm.taxi-booking.tsx', 'r') as f:
    content = f.read()

# Find the start and end of the Accordion
start_match = re.search(r'<Accordion type="multiple" defaultValue=\{.*\} className="w-full space-y-4">', content)
end_match = re.search(r'</Accordion>', content[start_match.start():])
end_pos = start_match.start() + end_match.end()

accordion_content = content[start_match.start():end_pos]

# Extract sections
sections = {}
for i in range(1, 6):
    pattern = r'\{/\* SECTION ' + str(i) + r':.*?\*/\}.*?(?=\{/\* SECTION |\</Accordion\>)'
    match = re.search(pattern, accordion_content, re.DOTALL)
    if match:
        sections[i] = match.group(0).strip()

# Now sections are:
# 1: COMMON DETAILS
# 2: DRIVER DETAILS
# 3: FINANCIAL DETAILS
# 4: LOCAL DETAILS
# 5: ATTACHMENTS & TAXES

# We need to extract REMARK from ATTACHMENTS & TAXES
# It's at the end of section 5:
# <div className="mt-4 space-y-2">
#   <Label>Other Remarks / Bank Details</Label>

sec5 = sections[5]
remark_start = sec5.find('<div className="mt-4 space-y-2">')
remark_end = sec5.find('</AccordionContent>', remark_start)
remark_content = sec5[remark_start:remark_end].strip()

# Clean up section 5
sections[5] = sec5[:remark_start].strip() + "\n          </AccordionContent>\n        </AccordionItem>"

# Reorder:
# 1. COMMON DETAILS (sections[1])
# 2. DRIVER DETAILS (sections[2])
# 3. OTHER STATION (new)
# 4. LOCAL DETAILS (sections[4])
# 5. FINANCIAL DETAILS (sections[3])
# 6. ATTACHMENTS DETAILS (sections[5])
# 7. REMARK (new section using remark_content)

new_section_3 = """{/* SECTION 3: OTHER STATION */}
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

new_section_7 = """{/* SECTION 7: REMARK */}
        <AccordionItem value="item-7" className="border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">7</span>
              REMARK
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-muted/20">
            {/* injected remark content */}
            """ + remark_content + """
          </AccordionContent>
        </AccordionItem>"""

# Renumber the section headers
def renumber(text, new_num, title):
    # Fix the comment
    text = re.sub(r'\{/\* SECTION \d+:.*?\*/\}', f'{{/* SECTION {new_num}: {title} */}}', text)
    # Fix the value="item-X"
    text = re.sub(r'value="item-\d+"', f'value="item-{new_num}"', text)
    # Fix the circle number
    text = re.sub(r'<span className="flex h-6 w-6.*?">.*?</span>', f'<span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">{new_num}</span>', text, flags=re.DOTALL)
    # Fix title text
    text = re.sub(r'</span>\s+.*?\s+</div>', f'</span>\n              {title}\n            </div>', text)
    return text

s1 = renumber(sections[1], 1, "COMMON DETAILS")
s2 = renumber(sections[2], 2, "DRIVER DETAILS")
s3 = new_section_3
s4 = renumber(sections[4], 4, "LOCAL DETAILS")
s5 = renumber(sections[3], 5, "FINANCIAL DETAILS")
s6 = renumber(sections[5], 6, "ATTACHMENTS DETAILS")
s7 = new_section_7

new_accordion_inner = f"{s1}\n\n        {s2}\n\n        {s3}\n\n        {s4}\n\n        {s5}\n\n        {s6}\n\n        {s7}"

new_accordion = f'<Accordion type="multiple" defaultValue={{["item-1", "item-2", "item-3", "item-4", "item-5", "item-6", "item-7"]}} className="w-full space-y-4">\n        {new_accordion_inner}\n      </Accordion>'

new_content = content[:start_match.start()] + new_accordion + content[end_pos:]

with open('src/routes/crm.taxi-booking.tsx', 'w') as f:
    f.write(new_content)

print("Done")
