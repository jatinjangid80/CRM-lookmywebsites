const fs = require('fs');
let code = fs.readFileSync('src/components/ui/import-vendors-modal.tsx', 'utf8');

// 1. Helper to clean "NA"
const cleanNa = `
    data.forEach((row, index) => {
      if (Object.values(row).every((v) => !v || String(v).trim() === "")) return;

      const cleanField = (val) => {
        const s = String(val || "").trim();
        return (s.toUpperCase() === "NA" || s.toUpperCase() === "N/A") ? "" : s;
      };

      const rowErrors: string[] = [];
      const name = cleanField(row["Vendor Name"]);
      const contact = cleanField(row["Contact Person"]);
      const mobile = cleanField(row["Mobile Number"]);
      const email = cleanField(row["Email ID"]);
      let website = cleanField(row["Website"]);
      const place = cleanField(row["Place"]);
      const city = cleanField(row["Office City"]);
      let type = cleanField(row["Vendor Type"]);
      
      if (website && !/^https?:\\/\\//.test(website)) {
        website = "http://" + website;
        row["Website"] = website;
      }
      
      if (!type) {
         type = "Other";
         row["Vendor Type"] = "Other";
      }
`;

code = code.replace(`
    data.forEach((row, index) => {
      if (Object.values(row).every((v) => !v || String(v).trim() === "")) return;

      const rowErrors: string[] = [];
      const name = String(row["Vendor Name"] || "").trim();
      const contact = String(row["Contact Person"] || "").trim();
      const mobile = String(row["Mobile Number"] || "").trim();
      const email = String(row["Email ID"] || "").trim();
      const website = String(row["Website"] || "").trim();
      const place = String(row["Place"] || "").trim();
      const city = String(row["Office City"] || "").trim();
      const type = String(row["Vendor Type"] || "").trim();
`, cleanNa);

// 2. Relax validations
code = code.replace(`
      if (!name) rowErrors.push("Vendor Name is required.");
      if (!contact) rowErrors.push("Contact Person is required.");
      if (!place) rowErrors.push("Place is required.");
      if (!city) rowErrors.push("Office City is required.");
      if (!type) {
        rowErrors.push("Vendor Type is required.");
      } else if (!allowedTypes.includes(type)) {
        rowErrors.push(\`Vendor Type '\${type}' is not valid.\`);
      }
`, `
      if (!name) rowErrors.push("Vendor Name is required.");
      if (!contact) rowErrors.push("Contact Person is required.");
      if (!mobile) {
         // allow missing mobile? Let's leave mobile as required
      }
      // allow place and city to be empty for now if they didn't fill it
`);

code = code.replace(`
      if (website && !/^https?:\\/\\/.+/.test(website)) {
        rowErrors.push("Website must start with http:// or https://");
      }
`, ``);

fs.writeFileSync('src/components/ui/import-vendors-modal.tsx', code);
