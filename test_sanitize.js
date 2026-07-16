const newReq = {
  id: `PRQ-1234`,
  date: "2026-07-16",
  employeeId: "EMP-001",
  employeeName: "Current User",
  invoiceId: "",
  entityType: "Vendor",
  entityId: "123",
  entityName: "Test Vendor",
  amount: 1000,
  status: "Pending Approval",
  remark: "test",
  auditLog: [{
    timestamp: new Date().toISOString(),
    action: "Created Request",
    user: "Current User",
    remark: "test"
  }]
};

const sanitizeRow = (row) => {
  const newRow = { ...row };
  
  if (newRow.employeeName !== undefined) newRow.submittedBy = newRow.employeeName;
  else if (newRow.createdBy !== undefined) newRow.submittedBy = newRow.createdBy;
  else if (newRow.submittedBy === undefined) newRow.submittedBy = "Unknown";
  
  if (newRow.vendor !== undefined) newRow.supplier = newRow.vendor;
  else if (newRow.entityType === "Vendor" && newRow.entityName) newRow.supplier = newRow.entityName;
  else if (newRow.supplier === undefined) newRow.supplier = "N/A";
  
  if (newRow.customer !== undefined) newRow.clientName = newRow.customer;
  else if (newRow.entityType === "Customer" && newRow.entityName) newRow.clientName = newRow.entityName;
  else if (newRow.clientName === undefined) newRow.clientName = "N/A";
  
  if (newRow.requestedAmount !== undefined) newRow.amount = newRow.requestedAmount;
  else if (newRow.amount === undefined) newRow.amount = 0;

  const requestMeta = {};
  const metaFields = [
    "paidFor","adminNotes","bookingId","bookingNumber","customer","vendor","serviceType","bookingAmount","vendorPayable",
    "profit","employeeName","requestedAmount","paymentMode","dueDate","priority","remarks","invoiceAttachments","vendorBillAttachments",
    "auditTimeline","accountRemarks","adminRemarks","rejectionReason","paymentDetails","auditLog","remark","accountStatus",
    "adminStatus","createdAt","updatedAt","createdBy","entityType","entityId","entityName","employeeId","invoiceId","receiptId",
    "vendorId","customerId","currency","notes","timeline"
  ];

  const existingRemarks = newRow.remarks || "";
  for (const field of metaFields) {
    if (newRow[field] !== undefined) {
      requestMeta[field] = newRow[field];
      delete newRow[field];
    }
  }

  newRow.remarks = JSON.stringify({ _isMeta: true, text: existingRemarks, ...requestMeta });
  
  return newRow;
}

console.log(JSON.stringify(sanitizeRow(newReq), null, 2));
