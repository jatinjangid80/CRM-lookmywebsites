import { createFileRoute } from "@tanstack/react-router";
import {
  Plus,
  X,
  Upload,
  FileText,
  FileSpreadsheet,
  FileImage,
  File,
  Download,
  Trash2,
  Table2,
  Briefcase,
  Plane,
  Train,
  Building2,
  Map,
  Car,
  ShieldCheck,
  Shield,
  Bus,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  Undo2,
  CreditCard,
  ChevronDown,
  Copy,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend,
} from "recharts";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ImportModal } from "@/components/ui/import-modal";
import { formatINR, type Booking } from "@/lib/mock-data";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { getAuth } from "@/lib/auth";
import { AddBookingModal } from "@/components/AddBookingModal";
import { BookingType } from "@/lib/mock-data";

interface BookingFile {
  name: string;
  size: number;
  type: string;
  priority: "High" | "Medium" | "Low";
  uploadedAt: string;
  dataUrl: string;
}

interface ExtBooking extends Booking {
  files?: BookingFile[];
}

export const Route = createFileRoute("/crm/bookings")({
  component: BookingsPage,
});

const statusColor: Record<Booking["status"], string> = {
  Confirmed: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Cancelled: "bg-rose-100 text-rose-700",
  Completed: "bg-blue-100 text-blue-700",
  Partial: "bg-blue-100 text-blue-700",
  Paid: "bg-emerald-100 text-emerald-700",
  Refunded: "bg-purple-100 text-purple-700",
};

const SERVICES = [
  {
    group: "Travel Services",
    items: [
      { label: "Air Ticket", icon: "✈️" },
      { label: "Hotel Booking", icon: "🏨" },
      { label: "Visa", icon: "🛂" },
      { label: "Cruise Booking", icon: "🚢" },
      { label: "Passport Assistance", icon: "📘" },
      { label: "Forex Exchange", icon: "💱" },
      { label: "Airport Transfer", icon: "🚕" },
      { label: "Car Rental", icon: "🚗" },
      { label: "Train Ticket", icon: "🚆" },
      { label: "Bus Ticket", icon: "🚌" },
      { label: "Taxi Booking", icon: "🚕" },
      { label: "Travel Insurance", icon: "🛡️" },
    ],
  },
  {
    group: "Holiday Packages",
    items: [
      { label: "International Package", icon: "🌍" },
      { label: "Domestic Package", icon: "🏝" },
      { label: "Honeymoon Package", icon: "💖" },
      { label: "Family Package", icon: "👨‍👩‍👧‍👦" },
      { label: "Group Tour", icon: "🚌" },
      { label: "Corporate Tour", icon: "🏢" },
      { label: "Luxury Tour", icon: "✨" },
      { label: "Adventure Tour", icon: "🧗" },
    ],
  },
  {
    group: "Business",
    items: [
      { label: "Corporate Travel", icon: "💼" },
      { label: "MICE Events", icon: "🎤" },
      { label: "Conference Booking", icon: "🎟" },
    ],
  },
];

function BookingsPage() {
  const auth = getAuth();
  const isAdmin = auth?.role === "admin";

  const [bookingList, setBookingList] = useSupabaseTable<ExtBooking[]>("bookings", []);
  const [leads, setLeads] = useSupabaseTable<any[]>("leads", []);

  const allBookings = useMemo(() => {
    const derived = leads
      .filter((l: any) => l.bookingReference || ["Booked", "Completed", "Confirmed", "Payment Pending", "Travel Completed", "Review Collected"].includes(l.status))
      .map(
        (l: any) =>
          ({
            id: "LD-" + l.id.replace("L-", ""),
            bookingType: (l.service || "Holiday Package") as BookingType,
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
            sellingPrice: l.totalAmount || Number(l.budget) || 0,
            purchasePrice: 0,
            profit: 0,
            margin: 0,
            amount: l.totalAmount || Number(l.budget) || 0,
            paid: l.amountPaid || 0,
            paymentMode: "Card",
            transactionId: "",
            status: l.paymentStatus || "Pending",
            package: l.destination || "Unknown",
            travelDate: l.travelDate || "TBD",
          }) as ExtBooking,
      );
    return [...bookingList, ...derived];
  }, [leads, bookingList]);

  // --- Dashboard Data Aggregation ---
  const dashboardData = useMemo(() => {
    let totalRevenue = 0;
    let totalProfit = 0;

    let confirmedCount = 0;
    let pendingCount = 0;
    let cancelledCount = 0;
    let refundedCount = 0;

    const serviceCounts = {
      "Air Ticket": 0,
      "Train Ticket": 0,
      Hotel: 0,
      "Holiday Package": 0,
      Taxi: 0,
      Visa: 0,
      "Travel Insurance": 0,
      "General Insurance": 0,
      "Bus Ticket": 0,
    };

    const monthlyRev: Record<string, number> = {};

    allBookings.forEach((b) => {
      // Service Counts
      const type = b.bookingType as keyof typeof serviceCounts;
      if (serviceCounts[type] !== undefined) {
        serviceCounts[type]++;
      } else {
        serviceCounts["Holiday Package"]++; // Fallback
      }

      // Status
      if (b.status === "Confirmed" || b.status === "Completed" || b.status === "Paid")
        confirmedCount++;
      else if (b.status === "Pending" || b.status === "Partial") pendingCount++;
      else if (b.status === "Cancelled") cancelledCount++;
      else if (b.status === "Refunded") refundedCount++;

      // Revenue & Profit
      if (b.status !== "Cancelled" && b.status !== "Refunded") {
        totalRevenue += b.amount || 0;
        totalProfit += b.profit || 0;

        // Monthly
        const monthMatch = (b.bookingDate || b.travelDate || "").match(/^\d{4}-(\d{2})-\d{2}$/);
        if (monthMatch) {
          const monthIdx = parseInt(monthMatch[1], 10) - 1;
          const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          const month = monthNames[monthIdx];
          monthlyRev[month] = (monthlyRev[month] || 0) + (b.amount || 0);
        }
      }
    });

    const margin = totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : "0.0";
    const avgValue = confirmedCount > 0 ? totalRevenue / confirmedCount : 0;

    const monthlyData = Object.keys(monthlyRev).map((k) => ({ name: k, revenue: monthlyRev[k] }));

    const serviceData = [
      { name: "Air", value: serviceCounts["Air Ticket"] },
      { name: "Train", value: serviceCounts["Train Ticket"] },
      { name: "Hotel", value: serviceCounts["Hotel"] },
      { name: "Holiday", value: serviceCounts["Holiday Package"] },
      { name: "Taxi", value: serviceCounts["Taxi"] },
      { name: "Visa", value: serviceCounts["Visa"] },
      { name: "Insurance", value: serviceCounts["Travel Insurance"] },
      { name: "Gen Ins", value: serviceCounts["General Insurance"] },
      { name: "Bus", value: serviceCounts["Bus Ticket"] },
    ]
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);

    const statusData = [
      { name: "Confirmed", value: confirmedCount, color: "#10b981" },
      { name: "Pending", value: pendingCount, color: "#f59e0b" },
      { name: "Cancelled", value: cancelledCount, color: "#f43f5e" },
      { name: "Refunded", value: refundedCount, color: "#a855f7" },
    ].filter((d) => d.value > 0);

    return {
      totalBookings: allBookings.length,
      serviceCounts,
      totalRevenue,
      totalProfit,
      margin,
      avgValue,
      statusCounts: { confirmedCount, pendingCount, cancelledCount, refundedCount },
      serviceData,
      monthlyData,
      statusData,
    };
  }, [allBookings]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [managingBooking, setManagingBooking] = useState<ExtBooking | null>(null);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ExtBooking | null>(null);

  // Tab state for filtering
  const [activeTab, setActiveTab] = useState<string>("All");

  // Success popup state
  const [successBooking, setSuccessBooking] = useState<Booking | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-close success popup after 4 seconds
  useEffect(() => {
    if (showSuccess) {
      const t = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(t);
    }
  }, [showSuccess]);

  // Export state
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Export: Excel / CSV
  const exportToExcel = () => {
    const headers = [
      "ID",
      "Customer",
      "Package",
      "Travel Date",
      "Amount (₹)",
      "Paid (₹)",
      "Status",
    ];
    const csvRows = [
      headers.join(","),
      ...allBookings.map((b) =>
        [
          `"${b.id}"`,
          `"${b.customer.replace(/"/g, '""')}"`,
          `"${b.package.replace(/"/g, '""')}"`,
          `"${b.travelDate}"`,
          b.amount,
          b.paid,
          `"${b.status}"`,
        ].join(","),
      ),
    ];
    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export: Word (.doc)
  const exportToWord = () => {
    const tableHeader =
      "<tr><th>ID</th><th>Customer</th><th>Package</th><th>Travel Date</th><th>Amount</th><th>Paid</th><th>Status</th></tr>";
    const tableRows = allBookings
      .map(
        (b) =>
          `<tr><td>${b.id}</td><td>${b.customer}</td><td>${b.package}</td><td>${b.travelDate}</td><td>₹${b.amount}</td><td>₹${b.paid}</td><td>${b.status}</td></tr>`,
      )
      .join("");
    const htmlString = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Bookings Export</title><style>table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; } th, td { border: 1px solid #dddddd; padding: 8px; text-align: left; } th { background-color: #f2f2f2; }</style></head>
      <body><h2>Grand Journeys CRM - Bookings Export</h2><table>${tableHeader}${tableRows}</table></body>
      </html>
    `;
    const blob = new Blob([htmlString], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `bookings_export_${new Date().toISOString().slice(0, 10)}.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export: PDF
  const exportToPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const tableHeader =
      "<tr><th>ID</th><th>Customer</th><th>Package</th><th>Travel Date</th><th>Amount</th><th>Paid</th><th>Status</th></tr>";
    const tableRows = allBookings
      .map(
        (b) =>
          `<tr><td>${b.id}</td><td>${b.customer}</td><td>${b.package}</td><td>${b.travelDate}</td><td>\u20b9${b.amount}</td><td>\u20b9${b.paid}</td><td>${b.status}</td></tr>`,
      )
      .join("");
    const css = `body{font-family:sans-serif;padding:20px;color:#333}h2{color:#f43f5e;margin-bottom:5px}p{font-size:12px;color:#666;margin-bottom:20px}table{border-collapse:collapse;width:100%;font-size:12px}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f9fafb;font-weight:bold}tr:nth-child(even){background:#f3f4f6}`;
    const styleEl = printWindow.document.createElement("style");
    styleEl.textContent = css;
    printWindow.document.head.appendChild(styleEl);
    const titleEl = printWindow.document.createElement("title");
    titleEl.textContent = "Bookings Export PDF";
    printWindow.document.head.appendChild(titleEl);
    const bodyHtml = `<h2>Grand Journeys CRM - Bookings Export</h2><p>Generated on ${new Date().toLocaleDateString("en-IN")} | Total Bookings: ${allBookings.length}</p><table><thead>${tableHeader}</thead><tbody>${tableRows}</tbody></table>`;
    const wrapper = printWindow.document.createElement("div");
    wrapper.innerHTML = bodyHtml;
    printWindow.document.body.appendChild(wrapper);
    const script = printWindow.document.createElement("script");
    script.textContent =
      "window.onload=function(){window.print();window.onafterprint=function(){window.close();}}";
    printWindow.document.body.appendChild(script);
    printWindow.document.close();
  };

  // File upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPriority, setUploadPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [uploading, setUploading] = useState(false);

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<ExtBooking>>({});

  const handleManageBooking = (booking: ExtBooking) => {
    setManagingBooking(booking);
    setEditForm(booking);
    setIsEditing(false);
    setIsManageOpen(true);
    setUploadFile(null);
    setUploadPriority("Medium");
  };

  const updateBookingStatus = (bookingId: string, status: Booking["status"]) => {
    if (bookingId.startsWith("LD-")) {
      setLeads((prev) => prev.map((l) => {
        if ("LD-" + l.id.replace("L-", "") === bookingId) {
          return { ...l, paymentStatus: status };
        }
        return l;
      }));
    } else {
      setBookingList((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status } : b)));
    }

    if (managingBooking?.id === bookingId) {
      setManagingBooking({ ...managingBooking, status } as ExtBooking);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!managingBooking) return;

    if (managingBooking.id.startsWith("LD-")) {
      setLeads((prev) => prev.map(l => {
        if ("LD-" + l.id.replace("L-", "") === managingBooking.id) {
          return {
            ...l,
            name: editForm.customer,
            travelDate: editForm.travelDate,
            destination: editForm.package,
            service: editForm.bookingType,
            totalAmount: editForm.amount,
            amountPaid: editForm.paid
          };
        }
        return l;
      }));
    } else {
      setBookingList((prev) => prev.map(b => b.id === managingBooking.id ? { ...b, ...editForm } as ExtBooking : b));
    }

    setManagingBooking({ ...managingBooking, ...editForm } as ExtBooking);
    setIsEditing(false);
  };

  function readAsDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleAddFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile || !managingBooking) return;

    setUploading(true);
    try {
      const dataUrl = await readAsDataUrl(uploadFile);
      const newFile: BookingFile = {
        name: uploadFile.name,
        size: uploadFile.size,
        type: uploadFile.type || "application/octet-stream",
        priority: uploadPriority,
        uploadedAt: new Date().toISOString(),
        dataUrl,
      };

      const updatedBooking: ExtBooking = {
        ...managingBooking,
        files: [...(managingBooking.files || []), newFile],
      };

      setBookingList((prev) => prev.map((b) => (b.id === managingBooking.id ? updatedBooking : b)));
      setManagingBooking(updatedBooking);
      setUploadFile(null);
      setUploadPriority("Medium");
      const fileInput = document.getElementById("booking-doc-file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
    } catch (err) {
      console.error("File upload failed", err);
      alert("File upload failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = (fileName: string) => {
    if (!managingBooking) return;
    const updatedBooking = {
      ...managingBooking,
      files: (managingBooking.files || []).filter((f) => f.name !== fileName),
    };
    setBookingList((prev) => prev.map((b) => (b.id === managingBooking.id ? updatedBooking : b)));
    setManagingBooking(updatedBooking);
  };

  const handleDeleteBooking = () => {
    if (!deleteTarget) return;
    setBookingList((prev) => prev.filter((b) => b.id !== deleteTarget.id));
    setDeleteTarget(null);
    toast.success("Booking deleted successfully!");
  };

  const handleCloneBooking = (bookingToClone: ExtBooking) => {
    try {
      const maxNumber = bookingList.reduce((max, b) => {
        const match = b.id?.match(/\d+/);
        if (match) {
          const val = parseInt(match[0]);
          return val > max ? val : max;
        }
        return max;
      }, 0);
      const newId = `BK-${String(maxNumber + 1).padStart(3, "0")}`;
      const newBooking: ExtBooking = {
        ...bookingToClone,
        id: newId,
        customer: `${bookingToClone.customer} (Copy)`,
        bookingDate: new Date().toISOString().slice(0, 10),
      };
      setBookingList((prev) => [newBooking, ...prev]);
      toast.success(`Booking cloned successfully as ${newId}!`);
    } catch (err) {
      toast.error("Failed to clone booking");
    }
  };

  function getFileIcon(type: string, name: string) {
    const lowercaseName = name.toLowerCase();
    if (type === "application/pdf" || lowercaseName.endsWith(".pdf")) {
      return <FileText className="h-4 w-4 text-rose-500" />;
    }
    if (
      type.includes("sheet") ||
      type.includes("excel") ||
      lowercaseName.endsWith(".xlsx") ||
      lowercaseName.endsWith(".xls") ||
      lowercaseName.endsWith(".csv")
    ) {
      return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />;
    }
    if (
      type.includes("word") ||
      type.includes("document") ||
      lowercaseName.endsWith(".docx") ||
      lowercaseName.endsWith(".doc")
    ) {
      return <FileText className="h-4 w-4 text-blue-500" />;
    }
    if (type.startsWith("image/")) {
      return <FileImage className="h-4 w-4 text-purple-500" />;
    }
    return <File className="h-4 w-4 text-gray-400" />;
  }

  function fmtSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  }

  const priorityColor = {
    High: "bg-red-50 text-red-700 border-red-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Low: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const handleImportBookings = (data: any[]) => {
    let currentMaxId = bookingList.reduce((max, b) => {
      const numStr = String(b.id || "").replace(/BK-?/i, "");
      const num = parseInt(numStr, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);

    const importedBookings = data.map((row) => {
      currentMaxId++;
      return {
        id: `BK-${String(currentMaxId).padStart(3, "0")}`,
        bookingType: "Legacy" as Booking["bookingType"],
        supplier: row["Supplier"] || "Unknown",
        bookingDate: new Date().toISOString().slice(0, 10),
        customer: row["Customer"] || row["customer"] || row["Name"] || "Unknown",
        mobileNumber: "",
        bookedBy: "",
        company: "",
        reference: "",
        saleInvoiceNo: "",
        purchaseInvoiceNo: "",
        remarks: "",
        sellingPrice: parseInt(row["Amount"] || row["amount"] || row["Total"]) || 0,
        purchasePrice: 0,
        profit: 0,
        margin: 0,
        package: row["Package"] || row["package"] || row["Service"] || "Custom Package",
        travelDate:
          row["Travel Date"] ||
          row["travelDate"] ||
          row["Date"] ||
          new Date().toISOString().slice(0, 10),
        status: (row["Status"] || row["status"] || "Pending") as Booking["status"],
        amount: parseInt(row["Amount"] || row["amount"] || row["Total"]) || 0,
        paid: parseInt(row["Paid"] || row["paid"]) || 0,
        paymentMode: "Cash" as Booking["paymentMode"],
        transactionId: "",
      };
    });
    setBookingList((prev) => [...importedBookings, ...prev]);
  };

  const handleAddBookingSave = (booking: Booking) => {
    const isDuplicate = bookingList.some(
      (b) =>
        b.customer.toLowerCase() === booking.customer.toLowerCase() &&
        b.bookingType === booking.bookingType &&
        b.bookingDate === booking.bookingDate
    );
    if (isDuplicate) {
      alert("A booking for this customer on this date with this type already exists.");
      return;
    }

    const currentMaxId = bookingList.reduce((max, b) => {
      const numStr = String(b.id || "").replace(/BK-?/i, "");
      const num = parseInt(numStr, 10);
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const nextId = `BK-${String(currentMaxId + 1).padStart(3, "0")}`;
    const newBooking = { ...booking, id: nextId };

    setBookingList([newBooking, ...bookingList]);
    setSuccessBooking(newBooking);
    setShowSuccess(true);
  };

  const filteredBookings = allBookings.filter((b) => {
    if (activeTab === "All") return true;
    if (b.bookingType === activeTab) return true;

    // Legacy mappings for AddBookingModal & Mock Data
    if (activeTab === "Hotel Booking" && b.bookingType === "Hotel") return true;

    const isHolidayPackageTab = [
      "International Package",
      "Domestic Package",
      "Honeymoon Package",
      "Weekend Getaways"
    ].includes(activeTab);

    if (isHolidayPackageTab && (b.bookingType === "Holiday Package" || !b.bookingType)) return true;

    return false;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Bookings</h1>
          <p className="text-sm text-muted-foreground">
            Packages, flights, hotels, visas and transfers — all in one place.
          </p>
        </div>

        <div className="flex gap-2">

          <Button className="btn-hero" onClick={() => setIsAddOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> New booking
          </Button>
          <AddBookingModal
            open={isAddOpen}
            onOpenChange={setIsAddOpen}
            onSave={handleAddBookingSave}
          />
        </div>
      </div>

      {/* ===== Dashboard Section ===== */}
      <div className="space-y-6 bg-secondary/10 p-6 rounded-2xl border border-border">
        {/* Row 1: KPI Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4 text-blue-500" />{" "}
              <span className="text-xs font-semibold uppercase tracking-wider">Total</span>
            </div>
            <p className="text-2xl font-bold">{dashboardData.totalBookings}</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Plane className="h-4 w-4 text-sky-500" />{" "}
              <span className="text-xs font-semibold uppercase tracking-wider">Air</span>
            </div>
            <p className="text-2xl font-bold">{dashboardData.serviceCounts["Air Ticket"]}</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Train className="h-4 w-4 text-purple-500" />{" "}
              <span className="text-xs font-semibold uppercase tracking-wider">Train</span>
            </div>
            <p className="text-2xl font-bold">{dashboardData.serviceCounts["Train Ticket"]}</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4 text-orange-500" />{" "}
              <span className="text-xs font-semibold uppercase tracking-wider">Hotels</span>
            </div>
            <p className="text-2xl font-bold">{dashboardData.serviceCounts["Hotel"]}</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Map className="h-4 w-4 text-emerald-500" />{" "}
              <span className="text-xs font-semibold uppercase tracking-wider">Holiday</span>
            </div>
            <p className="text-2xl font-bold">{dashboardData.serviceCounts["Holiday Package"]}</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Car className="h-4 w-4 text-yellow-500" />{" "}
              <span className="text-xs font-semibold uppercase tracking-wider">Taxi</span>
            </div>
            <p className="text-2xl font-bold">{dashboardData.serviceCounts["Taxi"]}</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="h-4 w-4 text-indigo-500" />{" "}
              <span className="text-xs font-semibold uppercase tracking-wider">Visa</span>
            </div>
            <p className="text-2xl font-bold">{dashboardData.serviceCounts["Visa"]}</p>
          </div>
          <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-teal-500" />{" "}
              <span className="text-xs font-semibold uppercase tracking-wider">Insurance</span>
            </div>
            <p className="text-2xl font-bold">{dashboardData.serviceCounts["Travel Insurance"]}</p>
          </div>

          <div className="bg-card border border-border p-4 rounded-xl shadow-sm flex flex-col gap-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Bus className="h-4 w-4 text-pink-500" />{" "}
              <span className="text-xs font-semibold uppercase tracking-wider">Bus</span>
            </div>
            <p className="text-2xl font-bold">{dashboardData.serviceCounts["Bus Ticket"]}</p>
          </div>
        </div>

        {/* Row 2: Revenue Analytics */}
        <div className="grid grid-cols-2 md:grid-cols-2 gap-4">
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="h-16 w-16 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Revenue
            </p>
            <p className="text-3xl font-display font-bold text-foreground">
              {formatINR(dashboardData.totalRevenue)}
            </p>
          </div>
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CheckCircle2 className="h-16 w-16 text-blue-600" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Avg Booking Value
            </p>
            <p className="text-3xl font-display font-bold text-blue-600">
              {formatINR(dashboardData.avgValue)}
            </p>
          </div>
        </div>

        {/* Row 3: Status Summary */}
        <div className="grid grid-cols-4 gap-3 bg-card p-2 rounded-xl border border-border">
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-emerald-50 text-emerald-700">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Confirmed</span>
            </div>
            <span className="text-2xl font-bold mt-1">
              {dashboardData.statusCounts.confirmedCount}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-amber-50 text-amber-700">
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Pending</span>
            </div>
            <span className="text-2xl font-bold mt-1">
              {dashboardData.statusCounts.pendingCount}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-rose-50 text-rose-700">
            <div className="flex items-center gap-1.5">
              <XCircle className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Cancelled</span>
            </div>
            <span className="text-2xl font-bold mt-1">
              {dashboardData.statusCounts.cancelledCount}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-purple-50 text-purple-700">
            <div className="flex items-center gap-1.5">
              <Undo2 className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Refunded</span>
            </div>
            <span className="text-2xl font-bold mt-1">
              {dashboardData.statusCounts.refundedCount}
            </span>
          </div>
        </div>

        {/* Row 4: Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          {/* Bookings by Service */}
          <div className="bg-card border border-border rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">
              Bookings by Service
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dashboardData.serviceData}
                  layout="vertical"
                  margin={{ top: 0, right: 20, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: "rgba(0,0,0,0.05)" }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Booking Status */}
          <div className="bg-card border border-border rounded-2xl shadow-sm p-5">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">
              Booking Status
            </h3>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={dashboardData.statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {dashboardData.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    iconType="circle"
                    wrapperStyle={{ fontSize: "12px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Category Dropdown Navigation */}
      <div className="flex justify-end items-center gap-2 py-4 text-sm">
        <span className="text-muted-foreground font-medium">Category:</span>
        <select
          value={activeTab}
          onChange={(e) => setActiveTab(e.target.value)}
          className="h-9 cursor-pointer appearance-none rounded-full border border-border bg-card text-card-foreground pl-4 pr-9 py-1.5 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%23111827%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1em_1em] bg-[right_1rem_center] bg-no-repeat"
        >
          <option value="All">All Categories</option>
          {SERVICES.map((g) => (
            <optgroup key={g.group} label={g.group}>
              {g.items.map((i) => (
                <option key={i.label} value={i.label}>
                  {i.icon} {i.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 whitespace-nowrap">Booking Date</th>
                <th className="px-4 py-3 whitespace-nowrap">Travel Date</th>
                <th className="px-4 py-3 whitespace-nowrap">Passenger Name</th>
                <th className="px-4 py-3 whitespace-nowrap">Mobile No</th>
                <th className="px-4 py-3 whitespace-nowrap">Selling Price (₹)</th>
                <th className="px-4 py-3 whitespace-nowrap">Purchase Price (₹)</th>
                <th className="px-4 py-3 whitespace-nowrap">Profit (₹)</th>
                <th className="px-4 py-3 whitespace-nowrap">Booked By</th>
                <th className="px-4 py-3 whitespace-nowrap">Reference</th>
                <th className="px-4 py-3 whitespace-nowrap">Payment Status</th>
                <th className="px-4 py-3 whitespace-nowrap">Remarks</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-muted-foreground">
                    No bookings found for {activeTab}.
                  </td>
                </tr>
              ) : (
                filteredBookings.map((b) => (
                  <tr key={b.id} className="border-t border-border hover:bg-secondary/30 cursor-pointer transition-colors" onClick={() => handleManageBooking(b)}>
                    <td className="px-4 py-3 text-sm whitespace-nowrap text-muted-foreground">{b.bookingDate || "-"}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{b.travelDate || "-"}</td>
                    <td className="px-4 py-3 font-semibold whitespace-nowrap">{b.customer || "-"}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{b.mobileNumber || "-"}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap text-primary">{formatINR(b.sellingPrice || b.amount || 0)}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap text-muted-foreground">{formatINR(b.purchasePrice || 0)}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap text-emerald-600">{formatINR(b.profit || 0)}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap text-muted-foreground">{b.bookedBy || "-"}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap">{b.reference || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <Select
                        value={b.status}
                        onValueChange={(val: Booking["status"]) => updateBookingStatus(b.id, val)}
                      >
                        <SelectTrigger className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase border-none h-auto w-auto focus:ring-0 focus:ring-offset-0 shadow-none [&>svg]:hidden ${statusColor[b.status as keyof typeof statusColor] || statusColor["Pending"]}`}>
                          <SelectValue />
                          <ChevronDown className="h-3 w-3 opacity-70 ml-1" />
                        </SelectTrigger>
                        <SelectContent>
                          {["Confirmed", "Pending", "Cancelled", "Completed", "Partial", "Paid", "Refunded"].map((s) => (
                            <SelectItem key={s} value={s} className="text-xs font-semibold">
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground max-w-[200px] truncate" title={b.remarks || "-"}>{b.remarks || "-"}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-green-500 hover:text-green-700 hover:bg-green-50 h-8 w-8 p-0 rounded-xl"
                          onClick={() => handleCloneBooking(b)}
                          title="Clone Booking"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-8 w-8 p-0 rounded-xl"
                          onClick={() => setDeleteTarget(b)}
                          title="Delete Booking"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ImportModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImport={handleImportBookings}
        title="Import Bookings"
        description="Upload a CSV or Excel file containing your bookings."
      />

      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border p-6 shadow-2xl bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">
              Manage Booking Details
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Upload visa documents, tickets, hotel vouchers, and set document priorities.
            </DialogDescription>
          </DialogHeader>

          {managingBooking && (
            <div className="space-y-6 py-4">
              {/* Booking Info Card */}
              <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-semibold text-primary">
                    {managingBooking.id}
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)} className="h-7 text-xs">
                      {isEditing ? "Cancel" : "Edit"}
                    </Button>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor[managingBooking.status]}`}
                    >
                      {managingBooking.status}
                    </span>
                  </div>
                </div>
                {isEditing ? (
                  <form onSubmit={handleSaveEdit} className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold">Customer</Label>
                      <Input value={editForm.customer || ""} onChange={e => setEditForm({ ...editForm, customer: e.target.value })} className="rounded-3xl px-4" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold">Travel Date</Label>
                      <Input type="date" value={editForm.travelDate || ""} onChange={e => setEditForm({ ...editForm, travelDate: e.target.value })} className="rounded-3xl px-4" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold">Service <span className="text-red-500">*</span></Label>
                      <select
                        value={editForm.bookingType || ""}
                        onChange={e => setEditForm({ ...editForm, bookingType: e.target.value as any })}
                        className="w-full rounded-3xl border border-border bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select a service</option>
                        {SERVICES.map((g) => (
                          <optgroup key={g.group} label={g.group}>
                            {g.items.map((i) => (
                              <option key={i.label} value={i.label}>
                                {i.icon} {i.label}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold">Destination <span className="text-red-500">*</span></Label>
                      <Input placeholder="e.g. Bali, Paris..." value={editForm.package || ""} onChange={e => setEditForm({ ...editForm, package: e.target.value })} className="rounded-3xl px-4" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold">Total Budget (₹)</Label>
                      <Input type="number" placeholder="e.g. 85000" value={editForm.amount || 0} onChange={e => setEditForm({ ...editForm, amount: Number(e.target.value) })} className="rounded-3xl px-4" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-semibold">Amount Paid (₹)</Label>
                      <Input type="number" value={editForm.paid || 0} onChange={e => setEditForm({ ...editForm, paid: Number(e.target.value) })} className="rounded-3xl px-4" />
                    </div>
                    <div className="col-span-2 flex justify-end mt-2">
                      <Button type="submit" className="rounded-full px-6 bg-rose-500 hover:bg-rose-600 text-white font-semibold">Save Changes</Button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-2 gap-4 text-sm mt-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Customer</p>
                      <p className="font-semibold">{managingBooking.customer}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Travel Date</p>
                      <p className="font-semibold">{managingBooking.travelDate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Service</p>
                      <p className="font-semibold text-muted-foreground">{managingBooking.bookingType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Destination</p>
                      <p className="font-semibold text-muted-foreground">{managingBooking.package}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total Budget</p>
                      <p className="font-bold text-primary">{formatINR(managingBooking.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Amount Paid</p>
                      <p className="font-bold text-emerald-700">{formatINR(managingBooking.paid)}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Document Form */}
              <form onSubmit={handleAddFile} className="space-y-4 border-t border-border pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Attach Document
                </h3>
                <div className="grid grid-cols-3 gap-3">
                  {/* File Selector */}
                  <div className="col-span-2 space-y-1">
                    <Label htmlFor="booking-doc-file" className="text-xs">
                      Document File (.pdf, .xlsx, .doc, image)
                    </Label>
                    <Input
                      id="booking-doc-file"
                      type="file"
                      required
                      accept=".pdf,.xls,.xlsx,.doc,.docx,image/*"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="h-9 text-xs rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Priority Selector */}
                  <div className="space-y-1">
                    <Label htmlFor="booking-doc-priority" className="text-xs">
                      File Priority
                    </Label>
                    <select
                      id="booking-doc-priority"
                      value={uploadPriority}
                      onChange={(e) =>
                        setUploadPriority(e.target.value as "High" | "Medium" | "Low")
                      }
                      className="flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    >
                      <option value="High">🔴 High</option>
                      <option value="Medium">🟡 Medium</option>
                      <option value="Low">🟢 Low</option>
                    </select>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={uploading || !uploadFile}
                  className="w-full h-9 rounded-lg text-xs gap-1.5"
                  style={{ background: "var(--gradient-brand)" }}
                >
                  {uploading ? "Saving File..." : <Upload className="h-3.5 w-3.5" />}
                  {uploading ? "Uploading..." : "Attach Document"}
                </Button>
              </form>

              {/* Uploaded Documents List */}
              <div className="border-t border-border pt-4 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Attached Files
                </h3>

                {!managingBooking.files || managingBooking.files.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground border border-dashed rounded-xl p-4 bg-secondary/15">
                    No documents attached yet. Upload flights, hotels, or visa documents.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {managingBooking.files.map((file) => (
                      <div
                        key={file.name}
                        className="flex items-center justify-between rounded-xl border border-border p-3 bg-secondary/10 hover:bg-secondary/20 transition-all text-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {getFileIcon(file.type, file.name)}
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold truncate text-foreground">{file.name}</p>
                            <p className="text-[10px] text-muted-foreground">
                              {fmtSize(file.size)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 ml-3 shrink-0">
                          <span
                            className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${priorityColor[file.priority]}`}
                          >
                            {file.priority}
                          </span>
                          <a
                            href={file.dataUrl}
                            download={file.name}
                            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                            title="Download file"
                          >
                            <Download className="h-3.5 w-3.5" />
                          </a>
                          {isAdmin && (
                            <button
                              type="button"
                              onClick={() => handleDeleteFile(file.name)}
                              className="rounded-lg p-1 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Delete file (Admin only)"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setIsManageOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* ===== EXPORT DIALOG ===== */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">Export Bookings</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Export the current list of {allBookings.length} bookings in your preferred file
              format.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-3 py-6">
            <button
              type="button"
              onClick={() => {
                exportToPDF();
                setIsExportOpen(false);
              }}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border p-4 hover:border-rose-300 hover:bg-rose-50/50 hover:text-rose-600 transition-all text-center group"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-100">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold">PDF Report</span>
            </button>

            <button
              type="button"
              onClick={() => {
                exportToExcel();
                setIsExportOpen(false);
              }}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border p-4 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-600 transition-all text-center group"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100">
                <Table2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold">Excel (CSV)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                exportToWord();
                setIsExportOpen(false);
              }}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border p-4 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 transition-all text-center group"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold">Word (.doc)</span>
            </button>
          </div>

          <DialogFooter className="border-t border-border pt-4">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              onClick={() => setIsExportOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ===== BOOKING SUCCESS POPUP ===== */}
      {showSuccess && successBooking && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="relative mx-4 w-full max-w-sm rounded-3xl bg-card shadow-2xl border border-border overflow-hidden"
            style={{
              animation: "successPop 0.45s cubic-bezier(0.34,1.56,0.64,1) both",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Confetti gradient top bar */}
            <div
              className="h-2 w-full"
              style={{
                background: "linear-gradient(90deg, #f43f5e, #f59e0b, #10b981, #3b82f6, #a855f7)",
              }}
            />

            {/* Close button */}
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center gap-4 px-8 py-8 text-center">
              {/* Animated thumbs up */}
              <div
                className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg"
                style={{ animation: "thumbBounce 0.6s 0.2s cubic-bezier(0.34,1.56,0.64,1) both" }}
              >
                <span style={{ fontSize: "3rem", lineHeight: 1 }}>👍</span>
              </div>

              <div className="space-y-1">
                <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground">
                  Thank You for Booking!
                </h2>
                <p className="text-sm text-muted-foreground">
                  Your booking has been confirmed successfully.
                </p>
              </div>

              {/* Booking details card */}
              <div className="w-full rounded-2xl bg-secondary/40 border border-border p-4 text-left space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary">
                    {successBooking.id}
                  </span>
                  <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                    {successBooking.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Customer
                    </p>
                    <p className="font-semibold text-foreground">{successBooking.customer}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Travel Date
                    </p>
                    <p className="font-semibold text-foreground">
                      {successBooking.travelDate || "—"}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Package
                    </p>
                    <p className="font-semibold text-foreground truncate">
                      {successBooking.package}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Total Amount
                    </p>
                    <p className="font-bold text-primary">{formatINR(successBooking.amount)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Paid
                    </p>
                    <p className="font-bold text-emerald-600">{formatINR(successBooking.paid)}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setShowSuccess(false)}
                className="w-full rounded-xl py-2.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95"
                style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}
              >
                🎉 Awesome, Got it!
              </button>
            </div>
          </div>

          {/* CSS animations */}
          <style>{`
            @keyframes successPop {
              0% { opacity: 0; transform: scale(0.7) translateY(30px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes thumbBounce {
              0% { opacity: 0; transform: scale(0.3) rotate(-20deg); }
              100% { opacity: 1; transform: scale(1) rotate(0deg); }
            }
          `}</style>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-[400px] rounded-3xl border-border bg-card">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">Delete Booking</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              Are you sure you want to delete the booking for{" "}
              <strong className="text-foreground">{deleteTarget?.customer}</strong> (
              {deleteTarget?.id})? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <Button variant="outline" className="rounded-xl" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant="destructive" className="rounded-xl" onClick={handleDeleteBooking}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
