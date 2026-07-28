import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { formatINR } from "@/lib/mock-data";
import { History } from "lucide-react";

export interface InsurancePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  maxAmount: number;
  policy?: any;
  onSubmit: (amount: number, date: string, mode: string, reference: string, nextFollowUp?: string, rcFile?: File | null, insuranceDoc?: File | null, remark?: string) => Promise<void>;
}

export function InsurancePaymentModal({ isOpen, onClose, title, maxAmount, policy, onSubmit }: InsurancePaymentModalProps) {
  const [amount, setAmount] = useState<string>(maxAmount > 0 ? String(maxAmount) : "");
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [mode, setMode] = useState<string>("Bank Transfer");
  const [reference, setReference] = useState<string>("");
  const [nextFollowUp, setNextFollowUp] = useState<string>("");
  const [rcFile, setRcFile] = useState<File | null>(null);
  const [insuranceDoc, setInsuranceDoc] = useState<File | null>(null);
  const [remark, setRemark] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (!isOpen || !policy) return;
    setLoadingHistory(true);
    (async () => {
      const policyRef = policy.policy_number || policy.id;
      const customerName = policy.customer_name || "";
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .order("date", { ascending: false });

      if (error) {
        setTransactions([]);
      } else {
        const filtered = (data || []).filter((tx: any) => {
          const notesStr = typeof tx.notes === "string" ? tx.notes : "";
          
          let meta: any = {};
          if (notesStr) {
            try {
              const parsed = JSON.parse(notesStr);
              if (parsed._isMeta) meta = parsed;
            } catch { }
          }

          const matchesPolicyInNotes = policyRef ? notesStr.includes(policyRef) : false;
          const matchesInvoiceId = 
            (policyRef && meta.invoiceId === policyRef) || 
            (policy.id && meta.invoiceId === policy.id) || 
            (policy.policy_number && meta.invoiceId === policy.policy_number);
          
          return matchesPolicyInNotes || matchesInvoiceId;
        });
        setTransactions(filtered);
      }
      setLoadingHistory(false);
    })();
  }, [isOpen, policy]);

  const numAmount = Number(amount) || 0;
  const isPartial = maxAmount > 0 && numAmount < maxAmount;

  const handleSubmit = async () => {
    if (!numAmount || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(numAmount, date, mode, reference, isPartial ? nextFollowUp : undefined, rcFile, insuranceDoc, remark);
      toast.success("Payment recorded successfully");
      onClose();
      // Reset
      setAmount("");
      setReference("");
      setNextFollowUp("");
      setRcFile(null);
      setInsuranceDoc(null);
      setRemark("");
    } catch (e: any) {
      toast.error(e.message || "Failed to record payment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const parseNotes = (notes: any) => {
    if (!notes) return {};
    if (typeof notes === "string") {
      try {
        const parsed = JSON.parse(notes);
        if (parsed._isMeta) return parsed;
      } catch { }
    }
    return {};
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 py-2">
          <div className="space-y-4">
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
              <Label>Reference (Optional)</Label>
              <Input 
                value={reference} 
                onChange={e => setReference(e.target.value)} 
                placeholder="e.g. UTR Number" 
              />
            </div>
            <div className="space-y-2">
              <Label>Remark</Label>
              <Input 
                value={remark} 
                onChange={e => setRemark(e.target.value)} 
                placeholder="Add your remarks here..." 
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

          {policy && (
            <div className="border-t border-border pt-4 mt-2">
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <History className="h-4 w-4" />
                Payment History
              </h4>
              <div className="space-y-2">
                {loadingHistory ? (
                   <p className="text-xs text-muted-foreground">Loading history...</p>
                ) : transactions.length === 0 ? (
                   <p className="text-xs text-muted-foreground pb-2">No past payments found.</p>
                ) : (
                   transactions.map((tx, idx) => {
                     const meta = parseNotes(tx.notes);
                     const tMode = meta.paymentMode || tx.paymentMode || tx.payment_mode || "—";
                     const ref = meta.reference || tx.reference || "—";
                     const createdBy = meta.createdBy || "";
                     const tAmount = Number(tx.amount) || 0;

                     return (
                       <div key={tx.id || idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                         <div className="flex-1 min-w-0">
                           <div className="flex items-center justify-between">
                             <p className="text-sm font-semibold text-foreground">{formatINR(tAmount)}</p>
                             <span className="text-[10px] text-muted-foreground">{tx.date || "—"}</span>
                           </div>
                           <div className="flex items-center gap-2 mt-1">
                             <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-500/10 text-blue-600">{tMode}</span>
                             {ref !== "—" && <span className="text-[10px] text-muted-foreground truncate">Ref: {ref}</span>}
                           </div>
                           {createdBy && <p className="text-[10px] text-muted-foreground mt-1">By: {createdBy}</p>}
                         </div>
                       </div>
                     )
                   })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t border-border mt-auto">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Payment"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
