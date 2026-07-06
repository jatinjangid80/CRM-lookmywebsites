import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, Trash2, Wallet, Search, Filter, Download, User, MoreVertical, FileText, IndianRupee, MessageSquare, History } from "lucide-react";
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
import { bookings, formatINR, Customer as BaseCustomer } from "@/lib/mock-data";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { ImportCustomersModal } from "@/components/ui/import-customers-modal";
import { getAuth } from "@/lib/auth";
import { INITIAL_EMPLOYEES } from "./crm.employees";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
  const [localEmployees] = useSupabaseTable<any[]>("employees", INITIAL_EMPLOYEES);
  
  const employees = localEmployees?.length ? localEmployees : INITIAL_EMPLOYEES;
  const auth = getAuth();
  const assignees = Array.from(new Set([...employees.map((e) => e.name), ...(auth?.name ? [auth.name] : []), "Unassigned"]));

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  
  const [newCustomer, setNewCustomer] = useState<Partial<ExtCustomer>>({ 
    name: "", phone: "", email: "", status: "Active", source: "Website", assignedTo: "Unassigned" 
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
    );
  }, [customerList, filterStatus, filterCity, filterAssignee, q]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
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
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, email, reference or city..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setCurrentPage(1); }}
            className="pl-9 bg-card border-border shadow-sm h-10 rounded-xl"
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0">
          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[140px] bg-card shadow-sm h-10 rounded-xl">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              {CUSTOMER_STATUSES.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {cities.length > 0 && (
            <Select value={filterCity} onValueChange={(v) => { setFilterCity(v); setCurrentPage(1); }}>
              <SelectTrigger className="w-[140px] bg-card shadow-sm h-10 rounded-xl">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Cities</SelectItem>
                {cities.map((s) => (
                  <SelectItem key={s as string} value={s as string}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={filterAssignee} onValueChange={(v) => { setFilterAssignee(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-[160px] bg-card shadow-sm h-10 rounded-xl">
              <SelectValue placeholder="Assigned To" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Employees</SelectItem>
              {assignees.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-secondary/50 text-muted-foreground sticky top-0 z-10 border-b border-border">
              <tr>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Customer Info</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Contact</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap">Location / Details</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap text-right">Performance</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap text-center">Status</th>
                <th className="px-4 py-3 font-semibold whitespace-nowrap text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-muted-foreground">
                    No customers found matching your criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm shrink-0 border border-primary/20">
                          {c.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-foreground">{c.name}</div>
                          <div className="text-xs text-muted-foreground font-mono">{c.id}</div>
                          {c.company && <div className="text-xs text-muted-foreground mt-0.5">{c.company}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium">{c.phone}</div>
                      <div className="text-xs text-muted-foreground break-all">{c.email || "No email"}</div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="text-sm">{c.city || "-"}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        Ref: {c.reference || "-"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Assigned: {c.assignedTo || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top text-right">
                      <div className="font-display font-bold text-primary">{formatINR(c.totalSpend)}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{c.trips} {c.trips === 1 ? 'Booking' : 'Bookings'}</div>
                    </td>
                    <td className="px-4 py-3 align-top text-center">
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="px-4 py-3 align-top text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-50 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 rounded-xl">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCustomer(c);
                              setDialogType("profile");
                            }}
                          >
                            <User className="mr-2 h-4 w-4" /> View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedCustomer(c);
                              setNewCustomer(c);
                              setDialogType("edit");
                            }}
                          >
                            <FileText className="mr-2 h-4 w-4" /> Edit Customer
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            onClick={() => {
                              setSelectedCustomer(c);
                              setDialogType("delete");
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-secondary/20">
            <p className="text-xs text-muted-foreground font-medium">
              Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} customers
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="h-8 rounded-lg shadow-sm"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="h-8 rounded-lg shadow-sm"
              >
                Next
              </Button>
            </div>
          </div>
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
              <Input id="name" placeholder="e.g. jatin jangid" required value={newCustomer.name || ""} onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })} />
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
            <div className="space-y-2 col-span-2">
              <Label htmlFor="assignedTo">Assigned Employee</Label>
              <Select value={newCustomer.assignedTo || "Unassigned"} onValueChange={(v) => setNewCustomer({ ...newCustomer, assignedTo: v })}>
                <SelectTrigger id="assignedTo"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {assignees.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
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
              <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-card">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-2xl border border-primary/20">
                      {selectedCustomer.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-display">{selectedCustomer.name}</DialogTitle>
                      <DialogDescription className="mt-1 flex items-center gap-2">
                        <span className="font-mono text-xs bg-secondary px-2 py-0.5 rounded-md">{selectedCustomer.id}</span>
                        <span>•</span>
                        <span>{selectedCustomer.phone}</span>
                        {selectedCustomer.email && (
                          <>
                            <span>•</span>
                            <span>{selectedCustomer.email}</span>
                          </>
                        )}
                      </DialogDescription>
                    </div>
                  </div>
                  <StatusBadge status={selectedCustomer.status} />
                </div>
              </DialogHeader>

              <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
                <div className="px-6 border-b border-border bg-card/50">
                  <TabsList className="h-12 bg-transparent gap-6">
                    <TabsTrigger value="overview" className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-2 text-sm">
                      Overview
                    </TabsTrigger>
                    <TabsTrigger value="bookings" className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-2 text-sm">
                      Booking History
                    </TabsTrigger>
                    <TabsTrigger value="payments" className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-2 text-sm">
                      Payment History
                    </TabsTrigger>
                    <TabsTrigger value="leads" className="data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none border-b-2 border-transparent rounded-none px-2 text-sm">
                      Leads
                    </TabsTrigger>
                  </TabsList>
                </div>

                <div className="flex-1 overflow-y-auto p-6 bg-secondary/10">
                  <TabsContent value="overview" className="m-0 space-y-6 outline-none">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-card border border-border rounded-xl p-4 shadow-sm text-center">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Spend</p>
                        <p className="text-2xl font-bold font-display mt-1 text-primary">{formatINR(selectedCustomer.totalSpend)}</p>
                      </div>
                      <div className="bg-card border border-border rounded-xl p-4 shadow-sm text-center">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Bookings</p>
                        <p className="text-2xl font-bold font-display mt-1">{selectedCustomer.trips}</p>
                      </div>
                      <div className="bg-card border border-border rounded-xl p-4 shadow-sm text-center">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer Since</p>
                        <p className="text-xl font-bold font-display mt-2">{selectedCustomer.createdAt}</p>
                      </div>
                    </div>

                    <div className="bg-card border border-border rounded-xl shadow-sm p-5">
                      <h3 className="font-semibold mb-4 text-sm uppercase tracking-wider text-muted-foreground">Demographics & Details</h3>
                      <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Company / Organization</p>
                          <p className="font-medium">{selectedCustomer.company || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">City</p>
                          <p className="font-medium">{selectedCustomer.city || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Lead Source</p>
                          <p className="font-medium">{selectedCustomer.source || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Referred By</p>
                          <p className="font-medium">{selectedCustomer.reference || "-"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Assigned Employee</p>
                          <p className="font-medium">{selectedCustomer.assignedTo || "Unassigned"}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground text-xs mb-1">Last Booking Date</p>
                          <p className="font-medium">{selectedCustomer.lastBookingDate || "-"}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="bookings" className="m-0 outline-none">
                    {(() => {
                      // Filter derived bookings implicitly by matching customer phone
                      // Wait, we need real bookings, not just hardcoded.
                      // Currently `bookings` is just the mock data, we don't have useSupabaseTable for bookings in customers page.
                      // Let's use the local mock `bookings` array for demonstration, matching by customer name or phone.
                      const custBookings = bookings.filter(b => b.customer === selectedCustomer.name || b.mobileNumber === selectedCustomer.phone);
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
                          {custBookings.map(b => (
                            <div key={b.id} className="bg-card border border-border p-4 rounded-xl shadow-sm flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-sm">{b.package || b.bookingType}</h4>
                                <p className="text-xs text-muted-foreground mt-1">{b.id} • {b.bookingDate}</p>
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

                  <TabsContent value="payments" className="m-0 outline-none">
                     {(() => {
                      const custBookings = bookings.filter(b => b.customer === selectedCustomer.name || b.mobileNumber === selectedCustomer.phone);
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
                          {custBookings.map(b => (
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
                      const custLeads = leads.filter(l => l.phone === selectedCustomer.phone);
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
                </div>
              </Tabs>
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
