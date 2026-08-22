import re

with open("src/routes/crm.taxi-booking.tsx", "r") as f:
    content = f.read()

# We need to find the second instance of the dialogs and remove them.
# The dialogs block starts with {/* Modals for extra options */} and ends with </Dialog> for details.

pattern = r'      {/\* Modals for extra options \*/}.*?<DialogTitle>Booking Details</DialogTitle>\n          </DialogHeader>\n          <div className="py-6 text-center text-muted-foreground">\n            <FileText className="h-12 w-12 mx-auto mb-4 opacity-20" />\n            <p>Full details for {selectedBooking\?\.customer_name}</p>\n            <p className="text-sm mt-2">This feature is under development.</p>\n          </div>\n        </DialogContent>\n      </Dialog>'

matches = list(re.finditer(pattern, content, flags=re.DOTALL))
if len(matches) > 1:
    # Remove the second one
    match = matches[1]
    content = content[:match.start()] + content[match.end():]

with open("src/routes/crm.taxi-booking.tsx", "w") as f:
    f.write(content)

print("Duplicate dialogs removed.")
