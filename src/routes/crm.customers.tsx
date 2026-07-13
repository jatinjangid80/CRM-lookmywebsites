import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, Search, MapPin, Download, MoreVertical, History, IndianRupee, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { ImportModal } from "@/components/ImportModal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatINR } from "@/lib/mock-data";
import { Customer, Booking } from "@/types/supabase";
import { CustomerPayment } from "@/types/customerPayment";
import { format } from "date-fns";

function initials(n: string) {
  if (!n) return "";
  return n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  "bg-blue-100 text-blue-600 border-blue-200",
  "bg-purple-100 text-purple-600 border-purple-200",
  "bg-green-100 text-green-600 border-green-200",
  "bg-orange-100 text-orange-600 border-orange-200",
  "bg-pink-100 text-pink-600 border-pink-200",
  "bg-indigo-100 text-indigo-600 border-indigo-200",
  "bg-rose-100 text-rose-600 border-rose-200",
  "bg-teal-100 text-teal-600 border-teal-200"
];

function getAvatarColor(name: string) {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export const Route = createFileRoute("/crm/customers")({
  component: CustomersPage,
});

function CustomersPage() {
  const [customerList, setCustomerList] = useSupabaseTable<Customer[]>("customers", []);
  const [bookings] = useSupabaseTable<Booking[]>("bookings", []);
  const [payments] = useSupabaseTable<CustomerPayment[]>("customer_payments", []);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({ 
    customer_name: "", phone: "", email: "", address: "", reference_name: "" 
  });

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [dialogType, setDialogType] = useState<"profile" | "delete" | "edit" | null>(null);

  // Filters & Search
  const [q, setQ] = useState("");
  const [filterCity, setFilterCity] = useState("All");

  const cities = Array.from(new Set(customerList.map((c) => c.address).filter(Boolean) as string[]));

  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.customer_name || !newCustomer.phone) return;

    if (dialogType === "edit" && selectedCustomer) {
      setCustomerList((prev) =>
        prev.map((c) => (c.id === selectedCustomer.id ? { ...c, ...newCustomer } as Customer : c))
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
      const num = parseInt((c.id || "").replace("CRN", ""));
      return !isNaN(num) && num > max ? num : max;
    }, 0);
    const nextId = `CRN${String(currentMaxId + 1).padStart(3, "0")}`;

    const customer: Customer = {
      id: nextId,
      customer_name: newCustomer.customer_name || "",
      phone: newCustomer.phone || "",
      email: newCustomer.email || "",
      address: newCustomer.address || "",
      reference_name: newCustomer.reference_name || "",
      created_at: new Date().toISOString(),
    };

    setCustomerList([customer, ...customerList]);
    setIsAddOpen(false);
    setNewCustomer({ customer_name: "", phone: "", email: "", address: "", reference_name: "" });
  };

  const handleImportData = (data: any[]) => {
    let maxId = customerList.reduce((acc, c) => {
      const num = parseInt((c.id || "").replace("CRN", ""));
      return !isNaN(num) && num > acc ? num : acc;
    }, 0);

    const newCustomers: Customer[] = [];
    for (const row of data) {
      const getVal = (possibleKeys: string[]) => {
        const key = Object.keys(row).find(k => possibleKeys.some(pk => k.toLowerCase().includes(pk)));
        return key ? String(row[key]) : "";
      };

      const customer_name = getVal(['customer name', 'name', 'customer']);
      if (!customer_name) continue;

      maxId++;
      const newId = `CRN${String(maxId).padStart(3, "0")}`;

      newCustomers.push({
        id: newId,
        customer_name,
        phone: getVal(['mobile number', 'phone', 'mobile']),
        email: getVal(['email id', 'email']),
        address: getVal(['city', 'address', 'place']),
        reference_name: getVal(['reference name', 'reference', 'ref']),
        created_at: new Date().toISOString()
      });
    }

    if (newCustomers.length > 0) {
      setCustomerList([...newCustomers, ...customerList]);
    }
  };

  const exportToCSV = () => {
    const headers = [
      "Customer ID",
      "Customer Name",
      "Email Address",
      "Mobile Number",
      "Reference Name",
      "City",
      "Created Date",
    ].join(",");

    const rows = filtered.map((c) =>
      [
        c.id,
        `"${c.customer_name}"`,
        `"${c.email}"`,
        `"${c.phone}"`,
        `"${c.reference_name || ""}"`,
        `"${c.address || ""}"`,
        c.created_at,
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
        (filterCity === "All" || c.address === filterCity) &&
        (q === "" ||
          (c.customer_name || "").toLowerCase().includes(q.toLowerCase()) ||
          (c.phone || "").includes(q) ||
          (c.email || "").toLowerCase().includes(q.toLowerCase()) ||
          (c.reference_name || "").toLowerCase().includes(q.toLowerCase()) ||
          (c.address || "").toLowerCase().includes(q.toLowerCase()))
    ).sort((a, b) => {
      const numA = parseInt((a.id || "").replace(/\D/g, "")) || 0;
      const numB = parseInt((b.id || "").replace(/\D/g, "")) || 0;
      return numA - numB;
    });
  }, [customerList, filterCity, q]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Customers</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your entire customer database, view history, and track loyalty.
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => setIsImportOpen(true)}>
            <Download className="w-4 h-4 mr-2" /> Import
          </Button>

          <ImportModal 
            isOpen={isImportOpen} 
            onClose={() => setIsImportOpen(false)} 
            onImport={handleImportData} 
            title="Import Customers" 
            subtitle="Strictly import customers using the official template format."
            templateUrl="/Customer_Import_Template.xlsx"
          />

          <Button variant="outline" className="gap-2" onClick={exportToCSV}>
            <Download className="w-4 h-4" /> Export
          </Button>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm w-full sm:w-auto">
                <Plus className="w-4 h-4" /> Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSaveCustomer} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Customer Name</Label>
                  <Input value={newCustomer.customer_name} onChange={(e) => setNewCustomer({ ...newCustomer, customer_name: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <Input value={newCustomer.phone || ""} onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" value={newCustomer.email || ""} onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>City / Address</Label>
                  <Input value={newCustomer.address || ""} onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Reference</Label>
                  <Input value={newCustomer.reference_name || ""} onChange={(e) => setNewCustomer({ ...newCustomer, reference_name: e.target.value })} />
                </div>
                <Button type="submit" className="w-full">Save Customer</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, phone, email..."
              className="pl-9 rounded-xl h-10"
            />
          </div>
          
          <div className="flex-shrink-0">
            <select
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="appearance-none h-10 w-[240px] rounded-full border border-[#e4d4c8] bg-white px-5 py-2 text-sm font-semibold text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#863711]/20 cursor-pointer hover:bg-[#fafafa] transition-colors"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231e293b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                backgroundSize: '16px'
              }}
            >
              {["All", ...cities].map((c) => (
                <option key={c} value={c}>
                  {c} ({c === "All" ? customerList.length : customerList.filter(cust => cust.address === c).length})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground sm:ml-auto">
            {filtered.length} customers
          </div>
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((c) => (
          <div key={c.id} className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center shrink-0 ${getAvatarColor(c.customer_name)}`}>
                  <span className="font-semibold text-lg">{initials(c.customer_name)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{c.customer_name}</h3>
                  <p className="text-xs text-muted-foreground">{c.id}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8 text-muted-foreground">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => { setSelectedCustomer(c); setDialogType("profile"); }}>View Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSelectedCustomer(c); setNewCustomer(c); setDialogType("edit"); }}>Edit Details</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <p>📞 {c.phone}</p>
              {c.email && <p>✉️ {c.email}</p>}
              {c.address && <p>📍 {c.address}</p>}
            </div>
            <Button variant="outline" className="w-full" size="sm" onClick={() => { setSelectedCustomer(c); setDialogType("profile"); }}>View History</Button>
          </div>
        ))}
      </div>

      {/* Dialog for Profile / Edit */}
      <Dialog open={dialogType === "profile"} onOpenChange={(v) => !v && setDialogType(null)}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto p-0">
          {selectedCustomer && (
            <div className="bg-card">
              <div className="p-6 border-b border-border bg-muted/30">
                <h2 className="text-2xl font-bold font-display">{selectedCustomer.customer_name}</h2>
                <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedCustomer.address || "No City"}</span>
                  <span>•</span>
                  <span>{selectedCustomer.id}</span>
                </div>
              </div>

              <div className="p-6">
                <Tabs defaultValue="info" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-6 bg-muted/50 p-1 rounded-xl">
                    <TabsTrigger value="info" className="rounded-lg">Info</TabsTrigger>
                    <TabsTrigger value="bookings" className="rounded-lg">Bookings</TabsTrigger>
                    <TabsTrigger value="payments" className="rounded-lg">Payments</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="info" className="space-y-6 m-0 outline-none">
                    <div className="grid grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl border border-border/50">
                      <div><p className="text-muted-foreground text-xs mb-1">Phone</p><p className="font-medium">{selectedCustomer.phone}</p></div>
                      <div><p className="text-muted-foreground text-xs mb-1">Email</p><p className="font-medium">{selectedCustomer.email || "-"}</p></div>
                      <div><p className="text-muted-foreground text-xs mb-1">Reference</p><p className="font-medium">{selectedCustomer.reference_name || "-"}</p></div>
                      <div><p className="text-muted-foreground text-xs mb-1">Created At</p><p className="font-medium">{selectedCustomer.created_at?.slice(0,10)}</p></div>
                    </div>
                  </TabsContent>

                  <TabsContent value="bookings" className="m-0 outline-none">
                    {(() => {
                      const custBookings = bookings.filter(b => b.customer_id === selectedCustomer.id);
                      if (custBookings.length === 0) return <div className="text-center py-8 text-muted-foreground">No bookings found.</div>;
                      return (
                        <div className="space-y-3">
                          {custBookings.map(b => (
                            <div key={b.id} className="border p-3 rounded-lg flex justify-between items-center">
                              <div><h4 className="font-semibold">{b.booking_no || b.id}</h4><p className="text-xs text-muted-foreground">{b.created_at?.slice(0,10)}</p></div>
                              <div className="text-right"><p className="font-bold text-primary">{formatINR(b.booking_amount)}</p><span className="text-[10px] bg-slate-100 px-2 rounded">{b.booking_status}</span></div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </TabsContent>

                  <TabsContent value="payments" className="m-0 outline-none">
                    {(() => {
                      const custBookings = bookings.filter(b => b.customer_id === selectedCustomer.id);
                      const bookingIds = custBookings.map(b => b.id);
                      const custPayments = payments.filter(p => p.booking_id && bookingIds.includes(p.booking_id));
                      
                      if (custPayments.length === 0) return <div className="text-center py-8 text-muted-foreground">No payments found.</div>;
                      return (
                        <div className="space-y-3">
                          {custPayments.map(p => (
                            <div key={p.id} className="border p-3 rounded-lg flex justify-between items-center">
                              <div><h4 className="font-semibold">Payment via {p.payment_mode}</h4><p className="text-xs text-muted-foreground">{p.transaction_id || "-"}</p></div>
                              <div className="text-right"><p className="font-bold text-emerald-600">{formatINR(p.amount)}</p></div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
