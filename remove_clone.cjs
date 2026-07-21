const fs = require("fs");

const files = [
  "src/routes/crm.leads.tsx",
  "src/routes/crm.quotations.tsx",
  "src/routes/crm.vendors.tsx",
  "src/routes/crm.tasks.tsx",
  "src/routes/crm.packages.tsx",
  "src/routes/crm.bookings.tsx",
  "src/routes/crm.visa.tsx",
  "src/routes/crm.customers.tsx",
  "src/components/insurance/InsuranceTable.tsx"
];

for (const file of files) {
  if (!fs.existsSync(file)) {
    console.log(`Not found: ${file}`);
    continue;
  }
  let content = fs.readFileSync(file, "utf8");
  const original = content;

  // Remove `const cloneXYZ = (...) => { ... }` until the end of the block.
  content = content.replace(/^[ \t]*const clone[A-Za-z]+\s*=\s*\([^\)]*\)\s*=>\s*\{[\s\S]*?(?=\n[ \t]*(?:const |return |<|\/\*|function|\}))/gm, (match) => {
    // This regex is a bit weak for matching the end of the block.
    return "";
  });

  // Remove `onClone` props from interfaces/components
  content = content.replace(/^[ \t]*onClone\?:.*?;\n/gm, "");
  content = content.replace(/^[ \t]*onClone=\{.*?\}\n/gm, "");
  content = content.replace(/^[ \t]*onClone,?\n/gm, "");
  
  // Remove `onDuplicate` similarly
  content = content.replace(/^[ \t]*onDuplicate\?:.*?;\n/gm, "");
  content = content.replace(/^[ \t]*onDuplicate=\{.*?\}\n/gm, "");
  content = content.replace(/^[ \t]*onDuplicate,?\n/gm, "");
  content = content.replace(/onDuplicate:\s*\(.*?\)\s*=>\s*void;\n/gm, "");

  // Remove `<Button ...> <Copy /> Clone </Button>` blocks
  content = content.replace(/^[ \t]*\{onClone && \([\s\S]*?<\/Button>\n[ \t]*\)\}\n/gm, "");
  
  // Remove DropdownMenuItem with Duplicate
  content = content.replace(/^[ \t]*<DropdownMenuItem.*?onDuplicate.*?>[\s\S]*?<\/DropdownMenuItem>\n/gm, "");

  // Remove DropdownMenuItem with Clone (e.g. vendors, customers)
  content = content.replace(/^[ \t]*<DropdownMenuItem.*?clone.*?>[\s\S]*?<\/DropdownMenuItem>\n/gm, "");

  // Remove button with Clone (inline)
  content = content.replace(/^[ \t]*<Button[^>]*?onClick=\{.*?clone.*?\}[\s\S]*?<\/Button>\n/gm, "");
  
  // Quotations clone block is inside a `<Button ... onClick={() => { ... clone logic ... }}>`
  // We can just match the Button that has `<Copy ... /> Clone` inside it.
  content = content.replace(/^[ \t]*<Button[\s\S]*?<Copy[\s\S]*?(?:Clone|Copy|Duplicate)[\s\S]*?<\/Button>\n/gm, "");

  if (content !== original) {
    fs.writeFileSync(file, content);
    console.log(`Modified: ${file}`);
  } else {
    console.log(`No changes made to: ${file}`);
  }
}
