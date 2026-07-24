import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export interface InsurancePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  maxAmount: number;
  onSubmit: (amount: number, date: string, mode: string, reference: string, nextFollowUp?: string) => Promise<void>;
}

export function InsurancePaymentModal({ isOpen, onClose, title, maxAmount, onSubmit }: InsurancePaymentModalProps) {
  const [amount, setAmount] = useState<string>(maxAmount > 0 ? String(maxAmount) : "");
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState<string>("Bank Transfer");
  const [reference, setReference] = useState<string>("");
  const [nextFollowUp, setNextFollowUp] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const numAmount = Number(amount) || 0;
  const isPartial = maxAmount > 0 && numAmount < maxAmount;

  const handleSubmit = async () => {
    if (!numAmount || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(numAmount, date, mode, reference, isPartial ? nextFollowUp : undefined);
      toast.success("Payment recorded successfully");
      onClose();
      // Reset
      setAmount("");
      setReference("");
      setNextFollowUp("");
    } catch (e: any) {
      toast.error(e.message || "Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Amount</Label>
            <Input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)} 
              placeholder={`Max: ₹${maxAmount}`} 
            />
          </div>
          <div className="space-y-2">
            <Label>Payment Date</Label>
            <Input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
            />
          </div>
          <div className="space-y-2">
            <Label>Payment Mode</Label>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
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
            <Label>Reference / Notes (Optional)</Label>
            <Input 
              value={reference} 
              onChange={e => setReference(e.target.value)} 
              placeholder="e.g. UTR Number" 
            />
          </div>
          
          {isPartial && (
            <div className="space-y-2 pt-2 border-t border-border">
              <Label className="text-amber-600 dark:text-amber-500 font-semibold flex items-center gap-2">
                Partial Payment Detected
              </Label>
              <p className="text-xs text-muted-foreground mb-2">Set a follow-up date for the remaining balance.</p>
              <div className="space-y-2">
                <Label>Next Follow-up Date (Optional)</Label>
                <Input 
                  type="date" 
                  value={nextFollowUp} 
                  onChange={e => setNextFollowUp(e.target.value)} 
                />
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
