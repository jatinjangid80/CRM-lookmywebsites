import { useState } from "react";
import { formatINR } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { InsurancePaymentModal } from "./InsurancePaymentModal";
import { supabase } from "@/lib/supabase";
import { getAuth } from "@/lib/auth";

export function InsuranceCustomerStatusView({ policies, setPolicies }: { policies: any[], setPolicies: any }) {
  const auth = getAuth();
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);

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

  const handleSavePayment = async (amount: number, date: string, mode: string, reference: string, nextFollowUp?: string) => {
    if (!selectedPolicy) return;
    
    // Create transaction record
    const { error: txError } = await supabase.from("transactions").insert([{
      id: `TXN-${Math.floor(Math.random() * 1000000)}`,
      date,
      type: "Payment",
      entityType: "Customer",
      entityName: selectedPolicy.customer_name || "Unknown",
      amount,
      paymentMode: mode,
      notes: JSON.stringify({
        _isMeta: true,
        module: "Insurance",
        text: `Customer payment for policy ${selectedPolicy.policy_number}`,
        createdBy: auth?.name || "Unknown",
        reference,
        status: "Completed",
        invoiceId: selectedPolicy.policy_number || selectedPolicy.id,
      })
    }]);

    if (txError) throw txError;

    // Update policy record
    const newPaid = (Number(selectedPolicy.customer_paid) || Number(selectedPolicy.amount_paid) || 0) + amount;
    const total = Number(selectedPolicy.total_premium) || 0;
    
    let newStatus = "Pending";
    if (newPaid > 0) {
      newStatus = newPaid >= total ? "Full Paid" : "Partial";
    }

    const { error: policyError } = await supabase.from("insurance_policies")
      .update({ 
        customer_paid: newPaid, 
        amount_paid: newPaid,
        payment_status: newStatus 
      })
      .eq("id", selectedPolicy.id);

    if (policyError) throw policyError;

    if (newStatus === "Partial" && nextFollowUp) {
      const pendingAmount = total - newPaid;
      await supabase.from("payment_followups").insert([{
        invoiceId: selectedPolicy.policy_number || selectedPolicy.id,
        customerId: "",
        customerName: selectedPolicy.customer_name || "Unknown",
        customerPhone: selectedPolicy.mobile_number || "",
        invoiceDate: selectedPolicy.issue_date || new Date().toISOString().split('T')[0],
        totalAmount: total,
        pendingAmount: pendingAmount,
        nextFollowUpDate: nextFollowUp,
        nextFollowUpTime: "10:00",
        status: "Pending",
        notes: `Follow-up for General Insurance policy ${selectedPolicy.policy_number || ""}`,
        createdBy: auth?.name || "Unknown"
      }]);
    }

    if (policyError) throw policyError;

    // Update local state
    if (setPolicies) {
      setPolicies((prev: any[]) => prev.map(p => 
        p.id === selectedPolicy.id 
          ? { ...p, customer_paid: newPaid, amount_paid: newPaid, payment_status: newStatus } 
          : p
      ));
    }
  };

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
                <th className="px-6 py-4">Vehicle No.</th>
                <th className="px-6 py-4">School Name</th>
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
                        {p.vehicle_number || "-"}
                      </td>
                      <td className="px-6 py-4 font-medium text-foreground">
                        {p.school_name || "-"}
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-rose-600 dark:text-rose-500">
                        {formatINR(pending > 0 ? pending : 0)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-emerald-600 dark:text-emerald-500">
                        {formatINR(paid)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-foreground">
                        {formatINR(total)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${p.payment_status === 'Full Paid' ? 'bg-emerald-500/10 text-emerald-500' : p.payment_status === 'Partial' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {p.payment_status || "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {pending > 0 && (
                          <Button size="sm" variant="outline" onClick={() => setSelectedPolicy(p)} className="h-8">
                            <Plus className="h-4 w-4 mr-1" />
                            Pay
                          </Button>
                        )}
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
          title={`Add Customer Payment: ${selectedPolicy.customer_name || 'Unknown'}`}
          maxAmount={(Number(selectedPolicy.total_premium) || 0) - (Number(selectedPolicy.customer_paid) || Number(selectedPolicy.amount_paid) || 0)}
          onSubmit={handleSavePayment}
        />
      )}
    </div>
  );
}
