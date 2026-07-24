import { formatINR } from "@/lib/mock-data";

export function InsuranceVendorStatusView({ policies, vendors }: { policies: any[], vendors: any[] }) {
  const getVendorName = (p: any) => p.vendor_id === "other" ? (p.custom_vendor || "Other") : (vendors.find(v => v.id === p.vendor_id)?.name || p.vendor_id);

  const vendorStats = policies.reduce((acc, p) => {
    const vendPaid = Number(p.vendor_paid) || 0;
    const profit = Number(p.profit) || 0;
    return {
      totalPaid: acc.totalPaid + vendPaid,
      totalProfit: acc.totalProfit + profit
    };
  }, { totalPaid: 0, totalProfit: 0 });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Policies Handled</p>
          <h3 className="text-3xl font-bold text-foreground">{policies.length}</h3>
        </div>
        
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Paid to Vendors</p>
          <h3 className="text-3xl font-bold text-amber-600 dark:text-amber-500">{formatINR(vendorStats.totalPaid)}</h3>
        </div>
        
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Profit Generated</p>
          <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">{formatINR(vendorStats.totalProfit)}</h3>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Vendor Name</th>
                <th className="px-6 py-4">Policy No.</th>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4 text-right">Amount Paid to Vendor</th>
                <th className="px-6 py-4 text-right">Profit Generated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {policies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No vendor records found.
                  </td>
                </tr>
              ) : (
                policies.sort((a, b) => new Date(b.issue_date || 0).getTime() - new Date(a.issue_date || 0).getTime()).map((p) => {
                  const vendPaid = Number(p.vendor_paid) || 0;
                  const profit = Number(p.profit) || 0;
                  
                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{getVendorName(p) || "Unknown"}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">
                        {p.policy_number || "Draft"}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{p.customer_name || "Unknown"}</p>
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-amber-600 dark:text-amber-500">
                        {formatINR(vendPaid)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-emerald-600 dark:text-emerald-500">
                        {formatINR(profit)}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
