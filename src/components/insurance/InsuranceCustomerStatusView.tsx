import { useState } from "react";
import { formatINR } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { InsurancePaymentModal } from "./InsurancePaymentModal";
import { supabase } from "@/lib/supabase";
import { getAuth } from "@/lib/auth";

export function InsuranceCustomerStatusView({ policies, setPolicies }: { policies: any[], setPolicies: any }) {
  const auth = getAuth();
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");

  const customerStats = policies.reduce((acc, p) => {
    const customerPaidAmount = Number(p.customer_paid) || 0;
    const addPayment = Number(p.amount_paid) || 0;
    const outstanding = Math.max(customerPaidAmount - addPayment, 0);
    return {
      total: acc.total + customerPaidAmount,
      paid: acc.paid + addPayment,
      pending: acc.pending + outstanding
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
    const customerPaidAmount = Number(selectedPolicy.customer_paid) || 0;
    const currentAddPayment = Number(selectedPolicy.amount_paid) || 0;
    const newAddPayment = currentAddPayment + amount;
    
    const outstanding = Math.max(customerPaidAmount - newAddPayment, 0);

    let newStatus = "Pending";
    if (outstanding === 0) {
      newStatus = "Full Paid";
    } else if (newAddPayment > 0) {
      newStatus = "Partial";
    }

    const { error: policyError } = await supabase.from("insurance_policies")
      .update({
        amount_paid: newAddPayment,
        payment_status: newStatus
      })
      .eq("id", selectedPolicy.id);

    if (policyError) {
      console.error("Error updating policy:", policyError);
      throw policyError;
    }

    if (newStatus === "Partial" && nextFollowUp) {
      await supabase.from("payment_followups").insert([{
        invoiceId: selectedPolicy.policy_number || selectedPolicy.id,
        customerId: "",
        customerName: selectedPolicy.customer_name || "Unknown",
        customerPhone: selectedPolicy.mobile_number || "",
        invoiceDate: selectedPolicy.issue_date || new Date().toISOString().split('T')[0],
        totalAmount: customerPaidAmount,
        pendingAmount: outstanding,
        nextFollowUpDate: nextFollowUp,
        nextFollowUpTime: "10:00",
        status: "Pending",
        notes: `Follow-up for General Insurance policy ${selectedPolicy.policy_number || ""}`,
        createdBy: auth?.name || "Unknown"
      }]);
    }

    // Update local state
    if (setPolicies) {
      setPolicies((prev: any[]) => prev.map(p =>
        p.id === selectedPolicy.id
          ? { ...p, amount_paid: newAddPayment, payment_status: newStatus }
          : p
      ));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Customer Amount</p>
          <h3 className="text-3xl font-bold text-foreground">{formatINR(customerStats.total)}</h3>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Paid (Add Payment)</p>
          <h3 className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">{formatINR(customerStats.paid)}</h3>
        </div>

        <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Outstanding</p>
          <h3 className="text-3xl font-bold text-rose-600 dark:text-rose-500">{formatINR(customerStats.pending)}</h3>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-9 bg-background/50"
            value={customerSearchQuery}
            onChange={(e) => setCustomerSearchQuery(e.target.value)}
          />
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

                <th className="px-6 py-4 text-right">Customer Paid Amount</th>
                <th className="px-6 py-4 text-right">Add Payment</th>
                <th className="px-6 py-4 text-right">Total Outstanding</th>
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
                policies
                  .filter(p => p.customer_name?.toLowerCase().includes(customerSearchQuery.toLowerCase()))
                  .sort((a, b) => new Date(b.issue_date || 0).getTime() - new Date(a.issue_date || 0).getTime())
                  .map((p) => {
                    const customerPaidAmount = Number(p.customer_paid) || 0;
                    const addPayment = Number(p.amount_paid) || 0;
                    const outstanding = Math.max(customerPaidAmount - addPayment, 0);

                    const status = outstanding === 0 ? "Full Paid" : addPayment > 0 ? "Partial" : "Pending";

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


                        <td className="px-6 py-4 text-right font-medium text-foreground">
                          {formatINR(customerPaidAmount)}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-emerald-600 dark:text-emerald-500">
                          {formatINR(addPayment)}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-foreground">
                          {formatINR(outstanding)}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${status === 'Full Paid' ? 'bg-emerald-500/10 text-emerald-500' : status === 'Partial' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                            {status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          {outstanding > 0 && (
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
          maxAmount={Math.max((Number(selectedPolicy.customer_paid) || 0) - (Number(selectedPolicy.amount_paid) || 0), 0)}
          onSubmit={handleSavePayment}
        />
      )}
    </div>
  );
}
