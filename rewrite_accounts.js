const fs = require('fs');
const file = 'src/routes/crm.accounts.tsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add state variables
content = content.replace(
  '  const [vendorSearchQuery, setVendorSearchQuery] = useState("");',
  '  const [vendorSearchQuery, setVendorSearchQuery] = useState("");\n  const [customerStatusDateFrom, setCustomerStatusDateFrom] = useState("");\n  const [customerStatusDateTo, setCustomerStatusDateTo] = useState("");\n  const [vendorStatusDateFrom, setVendorStatusDateFrom] = useState("");\n  const [vendorStatusDateTo, setVendorStatusDateTo] = useState("");'
);

// 2. Add useMemos and Export Handlers before the main return
const mainReturnIndex = content.lastIndexOf('  return (\n    <main className="flex-1 p-4 sm:p-8 space-y-6 relative">');
if (mainReturnIndex === -1) {
  console.log("Could not find main return");
  process.exit(1);
}

const useMemoStr = `
  const customerDataList = useMemo(() => {
    const allCustomerNames = new Set<string>();
    customers.forEach(c => c.name && allCustomerNames.add(c.name));
    leads.forEach(l => {
      if (l.name) allCustomerNames.add(l.name);
      if (l.customer) allCustomerNames.add(l.customer);
    });
    allBookings.forEach(b => {
      if (b.customer) allCustomerNames.add(b.customer);
    });
    tasks.forEach(t => {
      if (t.customer_id) allCustomerNames.add(t.customer_id);
      if (t.lead) allCustomerNames.add(t.lead);
    });
    transactions.forEach(tx => {
      if (tx.entityType === "Customer") {
        const c = customers.find(c => c.id === tx.entityId);
        if (c && c.name) allCustomerNames.add(c.name);
      }
    });
    followUpsList.forEach(fu => {
      if (fu.customerName) allCustomerNames.add(fu.customerName);
    });
    
    return Array.from(allCustomerNames)
      .filter(Boolean)
      .filter(name => name.toLowerCase().includes(customerSearchQuery.toLowerCase()))
      .map((customerName, index) => {
        const customerData = customers.find(c => c.name === customerName) || { id: \`synth-\${index}\`, name: customerName };
        const normalizedCustomerName = (customerName || "").trim().toLowerCase();
        
        const cBookings = allBookings.filter(b => {
          if ((b.customer || "").trim().toLowerCase() !== normalizedCustomerName) return false;
          if (customerStatusDateFrom && b.bookingDate && b.bookingDate < customerStatusDateFrom) return false;
          if (customerStatusDateTo && b.bookingDate && b.bookingDate > customerStatusDateTo) return false;
          return true;
        });
        const cPolicies = insurancePolicies.filter(p => {
          if ((p.customerName || "").trim().toLowerCase() !== normalizedCustomerName) return false;
          if (customerStatusDateFrom && p.issueDate && p.issueDate < customerStatusDateFrom) return false;
          if (customerStatusDateTo && p.issueDate && p.issueDate > customerStatusDateTo) return false;
          return true;
        });
        
        let cTotalRevenue = cBookings.reduce((sum, b) => sum + (Number(b.sellingPrice) || Number(b.amount) || 0), 0);
        let cReceivedAmount = cBookings.reduce((sum, b) => sum + (Number(b.paid) || 0), 0);
        
        cTotalRevenue += cPolicies.reduce((sum, p) => sum + (Number(p.premiumAmount) || 0), 0);
        const policyIds = cPolicies.map(p => p.id);
        const cPolicyTxs = transactions.filter(tx => {
          if (tx.type !== "Receipt" || tx.entityType !== "Customer" || !policyIds.includes(tx.invoiceId)) return false;
          if (customerStatusDateFrom && tx.date && tx.date < customerStatusDateFrom) return false;
          if (customerStatusDateTo && tx.date && tx.date > customerStatusDateTo) return false;
          return true;
        });
        cReceivedAmount += cPolicyTxs.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
        
        const cPendingBalance = cTotalRevenue - cReceivedAmount;
        
        return {
          customerName,
          customerData,
          cBookings,
          cPolicies,
          cTotalRevenue,
          cReceivedAmount,
          cPendingBalance
        };
      })
      .filter(data => data.cPendingBalance > 0 || data.cTotalRevenue > 0)
      .sort((a, b) => a.customerName.localeCompare(b.customerName));
  }, [customers, leads, allBookings, tasks, transactions, followUpsList, insurancePolicies, customerSearchQuery, customerStatusDateFrom, customerStatusDateTo]);

  const vendorDataList = useMemo(() => {
    const allVendorNames = new Set<string>();
    vendors.forEach(v => v.name && allVendorNames.add(v.name));
    allBookings.forEach(b => {
      if (b.supplier) allVendorNames.add(b.supplier);
    });
    transactions.forEach(tx => {
      if (tx.entityType === "Vendor" && tx.entityId) {
        const vData = vendors.find(v => v.id === tx.entityId);
        if (vData && vData.name) allVendorNames.add(vData.name);
        else allVendorNames.add(tx.entityId);
      }
    });
    
    return Array.from(allVendorNames)
      .filter(Boolean)
      .filter(name => name.toLowerCase().includes(vendorSearchQuery.toLowerCase()))
      .map(name => {
        const vendorData = vendors.find(v => v.name === name) || { id: \`synth-v-\${name}\`, name };
        const vBookings = allBookings.filter(b => {
          if (b.supplier !== name) return false;
          if (vendorStatusDateFrom && b.bookingDate && b.bookingDate < vendorStatusDateFrom) return false;
          if (vendorStatusDateTo && b.bookingDate && b.bookingDate > vendorStatusDateTo) return false;
          return true;
        });
        const vSpendTxs = transactions.filter(tx => {
          if (tx.entityType !== "Vendor" || (tx.entityId !== vendorData.id && tx.entityId !== name) || tx.type !== "Payment") return false;
          if (vendorStatusDateFrom && tx.date && tx.date < vendorStatusDateFrom) return false;
          if (vendorStatusDateTo && tx.date && tx.date > vendorStatusDateTo) return false;
          return true;
        });
        const vSpend = vSpendTxs.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
        
        const vTotalBilled = vBookings.reduce((sum, b) => sum + (Number(b.purchasePrice) || 0), 0);
        const vPending = Math.max(0, vTotalBilled - vSpend);
        
        return {
          vendorName: name,
          vendorData,
          vBookings,
          vSpend,
          vTotalBilled,
          vPending
        };
      })
      .filter(data => data.vBookings.length > 0 || data.vSpend > 0)
      .sort((a, b) => a.vendorName.localeCompare(b.vendorName));
  }, [vendors, allBookings, transactions, vendorSearchQuery, vendorStatusDateFrom, vendorStatusDateTo]);

  const handleExportCustomerStatus = () => {
    const headers = ["Customer Name", "Phone No.", "Payments Pending", "Received Amounts", "Total Revenue"];
    const csvContent = [
      headers.join(","),
      ...customerDataList.map(c => 
        [
          \`"\${c.customerName.replace(/"/g, '""')}"\`,
          \`"\${(c.customerData.phone || c.customerData.mobile || "").replace(/"/g, '""')}"\`,
          c.cPendingBalance,
          c.cReceivedAmount,
          c.cTotalRevenue
        ].join(",")
      )
    ].join("\\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", \`customer_status_\${new Date().toISOString().split('T')[0]}.csv\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportVendorStatus = () => {
    const headers = ["Vendor Name", "Mobile", "Bookings", "Payments Pending", "Payments (Out)", "Total Billed"];
    const csvContent = [
      headers.join(","),
      ...vendorDataList.map(v => 
        [
          \`"\${v.vendorName.replace(/"/g, '""')}"\`,
          \`"\${(v.vendorData.mobile || "").replace(/"/g, '""')}"\`,
          v.vBookings.length,
          v.vPending,
          v.vSpend,
          v.vTotalBilled
        ].join(",")
      )
    ].join("\\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", \`vendor_status_\${new Date().toISOString().split('T')[0]}.csv\`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
`;
content = content.substring(0, mainReturnIndex) + useMemoStr + content.substring(mainReturnIndex);

// 3. Replace Customer Status Inline computation and add date filters + export button
const customerStatusHeaderRegex = /<TabsContent value="customer-status" className="space-y-6 mt-6">[\s\S]*?<div className="relative w-full sm:w-64">[\s\S]*?<\/div>\n          <\/div>/;
content = content.replace(customerStatusHeaderRegex, `<TabsContent value="customer-status" className="space-y-6 mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">From:</span>
              <input type="date" value={customerStatusDateFrom} onChange={(e) => setCustomerStatusDateFrom(e.target.value)} className="h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <span className="text-sm font-medium text-muted-foreground ml-2">To:</span>
              <input type="date" value={customerStatusDateTo} onChange={(e) => setCustomerStatusDateTo(e.target.value)} className="h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search customers..." className="pl-9 bg-background/50 h-9" value={customerSearchQuery} onChange={(e) => setCustomerSearchQuery(e.target.value)} />
              </div>
              <Button variant="outline" size="sm" onClick={handleExportCustomerStatus} className="h-9">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
            </div>
          </div>`);

const customerStatusBodyRegex = /\{(?:\(\) => \{[\s\S]*?const allCustomerNames = new Set<string>\(\);[\s\S]*?return customerDataList\.length === 0 \? \([\s\S]*?\) : )customerDataList\.map\(\(\{\s*customerName,\s*customerData,\s*cBookings,\s*cPolicies,\s*cTotalRevenue,\s*cReceivedAmount,\s*cPendingBalance\s*\}\) => \{/;

content = content.replace(customerStatusBodyRegex, `{customerDataList.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <Search className="h-8 w-8 opacity-20" />
                            <p>No customers found.</p>
                          </div>
                        </td>
                      </tr>
                    ) : customerDataList.map(({
                          customerName,
                          customerData,
                          cBookings,
                          cPolicies,
                          cTotalRevenue,
                          cReceivedAmount,
                          cPendingBalance
                        }) => {`);

// 4. Replace Vendor Status Inline computation and add date filters + export button
const vendorStatusHeaderRegex = /<TabsContent value="vendor-status" className="space-y-6 mt-6">[\s\S]*?<div className="relative w-full sm:w-64">[\s\S]*?<\/div>\n          <\/div>/;
content = content.replace(vendorStatusHeaderRegex, `<TabsContent value="vendor-status" className="space-y-6 mt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 animate-in fade-in duration-300">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">From:</span>
              <input type="date" value={vendorStatusDateFrom} onChange={(e) => setVendorStatusDateFrom(e.target.value)} className="h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
              <span className="text-sm font-medium text-muted-foreground ml-2">To:</span>
              <input type="date" value={vendorStatusDateTo} onChange={(e) => setVendorStatusDateTo(e.target.value)} className="h-9 rounded-md border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search vendors..." className="pl-9 bg-background/50 h-9" value={vendorSearchQuery} onChange={(e) => setVendorSearchQuery(e.target.value)} />
              </div>
              <Button variant="outline" size="sm" onClick={handleExportVendorStatus} className="h-9">
                <Download className="w-4 h-4 mr-2" /> Export
              </Button>
            </div>
          </div>`);

const vendorStatusBodyRegex = /\{(?:\(\) => \{[\s\S]*?const allVendorNames = new Set<string>\(\);[\s\S]*?return uniqueVendors\.length === 0 \? \([\s\S]*?\) : )uniqueVendors\.map\(\(vendorName, index\) => \{[\s\S]*?const vendorData = [^\n]*\n[\s\S]*?const isExpanded = [^\n]*\n[\s\S]*?const vBookings = [^\n]*\n[\s\S]*?const vSpend = [^\n]*\n[\s\S]*?\.reduce\([^\n]*\n[\s\S]*?const vTotalBilled = [^\n]*\n[\s\S]*?const vPending = [^\n]*\n/;
content = content.replace(vendorStatusBodyRegex, `{vendorDataList.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                          <div className="flex flex-col items-center gap-2">
                            <Search className="h-8 w-8 opacity-20" />
                            <p>No vendors found.</p>
                          </div>
                        </td>
                      </tr>
                    ) : vendorDataList.map(({ vendorName, vendorData, vBookings, vSpend, vTotalBilled, vPending }, index) => {
                      const isExpanded = expandedVendor === vendorData.id;
`);

fs.writeFileSync(file, content);
console.log("Done");
