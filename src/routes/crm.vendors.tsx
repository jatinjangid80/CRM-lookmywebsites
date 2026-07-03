import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  X,
  MapPin,
  IndianRupee,
  Phone,
  Mail,
  Star,
  Trash2,
  Edit2,
  Check,
  Filter,
  LayoutGrid,
  Table2,
  Info,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";

export const Route = createFileRoute("/crm/vendors")({ component: VendorsPage });

type VendorCategory =
  | "Hotel"
  | "Local DMC"
  | "Flight DMC"
  | "Transport DMC"
  | "Sightseeing Vendor"
  | "Other";
type VendorStatus = "Active" | "Inactive";

interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  contactPerson: string;
  email: string;
  phone: string;
  location: string;
  status: VendorStatus;
  balance: number; // outstanding balance
  rating: number;
  notes?: string;
}

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

function VendorsPage() {
  const [vendors, setVendors] = useSupabaseTable<Vendor[]>("vendors", []);

  // Search & Filter state
  const [q, setQ] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Modal states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // Form states for Add / Edit
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState<VendorCategory>("Hotel");
  const [formContact, setFormContact] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formStatus, setFormStatus] = useState<VendorStatus>("Active");
  const [formBalance, setFormBalance] = useState("0");
  const [formRating, setFormRating] = useState("5.0");
  const [formNotes, setFormNotes] = useState("");

  // Pay form state
  const [payAmount, setPayAmount] = useState("");

  const handleOpenAdd = () => {
    setFormName("");
    setFormCategory("Hotel");
    setFormContact("");
    setFormEmail("");
    setFormPhone("");
    setFormLocation("");
    setFormStatus("Active");
    setFormBalance("0");
    setFormRating("5.0");
    setFormNotes("");
    setIsAddOpen(true);
  };

  const handleAddVendor = () => {
    if (!formName || !formContact || !formPhone) {
      alert("Please fill name, contact person, and phone number.");
      return;
    }

    const newV: Vendor = {
      id: `VND-${String(Date.now()).slice(-4)}`,
      name: formName,
      category: formCategory,
      contactPerson: formContact,
      email: formEmail,
      phone: formPhone,
      location: formLocation,
      status: formStatus,
      balance: parseFloat(formBalance) || 0,
      rating: parseFloat(formRating) || 5.0,
      notes: formNotes,
    };

    setVendors([...vendors, newV]);
    setIsAddOpen(false);
  };

  const handleOpenEdit = (v: Vendor) => {
    setSelectedVendor(v);
    setFormName(v.name);
    setFormCategory(v.category);
    setFormContact(v.contactPerson);
    setFormEmail(v.email);
    setFormPhone(v.phone);
    setFormLocation(v.location);
    setFormStatus(v.status);
    setFormBalance(String(v.balance));
    setFormRating(String(v.rating));
    setFormNotes(v.notes || "");
    setIsEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!selectedVendor) return;

    const updated = vendors.map((v) =>
      v.id === selectedVendor.id
        ? {
            ...v,
            name: formName,
            category: formCategory,
            contactPerson: formContact,
            email: formEmail,
            phone: formPhone,
            location: formLocation,
            status: formStatus,
            balance: parseFloat(formBalance) || 0,
            rating: parseFloat(formRating) || 5.0,
            notes: formNotes,
          }
        : v,
    );

    setVendors(updated);
    setIsEditOpen(false);
  };

  const handleOpenPay = (v: Vendor) => {
    setSelectedVendor(v);
    setPayAmount("");
    setIsPayOpen(true);
  };

  const handlePay = () => {
    if (!selectedVendor || !payAmount) return;
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) {
      alert("Please enter a valid positive payment amount.");
      return;
    }

    const updated = vendors.map((v) =>
      v.id === selectedVendor.id
        ? {
            ...v,
            balance: Math.max(0, v.balance - amount),
          }
        : v,
    );

    setVendors(updated);
    setIsPayOpen(false);
  };

  const handleDeleteVendor = (id: string) => {
    if (confirm("Are you sure you want to delete this vendor?")) {
      setVendors(vendors.filter((v) => v.id !== id));
    }
  };

  // Filtered List
  const { filtered, totalOutstanding } = useMemo(() => {
    const f = vendors.filter((v) => {
      const searchStr = q.toLowerCase();
      const matchQ =
        !searchStr ||
        v.name.toLowerCase().includes(searchStr) ||
        v.contactPerson?.toLowerCase().includes(searchStr) ||
        v.location?.toLowerCase().includes(searchStr);
      const matchCat = categoryFilter === "All" || v.category === categoryFilter;
      const matchStat = statusFilter === "All" || v.status === statusFilter;
      return matchQ && matchCat && matchStat;
    });
    return { filtered: f, totalOutstanding: f.reduce((sum, v) => sum + v.balance, 0) };
  }, [vendors, q, categoryFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground font-display">
            Vendor Directory
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage suppliers, hotels, flight coordinators, and outstanding balances.
          </p>
        </div>
        <Button
          onClick={handleOpenAdd}
          className="bg-primary text-white hover:bg-primary/90 gap-1.5 rounded-xl text-xs font-semibold h-9 shadow-sm px-4"
        >
          <Plus className="h-4 w-4" /> Add New Vendor
        </Button>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Total Vendors", value: vendors.length, desc: "Registered suppliers" },
          {
            label: "Active Suppliers",
            value: vendors.filter((v) => v.status === "Active").length,
            desc: "Operational partners",
          },
          {
            label: "Outstanding Balance",
            value: formatINR(totalOutstanding),
            desc: "Total agency liability",
            highlight: true,
          },
          {
            label: "Highly Rated (>4.5★)",
            value: vendors.filter((v) => v.rating >= 4.5).length,
            desc: "Premium quality partners",
          },
        ].map((s) => (
          <div
            key={s.label}
            className={`rounded-2xl border p-5 shadow-sm bg-card text-card-foreground ${s.highlight ? "border-primary/30 ring-1 ring-primary/10" : "border-border"}`}
          >
            <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
              {s.label}
            </p>
            <p
              className={`text-2xl font-black mt-2 tracking-tight ${s.highlight ? "text-primary" : "text-foreground"}`}
            >
              {s.value}
            </p>
            <p className="text-[11px] text-muted-foreground mt-1.5">{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="bg-card text-card-foreground rounded-2xl border border-border p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, contact, email or city..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="pl-9 h-9 text-xs rounded-xl focus-visible:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-9 cursor-pointer appearance-none rounded-full border border-border bg-card text-card-foreground pl-4 pr-9 py-1.5 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%23111827%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1em_1em] bg-[right_1rem_center] bg-no-repeat"
            >
              <option value="All">All Categories</option>
              <option value="Hotel">Hotel</option>
              <option value="Local DMC">Local DMC</option>
              <option value="Flight DMC">Flight DMC</option>
              <option value="Transport DMC">Transport DMC</option>
              <option value="Sightseeing Vendor">Sightseeing Vendor</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 cursor-pointer appearance-none rounded-full border border-border bg-card text-card-foreground pl-4 pr-9 py-1.5 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%23111827%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1em_1em] bg-[right_1rem_center] bg-no-repeat"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-primary/5 text-primary text-xs font-bold border-b border-border">
              <tr>
                <th className="px-5 py-4">Vendor details</th>
                <th className="px-5 py-4">Category</th>
                <th className="px-5 py-4">Contact Info</th>
                <th className="px-5 py-4">Location</th>
                <th className="px-5 py-4">Rating</th>
                <th className="px-5 py-4">Outstanding Bal.</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-muted-foreground bg-card text-card-foreground">
              {filtered.map((v) => (
                <tr key={v.id} className="hover:bg-primary/10/5 transition-colors">
                  <td className="px-5 py-4 font-semibold text-foreground">
                    <div>
                      <p>{v.name}</p>
                      <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{v.id}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs font-medium">
                    <span className="bg-primary/15 text-primary px-2.5 py-0.5 rounded-full border border-primary/20">
                      {v.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground">{v.contactPerson}</p>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {v.email}
                      </p>
                      <p className="text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {v.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" /> {v.location}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <span className="inline-flex items-center gap-0.5 font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{" "}
                      {v.rating.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-sm font-bold text-foreground">
                    {formatINR(v.balance)}
                  </td>
                  <td className="px-5 py-4 text-xs">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        v.status === "Active"
                          ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                          : "bg-slate-50 border-slate-200 text-slate-500"
                      }`}
                    >
                      {v.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="icon"
                        title="Record Payment"
                        className="h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                        onClick={() => handleOpenPay(v)}
                      >
                        <CreditCard className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        title="Edit Details"
                        className="h-8 w-8 text-primary hover:text-primary/90 hover:bg-primary/5"
                        onClick={() => handleOpenEdit(v)}
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        title="Delete Vendor"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteVendor(v.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground">
                    No vendors found matching your current filter selection.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD MODAL */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-md bg-card text-card-foreground text-[#111827]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-display">
              Add New Supplier / Vendor
            </DialogTitle>
            <DialogDescription>Register a new travel agency service partner.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Vendor / Company Name *</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="h-8 text-xs focus-visible:ring-primary"
                placeholder="Address Beach Resort"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as VendorCategory)}
                  className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-xs"
                >
                  <option value="Hotel">Hotel</option>
                  <option value="Local DMC">Local DMC</option>
                  <option value="Flight DMC">Flight DMC</option>
                  <option value="Transport DMC">Transport DMC</option>
                  <option value="Sightseeing Vendor">Sightseeing Vendor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Contact Person *</label>
                <Input
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  className="h-8 text-xs"
                  placeholder="Sarah Jenkins"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Work Phone *</label>
                <Input
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="h-8 text-xs"
                  placeholder="+971 4 879 8888"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Email Address</label>
                <Input
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="h-8 text-xs"
                  placeholder="reservations@addressbeach.com"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Physical Location</label>
              <Input
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className="h-8 text-xs"
                placeholder="JBR, Dubai, UAE"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as VendorStatus)}
                  className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-xs"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Initial Balance (INR)</label>
                <Input
                  type="number"
                  value={formBalance}
                  onChange={(e) => setFormBalance(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Rating (1.0 - 5.0)</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formRating}
                  onChange={(e) => setFormRating(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Vendor Notes</label>
              <textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none"
                placeholder="Partner policies, banking details, or contract descriptions..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddOpen(false)}
              className="h-9 text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddVendor}
              className="bg-primary text-white hover:bg-primary/90 h-9 text-xs rounded-xl"
            >
              Save Supplier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* EDIT MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md bg-card text-card-foreground text-[#111827]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold font-display">
              Edit Vendor Profile
            </DialogTitle>
            <DialogDescription>Modify vendor credentials and default parameters.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2 text-xs">
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Vendor / Company Name *</label>
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="h-8 text-xs focus-visible:ring-primary"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Category</label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value as VendorCategory)}
                  className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-xs"
                >
                  <option value="Hotel">Hotel</option>
                  <option value="Local DMC">Local DMC</option>
                  <option value="Flight DMC">Flight DMC</option>
                  <option value="Transport DMC">Transport DMC</option>
                  <option value="Sightseeing Vendor">Sightseeing Vendor</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Contact Person *</label>
                <Input
                  value={formContact}
                  onChange={(e) => setFormContact(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Work Phone *</label>
                <Input
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Email Address</label>
                <Input
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Physical Location</label>
              <Input
                value={formLocation}
                onChange={(e) => setFormLocation(e.target.value)}
                className="h-8 text-xs"
              />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as VendorStatus)}
                  className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-xs"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Outstanding Balance (INR)</label>
                <Input
                  type="number"
                  value={formBalance}
                  onChange={(e) => setFormBalance(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-muted-foreground">Rating</label>
                <Input
                  type="number"
                  step="0.1"
                  value={formRating}
                  onChange={(e) => setFormRating(e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Notes</label>
              <textarea
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              className="h-9 text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              className="bg-primary text-white hover:bg-primary/90 h-9 text-xs rounded-xl"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* RECORD PAYMENT MODAL */}
      <Dialog open={isPayOpen} onOpenChange={setIsPayOpen}>
        <DialogContent className="max-w-sm bg-card text-card-foreground text-[#111827]">
          <DialogHeader>
            <DialogTitle className="text-base font-bold font-display flex items-center gap-1.5 text-emerald-600">
              <CreditCard className="h-5 w-5" /> Record Vendor Disbursement
            </DialogTitle>
            <DialogDescription>
              Record an outgoing payment to {selectedVendor?.name}. This will decrease their
              outstanding balance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2 text-xs">
            <div className="bg-gray-50 border border-gray-100 p-3 rounded-lg flex justify-between items-center">
              <div>
                <p className="text-[10px] text-muted-foreground font-semibold uppercase">
                  Current Balance
                </p>
                <p className="text-base font-black text-gray-800 mt-0.5">
                  {selectedVendor && formatINR(selectedVendor?.balance || 0)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-muted-foreground font-semibold uppercase">
                  Vendor Code
                </p>
                <p className="text-xs font-mono font-bold text-gray-500 mt-0.5">
                  {selectedVendor?.id}
                </p>
              </div>
            </div>
            <div className="space-y-1">
              <label className="font-bold text-muted-foreground">Payment Amount (INR) *</label>
              <Input
                type="number"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="h-9 text-xs focus-visible:ring-emerald-500"
                placeholder="Enter amount to pay..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPayOpen(false)}
              className="h-9 text-xs rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePay}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-xs rounded-xl font-bold"
            >
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
