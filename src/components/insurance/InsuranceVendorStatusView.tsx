import { useState } from "react";
import { formatINR } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InsurancePaymentModal } from "./InsurancePaymentModal";
import { supabase } from "@/lib/supabase";
import { getAuth } from "@/lib/auth";

export function InsuranceVendorStatusView({ policies, vendors, setPolicies }: { policies: any[], vendors: any[], setPolicies: any }) {
  const auth = getAuth();
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);

  const getVendorName = (p: any) => p.vendor_id === "other" ? (p.custom_vendor || "Other") : (vendors.find(v => v.id === p.vendor_id)?.name || p.vendor_id);

  const vendorStats = policies.reduce((acc, p) => {
    const vendPaid = Number(p.vendor_paid) || 0;
    const profit = Number(p.profit) || 0;
    return {
      totalPaid: acc.totalPaid + vendPaid,
      totalProfit: acc.totalProfit + profit
    };
  }, { totalPaid: 0, totalProfit: 0 });

  const handleSavePayment = async (amount: number, date: string, mode: string, reference: string) => {
    if (!selectedPolicy) return;
    
    const vendorName = getVendorName(selectedPolicy);
    // Create transaction record
    const { error: txError } = await supabase.from("transactions").insert([{
      id: `TXN-${Math.floor(Math.random() * 1000000)}`,
      date,
      type: "Payment",
      entityType: "Vendor",
      entityName: vendorName || "Unknown",
      amount,
      paymentMode: mode,
      notes: JSON.stringify({
        _isMeta: true,
        module: "Insurance",
        text: `Vendor payment for policy ${selectedPolicy.policy_number}`,
        createdBy: auth?.name || "Unknown",
        reference,
        status: "Completed",
        invoiceId: selectedPolicy.policy_number || selectedPolicy.id,
      })
    }]);

    if (txError) throw txError;

    // Update policy record
    const newVendPaid = (Number(selectedPolicy.vendor_paid) || 0) + amount;
    const custPaid = Number(selectedPolicy.customer_paid) || 0;
    const newProfit = custPaid - newVendPaid;

    const { error: policyError } = await supabase.from("insurance_policies")
      .update({ 
        vendor_paid: newVendPaid,
        profit: newProfit
      })
      .eq("id", selectedPolicy.id);

    if (policyError) throw policyError;

    // Update local state
    if (setPolicies) {
      setPolicies((prev: any[]) => prev.map(p => 
        p.id === selectedPolicy.id 
          ? { ...p, vendor_paid: newVendPaid, profit: newProfit } 
          : p
      ));
    }
  };

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
                <th className="px-6 py-4">Vehicle No.</th>
                <th className="px-6 py-4">Customer Name</th>
                <th className="px-6 py-4 text-right">Pending Amounts</th>
                <th className="px-6 py-4 text-right">Paid Amounts</th>
                <th className="px-6 py-4 text-right">Total Balance</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {policies.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                    No vendor records found.
                  </td>
                </tr>
              ) : (
                policies.sort((a, b) => new Date(b.issue_date || 0).getTime() - new Date(a.issue_date || 0).getTime()).map((p) => {
                  const vendPaid = Number(p.vendor_paid) || 0;
                  const profit = Number(p.profit) || 0;
                  const total = Number(p.total_premium) || 0;
                  
                  return (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{getVendorName(p) || "Unknown"}</p>
                      </td>
                      <td className="px-6 py-4 font-medium text-blue-600 dark:text-blue-400">
                        {p.vehicle_number || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-foreground">{p.customer_name || "Unknown"}</p>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-rose-600 dark:text-rose-500">
                        -
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-amber-600 dark:text-amber-500">
                        {formatINR(vendPaid)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-emerald-600 dark:text-emerald-500">
                        {formatINR(total)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${p.payment_status === 'Full Paid' ? 'bg-emerald-500/10 text-emerald-500' : p.payment_status === 'Partial' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {p.payment_status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button size="sm" variant="outline" onClick={() => setSelectedPolicy(p)} className="h-8">
                          <Plus className="h-4 w-4 mr-1" />
                          Pay Vendor
                        </Button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {selectedPolicy && (
        <InsurancePaymentModal
          isOpen={!!selectedPolicy}
          onClose={() => setSelectedPolicy(null)}
          title={`Pay Vendor: ${getVendorName(selectedPolicy) || 'Unknown'}`}
          maxAmount={0} // No max amount for vendors as we don't have expected total
          onSubmit={handleSavePayment}
        />
      )}
    </div>
  );
}
