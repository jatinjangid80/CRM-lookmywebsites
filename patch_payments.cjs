const fs = require('fs');
let code = fs.readFileSync('src/routes/crm.payments.tsx', 'utf8');

// 1. Add imports
code = code.replace(
  'import { type Booking } from "@/lib/mock-data";',
  'import { type Booking, type PaymentFollowUp, paymentFollowUps } from "@/lib/mock-data";\nimport { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";\nimport { Calendar, PhoneCall, Repeat, CheckCircle } from "lucide-react";'
);

// 2. Add state hooks inside PaymentsPage
const stateHookLocation = 'const [newInvoice, setNewInvoice] = useState({';
const followUpState = `
  const [followUps, setFollowUps] = useSupabaseTable<PaymentFollowUp[]>("payment_followups", paymentFollowUps);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [selectedFollowUpTarget, setSelectedFollowUpTarget] = useState<Booking | null>(null);
  const [followUpForm, setFollowUpForm] = useState({
    partialAmount: 0,
    nextFollowUpDate: new Date().toISOString().split("T")[0],
    nextFollowUpTime: "10:00",
    notificationReminder: 7,
    repeat: "Daily" as "None" | "Daily" | "Weekly",
    notes: "",
  });

  const handleOpenFollowUp = (booking: Booking) => {
    setSelectedFollowUpTarget(booking);
    setFollowUpForm({
      partialAmount: 0,
      nextFollowUpDate: new Date().toISOString().split("T")[0],
      nextFollowUpTime: "10:00",
      notificationReminder: 7,
      repeat: "Daily",
      notes: "",
    });
    setIsFollowUpModalOpen(true);
  };

  const handleSaveFollowUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFollowUpTarget) return;

    // Update booking paid amount
    const updatedPaid = selectedFollowUpTarget.paid + followUpForm.partialAmount;
    
    // Update local payments
    setPayments(payments.map(p => 
      p.id === selectedFollowUpTarget.id ? { ...p, paid: updatedPaid } : p
    ));

    const newFU: PaymentFollowUp = {
      id: "PFU-" + Math.floor(1000 + Math.random() * 9000),
      invoiceId: selectedFollowUpTarget.id,
      customerId: "C-000",
      customerName: selectedFollowUpTarget.customer,
      customerPhone: selectedFollowUpTarget.mobileNumber || "9876543210",
      invoiceDate: selectedFollowUpTarget.bookingDate,
      totalAmount: selectedFollowUpTarget.amount,
      pendingAmount: selectedFollowUpTarget.amount - updatedPaid,
      nextFollowUpDate: followUpForm.nextFollowUpDate,
      nextFollowUpTime: followUpForm.nextFollowUpTime,
      repeat: followUpForm.repeat,
      notificationReminder: followUpForm.notificationReminder,
      notes: followUpForm.notes,
    };
    setFollowUps([newFU, ...followUps]);
    setIsFollowUpModalOpen(false);
  };
`;
code = code.replace(stateHookLocation, followUpState + '\n  ' + stateHookLocation);

// 3. Wrap return in Tabs
const returnStart = 'return (\n    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">';
const wrappedReturnStart = `return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage invoices, receipts, and track pending balances.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="btn-hero gap-2 rounded-xl shadow-lg shadow-primary/25"
        >
          <Plus className="h-4 w-4" /> Create Invoice
        </Button>
      </div>

      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList className="bg-secondary/40 border border-border p-1 rounded-xl">
          <TabsTrigger value="invoices" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            Invoices & Ledger
          </TabsTrigger>
          <TabsTrigger value="followups" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            Payment Follow-Ups
          </TabsTrigger>
        </TabsList>
        <TabsContent value="invoices" className="m-0 space-y-8">
`;
code = code.replace(
  `return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage invoices, receipts, and track pending balances.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="btn-hero gap-2 rounded-xl shadow-lg shadow-primary/25"
        >
          <Plus className="h-4 w-4" /> Create Invoice
        </Button>
      </div>`,
  wrappedReturnStart
);

// 4. Add action button to Invoices table for "Add Follow-up"
const existingActions = `
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewingInvoice(b)}
`;
const newAction = `
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenFollowUp(b)}
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors opacity-0 group-hover:opacity-100"
                          title="Log Follow-Up & Partial Payment"
                        >
                          <PhoneCall className="h-4 w-4" />
                        </Button>
`;
code = code.replace(existingActions, newAction + existingActions);


// 5. Add follow-up tab content
const followUpContent = `
        </TabsContent>

        {/* FOLLOW UPS TAB */}
        <TabsContent value="followups" className="m-0 space-y-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-2xl border border-blue-500/20 bg-card p-6 shadow-sm flex items-center gap-4">
              <div className="inline-flex rounded-xl bg-blue-500/10 p-3">
                <Calendar className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Active Follow-ups</p>
                <p className="font-display text-2xl font-bold mt-1">{followUps.filter(f => f.pendingAmount > 0).length}</p>
              </div>
            </div>
            <div className="rounded-2xl border border-rose-500/20 bg-card p-6 shadow-sm flex items-center gap-4">
              <div className="inline-flex rounded-xl bg-rose-500/10 p-3">
                <AlertCircle className="h-6 w-6 text-rose-500" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Pending Amount (Follow-Ups)</p>
                <p className="font-display text-2xl font-bold mt-1">{formatINR(followUps.reduce((sum, f) => sum + f.pendingAmount, 0))}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">Customer & Invoice</th>
                    <th className="px-6 py-4">Pending</th>
                    <th className="px-6 py-4">Next Follow-Up</th>
                    <th className="px-6 py-4">Repeat</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {followUps.filter(f => f.pendingAmount > 0).map(f => (
                    <tr key={f.id} className="transition-colors hover:bg-secondary/30 group">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 dark:text-slate-100">{f.customerName}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">INV-{f.invoiceId.replace("BK-", "").replace("LD-", "")} • {f.invoiceDate}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-rose-600 dark:text-rose-400">{formatINR(f.pendingAmount)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-primary/70" />
                          <span className="font-medium">{f.nextFollowUpDate} at {f.nextFollowUpTime}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-xs font-semibold bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                          <Repeat className="h-3 w-3" />
                          {f.repeat} (Remind {f.notificationReminder}d before)
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const msg = \`Dear \${f.customerName},\\n\\nThis is a friendly reminder for the pending payment balance of \${formatINR(f.pendingAmount)} on your invoice INV-\${f.invoiceId.replace("BK-", "").replace("LD-", "")} dated \${f.invoiceDate}. Please make the payment at your earliest convenience.\\n\\nWarm regards,\\nLook My Holidays\`;
                            window.open(\`https://wa.me/\${f.customerPhone}?text=\${encodeURIComponent(msg)}\`, "_blank");
                          }}
                          className="h-8 gap-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors"
                        >
                          <Share2 className="h-4 w-4" /> WhatsApp Reminder
                        </Button>
                      </td>
                    </tr>
                  ))}
                  {followUps.filter(f => f.pendingAmount > 0).length === 0 && (
                     <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                        No active payment follow-ups found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
`;

code = code.replace(
  '      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>',
  followUpContent + '\n      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>'
);

// 6. Add Follow-Up Modal
const modalHtml = `
      {/* ── Follow Up Modal ──────────────────── */}
      <Dialog open={isFollowUpModalOpen} onOpenChange={setIsFollowUpModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Log Payment Follow-Up</DialogTitle>
            <DialogDescription>
              Record a partial payment and schedule the next follow-up reminder for {selectedFollowUpTarget?.customer}.
            </DialogDescription>
          </DialogHeader>
          {selectedFollowUpTarget && (
            <form onSubmit={handleSaveFollowUp} className="space-y-4 py-4">
               <div className="bg-rose-500/10 p-4 rounded-xl border border-rose-500/20 mb-4 flex justify-between items-center">
                  <span className="text-sm font-semibold text-rose-700">Current Pending Amount:</span>
                  <span className="font-display font-bold text-xl text-rose-700">
                    {formatINR(selectedFollowUpTarget.amount - selectedFollowUpTarget.paid)}
                  </span>
               </div>
               
               <div className="space-y-2">
                <Label htmlFor="partialAmount">Partial Amount Received (₹)</Label>
                <Input
                  id="partialAmount"
                  type="number"
                  min="0"
                  max={selectedFollowUpTarget.amount - selectedFollowUpTarget.paid}
                  value={followUpForm.partialAmount || ""}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, partialAmount: Number(e.target.value) })}
                  placeholder="e.g. 5000"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nextFollowUpDate">Next Follow-Up Date</Label>
                  <Input
                    id="nextFollowUpDate"
                    type="date"
                    required
                    value={followUpForm.nextFollowUpDate}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, nextFollowUpDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nextFollowUpTime">Time</Label>
                  <Input
                    id="nextFollowUpTime"
                    type="time"
                    required
                    value={followUpForm.nextFollowUpTime}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, nextFollowUpTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="repeat">Repeat Interval</Label>
                  <select
                    id="repeat"
                    value={followUpForm.repeat}
                    onChange={(e) => setFollowUpForm({ ...followUpForm, repeat: e.target.value as any })}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="None">No Repeat</option>
                    <option value="Daily">Daily</option>
                    <option value="Weekly">Weekly</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notificationReminder">Notification Reminder</Label>
                  <div className="relative">
                     <Input
                        id="notificationReminder"
                        type="number"
                        min="1"
                        value={followUpForm.notificationReminder}
                        onChange={(e) => setFollowUpForm({ ...followUpForm, notificationReminder: Number(e.target.value) })}
                     />
                     <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground font-semibold">days before</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Follow-Up Notes</Label>
                <Input
                  id="notes"
                  placeholder="e.g. Promised to pay remaining by Friday"
                  value={followUpForm.notes}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, notes: e.target.value })}
                />
              </div>

              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsFollowUpModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save Follow-Up</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
`;

code = code.replace(
  '    </div>\n  );\n}',
  modalHtml + '\n    </div>\n  );\n}'
);


fs.writeFileSync('src/routes/crm.payments.tsx', code);
