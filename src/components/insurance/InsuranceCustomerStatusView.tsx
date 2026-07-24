import { formatINR } from "@/lib/mock-data";

export function InsuranceCustomerStatusView({ policies }: { policies: any[] }) {
  const customerStats = policies.reduce((acc, p) => {
    const total = Number(p.total_premium) || 0;
    const paid = Number(p.customer_paid) || Number(p.amount_paid) || 0;
    const pending = total - paid;
    return {
      total: acc.total + total,
      paid: acc.paid + paid,
      pending: acc.pending + (pending > 0 ? pending : 0)
    };
  }, { total: 0, paid: 0, pending: 0 });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Gen Insurance</p>
          <h3 className="text-3xl font-bold text-foreground">{formatINR(customerStats.total)}</h3>
        </div>
        
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Paid</p>
          <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">{formatINR(customerStats.paid)}</h3>
        </div>
        
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Payments Pending</p>
          <h3 className="text-3xl font-bold text-rose-600 dark:text-rose-500">{formatINR(customerStats.pending)}</h3>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4">Policy No.</th>
                <th className="px-6 py-4 text-right">Total Premium</th>
                <th className="px-6 py-4 text-right">Paid Amount</th>
                <th className="px-6 py-4 text-right">Pending Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {policies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    No policies found.
                  </td>
                </tr>
              ) : (
                policies.sort((a, b) => new Date(b.issue_date || 0).getTime() - new Date(a.issue_date || 0).getTime()).map((p) => {
                  const total = Number(p.total_premium) || 0;
                  const paid = Number(p.customer_paid) || Number(p.amount_paid) || 0;
                  const pending = total - paid;
                  
                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{p.customer_name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{p.mobile_number}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">
                        {p.policy_number || "Draft"}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-foreground">
                        {formatINR(total)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-emerald-600 dark:text-emerald-500">
                        {formatINR(paid)}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-rose-600 dark:text-rose-500">
                        {formatINR(pending > 0 ? pending : 0)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${p.payment_status === 'Full Paid' ? 'bg-emerald-500/10 text-emerald-500' : p.payment_status === 'Partial' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {p.payment_status || "Pending"}
                        </span>
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
