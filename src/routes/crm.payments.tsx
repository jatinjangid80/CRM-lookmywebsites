import { createFileRoute } from "@tanstack/react-router";
import {
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Plus,
  Trash2,
  Search,
  Printer,
  QrCode,
  Share2,
  FileText,
} from "lucide-react";
import { bookings, formatINR } from "@/lib/mock-data";
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { getAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { type Booking, type PaymentFollowUp, paymentFollowUps } from "@/lib/mock-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, PhoneCall, Repeat, CheckCircle } from "lucide-react";
import logoImg from "../assets/Logo.svg";

export const Route = createFileRoute("/crm/payments")({ component: PaymentsPage });

function PaymentsPage() {
  const auth = getAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth) {
      navigate({ to: "/login" });
    }
  }, [auth, navigate]);

  const [payments, setPayments] = useSupabaseTable<Booking[]>("bookings", bookings);
  const [leads] = useSupabaseTable<any[]>("leads", []);

  if (!auth) return null;

  const allPayments = useMemo(() => {
    const derived = leads
      .filter((l: any) => l.totalAmount)
      .map(
        (l: any) =>
          ({
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
            paymentMode: "Card" as "Cash" | "UPI" | "Card" | "Bank Transfer" | "Cheque" | "",
            transactionId: "",
            status: l.paymentStatus || "Pending",
            package: l.destination || "Unknown",
            travelDate: l.travelDate || "TBD",
          }) as Booking,
      );
    return [...payments, ...derived];
  }, [leads, payments]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewingInvoice, setViewingInvoice] = useState<Booking | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  
  const [followUpsState, setFollowUpsState] = useSupabaseTable<PaymentFollowUp[]>("payment_followups", []);

  const followUps = useMemo(() => {
    const dynamicFollowUps = allPayments
      .filter((p: Booking) => {
        const pending = (p.amount || 0) - (p.paid || 0);
        return pending > 0;
      })
      .map((p: Booking) => {
        const pending = (p.amount || 0) - (p.paid || 0);
        return {
          id: `PFU-${p.id}`,
          invoiceId: p.id,
          customerId: p.id,
          customerName: p.customer,
          customerPhone: p.mobileNumber || "9876543210",
          invoiceDate: p.bookingDate || new Date().toISOString().slice(0, 10),
          totalAmount: p.amount || 0,
          pendingAmount: pending,
          dueDate: p.travelDate || new Date().toISOString().slice(0, 10),
          nextFollowUpDate: new Date().toISOString().slice(0, 10),
          nextFollowUpTime: "10:00",
          repeat: "Daily",
          notificationReminder: 1,
          notes: p.remarks || "Pending payment balance.",
        } as PaymentFollowUp;
      });
      
    return [...followUpsState, ...dynamicFollowUps];
  }, [allPayments, followUpsState]);

  const [followUpSearch, setFollowUpSearch] = useState("");
  const [followUpFilter, setFollowUpFilter] = useState<"all" | "overdue" | "today" | "upcoming">("all");
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [selectedFollowUpTarget, setSelectedFollowUpTarget] = useState<Booking | null>(null);
  const [followUpForm, setFollowUpForm] = useState({
    partialAmount: 0,
    dueDate: new Date().toISOString().split("T")[0],
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
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
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
      dueDate: followUpForm.dueDate,
      totalAmount: selectedFollowUpTarget.amount,
      pendingAmount: selectedFollowUpTarget.amount - updatedPaid,
      nextFollowUpDate: followUpForm.nextFollowUpDate,
      nextFollowUpTime: followUpForm.nextFollowUpTime,
      repeat: followUpForm.repeat,
      notificationReminder: followUpForm.notificationReminder,
      notes: followUpForm.notes,
    };
    setFollowUpsState([newFU, ...followUpsState]);
    setIsFollowUpModalOpen(false);
  };

  const [newInvoice, setNewInvoice] = useState({
    customer: "",
    package: "",
    travelDate: new Date().toISOString().split("T")[0],
    amount: 0,
    paid: 0,
    status: "Pending" as Booking["status"],
  });

  const filteredPayments = allPayments.filter(
    (p) =>
      p.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `INV-${p.id.replace("BK-", "")}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const total = allPayments.reduce((s, b) => s + b.amount, 0);
  const paid = allPayments.reduce((s, b) => s + b.paid, 0);
  const pending = total - paid;

  const cards = [
    {
      label: "Total Amount",
      value: formatINR(total),
      icon: CreditCard,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Amount Collected",
      value: formatINR(paid),
      icon: CheckCircle2,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Pending Balance",
      value: formatINR(pending),
      icon: AlertCircle,
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
    },
  ];

  const handleDelete = (id: string) => {
    setDeleteTargetId(id);
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      setPayments(payments.filter((p) => p.id !== deleteTargetId));
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
      status: "Pending",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Payments</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage customer receipts, ledgers, and track pending balances.
          </p>
        </div>
        <Button
          onClick={handleCreate}
          className="btn-hero gap-2 rounded-xl shadow-lg shadow-primary/25"
        >
          <Plus className="h-4 w-4" /> Add Receipt
        </Button>
      </div>

      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList className="bg-secondary/40 border border-border p-1 rounded-xl">
          <TabsTrigger value="invoices" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            Customer Ledger
          </TabsTrigger>
          <TabsTrigger value="followups" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">
            Payment Follow-Ups
          </TabsTrigger>
        </TabsList>
        <TabsContent value="invoices" className="m-0 space-y-8">


      <div className="grid gap-6 sm:grid-cols-3">
        {cards.map((c) => (
          <div
            key={c.label}
            className={`relative overflow-hidden rounded-2xl border ${c.border} bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 group`}
          >
            <div
              className={`absolute -right-4 -top-4 h-24 w-24 rounded-full ${c.bg} blur-2xl transition-all group-hover:scale-150`}
            />
            <div className="relative">
              <div className={`inline-flex rounded-xl ${c.bg} p-3 mb-4`}>
                <c.icon className={`h-6 w-6 ${c.color}`} />
              </div>
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
                {c.label}
              </p>
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
              placeholder="Search bookings or customers..."
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
                <th className="px-6 py-4">Booking</th>
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
                    No receipts found.
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
                        <span
                          className={`font-semibold ${balance > 0 ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"}`}
                        >
                          {formatINR(balance)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenFollowUp(b)}
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors opacity-0 group-hover:opacity-100"
                          title="Log Follow-Up & Partial Payment"
                        >
                          <PhoneCall className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewingInvoice(b)}
                          className="h-8 w-8 text-primary hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100"
                          title="Print / View Receipt"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const mobile = b.mobileNumber || "9876543210";
                            const portalUrl =
                              window.location.origin +
                              `/crm/portal?leadId=${b.id.replace("LD-", "LMH-")}`;
                            const msg = `Dear ${b.customer},\n\nThis is a friendly reminder for the pending payment balance of ${formatINR(b.amount - b.paid)} on your booking for ${b.package}. Please check details & download receipt here:\n${portalUrl}\n\nWarm regards,\nLook My Holidays`;
                            window.open(
                              `https://wa.me/${mobile}?text=${encodeURIComponent(msg)}`,
                              "_blank",
                            );
                          }}
                          className="h-8 w-8 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors opacity-0 group-hover:opacity-100"
                          title="Send WhatsApp Reminder"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(b.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete Receipt"
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
        title="Delete Receipt"
        description="Are you sure you want to delete this receipt? This action cannot be undone."
      />


        </TabsContent>

        {/* FOLLOW UPS TAB */}
        <TabsContent value="followups" className="m-0 space-y-6">
          {(() => {
            const todayStr = new Date().toISOString().split("T")[0];
            const activeFUs = followUps.filter(f => f.pendingAmount > 0);
            const overdueFUs = activeFUs.filter(f => f.dueDate < todayStr);
            const todayFUs = activeFUs.filter(f => f.dueDate === todayStr);
            const upcomingFUs = activeFUs.filter(f => f.dueDate > todayStr);

            const filteredFollowUps = activeFUs.filter(f => {
              // Filter by status
              if (followUpFilter === "overdue" && f.dueDate >= todayStr) return false;
              if (followUpFilter === "today" && f.dueDate !== todayStr) return false;
              if (followUpFilter === "upcoming" && f.dueDate <= todayStr) return false;

              // Filter by search
              if (followUpSearch.trim()) {
                const query = followUpSearch.toLowerCase();
                const matchesName = f.customerName.toLowerCase().includes(query);
                const matchesBooking = f.invoiceId.toLowerCase().includes(query);
                return matchesName || matchesBooking;
              }

              return true;
            });

            return (
              <>
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="rounded-2xl border border-blue-500/20 bg-card p-6 shadow-sm flex items-center gap-4">
                    <div className="inline-flex rounded-xl bg-blue-500/10 p-3">
                      <Calendar className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Active Follow-ups</p>
                      <p className="font-display text-2xl font-bold mt-1">{activeFUs.length}</p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-amber-500/20 bg-card p-6 shadow-sm flex items-center gap-4">
                    <div className="inline-flex rounded-xl bg-amber-500/10 p-3">
                      <CreditCard className="h-6 w-6 text-amber-500" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Pending Amount (Follow-Ups)</p>
                      <p className="font-display text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400">
                        {formatINR(activeFUs.reduce((sum, f) => sum + f.pendingAmount, 0))}
                      </p>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-rose-500/20 bg-card p-6 shadow-sm flex items-center gap-4">
                    <div className="inline-flex rounded-xl bg-rose-500/10 p-3">
                      <AlertCircle className="h-6 w-6 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Overdue Payments</p>
                      <p className="font-display text-2xl font-bold mt-1 text-rose-600 dark:text-rose-400">{overdueFUs.length}</p>
                    </div>
                  </div>
                </div>

                {/* Filter and Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-2">Filter Payments:</span>
                    <button
                      onClick={() => setFollowUpFilter("all")}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all border cursor-pointer ${
                        followUpFilter === "all"
                          ? "bg-slate-900 text-white border-slate-900 dark:bg-slate-100 dark:text-slate-950 dark:border-slate-100"
                          : "bg-background text-muted-foreground border-border hover:text-foreground"
                      }`}
                    >
                      All Active ({activeFUs.length})
                    </button>
                    <button
                      onClick={() => setFollowUpFilter("overdue")}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all border flex items-center gap-1.5 cursor-pointer ${
                        followUpFilter === "overdue"
                          ? "bg-rose-600 text-white border-rose-600 shadow-sm"
                          : "bg-background text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-950 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                      }`}
                    >
                      <AlertCircle className="h-3.5 w-3.5" />
                      Overdue ({overdueFUs.length})
                    </button>
                    <button
                      onClick={() => setFollowUpFilter("today")}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all border cursor-pointer ${
                        followUpFilter === "today"
                          ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                          : "bg-background text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-950 hover:bg-amber-50 dark:hover:bg-amber-950/20"
                      }`}
                    >
                      Due Today ({todayFUs.length})
                    </button>
                    <button
                      onClick={() => setFollowUpFilter("upcoming")}
                      className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all border cursor-pointer ${
                        followUpFilter === "upcoming"
                          ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                          : "bg-background text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-950 hover:bg-emerald-50 dark:hover:bg-emerald-950/20"
                      }`}
                    >
                      Upcoming ({upcomingFUs.length})
                    </button>
                  </div>
                  
                  <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Search by customer..."
                      value={followUpSearch}
                      onChange={(e) => setFollowUpSearch(e.target.value)}
                      className="pl-9 h-10 rounded-xl text-sm border-border"
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        <tr>
                          <th className="px-6 py-4">Customer & Booking</th>
                          <th className="px-6 py-4">Pending</th>
                          <th className="px-6 py-4">Due Date</th>
                          <th className="px-6 py-4">Next Follow-Up</th>
                          <th className="px-6 py-4">Repeat</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredFollowUps.map(f => (
                          <tr key={f.id} className="transition-colors hover:bg-secondary/30 group">
                            <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900 dark:text-slate-100">{f.customerName}</div>
                              <div className="text-xs text-muted-foreground mt-0.5">BK-{f.invoiceId.replace("BK-", "").replace("LD-", "")} • {f.invoiceDate}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-bold text-rose-600 dark:text-rose-400">{formatINR(f.pendingAmount)}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`font-semibold ${f.dueDate < todayStr ? "text-rose-600 dark:text-rose-400 font-bold" : "text-slate-700 dark:text-slate-300"}`}>
                                  {f.dueDate}
                                </span>
                                {f.dueDate < todayStr && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 uppercase tracking-wider">
                                    Overdue
                                  </span>
                                )}
                              </div>
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
                                  const portalUrl = window.location.origin + `/crm/portal?leadId=${f.invoiceId.replace("BK-", "LMH-").replace("LD-", "LMH-")}`;
                                  const msg = `Dear ${f.customerName},\n\nThis is a friendly reminder for the pending payment balance of ${formatINR(f.pendingAmount)} on your booking BK-${f.invoiceId.replace("BK-", "").replace("LD-", "")} dated ${f.invoiceDate}. Please view details & make payment here:\n${portalUrl}\n\nWarm regards,\nLook My Holidays`;
                                  window.open(`https://wa.me/${f.customerPhone}?text=${encodeURIComponent(msg)}`, "_blank");
                                }}
                                className="h-8 gap-2 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors cursor-pointer"
                              >
                                <Share2 className="h-4 w-4" /> WhatsApp Reminder
                              </Button>
                            </td>
                          </tr>
                        ))}
                        {filteredFollowUps.length === 0 && (
                          <tr>
                            <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                              No payment follow-ups found matching the filters.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            );
          })()}
        </TabsContent>
      </Tabs>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Receipt</DialogTitle>
            <DialogDescription>
              Enter receipt and customer details to create a new record.
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
                  onChange={(e) =>
                    setNewInvoice({ ...newInvoice, status: e.target.value as Booking["status"] })
                  }
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
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Invoice</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Invoice / Receipt Viewer Dialog ──────────────────── */}
      <Dialog open={!!viewingInvoice} onOpenChange={() => setViewingInvoice(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-3xl border border-border p-6 shadow-2xl bg-card">
          <DialogHeader className="print:hidden">
            <DialogTitle className="font-display text-lg font-bold">
              Booking Invoice & Receipt
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Branded invoice for client share and offline PDF downloads.
            </DialogDescription>
          </DialogHeader>

          {viewingInvoice && (
            <div className="space-y-6">
              {/* Actions panel */}
              <div className="flex gap-2 justify-end border-b border-border pb-4 print:hidden">
                <Button
                  variant="outline"
                  className="rounded-xl gap-2 text-xs"
                  onClick={() => window.print()}
                >
                  <Printer className="h-4 w-4" /> Print / Save PDF
                </Button>
                <Button
                  style={{ background: "var(--gradient-brand)" }}
                  className="rounded-xl gap-2 text-xs text-primary-foreground shadow-md"
                  onClick={() => {
                    const mobile = viewingInvoice.mobileNumber || "9876543210";
                    const portalUrl =
                      window.location.origin +
                      `/crm/portal?leadId=${viewingInvoice.id.replace("LD-", "LMH-")}`;
                    const msg = `Dear ${viewingInvoice.customer},\n\nThis is a friendly reminder for the pending payment balance of ${formatINR(viewingInvoice.amount - viewingInvoice.paid)} on your booking for ${viewingInvoice.package}. Please check details & download invoice/receipt here:\n${portalUrl}\n\nWarm regards,\nLook My Holidays`;
                    window.open(
                      `https://wa.me/${mobile}?text=${encodeURIComponent(msg)}`,
                      "_blank",
                    );
                  }}
                >
                  <Share2 className="h-4 w-4" /> WhatsApp Reminder
                </Button>
              </div>

              {/* Printable Invoice */}
              <div className="bg-card text-card-foreground rounded-2xl border border-border p-6 text-slate-800 text-xs print:border-none print:shadow-none print:p-0 print:text-black">
                {/* Header */}
                <div className="flex justify-between items-center border-b-2 border-primary/20 pb-4">
                  <div className="flex items-center gap-3">
                    <img src={logoImg} alt="Logo" className="h-12 w-auto mix-blend-multiply" />
                    <div>
                      <h2 className="font-display font-extrabold text-lg text-primary">
                        Look My Holidays
                      </h2>
                      <p className="text-[10px] text-muted-foreground">
                        Expert Travel Consultants & Visa Solutions
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xs font-bold bg-secondary text-primary px-2 py-0.5 rounded border border-primary/20 inline-block mb-1">
                      INV-{viewingInvoice.id.replace("BK-", "").replace("LD-", "")}
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      Date: {viewingInvoice.bookingDate || new Date().toLocaleDateString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Client & Booking Information */}
                <div className="grid grid-cols-2 gap-4 pt-4 text-slate-800">
                  <div className="bg-secondary/10 p-3 rounded-xl border border-border/40">
                    <p className="font-bold text-primary mb-1 uppercase tracking-wider text-[9px]">
                      Bill To
                    </p>
                    <p className="font-semibold text-slate-900">{viewingInvoice.customer}</p>
                    <p className="text-muted-foreground">{viewingInvoice.mobileNumber || "—"}</p>
                  </div>
                  <div className="bg-secondary/10 p-3 rounded-xl border border-border/40 text-right">
                    <p className="font-bold text-primary mb-1 uppercase tracking-wider text-[9px]">
                      Service Details
                    </p>
                    <p className="font-semibold text-slate-900">{viewingInvoice.package}</p>
                    <p className="text-muted-foreground">
                      Travel Date: {viewingInvoice.travelDate || "TBD"}
                    </p>
                  </div>
                </div>

                {/* Payment Breakdown table */}
                <div className="mt-6 border border-border rounded-xl overflow-hidden">
                  <table className="w-full text-left text-slate-800">
                    <thead className="bg-secondary/40 text-slate-700 font-bold">
                      <tr>
                        <th className="px-4 py-2">Item Description</th>
                        <th className="px-4 py-2 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      <tr>
                        <td className="px-4 py-3 font-medium">
                          {viewingInvoice.bookingType || "Holiday Package"} Booking Fees for{" "}
                          {viewingInvoice.package}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">
                          {formatINR(viewingInvoice.amount)}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Totals & QR */}
                <div className="grid grid-cols-3 gap-4 pt-6 mt-4 items-center bg-secondary/10 p-4 rounded-xl text-slate-800">
                  <div className="col-span-2 space-y-1.5 text-xs">
                    <div className="flex justify-between pr-4 text-muted-foreground">
                      <span>Subtotal:</span>
                      <span>{formatINR(viewingInvoice.amount)}</span>
                    </div>
                    <div className="flex justify-between pr-4 font-semibold text-emerald-600">
                      <span>Total Paid:</span>
                      <span>{formatINR(viewingInvoice.paid)}</span>
                    </div>
                    <div className="flex justify-between pr-4 font-display font-bold text-sm text-primary pt-2 border-t border-border/60">
                      <span>Balance Due:</span>
                      <span>{formatINR(viewingInvoice.amount - viewingInvoice.paid)}</span>
                    </div>
                  </div>

                  {/* UPI QR */}
                  <div className="flex flex-col items-center justify-center p-2 border border-border bg-card rounded-lg text-center overflow-hidden">
                    <img src="/upi-qr.png" alt="UPI QR Code" className="w-[120px] object-contain rounded-md" />
                    <p className="text-[8px] text-muted-foreground mt-1.5 font-medium">
                      Scan to pay with any UPI App
                    </p>
                  </div>
                </div>

                {/* Terms */}
                <div className="pt-4 text-[9px] text-muted-foreground border-t border-border mt-4 text-center">
                  <p className="font-semibold">Thank you for traveling with Look My Holidays! ✈️</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  required
                  value={followUpForm.dueDate}
                  onChange={(e) => setFollowUpForm({ ...followUpForm, dueDate: e.target.value })}
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

    </div>
  );
}
