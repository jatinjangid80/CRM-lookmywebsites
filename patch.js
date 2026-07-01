const fs = require("fs");
const file = "src/hooks/useSupabaseTable.ts";
let code = fs.readFileSync(file, "utf-8");

code = code.replace(
  `      } else if (initialValue && initialValue.length > 0) {`,
  `      } else if (initialValue && initialValue.length > 0 && !localStorage.getItem(\`seeded_\${tableName}\`)) {
        localStorage.setItem(\`seeded_\${tableName}\`, "true");`,
);

fs.writeFileSync(file, code);
