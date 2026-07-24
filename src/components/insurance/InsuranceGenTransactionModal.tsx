import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { getAuth } from "@/lib/auth";

export function InsuranceGenTransactionModal({ isOpen, onClose, policies = [] }: { isOpen: boolean, onClose: () => void, policies?: any[] }) {
  const auth = getAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTx, setNewTx] = useState({
    type: "Receipt",
    entityType: "Customer",
    entityName: "",
    invoiceId: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    paymentMode: "Bank Transfer",
    reference: "",
    nextFollowUp: "",
  });

  const [expectedPending, setExpectedPending] = useState(0);

  const handlePolicyChange = (val: string) => {
    setNewTx(prev => {
      const match = policies.find(p => 
        (p.policy_number && p.policy_number.toLowerCase() === val.toLowerCase()) || 
        (p.vehicle_number && p.vehicle_number.toLowerCase() === val.toLowerCase())
      );
      if (match) {
        const total = Number(match.total_premium) || 0;
        const paid = Number(match.customer_paid) || Number(match.amount_paid) || 0;
        const pending = total > paid ? total - paid : 0;
        setExpectedPending(pending);
        
        return {
          ...prev,
          invoiceId: match.policy_number || val, // store policy_number if available, otherwise what they typed
          entityName: match.customer_name || "",
          entityType: "Customer",
          amount: pending > 0 ? String(pending) : prev.amount
        };
      }
      setExpectedPending(0);
      return { ...prev, invoiceId: val };
    });
  };

  const isPartial = expectedPending > 0 && Number(newTx.amount) < expectedPending && newTx.entityType === "Customer" && newTx.type === "Receipt";

  const handleSubmit = async () => {
    const numAmount = Number(newTx.amount);
    if (!numAmount || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (!newTx.entityName) {
      toast.error("Please enter an entity name");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("transactions").insert([{
        date: newTx.date,
        type: newTx.type,
        entityType: newTx.entityType,
        entityName: newTx.entityName,
        amount: numAmount,
        paymentMode: newTx.paymentMode,
        reference: newTx.reference,
        status: "Completed",
        invoiceId: newTx.invoiceId, // Can be policy number
        module: "Insurance",
        notes: JSON.stringify({
          _isMeta: true,
          text: `General Insurance Transaction`,
          createdBy: auth?.name || "Unknown"
        })
      }]);

      if (error) throw error;
      
      // Attempt to auto-update the policy if it's a known policy
      if (newTx.invoiceId) {
        const match = policies.find(p => p.policy_number?.toLowerCase() === newTx.invoiceId.toLowerCase());
        if (match) {
          if (newTx.entityType === "Customer" && newTx.type === "Receipt") {
            const newCustPaid = (Number(match.customer_paid) || Number(match.amount_paid) || 0) + numAmount;
            const total = Number(match.total_premium) || 0;
            let newStatus = "Pending";
            if (newCustPaid > 0) {
              newStatus = newCustPaid >= total ? "Full Paid" : "Partial";
            }
            await supabase.from("insurance_policies")
              .update({ customer_paid: newCustPaid, amount_paid: newCustPaid, payment_status: newStatus })
              .eq("id", match.id);

            if (newStatus === "Partial" && newTx.nextFollowUp) {
              const pendingAmount = total - newCustPaid;
              await supabase.from("payment_followups").insert([{
                invoiceId: match.policy_number || match.id,
                customerId: "",
                customerName: match.customer_name || "Unknown",
                customerPhone: match.mobile_number || "",
                invoiceDate: match.issue_date || new Date().toISOString().split('T')[0],
                totalAmount: total,
                pendingAmount: pendingAmount,
                nextFollowUpDate: newTx.nextFollowUp,
                nextFollowUpTime: "10:00",
                status: "Pending",
                notes: `Follow-up for General Insurance policy ${match.policy_number || ""}`,
                createdBy: auth?.name || "Unknown"
              }]);
            }
          } else if (newTx.entityType === "Vendor" && newTx.type === "Payment") {
            const newVendPaid = (Number(match.vendor_paid) || 0) + numAmount;
            const profit = (Number(match.customer_paid) || 0) - newVendPaid;
            await supabase.from("insurance_policies")
              .update({ vendor_paid: newVendPaid, profit })
              .eq("id", match.id);
          }
        }
      }

      toast.success("Transaction recorded successfully");
      
      // Reset
      setNewTx({
        type: "Receipt",
        entityType: "Customer",
        entityName: "",
        invoiceId: "",
        amount: "",
        date: new Date().toISOString().split('T')[0],
        paymentMode: "Bank Transfer",
        reference: "",
        nextFollowUp: "",
      });
      setExpectedPending(0);
      onClose();
    } catch (e: any) {
      toast.error(e.message || "Failed to record transaction");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Insurance Transaction</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 py-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="space-y-2 col-span-2">
            <Label>Policy No. / Vehicle No. (Optional)</Label>
            <Input 
              list="policy-numbers"
              value={newTx.invoiceId} 
              onChange={e => handlePolicyChange(e.target.value)} 
              placeholder="Type Policy No or Vehicle No to auto-fill..." 
            />
            <datalist id="policy-numbers">
              {policies.flatMap(p => [
                p.policy_number ? <option key={`${p.id}-pol`} value={p.policy_number}>{p.customer_name} (Policy)</option> : null,
                p.vehicle_number ? <option key={`${p.id}-veh`} value={p.vehicle_number}>{p.customer_name} (Vehicle)</option> : null
              ])}
            </datalist>
          </div>
          
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <Select value={newTx.type} onValueChange={v => setNewTx({ ...newTx, type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Receipt">Receipt (Money In)</SelectItem>
                <SelectItem value="Payment">Payment (Money Out)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Entity Type</Label>
            <Select value={newTx.entityType} onValueChange={v => setNewTx({ ...newTx, entityType: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="Vendor">Vendor</SelectItem>
                <SelectItem value="Company">Company</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2 col-span-2">
            <Label>Entity Name</Label>
            <Input 
              value={newTx.entityName} 
              onChange={e => setNewTx({ ...newTx, entityName: e.target.value })} 
              placeholder="e.g. John Doe or LIC" 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input 
              type="number" 
              value={newTx.amount} 
              onChange={e => setNewTx({ ...newTx, amount: e.target.value })} 
              placeholder="₹0.00" 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Payment Mode</Label>
            <Select value={newTx.paymentMode} onValueChange={v => setNewTx({ ...newTx, paymentMode: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                <SelectItem value="Cash">Cash</SelectItem>
                <SelectItem value="Cheque">Cheque</SelectItem>
                <SelectItem value="UPI">UPI</SelectItem>
                <SelectItem value="Credit Card">Credit Card</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Date</Label>
            <Input 
              type="date" 
              value={newTx.date} 
              onChange={e => setNewTx({ ...newTx, date: e.target.value })} 
            />
          </div>
          
          <div className="space-y-2 col-span-2">
            <Label>Reference Notes (Optional)</Label>
            <Input 
              value={newTx.reference} 
              onChange={e => setNewTx({ ...newTx, reference: e.target.value })} 
              placeholder="UTR, Cheque No. or any notes" 
            />
          </div>

          {isPartial && (
            <div className="space-y-2 col-span-2 pt-2 border-t border-border">
              <Label className="text-amber-600 dark:text-amber-500 font-semibold flex items-center gap-2">
                Partial Payment Detected
              </Label>
              <p className="text-xs text-muted-foreground mb-2">Set a follow-up date for the remaining balance.</p>
              <div className="space-y-2">
                <Label>Next Follow-up Date (Optional)</Label>
                <Input 
                  type="date" 
                  value={newTx.nextFollowUp} 
                  onChange={e => setNewTx({ ...newTx, nextFollowUp: e.target.value })} 
                />
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
