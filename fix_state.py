import re

with open("src/routes/crm.taxi-booking.tsx", "r") as f:
    content = f.read()

# First, remove the bad injection
content = content.replace("""  const [activeModal, setActiveModal] = useState<"driver_details" | "other_stations" | "local_stations" | "attachments" | "details" | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);""", "")

# Inject at the top of the function
new_state = """function TaxiBookingPage() {
  const [activeModal, setActiveModal] = useState<"driver_details" | "other_stations" | "local_stations" | "attachments" | "details" | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);"""

content = content.replace("function TaxiBookingPage() {", new_state)

with open("src/routes/crm.taxi-booking.tsx", "w") as f:
    f.write(content)

print("State fixed.")
