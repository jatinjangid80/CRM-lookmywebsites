const fs = require('fs');

let code = fs.readFileSync('/Users/jatinjangid/Downloads/crm-lookmywebsites/src/routes/crm.vendors.tsx', 'utf-8');

// Replace the old text area import logic with the new ImportModal logic
const importLogicNew = `
  const [isImportOpen, setIsImportOpen] = useState(false);

  const handleImportData = (data) => {
    let maxId = vendors.reduce((acc, v) => {
      const num = parseInt((v.id || "").replace("VND", ""));
      return !isNaN(num) && num > acc ? num : acc;
    }, 0);

    const newVendors = [];
    for (const row of data) {
      // Find matching keys case-insensitively
      const getVal = (possibleKeys) => {
        const key = Object.keys(row).find(k => possibleKeys.some(pk => k.toLowerCase().includes(pk)));
        return key ? row[key] : "";
      };

      const vendor_name = getVal(['vendor name', 'name']);
      if (!vendor_name) continue;

      maxId++;
      const newId = \`VND\${String(maxId).padStart(3, "0")}\`;

      newVendors.push({
        id: newId,
        vendor_name,
        contact_person: getVal(['contact person', 'contact']),
        phone: getVal(['mobile number', 'phone', 'mobile']),
        email: getVal(['email id', 'email']),
        website: getVal(['website', 'web']),
        city: getVal(['office city', 'city', 'place']),
        vendor_type: getVal(['vendor type', 'type']) || "Other",
        bank_name: "", account_number: "", ifsc: "", upi: "",
        created_at: new Date().toISOString()
      });
    }

    if (newVendors.length > 0) {
      setVendors([...newVendors, ...vendors]);
    }
  };
`;

// we need to add the import for ImportModal
code = code.replace(/import \{ Vendor \} from \"@\/types\/supabase\";/, 'import { Vendor } from "@/types/supabase";\nimport { ImportModal } from "@/components/ImportModal";');

// replace the handleImport state/functions
code = code.replace(/const \[isImportOpen, setIsImportOpen\] = useState\(false\);[\s\S]*?const handleSave = \(e: React\.FormEvent\) => \{/, importLogicNew + '\n\n  const handleSave = (e: React.FormEvent) => {');

// Replace the old Dialog with the ImportModal
const oldDialogRegex = /<Dialog open=\{isImportOpen\}[\s\S]*?<\/Dialog>/;
code = code.replace(oldDialogRegex, \`<ImportModal 
            isOpen={isImportOpen} 
            onClose={() => setIsImportOpen(false)} 
            onImport={handleImportData} 
            title="Import Vendors" 
            subtitle="Strictly import vendors using the official template format."
            templateUrl="/Vendor_Import_Template.xlsx"
          />\`);

fs.writeFileSync('/Users/jatinjangid/Downloads/crm-lookmywebsites/src/routes/crm.vendors.tsx', code);
