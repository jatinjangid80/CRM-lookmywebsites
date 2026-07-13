import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Plus, Search, MapPin, Download, MoreVertical, Edit2, Trash2, Eye, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { Vendor } from "@/types/supabase";
import { ImportModal } from "@/components/ImportModal";

export const Route = createFileRoute("/crm/vendors")({ component: VendorsPage });

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

const VENDOR_TYPES = [
  "Hotel", "Flight", "Visa", "Holiday Package", "Transport",
  "Bus", "Train", "Cruise", "Forex",
  "Activity", "Tour Guide", "DMC", "Car Rental", "Other",
];

const vendorTypeColor: Record<string, string> = {
  Hotel: "bg-sky-100 text-sky-700 border-sky-200",
  Flight: "bg-blue-100 text-blue-700 border-blue-200",
  Visa: "bg-purple-100 text-purple-700 border-purple-200",
  "Holiday Package": "bg-emerald-100 text-emerald-700 border-emerald-200",
  Transport: "bg-orange-100 text-orange-700 border-orange-200",
  Bus: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Train: "bg-teal-100 text-teal-700 border-teal-200",
  Cruise: "bg-cyan-100 text-cyan-700 border-cyan-200",
  Forex: "bg-green-100 text-green-700 border-green-200",

  Activity: "bg-amber-100 text-amber-700 border-amber-200",
  "Tour Guide": "bg-lime-100 text-lime-700 border-lime-200",
  DMC: "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Car Rental": "bg-slate-100 text-slate-700 border-slate-200",
  Other: "bg-gray-100 text-gray-700 border-gray-200",
};

function VendorsPage() {
  const [vendors, setVendors] = useSupabaseTable<Vendor[]>("vendors", []);

  // Search & Filters
  const [q, setQ] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterCity, setFilterCity] = useState("All");

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"add" | "edit" | "view" | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [form, setForm] = useState<Partial<Vendor>>({
    vendor_name: "", contact_person: "", phone: "", email: "",
    website: "", city: "", vendor_type: "Hotel", bank_name: "", account_number: "", ifsc: "", upi: ""
  });

  const uniqueCities = useMemo(() => Array.from(new Set(vendors.map((v) => v.city).filter(Boolean) as string[])), [vendors]);

  const filtered = useMemo(() => {
    return vendors.filter((v) => {
      const sq = q.toLowerCase();
      return (
        (filterType === "All" || v.vendor_type === filterType) &&
        (filterCity === "All" || v.city === filterCity) &&
        (!sq ||
          (v.vendor_name || "").toLowerCase().includes(sq) ||
          (v.contact_person || "").toLowerCase().includes(sq) ||
          (v.phone || "").includes(sq) ||
          (v.email || "").toLowerCase().includes(sq) ||
          (v.city || "").toLowerCase().includes(sq))
      );
    });
  }, [vendors, q, filterType, filterCity]);

  const handleImportData = (data: any[]) => {
    let maxId = vendors.reduce((acc, v) => {
      const num = parseInt((v.id || "").replace("VND", ""));
      return !isNaN(num) && num > acc ? num : acc;
    }, 0);

    const newVendors: Vendor[] = [];
    for (const row of data) {
      // Find matching keys case-insensitively
      const getVal = (possibleKeys: string[]) => {
        const key = Object.keys(row).find(k => possibleKeys.some(pk => k.toLowerCase().includes(pk)));
        return key ? String(row[key]) : "";
      };

      const vendor_name = getVal(['vendor name', 'name']);
      if (!vendor_name) continue;

      maxId++;
      const newId = `VND${String(maxId).padStart(3, "0")}`;

      newVendors.push({
        id: newId,
        vendor_name,
        contact_person: getVal(['contact person', 'contact']),
        phone: getVal(['mobile number', 'phone', 'mobile']),
        email: getVal(['email id', 'email']),
        website: getVal(['website', 'web']),
        city: getVal(['office city', 'city', 'place']),
        vendor_type: getVal(['vendor type', 'type']) || "Other",
        bank_name: "", account_number: "", ifsc: "", upi: "",
        created_at: new Date().toISOString()
      });
    }

    if (newVendors.length > 0) {
      setVendors([...newVendors, ...vendors]);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.vendor_name) return;

    if (dialogType === "edit" && selectedVendor) {
      setVendors((prev) => prev.map((v) => v.id === selectedVendor.id ? { ...v, ...form } as Vendor : v));
      setDialogType(null);
      return;
    }

    const maxId = vendors.reduce((acc, v) => {
      const num = parseInt((v.id || "").replace("VND", ""));
      return !isNaN(num) && num > acc ? num : acc;
    }, 0);
    const newId = `VND${String(maxId + 1).padStart(3, "0")}`;

    const newVendor: Vendor = {
      id: newId,
      vendor_name: form.vendor_name || "",
      contact_person: form.contact_person || "",
      phone: form.phone || "",
      email: form.email || "",
      website: form.website || "",
      city: form.city || "",
      vendor_type: form.vendor_type || "Hotel",
      bank_name: form.bank_name || "",
      account_number: form.account_number || "",
      ifsc: form.ifsc || "",
      upi: form.upi || "",
      created_at: new Date().toISOString(),
    };

    setVendors([newVendor, ...vendors]);
    setIsAddOpen(false);
    setForm({ vendor_name: "", contact_person: "", phone: "", email: "", website: "", city: "", vendor_type: "Hotel", bank_name: "", account_number: "", ifsc: "", upi: "" });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Vendors</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage service providers, DMCs, and suppliers.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsImportOpen(true)}>
            <Download className="w-4 h-4 mr-2" /> Import
          </Button>

          <ImportModal 
            isOpen={isImportOpen} 
            onClose={() => setIsImportOpen(false)} 
            onImport={handleImportData} 
            title="Import Vendors" 
            subtitle="Strictly import vendors using the official template format."
            templateUrl="/Vendor_Import_Template.xlsx"
          />

          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setDialogType("add"); setForm({ vendor_name: "", contact_person: "", phone: "", email: "", website: "", city: "", vendor_type: "Hotel" }); }}>
                <Plus className="w-4 h-4 mr-2" /> Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader><DialogTitle>{dialogType === "edit" ? "Edit Vendor" : dialogType === "view" ? "Vendor Details" : "Add Vendor"}</DialogTitle></DialogHeader>
              {dialogType === "view" ? (
                <div className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto">
                   <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-muted-foreground">Vendor Name</p><p className="font-medium">{selectedVendor?.vendor_name}</p></div>
                      <div><p className="text-muted-foreground">Vendor Type</p><p className="font-medium">{selectedVendor?.vendor_type}</p></div>
                      <div><p className="text-muted-foreground">Contact Person</p><p className="font-medium">{selectedVendor?.contact_person || "-"}</p></div>
                      <div><p className="text-muted-foreground">Phone</p><p className="font-medium">{selectedVendor?.phone || "-"}</p></div>
                      <div><p className="text-muted-foreground">Email</p><p className="font-medium">{selectedVendor?.email || "-"}</p></div>
                      <div><p className="text-muted-foreground">Website</p><p className="font-medium">{selectedVendor?.website || "-"}</p></div>
                      <div><p className="text-muted-foreground">City</p><p className="font-medium">{selectedVendor?.city || "-"}</p></div>
                   </div>
                   <h4 className="font-semibold text-sm mt-4 border-t pt-4">Bank Details</h4>
                   <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-muted-foreground">Bank Name</p><p className="font-medium">{selectedVendor?.bank_name || "-"}</p></div>
                      <div><p className="text-muted-foreground">Account Number</p><p className="font-medium">{selectedVendor?.account_number || "-"}</p></div>
                      <div><p className="text-muted-foreground">IFSC</p><p className="font-medium">{selectedVendor?.ifsc || "-"}</p></div>
                      <div><p className="text-muted-foreground">UPI ID</p><p className="font-medium">{selectedVendor?.upi || "-"}</p></div>
                   </div>
                </div>
              ) : (
                <form onSubmit={handleSave} className="space-y-4 pt-4 max-h-[70vh] overflow-y-auto">
                  <div className="space-y-2"><Label>Vendor / Company Name</Label><Input value={form.vendor_name} onChange={(e) => setForm({...form, vendor_name: e.target.value})} required /></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Vendor Type</Label>
                      <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={form.vendor_type || ""} onChange={(e) => setForm({...form, vendor_type: e.target.value})}>
                        {VENDOR_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2"><Label>City</Label><Input value={form.city || ""} onChange={(e) => setForm({...form, city: e.target.value})} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Contact Person</Label><Input value={form.contact_person || ""} onChange={(e) => setForm({...form, contact_person: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Phone</Label><Input value={form.phone || ""} onChange={(e) => setForm({...form, phone: e.target.value})} /></div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email || ""} onChange={(e) => setForm({...form, email: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Website</Label><Input value={form.website || ""} onChange={(e) => setForm({...form, website: e.target.value})} /></div>
                  </div>
                  
                  <h4 className="font-semibold text-sm mt-4">Bank Details (for payments)</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2"><Label>Bank Name</Label><Input value={form.bank_name || ""} onChange={(e) => setForm({...form, bank_name: e.target.value})} /></div>
                    <div className="space-y-2"><Label>Account Number</Label><Input value={form.account_number || ""} onChange={(e) => setForm({...form, account_number: e.target.value})} /></div>
                    <div className="space-y-2"><Label>IFSC</Label><Input value={form.ifsc || ""} onChange={(e) => setForm({...form, ifsc: e.target.value})} /></div>
                    <div className="space-y-2"><Label>UPI ID</Label><Input value={form.upi || ""} onChange={(e) => setForm({...form, upi: e.target.value})} /></div>
                  </div>
  
                  <Button type="submit" className="w-full">Save Vendor</Button>
                </form>
              )}
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
              placeholder="Search vendor, contact, phone..."
              className="pl-9 rounded-xl h-10"
            />
          </div>

          <div className="flex-shrink-0">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="appearance-none h-10 w-[240px] rounded-full border border-[#e4d4c8] bg-white px-5 py-2 text-sm font-semibold text-[#1e293b] focus:outline-none focus:ring-1 focus:ring-[#863711]/20 cursor-pointer hover:bg-[#fafafa] transition-colors"
              style={{
                backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%231e293b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 16px center',
                backgroundSize: '16px'
              }}
            >
              {["All", ...VENDOR_TYPES].map((t) => (
                <option key={t} value={t}>
                  {t === "All" ? "All Types" : t} ({t === "All" ? vendors.length : vendors.filter(v => v.vendor_type === t).length})
                </option>
              ))}
            </select>
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
              {["All", ...uniqueCities].map((c) => (
                <option key={c} value={c}>
                  {c === "All" ? "All Cities" : c} ({c === "All" ? vendors.length : vendors.filter(v => v.city === c).length})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground sm:ml-auto">
            {filtered.length} vendors
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((v) => (
          <div key={v.id} className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:border-primary/50 cursor-pointer transition-colors" onClick={() => { setSelectedVendor(v); setForm(v); setDialogType("view"); setIsAddOpen(true); }}>
            <div className="flex justify-between items-start mb-3">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-2xl border flex items-center justify-center shrink-0 ${getAvatarColor(v.vendor_name)}`}>
                  <span className="font-semibold text-lg">{initials(v.vendor_name)}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{v.vendor_name}</h3>
                  <p className="text-xs text-muted-foreground">{v.id}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8 text-muted-foreground"><MoreVertical className="w-4 h-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setSelectedVendor(v); setForm(v); setDialogType("edit"); setIsAddOpen(true); }}><Edit2 className="w-4 h-4 mr-2" /> Edit Details</DropdownMenuItem>
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setVendors(vendors.filter(vendor => vendor.id !== v.id)); }} className="text-red-600"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="mb-3">
              <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium border ${vendorTypeColor[v.vendor_type || "Other"] || vendorTypeColor["Other"]}`}>
                {v.vendor_type}
              </span>
            </div>
            <div className="space-y-2 text-sm text-muted-foreground mb-4">
              <p>👤 {v.contact_person}</p>
              <p>📞 {v.phone}</p>
              <p>📍 {v.city}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
