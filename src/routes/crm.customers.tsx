import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, Trash2, Wallet, Search, Filter, Download, User, MoreVertical, FileText, IndianRupee, MessageSquare, History, Copy, Phone, Mail, MapPin, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatINR, Customer as BaseCustomer } from "@/lib/mock-data";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { ImportCustomersModal } from "@/components/ui/import-customers-modal";
import { getAuth } from "@/lib/auth";
import { INITIAL_EMPLOYEES } from "./crm.employees";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export const Route = createFileRoute("/crm/customers")({
  component: CustomersPage,
});

export interface ExtCustomer extends BaseCustomer {
  reference?: string;
  company?: string;
  city?: string;
  source?: string;
  status: "Active" | "Inactive" | "VIP";
  createdAt: string;
  lastBookingDate?: string;
  assignedTo?: string;
}

const CUSTOMER_STATUSES = ["Active", "Inactive", "VIP"];
const SOURCES = ["Website", "Referral", "Facebook", "Instagram", "Ads", "Walk-in", "Other"];

function CustomersPage() {
  const [customerList, setCustomerList] = useSupabaseTable<ExtCustomer[]>("customers", []);
  const [leads] = useSupabaseTable<any[]>("leads", []);
  const [bookings] = useSupabaseTable<any[]>("bookings", []);
  const [tasks] = useSupabaseTable<any[]>("tasks", []);
  const [localEmployees] = useSupabaseTable<any[]>("employees", INITIAL_EMPLOYEES);
  
  const employees = localEmployees?.length ? localEmployees : INITIAL_EMPLOYEES;
  const auth = getAuth();
  const isAdmin = auth?.role === "admin" || auth?.role === "manager";
  const assignees = Array.from(new Set([...employees.map((e) => e.name), ...(auth?.name ? [auth.name] : []), "Unassigned"]));

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  
  const [newCustomer, setNewCustomer] = useState<Partial<ExtCustomer>>({ 
    name: "", phone: "", email: "", status: "Active", source: "Website", assignedTo: "Unassigned", company: "", city: "", reference: "", dob: "", dateOfAnniversary: "", gst: ""
  });

  const [selectedCustomer, setSelectedCustomer] = useState<ExtCustomer | null>(null);
  const [dialogType, setDialogType] = useState<"profile" | "delete" | "edit" | null>(null);

  // Filters & Search
  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCity, setFilterCity] = useState("All");
  const [filterAssignee, setFilterAssignee] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const cities = Array.from(new Set(customerList.map((c) => c.city).filter(Boolean)));

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.phone) return;

    if (dialogType === "edit" && selectedCustomer) {
      setCustomerList((prev) =>
        prev.map((c) => (c.id === selectedCustomer.id ? { ...c, ...newCustomer } as ExtCustomer : c))
      );
      setDialogType(null);
      return;
    }

    const isDuplicate = customerList.some((c) => c.phone === newCustomer.phone);
    if (isDuplicate) {
      alert("A customer with this phone number already exists.");
      return;
    }

    const currentMaxId = customerList.reduce((max, c) => {
      const num = parseInt(c.id.replace("CRN", ""));
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const nextId = `CRN${String(currentMaxId + 1).padStart(3, "0")}`;

    const customer: ExtCustomer = {
      id: nextId,
      name: newCustomer.name || "",
      phone: newCustomer.phone || "",
      email: newCustomer.email || "",
      company: newCustomer.company || "",
      city: newCustomer.city || "",
      source: newCustomer.source || "Website",
      reference: newCustomer.reference || "",
      status: (newCustomer.status as any) || "Active",
      assignedTo: newCustomer.assignedTo || "Unassigned",
      dob: newCustomer.dob || "",
      dateOfAnniversary: newCustomer.dateOfAnniversary || "",
      gst: newCustomer.gst || "",
      createdAt: new Date().toISOString().slice(0, 10),
      trips: 0,
      totalSpend: 0,
      tier: "Silver", // Legacy compat
    };

    setCustomerList([customer, ...customerList]);
    setIsAddOpen(false);
    setNewCustomer({ name: "", phone: "", email: "", status: "Active", source: "Website", assignedTo: "Unassigned" });
  };



  const handleImportCustomers = (data: any[]) => {
    let currentMaxId = customerList.reduce((max, c) => {
      const num = parseInt(c.id.replace("CRN", ""));
      return !isNaN(num) && num > max ? num : max;
    }, 0);

    const pad = (num: number, size: number) => {
      let s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    };

    const newCustomers: ExtCustomer[] = [];
    
    data.forEach((row) => {
      const phone = String(row["Mobile Number"] || "").trim();
      // Skip duplicate phones if already in existing list or current import batch
      if (customerList.some(c => c.phone === phone) || newCustomers.some(c => c.phone === phone)) return;
      
      currentMaxId++;
      newCustomers.push({
        id: `CRN${pad(currentMaxId, 3)}`,
        name: String(row["Customer Name"] || ""),
        email: String(row["Email Address"] || ""),
        phone: phone,
        reference: String(row["Reference Name"] || ""),
        company: String(row["Company Name"] || ""),
        city: String(row["City"] || ""),
        source: String(row["Lead Source"] || "Website"),
        status: (String(row["Status"]) || "Active") as "Active" | "Inactive" | "VIP",
        assignedTo: String(row["Assigned Employee"] || "Unassigned"),
        createdAt: new Date().toISOString().slice(0, 10),
        trips: 0,
        totalSpend: 0,
        tier: "Silver",
      });
    });

    setCustomerList([...newCustomers, ...customerList]);
  };

  const exportToCSV = () => {
    const headers = [
      "Customer ID",
      "Customer Name",
      "Email Address",
      "Mobile Number",
      "Reference Name",
      "Company Name",
      "City",
      "Lead Source",
      "Status",
      "Assigned Employee",
      "Total Bookings",
      "Total Revenue",
      "Created Date",
    ].join(",");

    const rows = filtered.map((c) =>
      [
        c.id,
        `"${c.name}"`,
        `"${c.email}"`,
        `"${c.phone}"`,
        `"${c.reference || ""}"`,
        `"${c.company || ""}"`,
        `"${c.city || ""}"`,
        `"${c.source || ""}"`,
        `"${c.status}"`,
        `"${c.assignedTo || ""}"`,
        c.trips,
        c.totalSpend,
        c.createdAt,
      ].join(",")
    );

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `customers_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = useMemo(() => {
    return customerList.filter(
      (c) =>
        (filterStatus === "All" || c.status === filterStatus) &&
        (filterCity === "All" || c.city === filterCity) &&
        (filterAssignee === "All" || c.assignedTo === filterAssignee) &&
        (q === "" ||
          c.name?.toLowerCase().includes(q.toLowerCase()) ||
          c.phone?.includes(q) ||
          c.email?.toLowerCase().includes(q.toLowerCase()) ||
          c.reference?.toLowerCase().includes(q.toLowerCase()) ||
          c.company?.toLowerCase().includes(q.toLowerCase()) ||
          c.city?.toLowerCase().includes(q.toLowerCase()))
    ).sort((a, b) => {
      const numA = parseInt(a.id.replace(/\D/g, "")) || 0;
      const numB = parseInt(b.id.replace(/\D/g, "")) || 0;
      return numA - numB;
    });
  }, [customerList, filterStatus, filterCity, filterAssignee, q]);

  // Pagination removed - showing all data with scroll

  const StatusBadge = ({ status }: { status: string }) => {
    switch (status) {
      case "VIP": return <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider shadow-sm border border-amber-200">VIP</span>;
      case "Active": return <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider">Active</span>;
      default: return <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider">Inactive</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your entire customer database, view history, and track loyalty.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
          <Button variant="outline" onClick={exportToCSV}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button variant="outline" onClick={() => setIsImportOpen(true)}>
            <Download className="mr-2 h-4 w-4 rotate-180" /> Import
          </Button>
          <Button onClick={() => setIsAddOpen(true)} style={{ background: "var(--gradient-brand)" }} className="text-white shadow-md">
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search name, phone, email..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setCurrentPage(1); }}
            className="pl-9 bg-background h-10 rounded-xl"
          />
        </div>
        
        <div className="flex items-center gap-4">
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[160px] bg-background h-10 rounded-xl border border-border shadow-sm font-medium">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              {CUSTOMER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="text-sm text-muted-foreground whitespace-nowrap font-medium px-2">
            {filtered.length} customers
          </div>
        </div>
      </div>

      {/* Grid View */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground bg-card rounded-2xl border border-dashed">
            <User className="h-12 w-12 mb-4 opacity-50" />
            <p>No customers found matching your criteria.</p>
          </div>
        ) : (
          filtered.map((c) => (
            <div key={c.id} className="bg-card rounded-[24px] border border-border p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-lg shrink-0">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-lg leading-tight flex items-center gap-2">
                      {c.name}
                      <StatusBadge status={c.status} />
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{c.id}</div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 opacity-50 hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40 rounded-xl">
                    <DropdownMenuItem onClick={() => { setSelectedCustomer(c); setDialogType("profile"); }}>
                      <User className="mr-2 h-4 w-4" /> View Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSelectedCustomer(c); setNewCustomer(c); setDialogType("edit"); }}>
                      <FileText className="mr-2 h-4 w-4" /> Edit Customer
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {isAdmin && (
                      <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => { setSelectedCustomer(c); setDialogType("delete"); }}>
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="space-y-3 mb-6 flex-1">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 text-foreground/50 shrink-0" /> 
                  <span className="font-medium text-foreground/80">{c.phone}</span>
                </div>
                {c.email && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4 text-foreground/50 shrink-0" />
                    <span className="truncate font-medium text-foreground/80">{c.email}</span>
                  </div>
                )}
                {c.city && (
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 text-foreground/50 shrink-0" />
                    <span className="font-medium text-foreground/80">{c.city}</span>
                  </div>
                )}
              </div>

              <Button 
                variant="outline" 
                className="w-full rounded-xl bg-transparent border-border hover:bg-secondary/50 h-10 font-semibold"
                onClick={() => { setSelectedCustomer(c); setDialogType("profile"); }}
              >
                View History
              </Button>
            </div>
          ))
        )}
      </div>

      {/* ── Modals ── */}
      <ImportCustomersModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImport={handleImportCustomers}
        allowedStatuses={CUSTOMER_STATUSES}
        allowedAssignees={assignees}
      />

      <Dialog open={isAddOpen || dialogType === "edit"} onOpenChange={(val) => {
        if (!val) {
          setIsAddOpen(false);
          setDialogType(null);
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{dialogType === "edit" ? "Edit Customer" : "Add Customer"}</DialogTitle>
            <DialogDescription>
              {dialogType === "edit" ? "Update customer details." : "Create a new customer profile."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveCustomer} className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Customer Name <span className="text-red-500">*</span></Label>
              <Input id="name" autoComplete="off" name="customer_name_field" placeholder="e.g. jatin jangid" required value={newCustomer.name || ""} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Mobile Number <span className="text-red-500">*</span></Label>
              <Input id="phone" placeholder="e.g. 9876543210" required value={newCustomer.phone || ""} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" placeholder="e.g. jatin@example.com" value={newCustomer.email || ""} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" placeholder="e.g. NxtWave" value={newCustomer.company || ""} onChange={(e) => setNewCustomer({ ...newCustomer, company: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="e.g. jaipur" value={newCustomer.city || ""} onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference Name</Label>
              <Input id="reference" placeholder="e.g. jatin jangid" value={newCustomer.reference || ""} onChange={(e) => setNewCustomer({ ...newCustomer, reference: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="source">Lead Source</Label>
              <Select value={newCustomer.source || "Website"} onValueChange={(v) => setNewCustomer({ ...newCustomer, source: v })}>
                <SelectTrigger id="source"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SOURCES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={newCustomer.status || "Active"} onValueChange={(v: any) => setNewCustomer({ ...newCustomer, status: v })}>
                <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CUSTOMER_STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned Employee</Label>
              <Select value={newCustomer.assignedTo || "Unassigned"} onValueChange={(v) => setNewCustomer({ ...newCustomer, assignedTo: v })}>
                <SelectTrigger id="assignedTo"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {assignees.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dob">DOB</Label>
              <Input id="dob" type="date" value={newCustomer.dob || ""} onChange={(e) => setNewCustomer({ ...newCustomer, dob: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateOfAnniversary">Date of Anniversary</Label>
              <Input id="dateOfAnniversary" type="date" value={newCustomer.dateOfAnniversary || ""} onChange={(e) => setNewCustomer({ ...newCustomer, dateOfAnniversary: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gst">GST</Label>
              <Input id="gst" placeholder="GST Number" value={newCustomer.gst || ""} onChange={(e) => setNewCustomer({ ...newCustomer, gst: e.target.value })} />
            </div>
            <DialogFooter className="col-span-2 mt-4">
              <Button type="button" variant="outline" onClick={() => { setIsAddOpen(false); setDialogType(null); }}>
                Cancel
              </Button>
              <Button type="submit">{dialogType === "edit" ? "Update Customer" : "Save Customer"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === "profile"} onOpenChange={(val) => !val && setDialogType(null)}>
        <DialogContent className="sm:max-w-[800px] p-0 overflow-hidden h-[85vh] flex flex-col">
          {selectedCustomer && (
            <>
              <DialogHeader className="px-6 pt-8 pb-6">
                <div>
                  <DialogTitle className="text-4xl font-display font-bold tracking-tight mb-2">{selectedCustomer.name}</DialogTitle>
                  <DialogDescription className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedCustomer.city || "Unknown"}</span>
                    <span>•</span>
                    <span>{selectedCustomer.id}</span>
                  </DialogDescription>
                </div>
              </DialogHeader>

              {(() => {
                const custBookings = bookings.filter((b: any) => b.customer === selectedCustomer.name || b.mobileNumber === selectedCustomer.phone);
                const custLeads = leads.filter((l: any) => l.phone === selectedCustomer.phone);
                const custTasks = tasks.filter((t: any) => t.customer_id === selectedCustomer.name || t.customer_id === selectedCustomer.id);
                const totalSpent = custBookings.reduce((sum, b) => sum + (b.amount || 0), 0);

                return (
                  <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
                    <div className="px-6 border-t border-border pt-6 pb-2">
                      <TabsList className="h-12 bg-secondary/30 rounded-full w-full justify-between p-1">
                        <TabsTrigger value="overview" className="flex-1 data-[state=active]:border-orange-500 data-[state=active]:border-2 data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-full py-2 text-sm font-medium border-2 border-transparent text-muted-foreground hover:text-foreground">
                          Info
                        </TabsTrigger>
                        <TabsTrigger value="bookings" className="flex-1 data-[state=active]:border-orange-500 data-[state=active]:border-2 data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-full py-2 text-sm font-medium border-2 border-transparent text-muted-foreground hover:text-foreground">
                          Bookings ({custBookings.length})
                        </TabsTrigger>
                        <TabsTrigger value="payments" className="flex-1 data-[state=active]:border-orange-500 data-[state=active]:border-2 data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-full py-2 text-sm font-medium border-2 border-transparent text-muted-foreground hover:text-foreground">
                          Payments
                        </TabsTrigger>
                        <TabsTrigger value="leads" className="flex-1 data-[state=active]:border-orange-500 data-[state=active]:border-2 data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-full py-2 text-sm font-medium border-2 border-transparent text-muted-foreground hover:text-foreground">
                          Leads ({custLeads.length})
                        </TabsTrigger>
                        <TabsTrigger value="tasks" className="flex-1 data-[state=active]:border-orange-500 data-[state=active]:border-2 data-[state=active]:bg-card data-[state=active]:shadow-sm rounded-full py-2 text-sm font-medium border-2 border-transparent text-muted-foreground hover:text-foreground">
                          Tasks ({custTasks.length})
                        </TabsTrigger>
                      </TabsList>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6">
                  <TabsContent value="overview" className="m-0 outline-none">
                    <div className="bg-card border border-border rounded-[24px] p-6 shadow-sm">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-8">
                        <div>
                          <p className="text-muted-foreground text-sm mb-1 font-medium">Phone</p>
                          <p className="font-medium text-lg text-foreground">{selectedCustomer.phone}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm mb-1 font-medium">Email</p>
                          <p className="font-medium text-lg text-foreground">{selectedCustomer.email || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm mb-1 font-medium">Company</p>
                          <p className="font-medium text-lg text-foreground">{selectedCustomer.company || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm mb-1 font-medium">City</p>
                          <p className="font-medium text-lg text-foreground">{selectedCustomer.city || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm mb-1 font-medium">Reference</p>
                          <p className="font-medium text-lg text-foreground">{selectedCustomer.reference || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm mb-1 font-medium">Source</p>
                          <p className="font-medium text-lg text-foreground">{selectedCustomer.source || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm mb-1 font-medium">Assigned To</p>
                          <p className="font-medium text-lg text-foreground">{selectedCustomer.assignedTo || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm mb-1 font-medium">DOB</p>
                          <p className="font-medium text-lg text-foreground">{selectedCustomer.dob || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm mb-1 font-medium">Anniversary</p>
                          <p className="font-medium text-lg text-foreground">{selectedCustomer.dateOfAnniversary || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm mb-1 font-medium">GST</p>
                          <p className="font-medium text-lg text-foreground">{selectedCustomer.gst || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-sm mb-1 font-medium">Created At</p>
                          <p className="font-medium text-lg text-foreground">{selectedCustomer.createdAt}</p>
                        </div>
                      </div>

                      <div className="mt-8 pt-6 border-t grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-secondary/20 p-4 rounded-xl border text-center">
                          <p className="text-2xl font-bold font-display">{custBookings.length}</p>
                          <p className="text-xs text-muted-foreground uppercase font-medium mt-1">Bookings</p>
                        </div>
                        <div className="bg-secondary/20 p-4 rounded-xl border text-center">
                          <p className="text-2xl font-bold font-display">{custLeads.length}</p>
                          <p className="text-xs text-muted-foreground uppercase font-medium mt-1">Leads</p>
                        </div>
                        <div className="bg-secondary/20 p-4 rounded-xl border text-center">
                          <p className="text-2xl font-bold font-display">{custTasks.length}</p>
                          <p className="text-xs text-muted-foreground uppercase font-medium mt-1">Tasks</p>
                        </div>
                        <div className="bg-secondary/20 p-4 rounded-xl border text-center">
                          <p className="text-2xl font-bold font-display">{formatINR(totalSpent)}</p>
                          <p className="text-xs text-muted-foreground uppercase font-medium mt-1">Total Spent</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="bookings" className="m-0 outline-none flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg">Booking History</h3>
                      <Link to="/crm/bookings" search={{ customer: selectedCustomer.phone || selectedCustomer.name }} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                        <Plus className="h-4 w-4 mr-2" /> Add Booking
                      </Link>
                    </div>
                    {(() => {
                      if (custBookings.length === 0) {
                        return (
                          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-card rounded-xl border border-dashed">
                            <History className="h-12 w-12 mb-4 opacity-50" />
                            <p>No booking history found.</p>
                          </div>
                        );
                      }
                      return (
                        <div className="space-y-3">
                          {custBookings.map((b: any) => (
                            <div key={b.id} className="bg-card border border-border p-4 rounded-xl shadow-sm flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-sm">{b.package || b.bookingType}</h4>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {b.id} • {b.bookingDate}
                                  {b.supplier ? ` • ${b.supplier}` : ""}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-display font-bold text-primary">{formatINR(b.amount)}</p>
                                <span className={`inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                                  b.status === "Confirmed" || b.status === "Completed" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                                }`}>{b.status}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </TabsContent>

                  <TabsContent value="payments" className="m-0 outline-none flex flex-col h-full">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-lg">Payment History</h3>
                      <Link to="/crm/payments" search={{ customer: selectedCustomer.phone || selectedCustomer.name }} className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-4 py-2">
                        <Plus className="h-4 w-4 mr-2" /> Add Payment
                      </Link>
                    </div>
                     {(() => {
                      if (custBookings.length === 0) {
                        return (
                          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-card rounded-xl border border-dashed">
                            <IndianRupee className="h-12 w-12 mb-4 opacity-50" />
                            <p>No payment history found.</p>
                          </div>
                        );
                      }
                      return (
                        <div className="space-y-3">
                          {custBookings.map((b: any) => (
                            <div key={b.id + 'pay'} className="bg-card border border-border p-4 rounded-xl shadow-sm flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-sm">Payment for {b.id}</h4>
                                <p className="text-xs text-muted-foreground mt-1">Via {b.paymentMode || "Unknown"} • {b.transactionId || "No TXN ID"}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-display font-bold text-emerald-600">{formatINR(b.paid)}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">Out of {formatINR(b.amount)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </TabsContent>

                  <TabsContent value="leads" className="m-0 outline-none">
                     {(() => {
                      if (custLeads.length === 0) {
                        return (
                          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-card rounded-xl border border-dashed">
                            <MessageSquare className="h-12 w-12 mb-4 opacity-50" />
                            <p>No leads associated with this customer.</p>
                          </div>
                        );
                      }
                      return (
                        <div className="space-y-3">
                          {custLeads.map(l => (
                            <div key={l.id} className="bg-card border border-border p-4 rounded-xl shadow-sm flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-sm">{l.destination || l.service}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{l.id} • Created on {l.createdAt}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-display font-bold">{formatINR(l.budget || l.totalAmount || 0)}</p>
                                <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md bg-secondary text-muted-foreground">
                                  {l.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </TabsContent>

                  <TabsContent value="tasks" className="m-0 outline-none">
                     {(() => {
                      if (custTasks.length === 0) {
                        return (
                          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground bg-card rounded-xl border border-dashed">
                            <CheckSquare className="h-12 w-12 mb-4 opacity-50" />
                            <p>No tasks associated with this customer.</p>
                          </div>
                        );
                      }
                      return (
                        <div className="space-y-3">
                          {custTasks.map((t: any) => (
                            <div key={t.id} className="bg-card border border-border p-4 rounded-xl shadow-sm flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-sm">{t.title}</h4>
                                <p className="text-xs text-muted-foreground mt-1">Due {t.due_date} • Priority: {t.priority}</p>
                              </div>
                              <div className="text-right">
                                <span className={`inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-md ${
                                  t.status === "Completed" ? "bg-emerald-100 text-emerald-700" :
                                  t.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                                  "bg-amber-100 text-amber-700"
                                }`}>
                                  {t.status}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </TabsContent>
                </div>
              </Tabs>
              );
              })()}
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={dialogType === "delete"} onOpenChange={(val) => !val && setDialogType(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" />
              Delete Customer
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{selectedCustomer?.name}</strong>? This
              action will remove them from the database permanently.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancel</Button>
            <Button variant="destructive" onClick={() => {
              if (selectedCustomer) {
                setCustomerList(customerList.filter((c) => c.id !== selectedCustomer.id));
              }
              setDialogType(null);
            }}>
              Yes, delete customer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
