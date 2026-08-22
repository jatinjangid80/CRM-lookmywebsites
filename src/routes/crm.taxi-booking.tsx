import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Upload, Plus, Check, ChevronsUpDown, MoreVertical, Edit2, Trash2, Download, FileText, Table2, Briefcase, Globe, CheckCircle2 , ArrowUp, ArrowDown, ArrowUpDown, MapPin, User, Map, Navigation, Paperclip,  ArrowRight } from "lucide-react";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/crm/taxi-booking")({
  component: TaxiBookingPage,
});

function TaxiBookingPage() {
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const auth = getAuth();
  const isAdmin = auth?.role === "admin" || auth?.role === "manager";
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bookings, setBookings] = useSupabaseTable<any[]>("crm_taxi_bookings", []);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");

  const [sortField, setSortField] = useState<"supplier" | "customer_name" | "mobile_number" | "vehicle_type" | "route" | "travel_date" | "purchase_price" | "selling_price">("travel_date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleSort = (field: any) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredBookings = [...bookings].sort((a, b) => {
    let cmp = 0;
    if (sortField === "travel_date") cmp = new Date(a.travel_date || 0).getTime() - new Date(b.travel_date || 0).getTime();
    else if (sortField === "supplier") cmp = (a.supplier || "").localeCompare(b.supplier || "");
    else if (sortField === "customer_name") cmp = (a.customer_name || "").localeCompare(b.customer_name || "");
    else if (sortField === "mobile_number") cmp = (a.mobile_number || "").localeCompare(b.mobile_number || "");
    else if (sortField === "vehicle_type") cmp = (a.vehicle_type || "").localeCompare(b.vehicle_type || "");
    else if (sortField === "route") cmp = (a.route || "").localeCompare(b.route || "");
    else if (sortField === "purchase_price") cmp = (a.purchase_price || 0) - (b.purchase_price || 0);
    else if (sortField === "selling_price") cmp = (a.selling_price || 0) - (b.selling_price || 0);
    return sortOrder === "asc" ? cmp : -cmp;
  });

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      const { error } = await supabase.from("crm_taxi_bookings").delete().eq("id", deleteId);
      if (error) throw error;
      setBookings(prev => prev.filter(b => b.id !== deleteId));
      toast.success("Booking deleted successfully");
    } catch (err: any) {
      toast.error("Failed to delete booking: " + err.message);
    } finally {
      setDeleteId(null);
    }
  };

  const exportToExcel = () => {
    const csvRows = [
      ["Booking ID", "Customer", "Mobile", "Route", "Travel Date", "Vehicle Type", "Vehicle No", "Supplier", "Pricing Type", "Rate", "Quantity", "Purchase Price", "Selling Price", ...(isAdmin ? ["Profit"] : []), "Remarks"]
    ];

    const exportableBookings = bookings.filter(b => {
      const d = b.travel_date || "";
      const matchStart = exportStartDate ? d >= exportStartDate : true;
      const matchEnd = exportEndDate ? d <= exportEndDate : true;
      return matchStart && matchEnd;
    });

    exportableBookings.forEach(b => {
      csvRows.push([
        b.id || "-",
        (b.customer_name || "-").replace(/,/g, ""),
        b.mobile_number || "-",
        (b.route || "-").replace(/,/g, ""),
        b.travel_date || "-",
        b.vehicle_type || "-",
        b.vehicle_no || "-",
        (b.supplier || "-").replace(/,/g, ""),
        b.pricing_type || "-",
        String(b.rate || "0"),
        String(b.total_quantity || "0"),
        String(b.purchase_price || "0"),
        b.selling_price || 0,
        ...(isAdmin ? [b.profit || 0] : []),
        `"${b.remarks || ""}"`.replace(/,/g, " ")
      ]);
    });

    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `taxi-bookings-${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToWord = () => {
    const tableHeader =
      `<tr><th>Booking ID</th><th>Customer</th><th>Mobile</th><th>Route</th><th>Travel Date</th><th>Vehicle No</th><th>Selling Price</th>${isAdmin ? "<th>Profit</th>" : ""}</tr>`;

    const exportableBookings = bookings.filter(b => {
      const d = b.travel_date || "";
      const matchStart = exportStartDate ? d >= exportStartDate : true;
      const matchEnd = exportEndDate ? d <= exportEndDate : true;
      return matchStart && matchEnd;
    });

    const tableRows = exportableBookings
      .map(
        (b) =>
          `<tr><td>${b.id || ""}</td><td>${b.customer_name || ""}</td><td>${b.mobile_number || ""}</td><td>${b.route || ""}</td><td>${b.travel_date || ""}</td><td>${b.vehicle_no || ""}</td><td>₹${b.selling_price || 0}</td>${isAdmin ? `<td>₹${b.profit || 0}</td>` : ""}</tr>`,
      )
      .join("");

    const htmlString = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Taxi Bookings Export</title><style>table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; } th, td { border: 1px solid #dddddd; padding: 8px; text-align: left; } th { background-color: #f2f2f2; }</style></head>
      <body><h2>Grand Journeys CRM - Taxi Bookings Export</h2><table>${tableHeader}${tableRows}</table></body>
      </html>
    `;
    const blob = new Blob([htmlString], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `taxi-bookings-${new Date().toISOString().split("T")[0]}.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const exportableBookings = bookings.filter(b => {
      const d = b.travel_date || "";
      const matchStart = exportStartDate ? d >= exportStartDate : true;
      const matchEnd = exportEndDate ? d <= exportEndDate : true;
      return matchStart && matchEnd;
    });

    const tableHeader =
      `<tr><th>Booking ID</th><th>Customer</th><th>Mobile</th><th>Route</th><th>Travel Date</th><th>Vehicle No</th><th>Selling Price</th>${isAdmin ? "<th>Profit</th>" : ""}</tr>`;

    const tableRows = exportableBookings
      .map(
        (b) =>
          `<tr><td>${b.id || ""}</td><td>${b.customer_name || ""}</td><td>${b.mobile_number || ""}</td><td>${b.route || ""}</td><td>${b.travel_date || ""}</td><td>${b.vehicle_no || ""}</td><td>₹${b.selling_price || 0}</td>${isAdmin ? `<td>₹${b.profit || 0}</td>` : ""}</tr>`,
      )
      .join("");

    const css = `body{font-family:sans-serif;padding:20px;color:#333}h2{color:#059669;margin-bottom:5px}p{font-size:12px;color:#666;margin-bottom:20px}table{border-collapse:collapse;width:100%;font-size:12px}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f9fafb;font-weight:bold}tr:nth-child(even){background:#f3f4f6}`;
    const styleEl = printWindow.document.createElement("style");
    styleEl.textContent = css;
    printWindow.document.head.appendChild(styleEl);
    const titleEl = printWindow.document.createElement("title");
    titleEl.textContent = "Taxi Bookings Export PDF";
    printWindow.document.head.appendChild(titleEl);
    const bodyHtml = `<h2>Grand Journeys CRM - Taxi Bookings Export</h2><p>Generated on ${new Date().toLocaleDateString("en-IN")} | Total Bookings: ${exportableBookings.length}</p><table><thead>${tableHeader}</thead><tbody>${tableRows}</tbody></table>`;
    const wrapper = printWindow.document.createElement("div");
    wrapper.innerHTML = bodyHtml;
    printWindow.document.body.appendChild(wrapper);
    const script = printWindow.document.createElement("script");
    script.textContent =
      "window.onload=function(){window.print();window.onafterprint=function(){window.close();}}";
    printWindow.document.body.appendChild(script);
  };

  return (
    <div className="p-6 w-full space-y-6 animate-in fade-in zoom-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-display">Taxi Bookings</h1>
          <p className="text-sm text-muted-foreground">Manage your taxi and cab reservations.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="shadow-sm rounded-xl" onClick={() => setIsExportOpen(true)}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button className="rounded-xl shadow-sm" onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Booking
          </Button>
        </div>
      </div>

      {/* Dashboard cards for Taxi Bookings */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            label: "Total Bookings",
            value: filteredBookings.length,
            icon: <Briefcase className="h-4 w-4" />,
            color: "bg-blue-100 text-blue-600",
            sub: "Total taxi bookings",
          },
          {
            label: "Total Sales",
            value: `₹${filteredBookings.reduce((sum: number, b: any) => {
              const val = Number(b.selling_price);
              return sum + (isNaN(val) ? 0 : val);
            }, 0).toLocaleString()}`,
            icon: <Globe className="h-4 w-4" />,
            color: "bg-emerald-100 text-emerald-600",
            sub: "Overall revenue",
          },
          ...(isAdmin ? [{
            label: "Total Profit",
            value: `₹${filteredBookings.reduce((sum: number, b: any) => {
              const val = Number(b.profit);
              return sum + (isNaN(val) ? 0 : val);
            }, 0).toLocaleString()}`,
            icon: <CheckCircle2 className="h-4 w-4" />,
            color: "bg-violet-100 text-violet-600",
            sub: "Overall profit margin",
          }] : []),
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
              <span className={`grid h-9 w-9 place-items-center rounded-xl ${s.color}`}>
                {s.icon}
              </span>
            </div>
            <p className="mt-3 font-display text-2xl font-bold truncate">{s.value}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
                <CardContent>
          <div className="hidden md:block">
            <Table>
            <TableHeader className="bg-secondary/60">
              <TableRow>
                <TableHead className="cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort("supplier")}>
                  <div className="flex items-center gap-1">Supplier {sortField === "supplier" ? (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort("customer_name")}>
                  <div className="flex items-center gap-1">Customer {sortField === "customer_name" ? (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort("mobile_number")}>
                  <div className="flex items-center gap-1">Mobile {sortField === "mobile_number" ? (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort("vehicle_type")}>
                  <div className="flex items-center gap-1">Vehicle {sortField === "vehicle_type" ? (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort("route")}>
                  <div className="flex items-center gap-1">Route {sortField === "route" ? (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort("travel_date")}>
                  <div className="flex items-center gap-1">Travel Date {sortField === "travel_date" ? (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort("purchase_price")}>
                  <div className="flex items-center gap-1">Purchase {sortField === "purchase_price" ? (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}</div>
                </TableHead>
                <TableHead className="cursor-pointer hover:bg-secondary/80 transition-colors" onClick={() => handleSort("selling_price")}>
                  <div className="flex items-center gap-1">Selling {sortField === "selling_price" ? (sortOrder === "asc" ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3 opacity-30" />}</div>
                </TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    No bookings found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredBookings.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell>{b.supplier || "-"}</TableCell>
                    <TableCell className="font-medium">{b.customer_name}</TableCell>
                    <TableCell>{b.mobile_number || "-"}</TableCell>
                    <TableCell>{b.vehicle_type || "-"} {b.vehicle_no ? `(${b.vehicle_no})` : ""}</TableCell>
                    <TableCell>{b.from_location && b.to_location ? `${b.from_location} to ${b.to_location}` : b.route || b.from_location || "-"}</TableCell>
                    <TableCell>{b.travel_date}</TableCell>
                    <TableCell>₹ {b.purchase_price || 0}</TableCell>
                    <TableCell className="font-semibold text-primary">₹ {b.selling_price || 0}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal(null); setIsAdding(true); }}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal("item-2"); setIsAdding(true); }}>
                            <User className="mr-2 h-4 w-4" />
                            Driver details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal("item-3"); setIsAdding(true); }}>
                            <Map className="mr-2 h-4 w-4" />
                            Other stations
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal("item-4"); setIsAdding(true); }}>
                            <Navigation className="mr-2 h-4 w-4" />
                            Local stations
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal("item-6"); setIsAdding(true); }}>
                            <Paperclip className="mr-2 h-4 w-4" />
                            Attachments
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal(null); setIsAdding(true); }}>
                            <FileText className="mr-2 h-4 w-4" />
                            Details
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(b.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          </div>
          <div className="grid gap-4 md:hidden mt-4">
            {filteredBookings.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">No bookings found.</div>
            ) : (
              filteredBookings.map((b) => (
                <div key={b.id} className="rounded-[1.25rem] border border-[#E5E5E5] bg-[#FAF5F0]/50 p-4 shadow-sm relative">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-gray-900">{b.customer_name}</span>
                    <span className="text-yellow-300 font-black px-1">—</span>
                    <span className="text-sm font-medium text-gray-700">{b.vehicle_type || ""}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {b.from_location && b.to_location ? (
                      <>
                        <span className="truncate">{b.from_location}</span>
                        <ArrowRight className="h-3 w-3 shrink-0" />
                        <span className="truncate">{b.to_location}</span>
                      </>
                    ) : (
                      <span className="truncate">{b.route || b.from_location || "No route specified"}</span>
                    )}
                  </div>
                  
                  <div className="absolute top-4 right-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal(null); setIsAdding(true); }}>
                          <Edit2 className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal("item-2"); setIsAdding(true); }}>
                          <User className="mr-2 h-4 w-4" />
                          Driver details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal("item-3"); setIsAdding(true); }}>
                          <Map className="mr-2 h-4 w-4" />
                          Other stations
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal("item-4"); setIsAdding(true); }}>
                          <Navigation className="mr-2 h-4 w-4" />
                          Local stations
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal("item-6"); setIsAdding(true); }}>
                          <Paperclip className="mr-2 h-4 w-4" />
                          Attachments
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setEditingBooking(b); setActiveModal(null); setIsAdding(true); }}>
                          <FileText className="mr-2 h-4 w-4" />
                          Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(b.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAdding || !!editingBooking} onOpenChange={(open) => {
        if (!open) {
          setIsAdding(false);
          setEditingBooking(null);
        }
      }}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 flex flex-col border-0 [&>button]:hidden">
          <div className="flex-1 overflow-y-auto bg-background rounded-xl">
            <AddTaxiBookingForm 
              key={`${editingBooking?.id}-${activeModal}`}
              initialData={editingBooking}
              activeAccordion={activeModal}
              onCancel={() => {
                setIsAdding(false);
                setEditingBooking(null);
              }} 
              onSave={(savedBooking) => {
                if (editingBooking) {
                  setBookings((prev: any[]) => prev.map(b => b.id === savedBooking.id ? savedBooking : b));
                } else {
                  setBookings((prev: any[]) => [savedBooking, ...prev]);
                }
                setIsAdding(false);
                setEditingBooking(null);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent className="rounded-3xl sm:rounded-3xl p-8">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-2xl">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription className="text-base mt-2">
              This action cannot be undone. This will permanently delete the taxi booking and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="btn-hero rounded-xl border-0">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Export Modal */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Export Taxi Bookings</DialogTitle>
            <DialogDescription>
              Filter bookings by travel date before exporting.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                className="rounded-xl"
                value={exportStartDate}
                onChange={(e) => setExportStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                className="rounded-xl"
                value={exportEndDate}
                onChange={(e) => setExportEndDate(e.target.value)}
              />
            </div>
          </div>

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


    </div>
  );
}

function AddTaxiBookingForm({ onCancel, onSave, initialData, activeAccordion }: { onCancel: () => void, onSave?: (booking: any) => void, initialData?: any, activeAccordion?: string | null }) {
  const auth = getAuth();
  const isAdmin = auth?.role === "admin" || auth?.role === "manager";
  
  const [vendors] = useSupabaseTable<any[]>("vendors", []);
  const [customers] = useSupabaseTable<any[]>("customers", []);
  
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const [form, setForm] = useState<any>(initialData || {
    // Common Details
    supplier: "",
    booking_date: new Date().toISOString().split('T')[0],
    customer_name: "",
    mobile_number: "",
    email_address: "",
    booked_by: "",
    reference: "",
    
    // Driver Details
    driver_name: "",
    driver_mobile: "",
    vehicle_type: "",
    vehicle_no: "",
    driver_license: "",
    pickup_location: "",
    reporting_time: "",
    driver_remarks: "",
    
    // Outstanding Details
    selling_price: 0,
    purchase_price: 0,
    received_amount: 0,
    payment_status: "Pending",
    payment_due_date: "",
    payment_mode: "",
    payment_remarks: "",
    
    // Local Details
    pricing_type: "day-wise",
    total_quantity: 0,
    travel_date: "",
    from_location: "",
    to_location: "",
    route: "",
    no_of_days: 0,
    no_of_nights: 0,
    rate: 0,
    extra_km_charge: 0,
    extra_hrs_charge: 0,
    driver_charge: 0,
    parking_charge: 0,
    nights_charge: 0,
    other_charges: 0,
    
    // Attachments & Taxes
    toll_tax: 0,
    parking_tax: 0,
    state_tax: 0,
    duty_slip: 0,
    other_tax_charges: 0,
    
    // Legacy fields that might still be needed
    bank_details: "",
    remarks: "",
    attachments: initialData?.attachments || {},
  });

  const handleChange = (updates: any) => {
    setForm((prev: any) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    if (!form.customer_name || !form.mobile_number || !form.travel_date) {
      toast.error("Please fill required fields (Customer Name, Mobile, Travel Date)");
      return;
    }
    
    const profit = (Number(form.selling_price) || 0) - (Number(form.purchase_price) || 0);
    const payload = { ...form, profit };

    try {
      if (initialData?.id) {
        const { error } = await supabase.from("crm_taxi_bookings").update(payload).eq("id", initialData.id);
        if (error) throw error;
        toast.success("Booking updated successfully");
        if (onSave) onSave({ ...payload, id: initialData.id });
      } else {
        const newId = crypto.randomUUID();
        const payloadWithId = { ...payload, id: newId };
        const { error } = await supabase.from("crm_taxi_bookings").insert([payloadWithId]);
        if (error) throw error;
        toast.success("Booking added successfully");
        if (onSave) onSave(payloadWithId);
      }
    } catch (err: any) {
      toast.error("Error saving booking: " + err.message);
    }
  };

  const profit = (Number(form.selling_price) || 0) - (Number(form.purchase_price) || 0);
  const marginPercentage = form.selling_price ? ((profit / Number(form.selling_price)) * 100).toFixed(1) : "0.0";
  const outstandingAmount = (Number(form.selling_price) || 0) - (Number(form.received_amount) || 0);

  const baseRate = (Number(form.rate) || 0) * (Number(form.no_of_days) || 0);
  const totalCost = baseRate + 
    (Number(form.extra_km_charge) || 0) +
    (Number(form.extra_hrs_charge) || 0) + 
    (Number(form.driver_charge) || 0) + 
    (Number(form.parking_charge) || 0) + 
    (Number(form.nights_charge) || 0);

  const otherStationBaseRate = (Number(form.rate) || 0) * (Number(form.total_quantity) || 0);
  const otherStationTotalCost = otherStationBaseRate + 
    (Number(form.nights_charge) || 0) + 
    (Number(form.driver_charge) || 0) + 
    (Number(form.parking_charge) || 0) + 
    (Number(form.toll_tax) || 0) + 
    (Number(form.other_charges) || 0);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-display">{initialData ? 'Edit Taxi Booking' : 'New Taxi Booking'}</h1>
        </div>
      </div>

      <Accordion type="multiple" defaultValue={activeAccordion ? [activeAccordion] : ["item-1", "item-2", "item-3", "item-4", "item-5", "item-6", "item-7"]} className="w-full space-y-4">
        {/* SECTION 1: COMMON DETAILS */}
        <AccordionItem value="item-1" className="border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">1</span>
              COMMON DETAILS
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-muted/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Supplier *</Label>
                <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={supplierOpen} className="w-full justify-between">
                      {form.supplier || "Select Supplier..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search supplier..." />
                      <CommandEmpty>No supplier found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {vendors.map((v: any) => (
                            <CommandItem
                              key={v.id}
                              value={v.name}
                              onSelect={(currentValue) => {
                                handleChange({ supplier: currentValue });
                                setSupplierOpen(false);
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", form.supplier === v.name ? "opacity-100" : "opacity-0")} />
                              {v.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Booking Date *</Label>
                <Input type="date" value={form.booking_date} onChange={(e) => handleChange({ booking_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Customer Name *</Label>
                <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={customerOpen} className="w-full justify-between">
                      {form.customer_name || "Select Customer..."}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search customer..." />
                      <CommandEmpty>No customer found.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {customers.map((c: any) => (
                            <CommandItem
                              key={c.id}
                              value={c.name}
                              onSelect={(currentValue) => {
                                handleChange({
                                  customer_name: c.name,
                                  mobile_number: c.phone || "",
                                  email_address: c.email || "",
                                });
                                setCustomerOpen(false);
                              }}
                            >
                              <Check className={cn("mr-2 h-4 w-4", form.customer_name === c.name ? "opacity-100" : "opacity-0")} />
                              {c.name}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Mobile Number *</Label>
                <Input placeholder="Enter mobile" value={form.mobile_number} onChange={(e) => handleChange({ mobile_number: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input placeholder="Enter email" type="email" value={form.email_address} onChange={(e) => handleChange({ email_address: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Booked By</Label>
                <Input placeholder="Agent Name" value={form.booked_by} onChange={(e) => handleChange({ booked_by: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Reference / Booking ID</Label>
                <Input placeholder="e.g. REF-12345" value={form.reference} onChange={(e) => handleChange({ reference: e.target.value })} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 2: DRIVER DETAILS */}
        <AccordionItem value="item-2" className="border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">2</span>
              DRIVER DETAILS
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-muted/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Driver Name *</Label>
                <Input placeholder="Enter driver name" value={form.driver_name} onChange={(e) => handleChange({ driver_name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Driver Mobile *</Label>
                <Input placeholder="Enter mobile number" value={form.driver_mobile} onChange={(e) => handleChange({ driver_mobile: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Vehicle Type *</Label>
                <Input placeholder="e.g. Sedan, SUV" value={form.vehicle_type} onChange={(e) => handleChange({ vehicle_type: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Vehicle Number *</Label>
                <Input placeholder="e.g. MH 01 AB 1234" value={form.vehicle_no} onChange={(e) => handleChange({ vehicle_no: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>License No.</Label>
                <Input placeholder="Enter license number" value={form.driver_license} onChange={(e) => handleChange({ driver_license: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Reporting Time</Label>
                <Input type="time" value={form.reporting_time} onChange={(e) => handleChange({ reporting_time: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Pickup Location</Label>
                <Input placeholder="Enter pickup address" value={form.pickup_location} onChange={(e) => handleChange({ pickup_location: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-4">
                <Label>Driver Remarks</Label>
                <Input placeholder="Any notes for the driver..." value={form.driver_remarks} onChange={(e) => handleChange({ driver_remarks: e.target.value })} />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 3: OTHER STATION */}
        <AccordionItem value="item-3" className="border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">3</span>
              OTHER STATION
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-muted/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Travel Date *</Label>
                <Input type="date" value={form.travel_date} onChange={(e) => handleChange({ travel_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Location / City Route *</Label>
                <Input placeholder="Enter route" value={form.route} onChange={(e) => handleChange({ route: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Vehicle Type *</Label>
                <Input placeholder="Vehicle type" value={form.vehicle_type} onChange={(e) => handleChange({ vehicle_type: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Vehicle No.</Label>
                <Input placeholder="Vehicle number" value={form.vehicle_no} onChange={(e) => handleChange({ vehicle_no: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>Rate per KM *</Label>
                <Input type="number" placeholder="0" value={form.rate} onChange={(e) => handleChange({ rate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Total KM *</Label>
                <Input type="number" placeholder="0" value={form.total_quantity} onChange={(e) => handleChange({ total_quantity: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Night Charge</Label>
                <Input type="number" placeholder="0" value={form.nights_charge} onChange={(e) => handleChange({ nights_charge: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Driver Charge</Label>
                <Input type="number" placeholder="0" value={form.driver_charge} onChange={(e) => handleChange({ driver_charge: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>Parking Charge</Label>
                <Input type="number" placeholder="0" value={form.parking_charge} onChange={(e) => handleChange({ parking_charge: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Toll Tax</Label>
                <Input type="number" placeholder="0" value={form.toll_tax} onChange={(e) => handleChange({ toll_tax: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Other Charges</Label>
                <Input type="number" placeholder="0" value={form.other_charges} onChange={(e) => handleChange({ other_charges: e.target.value })} />
              </div>
            </div>

            {/* Pricing Estimate */}
            <div className="mt-6 bg-[#faf9f8] p-4 rounded-xl border col-span-2 md:col-span-4">
              <h4 className="font-semibold mb-3">PRICING ESTIMATE</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Rate ({form.rate || 0} × {form.total_quantity || 0} km):</span>
                  <span className="font-medium">₹ {otherStationBaseRate}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Total Cost:</span>
                  <span className="text-[#E12D39] text-lg">₹ {otherStationTotalCost}</span>
                </div>
              </div>
              <Button 
                type="button"
                variant="outline" 
                className="w-full mt-4" 
                onClick={() => handleChange({ selling_price: otherStationTotalCost, purchase_price: otherStationTotalCost })}
              >
                Apply to Total Amount
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 4: LOCAL STATION */}
        <AccordionItem value="item-4" className="border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">4</span>
              LOCAL STATION
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-muted/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Travel Date *</Label>
                <Input type="date" value={form.travel_date} onChange={(e) => handleChange({ travel_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>From Location *</Label>
                <Input placeholder="Start point" value={form.from_location} onChange={(e) => handleChange({ from_location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>To Location *</Label>
                <Input placeholder="End point" value={form.to_location} onChange={(e) => handleChange({ to_location: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Via / Route</Label>
                <Input placeholder="Enter route" value={form.route} onChange={(e) => handleChange({ route: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>No. of Days *</Label>
                <Input type="number" placeholder="0" value={form.no_of_days} onChange={(e) => handleChange({ no_of_days: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>No. of Nights</Label>
                <Input type="number" placeholder="0" value={form.no_of_nights} onChange={(e) => handleChange({ no_of_nights: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Rate (₹)</Label>
                <Input type="number" placeholder="0" value={form.rate} onChange={(e) => handleChange({ rate: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Extra KM (₹)</Label>
                <Input type="number" placeholder="0" value={form.extra_km_charge} onChange={(e) => handleChange({ extra_km_charge: e.target.value })} />
              </div>

              <div className="space-y-2">
                <Label>Extra Hours (₹)</Label>
                <Input type="number" placeholder="0" value={form.extra_hrs_charge} onChange={(e) => handleChange({ extra_hrs_charge: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Driver Charge (₹)</Label>
                <Input type="number" placeholder="0" value={form.driver_charge} onChange={(e) => handleChange({ driver_charge: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Parking Charge (₹)</Label>
                <Input type="number" placeholder="0" value={form.parking_charge} onChange={(e) => handleChange({ parking_charge: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Night Charge (₹)</Label>
                <Input type="number" placeholder="0" value={form.nights_charge} onChange={(e) => handleChange({ nights_charge: e.target.value })} />
              </div>
            </div>

            {/* Pricing Estimate */}
            <div className="mt-6 bg-[#faf9f8] p-4 rounded-xl border col-span-2 md:col-span-4">
              <h4 className="font-semibold mb-3">Pricing Estimate</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base Rate ({form.rate || 0} × {form.no_of_days || 0} days):</span>
                  <span className="font-medium">₹ {baseRate}</span>
                </div>
                <div className="flex justify-between border-t pt-2 font-bold">
                  <span>Total Cost:</span>
                  <span className="text-[#E12D39] text-lg">₹ {totalCost}</span>
                </div>
              </div>
              <Button 
                type="button"
                variant="outline" 
                className="w-full mt-4" 
                onClick={() => handleChange({ selling_price: totalCost, purchase_price: totalCost })}
              >
                Apply to Total Amount
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 5: FINANCIAL DETAILS */}
        <AccordionItem value="item-5" className="border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">5</span>
              FINANCIAL DETAILS
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-muted/20">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Selling Price (₹)</Label>
                <Input type="number" placeholder="0" value={form.selling_price} onChange={(e) => handleChange({ selling_price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Purchase Price (₹)</Label>
                <Input type="number" placeholder="0" value={form.purchase_price} onChange={(e) => handleChange({ purchase_price: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Received Amount (₹)</Label>
                <Input type="number" placeholder="0" value={form.received_amount} onChange={(e) => handleChange({ received_amount: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Outstanding Amount</Label>
                <Input value={outstandingAmount} readOnly className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label>Payment Status</Label>
                <Select value={form.payment_status} onValueChange={(v) => handleChange({ payment_status: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Partial">Partial</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Input placeholder="e.g. Cash, UPI, Bank Transfer" value={form.payment_mode} onChange={(e) => handleChange({ payment_mode: e.target.value })} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Payment Remarks</Label>
                <Input placeholder="Any notes regarding payment..." value={form.payment_remarks} onChange={(e) => handleChange({ payment_remarks: e.target.value })} />
              </div>
            </div>
            
            {isAdmin && (
              <div className="mt-4 p-4 rounded-xl border bg-primary/5 flex justify-center gap-16 text-center">
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider mb-1">Profit</p>
                  <p className="font-bold text-[#059669] text-xl">₹ {profit}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider mb-1">Margin %</p>
                  <p className="font-bold text-foreground text-xl">{marginPercentage}%</p>
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 6: ATTACHMENTS DETAILS */}
        <AccordionItem value="item-6" className="border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">6</span>
              ATTACHMENTS DETAILS
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-muted/20">
            <div className="space-y-4">
              {[
                { label: "Toll Tax Document" },
                { label: "Parking Tax Document" },
                { label: "State Tax Document" },
                { label: "Duty Slip" },
                { label: "Other Document" },
              ].map((item, idx) => {
                const existingFile = form.attachments?.[item.label];
                return (
                  <div key={idx} className="flex items-center gap-4 bg-background p-3 rounded-lg border">
                    <div className="w-1/3 font-semibold text-sm">{item.label}</div>
                    <div className="flex-1 flex flex-col gap-2">
                      {!existingFile ? (
                        <Input 
                          type="file" 
                          className="w-full text-xs" 
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                handleChange({
                                  attachments: {
                                    ...form.attachments,
                                    [item.label]: reader.result
                                  }
                                });
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      ) : (
                        <div className="flex items-center justify-between p-2 bg-green-50 rounded-md border border-green-200">
                          <div className="flex items-center gap-2 text-green-700">
                            {existingFile.startsWith("data:image/") ? (
                              <img src={existingFile} alt="Preview" className="h-8 w-12 object-cover rounded-sm border border-green-300 cursor-pointer shadow-sm hover:scale-150 transition-transform origin-left" />
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            )}
                            <span className="text-xs font-semibold">Document Saved</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              className="text-xs text-purple-600 hover:underline font-medium bg-purple-50 px-2 py-1 rounded"
                              onClick={() => setPreviewImage(existingFile)}
                            >
                              Preview
                            </button>
                            <a 
                              href={existingFile} 
                              download={`${item.label}-document`}
                              className="text-xs text-blue-600 hover:underline font-medium bg-blue-50 px-2 py-1 rounded"
                            >
                              Download
                            </a>
                            <button 
                              type="button" 
                              className="text-xs text-red-600 hover:underline font-medium bg-red-50 px-2 py-1 rounded"
                              onClick={() => {
                                const newAttachments = { ...form.attachments };
                                delete newAttachments[item.label];
                                handleChange({ attachments: newAttachments });
                              }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* SECTION 7: REMARK */}
        <AccordionItem value="item-7" className="border rounded-xl bg-card overflow-hidden">
          <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-2 font-bold text-lg">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary text-sm">7</span>
              REMARK
            </div>
          </AccordionTrigger>
          <AccordionContent className="p-4 border-t bg-muted/20">
            {/* injected remark content */}
            <div className="mt-4 space-y-2">
              <Label>Other Remarks / Bank Details</Label>
              <Textarea 
                placeholder="Any other comments or bank details..." 
                value={form.remarks} 
                onChange={(e) => handleChange({ remarks: e.target.value })} 
                rows={3} 
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="sticky bottom-0 left-0 right-0 bg-background flex justify-end gap-3 py-4 border-t mt-8 z-10 px-6 -mx-6 -mb-6">
        <Button variant="outline" onClick={onCancel} className="px-6 rounded-xl">Cancel</Button>
        <Button onClick={handleSave} className="px-6 rounded-xl">Save Booking</Button>
      </div>


      {/* Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={(open) => !open && setPreviewImage(null)}>
        <DialogContent className="max-w-4xl p-0 border-0 bg-transparent shadow-none">
          <div className="relative flex items-center justify-center">
            {previewImage?.startsWith("data:image/") ? (
              <img src={previewImage} alt="Preview" className="max-h-[85vh] object-contain rounded-lg shadow-2xl bg-white" />
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center gap-4">
                <FileText className="h-16 w-16 text-muted-foreground" />
                <p className="text-muted-foreground">Preview not available for this file type.</p>
                <a href={previewImage!} download className="text-primary hover:underline">Download instead</a>
              </div>
            )}
            <button 
              onClick={() => setPreviewImage(null)}
              className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-2 hover:bg-black/70 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

