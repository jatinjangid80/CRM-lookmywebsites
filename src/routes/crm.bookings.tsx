import { createFileRoute } from "@tanstack/react-router";
import { Plus, X, Upload, FileText, FileSpreadsheet, FileImage, File, Download, Trash2, Table2, Briefcase } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ImportModal } from "@/components/ui/import-modal";
import { bookings as initialBookings, formatINR, type Booking } from "@/lib/mock-data";
import { useLocalStorage } from "@/lib/use-local-storage";
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

function BookingsPage() {
  const auth = getAuth();
  const isAdmin = auth?.role === "admin";

  const [bookingList, setBookingList] = useSupabaseTable<ExtBooking[]>("bookings", initialBookings);
  const [leads] = useSupabaseTable<any[]>("leads", []);

  const allBookings = useMemo(() => {
    const derived = leads
      .filter((l: any) => l.bookingReference || l.status === "Booked" || l.status === "Completed")
      .map((l: any) => ({
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
        status: (l.paymentStatus || "Pending"),
        package: l.destination || "Unknown",
        travelDate: l.travelDate || "TBD",
      } as ExtBooking));
    return [...bookingList, ...derived];
  }, [leads, bookingList]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [managingBooking, setManagingBooking] = useState<ExtBooking | null>(null);
  const [isManageOpen, setIsManageOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ExtBooking | null>(null);
  
  // Tab state for filtering
  const [activeTab, setActiveTab] = useState<BookingType | "All">("All");
  
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
    const headers = ["ID", "Customer", "Package", "Travel Date", "Amount (₹)", "Paid (₹)", "Status"];
    const csvRows = [
      headers.join(","),
      ...allBookings.map(b => [
        `"${b.id}"`,
        `"${b.customer.replace(/"/g, '""')}"`,
        `"${b.package.replace(/"/g, '""')}"`,
        `"${b.travelDate}"`,
        b.amount,
        b.paid,
        `"${b.status}"`
      ].join(","))
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
    const tableHeader = "<tr><th>ID</th><th>Customer</th><th>Package</th><th>Travel Date</th><th>Amount</th><th>Paid</th><th>Status</th></tr>";
    const tableRows = allBookings.map(b =>
      `<tr><td>${b.id}</td><td>${b.customer}</td><td>${b.package}</td><td>${b.travelDate}</td><td>₹${b.amount}</td><td>₹${b.paid}</td><td>${b.status}</td></tr>`
    ).join("");
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
    const tableHeader = "<tr><th>ID</th><th>Customer</th><th>Package</th><th>Travel Date</th><th>Amount</th><th>Paid</th><th>Status</th></tr>";
    const tableRows = allBookings.map(b =>
      `<tr><td>${b.id}</td><td>${b.customer}</td><td>${b.package}</td><td>${b.travelDate}</td><td>\u20b9${b.amount}</td><td>\u20b9${b.paid}</td><td>${b.status}</td></tr>`
    ).join("");
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
    script.textContent = "window.onload=function(){window.print();window.onafterprint=function(){window.close();}}";
    printWindow.document.body.appendChild(script);
    printWindow.document.close();
  };

  // File upload state
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadPriority, setUploadPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [uploading, setUploading] = useState(false);

  const handleManageBooking = (booking: ExtBooking) => {
    setManagingBooking(booking);
    setIsManageOpen(true);
    setUploadFile(null);
    setUploadPriority("Medium");
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
        files: [...(managingBooking.files || []), newFile]
      };

      setBookingList(prev => prev.map(b => b.id === managingBooking.id ? updatedBooking : b));
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
      files: (managingBooking.files || []).filter(f => f.name !== fileName)
    };
    setBookingList(prev => prev.map(b => b.id === managingBooking.id ? updatedBooking : b));
    setManagingBooking(updatedBooking);
  };

  const handleDeleteBooking = () => {
    if (!deleteTarget) return;
    setBookingList(prev => prev.filter(b => b.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  function getFileIcon(type: string, name: string) {
    const lowercaseName = name.toLowerCase();
    if (type === "application/pdf" || lowercaseName.endsWith(".pdf")) {
      return <FileText className="h-4 w-4 text-rose-500" />;
    }
    if (type.includes("sheet") || type.includes("excel") || lowercaseName.endsWith(".xlsx") || lowercaseName.endsWith(".xls") || lowercaseName.endsWith(".csv")) {
      return <FileSpreadsheet className="h-4 w-4 text-emerald-500" />;
    }
    if (type.includes("word") || type.includes("document") || lowercaseName.endsWith(".docx") || lowercaseName.endsWith(".doc")) {
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
    Low: "bg-blue-50 text-blue-700 border-blue-200"
  };

  const handleImportBookings = (data: any[]) => {
    const importedBookings = data.map(row => ({
      id: `BK-${1000 + Math.floor(Math.random() * 9000)}`,
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
      travelDate: row["Travel Date"] || row["travelDate"] || row["Date"] || new Date().toISOString().slice(0, 10),
      status: (row["Status"] || row["status"] || "Pending") as Booking["status"],
      amount: parseInt(row["Amount"] || row["amount"] || row["Total"]) || 0,
      paid: parseInt(row["Paid"] || row["paid"]) || 0,
      paymentMode: "Cash" as Booking["paymentMode"],
      transactionId: "",
    }));
    setBookingList(prev => [...importedBookings, ...prev]);
  };

  const handleAddBookingSave = (booking: Booking) => {
    setBookingList([booking, ...bookingList]);
    setSuccessBooking(booking);
    setShowSuccess(true);
  };
  
  const filteredBookings = allBookings.filter(b => activeTab === "All" || b.bookingType === activeTab || (activeTab === "Holiday Package" && !b.bookingType)); // Fallback for legacy items

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-bold">Bookings</h1>
          <p className="text-sm text-muted-foreground">Packages, flights, hotels, visas and transfers — all in one place.</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 rounded-xl" onClick={() => setIsExportOpen(true)}>
            <Download className="h-4 w-4" /> Export Bookings
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setIsImportOpen(true)}>
            <Upload className="h-4 w-4" /> Import Bookings
          </Button>
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
      
      {/* Tabbed Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-border">
        {["All", "Air Ticket", "Train Ticket", "Hotel", "Holiday Package", "Taxi", "Visa", "Travel Insurance", "Bus Ticket"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as BookingType | "All")}
            className={`whitespace-nowrap px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors ${
              activeTab === tab
                ? "bg-card text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">Booking ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Type / Service</th>
                <th className="px-4 py-3">Travel Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Profit / Margin</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Files</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted-foreground">No bookings found for {activeTab}.</td>
                </tr>
              ) : filteredBookings.map((b) => (
                <tr key={b.id} className="border-t border-border hover:bg-secondary/30">
                  <td className="px-4 py-3 font-mono text-xs text-primary font-semibold">{b.id}</td>
                  <td className="px-4 py-3 font-semibold">{b.customer}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs text-foreground/80">{b.bookingType || "Holiday Package"}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[150px]" title={b.package}>{b.package}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm">{b.travelDate}</td>
                  <td className="px-4 py-3 font-medium">{formatINR(b.amount || 0)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className={b.profit > 0 ? "text-emerald-600 font-semibold text-xs" : "text-muted-foreground text-xs"}>
                        {formatINR(b.profit || 0)}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{b.margin || 0}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${statusColor[b.status as keyof typeof statusColor] || statusColor["Pending"]}`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {b.files && b.files.length > 0 ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-semibold border border-blue-100">
                        📄 {b.files.length} file{b.files.length !== 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-muted-foreground/50 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button size="sm" variant="ghost" onClick={() => handleManageBooking(b)}>Manage</Button>
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
              ))}
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
            <DialogTitle className="font-display text-lg font-bold">Manage Booking Details</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Upload visa documents, tickets, hotel vouchers, and set document priorities.
            </DialogDescription>
          </DialogHeader>

          {managingBooking && (
            <div className="space-y-6 py-4">
              {/* Booking Info Card */}
              <div className="rounded-xl border border-border bg-secondary/20 p-4 space-y-2.5">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs font-semibold text-primary">{managingBooking.id}</span>
                  <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor[managingBooking.status]}`}>
                    {managingBooking.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground">Customer</p>
                    <p className="font-semibold">{managingBooking.customer}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Travel Date</p>
                    <p className="font-semibold">{managingBooking.travelDate}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Package / Service</p>
                    <p className="font-semibold text-muted-foreground">{managingBooking.package}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Total Budget</p>
                    <p className="font-bold text-primary">{formatINR(managingBooking.amount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Amount Paid</p>
                    <p className="font-bold text-emerald-700">{formatINR(managingBooking.paid)}</p>
                  </div>
                </div>
              </div>

              {/* Upload Document Form */}
              <form onSubmit={handleAddFile} className="space-y-4 border-t border-border pt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Attach Document</h3>
                <div className="grid grid-cols-3 gap-3">
                  {/* File Selector */}
                  <div className="col-span-2 space-y-1">
                    <Label htmlFor="booking-doc-file" className="text-xs">Document File (.pdf, .xlsx, .doc, image)</Label>
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
                    <Label htmlFor="booking-doc-priority" className="text-xs">File Priority</Label>
                    <select 
                      id="booking-doc-priority" 
                      value={uploadPriority} 
                      onChange={(e) => setUploadPriority(e.target.value as "High" | "Medium" | "Low")} 
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
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Attached Files</h3>
                
                {!managingBooking.files || managingBooking.files.length === 0 ? (
                  <div className="text-center py-6 text-xs text-muted-foreground border border-dashed rounded-xl p-4 bg-secondary/15">
                    No documents attached yet. Upload flights, hotels, or visa documents.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {managingBooking.files.map((file) => (
                      <div key={file.name} className="flex items-center justify-between rounded-xl border border-border p-3 bg-secondary/10 hover:bg-secondary/20 transition-all text-xs">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          {getFileIcon(file.type, file.name)}
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold truncate text-foreground">{file.name}</p>
                            <p className="text-[10px] text-muted-foreground">{fmtSize(file.size)}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5 ml-3 shrink-0">
                          <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${priorityColor[file.priority]}`}>
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
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsManageOpen(false)}>
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
              Export the current list of {allBookings.length} bookings in your preferred file format.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-3 py-6">
            <button
              type="button"
              onClick={() => { exportToPDF(); setIsExportOpen(false); }}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border p-4 hover:border-rose-300 hover:bg-rose-50/50 hover:text-rose-600 transition-all text-center group"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-100">
                <FileText className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold">PDF Report</span>
            </button>

            <button
              type="button"
              onClick={() => { exportToExcel(); setIsExportOpen(false); }}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border p-4 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-600 transition-all text-center group"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100">
                <Table2 className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold">Excel (CSV)</span>
            </button>

            <button
              type="button"
              onClick={() => { exportToWord(); setIsExportOpen(false); }}
              className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border p-4 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 transition-all text-center group"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100">
                <Briefcase className="h-5 w-5" />
              </div>
              <span className="text-xs font-semibold">Word (.doc)</span>
            </button>
          </div>

          <DialogFooter className="border-t border-border pt-4">
            <Button type="button" variant="outline" className="rounded-xl" onClick={() => setIsExportOpen(false)}>
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
              style={{ background: "linear-gradient(90deg, #f43f5e, #f59e0b, #10b981, #3b82f6, #a855f7)" }}
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
                  <span className="font-mono text-xs font-bold text-primary">{successBooking.id}</span>
                  <span className="rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold">
                    {successBooking.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Customer</p>
                    <p className="font-semibold text-foreground">{successBooking.customer}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Travel Date</p>
                    <p className="font-semibold text-foreground">{successBooking.travelDate || "—"}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Package</p>
                    <p className="font-semibold text-foreground truncate">{successBooking.package}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Amount</p>
                    <p className="font-bold text-primary">{formatINR(successBooking.amount)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Paid</p>
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
              Are you sure you want to delete the booking for <strong className="text-foreground">{deleteTarget?.customer}</strong> ({deleteTarget?.id})? This action cannot be undone.
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
