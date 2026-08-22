import re

with open("src/routes/crm.taxi-booking.tsx", "r") as f:
    content = f.read()

# Add key to AddTaxiBookingForm inside Dialog
old_tag = '<AddTaxiBookingForm \n              initialData={editingBooking}\n              activeAccordion={activeModal}'
new_tag = '<AddTaxiBookingForm \n              key={`${editingBooking?.id}-${activeModal}`}\n              initialData={editingBooking}\n              activeAccordion={activeModal}'

content = content.replace(old_tag, new_tag)

with open("src/routes/crm.taxi-booking.tsx", "w") as f:
    f.write(content)

print("Key added to AddTaxiBookingForm.")
