import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getAuth } from "@/lib/auth";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import {
  Receipt,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
  Trash2,
  Paperclip,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";
import { formatINR } from "@/lib/mock-data";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/crm/payment-requests")({
  component: PaymentRequestsPage,
});

export type PaymentRequest = {
  id: string;
  date: string;
  submittedBy: string; // auth.name
  supplier: string;
  clientName: string;
  amount: number;
  isPaid: boolean;
  status: "Pending" | "Approved" | "Denied";
  remarks: string;
  attachments: string[]; // Base64 or URLs
};

function PaymentRequestsPage() {
  const auth = getAuth();
  const [requests, setRequests] = useSupabaseTable<PaymentRequest[]>("payment_requests", []);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | "Pending" | "Approved" | "Denied">("All");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [viewingRequest, setViewingRequest] = useState<PaymentRequest | null>(null);

  const [form, setForm] = useState<Partial<PaymentRequest>>({
    supplier: "",
    clientName: "",
    amount: 0,
    remarks: "",
    attachments: [],
  });

  const isAdmin = auth?.role === "admin";

  // Filter requests based on user role (employees see their own, admins see all)
  const visibleRequests = requests.filter((r) => {
    if (!isAdmin && r.submittedBy !== auth?.name) return false;
    if (statusFilter !== "All" && r.status !== statusFilter) return false;
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      if (!r.supplier.toLowerCase().includes(lower) && !r.clientName.toLowerCase().includes(lower)) {
        return false;
      }
    }
    return true;
  });

  const totalPending = visibleRequests.filter((r) => r.status === "Pending").reduce((s, r) => s + r.amount, 0);
  const totalApproved = visibleRequests.filter((r) => r.status === "Approved").reduce((s, r) => s + r.amount, 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.supplier || !form.clientName || !form.amount) return;

    const newReq: PaymentRequest = {
      id: `PR-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split("T")[0],
      submittedBy: auth?.name || "Unknown",
      supplier: form.supplier,
      clientName: form.clientName,
      amount: Number(form.amount),
      isPaid: false,
      status: "Pending",
      remarks: form.remarks || "",
      attachments: form.attachments || [],
    };

    setRequests([newReq, ...requests]);
    setIsAddOpen(false);
    setForm({ supplier: "", clientName: "", amount: 0, remarks: "", attachments: [] });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((prev) => ({
          ...prev,
          attachments: [...(prev.attachments || []), reader.result as string],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const updateStatus = (id: string, status: "Approved" | "Denied") => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const markAsPaid = (id: string, isPaid: boolean) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, isPaid } : r)));
  };

  const confirmDelete = () => {
    if (deleteTargetId) {
      setRequests(requests.filter((r) => r.id !== deleteTargetId));
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Payment Requests</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Submit and manage internal payment requests and approvals.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} className="btn-hero gap-2 rounded-xl shadow-lg">
          <Plus className="h-4 w-4" /> New Request
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-blue-500/20 bg-card p-6 shadow-sm flex items-center gap-4">
          <div className="inline-flex rounded-xl bg-blue-500/10 p-3">
            <Receipt className="h-6 w-6 text-blue-500" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Requests</p>
            <p className="font-display text-2xl font-bold mt-1">{visibleRequests.length}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-orange-500/20 bg-card p-6 shadow-sm flex items-center gap-4">
          <div className="inline-flex rounded-xl bg-primary/100/10 p-3">
            <Clock className="h-6 w-6 text-orange-500" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Pending Amount</p>
            <p className="font-display text-2xl font-bold mt-1">{formatINR(totalPending)}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-emerald-500/20 bg-card p-6 shadow-sm flex items-center gap-4">
          <div className="inline-flex rounded-xl bg-emerald-500/10 p-3">
            <CheckCircle2 className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Approved Amount</p>
            <p className="font-display text-2xl font-bold mt-1">{formatINR(totalApproved)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-secondary/20">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by supplier or client..."
              className="pl-9 rounded-xl border-border bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Denied">Denied</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/40 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-4">ID & Date</th>
                <th className="px-6 py-4">Submitted By</th>
                <th className="px-6 py-4">Supplier / Client</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    No payment requests found.
                  </td>
                </tr>
              ) : (
                visibleRequests.map((req) => (
                  <tr key={req.id} className="transition-colors hover:bg-secondary/30 group">
                    <td className="px-6 py-4">
                      <div className="font-mono text-xs font-medium text-primary mb-1">{req.id}</div>
                      <div className="text-muted-foreground text-xs">{req.date}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold">{req.submittedBy}</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{req.supplier}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">For: {req.clientName}</div>
                    </td>
                    <td className="px-6 py-4 font-bold">{formatINR(req.amount)}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-2 items-start">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            req.status === "Approved"
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                              : req.status === "Denied"
                                ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
                                : "bg-primary/20 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          }`}
                        >
                          {req.status === "Approved" && <CheckCircle2 className="h-3.5 w-3.5" />}
                          {req.status === "Denied" && <XCircle className="h-3.5 w-3.5" />}
                          {req.status === "Pending" && <Clock className="h-3.5 w-3.5" />}
                          {req.status}
                        </span>
                        {req.status === "Approved" && (
                          <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${req.isPaid ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                            {req.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewingRequest(req)}
                          className="h-8 w-8 text-primary hover:bg-primary/10 transition-colors opacity-0 group-hover:opacity-100"
                          title="View Details"
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                        
                        {isAdmin && req.status === "Pending" && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateStatus(req.id, "Approved")}
                              className="h-8 w-8 text-emerald-600 hover:bg-emerald-100 opacity-0 group-hover:opacity-100"
                              title="Approve"
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => updateStatus(req.id, "Denied")}
                              className="h-8 w-8 text-rose-600 hover:bg-rose-100 opacity-0 group-hover:opacity-100"
                              title="Deny"
                            >
                              <XCircle className="h-4 w-4" />
                            </Button>
                          </>
                        )}

                        {isAdmin && req.status === "Approved" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsPaid(req.id, !req.isPaid)}
                            className={`h-8 text-xs font-semibold ${req.isPaid ? 'text-slate-500 hover:bg-slate-100' : 'text-blue-600 hover:bg-blue-100'} opacity-0 group-hover:opacity-100`}
                          >
                            {req.isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                          </Button>
                        )}

                        {(isAdmin || req.status === "Pending") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setDeleteTargetId(req.id)}
                            className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete Request"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={deleteTargetId !== null}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={confirmDelete}
        title="Delete Request"
        description="Are you sure you want to delete this payment request? This action cannot be undone."
      />

      {/* View Request Modal */}
      <Dialog open={!!viewingRequest} onOpenChange={() => setViewingRequest(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Payment Request Details</DialogTitle>
            <DialogDescription>
              ID: {viewingRequest?.id} | Submitted: {viewingRequest?.date}
            </DialogDescription>
          </DialogHeader>
          {viewingRequest && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-secondary/20 p-3 rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Submitted By</p>
                  <p className="font-bold">{viewingRequest.submittedBy}</p>
                </div>
                <div className="bg-secondary/20 p-3 rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Amount</p>
                  <p className="font-bold text-lg text-primary">{formatINR(viewingRequest.amount)}</p>
                </div>
                <div className="bg-secondary/20 p-3 rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Supplier</p>
                  <p className="font-bold">{viewingRequest.supplier}</p>
                </div>
                <div className="bg-secondary/20 p-3 rounded-xl border border-border">
                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Client Name</p>
                  <p className="font-bold">{viewingRequest.clientName}</p>
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Label>Remarks</Label>
                <div className="p-3 bg-secondary/10 rounded-xl border border-border min-h-[60px] text-sm whitespace-pre-line">
                  {viewingRequest.remarks || "No remarks provided."}
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Label>Attached Documents ({viewingRequest.attachments.length})</Label>
                <div className="grid grid-cols-3 gap-4">
                  {viewingRequest.attachments.map((att, i) => (
                    <div key={i} className="aspect-square border border-border rounded-xl overflow-hidden bg-secondary/20 flex items-center justify-center">
                      {att.startsWith("data:image") ? (
                        <img src={att} alt={`Attachment ${i}`} className="w-full h-full object-cover" />
                      ) : (
                        <FileText className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                  {viewingRequest.attachments.length === 0 && (
                    <p className="col-span-3 text-sm text-muted-foreground">No attachments.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Request Modal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>New Payment Request</DialogTitle>
            <DialogDescription>
              Submit a request to pay a supplier or for reimbursement.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="supplier">Supplier / Vendor</Label>
                <Input
                  id="supplier"
                  required
                  placeholder="e.g. Makemytrip"
                  value={form.supplier}
                  onChange={(e) => setForm({ ...form, supplier: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientName">Client Name</Label>
                <Input
                  id="clientName"
                  required
                  placeholder="e.g. Rahul Kumar"
                  value={form.clientName}
                  onChange={(e) => setForm({ ...form, clientName: e.target.value })}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                min="1"
                required
                placeholder="e.g. 25000"
                value={form.amount || ""}
                onChange={(e) => setForm({ ...form, amount: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks / Justification</Label>
              <Textarea
                id="remarks"
                placeholder="Details about the payment..."
                value={form.remarks}
                onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                className="h-24"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-border">
              <Label>Attachments (Invoices, Receipts)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file-upload"
                  type="file"
                  accept="image/*,.pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <Label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-border rounded-xl hover:bg-secondary/30 transition-colors text-sm font-medium"
                >
                  <Paperclip className="h-4 w-4" /> Add File
                </Label>
                <span className="text-xs text-muted-foreground">
                  {form.attachments?.length || 0} file(s) attached
                </span>
              </div>
              {form.attachments && form.attachments.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                  {form.attachments.map((att, i) => (
                    <div key={i} className="h-12 w-12 border border-border rounded-md overflow-hidden relative">
                      {att.startsWith("data:image") ? (
                        <img src={att} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full bg-secondary/30">
                          <FileText className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          const newAtt = [...form.attachments!];
                          newAtt.splice(i, 1);
                          setForm({ ...form, attachments: newAtt });
                        }}
                        className="absolute -top-1 -right-1 bg-rose-500 text-white rounded-full p-0.5"
                      >
                        <XCircle className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Submit Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
