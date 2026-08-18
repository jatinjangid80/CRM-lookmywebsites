import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Upload, Plus, Check, ChevronsUpDown, MoreVertical, Edit2, Trash2, Download, FileText, Table2, Briefcase } from "lucide-react";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export const Route = createFileRoute("/crm/taxi-booking")({
  component: TaxiBookingPage,
});

function TaxiBookingPage() {
  const [isAdding, setIsAdding] = useState(false);
  const [editingBooking, setEditingBooking] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [bookings, setBookings] = useSupabaseTable<any[]>("crm_taxi_bookings", []);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");

  const filteredBookings = bookings;

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
      ["Booking ID", "Customer", "Mobile", "Route", "Travel Date", "Vehicle Type", "Vehicle No", "Supplier", "Pricing Type", "Rate", "Quantity", "Purchase Price", "Selling Price", "Profit", "Remarks"]
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
        String(b.selling_price || "0"),
        String(b.profit || "0"),
        (b.remarks || "-").replace(/,/g, " ")
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
      "<tr><th>Booking ID</th><th>Customer</th><th>Mobile</th><th>Route</th><th>Travel Date</th><th>Vehicle No</th><th>Selling Price</th><th>Profit</th></tr>";

    const exportableBookings = bookings.filter(b => {
      const d = b.travel_date || "";
      const matchStart = exportStartDate ? d >= exportStartDate : true;
      const matchEnd = exportEndDate ? d <= exportEndDate : true;
      return matchStart && matchEnd;
    });

    const tableRows = exportableBookings
      .map(
        (b) =>
          `<tr><td>${b.id || ""}</td><td>${b.customer_name || ""}</td><td>${b.mobile_number || ""}</td><td>${b.route || ""}</td><td>${b.travel_date || ""}</td><td>${b.vehicle_no || ""}</td><td>₹${b.selling_price || 0}</td><td>₹${b.profit || 0}</td></tr>`,
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
      "<tr><th>Booking ID</th><th>Customer</th><th>Mobile</th><th>Route</th><th>Travel Date</th><th>Vehicle No</th><th>Selling Price</th><th>Profit</th></tr>";

    const tableRows = exportableBookings
      .map(
        (b) =>
          `<tr><td>${b.id || ""}</td><td>${b.customer_name || ""}</td><td>${b.mobile_number || ""}</td><td>${b.route || ""}</td><td>${b.travel_date || ""}</td><td>${b.vehicle_no || ""}</td><td>₹${b.selling_price || 0}</td><td>₹${b.profit || 0}</td></tr>`,
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
    <div className="p-6 max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in duration-500">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Bookings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredBookings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Cabs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Set(filteredBookings.map((b: any) => b.vehicle_no).filter(Boolean)).size || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹ {filteredBookings.reduce((sum: number, b: any) => sum + (Number(b.selling_price) || 0), 0).toLocaleString('en-IN')}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Travel Date</TableHead>
                <TableHead>Selling Price</TableHead>
                <TableHead>Profit</TableHead>
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
                    <TableCell className="font-medium">{b.customer_name}</TableCell>
                    <TableCell>{b.route}</TableCell>
                    <TableCell>{b.travel_date}</TableCell>
                    <TableCell>₹ {b.selling_price || 0}</TableCell>
                    <TableCell className="text-emerald-600 font-semibold">₹ {b.profit || 0}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setEditingBooking(b)}>
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
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
        </CardContent>
      </Card>

      <Dialog open={isAdding || !!editingBooking} onOpenChange={(open) => {
        if (!open) {
          setIsAdding(false);
          setEditingBooking(null);
        }
      }}>
        <DialogContent className="max-w-7xl h-[90vh] p-0 flex flex-col border-0 [&>button]:hidden">
          <div className="flex-1 overflow-y-auto bg-background rounded-xl">
            <AddTaxiBookingForm 
              initialData={editingBooking}
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

function AddTaxiBookingForm({ onCancel, onSave, initialData }: { onCancel: () => void, onSave?: (booking: any) => void, initialData?: any }) {
  const [vendors] = useSupabaseTable<any[]>("vendors", []);
  const [customers] = useSupabaseTable<any[]>("customers", []);
  
  const [supplierOpen, setSupplierOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);

  const [form, setForm] = useState<any>(initialData || {
    supplier: "",
    booking_date: new Date().toISOString().split('T')[0],
    customer_name: "",
    mobile_number: "",
    email_address: "",
    booked_by: "",
    reference: "",
    pricing_type: "day-wise",
    travel_date: "",
    route: "",
    vehicle_type: "",
    vehicle_no: "",
    rate: 0,
    total_quantity: 0,
    extra_hrs_charge: 0,
    nights_charge: 0,
    driver_charge: 0,
    parking_charge: 0,
    other_charges: 0,
    selling_price: 0,
    purchase_price: 0,
    bank_details: "",
    remarks: "",
  });

  const handleChange = (updates: any) => {
    setForm((prev: any) => ({ ...prev, ...updates }));
  };

  const handleSave = async () => {
    if (!form.customer_name || !form.supplier || !form.travel_date) {
      toast.error("Please fill all required fields (Supplier, Customer, Travel Date)");
      return;
    }

    try {
      const payload = {
        id: form.id || ("TX-" + Math.random().toString(36).substring(2, 9)),
        ...form,
        profit: (Number(form.selling_price) || 0) - (Number(form.purchase_price) || 0),
        created_at: form.created_at || new Date().toISOString(),
      };

      const { error } = await supabase.from("crm_taxi_bookings").upsert([payload]);
      if (error) throw error;

      toast.success("Taxi Booking saved successfully");
      if (onSave) {
        onSave(payload);
      } else {
        onCancel();
      }
    } catch (err: any) {
      toast.error("Failed to save booking: " + err.message);
    }
  };

  const baseRate = (Number(form.rate) || 0) * (Number(form.total_quantity) || 0);
  const totalCost = baseRate + 
    (Number(form.extra_hrs_charge) || 0) + 
    (Number(form.nights_charge) || 0) + 
    (Number(form.driver_charge) || 0) + 
    (Number(form.parking_charge) || 0) + 
    (Number(form.other_charges) || 0);

  const profit = (Number(form.selling_price) || 0) - (Number(form.purchase_price) || 0);
  const marginPercentage = form.selling_price ? ((profit / Number(form.selling_price)) * 100).toFixed(1) : "0.0";

  return (
    <div className="p-6 max-w-6xl mx-auto animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold font-display">New Taxi Booking</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Supplier <span className="text-destructive">*</span></Label>
                <Popover open={supplierOpen} onOpenChange={setSupplierOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={supplierOpen} className="w-full justify-between font-normal text-left">
                      <span className="truncate">{form.supplier || "Select a supplier..."}</span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search supplier..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No supplier found.</CommandEmpty>
                        <CommandGroup>
                          {vendors?.map((v) => (
                            <CommandItem key={v.id || v.name} value={`${v.name} ${v.mobile || ""} ${v.id || ""}`} onSelect={() => { handleChange({ supplier: v.name }); setSupplierOpen(false); }}>
                              <div className="flex flex-col">
                                <span>{v.name}</span>
                                {v.mobile && <span className="text-xs text-muted-foreground">{v.mobile}</span>}
                              </div>
                              <Check className={cn("ml-auto h-4 w-4", form.supplier === v.name ? "opacity-100" : "opacity-0")} />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Booking Date <span className="text-destructive">*</span></Label>
                <Input type="date" value={form.booking_date} onChange={(e) => handleChange({ booking_date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Customer Name <span className="text-destructive">*</span></Label>
                <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" role="combobox" aria-expanded={customerOpen} className="w-full justify-between font-normal text-left">
                      <span className="truncate">{form.customer_name || "Select a customer..."}</span>
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[300px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search customer..." className="h-9" />
                      <CommandList>
                        <CommandEmpty>No customer found.</CommandEmpty>
                        <CommandGroup>
                          {customers?.map((c) => (
                            <CommandItem key={c.id || c.name} value={`${c.name} ${c.mobile || ""} ${c.id || ""}`} onSelect={() => { 
                              handleChange({ customer_name: c.name, mobile_number: c.mobile || c.phone || "", email_address: c.email || "" }); 
                              setCustomerOpen(false); 
                            }}>
                              <div className="flex flex-col">
                                <span>{c.name}</span>
                                {c.mobile && <span className="text-xs text-muted-foreground">{c.mobile}</span>}
                              </div>
                              <Check className={cn("ml-auto h-4 w-4", form.customer_name === c.name ? "opacity-100" : "opacity-0")} />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Mobile Number <span className="text-destructive">*</span></Label>
                <Input placeholder="+91 XXXXX XXXXX" value={form.mobile_number} onChange={(e) => handleChange({ mobile_number: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Email Address</Label>
                <Input placeholder="Enter email address" value={form.email_address} onChange={(e) => handleChange({ email_address: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Booked By</Label>
                <Input placeholder="Agent/Employee name" value={form.booked_by} onChange={(e) => handleChange({ booked_by: e.target.value })} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="day-wise" className="w-full" onValueChange={(val) => handleChange({ pricing_type: val })}>
                <TabsList className="grid w-full grid-cols-2 h-auto bg-[#FDF8F5] rounded-full p-1 border border-[#F2E8E3] mb-6">
                  <TabsTrigger value="day-wise" className="rounded-full py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-[#E12D39] data-[state=active]:shadow-sm">
                    Day Wise Pricing
                  </TabsTrigger>
                  <TabsTrigger value="km-wise" className="rounded-full py-2.5 text-sm font-medium text-muted-foreground data-[state=active]:bg-white data-[state=active]:text-[#E12D39] data-[state=active]:shadow-sm">
                    KM Wise Pricing
                  </TabsTrigger>
                </TabsList>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label>Travel Date <span className="text-destructive">*</span></Label>
                    <Input type="date" value={form.travel_date} onChange={(e) => handleChange({ travel_date: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Location / City Route <span className="text-destructive">*</span></Label>
                    <Input placeholder="Delhi - Agra" value={form.route} onChange={(e) => handleChange({ route: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle Type</Label>
                    <Input placeholder="Innova Crysta" value={form.vehicle_type} onChange={(e) => handleChange({ vehicle_type: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Vehicle No.</Label>
                    <Input placeholder="DL 1C AA 1111" value={form.vehicle_no} onChange={(e) => handleChange({ vehicle_no: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{form.pricing_type === 'day-wise' ? 'Rate per Day' : 'Rate per KM'} <span className="text-destructive">*</span></Label>
                    <Input type="number" value={form.rate} onChange={(e) => handleChange({ rate: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>{form.pricing_type === 'day-wise' ? 'No. of Days' : 'No. of KMs'} <span className="text-destructive">*</span></Label>
                    <Input type="number" value={form.total_quantity} onChange={(e) => handleChange({ total_quantity: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Extra Hrs Charge</Label>
                    <Input type="number" value={form.extra_hrs_charge} onChange={(e) => handleChange({ extra_hrs_charge: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Nights Charge</Label>
                    <Input type="number" value={form.nights_charge} onChange={(e) => handleChange({ nights_charge: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Driver Charge</Label>
                    <Input type="number" value={form.driver_charge} onChange={(e) => handleChange({ driver_charge: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Parking Charge</Label>
                    <Input type="number" value={form.parking_charge} onChange={(e) => handleChange({ parking_charge: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Other Charges</Label>
                    <Input type="number" value={form.other_charges} onChange={(e) => handleChange({ other_charges: e.target.value })} />
                  </div>
                </div>

                {/* Pricing Estimate */}
                <div className="mt-6 bg-[#faf9f8] p-4 rounded-xl border">
                  <h4 className="font-semibold mb-3">Pricing Estimate</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Base Rate ({form.rate || 0} × {form.total_quantity || 0} {form.pricing_type === 'day-wise' ? 'days' : 'KMs'}):</span>
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
              </Tabs>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 sticky top-6 self-start">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
              <CardTitle>Financial Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Selling Price (₹)</Label>
                  <Input type="number" placeholder="0" value={form.selling_price} onChange={(e) => handleChange({ selling_price: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Purchase Price (₹)</Label>
                  <Input type="number" placeholder="0" value={form.purchase_price} onChange={(e) => handleChange({ purchase_price: e.target.value })} />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 p-4 mt-2 rounded-xl border bg-[#faf9f8]">
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider mb-1">Profit</p>
                  <p className="font-bold text-[#059669] text-xl">₹{profit}</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider mb-1">Margin %</p>
                  <p className="font-bold text-foreground text-xl">{marginPercentage}%</p>
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground uppercase font-semibold tracking-wider mb-1">Pending Amount</p>
                  <p className="font-bold text-[#f97316] text-xl">₹{form.selling_price || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bank Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Textarea 
                  placeholder="Account Number, IFSC Code, Bank Name, etc." 
                  value={form.bank_details}
                  onChange={(e) => handleChange({ bank_details: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Attachments & Remarks</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <Label className="text-base font-semibold">Attachments</Label>
                {["Ticket / Voucher", "Passport / ID Copy", "Other Document"].map((docName, idx) => (
                  <div key={idx} className="space-y-2">
                    <Label className="text-sm font-medium">{idx + 1}. {docName}</Label>
                    <div className="flex items-center gap-2">
                      <Input type="file" className="flex-1" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label className="text-base font-semibold">Remark</Label>
                <Textarea 
                  placeholder="Add any additional notes or remarks here..." 
                  value={form.remarks}
                  onChange={(e) => handleChange({ remarks: e.target.value })}
                  className="min-h-[100px]"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 bg-background flex justify-end gap-2 py-4 border-t mt-8 -mx-6 px-6 -mb-6 z-10">
        <Button variant="outline" onClick={onCancel}>Cancel</Button>
        <Button onClick={handleSave}>Save Booking</Button>
      </div>
    </div>
  );
}
