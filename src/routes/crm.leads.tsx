import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { getAuth } from "@/lib/auth";
import {
  Plus, Phone, Mail, Search, X, MapPin, IndianRupee,
  CalendarDays, Globe, TrendingUp, UserCheck, Users,
  ChevronRight, Filter, LayoutGrid, Table2, Sparkles, Upload,
  Briefcase, Package, AlertCircle, Download, FileText, User,
  Shield, Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { ImportModal } from "@/components/ui/import-modal";
import { EmployeeProfileCard } from "@/components/EmployeeProfileCard";
import { leads as SEED_LEADS, formatINR, type Lead } from "@/lib/mock-data";
import { useLocalStorage } from "@/lib/use-local-storage";
import { INITIAL_EMPLOYEES } from "./crm.employees";

export const Route = createFileRoute("/crm/leads")({ component: LeadsPage });

/* ─── Extra fields for extended leads ─── */
interface ExtLead extends Lead {
  avatar: string;
  notes: string;
  insuranceDate?: string;
  policyType?: string;
  queryType?: string;
  clientCompany?: string;
  expiryDate?: string;
}

const AVATARS = [""];

const SOURCES = [
  "Instagram",
  "Facebook",
  "WhatsApp",
  "Walk-in",
  "Website",
  "Referral",
  "Ads",
  "BNI",
  "DD Pharma",
  "Other",
  "Old Ref",
  "BNI INC",
];
const SOURCE_COLORS: Record<string, string> = {
  "Instagram": "bg-pink-400",
  "Facebook": "bg-blue-600",
  "WhatsApp": "bg-emerald-700",
  "Walk-in": "bg-yellow-200",
  "Website": "bg-orange-500",
  "Referral": "bg-purple-300",
  "Ads": "bg-gray-200",
  "BNI": "bg-teal-800",
  "DD Pharma": "bg-green-200",
  "Other": "bg-pink-200",
  "Old Ref": "bg-blue-300",
  "BNI INC": "bg-green-400",
};
const DESTINATIONS = ["Bali", "Dubai", "Maldives", "Europe", "Thailand", "Singapore", "Kerala", "Rajasthan", "Japan", "Sri Lanka"];

const SERVICES = [
  { group: "Travel Services", items: [{ label: "Air Ticket", icon: "✈️" }, { label: "Hotel Booking", icon: "🏨" }, { label: "Visa", icon: "🛂" }, { label: "Cruise Booking", icon: "🚢" }, { label: "Passport Assistance", icon: "📘" }, { label: "Forex Exchange", icon: "💱" }, { label: "Airport Transfer", icon: "🚕" }, { label: "Car Rental", icon: "🚗" }, { label: "Train Ticket", icon: "🚆" }, { label: "Bus Ticket", icon: "🚌" }, { label: "Taxi Booking", icon: "🚕" }, { label: "Travel Insurance", icon: "🛡️" }] },
  { group: "Holiday Packages", items: [{ label: "International Package", icon: "🌍" }, { label: "Domestic Package", icon: "🏝" }, { label: "Honeymoon Package", icon: "💖" }, { label: "Family Package", icon: "👨‍👩‍👧‍👦" }, { label: "Group Tour", icon: "🚌" }, { label: "Corporate Tour", icon: "🏢" }, { label: "Luxury Tour", icon: "✨" }, { label: "Adventure Tour", icon: "🧗" }] },
  { group: "Business", items: [{ label: "Corporate Travel", icon: "💼" }, { label: "MICE Events", icon: "🎤" }, { label: "Conference Booking", icon: "🎟" }] },
  { group: "Insurance Services", items: [{ label: "General Insurance", icon: "🛡️" }] },
];

const SERVICE_ICONS: Record<string, string> = SERVICES.reduce((acc, group) => {
  group.items.forEach(item => acc[item.label] = item.icon);
  return acc;
}, {} as Record<string, string>);

const LEADS_INIT: ExtLead[] = SEED_LEADS.map((l, i) => ({
  ...l,
  avatar: AVATARS[i % AVATARS.length],
  notes: "",
}));

/* ─── Status config ─── */
type LeadStatus = Lead["status"];
const STATUSES: LeadStatus[] = ["New Lead", "Contacted", "Quotation Sent", "Negotiation", "Booked", "Completed", "Lost"];

const STATUS_PILL: Record<LeadStatus, string> = {
  "New Lead": "bg-blue-100 text-blue-700",
  Contacted: "bg-amber-100 text-amber-700",
  "Quotation Sent": "bg-cyan-100 text-cyan-700",
  Negotiation: "bg-purple-100 text-purple-700",
  Booked: "bg-indigo-100 text-indigo-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Lost: "bg-rose-100 text-rose-700",
};

const STATUS_ACCENT: Record<LeadStatus, string> = {
  "New Lead": "border-l-blue-400",
  Contacted: "border-l-amber-400",
  "Quotation Sent": "border-l-cyan-400",
  Negotiation: "border-l-purple-400",
  Booked: "border-l-indigo-400",
  Completed: "border-l-emerald-400",
  Lost: "border-l-rose-400",
};

const STATUS_DOT: Record<LeadStatus, string> = {
  "New Lead": "bg-blue-500",
  Contacted: "bg-amber-500",
  "Quotation Sent": "bg-cyan-500",
  Negotiation: "bg-purple-500",
  Booked: "bg-indigo-500",
  Completed: "bg-emerald-500",
  Lost: "bg-rose-500",
};

const PRIORITY_BADGE: Record<string, string> = {
  High: "🔴 High",
  Medium: "🟡 Medium",
  Low: "🟢 Low",
};

const SOURCE_ICONS: Record<string, string> = {
  Website: "🌐",
  Instagram: "📸",
  Referral: "🤝",
  "Google Ads": "🔍",
  WhatsApp: "💬",
  "Walk-in": "🚶",
};

function initials(n: string) {
  return n.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

/* ─── Add Lead Modal ─── */
const EMPTY_FORM = {
  name: "", phone: "", email: "", destination: "",
  budget: "", travelDate: "", source: SOURCES[0], reference: "", status: "New Lead" as LeadStatus,
  assignedTo: "", pax: "2", notes: "",
  service: "International Package", priority: "Medium" as Lead["priority"], packageType: "",
  insuranceDate: "", policyType: "Four Wheeler", queryType: "New", clientCompany: "", expiryDate: "",
};

function AddLeadModal({ onClose, onAdd, existingLeads }: { onClose: () => void; onAdd: (l: ExtLead) => void; existingLeads: ExtLead[] }) {
  const [localEmployees] = useLocalStorage<any[]>("crm_employees_v3", INITIAL_EMPLOYEES);
  const employees = localEmployees?.length ? localEmployees : INITIAL_EMPLOYEES;
  const auth = getAuth();
  const assignees = Array.from(new Set([
    ...(employees.map((e: any) => e.name)),
    ...(auth?.name ? [auth.name] : []),
    "Other"
  ]));

  const [form, setForm] = useState({ ...EMPTY_FORM, assignedTo: assignees[0] || "" });
  
  const isInsurance = form.service.toLowerCase().includes("insurance");
  const canSubmit = isInsurance
    ? form.name.trim() && form.phone.trim() && form.insuranceDate
    : form.name.trim() && form.phone.trim() && form.destination && form.travelDate;

  const set = (k: keyof typeof EMPTY_FORM) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const fieldCls = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow";

  const submit = () => {
    if (!canSubmit) return;
    const lmhLeads = existingLeads.filter(l => l.id.startsWith("LMH-"));
    let nextNum = 1;
    if (lmhLeads.length > 0) {
      const nums = lmhLeads.map(l => {
        const parts = l.id.split("-");
        const n = parseInt(parts[1], 10);
        return isNaN(n) ? 0 : n;
      });
      nextNum = Math.max(...nums) + 1;
    }
    const pad = (num: number, size: number) => {
      let s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    };
    const id = `LMH-${pad(nextNum, 3)}`;
    onAdd({
      id,
      name: form.name,
      phone: form.phone,
      email: form.email,
      destination: isInsurance ? (form.clientCompany || "Insurance") : form.destination,
      budget: isInsurance ? 0 : (Number(form.budget) || 0),
      travelDate: isInsurance ? form.insuranceDate : form.travelDate,
      status: form.status,
      source: form.source,
      reference: form.reference,
      createdAt: new Date().toISOString().slice(0, 10),
      avatar: "",
      assignedTo: form.assignedTo,
      notes: form.notes,
      pax: isInsurance ? 1 : (Number(form.pax) || 2),
      service: form.service,
      priority: form.priority,
      packageType: isInsurance ? `${form.policyType} (${form.queryType})` : form.packageType,
      insuranceDate: isInsurance ? form.insuranceDate : undefined,
      policyType: isInsurance ? form.policyType : undefined,
      queryType: isInsurance ? form.queryType : undefined,
      clientCompany: isInsurance ? form.clientCompany : undefined,
      expiryDate: isInsurance ? form.expiryDate : undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl border border-border bg-background shadow-2xl animate-float-up" style={{ animationDuration: "0.25s" }}>
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground" style={{ background: "var(--gradient-brand)" }}>
              <Plus className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold">Add New Lead</h2>
              <p className="text-xs text-muted-foreground">Enter inquiry details below</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-secondary transition-colors"><X className="h-4 w-4" /></button>
        </div>

        <div className="grid gap-4 px-6 pt-5 pb-6 sm:grid-cols-2">
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold">Full name <span className="text-red-500">*</span></label>
            <Input id="lead-name" placeholder="e.g. Priya Sharma" value={form.name} onChange={set("name")} className="rounded-xl" />
          </div>
          {/* Phone */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Phone <span className="text-red-500">*</span></label>
            <Input id="lead-phone" placeholder="+91 98200 00000" value={form.phone} onChange={set("phone")} className="rounded-xl" />
          </div>
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Email</label>
            <Input id="lead-email" type="email" placeholder="name@example.com" value={form.email} onChange={set("email")} className="rounded-xl" />
          </div>
          {isInsurance ? (
            <>

              {/* Expiry Date */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Expiry Date</label>
                <Input id="lead-exp-date" type="date" value={form.expiryDate} onChange={set("expiryDate")} className="rounded-xl" />
              </div>
              {/* Policy Type */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Policy Type</label>
                <select id="lead-policy-type" value={form.policyType} onChange={set("policyType")} className={fieldCls}>
                  <option>Four Wheeler</option>
                  <option>Two Wheeler</option>
                  <option>School Bus</option>
                  <option>Pickup</option>
                  <option>Tractor</option>
                  <option>Health</option>
                  <option>LIC</option>
                  <option>Commercial Vehicle</option>
                </select>
              </div>
              {/* Query Type */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Query Type</label>
                <select id="lead-query-type" value={form.queryType} onChange={set("queryType")} className={fieldCls}>
                  <option>New</option>
                  <option>Renewal</option>
                  <option>Expired</option>
                </select>
              </div>
              {/* Client / Company */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold">Client / Company</label>
                <Input id="lead-client-company" placeholder="e.g. Acme Corp..." value={form.clientCompany} onChange={set("clientCompany")} className="rounded-xl" />
              </div>
            </>
          ) : (
            <>
              {/* Destination */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Destination <span className="text-red-500">*</span></label>
                <Input
                  id="lead-destination"
                  placeholder="e.g. Bali, Paris..."
                  value={form.destination}
                  onChange={set("destination")}
                  className="rounded-xl"
                />
              </div>
              {/* Travel Date */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Travel date <span className="text-red-500">*</span></label>
                <Input id="lead-date" type="date" value={form.travelDate} onChange={set("travelDate")} className="rounded-xl" />
              </div>
              {/* Budget */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Budget (₹)</label>
                <Input id="lead-budget" type="number" placeholder="e.g. 85000" value={form.budget} onChange={set("budget")} className="rounded-xl" />
              </div>
              {/* Pax */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Travellers</label>
                <Input id="lead-pax" type="number" min={1} max={50} value={form.pax} onChange={set("pax")} className="rounded-xl" />
              </div>
            </>
          )}
          {/* Source */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Source</label>
            <Select value={form.source} onValueChange={(val) => setForm(prev => ({ ...prev, source: val }))}>
              <SelectTrigger id="lead-source" className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm h-10 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow">
                <SelectValue placeholder="Select a source" />
              </SelectTrigger>
              <SelectContent>
                {SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>
                    <div className="flex items-center gap-2">
                      <span className={`h-3 w-3 rounded-full ${SOURCE_COLORS[s] || "bg-gray-200"}`} />
                      {s}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Reference */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Reference</label>
            <Input id="lead-reference" placeholder="e.g. John Doe..." value={form.reference} onChange={set("reference")} className="rounded-xl" />
          </div>
          {/* Assignee */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Assign to</label>
            <select id="lead-assignee" value={form.assignedTo} onChange={set("assignedTo")} className={fieldCls}>
              {assignees.map((a) => <option key={a}>{a}</option>)}
            </select>
          </div>
          {/* Service */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Service <span className="text-red-500">*</span></label>
            <select id="lead-service" value={form.service} onChange={set("service")} className={fieldCls}>
              {SERVICES.map(g => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map(i => <option key={i.label} value={i.label}>{i.icon} {i.label}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          {/* Priority */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Priority</label>
            <select id="lead-priority" value={form.priority} onChange={set("priority")} className={fieldCls}>
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>
          {/* Package Type */}
          {!isInsurance && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Package Type</label>
              <Input id="lead-packageType" placeholder="e.g. Honeymoon, Custom" value={form.packageType} onChange={set("packageType")} className="rounded-xl" />
            </div>
          )}
          {/* Status */}
          <div className="sm:col-span-2">
            <label className="mb-2 block text-sm font-semibold">Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button key={s} type="button" onClick={() => setForm((f) => ({ ...f, status: s }))}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${form.status === s ? `${STATUS_PILL[s]} border-transparent shadow-sm` : "border-border bg-background text-muted-foreground hover:bg-secondary"
                    }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[s]}`} />{s}
                </button>
              ))}
            </div>
          </div>
          {/* Notes / Description */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold">
              {isInsurance ? "Description" : "Notes"} <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea id="lead-notes" rows={2} placeholder={isInsurance ? "Policy details or description..." : "Any special requests or context..."}
              value={form.notes} onChange={set("notes")}
              className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
            />
          </div>
          {/* Actions */}
          <div className="flex gap-3 sm:col-span-2">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>Cancel</Button>
            <Button id="submit-lead-btn" className="flex-1 gap-2 rounded-xl" disabled={!canSubmit}
              style={{ background: canSubmit ? "var(--gradient-brand)" : undefined }} onClick={submit}
            >
              <Plus className="h-4 w-4" /> Add Lead
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Lead Detail Slide-over ─── */
function LeadDetail({ lead, onClose, onStatusChange, onDelete, isAdmin, onEditNote }: { lead: ExtLead; onClose: () => void; onStatusChange: (id: string, s: LeadStatus) => void; onDelete: (id: string) => void; isAdmin: boolean; onEditNote?: (id: string, newNote: string) => void }) {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editNoteText, setEditNoteText] = useState(lead.notes || "");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-background shadow-2xl animate-float-up" style={{ animationDuration: "0.2s", animationName: "slide-in" }}>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-display text-xl font-bold">Lead Detail</h2>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-secondary"><X className="h-4 w-4" /></button>
        </div>

        <div className="flex-1 space-y-6 p-6">
          <div className="flex items-center gap-4">
            {lead.avatar ? (
              <img src={lead.avatar} alt={lead.name} className="h-16 w-16 rounded-2xl object-cover shrink-0" />
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                <User className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div>
              <p className="font-display text-xl font-bold">{lead.name}</p>
              <p className="text-sm text-muted-foreground">{lead.id} · Created {lead.createdAt}</p>
              <div className="mt-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_PILL[lead.status]}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[lead.status]}`} />{lead.status}
                </span>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="grid gap-3 rounded-2xl border border-border bg-secondary/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Contact</p>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="h-4 w-4 text-primary" />
              <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email || "—"}</a>
            </div>
          </div>

          {/* Trip details */}
          <div className="grid gap-3 rounded-2xl border border-border bg-secondary/30 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {lead.service.toLowerCase().includes("insurance") ? "Insurance Details" : "Trip Details"}
            </p>
            <div className="grid grid-cols-2 gap-3">
              {lead.service.toLowerCase().includes("insurance") ? (
                [
                  { icon: <CalendarDays className="h-4 w-4 text-primary" />, label: "Expiry Date", val: lead.expiryDate || "—" },
                  { icon: <Shield className="h-4 w-4 text-primary" />, label: "Policy Type", val: lead.policyType || "—" },
                  { icon: <AlertCircle className="h-4 w-4 text-primary" />, label: "Query Type", val: lead.queryType || "—" },
                  { icon: <Building2 className="h-4 w-4 text-primary" />, label: "Client / Company", val: lead.clientCompany || "—" },
                  { icon: <UserCheck className="h-4 w-4 text-primary" />, label: "Reference", val: lead.reference || "—" },
                  { icon: <Globe className="h-4 w-4 text-primary" />, label: "Source", val: `${SOURCE_ICONS[lead.source] || ""} ${lead.source}` },
                  { icon: <Briefcase className="h-4 w-4 text-primary" />, label: "Service", val: `${SERVICE_ICONS[lead.service] || ""} ${lead.service}` },
                ].map((r) => (
                  <div key={r.label} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0">{r.icon}</span>
                    <div>
                      <p className="text-xs text-muted-foreground">{r.label}</p>
                      <p className="text-sm font-semibold">{r.val}</p>
                    </div>
                  </div>
                ))
              ) : (
                [
                  { icon: <MapPin className="h-4 w-4 text-primary" />, label: "Destination", val: lead.destination },
                  { icon: <IndianRupee className="h-4 w-4 text-primary" />, label: "Budget", val: formatINR(lead.budget) },
                  { icon: <CalendarDays className="h-4 w-4 text-primary" />, label: "Travel Date", val: lead.travelDate },
                  { icon: <Users className="h-4 w-4 text-primary" />, label: "Travellers", val: `${lead.pax} pax` },
                  { icon: <Globe className="h-4 w-4 text-primary" />, label: "Source", val: `${SOURCE_ICONS[lead.source] || ""} ${lead.source}` },
                  { icon: <Briefcase className="h-4 w-4 text-primary" />, label: "Service", val: `${SERVICE_ICONS[lead.service] || ""} ${lead.service}` },
                  { icon: <Package className="h-4 w-4 text-primary" />, label: "Package", val: lead.packageType || "—" },
                  { icon: <AlertCircle className="h-4 w-4 text-primary" />, label: "Priority", val: PRIORITY_BADGE[lead.priority] || lead.priority },
                ].map((r) => (
                  <div key={r.label} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0">{r.icon}</span>
                    <div>
                      <p className="text-xs text-muted-foreground">{r.label}</p>
                      <p className="text-sm font-semibold">{r.val}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Assignee Card */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assignee</p>
            <EmployeeProfileCard employeeName={lead.assignedTo} />
          </div>

          {/* Notes */}
          {isEditingNote ? (
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <label className="mb-1.5 block text-xs font-semibold text-foreground uppercase tracking-wider">Note <span className="text-muted-foreground font-normal normal-case">(optional)</span></label>
              <textarea
                autoFocus
                placeholder="Context or reminder details..."
                value={editNoteText}
                onChange={(e) => setEditNoteText(e.target.value)}
                rows={2}
                className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              />
              <div className="flex gap-2 mt-3">
                <Button size="sm" variant="outline" className="h-8 text-xs rounded-lg px-4" onClick={() => { setIsEditingNote(false); setEditNoteText(lead.notes || ""); }}>Cancel</Button>
                <Button size="sm" className="h-8 text-xs rounded-lg px-4" onClick={() => { onEditNote?.(lead.id, editNoteText); setIsEditingNote(false); }}>Save Note</Button>
              </div>
            </div>
          ) : lead.notes ? (
            <div className="rounded-2xl border border-border bg-secondary/30 p-4 group/note relative">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes</p>
                {isAdmin && onEditNote && (
                  <button
                    onClick={() => { setEditNoteText(lead.notes || ""); setIsEditingNote(true); }}
                    className="text-[10px] text-blue-500 hover:underline opacity-0 group-hover/note:opacity-100 transition-opacity"
                  >
                    Edit Note
                  </button>
                )}
              </div>
              <p className="text-sm text-muted-foreground italic">"{lead.notes}"</p>
            </div>
          ) : isAdmin && onEditNote ? (
            <div className="rounded-2xl border border-border border-dashed p-4 flex items-center justify-center">
              <button
                onClick={() => { setEditNoteText(""); setIsEditingNote(true); }}
                className="text-xs text-blue-500 hover:underline"
              >
                + Add Note
              </button>
            </div>
          ) : null}

          {/* Move stage */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Move to stage</p>
            <div className="flex flex-wrap gap-2">
              {STATUSES.map((s) => (
                <button key={s} onClick={() => onStatusChange(lead.id, s)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${lead.status === s ? `${STATUS_PILL[s]} border-transparent shadow-sm` : "border-border bg-background text-muted-foreground hover:bg-secondary"
                    }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[s]}`} />{s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex gap-3 border-t border-border p-6">
          {isAdmin && (
            <Button variant="destructive" className="flex-none gap-2 rounded-xl" onClick={() => setDeleteConfirmId(lead.id)}>
              <X className="h-4 w-4" /> Delete
            </Button>
          )}
          <Button variant="outline" className="flex-1 gap-2 rounded-xl" onClick={() => window.location.href = `tel:${lead.phone}`}><Phone className="h-4 w-4" /> Call</Button>
          <Button className="flex-1 gap-2 rounded-xl" style={{ background: "var(--gradient-brand)" }} onClick={() => window.location.href = `mailto:${lead.email}?subject=Your Quote from Grand Journeys`}><Mail className="h-4 w-4" /> Send Quote</Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in p-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl animate-in zoom-in-95" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold font-display text-foreground">Delete Lead?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete this lead? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setDeleteConfirmId(null)} className="rounded-xl">
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  onDelete(deleteConfirmId);
                  setDeleteConfirmId(null);
                }} 
                className="rounded-xl"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Kanban column ─── */
function KanbanCol({ status, leads, onSelect, onDropLead }: { status: LeadStatus; leads: ExtLead[]; onSelect: (l: ExtLead) => void; onDropLead: (id: string) => void }) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault(); // Required to allow drop
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData("leadId");
    if (leadId) {
      onDropLead(leadId);
    }
  };

  const total = leads.reduce((s, l) => s + l.budget, 0);
  return (
    <div
      className="flex min-w-[220px] flex-1 flex-col rounded-2xl border border-border bg-secondary/30 p-3 transition-colors hover:bg-secondary/50"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Column header */}
      <div className="mb-3 flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${STATUS_DOT[status]}`} />
          <span className="text-xs font-bold uppercase tracking-wider">{status}</span>
        </div>
        <span className="rounded-full bg-border px-2 py-0.5 text-xs font-semibold">{leads.length}</span>
      </div>
      {/* Budget total */}
      {total > 0 && <p className="mb-2 px-1 text-xs text-muted-foreground">{formatINR(total)}</p>}
      {/* Cards */}
      <div className="flex flex-col gap-2 min-h-[100px]">
        {leads.map((l) => (
          <button
            key={l.id}
            draggable
            onDragStart={(e) => {
              e.dataTransfer.setData("leadId", l.id);
            }}
            onClick={() => onSelect(l)}
            className="group rounded-xl border border-border bg-card p-3 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-grab active:cursor-grabbing"
          >
            <div className="flex items-center gap-2">
              {l.avatar ? (
                <img src={l.avatar} alt={l.name} className="h-7 w-7 rounded-lg object-cover shrink-0" />
              ) : (
                <div className="h-7 w-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold">{l.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {l.service.toLowerCase().includes("insurance")
                    ? `${l.policyType || "Insurance"} · ${l.clientCompany || "—"}`
                    : l.destination}
                </p>
              </div>
              <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            {l.budget > 0 && (
              <p className="mt-1.5 text-xs font-bold text-primary">{formatINR(l.budget)}</p>
            )}
            <p className="mt-1 text-xs font-medium text-muted-foreground">{SERVICE_ICONS[l.service]} {l.service}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {PRIORITY_BADGE[l.priority]} · {l.service.toLowerCase().includes("insurance") ? (l.insuranceDate || l.travelDate) : l.travelDate}
            </p>
          </button>
        ))}
        {leads.length === 0 && (
          <div className="py-6 text-center text-xs text-muted-foreground/50">No leads</div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
function LeadsPage() {
  const [leads, setLeads] = useLocalStorage<ExtLead[]>("crm_leads_v2", []);
  const [localEmployees] = useLocalStorage<any[]>("crm_employees_v3", INITIAL_EMPLOYEES);
  const employees = localEmployees?.length ? localEmployees : INITIAL_EMPLOYEES;
  const [newNote, setNewNote] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "All">("All");
  const [view, setView] = useState<"table" | "kanban">("table");
  const [showModal, setShowModal] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selected, setSelected] = useState<ExtLead | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const auth = getAuth();
  const isAdmin = auth?.role === "admin" || auth?.role === "HR & Admin Manager";

  const assignees = Array.from(new Set([
    ...(employees.map((e: any) => e.name)),
    ...(auth?.name ? [auth.name] : []),
    "Other"
  ]));

  const exportToExcel = () => {
    const headers = ["ID", "Name", "Phone", "Email", "Destination", "Budget", "Travel Date", "Pax", "Source", "Reference", "Status", "Assigned To", "Service", "Priority", "Created At"];
    const csvRows = [
      headers.join(","),
      ...filtered.map(l => [
        `"${l.id}"`,
        `"${l.name.replace(/"/g, '""')}"`,
        `"${l.phone}"`,
        `"${l.email}"`,
        `"${l.destination.replace(/"/g, '""')}"`,
        l.budget,
        `"${l.travelDate}"`,
        l.pax,
        `"${l.source}"`,
        `"${l.reference || ""}"`,
        `"${l.status}"`,
        `"${l.assignedTo}"`,
        `"${l.service}"`,
        `"${l.priority}"`,
        `"${l.createdAt}"`
      ].join(","))
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToWord = () => {
    const tableHeader = "<tr><th>ID</th><th>Name</th><th>Phone</th><th>Destination</th><th>Budget</th><th>Travel Date</th><th>Status</th><th>Priority</th></tr>";
    const tableRows = filtered.map(l =>
      `<tr><td>${l.id}</td><td>${l.name}</td><td>${l.phone}</td><td>${l.destination}</td><td>₹${l.budget}</td><td>${l.travelDate}</td><td>${l.status}</td><td>${l.priority}</td></tr>`
    ).join("");
    const htmlString = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Leads Export</title><style>table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; } th, td { border: 1px solid #dddddd; padding: 8px; text-align: left; } th { background-color: #f2f2f2; }</style></head>
      <body><h2>Grand Journeys CRM - Leads Export</h2><table>${tableHeader}${tableRows}</table></body>
      </html>
    `;
    const blob = new Blob([htmlString], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `leads_export_${new Date().toISOString().slice(0, 10)}.doc`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const tableHeader = "<tr><th>ID</th><th>Name</th><th>Phone</th><th>Destination</th><th>Budget</th><th>Travel Date</th><th>Status</th><th>Priority</th></tr>";
    const tableRows = filtered.map(l =>
      `<tr><td>${l.id}</td><td>${l.name}</td><td>${l.phone}</td><td>${l.destination}</td><td>₹${l.budget}</td><td>${l.travelDate}</td><td>${l.status}</td><td>${l.priority}</td></tr>`
    ).join("");
    printWindow.document.write(`
      <html>
      <head>
        <title>Leads Export PDF</title>
        <style>
          body { font-family: sans-serif; padding: 20px; color: #333; }
          h2 { color: #f43f5e; margin-bottom: 5px; }
          p { font-size: 12px; color: #666; margin-bottom: 20px; }
          table { border-collapse: collapse; width: 100%; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f9fafb; font-weight: bold; }
          tr:nth-child(even) { background-color: #f3f4f6; }
        </style>
      </head>
      <body>
        <h2>Grand Journeys CRM - Leads Export</h2>
        <p>Generated on ${new Date().toLocaleDateString("en-IN")} | Total Leads: ${filtered.length}</p>
        <table>
          <thead>${tableHeader}</thead>
          <tbody>${tableRows}</tbody>
        </table>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
          }
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleImportLeads = (data: any[]) => {
    const lmhLeads = leads.filter(l => l.id.startsWith("LMH-"));
    let nextNum = 1;
    if (lmhLeads.length > 0) {
      const nums = lmhLeads.map(l => {
        const parts = l.id.split("-");
        const n = parseInt(parts[1], 10);
        return isNaN(n) ? 0 : n;
      });
      nextNum = Math.max(...nums) + 1;
    }
    const pad = (num: number, size: number) => {
      let s = num + "";
      while (s.length < size) s = "0" + s;
      return s;
    };

    const importedLeads = data.map((row, idx) => ({
      id: `LMH-${pad(nextNum + idx, 3)}`,
      name: row["Name"] || row["name"] || "Unknown",
      phone: row["Phone"] || row["phone"] || "",
      email: row["Email"] || row["email"] || "",
      destination: row["Destination"] || row["destination"] || "Unknown",
      budget: parseInt(row["Budget"] || row["budget"]) || 0,
      travelDate: row["Travel Date"] || row["travelDate"] || new Date().toISOString().slice(0, 10),
      source: row["Source"] || row["source"] || SOURCES[0],
      reference: row["Reference"] || row["reference"] || "",
      status: "New Lead" as LeadStatus,
      assignedTo: assignees[0],
      pax: parseInt(row["Pax"] || row["Travellers"] || "2") || 2,
      notes: "",
      avatar: "",
      createdAt: new Date().toISOString().slice(0, 10),
      service: row["Service"] || row["service"] || "International Package",
      priority: row["Priority"] || row["priority"] || "Medium",
      packageType: row["PackageType"] || row["package type"] || "",
    }));
    setLeads(prev => [...importedLeads, ...prev]);
  };

  const filtered = leads.filter(
    (l) =>
      (filterStatus === "All" || l.status === filterStatus) &&
      (q === "" ||
        l.name.toLowerCase().includes(q.toLowerCase()) ||
        l.destination.toLowerCase().includes(q.toLowerCase()) ||
        l.id.toLowerCase().includes(q.toLowerCase()))
  );

  const addLead = (l: ExtLead) => { setLeads((prev) => [l, ...prev]); };

  const updateStatus = (id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => l.id === id ? { ...l, status } : l));
    setSelected((sel) => sel ? { ...sel, status } : sel);
  };

  const deleteLead = (id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    setSelected(null);
  };

  /* Stats */
  const totalBudget = leads.reduce((s, l) => s + l.budget, 0);
  const completedLeads = leads.filter((l) => l.status === "Completed").length;
  const newToday = leads.filter((l) => l.createdAt === new Date().toISOString().slice(0, 10)).length;
  const conversion = leads.length > 0 ? Math.round((completedLeads / leads.length) * 100) : 0;

  return (
    <>
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Leads</h1>
            <p className="mt-1 text-sm text-muted-foreground">Track every inquiry from first contact to booked trip.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 rounded-xl" onClick={() => setIsExportOpen(true)}>
              <Download className="h-4 w-4" /> Export Leads
            </Button>
            <Button variant="outline" className="gap-2 rounded-xl" onClick={() => setIsImportOpen(true)}>
              <Upload className="h-4 w-4" /> Import Leads
            </Button>
            <Button id="add-lead-btn" onClick={() => setShowModal(true)} className="gap-2 rounded-xl" style={{ background: "var(--gradient-brand)" }}>
              <Plus className="h-4 w-4" /> Add Lead
            </Button>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total Leads", value: leads.length, icon: <UserCheck className="h-4 w-4" />, color: "bg-blue-100 text-blue-600", sub: `${newToday} added today` },
            { label: "Completed", value: completedLeads, icon: <Sparkles className="h-4 w-4" />, color: "bg-emerald-100 text-emerald-600", sub: `${conversion}% conversion` },
            { label: "Total Pipeline", value: formatINR(totalBudget), icon: <IndianRupee className="h-4 w-4" />, color: "bg-primary/15 text-primary", sub: "Combined budgets" },
            { label: "Avg Budget", value: formatINR(leads.length ? Math.round(totalBudget / leads.length) : 0), icon: <TrendingUp className="h-4 w-4" />, color: "bg-violet-100 text-violet-600", sub: "Per lead" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${s.color}`}>{s.icon}</span>
              </div>
              <p className="mt-3 font-display text-2xl font-bold truncate">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Pipeline funnel strip ── */}
        <div className="flex overflow-x-auto rounded-2xl border border-border bg-card shadow-card">
          {STATUSES.map((s, i) => {
            const count = leads.filter((l) => l.status === s).length;
            const pct = leads.length ? Math.round((count / leads.length) * 100) : 0;
            return (
              <button
                key={s}
                onClick={() => setFilterStatus(filterStatus === s ? "All" : s)}
                className={`flex flex-1 min-w-[90px] flex-col items-center gap-1 border-r border-border px-4 py-4 text-center transition-colors last:border-r-0 hover:bg-secondary/50 ${filterStatus === s ? "bg-secondary" : ""}`}
              >
                <span className={`text-xl font-display font-bold ${filterStatus === s ? "text-primary" : ""}`}>{count}</span>
                <div className="h-1 w-full overflow-hidden rounded-full bg-border">
                  <div className={`h-full rounded-full ${STATUS_DOT[s]}`} style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{s}</span>
              </button>
            );
          })}
        </div>

        {/* ── Filter + view toggle ── */}
        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="relative max-w-xs flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, destination or ID..." className="pl-9 rounded-xl" />
          </div>
          <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
          <div className="flex flex-wrap gap-1.5">
            {(["All", ...STATUSES] as const).map((s) => (
              <button key={s} onClick={() => setFilterStatus(s as typeof filterStatus)}
                className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${filterStatus === s ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-background text-muted-foreground hover:bg-secondary"
                  }`}
              >
                {s !== "All" && <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[s as LeadStatus]}`} />}
                {s}
              </button>
            ))}
          </div>
          {/* View toggle */}
          <div className="ml-auto flex rounded-xl border border-border overflow-hidden">
            <button onClick={() => setView("table")} className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors ${view === "table" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
              <Table2 className="h-3.5 w-3.5" /> Table
            </button>
            <button onClick={() => setView("kanban")} className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-l border-border transition-colors ${view === "kanban" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}>
              <LayoutGrid className="h-3.5 w-3.5" /> Kanban
            </button>
          </div>
          <span className="text-xs text-muted-foreground">{filtered.length} leads</span>
        </div>

        {/* ── TABLE VIEW ── */}
        {view === "table" && (
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-5 py-3">Lead</th>
                    <th className="px-5 py-3">Destination / Company</th>
                    <th className="px-5 py-3">Service</th>
                    <th className="px-5 py-3">Budget</th>
                    <th className="px-5 py-3">Priority</th>
                    <th className="px-5 py-3">Assignee</th>
                    <th className="px-5 py-3">Status</th>
                    <th className="px-5 py-3">Created</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr><td colSpan={9} className="py-12 text-center text-muted-foreground text-sm">No leads match your filters.</td></tr>
                  )}
                  {filtered.map((l) => (
                    <tr key={l.id} className={`border-t border-border hover:bg-secondary/30 transition-colors border-l-4 ${STATUS_ACCENT[l.status]}`}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          {l.avatar ? (
                            <img src={l.avatar} alt={l.name} className="h-9 w-9 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="h-9 w-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                              <User className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold">{l.name}</p>
                            <p className="text-xs text-muted-foreground">{l.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          {l.service.toLowerCase().includes("insurance") ? (
                            <>
                              <Building2 className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span>{l.clientCompany || l.destination || "Insurance"}</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span>{l.destination}</span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-2 py-1 text-xs font-semibold">
                          <span>{SERVICE_ICONS[l.service]}</span>
                          {l.service}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-semibold text-primary">{formatINR(l.budget)}</td>
                      <td className="px-5 py-3.5 text-xs">{PRIORITY_BADGE[l.priority]}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold">
                            {initials(l.assignedTo)}
                          </span>
                          {l.assignedTo.split(" ")[0]}
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_PILL[l.status]}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[l.status]}`} />{l.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground text-xs whitespace-nowrap">{l.createdAt}</td>
                      <td className="px-5 py-3.5 text-right">
                        <Button size="sm" variant="ghost" className="rounded-xl gap-1 text-xs" onClick={() => setSelected(l)}>
                          View <ChevronRight className="h-3 w-3" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Table footer */}
            <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-5 py-3">
              <p className="text-xs text-muted-foreground">Showing {filtered.length} of {leads.length} leads</p>
              <p className="text-xs font-semibold text-muted-foreground">
                Pipeline: <span className="text-primary">{formatINR(filtered.reduce((s, l) => s + l.budget, 0))}</span>
              </p>
            </div>
          </div>
        )}

        {/* ── KANBAN VIEW ── */}
        {view === "kanban" && (
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-3 min-w-max">
              {STATUSES.map((s) => (
                <KanbanCol
                  key={s}
                  status={s}
                  leads={filtered.filter((l) => l.status === s)}
                  onSelect={setSelected}
                  onDropLead={(id) => updateStatus(id, s)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Modals ── */}
      <ImportModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImport={handleImportLeads}
        title="Import Leads"
        description="Upload a CSV or Excel file containing your leads. Make sure you have columns like Name, Phone, Email, Destination, etc."
      />
      {showModal && <AddLeadModal existingLeads={leads} onClose={() => setShowModal(false)} onAdd={(l) => { addLead(l); setShowModal(false); }} />}
      {selected && <LeadDetail lead={selected} onClose={() => setSelected(null)} onStatusChange={updateStatus} onDelete={deleteLead} isAdmin={isAdmin} onEditNote={(id, newNote) => {
        const newLeads = leads.map(x => x.id === id ? { ...x, notes: newNote } : x);
        setLeads(newLeads);
        setSelected(newLeads.find(x => x.id === id) || null);
      }} />}

      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-lg font-bold">Export Leads</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground mt-1">
              Export the current list of {filtered.length} leads in your preferred file format.
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
    </>
  );
}
