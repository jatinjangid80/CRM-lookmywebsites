const fs = require("fs");
const file = fs.readFileSync("src/hooks/useSupabaseTable.ts", "utf-8");
const match = file.match(/tableName === "transactions"([\s\S]*?)tableName ===/);
console.log(match ? match[0] : "Not found");
