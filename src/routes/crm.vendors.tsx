import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Trash2,
  Edit2,
  Download,
  MoreVertical,
  Phone,
  Mail,
  Globe,
  MapPin,
  Building2,
  Eye,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { ImportVendorsModal } from "@/components/ui/import-vendors-modal";
import * as XLSX from "xlsx";

export const Route = createFileRoute("/crm/vendors")({ component: VendorsPage });

// ── Types ────────────────────────────────────────────────────────────────────

export type VendorType =
  | "Hotel"
  | "Flight"
  | "Visa"
  | "Holiday Package"
  | "Transport"
  | "Bus"
  | "Train"
  | "Cruise"
  | "Forex"
  | "Travel Insurance"
  | "Activity"
  | "Tour Guide"
  | "DMC"
  | "Car Rental"
  | "Other";

export type VendorStatus = "Active" | "Inactive";

export interface VendorContact {
  name: string;
  mobile: string;
  email: string;
}

export interface Vendor {
  id: string;
  place: string;
  name: string;
  contactPerson: string;  // legacy — mirrors contacts[0].name
  mobile: string;         // legacy — mirrors contacts[0].mobile
  email: string;          // legacy — mirrors contacts[0].email
  website: string;
  officeCity: string;
  vendorType: VendorType;
  status: VendorStatus;
  createdAt: string;
  notes?: string;
  contacts?: VendorContact[];
}

const VENDOR_TYPES: VendorType[] = [
  "Hotel", "Flight", "Visa", "Holiday Package", "Transport",
  "Bus", "Train", "Cruise", "Forex", "Travel Insurance",
  "Activity", "Tour Guide", "DMC", "Car Rental", "Other",
];

const EMPTY_FORM: Partial<Vendor> = {
  place: "", name: "", contactPerson: "", mobile: "", email: "",
  website: "", officeCity: "", vendorType: "Hotel", status: "Active", notes: "",
  contacts: [{ name: "", mobile: "", email: "" }],
};

const EMPTY_CONTACT: VendorContact = { name: "", mobile: "", email: "" };

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
  "Travel Insurance": "bg-rose-100 text-rose-700 border-rose-200",
  Activity: "bg-amber-100 text-amber-700 border-amber-200",
  "Tour Guide": "bg-lime-100 text-lime-700 border-lime-200",
  DMC: "bg-indigo-100 text-indigo-700 border-indigo-200",
  "Car Rental": "bg-slate-100 text-slate-700 border-slate-200",
  Other: "bg-gray-100 text-gray-700 border-gray-200",
};

type SortField = keyof Vendor | null;
type SortDir = "asc" | "desc";

// ── Component ─────────────────────────────────────────────────────────────────

function VendorsPage() {
  const [vendors, setVendors] = useSupabaseTable<Vendor[]>("vendors", []);

  // Search & Filters
  const [q, setQ] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [filterPlace, setFilterPlace] = useState("All");
  const [filterCity, setFilterCity] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Sorting
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  // Pagination
  const [page, setPage] = useState(1);
  const perPage = 20;

  // Modals
  const [dialogType, setDialogType] = useState<"add" | "edit" | "view" | "delete" | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [form, setForm] = useState<Partial<Vendor>>(EMPTY_FORM);
  const [formContacts, setFormContacts] = useState<VendorContact[]>([{ ...EMPTY_CONTACT }]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Contact helpers
  const addContact = () => setFormContacts((prev) => [...prev, { ...EMPTY_CONTACT }]);
  const removeContact = (i: number) => setFormContacts((prev) => prev.filter((_, idx) => idx !== i));
  const updateContact = (i: number, field: keyof VendorContact, value: string) =>
    setFormContacts((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: value } : c));

  // ── Derived lists ──
  const uniquePlaces = useMemo(() => Array.from(new Set(vendors.map((v) => v.place).filter(Boolean))), [vendors]);
  const uniqueCities = useMemo(() => Array.from(new Set(vendors.map((v) => v.officeCity).filter(Boolean))), [vendors]);

  // ── Stats ──
  const stats = useMemo(() => ({
    total: vendors.length,
    active: vendors.filter((v) => v.status === "Active").length,
    types: new Set(vendors.map((v) => v.vendorType)).size,
    cities: new Set(vendors.map((v) => v.officeCity).filter(Boolean)).size,
    countries: new Set(vendors.map((v) => (v.place || "").split(",").pop()?.trim()).filter(Boolean)).size,
  }), [vendors]);

  // ── Filter & Sort ──
  const filtered = useMemo(() => {
    let list = vendors.filter((v) => {
      const sq = q.toLowerCase();
      return (
        (filterType === "All" || v.vendorType === filterType) &&
        (filterPlace === "All" || v.place === filterPlace) &&
        (filterCity === "All" || v.officeCity === filterCity) &&
        (filterStatus === "All" || v.status === filterStatus) &&
        (!sq ||
          v.name?.toLowerCase().includes(sq) ||
          v.contactPerson?.toLowerCase().includes(sq) ||
          v.mobile?.includes(sq) ||
          v.email?.toLowerCase().includes(sq) ||
          v.place?.toLowerCase().includes(sq) ||
          v.officeCity?.toLowerCase().includes(sq))
      );
    });

    if (sortField) {
      list = [...list].sort((a, b) => {
        const av = String(a[sortField] ?? "").toLowerCase();
        const bv = String(b[sortField] ?? "").toLowerCase();
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      });
    }
    return list;
  }, [vendors, q, filterType, filterPlace, filterCity, filterStatus, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  // ── Handlers ──
  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/50" />;
    return sortDir === "asc" ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />;
  };

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setFormContacts([{ ...EMPTY_CONTACT }]);
    setFormError(null);
    setDialogType("add");
  };

  const openEdit = (v: Vendor) => {
    setSelectedVendor(v);
    setForm({ ...v });
    // Initialise contacts from stored array, or fall back to legacy single fields
    const existing = v.contacts && v.contacts.length > 0
      ? v.contacts
      : [{ name: v.contactPerson || "", mobile: v.mobile || "", email: v.email || "" }];
    setFormContacts(existing.map((c) => ({ ...c })));
    setFormError(null);
    setDialogType("edit");
  };

  const openView = (v: Vendor) => {
    setSelectedVendor(v);
    setDialogType("view");
  };

  const validateForm = (): string | null => {
    if (!form.name?.trim()) return "Vendor Name is required.";
    if (!form.place?.trim()) return "Place is required.";
    if (!form.officeCity?.trim()) return "Office City is required.";
    if (!form.vendorType) return "Vendor Type is required.";
    if (form.website && !/^https?:\/\/.+/.test(form.website)) return "Website must start with http:// or https://";
    // Validate contacts
    if (!formContacts.length || !formContacts[0].name?.trim()) return "At least one Contact Person name is required.";
    if (!formContacts[0].mobile?.trim()) return "Primary contact Mobile Number is required.";
    for (const c of formContacts) {
      if (c.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c.email)) return `Email '${c.email}' is not valid.`;
    }
    return null;
  };

  const handleSave = () => {
    const err = validateForm();
    if (err) { setFormError(err); return; }

    // Build primary fields from contacts[0] for backward compat
    const primaryContact = formContacts[0];
    const primaryMobile = primaryContact.mobile.trim();

    if (dialogType === "add") {
      const isDup = vendors.some((v) =>
        v.mobile === primaryMobile ||
        (v.contacts || []).some((c) => c.mobile === primaryMobile)
      );
      if (isDup) { setFormError("A vendor with this mobile number already exists."); return; }

      const id = `VND-${String(Date.now()).slice(-5)}`;
      setVendors([{
        ...form as Vendor,
        id,
        createdAt: new Date().toISOString().slice(0, 10),
        contacts: formContacts,
        contactPerson: primaryContact.name,
        mobile: primaryMobile,
        email: primaryContact.email,
      }, ...vendors]);
    } else if (dialogType === "edit" && selectedVendor) {
      const isDup = vendors.some((v) => {
        if (v.id === selectedVendor.id) return false;
        return v.mobile === primaryMobile || (v.contacts || []).some((c) => c.mobile === primaryMobile);
      });
      if (isDup) { setFormError("Another vendor already uses this mobile number."); return; }
      setVendors(vendors.map((v) => v.id === selectedVendor.id ? {
        ...v,
        ...form,
        contacts: formContacts,
        contactPerson: primaryContact.name,
        mobile: primaryMobile,
        email: primaryContact.email,
      } as Vendor : v));
    }

    setDialogType(null);
  };

  const handleDelete = () => {
    if (selectedVendor) setVendors(vendors.filter((v) => v.id !== selectedVendor.id));
    setDialogType(null);
  };

  const handleImport = (data: any[]) => {
    let maxNum = vendors.reduce((max, v) => {
      const n = parseInt(v.id.replace("VND-", ""));
      return isNaN(n) ? max : Math.max(max, n);
    }, 0);

    const newVendors: Vendor[] = [];
    data.forEach((row) => {
      const mobile = String(row["Mobile Number"] || "").trim();
      if (vendors.some((v) => v.mobile === mobile) || newVendors.some((v) => v.mobile === mobile)) return;
      maxNum++;
      newVendors.push({
        id: `VND-${String(maxNum).padStart(5, "0")}`,
        place: String(row["Place"] || ""),
        name: String(row["Vendor Name"] || ""),
        contactPerson: String(row["Contact Person"] || ""),
        mobile,
        email: String(row["Email ID"] || ""),
        website: String(row["Website"] || ""),
        officeCity: String(row["Office City"] || ""),
        vendorType: (String(row["Vendor Type"] || "Other")) as VendorType,
        status: (String(row["Status"] || "Active")) as VendorStatus,
        createdAt: new Date().toISOString().slice(0, 10),
        notes: "",
      });
    });
    setVendors([...newVendors, ...vendors]);
  };

  const handleExport = () => {
    const headers = ["Vendor ID", "Place", "Vendor Name", "Contact Person", "Mobile", "Email", "Website", "Office City", "Vendor Type", "Status", "Created Date"];
    const rows = filtered.map((v) => [v.id, v.place, v.name, v.contactPerson, v.mobile, v.email, v.website, v.officeCity, v.vendorType, v.status, v.createdAt]);
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    ws["!cols"] = headers.map(() => ({ wch: 20 }));
    XLSX.utils.book_append_sheet(wb, ws, "Vendors");
    XLSX.writeFile(wb, `Vendors_Export_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // ── Render ──
  const StatCard = ({ label, value, icon, color }: { label: string; value: number | string; icon: React.ReactNode; color: string }) => (
    <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex items-center gap-4">
      <div className={`h-12 w-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>{icon}</div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-display font-bold mt-0.5">{value}</p>
      </div>
    </div>
  );

  const TypeBadge = ({ type }: { type: string }) => (
    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${vendorTypeColor[type] || "bg-gray-100 text-gray-700 border-gray-200"}`}>
      {type}
    </span>
  );

  const thClass = "px-4 py-3 font-semibold text-left whitespace-nowrap select-none cursor-pointer hover:bg-secondary/80 transition-colors";

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Vendor Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your complete travel vendor and supplier database.
          </p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button variant="outline" onClick={() => setIsImportOpen(true)}>
            <Download className="mr-2 h-4 w-4 rotate-180" /> Import
          </Button>
          <Button onClick={openAdd} style={{ background: "var(--gradient-brand)" }} className="text-white shadow-md">
            <Plus className="mr-2 h-4 w-4" /> Add Vendor
          </Button>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard label="Total Vendors" value={stats.total} icon={<Building2 className="h-6 w-6" />} color="bg-primary/10 text-primary" />
        <StatCard label="Active Vendors" value={stats.active} icon={<Building2 className="h-6 w-6" />} color="bg-emerald-100 text-emerald-600" />
        <StatCard label="Vendor Types" value={stats.types} icon={<Filter className="h-6 w-6" />} color="bg-purple-100 text-purple-600" />
        <StatCard label="Cities Covered" value={stats.cities} icon={<MapPin className="h-6 w-6" />} color="bg-blue-100 text-blue-600" />
        <StatCard label="Countries Covered" value={stats.countries} icon={<Globe className="h-6 w-6" />} color="bg-amber-100 text-amber-600" />
      </div>

      {/* ── Filters & Search ── */}
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search vendor name, contact, email, mobile, place..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1); }}
            className="pl-9 h-10 bg-card border-border shadow-sm rounded-xl"
          />
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 lg:pb-0">
          <Select value={filterType} onValueChange={(v) => { setFilterType(v); setPage(1); }}>
            <SelectTrigger className="w-[160px] bg-card shadow-sm h-10 rounded-xl shrink-0">
              <SelectValue placeholder="Vendor Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Types</SelectItem>
              {VENDOR_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>

          {uniquePlaces.length > 0 && (
            <Select value={filterPlace} onValueChange={(v) => { setFilterPlace(v); setPage(1); }}>
              <SelectTrigger className="w-[150px] bg-card shadow-sm h-10 rounded-xl shrink-0">
                <SelectValue placeholder="Place" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Places</SelectItem>
                {uniquePlaces.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          )}

          {uniqueCities.length > 0 && (
            <Select value={filterCity} onValueChange={(v) => { setFilterCity(v); setPage(1); }}>
              <SelectTrigger className="w-[150px] bg-card shadow-sm h-10 rounded-xl shrink-0">
                <SelectValue placeholder="City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Cities</SelectItem>
                {uniqueCities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          )}

          <Select value={filterStatus} onValueChange={(v) => { setFilterStatus(v); setPage(1); }}>
            <SelectTrigger className="w-[140px] bg-card shadow-sm h-10 rounded-xl shrink-0">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Table ── */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-secondary/50 text-muted-foreground border-b border-border sticky top-0 z-10">
              <tr>
                <th className={thClass} onClick={() => handleSort("place")}>
                  <div className="flex items-center gap-1.5">Place <SortIcon field="place" /></div>
                </th>
                <th className={thClass} onClick={() => handleSort("name")}>
                  <div className="flex items-center gap-1.5">Vendor Name <SortIcon field="name" /></div>
                </th>
                <th className={thClass} onClick={() => handleSort("contactPerson")}>
                  <div className="flex items-center gap-1.5">Contact Person <SortIcon field="contactPerson" /></div>
                </th>
                <th className={thClass} onClick={() => handleSort("mobile")}>
                  <div className="flex items-center gap-1.5">Mobile <SortIcon field="mobile" /></div>
                </th>
                <th className={thClass} onClick={() => handleSort("email")}>
                  <div className="flex items-center gap-1.5">Email ID <SortIcon field="email" /></div>
                </th>
                <th className={thClass} onClick={() => handleSort("officeCity")}>
                  <div className="flex items-center gap-1.5">Office City <SortIcon field="officeCity" /></div>
                </th>
                <th className={thClass} onClick={() => handleSort("vendorType")}>
                  <div className="flex items-center gap-1.5">Vendor Type <SortIcon field="vendorType" /></div>
                </th>
                <th className="px-4 py-3 font-semibold text-center whitespace-nowrap">Status</th>
                <th className="px-4 py-3 font-semibold text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center gap-3">
                      <Building2 className="h-12 w-12 opacity-30" />
                      <p className="font-medium">No vendors found</p>
                      <p className="text-xs">Try adjusting your search or filters, or add a new vendor.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginated.map((v) => (
                  <tr key={v.id} className="hover:bg-secondary/30 transition-colors group">
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-1.5 text-sm font-medium">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        {v.place || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="font-semibold text-foreground">{v.name}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">{v.id}</div>
                    </td>
                    <td className="px-4 py-3 align-top">
                      {(() => {
                        const contacts = v.contacts?.length ? v.contacts : [{ name: v.contactPerson, mobile: v.mobile, email: v.email }];
                        const extra = contacts.length - 1;
                        return (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{contacts[0]?.name || "-"}</span>
                            {extra > 0 && (
                              <span className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-md">
                                +{extra} more
                              </span>
                            )}
                          </div>
                        );
                      })()}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {(() => {
                        const contacts = v.contacts?.length ? v.contacts : [{ name: v.contactPerson, mobile: v.mobile, email: v.email }];
                        const primary = contacts[0]?.mobile;
                        return primary ? (
                          <a href={`tel:${primary}`} className="text-sm font-medium text-primary hover:underline">{primary}</a>
                        ) : <span className="text-muted-foreground">-</span>;
                      })()}
                    </td>
                    <td className="px-4 py-3 align-top">
                      {(() => {
                        const contacts = v.contacts?.length ? v.contacts : [{ name: v.contactPerson, mobile: v.mobile, email: v.email }];
                        const email = contacts[0]?.email;
                        return email ? (
                          <a href={`mailto:${email}`} className="text-sm text-muted-foreground hover:text-foreground hover:underline break-all">{email}</a>
                        ) : <span className="text-muted-foreground">-</span>;
                      })()}
                    </td>
                    <td className="px-4 py-3 align-top text-sm">{v.officeCity || "-"}</td>
                    <td className="px-4 py-3 align-top">
                      <TypeBadge type={v.vendorType} />
                    </td>
                    <td className="px-4 py-3 align-top text-center">
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        v.status === "Active"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-top text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0 opacity-50 group-hover:opacity-100 transition-opacity">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                          <DropdownMenuItem onClick={() => openView(v)}>
                            <Eye className="mr-2 h-4 w-4" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => openEdit(v)}>
                            <Edit2 className="mr-2 h-4 w-4" /> Edit Vendor
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {v.mobile && (
                            <DropdownMenuItem asChild>
                              <a href={`tel:${v.mobile}`}>
                                <Phone className="mr-2 h-4 w-4 text-emerald-600" /> Call Vendor
                              </a>
                            </DropdownMenuItem>
                          )}
                          {v.email && (
                            <DropdownMenuItem asChild>
                              <a href={`mailto:${v.email}`}>
                                <Mail className="mr-2 h-4 w-4 text-blue-600" /> Send Email
                              </a>
                            </DropdownMenuItem>
                          )}
                          {v.website && (
                            <DropdownMenuItem asChild>
                              <a href={v.website} target="_blank" rel="noopener noreferrer">
                                <Globe className="mr-2 h-4 w-4 text-purple-600" /> Open Website
                              </a>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600 focus:text-red-600 focus:bg-red-50"
                            onClick={() => { setSelectedVendor(v); setDialogType("delete"); }}
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
              Showing {(page - 1) * perPage + 1}–{Math.min(page * perPage, filtered.length)} of {filtered.length} vendors
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* ── Import Modal ── */}
      <ImportVendorsModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImport={handleImport}
        allowedTypes={VENDOR_TYPES}
      />

      {/* ── Add / Edit Modal ── */}
      <Dialog open={dialogType === "add" || dialogType === "edit"} onOpenChange={(val) => !val && setDialogType(null)}>
        <DialogContent className="sm:max-w-[700px] p-0 overflow-hidden">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-card">
            <DialogTitle>{dialogType === "edit" ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
            <DialogDescription>
              {dialogType === "edit" ? "Update vendor details." : "Register a new travel vendor or supplier."}
            </DialogDescription>
          </DialogHeader>

          <div className="p-6 grid grid-cols-2 gap-4 bg-secondary/10 overflow-y-auto max-h-[70vh]">
            <div className="col-span-2 space-y-1.5">
              <Label>Vendor Name <span className="text-red-500">*</span></Label>
              <Input value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Address Beach Resort" />
            </div>
            <div className="space-y-1.5">
              <Label>Place (Destination) <span className="text-red-500">*</span></Label>
              <Input value={form.place || ""} onChange={(e) => setForm({ ...form, place: e.target.value })} placeholder="e.g. Dubai, UAE" />
            </div>
            <div className="space-y-1.5">
              <Label>Office City <span className="text-red-500">*</span></Label>
              <Input value={form.officeCity || ""} onChange={(e) => setForm({ ...form, officeCity: e.target.value })} placeholder="e.g. Dubai" />
            </div>
            <div className="space-y-1.5">
              <Label>Website</Label>
              <Input value={form.website || ""} onChange={(e) => setForm({ ...form, website: e.target.value })} placeholder="https://www.vendor.com" />
            </div>
            <div className="space-y-1.5">
              <Label>Vendor Type <span className="text-red-500">*</span></Label>
              <Select value={form.vendorType || "Hotel"} onValueChange={(v) => setForm({ ...form, vendorType: v as VendorType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {VENDOR_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Status</Label>
              <Select value={form.status || "Active"} onValueChange={(v) => setForm({ ...form, status: v as VendorStatus })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* ── Contact Persons ── */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold">
                  Contact Persons <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs text-muted-foreground font-normal">(First contact is the primary)</span>
                </Label>
                <Button type="button" variant="outline" size="sm" onClick={addContact} className="h-7 px-3 text-xs gap-1.5 rounded-lg">
                  <Plus className="h-3.5 w-3.5" /> Add Contact
                </Button>
              </div>

              <div className="space-y-3">
                {formContacts.map((contact, i) => (
                  <div key={i} className="bg-card border border-border rounded-xl p-4 shadow-sm space-y-2 relative">
                    {i === 0 ? (
                      <span className="absolute top-3 right-3 text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded-md">
                        Primary
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => removeContact(i)}
                        className="absolute top-3 right-3 p-1 text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="Remove contact"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-1">Contact {i + 1}</p>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">Name {i === 0 && <span className="text-red-500">*</span>}</Label>
                        <Input
                          value={contact.name}
                          onChange={(e) => updateContact(i, "name", e.target.value)}
                          placeholder="e.g. Sarah Jenkins"
                          className="h-9 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Mobile Number {i === 0 && <span className="text-red-500">*</span>}</Label>
                        <Input
                          value={contact.mobile}
                          onChange={(e) => updateContact(i, "mobile", e.target.value)}
                          placeholder="e.g. 9876543210"
                          className="h-9 text-sm"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Email ID</Label>
                        <Input
                          type="email"
                          value={contact.email}
                          onChange={(e) => updateContact(i, "email", e.target.value)}
                          placeholder="e.g. vendor@example.com"
                          className="h-9 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-2 space-y-1.5">
              <Label>Notes / Remarks</Label>
              <textarea
                value={form.notes || ""}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                placeholder="Partner policies, banking details, or contract descriptions..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            {formError && (
              <div className="col-span-2 flex items-center gap-2 p-3 text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl">
                <span className="font-medium">{formError}</span>
              </div>
            )}
          </div>

          <DialogFooter className="px-6 py-4 border-t border-border bg-card gap-2">
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancel</Button>
            <Button onClick={handleSave} style={{ background: "var(--gradient-brand)" }} className="text-white">
              {dialogType === "edit" ? "Save Changes" : "Save Vendor"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── View Modal ── */}
      <Dialog open={dialogType === "view"} onOpenChange={(val) => !val && setDialogType(null)}>
        <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden">
          {selectedVendor && (
            <>
              <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-card">
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-2xl border border-primary/20">
                    {selectedVendor.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <DialogTitle className="text-xl font-display truncate">{selectedVendor.name}</DialogTitle>
                    <DialogDescription className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1">
                      <span className="font-mono text-xs bg-secondary px-2 py-0.5 rounded-md">{selectedVendor.id}</span>
                      <TypeBadge type={selectedVendor.vendorType} />
                      <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                        selectedVendor.status === "Active" ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-600 border-slate-200"
                      }`}>{selectedVendor.status}</span>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="p-6 space-y-5 bg-secondary/10 overflow-y-auto max-h-[65vh]">
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contact Persons</h3>
                  <div className="space-y-3">
                    {(selectedVendor.contacts?.length
                      ? selectedVendor.contacts
                      : [{ name: selectedVendor.contactPerson, mobile: selectedVendor.mobile, email: selectedVendor.email }]
                    ).map((c, i) => (
                      <div key={i} className={`rounded-xl p-3 border text-sm ${i === 0 ? "bg-primary/5 border-primary/20" : "bg-secondary/40 border-border"}`}>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-foreground">{c.name || "-"}</span>
                          {i === 0 && (
                            <span className="text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.5 rounded-md">
                              Primary
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-1.5">
                          {c.mobile && (
                            <a href={`tel:${c.mobile}`} className="text-primary hover:underline flex items-center gap-1.5 text-xs font-medium">
                              <Phone className="h-3 w-3" /> {c.mobile}
                            </a>
                          )}
                          {c.email && (
                            <a href={`mailto:${c.email}`} className="text-primary hover:underline flex items-center gap-1.5 text-xs font-medium">
                              <Mail className="h-3 w-3" /> {c.email}
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedVendor.website && (
                    <div className="mt-3 pt-3 border-t border-border">
                      <a href={selectedVendor.website} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline flex items-center gap-1.5 text-sm">
                        <Globe className="h-3.5 w-3.5 shrink-0" /> Visit Website
                      </a>
                    </div>
                  )}
                </div>

                <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Location Details</h3>
                  <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm">
                    <div>
                      <p className="text-muted-foreground text-xs mb-0.5">Place (Destination)</p>
                      <p className="font-medium flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> {selectedVendor.place || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-0.5">Office City</p>
                      <p className="font-medium">{selectedVendor.officeCity || "-"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs mb-0.5">Added On</p>
                      <p className="font-medium">{selectedVendor.createdAt || "-"}</p>
                    </div>
                  </div>
                </div>

                {selectedVendor.notes && (
                  <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Notes</h3>
                    <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{selectedVendor.notes}</p>
                  </div>
                )}
              </div>

              <DialogFooter className="px-6 py-4 border-t border-border bg-card gap-2">
                <Button variant="outline" onClick={() => setDialogType(null)}>Close</Button>
                <Button onClick={() => openEdit(selectedVendor)}>
                  <Edit2 className="mr-2 h-4 w-4" /> Edit Vendor
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Delete Confirm ── */}
      <Dialog open={dialogType === "delete"} onOpenChange={(val) => !val && setDialogType(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="text-red-600 flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Delete Vendor
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to permanently delete <strong>{selectedVendor?.name}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2">
            <Button variant="outline" onClick={() => setDialogType(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Yes, Delete Vendor</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
