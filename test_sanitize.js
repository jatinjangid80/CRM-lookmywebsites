const newRow = { id: 1, assignedTo: "", name: "test" };
const tableName = "insurance_leads";

if (tableName === "leads" || tableName === "insurance_leads") {
  if (newRow.assignedTo) {
    newRow.assignedto = newRow.assignedTo;
  }
  delete newRow.assignedTo;
}
console.log(newRow);
