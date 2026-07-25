import React, { useState } from "react";
import { formatINR } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
import { Plus, ChevronDown, Search } from "lucide-react";
import { InsurancePaymentModal } from "./InsurancePaymentModal";
import { supabase } from "@/lib/supabase";
import { getAuth } from "@/lib/auth";
import { Input } from "@/components/ui/input";

export function InsuranceVendorStatusView({ policies, vendors, setPolicies }: { policies: any[], vendors: any[], setPolicies: any }) {
  const auth = getAuth();
  const [selectedPolicy, setSelectedPolicy] = useState<any>(null);
  const [expandedVendor, setExpandedVendor] = useState<string | null>(null);
  const [vendorSearchQuery, setVendorSearchQuery] = useState("");

  const getVendorName = (p: any) => p.vendor_id === "other" ? (p.custom_vendor || "Other") : (vendors.find(v => v.id === p.vendor_id)?.name || p.vendor_id);

  const vendorStats = policies.reduce((acc, p) => {
    const vendPaid = Number(p.vendor_paid) || 0;
    const total = Number(p.total_premium) || 0;
    const pending = total - vendPaid;
    return {
      totalPaid: acc.totalPaid + vendPaid,
      totalPending: acc.totalPending + (pending > 0 ? pending : 0)
    };
  }, { totalPaid: 0, totalPending: 0 });

  const handleSavePayment = async (amount: number, date: string, mode: string, reference: string) => {
    if (!selectedPolicy) return;

    // Create payment transaction
    const { error: txError } = await supabase.from("transactions").insert([{
      id: `TXN-${Math.floor(Math.random() * 1000000)}`,
      date,
      type: "Payment",
      entityType: "Vendor",
      entityName: getVendorName(selectedPolicy),
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

  // Group policies by vendor
  const allVendorNames = new Set<string>();
  policies.forEach(p => {
    const name = getVendorName(p);
    if (name) allVendorNames.add(name);
  });

  const uniqueVendors = Array.from(allVendorNames)
    .filter(Boolean)
    .filter(name => name.toLowerCase().includes(vendorSearchQuery.toLowerCase()))
    .sort();

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
          <p className="text-sm font-medium text-muted-foreground mb-2">Total Pending Amounts</p>
          <h3 className="text-3xl font-bold text-rose-600 dark:text-rose-500">{formatINR(vendorStats.totalPending)}</h3>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendors..."
            className="pl-9 bg-background/50"
            value={vendorSearchQuery}
            onChange={(e) => setVendorSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground font-semibold">
              <tr>
                <th className="px-6 py-4 rounded-tl-xl w-10"></th>
                <th className="px-6 py-4">Vendor Name</th>
                <th className="px-6 py-4">Policies</th>
                <th className="px-6 py-4">Payments Pending</th>
                <th className="px-6 py-4">Payments (Out)</th>
                <th className="px-6 py-4 text-right rounded-tr-xl">Total Balance</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {uniqueVendors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-2">
                      <Search className="h-8 w-8 opacity-20" />
                      <p>No vendors found.</p>
                    </div>
                  </td>
                </tr>
              ) : uniqueVendors.map((vendorName, index) => {
                const vendorId = vendorName; // We use the name as ID here since we don't always have a strict vendor object
                const isExpanded = expandedVendor === vendorId;
                
                const vPolicies = policies.filter(p => getVendorName(p) === vendorName);
                const vTotalBilled = vPolicies.reduce((sum, p) => sum + (Number(p.total_premium) || 0), 0);
                const vSpend = vPolicies.reduce((sum, p) => sum + (Number(p.vendor_paid) || 0), 0);
                const vPending = vTotalBilled - vSpend;
                
                const customerSet = new Set<string>();
                vPolicies.forEach(p => {
                  if (p.customer_name) customerSet.add(p.customer_name);
                });
                const vCustomers = Array.from(customerSet);
                
                return (
                  <React.Fragment key={vendorId}>
                    <tr 
                      onClick={() => setExpandedVendor(isExpanded ? null : vendorId)}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                      </td>
                      <td className="px-6 py-4 font-bold text-foreground">
                        {vendorName}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium">{vPolicies.length} Total</span>
                      </td>
                      <td className="px-6 py-4 font-bold text-rose-600 dark:text-rose-500">
                        {formatINR(vPending > 0 ? vPending : 0)}
                      </td>
                      <td className="px-6 py-4 font-medium text-emerald-600 dark:text-emerald-500">
                        {formatINR(vSpend)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium text-foreground">
                        {formatINR(vTotalBilled)}
                      </td>
                      <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button size="sm" variant="outline" onClick={() => setSelectedPolicy(vPolicies[0])} className="h-8">
                          <Plus className="h-4 w-4 mr-1" />
                          Pay Vendor
                        </Button>
                      </td>
                    </tr>
                    
                    {isExpanded && (
                      <tr className="bg-secondary/5 border-b border-border">
                        <td colSpan={7} className="p-0">
                          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 animate-in slide-in-from-top-2 duration-200">
                            {/* Policies List */}
                            <div className="bg-background rounded-xl border border-border p-4 space-y-3">
                              <h4 className="font-semibold flex justify-between items-center text-sm">
                                <span>Policies via Vendor</span>
                                <span className="bg-secondary px-2 py-0.5 rounded-full text-[10px]">{vPolicies.length}</span>
                              </h4>
                              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                                {vPolicies.length > 0 ? vPolicies.map((p, i) => (
                                  <div key={i} className="text-xs p-2 rounded-lg border border-border/50 bg-secondary/10">
                                    <div className="flex justify-between items-start mb-1">
                                      <span className="font-medium text-blue-600 dark:text-blue-400">{p.vehicle_number || "No Vehicle No."}</span>
                                      <span className={`text-[9px] px-1.5 py-0.5 rounded-sm ${p.payment_status === 'Full Paid' ? 'bg-emerald-500/10 text-emerald-500' : p.payment_status === 'Partial' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                        {p.payment_status || "Pending"}
                                      </span>
                                    </div>
                                    <div className="flex justify-between mt-1">
                                      <span className="text-muted-foreground">{p.customer_name || "Unknown"}</span>
                                      <span className="text-muted-foreground">{p.issue_date || "-"}</span>
                                    </div>
                                  </div>
                                )) : <div className="text-xs text-muted-foreground italic">No policies found for this vendor.</div>}
                              </div>
                            </div>
                            
                            {/* Customers List */}
                            <div className="bg-background rounded-xl border border-border p-4 space-y-3">
                              <h4 className="font-semibold flex justify-between items-center text-sm">
                                <span>Associated Customers</span>
                                <span className="bg-secondary px-2 py-0.5 rounded-full text-[10px]">{vCustomers.length}</span>
                              </h4>
                              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                                {vCustomers.length > 0 ? vCustomers.map((cust, i) => (
                                  <div key={i} className="text-xs p-2 rounded-lg border border-border/50 bg-secondary/10 font-medium flex justify-between items-center gap-2">
                                    <span>{cust}</span>
                                    <div className="text-[9px] bg-secondary px-1.5 py-0.5 rounded-full text-muted-foreground">
                                      {vPolicies.filter(p => p.customer_name === cust).length} Policies
                                    </div>
                                  </div>
                                )) : <div className="text-xs text-muted-foreground italic">No customers found for this vendor.</div>}
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
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
