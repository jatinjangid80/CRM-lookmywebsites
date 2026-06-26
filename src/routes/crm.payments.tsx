import { createFileRoute } from "@tanstack/react-router";
import { CreditCard, AlertCircle, CheckCircle2, Plus, Trash2, Search } from "lucide-react";
import { bookings, formatINR } from "@/lib/mock-data";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { useLocalStorage } from "@/lib/use-local-storage";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { type Booking } from "@/lib/mock-data";

export const Route = createFileRoute("/crm/payments")({ component: PaymentsPage });

function PaymentsPage() {
  const [payments, setPayments] = useLocalStorage<Booking[]>("crm_bookings", bookings);
  const [leads] = useLocalStorage<any[]>("crm_leads_v2", []);

  const allPayments = useMemo(() => {
    const derived = leads
      .filter((l: any) => l.totalAmount)
      .map((l: any) => ({
        id: "LD-" + l.id.replace("L-", ""),
        bookingType: (l.service || "Holiday Package") as unknown as Booking["bookingType"],
        supplier: l.vendorName || "Not Assigned",
        bookingDate: l.createdAt,
        customer: l.name,
        mobileNumber: l.phone,
        bookedBy: l.assignedTo || "Admin",
        company: l.clientCompany || "",
        reference: l.bookingReference || "",
        saleInvoiceNo: "",
        purchaseInvoiceNo: "",
        remarks: l.notes || "",
        sellingPrice: l.totalAmount || 0,
        purchasePrice: 0,
        profit: 0,
        margin: 0,
        amount: l.totalAmount || 0,
        paid: l.amountPaid || 0,
        paymentMode: ("Card") as "Cash" | "UPI" | "Card" | "Bank Transfer" | "Cheque" | "",
        transactionId: "",
        status: (l.paymentStatus || "Pending"),
        package: l.destination || "Unknown",
        travelDate: l.travelDate || "TBD",
      } as Booking));
    return [...payments, ...derived];
  }, [leads, payments]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newInvoice, setNewInvoice] = useState({
    customer: "",
    package: "",
    travelDate: new Date().toISOString().split("T")[0],
    amount: 0,
    paid: 0,
    status: "Pending" as Booking["status"]
  });

  const filteredPayments = allPayments.filter(p => 
    p.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
    `INV-${p.id.replace("BK-", "")}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = allPayments.reduce((s, b) => s + b.amount, 0);
  const paid = allPayments.reduce((s, b) => s + b.paid, 0);
  const pending = total - paid;
  
  const cards = [
    { label: "Total Invoiced", value: formatINR(total), icon: CreditCard, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { label: "Amount Collected", value: formatINR(paid), icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Pending Balance", value: formatINR(pending), icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  ];

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      setPayments(payments.filter(p => p.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  const handleCreate = () => {
    setIsAddOpen(true);
  };

  const handleSaveInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInvoice.customer || !newInvoice.package) return;

    const invoice: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: newInvoice.customer,
      package: newInvoice.package,
      travelDate: newInvoice.travelDate,
      amount: newInvoice.amount,
      paid: newInvoice.paid,
      status: newInvoice.status,
    } as unknown as Booking;

    setPayments([invoice, ...payments]);
    setIsAddOpen(false);
    setNewInvoice({
      customer: "",
      package: "",
      travelDate: new Date().toISOString().split("T")[0],
      amount: 0,
      paid: 0,
      status: "Pending"
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage invoices, receipts, and track pending balances.</p>
        </div>
        <Button onClick={handleCreate} className="btn-hero gap-2 rounded-xl shadow-lg shadow-primary/25">
          <Plus className="h-4 w-4" /> Create Invoice
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className={`relative overflow-hidden rounded-2xl border ${c.border} bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 group`}>
            <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${c.bg} blur-2xl transition-all group-hover:scale-150`} />
            <div className="relative">
              <div className={`inline-flex rounded-xl ${c.bg} p-3 mb-4`}>
                <c.icon className={`h-6 w-6 ${c.color}`} />
              </div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{c.label}</p>
              <p className="font-display text-3xl font-bold mt-1 tracking-tight">{c.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-secondary/20">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search invoices or customers..." 
              className="pl-9 rounded-xl border-border bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">Invoice</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Paid</th>
                <th className="px-6 py-4">Balance</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No invoices found.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((b) => {
                  const balance = b.amount - b.paid;
                  return (
                    <tr key={b.id} className="transition-colors hover:bg-secondary/30 group">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-medium px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground border border-border">
                          INV-{b.id.replace("BK-", "")}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-semibold">{b.customer}</td>
                      <td className="px-6 py-4 font-medium">{formatINR(b.amount)}</td>
                      <td className="px-6 py-4">
                        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                          {formatINR(b.paid)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${balance > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-muted-foreground'}`}>
                          {formatINR(balance)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleDelete(b.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        title="Delete Invoice"
        description="Are you sure you want to delete this invoice? This action cannot be undone."
      />

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Invoice</DialogTitle>
            <DialogDescription>
              Enter invoice and customer details to create a new record.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveInvoice} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer Name</Label>
              <Input
                id="customer"
                required
                placeholder="e.g. Priya Sharma"
                value={newInvoice.customer}
                onChange={(e) => setNewInvoice({ ...newInvoice, customer: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="package">Package / Service</Label>
              <Input
                id="package"
                required
                placeholder="e.g. Maldives Overwater Bliss"
                value={newInvoice.package}
                onChange={(e) => setNewInvoice({ ...newInvoice, package: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="travelDate">Travel Date</Label>
                <Input
                  id="travelDate"
                  type="date"
                  required
                  value={newInvoice.travelDate}
                  onChange={(e) => setNewInvoice({ ...newInvoice, travelDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={newInvoice.status}
                  onChange={(e) => setNewInvoice({ ...newInvoice, status: e.target.value as Booking["status"] })}
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount">Total Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  min="0"
                  placeholder="e.g. 150000"
                  value={newInvoice.amount || ""}
                  onChange={(e) => setNewInvoice({ ...newInvoice, amount: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paid">Amount Paid (₹)</Label>
                <Input
                  id="paid"
                  type="number"
                  min="0"
                  placeholder="e.g. 50000"
                  value={newInvoice.paid || ""}
                  onChange={(e) => setNewInvoice({ ...newInvoice, paid: Number(e.target.value) })}
                />
              </div>
            </div>
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button type="submit">Create Invoice</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
