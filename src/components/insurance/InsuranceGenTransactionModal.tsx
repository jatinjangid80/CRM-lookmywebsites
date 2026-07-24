import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { getAuth } from "@/lib/auth";

export function InsuranceGenTransactionModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
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
  });

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
      });
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
        
        <div className="grid grid-cols-2 gap-4 py-4">
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
            <Label>Policy No. / Ref (Optional)</Label>
            <Input 
              value={newTx.invoiceId} 
              onChange={e => setNewTx({ ...newTx, invoiceId: e.target.value })} 
              placeholder="Policy ID to link" 
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
