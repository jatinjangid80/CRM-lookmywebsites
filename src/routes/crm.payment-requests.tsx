import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useMemo, useState } from "react";
import { getAuth } from "@/lib/auth";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { Booking, PaymentFollowUp, paymentFollowUps, formatINR } from "@/lib/mock-data";
import { Receipt, Plus, Search, CheckCircle2, FileText, Clock, Download, Upload, FilePlus, Bell, ArrowRight, XCircle, Calendar, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ImportModal } from "@/components/ui/import-modal";

export const Route = createFileRoute("/crm/payment-requests")({
  component: PaymentRequestsPage,
});

type ApprovalStatus =
  | "Draft"
  | "Pending Accounts"
  | "Accounts Approved"
  | "Pending Super Admin"
  | "Approved"
  | "Paid"
  | "Completed"
  | "Rejected";

type AccountStatus = "Pending" | "Approved" | "Rejected" | "Need More Info";
type SuperAdminStatus = "Pending" | "Approved" | "Rejected" | "Hold";

type PaymentDetails = {
  paymentMethod: string;
  transactionId: string;
  paymentDate: string;
  bankName: string;
  upiReference: string;
  chequeNumber: string;
  remarks: string;
  proofAttachments: string[];
};

type TimelineEvent = {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  note?: string;
};

type PaymentRequest = {
  id: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  bookingId: string;
  bookingNumber: string;
  customer: string;
  vendor: string;
  serviceType: string;
  bookingAmount: number;
  vendorPayable: number;
  profit: number;
  employeeName: string;
  requestedAmount: number;
  paymentMode: string;
  dueDate: string;
  priority: "High" | "Medium" | "Low" | "Normal";
  remarks: string;
  invoiceAttachments: string[];
  vendorBillAttachments: string[];
  status: ApprovalStatus;
  accountStatus: AccountStatus;
  adminStatus: SuperAdminStatus;
  isPaid: boolean;
  paymentDetails: PaymentDetails | null;
  accountRemarks: string;
  adminRemarks: string;
  rejectionReason: string;
  auditTimeline: TimelineEvent[];
};

const statusBadgeClasses: Record<ApprovalStatus, string> = {
  Draft: "bg-slate-100 text-slate-800",
  "Pending Accounts": "bg-orange-100 text-orange-700",
  "Accounts Approved": "bg-emerald-100 text-emerald-700",
  "Pending Super Admin": "bg-sky-100 text-sky-700",
  Approved: "bg-blue-100 text-blue-700",
  Paid: "bg-emerald-100 text-emerald-700",
  Completed: "bg-emerald-200 text-emerald-800",
  Rejected: "bg-rose-100 text-rose-700",
};

const badgeClasses: Record<AccountStatus | SuperAdminStatus, string> = {
  Pending: "bg-orange-100 text-orange-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-rose-100 text-rose-700",
  "Need More Info": "bg-amber-100 text-amber-800",
  Hold: "bg-slate-100 text-slate-800",
};

function formatDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

function formatTime(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true });
}

function makeTimelineEntry(actor: string, action: string, note?: string): TimelineEvent {
  return {
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: new Date().toISOString(),
    actor,
    action,
    note,
  };
}

function getBookingDisplayStatus(status: Booking["status"]) {
  switch (status) {
    case "Confirmed":
    case "Completed":
    case "Paid":
      return "Ready";
    case "Partial":
      return "Partial Payment";
    default:
      return "Review";
  }
}

function PaymentRequestsPage() {
  const auth = getAuth();
  const [requests, setRequests] = useSupabaseTable<PaymentRequest[]>("payment_requests", []);
  const [bookingList] = useSupabaseTable<Booking[]>("bookings", []);
  const [leads] = useSupabaseTable<any[]>("leads", []);
  const [vendors] = useSupabaseTable<any[]>("vendors", []);
  const [employees] = useSupabaseTable<any[]>("employees", []);
  const [followUpsState, setFollowUpsState] = useSupabaseTable<PaymentFollowUp[]>("payment_followups", []);

  const followUps = useMemo(() => {
    // Dynamically generate follow-ups from leads with pending payments
    const dynamicFollowUpsFromLeads = leads
      .filter((l: any) => {
        const sellingPrice = l.totalAmount || Number(l.budget) || 0;
        const paid = l.amountPaid || 0;
        const pending = sellingPrice - paid;
        return pending > 0 && (l.bookingReference || ["Booked", "Completed", "Confirmed", "Payment Pending", "Travel Completed", "Postponed"].includes(l.status));
      })
      .map((l: any) => {
        const sellingPrice = l.totalAmount || Number(l.budget) || 0;
        const paid = l.amountPaid || 0;
        const pending = sellingPrice - paid;
        return {
          id: `PFU-${l.id}`,
          invoiceId: l.id,
          customerId: l.id,
          customerName: l.name,
          customerPhone: l.phone || l.whatsapp || "9876543210",
          invoiceDate: l.createdAt,
          totalAmount: sellingPrice,
          pendingAmount: pending,
          dueDate: l.travelDate || l.createdAt,
          nextFollowUpDate: l.nextFollowUp || new Date().toISOString().slice(0, 10),
          nextFollowUpTime: "10:00",
          repeat: "Daily",
          notificationReminder: 1,
          notes: l.notes || "Pending payment balance.",
        } as PaymentFollowUp;
      });
      
    // Also include from direct bookings (handles initial mock data if Supabase is empty)
    const dynamicFollowUpsFromBookings = bookingList
      .filter((b: Booking) => {
        const pending = (b.amount || 0) - (b.paid || 0);
        return pending > 0;
      })
      .map((b: Booking) => {
        const pending = (b.amount || 0) - (b.paid || 0);
        return {
          id: `PFU-${b.id}`,
          invoiceId: b.id,
          customerId: b.id,
          customerName: b.customer,
          customerPhone: b.mobileNumber || "9876543210",
          invoiceDate: b.bookingDate || new Date().toISOString().slice(0, 10),
          totalAmount: b.amount || 0,
          pendingAmount: pending,
          dueDate: b.travelDate || new Date().toISOString().slice(0, 10),
          nextFollowUpDate: new Date().toISOString().slice(0, 10),
          nextFollowUpTime: "10:00",
          repeat: "Daily",
          notificationReminder: 1,
          notes: b.remarks || "Pending payment balance.",
        } as PaymentFollowUp;
      });
      
    // Combine with any manual followups saved in state
    return [...followUpsState, ...dynamicFollowUpsFromLeads, ...dynamicFollowUpsFromBookings];
  }, [leads, bookingList, followUpsState]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | ApprovalStatus>(() => {
    const auth = getAuth();
    if (auth?.role === "manager") return "Pending Accounts";
    if (auth?.role === "admin") return "Pending Super Admin";
    return "All";
  });
  const [vendorFilter, setVendorFilter] = useState<"All" | string>("All");
  const [employeeFilter, setEmployeeFilter] = useState<"All" | string>("All");
  const [serviceFilter, setServiceFilter] = useState<"All" | string>("All");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [viewingRequest, setViewingRequest] = useState<PaymentRequest | null>(null);
  const [decisionTarget, setDecisionTarget] = useState<PaymentRequest | null>(null);
  const [decisionReason, setDecisionReason] = useState("");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeDrawerRequest, setActiveDrawerRequest] = useState<PaymentRequest | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});
  const [isExporting, setIsExporting] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  const [form, setForm] = useState<Partial<PaymentRequest>>({
    createdBy: auth?.name || "",
    bookingId: "",
    bookingNumber: "",
    customer: "",
    vendor: "",
    serviceType: "",
    bookingAmount: 0,
    vendorPayable: 0,
    profit: 0,
    employeeName: auth?.name || "",
    requestedAmount: 0,
    paymentMode: "Bank Transfer",
    dueDate: new Date().toISOString().slice(0, 10),
    priority: "Normal",
    remarks: "",
    invoiceAttachments: [],
    vendorBillAttachments: [],
    status: "Draft",
    accountStatus: "Pending",
    adminStatus: "Pending",
    isPaid: false,
    paymentDetails: null,
    accountRemarks: "",
    adminRemarks: "",
    rejectionReason: "",
    auditTimeline: [],
  });

  const [paymentForm, setPaymentForm] = useState<PaymentDetails>({
    paymentMethod: "Bank Transfer",
    transactionId: "",
    paymentDate: new Date().toISOString().slice(0, 10),
    bankName: "",
    upiReference: "",
    chequeNumber: "",
    remarks: "",
    proofAttachments: [],
  });

  const isAdmin = auth?.role === "admin";
  const isAccounts = auth?.role === "manager";

  const allBookings = useMemo(() => {
    const derived = leads
      .filter((l: any) => l.totalAmount !== undefined)
      .map(
        (l: any) => ({
          id: "LD-" + l.id.replace("L-", ""),
          bookingType: (l.service || "Holiday Package") as Booking["bookingType"],
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
          purchasePrice: l.purchasePrice || 0,
          profit: l.profit || 0,
          margin: 0,
          refundDate: "",
          refundAmount: 0,
          amount: l.totalAmount || 0,
          paid: l.amountPaid || 0,
          paymentMode: "Card",
          transactionId: l.transactionId || "",
          status: l.paymentStatus || "Pending",
          package: l.destination || "Unknown",
          travelDate: l.travelDate || "TBD",
        }) as Booking,
      );
    return [...bookingList, ...derived];
  }, [bookingList, leads]);

  const vendorOptions = useMemo(() => {
    const set = new Set<string>(vendors.map((v) => v.name).filter(Boolean) as string[]);
    allBookings.forEach((b) => b.supplier && b.supplier !== "Not Assigned" && set.add(b.supplier));
    return ["All", ...Array.from(set).sort()];
  }, [vendors, allBookings]);

  const employeeOptions = useMemo(() => {
    const set = new Set<string>(employees.map((e) => e.name).filter(Boolean) as string[]);
    allBookings.forEach((b) => b.bookedBy && set.add(b.bookedBy));
    return ["All", ...Array.from(set).sort()];
  }, [employees, allBookings]);

  const serviceOptions = useMemo(() => {
    const set = new Set<string>(allBookings.map((b) => b.bookingType).filter(Boolean) as string[]);
    return ["All", ...Array.from(set).sort()];
  }, [allBookings]);

  const eligibleBookings = useMemo(() => {
    const existingBookingIds = new Set(requests.map((r) => r.bookingId));
    return allBookings.filter(
      (booking) =>
        booking.supplier &&
        ["Confirmed", "Completed", "Partial", "Paid"].includes(booking.status) &&
        !existingBookingIds.has(booking.id),
    );
  }, [allBookings, requests]);

  const pageTitle = auth?.role === "admin" 
    ? "Final Payment Approval" 
    : auth?.role === "manager" 
    ? "Payment Reviews" 
    : "My Payment Requests";

  const pageSubtitle = auth?.role === "admin"
    ? "Review and approve accountant-verified vendor payments."
    : auth?.role === "manager"
    ? "Review and verify vendor payment requests submitted by employees."
    : "Submit and track your vendor payment requests.";

  const visibleRequests = useMemo(() => {
    return requests.filter((req) => {
      // Role-based visibility
      if (auth?.role === "employee" && req.createdBy !== auth?.name && req.employeeName !== auth?.name) {
        return false;
      }

      if (statusFilter !== "All" && req.status !== statusFilter) return false;
      if (vendorFilter !== "All" && req.vendor !== vendorFilter) return false;
      if (employeeFilter !== "All" && req.employeeName !== employeeFilter) return false;
      if (serviceFilter !== "All" && req.serviceType !== serviceFilter) return false;
      if (dateFrom && new Date(req.createdAt) < new Date(dateFrom)) return false;
      if (dateTo && new Date(req.createdAt) > new Date(`${dateTo}T23:59:59`)) return false;
      if (searchTerm) {
        const lower = searchTerm.toLowerCase();
        const match = [
          req.id,
          req.bookingNumber,
          req.customer,
          req.vendor,
          req.employeeName,
          req.serviceType,
          req.remarks,
        ].some((value) => value.toLowerCase().includes(lower));
        if (!match) return false;
      }
      return true;
    });
  }, [requests, statusFilter, vendorFilter, employeeFilter, serviceFilter, dateFrom, dateTo, searchTerm]);

  const stats = useMemo(() => {
    // Only calculate stats based on the requests the user is allowed to see (bypassing the current UI filters so dashboard always shows true totals)
    const baseRequests = requests.filter((req) => {
      if (auth?.role === "employee" && req.createdBy !== auth?.name && req.employeeName !== auth?.name) return false;
      return true;
    });

    const total = baseRequests.length;
    const pendingAccounts = baseRequests.filter((req) => req.status === "Pending Accounts").length;
    const pendingSuperAdmin = baseRequests.filter((req) => req.status === "Pending Super Admin").length;
    const pending = pendingAccounts + pendingSuperAdmin;
    const approved = baseRequests.filter((req) => req.status === "Approved" || req.status === "Accounts Approved").length;
    const rejected = baseRequests.filter((req) => req.status === "Rejected").length;
    const paid = baseRequests.filter((req) => req.status === "Paid" || req.status === "Completed").length;
    
    return { total, pendingAccounts, pendingSuperAdmin, pending, approved, rejected, paid };
  }, [requests, auth]);

  const createRequestId = () => {
    const nextNumber = requests
      .map((r) => {
        const match = r.id.match(/^PR-(\d+)$/);
        return match ? Number(match[1]) : 0;
      })
      .reduce((max, current) => Math.max(max, current), 0) + 1;
    return `PR-${String(nextNumber).padStart(4, "0")}`;
  };

  const appendTimeline = (request: PaymentRequest, action: string, note?: string) => {
    const entry = makeTimelineEntry(auth?.name || "System", action, note);
    setRequests((prev) =>
      prev.map((item) =>
        item.id === request.id
          ? {
            ...item,
            updatedAt: new Date().toISOString(),
            auditTimeline: [...item.auditTimeline, entry],
          }
          : item,
      ),
    );
  };

  const createFollowUp = (booking: Booking) => {
    const pendingAmount = Math.max(0, (booking.amount || 0) - (booking.paid || 0));
    if (!pendingAmount) return;
    const followUp: PaymentFollowUp = {
      id: `PFU-${Math.floor(1000 + Math.random() * 9000)}`,
      invoiceId: booking.id,
      customerId: "",
      customerName: booking.customer,
      customerPhone: booking.mobileNumber || "",
      invoiceDate: booking.bookingDate || new Date().toISOString().slice(0, 10),
      totalAmount: booking.amount || 0,
      pendingAmount,
      nextFollowUpDate: new Date(Date.now() + 2 * 86400000).toISOString().slice(0, 10),
      nextFollowUpTime: "10:00",
      repeat: "Daily",
      notificationReminder: 1,
      notes: "Auto-created follow-up for pending customer payment after vendor payment request.",
    };
    setFollowUpsState((prev) => [followUp, ...prev]);
  };

  const handleGenerateRequest = (booking: Booking) => {
    const nextId = createRequestId();
    const request: PaymentRequest = {
      id: nextId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: auth?.name || "System",
      bookingId: booking.id,
      bookingNumber: booking.reference || booking.id,
      customer: booking.customer,
      vendor: booking.supplier,
      serviceType: booking.bookingType,
      bookingAmount: booking.amount || 0,
      vendorPayable: booking.purchasePrice || 0,
      profit: booking.profit || 0,
      employeeName: booking.bookedBy || auth?.name || "",
      requestedAmount: booking.purchasePrice || booking.amount || 0,
      paymentMode: "Bank Transfer",
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10),
      priority: "Normal",
      remarks: "Auto-generated vendor payment request from booking.",
      invoiceAttachments: [],
      vendorBillAttachments: [],
      status: "Pending Accounts",
      accountStatus: "Pending",
      adminStatus: "Pending",
      isPaid: false,
      paymentDetails: null,
      accountRemarks: "",
      adminRemarks: "",
      rejectionReason: "",
      auditTimeline: [
        makeTimelineEntry(auth?.name || "System", "Request created", `Created from booking ${booking.id}`),
      ],
    };
    setRequests((prev) => [request, ...prev]);
    createFollowUp(booking);
  };

  const handleOpenManualRequest = () => {
    setForm({
      createdBy: auth?.name || "",
      bookingId: "",
      bookingNumber: "",
      customer: "",
      vendor: "",
      serviceType: "",
      bookingAmount: 0,
      vendorPayable: 0,
      profit: 0,
      employeeName: auth?.name || "",
      requestedAmount: 0,
      paymentMode: "Bank Transfer",
      dueDate: new Date().toISOString().slice(0, 10),
      priority: "Normal",
      remarks: "",
      invoiceAttachments: [],
      vendorBillAttachments: [],
      status: "Draft",
      accountStatus: "Pending",
      adminStatus: "Pending",
      isPaid: false,
      paymentDetails: null,
      accountRemarks: "",
      adminRemarks: "",
      rejectionReason: "",
      auditTimeline: [],
    });
    setIsAddOpen(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: "invoiceAttachments" | "vendorBillAttachments") => {
    const file = event.target.files?.[0];
    if (!file) return;

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    setForm((prev) => ({
      ...prev,
      [field]: [...((prev[field] as string[]) || []), dataUrl],
    }));
    event.target.value = "";
  };

  const handleSubmitRequest = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const id = createRequestId();
    const now = new Date().toISOString();
    const request: PaymentRequest = {
      id,
      createdAt: now,
      updatedAt: now,
      createdBy: form.createdBy || auth?.name || "Unknown",
      bookingId: form.bookingId || "",
      bookingNumber: form.bookingNumber || "",
      customer: form.customer || "",
      vendor: form.vendor || "",
      serviceType: form.serviceType || "",
      bookingAmount: Number(form.bookingAmount || 0),
      vendorPayable: Number(form.vendorPayable || 0),
      profit: Number(form.profit || 0),
      employeeName: form.employeeName || auth?.name || "",
      requestedAmount: Number(form.requestedAmount || 0),
      paymentMode: form.paymentMode || "Bank Transfer",
      dueDate: form.dueDate || new Date().toISOString().slice(0, 10),
      priority: form.priority || "Normal",
      remarks: form.remarks || "",
      invoiceAttachments: form.invoiceAttachments || [],
      vendorBillAttachments: form.vendorBillAttachments || [],
      status: form.status || "Draft",
      accountStatus: form.accountStatus || "Pending",
      adminStatus: form.adminStatus || "Pending",
      isPaid: false,
      paymentDetails: null,
      accountRemarks: "",
      adminRemarks: "",
      rejectionReason: "",
      auditTimeline: [makeTimelineEntry(auth?.name || "System", "Request created", form.remarks)],
    };
    setRequests((prev) => [request, ...prev]);
    setIsAddOpen(false);
  };

  const updateRequest = (id: string, changes: Partial<PaymentRequest>) => {
    setRequests((prev) => prev.map((item) => (item.id === id ? { ...item, ...changes, updatedAt: new Date().toISOString() } : item)));
  };

  const handleApproveAccounts = (request: PaymentRequest) => {
    updateRequest(request.id, {
      status: "Accounts Approved",
      accountStatus: "Approved",
    });
    appendTimeline(request, "Accounts approved", "Moved to Super Admin review.");
    updateRequest(request.id, { status: "Pending Super Admin" });
  };

  const handleRejectAccounts = (request: PaymentRequest, reason: string) => {
    updateRequest(request.id, {
      status: "Rejected",
      accountStatus: "Rejected",
      rejectionReason: reason,
    });
    appendTimeline(request, "Accounts rejected", reason);
  };

  const handleRequestMoreInfo = (request: PaymentRequest, note: string) => {
    updateRequest(request.id, {
      status: "Pending Accounts",
      accountStatus: "Need More Info",
      accountRemarks: note,
    });
    appendTimeline(request, "Accounts requested more info", note);
  };

  const handleSuperAdminDecision = (request: PaymentRequest, decision: SuperAdminStatus, note?: string) => {
    const update: Partial<PaymentRequest> = { adminStatus: decision };
    if (decision === "Approved") {
      update.status = "Approved";
      update.accountStatus = "Approved";
    }
    if (decision === "Rejected") {
      update.status = "Rejected";
      update.rejectionReason = note || "Rejected by Super Admin";
      update.adminRemarks = note || "Rejected by Super Admin";
    }
    if (decision === "Hold") {
      update.status = "Pending Super Admin";
    }
    updateRequest(request.id, update);
    appendTimeline(request, `Super Admin ${decision.toLowerCase()}`, note);
  };

  const handleSavePaymentDetails = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!viewingRequest) return;
    updateRequest(viewingRequest.id, {
      paymentDetails: paymentForm,
      status: viewingRequest.status === "Approved" ? "Paid" : viewingRequest.status,
      isPaid: true,
    });
    appendTimeline(viewingRequest, "Payment details saved", paymentForm.remarks);
    setIsPaymentModalOpen(false);
  };

  const handleUploadPaymentProof = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

    setPaymentForm((prev) => ({ ...prev, proofAttachments: [...prev.proofAttachments, dataUrl] }));
    event.target.value = "";
  };

  const toggleRow = (id: string, request: PaymentRequest) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
    setActiveDrawerRequest(request);
  };

  const exportCSV = () => {
    setIsExporting(true);
    const rows = [
      [
        "Request ID",
        "Booking Number",
        "Customer",
        "Vendor",
        "Service Type",
        "Requested Amount",
        "Status",
        "Account Status",
        "Super Admin",
        "Created At",
      ],
      ...visibleRequests.map((req) => [
        req.id,
        req.bookingNumber,
        req.customer,
        req.vendor,
        req.serviceType,
        req.requestedAmount,
        req.status,
        req.accountStatus,
        req.adminStatus,
        req.createdAt,
      ]),
    ];

    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `payment_requests_${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    setIsExporting(false);
  };

  const exportPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const rows = visibleRequests
      .map(
        (req) =>
          `<tr><td>${req.id}</td><td>${req.bookingNumber}</td><td>${req.customer}</td><td>${req.vendor}</td><td>${req.serviceType}</td><td>${formatINR(req.requestedAmount)}</td><td>${req.status}</td></tr>`,
      )
      .join("");
    const html = `
      <html>
        <head>
          <title>Payment Requests</title>
          <style>
            table { width: 100%; border-collapse: collapse; font-family: sans-serif; }
            th, td { border: 1px solid #ddd; padding: 8px; font-size: 12px; }
            th { background: #f3f4f6; }
          </style>
        </head>
        <body>
          <h2>Payment Requests</h2>
          <table>
            <thead><tr><th>ID</th><th>Booking</th><th>Customer</th><th>Vendor</th><th>Service</th><th>Amount</th><th>Status</th></tr></thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>`;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const handleImportRequests = (data: any[]) => {
    let currentMax = requests
      .map((r) => {
        const match = String(r.id).match(/PR-(\d+)/);
        return match ? Number(match[1]) : 0;
      })
      .reduce((max, num) => Math.max(max, num), 0);

    const parseJson = <T,>(value: unknown, fallback: T): T => {
      if (value === undefined || value === null) return fallback;
      if (typeof value === "string") {
        try {
          return JSON.parse(value) as T;
        } catch {
          return fallback;
        }
      }
      return value as T;
    };

    const importedRequests = data.map((row) => {
      currentMax += 1;
      const id = String(row.id || row.ID || row["Request ID"] || `PR-${String(currentMax).padStart(4, "0")}`);
      const createdAt = String(row.createdAt || row["Created At"] || new Date().toISOString());
      const updatedAt = String(row.updatedAt || row["Updated At"] || createdAt);
      const status = (String(row.status || row.Status || "Draft") as ApprovalStatus) || "Draft";
      const accountStatus = (String(row.accountStatus || row["Account Status"] || "Pending") as AccountStatus) || "Pending";
      const adminStatus = (String(row.adminStatus || row["Admin Status"] || "Pending") as SuperAdminStatus) || "Pending";
      const requestedAmount = Number(row.requestedAmount || row["Requested Amount"] || row.amount || row.Amount || 0) || 0;

      return {
        id,
        createdAt,
        updatedAt,
        createdBy: String(row.createdBy || row["Created By"] || auth?.name || "Imported"),
        bookingId: String(row.bookingId || row["Booking ID"] || ""),
        bookingNumber: String(row.bookingNumber || row["Booking Number"] || row.booking || ""),
        customer: String(row.customer || row.Customer || ""),
        vendor: String(row.vendor || row.Vendor || ""),
        serviceType: String(row.serviceType || row["Service Type"] || ""),
        bookingAmount: Number(row.bookingAmount || row["Booking Amount"] || 0) || 0,
        vendorPayable: Number(row.vendorPayable || row["Vendor Payable"] || 0) || 0,
        profit: Number(row.profit || row.Profit || 0) || 0,
        employeeName: String(row.employeeName || row["Employee Name"] || auth?.name || ""),
        requestedAmount,
        paymentMode: String(row.paymentMode || row["Payment Mode"] || "Bank Transfer"),
        dueDate: String(row.dueDate || row["Due Date"] || new Date().toISOString().slice(0, 10)),
        priority: (String(row.priority || row.Priority || "Normal") as PaymentRequest["priority"]),
        remarks: String(row.remarks || row.Remarks || ""),
        invoiceAttachments: parseJson<string[]>(row.invoiceAttachments || row["Invoice Attachments"] || "[]", []),
        vendorBillAttachments: parseJson<string[]>(row.vendorBillAttachments || row["Vendor Bill Attachments"] || "[]", []),
        status,
        accountStatus,
        adminStatus,
        isPaid: String(row.isPaid || row["Is Paid"] || "false").toLowerCase() === "true",
        paymentDetails: parseJson<PaymentDetails | null>(row.paymentDetails || row["Payment Details"] || null, null),
        accountRemarks: String(row.accountRemarks || row["Account Remarks"] || ""),
        adminRemarks: String(row.adminRemarks || row["Admin Remarks"] || ""),
        rejectionReason: String(row.rejectionReason || row["Rejection Reason"] || ""),
        auditTimeline: parseJson<TimelineEvent[]>(row.auditTimeline || row["Audit Timeline"] || "[]", []),
      };
    });

    setRequests((prev) => [...importedRequests, ...prev]);
    setIsImportOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            {pageSubtitle}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleOpenManualRequest} className="gap-2 rounded-xl shadow-lg">
            <Plus className="h-4 w-4" /> Manual Request
          </Button>
          <Button variant="outline" onClick={() => setIsImportOpen(true)} className="gap-2 rounded-xl">
            <Upload className="h-4 w-4" /> Import
          </Button>
          <Button variant="outline" onClick={exportCSV} disabled={isExporting} className="gap-2 rounded-xl">
            <Download className="h-4 w-4" /> Export CSV
          </Button>
          <Button variant="outline" onClick={exportPDF} className="gap-2 rounded-xl">
            <FileText className="h-4 w-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Role-Based Dashboards */}
      {auth?.role === "employee" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">My Requests</p>
                <p className="font-display text-2xl font-bold mt-2">{stats.total}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Pending Review</p>
                <p className="font-display text-2xl font-bold mt-2">{stats.pending}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Approved</p>
                <p className="font-display text-2xl font-bold mt-2">{stats.approved}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Rejected</p>
                <p className="font-display text-2xl font-bold mt-2">{stats.rejected}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Paid / Closed</p>
                <p className="font-display text-2xl font-bold mt-2">{stats.paid}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {auth?.role === "manager" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Pending Reviews</p>
                <p className="font-display text-2xl font-bold mt-2">{stats.pendingAccounts}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <Receipt className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Waiting Super Admin</p>
                <p className="font-display text-2xl font-bold mt-2">{stats.pendingSuperAdmin}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Approved</p>
                <p className="font-display text-2xl font-bold mt-2">{stats.approved}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Rejected</p>
                <p className="font-display text-2xl font-bold mt-2">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {auth?.role === "admin" && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-sky-100 text-sky-700">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Waiting Approval</p>
                <p className="font-display text-2xl font-bold mt-2">{stats.pendingSuperAdmin}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Approved</p>
                <p className="font-display text-2xl font-bold mt-2">{stats.approved}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Paid</p>
                <p className="font-display text-2xl font-bold mt-2">{stats.paid}</p>
              </div>
            </div>
          </div>
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-100 text-rose-700">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Rejected</p>
                <p className="font-display text-2xl font-bold mt-2">{stats.rejected}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold">Request Filters</h2>
            <p className="text-sm text-muted-foreground">Filter by status, vendor, employee, service, and created date.</p>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-4 lg:grid-cols-5">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-10"
                placeholder="Search booking, customer, vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="rounded-3xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
            >
              <option value="All">All Statuses</option>
              {(["Draft", "Pending Accounts", "Accounts Approved", "Pending Super Admin", "Approved", "Paid", "Completed", "Rejected"] as ApprovalStatus[]).map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
            <select
              className="rounded-3xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={vendorFilter}
              onChange={(e) => setVendorFilter(e.target.value as any)}
            >
              {vendorOptions.map((vendor) => (
                <option key={vendor} value={vendor}>{vendor}</option>
              ))}
            </select>
            <select
              className="rounded-3xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              value={employeeFilter}
              onChange={(e) => setEmployeeFilter(e.target.value as any)}
            >
              {employeeOptions.map((employee) => (
                <option key={employee} value={employee}>{employee}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} placeholder="From" />
          <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} placeholder="To" />
          <select
            className="rounded-3xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            value={serviceFilter}
            onChange={(e) => setServiceFilter(e.target.value as any)}
          >
            {serviceOptions.map((service) => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.75fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="font-semibold">Ready for Vendor Request</h2>
                <p className="text-sm text-muted-foreground">Auto-generate payment requests for bookings in vendor payment stage.</p>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                <ArrowRight className="h-4 w-4" /> {eligibleBookings.length} bookings ready
              </div>
            </div>
            {eligibleBookings.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-border bg-secondary/40 p-6 text-sm text-muted-foreground">
                No eligible bookings found. Check booking payments and vendor assignment to generate requests.
              </div>
            ) : (
              <div className="mt-6 overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-secondary/60 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3">Booking</th>
                      <th className="px-4 py-3">Customer</th>
                      <th className="px-4 py-3">Vendor</th>
                      <th className="px-4 py-3">Amount</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {eligibleBookings.slice(0, 6).map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-4 py-3 font-mono text-xs text-primary">{booking.reference || booking.id}</td>
                        <td className="px-4 py-3">{booking.customer}</td>
                        <td className="px-4 py-3">{booking.supplier}</td>
                        <td className="px-4 py-3 font-semibold">{formatINR(booking.amount || 0)}</td>
                        <td className="px-4 py-3 text-xs font-semibold uppercase text-foreground/70">{getBookingDisplayStatus(booking.status)}</td>
                        <td className="px-4 py-3 text-right">
                          <Button size="sm" variant="outline" onClick={() => handleGenerateRequest(booking)} className="rounded-full">Generate</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-secondary/40 px-5 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Payment Requests</p>
                  <h2 className="font-semibold">Workflow queue</h2>
                </div>
                <span className="text-xs text-muted-foreground">{visibleRequests.length} visible</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left">
                <thead className="bg-secondary/60 text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3">Request</th>
                    <th className="px-4 py-3">Booking</th>
                    <th className="px-4 py-3">Vendor</th>
                    <th className="px-4 py-3">Amount</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Owner</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {visibleRequests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                        No payment requests match the current filters.
                      </td>
                    </tr>
                  ) : (
                    visibleRequests.map((req) => (
                      <Fragment key={req.id}>
                        <tr className="group border-b border-border hover:bg-secondary/20 cursor-pointer" onClick={() => toggleRow(req.id, req)}>
                          <td className="px-4 py-4">
                            <div className="font-mono text-xs text-primary font-semibold">{req.id}</div>
                            <div className="text-[11px] text-muted-foreground">{formatDate(req.createdAt)}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-semibold">{req.bookingNumber || "—"}</div>
                            <div className="text-xs text-muted-foreground">{req.serviceType}</div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="font-semibold">{req.vendor}</div>
                            <div className="text-xs text-muted-foreground">{req.customer}</div>
                          </td>
                          <td className="px-4 py-4 font-semibold">{formatINR(req.requestedAmount)}</td>
                          <td className="px-4 py-4">
                            <span className={`inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${statusBadgeClasses[req.status]}`}>
                              {req.status}
                            </span>
                          </td>
                          <td className="px-4 py-4">{req.employeeName}</td>
                          <td className="px-4 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewingRequest(req);
                                  setIsViewOpen(true);
                                }}
                                title="View details"
                              >
                                <FileText className="h-4 w-4" />
                              </Button>
                              {isAccounts && req.status === "Pending Accounts" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleApproveAccounts(req);
                                  }}
                                >
                                  Approve
                                </Button>
                              )}
                              {isAccounts && req.status === "Pending Accounts" && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setDecisionTarget(req);
                                    setDecisionReason("");
                                  }}
                                >
                                  Reject
                                </Button>
                              )}
                              {isAdmin && req.status === "Pending Super Admin" && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSuperAdminDecision(req, "Approved");
                                  }}
                                >
                                  Approve
                                </Button>
                              )}
                            </div>
                          </td>
                        </tr>
                        {expandedRows[req.id] && (
                          <tr className="bg-secondary/10">
                            <td colSpan={7} className="px-4 py-4">
                              <div className="grid gap-4 lg:grid-cols-3">
                                <div className="rounded-3xl border border-border bg-background p-4">
                                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Payment Preview</p>
                                  <p className="mt-2 text-sm font-semibold">Requested: {formatINR(req.requestedAmount)}</p>
                                  <p className="text-sm text-muted-foreground">Vendor Payable: {formatINR(req.vendorPayable)}</p>
                                  <p className="text-sm text-muted-foreground">Profit: {formatINR(req.profit)}</p>
                                  <p className="text-sm text-muted-foreground">Due: {formatDate(req.dueDate)}</p>
                                </div>
                                <div className="rounded-3xl border border-border bg-background p-4">
                                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Approvals</p>
                                  <div className="mt-3 space-y-2">
                                    <div className="flex items-center justify-between gap-2 text-sm">
                                      <span>Accounts</span>
                                      <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${badgeClasses[req.accountStatus]}`}>
                                        {req.accountStatus}
                                      </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2 text-sm">
                                      <span>Super Admin</span>
                                      <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${badgeClasses[req.adminStatus]}`}>
                                        {req.adminStatus}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="rounded-3xl border border-border bg-background p-4">
                                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Attachments</p>
                                  <div className="mt-3 flex flex-wrap gap-2">
                                    {req.invoiceAttachments.length > 0 ? (
                                      req.invoiceAttachments.map((_, idx) => (
                                        <div key={idx} className="rounded-2xl border border-border bg-slate-100 px-3 py-2 text-xs">
                                          Invoice {idx + 1}
                                        </div>
                                      ))
                                    ) : (
                                      <p className="text-sm text-muted-foreground">No invoices</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Activity Drawer</h2>
            <p className="text-sm text-muted-foreground mt-1">Select a request to inspect timeline, approvals, and payment proof.</p>
            {activeDrawerRequest ? (
              <div className="mt-5 space-y-4">
                <div className="rounded-3xl border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Current Request</p>
                  <p className="mt-2 font-semibold">{activeDrawerRequest.id}</p>
                  <p className="text-sm text-muted-foreground">{activeDrawerRequest.bookingNumber} • {activeDrawerRequest.vendor}</p>
                </div>
                <div className="rounded-3xl border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Timeline</p>
                  <div className="mt-3 space-y-3">
                    {activeDrawerRequest.auditTimeline.slice(-4).map((event) => (
                      <div key={event.id} className="rounded-2xl border border-border bg-slate-50 p-3">
                        <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
                          <span>{event.actor}</span>
                          <span>{formatTime(event.timestamp)}</span>
                        </div>
                        <p className="mt-1 text-sm font-semibold">{event.action}</p>
                        {event.note && <p className="text-sm text-muted-foreground mt-1">{event.note}</p>}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-3xl border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Quick Actions</p>
                  <div className="mt-3 grid gap-2">
                    <Button onClick={() => { setViewingRequest(activeDrawerRequest); setIsViewOpen(true); }} variant="outline" className="w-full">View Full Request</Button>
                    {isAccounts && activeDrawerRequest.status === "Pending Accounts" && (
                      <Button onClick={() => handleApproveAccounts(activeDrawerRequest)} className="w-full">Approve in Accounts</Button>
                    )}
                    {isAdmin && activeDrawerRequest.status === "Pending Super Admin" && (
                      <Button onClick={() => handleSuperAdminDecision(activeDrawerRequest, "Approved")} className="w-full">Approve as Super Admin</Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-5 rounded-3xl border border-dashed border-border bg-secondary/50 p-6 text-sm text-muted-foreground">
                Select a request row to open the activity drawer.
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Customer Follow-ups</h2>
            <p className="text-sm text-muted-foreground mt-1">Pending follow-ups for partial payments and reminders.</p>
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="rounded-2xl border border-border bg-background p-3.5">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">Open Follow-ups</p>
                <p className="mt-1 text-xl font-bold">{followUps.filter((f) => f.pendingAmount > 0).length}</p>
              </div>
              <div className="rounded-2xl border border-border bg-background p-3.5">
                <p className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground font-semibold">Pending Amount</p>
                <p className="mt-1 text-base font-bold text-rose-600 dark:text-rose-400">{formatINR(followUps.reduce((sum, f) => sum + f.pendingAmount, 0))}</p>
              </div>
            </div>

            <div className="mt-5 space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {followUps.filter(f => f.pendingAmount > 0).map(f => {
                const todayStr = new Date().toISOString().split("T")[0];
                const isOverdue = f.dueDate && f.dueDate < todayStr;
                const portalUrl = window.location.origin + `/crm/portal?leadId=${f.invoiceId.replace("BK-", "LMH-").replace("LD-", "LMH-")}`;
                const msg = `Dear ${f.customerName},\n\nThis is a friendly reminder for the pending payment balance of ${formatINR(f.pendingAmount)} on your booking. Please view details and make payment here:\n${portalUrl}\n\nWarm regards,\nLook My Holidays`;
                const whatsappUrl = `https://wa.me/${f.customerPhone || "9876543210"}?text=${encodeURIComponent(msg)}`;
                
                return (
                  <div key={f.id} className="rounded-2xl border border-border bg-background p-4 hover:border-emerald-200 hover:shadow-sm transition-all duration-200">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm text-foreground flex items-center gap-1.5 flex-wrap">
                          {f.customerName}
                          {isOverdue && (
                            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950/40 dark:text-rose-400 uppercase tracking-wider">
                              Overdue
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          INV-{f.invoiceId.replace("BK-", "").replace("LD-", "")} • Due: <span className={isOverdue ? "text-rose-600 dark:text-rose-400 font-semibold" : ""}>{f.dueDate || f.invoiceDate}</span>
                        </p>
                      </div>
                      <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/20 px-2 py-0.5 rounded-full">
                        {formatINR(f.pendingAmount)}
                      </span>
                    </div>
                    {f.notes && (
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2 bg-secondary/35 p-2 rounded-xl border border-border/40">
                        {f.notes}
                      </p>
                    )}
                    <div className="flex items-center justify-between gap-2 mt-3.5 pt-3 border-t border-border/60">
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3 text-primary/70" />
                        Next: {f.nextFollowUpDate} {f.nextFollowUpTime}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(whatsappUrl, "_blank")}
                        className="h-7 text-xs px-2.5 rounded-xl border-emerald-200 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-300 dark:bg-emerald-950/20 dark:border-emerald-900/50 dark:text-emerald-400 dark:hover:bg-emerald-950/40 gap-1.5 font-medium cursor-pointer transition-all"
                      >
                        <Share2 className="h-3.5 w-3.5" /> Follow-Up Link
                      </Button>
                    </div>
                  </div>
                );
              })}
              {followUps.filter(f => f.pendingAmount > 0).length === 0 && (
                <div className="text-center py-6 text-xs text-muted-foreground bg-secondary/20 rounded-2xl border border-dashed border-border">
                  No pending customer follow-ups.
                </div>
              )}
            </div>
          </div>
        </aside>
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{form.status === "Draft" ? "New Manual Request" : "Request Submission"}</DialogTitle>
            <DialogDescription>
              Create a payment request manually when booking automation is not available.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitRequest} className="space-y-6 py-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label>Booking Number</Label>
                <Input
                  value={form.bookingNumber || ""}
                  onChange={(e) => setForm({ ...form, bookingNumber: e.target.value })}
                  placeholder="Booking number or reference"
                />
              </div>
              <div className="space-y-2">
                <Label>Customer</Label>
                <Input
                  value={form.customer || ""}
                  onChange={(e) => setForm({ ...form, customer: e.target.value })}
                  placeholder="Customer name"
                />
              </div>
              <div className="space-y-2">
                <Label>Vendor</Label>
                <Input
                  value={form.vendor || ""}
                  onChange={(e) => setForm({ ...form, vendor: e.target.value })}
                  placeholder="Vendor or supplier"
                />
              </div>
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Input
                  value={form.serviceType || ""}
                  onChange={(e) => setForm({ ...form, serviceType: e.target.value })}
                  placeholder="Travel, Insurance, Forex..."
                />
              </div>
              <div className="space-y-2">
                <Label>Booking Amount</Label>
                <Input
                  type="number"
                  value={form.bookingAmount || ""}
                  onChange={(e) => setForm({ ...form, bookingAmount: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Vendor Payable</Label>
                <Input
                  type="number"
                  value={form.vendorPayable || ""}
                  onChange={(e) => setForm({ ...form, vendorPayable: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Profit</Label>
                <Input
                  type="number"
                  value={form.profit || ""}
                  onChange={(e) => setForm({ ...form, profit: Number(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Requested Amount</Label>
                <Input
                  type="number"
                  value={form.requestedAmount || ""}
                  onChange={(e) => setForm({ ...form, requestedAmount: Number(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <select
                  className="rounded-3xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.paymentMode || "Bank Transfer"}
                  onChange={(e) => setForm({ ...form, paymentMode: e.target.value })}
                >
                  {['Bank Transfer', 'UPI', 'Cheque', 'Cash', 'Card'].map((mode) => (
                    <option value={mode} key={mode}>{mode}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Due Date</Label>
                <Input
                  type="date"
                  value={form.dueDate || new Date().toISOString().slice(0, 10)}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <select
                  className="rounded-3xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={form.priority || "Normal"}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as any })}
                >
                  {['High', 'Medium', 'Low', 'Normal'].map((value) => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label>Remarks</Label>
                <Textarea
                  value={form.remarks || ""}
                  onChange={(e) => setForm({ ...form, remarks: e.target.value })}
                  className="h-28"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <Label>Invoice Attachments</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-3xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary/30">
                      <FilePlus className="h-4 w-4" /> Upload
                      <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFileUpload(e, "invoiceAttachments")} />
                    </label>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(form.invoiceAttachments || []).map((_, idx) => (
                      <span key={idx} className="rounded-full border border-border bg-slate-100 px-3 py-1 text-xs">Invoice {idx + 1}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <Label>Vendor Bill Attachments</Label>
                  <div className="mt-2 flex items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-3xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground transition hover:bg-secondary/30">
                      <FilePlus className="h-4 w-4" /> Upload
                      <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFileUpload(e, "vendorBillAttachments")} />
                    </label>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(form.vendorBillAttachments || []).map((_, idx) => (
                      <span key={idx} className="rounded-full border border-border bg-slate-100 px-3 py-1 text-xs">Bill {idx + 1}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="pt-4">
              <Button variant="outline" onClick={() => setIsAddOpen(false)} type="button">Cancel</Button>
              <Button type="submit" className="shadow-md">Submit Request</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen && !!viewingRequest} onOpenChange={(open) => !open && setViewingRequest(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Payment Request Details</DialogTitle>
            <DialogDescription>
              Review the request workflow, attachments, and approval timeline.
            </DialogDescription>
          </DialogHeader>
          {viewingRequest && (
            <div className="space-y-6 py-4">
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-3xl border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Request ID</p>
                  <p className="mt-2 font-semibold">{viewingRequest.id}</p>
                </div>
                <div className="rounded-3xl border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Current Status</p>
                  <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold ${statusBadgeClasses[viewingRequest.status]}`}>
                    {viewingRequest.status}
                  </span>
                </div>
                <div className="rounded-3xl border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Created</p>
                  <p className="mt-2 text-sm">{formatDate(viewingRequest.createdAt)}</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-3xl border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Booking</p>
                  <p className="mt-2 font-semibold">{viewingRequest.bookingNumber || "—"}</p>
                  <p className="text-sm text-muted-foreground">{viewingRequest.serviceType}</p>
                </div>
                <div className="rounded-3xl border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Vendor</p>
                  <p className="mt-2 font-semibold">{viewingRequest.vendor}</p>
                  <p className="text-sm text-muted-foreground">{viewingRequest.employeeName}</p>
                </div>
                <div className="rounded-3xl border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Amounts</p>
                  <p className="mt-2 text-sm">Booking: {formatINR(viewingRequest.bookingAmount)}</p>
                  <p className="text-sm">Payable: {formatINR(viewingRequest.vendorPayable)}</p>
                  <p className="text-sm">Requested: {formatINR(viewingRequest.requestedAmount)}</p>
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-2">
                <div className="rounded-3xl border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Approval Notes</p>
                  <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                    <div>
                      <p className="font-semibold">Accounts</p>
                      <p>{viewingRequest.accountRemarks || "No notes yet."}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Super Admin</p>
                      <p>{viewingRequest.adminRemarks || "No notes yet."}</p>
                    </div>
                    {viewingRequest.rejectionReason && (
                      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                        <p className="font-semibold">Rejected Reason</p>
                        <p>{viewingRequest.rejectionReason}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="rounded-3xl border border-border bg-background p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Payment Details</p>
                  {viewingRequest.paymentDetails ? (
                    <div className="mt-3 space-y-2 text-sm">
                      <p>Method: {viewingRequest.paymentDetails.paymentMethod}</p>
                      <p>Txn ID: {viewingRequest.paymentDetails.transactionId || "—"}</p>
                      <p>Bank: {viewingRequest.paymentDetails.bankName || "—"}</p>
                      <p>Date: {formatDate(viewingRequest.paymentDetails.paymentDate)}</p>
                      <p>Remarks: {viewingRequest.paymentDetails.remarks || "—"}</p>
                    </div>
                  ) : (
                    <p className="mt-3 text-sm text-muted-foreground">No payment proof uploaded yet.</p>
                  )}
                </div>
              </div>

              <div className="rounded-3xl border border-border bg-background p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Timeline</p>
                <div className="mt-4 space-y-3">
                  {viewingRequest.auditTimeline.map((event) => (
                    <div key={event.id} className="rounded-2xl border border-border bg-slate-50 p-3">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                        <span>{event.actor}</span>
                        <span>{formatTime(event.timestamp)}</span>
                      </div>
                      <p className="mt-1 font-semibold">{event.action}</p>
                      {event.note && <p className="text-sm text-muted-foreground mt-1">{event.note}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button variant="outline" onClick={() => setIsViewOpen(false)}>Close</Button>
                {isAdmin && viewingRequest.status === "Approved" && (
                  <Button onClick={() => { setPaymentForm({ ...paymentForm, paymentDate: new Date().toISOString().slice(0, 10) }); setIsPaymentModalOpen(true); }}>
                    Mark Paid
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!decisionTarget} onOpenChange={(open) => !open && setDecisionTarget(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Reject Request</DialogTitle>
            <DialogDescription>
              Provide a short reason so the employee can update and resubmit the payment request.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Reason</Label>
              <Textarea
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
                className="h-28"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDecisionTarget(null)}>Cancel</Button>
            <Button
              variant="destructive"
              disabled={!decisionReason.trim()}
              onClick={() => {
                if (decisionTarget && decisionReason.trim()) {
                  handleRejectAccounts(decisionTarget, decisionReason.trim());
                  setDecisionTarget(null);
                }
              }}
            >
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ImportModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImport={handleImportRequests}
        title="Import Payment Requests"
        description="Upload a CSV or Excel file to import payment request records into the approval workflow."
      />

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Record Payment Details</DialogTitle>
            <DialogDescription>
              Save transaction details and upload payment proof for the approved request.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSavePaymentDetails} className="space-y-4 py-4">
            <div className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label>Payment Method</Label>
                <select
                  className="rounded-3xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                >
                  {['Bank Transfer', 'UPI', 'Cheque', 'Cash', 'Card'].map((mode) => (
                    <option value={mode} key={mode}>{mode}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>Transaction ID</Label>
                <Input value={paymentForm.transactionId} onChange={(e) => setPaymentForm({ ...paymentForm, transactionId: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Payment Date</Label>
                <Input type="date" value={paymentForm.paymentDate} onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Bank Name</Label>
                <Input value={paymentForm.bankName} onChange={(e) => setPaymentForm({ ...paymentForm, bankName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>UPI Reference</Label>
                <Input value={paymentForm.upiReference} onChange={(e) => setPaymentForm({ ...paymentForm, upiReference: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Cheque Number</Label>
                <Input value={paymentForm.chequeNumber} onChange={(e) => setPaymentForm({ ...paymentForm, chequeNumber: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Remarks</Label>
              <Textarea value={paymentForm.remarks} onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })} className="h-24" />
            </div>
            <div>
              <Label>Payment Proof</Label>
              <div className="mt-2 flex items-center gap-3">
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-3xl border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary/30">
                  <FilePlus className="h-4 w-4" /> Upload Proof
                  <input type="file" accept="image/*,.pdf" className="hidden" onChange={handleUploadPaymentProof} />
                </label>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {paymentForm.proofAttachments.map((_, idx) => (
                  <span key={idx} className="rounded-full border border-border bg-slate-100 px-3 py-1 text-xs">Proof {idx + 1}</span>
                ))}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPaymentModalOpen(false)} type="button">Cancel</Button>
              <Button type="submit">Save Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
