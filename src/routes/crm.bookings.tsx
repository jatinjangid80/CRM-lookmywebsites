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
  MoreVertical,
  Pencil,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { supabase } from "@/lib/supabase";
import { AddBookingModal } from "@/components/AddBookingModal";
import { BookingType } from "@/lib/mock-data";

interface BookingFile {
  name: string;
  size: number;
  type: string;
  priority: "High" | "Medium" | "Low";
  category?: string;
  uploadedAt: string;
  dataUrl: string;
}

interface ExtBooking extends Booking {
  files?: BookingFile[];
  details?: Record<string, any>;
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

function ManageAllBookingsComponent({ booking, allBookings, setManagingBooking }: { booking: ExtBooking, allBookings: ExtBooking[], setManagingBooking: (b: ExtBooking) => void }) {
  const customerBookings = allBookings.filter(b => b.customer === booking.customer && b.id !== booking.id);

  const groupedBookings = customerBookings.reduce((acc, b) => {
    const type = b.bookingType || "Other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(b);
    return acc;
  }, {} as Record<string, ExtBooking[]>);

  const types = Object.keys(groupedBookings);
  const [activeTab, setActiveTab] = useState<string>(types[0] || "");
  const currentTab = types.includes(activeTab) ? activeTab : (types[0] || "");
  const displayedBookings = groupedBookings[currentTab] || [];

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-bold tracking-tight">Other Bookings for {booking.customer}</h3>
      {customerBookings.length === 0 ? (
        <p className="text-sm text-muted-foreground">No other bookings found for this customer.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 border-b border-border pb-0">
            {types.map(type => (
              <button
                key={type}
                onClick={() => setActiveTab(type)}
                className={`relative flex items-center gap-2 pb-2 transition-colors ${currentTab === type ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {currentTab === type && (
                  <div className="absolute left-0 top-1 h-3 w-1 bg-primary rounded-full"></div>
                )}
                <h4 className={`text-sm font-bold uppercase tracking-wider ${currentTab === type ? "pl-2" : ""}`}>{type}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${currentTab === type ? "bg-primary/20 text-primary" : "bg-secondary text-secondary-foreground"}`}>
                  {groupedBookings[type]?.length || 0}
                </span>
                {currentTab === type && (
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary"></div>
                )}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {displayedBookings.map(b => (
              <div
                key={b.id}
                className="border border-border bg-card p-4 rounded-xl hover:border-primary/50 hover:shadow-md transition-all cursor-pointer"
                onClick={() => setManagingBooking(b)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-sm">{b.id}</p>
                    <p className="text-xs text-muted-foreground">{b.bookingDate}</p>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${statusColor[b.status] || "bg-secondary text-foreground"}`}>{b.status}</span>
                </div>
                <p className="text-sm font-semibold truncate" title={b.package}>{b.package}</p>
                <div className="mt-3 pt-3 border-t border-border flex flex-col gap-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="font-medium">₹{b.amount?.toLocaleString() || "0"}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Paid:</span>
                    <span className="font-medium text-emerald-600">₹{b.paid?.toLocaleString() || "0"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

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
            sellingPrice: l.totalAmount || 0,
            purchasePrice: 0,
            profit: 0,
            margin: 0,
            amount: l.totalAmount || 0,
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
    let totalPaid = 0;

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
        totalPaid += b.paid || 0;

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
      totalPaid,
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
  const [addBookingCustomer, setAddBookingCustomer] = useState<string | undefined>();
  const [editingAddBooking, setEditingAddBooking] = useState<ExtBooking | undefined>();
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [managingBooking, setManagingBooking] = useState<ExtBooking | null>(null);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [manageTab, setManageTab] = useState<"Details" | "Payments" | "Documents" | "Timeline" | "All Bookings">("Details");
  const [uploadCategory, setUploadCategory] = useState("Invoice");
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
        category: uploadCategory,
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
      setUploadCategory("Invoice");
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

  const handleAddBookingSave = async (booking: Booking) => {
    try {
      const isEdit = bookingList.some((b) => b.id === booking.id);
      
      if (!isEdit) {
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
      }

      let finalBooking = { ...booking };
      if (!isEdit) {
        const currentMaxId = bookingList.reduce((max, b) => {
          const numStr = String(b.id || "").replace(/BK-?/i, "");
          const num = parseInt(numStr, 10);
          return !isNaN(num) && num > max ? num : max;
        }, 0);
        const nextId = `BK-${String(currentMaxId + 1).padStart(3, "0")}`;
        finalBooking.id = nextId;
        finalBooking.status = "Pending";
        
        // Remove paymentStatus as it does not exist in the database schema
        delete (finalBooking as any).paymentStatus;

        // Insert into Supabase directly
        const { error } = await supabase.from("bookings").insert([finalBooking]);
        if (error) {
          console.error("Error inserting booking:", error);
          alert("Failed to save booking to database.");
          return;
        }

        // Update customer status to Payment Pending
        if (finalBooking.customer) {
          try {
            // Find the customer by name matching
            const { data: customerMatch } = await supabase
              .from("customers")
              .select("id")
              .ilike("name", `%${finalBooking.customer}%`)
              .limit(1);
            
            if (customerMatch && customerMatch.length > 0) {
              await supabase
                .from("customers")
                .update({ status: "Payment Pending" })
                .eq("id", customerMatch[0].id);
            }
          } catch (err) {
            console.error("Failed to update customer status:", err);
          }
        }
      } else {
        // Update Supabase directly
        const { error } = await supabase.from("bookings").update(finalBooking).eq("id", finalBooking.id);
        if (error) {
          console.error("Error updating booking:", error);
          alert("Failed to update booking in database.");
          return;
        }
      }

      setBookingList(prev => isEdit ? prev.map(b => b.id === finalBooking.id ? finalBooking : b) : [finalBooking, ...prev]);
      setSuccessBooking(finalBooking);
      setShowSuccess(true);
    } catch (err) {
      console.error("Unexpected error saving booking:", err);
      alert("An unexpected error occurred.");
    }
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

  const renderManageDetails = (booking: ExtBooking) => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Customer</p>
            <p className="font-semibold">{booking.customer}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Travel Date</p>
            <p className="font-semibold">{booking.travelDate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Booking Type</p>
            <p className="font-semibold">{booking.bookingType}</p>
          </div>
          {booking.bookingType === "Taxi" && (
            <>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Pickup Time</p><p className="font-semibold">{booking.details?.pickupTime || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Pickup Location</p><p className="font-semibold">{booking.details?.pickupLocation || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Drop Location</p><p className="font-semibold">{booking.details?.dropLocation || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Trip Type</p><p className="font-semibold">{booking.details?.tripType || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Vehicle Type</p><p className="font-semibold">{booking.details?.vehicleType || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Driver Name</p><p className="font-semibold">{booking.details?.driverName || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Vehicle Number</p><p className="font-semibold">{booking.details?.vehicleNumber || "—"}</p></div>
            </>
          )}
          {booking.bookingType === "Air Ticket" && (
            <>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Airline</p><p className="font-semibold">{booking.details?.airline || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Flight Number</p><p className="font-semibold">{booking.details?.flightNumber || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Departure</p><p className="font-semibold">{booking.details?.departureAirport || "—"} at {booking.details?.departureTime || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Arrival</p><p className="font-semibold">{booking.details?.arrivalAirport || "—"} at {booking.details?.arrivalTime || "—"}</p></div>
            </>
          )}
          {booking.bookingType === "Hotel" && (
            <>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Hotel Name</p><p className="font-semibold">{booking.package || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">City</p><p className="font-semibold">{booking.details?.city || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Check In</p><p className="font-semibold">{booking.details?.checkIn || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Check Out</p><p className="font-semibold">{booking.details?.checkOut || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Room Type</p><p className="font-semibold">{booking.details?.roomType || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Meal Plan</p><p className="font-semibold">{booking.details?.mealPlan || "—"}</p></div>
            </>
          )}
          {booking.bookingType === "Visa" && (
            <>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Country</p><p className="font-semibold">{booking.details?.country || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Visa Type</p><p className="font-semibold">{booking.details?.visaType || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Passport Number</p><p className="font-semibold">{booking.details?.passportNumber || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Submission Date</p><p className="font-semibold">{booking.details?.submissionDate || "—"}</p></div>
            </>
          )}
          {booking.bookingType === "Travel Insurance" && (
            <>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Policy Type</p><p className="font-semibold">{booking.details?.policyType || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Query Type</p><p className="font-semibold">{booking.details?.queryType || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Insurance Date</p><p className="font-semibold">{booking.details?.insuranceDate || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Expiry Date</p><p className="font-semibold">{booking.details?.expiryDate || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Client / Company</p><p className="font-semibold">{booking.details?.clientCompany || "—"}</p></div>
            </>
          )}
          {booking.bookingType === "Train Ticket" && (
            <>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Train Number/Name</p><p className="font-semibold">{booking.details?.trainNumber || "—"} {booking.details?.trainName || ""}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">From - To</p><p className="font-semibold">{booking.details?.from || "—"} → {booking.details?.to || "—"}</p></div>
            </>
          )}
          {booking.bookingType === "Bus Ticket" && (
            <>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Operator</p><p className="font-semibold">{booking.details?.operator || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Bus Type</p><p className="font-semibold">{booking.details?.busType || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Boarding - Dropping</p><p className="font-semibold">{booking.details?.boardingPoint || "—"} → {booking.details?.droppingPoint || "—"}</p></div>
            </>
          )}
          {(booking.bookingType === "Holiday Package" || !booking.bookingType) && (
            <>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Destination</p><p className="font-semibold">{booking.package || booking.details?.destination || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Package Type</p><p className="font-semibold">{booking.details?.packageType || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Travel Dates</p><p className="font-semibold">{booking.details?.travelFrom || "—"} to {booking.details?.travelTo || "—"}</p></div>
              <div><p className="text-xs text-muted-foreground uppercase mb-1">Pax</p><p className="font-semibold">{booking.details?.noOfPax || "—"} ({booking.details?.leaderName || "—"})</p></div>

              {booking.details?.airline && (
                <div className="col-span-2 mt-4 space-y-3 p-4 rounded-xl border bg-secondary/5">
                  <h4 className="text-sm font-semibold flex items-center gap-2">✈️ Flight Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Airline</p><p className="font-semibold">{booking.details.airline} {booking.details.flightNumber}</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Departure</p><p className="font-semibold">{booking.details.departureAirport || "—"} at {booking.details.departureTime ? new Date(booking.details.departureTime).toLocaleString() : "—"}</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Arrival</p><p className="font-semibold">{booking.details.arrivalAirport || "—"} at {booking.details.arrivalTime ? new Date(booking.details.arrivalTime).toLocaleString() : "—"}</p></div>
                  </div>
                </div>
              )}

              {booking.details?.hotelName && (
                <div className="col-span-2 mt-4 space-y-3 p-4 rounded-xl border bg-secondary/5">
                  <h4 className="text-sm font-semibold flex items-center gap-2">🏨 Hotel Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Hotel</p><p className="font-semibold">{booking.details.hotelName} ({booking.details.city || "—"})</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Dates</p><p className="font-semibold">{booking.details.checkIn || "—"} to {booking.details.checkOut || "—"}</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Room Type</p><p className="font-semibold">{booking.details.roomType || "—"}</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Meal Plan</p><p className="font-semibold">{booking.details.mealPlan || "—"}</p></div>
                  </div>
                </div>
              )}

              {booking.details?.vehicleType && (
                <div className="col-span-2 mt-4 space-y-3 p-4 rounded-xl border bg-secondary/5">
                  <h4 className="text-sm font-semibold flex items-center gap-2">🚕 Taxi Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Vehicle</p><p className="font-semibold">{booking.details.vehicleType} ({booking.details.tripType || "—"})</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Pickup Time</p><p className="font-semibold">{booking.details.pickupTime ? new Date(booking.details.pickupTime).toLocaleString() : "—"}</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Route</p><p className="font-semibold">{booking.details.pickupLocation || "—"} → {booking.details.dropLocation || "—"}</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Driver</p><p className="font-semibold">{booking.details.driverName || "—"} ({booking.details.vehicleNumber || "—"})</p></div>
                  </div>
                </div>
              )}

              {booking.details?.trainName && (
                <div className="col-span-2 mt-4 space-y-3 p-4 rounded-xl border bg-secondary/5">
                  <h4 className="text-sm font-semibold flex items-center gap-2">🚆 Train Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Train</p><p className="font-semibold">{booking.details.trainName}</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Travel Date</p><p className="font-semibold">{booking.details.travelDate || "—"}</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Sector</p><p className="font-semibold">{booking.details.sector || "—"}</p></div>
                  </div>
                </div>
              )}

              {booking.details?.busOperator && (
                <div className="col-span-2 mt-4 space-y-3 p-4 rounded-xl border bg-secondary/5">
                  <h4 className="text-sm font-semibold flex items-center gap-2">🚌 Bus Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Operator</p><p className="font-semibold">{booking.details.busOperator}</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Travel Date</p><p className="font-semibold">{booking.details.travelDate || "—"}</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Sector</p><p className="font-semibold">{booking.details.sector || "—"}</p></div>
                  </div>
                </div>
              )}

              {booking.details?.visaType && (
                <div className="col-span-2 mt-4 space-y-3 p-4 rounded-xl border bg-secondary/5">
                  <h4 className="text-sm font-semibold flex items-center gap-2">📄 Visa Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Country</p><p className="font-semibold">{booking.details.country || "—"}</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Visa Type</p><p className="font-semibold">{booking.details.visaType}</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Process Date</p><p className="font-semibold">{booking.details.processDate || "—"}</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Status</p><p className="font-semibold">{booking.details.applicationStatus || "—"}</p></div>
                  </div>
                </div>
              )}

              {booking.details?.policyType && (
                <div className="col-span-2 mt-4 space-y-3 p-4 rounded-xl border bg-secondary/5">
                  <h4 className="text-sm font-semibold flex items-center gap-2">🛡️ Insurance Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Policy Type</p><p className="font-semibold">{booking.details.policyType}</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Query Type</p><p className="font-semibold">{booking.details.queryType || "—"}</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Insurance Date</p><p className="font-semibold">{booking.details.insuranceDate || "—"}</p></div>
                    <div><p className="text-xs text-muted-foreground uppercase mb-1">Expiry Date</p><p className="font-semibold">{booking.details.expiryDate || "—"}</p></div>
                    <div className="col-span-2"><p className="text-xs text-muted-foreground uppercase mb-1">Client / Company</p><p className="font-semibold">{booking.details.clientCompany || "—"}</p></div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  const renderManagePayments = (booking: ExtBooking) => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-secondary/10 p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Selling Price</p>
          <p className="text-xl font-bold">{formatINR(booking.amount || 0)}</p>
        </div>
        <div className="bg-secondary/10 p-4 rounded-xl border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Purchase Price</p>
          <p className="text-xl font-bold">{formatINR(booking.purchasePrice || 0)}</p>
        </div>
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200">
          <p className="text-xs uppercase tracking-wider mb-1 opacity-80">Amount Received</p>
          <p className="text-xl font-bold">{formatINR(booking.paid || 0)}</p>
        </div>
        <div className="bg-rose-50 text-rose-800 p-4 rounded-xl border border-rose-200">
          <p className="text-xs uppercase tracking-wider mb-1 opacity-80">Pending Amount</p>
          <p className="text-xl font-bold">{formatINR((booking.amount || 0) - (booking.paid || 0))}</p>
        </div>
        <div className="bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-200">
          <p className="text-xs uppercase tracking-wider mb-1 opacity-80">Profit</p>
          <p className="text-xl font-bold">{formatINR(booking.profit || 0)}</p>
        </div>
        <div className="bg-purple-50 text-purple-800 p-4 rounded-xl border border-purple-200">
          <p className="text-xs uppercase tracking-wider mb-1 opacity-80">Margin</p>
          <p className="text-xl font-bold">{booking.margin || 0}%</p>
        </div>
      </div>
      <div>
        <p className="text-sm font-semibold mb-2">Payment Status</p>
        <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold ${statusColor[booking.status]}`}>
          {booking.status}
        </span>
      </div>
    </div>
  );

  const documentCategories = [
    "Invoice", "Voucher", "Passport", "Visa", "Flight Ticket", "Hotel Voucher", "Insurance Policy", "Driver Details", "Train Ticket", "Bus Ticket", "Customer ID", "Receipt", "Other Files"
  ];

  const renderManageDocuments = (booking: ExtBooking) => (
    <div className="space-y-6">
      <form onSubmit={handleAddFile} className="space-y-4 rounded-xl border border-border bg-secondary/10 p-5">
        <h3 className="text-sm font-bold tracking-tight">Upload Document</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="booking-doc-file" className="text-xs">Document File (.pdf, image, etc.)</Label>
            <Input
              id="booking-doc-file"
              type="file"
              required
              accept=".pdf,.xls,.xlsx,.doc,.docx,image/*"
              onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              className="h-10 text-xs rounded-lg cursor-pointer bg-background"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="booking-doc-category" className="text-xs">Category</Label>
            <Select value={uploadCategory} onValueChange={setUploadCategory}>
              <SelectTrigger id="booking-doc-category" className="h-10 bg-background text-xs">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {documentCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="booking-doc-priority" className="text-xs">Priority</Label>
            <Select value={uploadPriority} onValueChange={(val: any) => setUploadPriority(val)}>
              <SelectTrigger id="booking-doc-priority" className="h-10 bg-background text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">🔴 High</SelectItem>
                <SelectItem value="Medium">🟡 Medium</SelectItem>
                <SelectItem value="Low">🟢 Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end pt-2">
          <Button
            type="submit"
            disabled={uploading || !uploadFile}
            className="h-10 px-8 rounded-lg text-sm font-semibold"
            style={{ background: "var(--gradient-brand)" }}
          >
            {uploading ? "Uploading..." : "Upload Document"}
          </Button>
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="text-sm font-bold tracking-tight">Attached Files</h3>
        {!booking.files || booking.files.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground border border-dashed rounded-xl bg-secondary/10">
            No documents attached yet.
          </div>
        ) : (
          <div className="space-y-3">
            {booking.files.map((file) => (
              <div key={file.name} className="flex items-center justify-between rounded-xl border border-border p-4 bg-card shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="p-2 bg-secondary/20 rounded-lg">
                    {getFileIcon(file.type, file.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm truncate text-foreground">{file.name}</p>
                      <span className="rounded bg-secondary px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                        {file.category || "Other Files"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {fmtSize(file.size)} • Uploaded {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${priorityColor[file.priority]}`}>
                    {file.priority}
                  </span>
                  <a href={file.dataUrl} download={file.name} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors" title="Download file">
                    <Download className="h-4 w-4" />
                  </a>
                  {isAdmin && (
                    <button type="button" onClick={() => handleDeleteFile(file.name)} className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 transition-colors" title="Delete file">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderManageTimeline = (booking: ExtBooking) => {
    const events = [
      { id: 1, title: "Booking Created", date: booking.bookingDate, status: "completed" },
      { id: 2, title: "Payment Pending", date: booking.bookingDate, status: booking.paid > 0 ? "completed" : "current" },
      { id: 3, title: "Documents Uploaded", date: "Pending", status: booking.files && booking.files.length > 0 ? "completed" : (booking.paid > 0 ? "current" : "upcoming") },
      { id: 4, title: "Booking Confirmed", date: "Pending", status: booking.status === "Confirmed" ? "completed" : (booking.files && booking.files.length > 0 ? "current" : "upcoming") },
    ];
    return (
      <div className="space-y-6">
        <h3 className="text-sm font-bold tracking-tight">Booking Timeline</h3>
        <div className="relative pl-6 space-y-6">
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-border rounded-full" />
          {events.map((event, index) => (
            <div key={event.id} className="relative">
              <div className={`absolute -left-[30px] top-0.5 h-4 w-4 rounded-full border-2 bg-background flex items-center justify-center ${event.status === 'completed' ? 'border-emerald-500 bg-emerald-500 text-white' : event.status === 'current' ? 'border-primary ring-2 ring-primary/20' : 'border-muted-foreground/30'}`}>
                {event.status === 'completed' && <CheckCircle2 className="h-3 w-3" />}
              </div>
              <div className="flex flex-col gap-1">
                <p className={`text-sm font-semibold ${event.status === 'upcoming' ? 'text-muted-foreground' : 'text-foreground'}`}>{event.title}</p>
                <p className="text-xs text-muted-foreground">{event.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };


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

          <Button className="btn-hero" onClick={() => {
            setAddBookingCustomer(undefined);
            setEditingAddBooking(undefined);
            setIsAddOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" /> New booking
          </Button>
          <AddBookingModal
            open={isAddOpen}
            onOpenChange={(open) => {
              setIsAddOpen(open);
              if (!open) {
                setAddBookingCustomer(undefined);
                setEditingAddBooking(undefined);
              }
            }}
            onSave={handleAddBookingSave}
            defaultCustomer={addBookingCustomer}
            editingBooking={editingAddBooking}
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="h-16 w-16 text-primary" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Selling Amount
            </p>
            <p className="text-3xl font-display font-bold text-foreground">
              {formatINR(dashboardData.totalRevenue)}
            </p>
          </div>
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <CheckCircle2 className="h-16 w-16 text-emerald-600" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Paid Amount
            </p>
            <p className="text-3xl font-display font-bold text-emerald-600">
              {formatINR(dashboardData.totalPaid)}
            </p>
          </div>
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Clock className="h-16 w-16 text-rose-600" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Total Pending
            </p>
            <p className="text-3xl font-display font-bold text-rose-600">
              {formatINR(dashboardData.totalRevenue - dashboardData.totalPaid)}
            </p>
          </div>
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm flex flex-col gap-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <TrendingUp className="h-16 w-16 text-blue-600" />
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
                <th className="px-4 py-3 whitespace-nowrap">Paid (₹)</th>
                <th className="px-4 py-3 whitespace-nowrap">Pending (₹)</th>
                <th className="px-4 py-3 whitespace-nowrap">Purchase Price (₹)</th>
                <th className="px-4 py-3 whitespace-nowrap">Profit (₹)</th>
                <th className="px-4 py-3 whitespace-nowrap">Booked By</th>
                <th className="px-4 py-3 whitespace-nowrap">Payment Status</th>
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
                    <td className="px-4 py-3 font-medium whitespace-nowrap text-emerald-600 dark:text-emerald-400">{formatINR(b.paid || 0)}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap text-rose-600 dark:text-rose-400">{formatINR((b.sellingPrice || b.amount || 0) - (b.paid || 0))}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap text-muted-foreground">{formatINR(b.purchasePrice || 0)}</td>
                    <td className="px-4 py-3 font-medium whitespace-nowrap text-emerald-600">{formatINR(b.profit || 0)}</td>
                    <td className="px-4 py-3 text-sm whitespace-nowrap text-muted-foreground">{b.bookedBy || "-"}</td>
                    <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <span className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold tracking-wider uppercase border-none h-auto w-auto ${statusColor[b.status as keyof typeof statusColor] || statusColor["Pending"]}`}>
                        {b.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                        {isAdmin && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-xl hover:bg-secondary"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-32 rounded-xl">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingAddBooking(b);
                                  setIsAddOpen(true);
                                }}
                                className="cursor-pointer gap-2 py-2"
                              >
                                <Pencil className="h-4 w-4" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteTarget(b);
                                }}
                                className="cursor-pointer gap-2 py-2 text-rose-600 focus:text-rose-700"
                              >
                                <Trash2 className="h-4 w-4" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
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

      <ImportModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImport={handleImportBookings}
        title="Import Bookings"
        description="Upload a CSV or Excel file containing your bookings."
      />

      <Dialog open={isManageOpen} onOpenChange={setIsManageOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col overflow-hidden rounded-2xl border border-border p-0 shadow-2xl bg-card">
          <div className="flex items-center justify-between border-b border-border p-6 pb-4">
            <div>
              <DialogTitle className="font-display text-lg font-bold">
                Booking Summary
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-1">
                {managingBooking?.customer} • {managingBooking?.id}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl h-8 mr-2"
                onClick={() => {
                  setAddBookingCustomer(managingBooking?.customer);
                  setEditingAddBooking(managingBooking);
                  setIsAddOpen(true);
                }}
              >
                <Plus className="mr-1.5 h-3.5 w-3.5" /> Add Booking
              </Button>
              {managingBooking && (
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusColor[managingBooking.status]}`}>
                  {managingBooking.status}
                </span>
              )}
            </div>
          </div>

          {managingBooking && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center gap-6 px-6 border-b border-border bg-secondary/10">
                {["Details", "Payments", "Documents", "Timeline", "All Bookings"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setManageTab(tab as any)}
                    className={`py-3 text-sm font-semibold transition-colors border-b-2 -mb-[1px] ${manageTab === tab ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex-1 overflow-y-auto p-6">
                {manageTab === "Details" && renderManageDetails(managingBooking)}
                {manageTab === "Payments" && renderManagePayments(managingBooking)}
                {manageTab === "Documents" && renderManageDocuments(managingBooking)}
                {manageTab === "Timeline" && renderManageTimeline(managingBooking)}
                {manageTab === "All Bookings" && <ManageAllBookingsComponent booking={managingBooking} allBookings={allBookings} setManagingBooking={setManagingBooking} />}
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-border p-4 bg-secondary/10 mt-auto">
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
