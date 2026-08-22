import re

with open("src/routes/crm.index.tsx", "r") as f:
    content = f.read()

# Import ArrowRight if not present
if "ArrowRight" not in content[:1000]:
    content = content.replace('MapPin,', 'MapPin,\n  ArrowRight,')

with open("src/routes/crm.index.tsx", "w") as f:
    f.write(content)

print("ArrowRight imported.")
