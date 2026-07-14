const fs = require('fs');

let code = fs.readFileSync('/Users/jatinjangid/Downloads/crm-lookmywebsites/src/routes/crm.vendors.tsx', 'utf-8');

// Add Import Button state and parsing logic
const importLogic = `
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [importText, setImportText] = useState("");

  const handleImport = () => {
    if (!importText.trim()) return;
    
    const lines = importText.trim().split('\\n');
    if (lines.length < 2) return; // Need at least headers and one row

    const headers = lines[0].split('\\t').map(h => h.trim().toLowerCase());
    
    const nameIdx = headers.findIndex(h => h.includes('vendor name') || h.includes('name'));
    const contactIdx = headers.findIndex(h => h.includes('contact person') || h.includes('contact'));
    const phoneIdx = headers.findIndex(h => h.includes('mobile number') || h.includes('phone') || h.includes('mobile'));
    const emailIdx = headers.findIndex(h => h.includes('email id') || h.includes('email'));
    const websiteIdx = headers.findIndex(h => h.includes('website') || h.includes('web'));
    const cityIdx = headers.findIndex(h => h.includes('office city') || h.includes('city') || h.includes('place'));
    const typeIdx = headers.findIndex(h => h.includes('vendor type') || h.includes('type'));

    let maxId = vendors.reduce((acc, v) => {
      const num = parseInt((v.id || "").replace("VND", ""));
      return !isNaN(num) && num > acc ? num : acc;
    }, 0);

    const newVendors = [];
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split('\\t').map(c => c.trim());
      if (cols.length < 2) continue; // Skip empty rows

      maxId++;
      const newId = \`VND\${String(maxId).padStart(3, "0")}\`;

      newVendors.push({
        id: newId,
        vendor_name: nameIdx !== -1 ? cols[nameIdx] : "",
        contact_person: contactIdx !== -1 ? cols[contactIdx] : "",
        phone: phoneIdx !== -1 ? cols[phoneIdx] : "",
        email: emailIdx !== -1 ? cols[emailIdx] : "",
        website: websiteIdx !== -1 ? cols[websiteIdx] : "",
        city: cityIdx !== -1 ? cols[cityIdx] : "",
        vendor_type: typeIdx !== -1 && cols[typeIdx] ? cols[typeIdx] : "Other",
        bank_name: "", account_number: "", ifsc: "", upi: "",
        created_at: new Date().toISOString()
      });
    }

    if (newVendors.length > 0) {
      setVendors([...newVendors, ...vendors]);
    }
    
    setIsImportOpen(false);
    setImportText("");
  };
`;

const importButton = `
            <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" /> Import
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Import Vendors (Paste Excel/CSV)</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label>Paste Data (Tab-separated values)</Label>
                    <textarea 
                      className="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Place\\tVendor Name\\tContact Person\\tMobile Number\\nDubai\\tAddress Beach\\tjatin\\t971501..."
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">Ensure the first row contains headers like "Vendor Name", "Mobile Number", "Email", etc.</p>
                  </div>
                  <Button onClick={handleImport} className="w-full">Process Import</Button>
                </div>
              </DialogContent>
            </Dialog>
`;

code = code.replace(/const \[isAddOpen, setIsAddOpen\] = useState\(false\);/, 'const [isAddOpen, setIsAddOpen] = useState(false);\n' + importLogic);
code = code.replace(/<Dialog open=\{isAddOpen\}/, importButton + '\n            <Dialog open={isAddOpen}');

fs.writeFileSync('/Users/jatinjangid/Downloads/crm-lookmywebsites/src/routes/crm.vendors.tsx', code);
