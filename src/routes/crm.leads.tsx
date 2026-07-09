import { createFileRoute } from "@tanstack/react-router";
import React, { useState } from "react";
import { getAuth } from "@/lib/auth";
import {
  Plus,
  Phone,
  Mail,
  Search,
  X,
  MapPin,
  IndianRupee,
  CalendarDays,
  Globe,
  TrendingUp,
  UserCheck,
  Users,
  ChevronRight,
  Filter,
  LayoutGrid,
  Table2,
  ListChecks,
  CheckCircle2,
  Circle,
  ChevronUp,
  ChevronDown,
  StickyNote,
  Sparkles,
  Upload,
  Briefcase,
  Package,
  AlertCircle,
  Download,
  FileText,
  User,
  Shield,
  Building2,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ImportLeadsModal } from "@/components/ui/import-leads-modal";
import { EmployeeProfileCard } from "@/components/EmployeeProfileCard";
import { leads as SEED_LEADS, formatINR, type Lead } from "@/lib/mock-data";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import type { ExtCustomer } from "./crm.customers";
import { INITIAL_EMPLOYEES } from "./crm.employees";

export const Route = createFileRoute("/crm/leads")({ component: LeadsPage });

/* ─── Extra fields for extended leads ─── */
interface ExtLead extends Lead {
  avatar: string;
  notes: string;
  noteDate?: string;
  allNotes?: { text: string; date: string }[];
  insuranceDate?: string;
  policyType?: string;
  queryType?: string;
  clientCompany?: string;
  expiryDate?: string;
  bookingReference?: string;
  vendorName?: string;
  hotelDetails?: string;
  totalAmount?: number;
  amountPaid?: number;
  paymentStatus?: "Pending" | "Partial" | "Paid";
  createdTime?: string;
  leadSection?: string;
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
  Instagram: "bg-pink-400",
  Facebook: "bg-blue-600",
  WhatsApp: "bg-emerald-700",
  "Walk-in": "bg-yellow-200",
  Website: "bg-primary/100",
  Referral: "bg-purple-300",
  Ads: "bg-gray-200",
  "DD Pharma": "bg-green-200",
  Other: "bg-pink-200",
  "Old Ref": "bg-blue-300",
  "BNI INC": "bg-green-400",
};
// DESTINATIONS kept for potential future use
const _DESTINATIONS = [
  "Bali",
  "Dubai",
  "Maldives",
  "Europe",
  "Thailand",
  "Singapore",
  "Kerala",
  "Rajasthan",
  "Japan",
  "Sri Lanka",
];
void _DESTINATIONS;

const SERVICES = [
  {
    group: "Travel Services",
    items: [
      { label: "Air Ticket", icon: "✈️" },
      { label: "Hotel Booking", icon: "🏨" },
      { label: "Visa", icon: "🛂" },
      { label: "Cruise Booking", icon: "🚢" },
      { label: "Passport Assistance", icon: "📘" },
      { label: "Forex Exchange", icon: "💱" },
      { label: "Airport Transfer", icon: "🚕" },
      { label: "Car Rental", icon: "🚗" },
      { label: "Train Ticket", icon: "🚆" },
      { label: "Bus Ticket", icon: "🚌" },
      { label: "Taxi Booking", icon: "🚕" },
      { label: "Travel Insurance", icon: "🛡️" },
    ],
  },
  {
    group: "Holiday Packages",
    items: [
      { label: "International Package", icon: "🌍" },
      { label: "Domestic Package", icon: "🏝" },
      { label: "Honeymoon Package", icon: "💖" },
      { label: "Family Package", icon: "👨‍👩‍👧‍👦" },
      { label: "Group Tour", icon: "🚌" },
      { label: "Corporate Tour", icon: "🏢" },
      { label: "Luxury Tour", icon: "✨" },
      { label: "Adventure Tour", icon: "🧗" },
    ],
  },
  {
    group: "Business",
    items: [
      { label: "Corporate Travel", icon: "💼" },
      { label: "MICE Events", icon: "🎤" },
      { label: "Conference Booking", icon: "🎟" },
    ],
  },
  { group: "Insurance Services", items: [{ label: "General Insurance", icon: "🛡️" }] },
];

const SERVICE_ICONS: Record<string, string> = SERVICES.reduce(
  (acc, group) => {
    group.items.forEach((item) => (acc[item.label] = item.icon));
    return acc;
  },
  {} as Record<string, string>,
);

const _LEADS_INIT: ExtLead[] = [];

/* ─── Status config ─── */
type LeadStatus = Lead["status"];
const STATUSES: LeadStatus[] = [
  "New Lead",
  "Contacted",
  "Quotation Sent",
  "Negotiation",
  "Payment Pending",
  "in process",
  "Confirmed",
  "Review Collected",
  "Lost",
];

const STATUS_PILL: Record<LeadStatus, string> = {
  "New Lead": "bg-blue-100 text-blue-700",
  Contacted: "bg-amber-100 text-amber-700",
  "Quotation Sent": "bg-cyan-100 text-cyan-700",
  Negotiation: "bg-purple-100 text-purple-700",
  Confirmed: "bg-teal-100 text-teal-700",
  "Payment Pending": "bg-rose-100 text-rose-700",
  "on conform": "bg-indigo-100 text-indigo-700",
  "in process": "bg-emerald-100 text-emerald-700",
  "Review Collected": "bg-pink-100 text-pink-700",
  Lost: "bg-slate-100 text-slate-700",
};

const STATUS_ACCENT: Record<LeadStatus, string> = {
  "New Lead": "border-l-blue-400",
  Contacted: "border-l-amber-400",
  "Quotation Sent": "border-l-cyan-400",
  Negotiation: "border-l-purple-400",
  Confirmed: "border-l-teal-400",
  "Payment Pending": "border-l-rose-400",
  "on conform": "border-l-indigo-400",
  "in process": "border-l-emerald-400",
  "Review Collected": "border-l-pink-400",
  Lost: "border-l-slate-400",
};

const STATUS_DOT: Record<LeadStatus, string> = {
  "New Lead": "bg-blue-500",
  Contacted: "bg-amber-500",
  "Quotation Sent": "bg-cyan-500",
  Negotiation: "bg-purple-500",
  Confirmed: "bg-teal-500",
  "Payment Pending": "bg-rose-500",
  "on conform": "bg-indigo-500",
  "in process": "bg-emerald-500",
  "Review Collected": "bg-pink-500",
  Lost: "bg-slate-500",
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
  if (!n) return "";
  return n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

/* ─── Add Lead Modal ─── */
const EMPTY_FORM = {
  name: "",
  phone: "",
  email: "",
  destination: "",
  budget: "",
  travelDate: "",
  source: SOURCES[0],
  leadSection: "B2C",
  reference: "",
  status: "New Lead" as LeadStatus,
  assignedTo: "",
  pax: "2",
  notes: "",
  service: "International Package",
  priority: "Medium" as Lead["priority"],
  packageType: "",
  insuranceDate: "",
  policyType: "Four Wheeler",
  queryType: "New",
  clientCompany: "",
  expiryDate: "",
  totalAmount: "",
  amountPaid: "",
  vendorName: "",
  whatsapp: "",
  adults: "2",
  children: "0",
  lastFollowUp: "",
  nextFollowUp: "",
};

function AddLeadModal({
  onClose,
  onAdd,
  existingLeads,
}: {
  onClose: () => void;
  onAdd: (l: ExtLead) => void;
  existingLeads: ExtLead[];
}) {
  const [customers] = useSupabaseTable<ExtCustomer[]>("customers", []);
  const [localEmployees] = useSupabaseTable<unknown[]>("employees", INITIAL_EMPLOYEES);
  const employees = localEmployees?.length ? localEmployees : INITIAL_EMPLOYEES;
  const auth = getAuth();
  const assignees = Array.from(
    new Set([...employees.map((e: any) => e.name), ...(auth?.name ? [auth.name] : []), "Other"]),
  );

  const [form, setForm] = useState({ ...EMPTY_FORM, assignedTo: assignees[0] || "" });

  const handleFetchCustomer = () => {
    const cleanPhone = form.phone.replace(/[^0-9+]/g, "");
    if (!cleanPhone) {
      alert("Please enter a phone number to fetch.");
      return;
    }
    const found = customers.find((c) => c.phone && c.phone.replace(/[^0-9+]/g, "").includes(cleanPhone));
    if (found) {
      setForm((f) => ({
        ...f,
        name: found.name || f.name,
        email: found.email || f.email,
        whatsapp: (found as any).whatsapp || f.whatsapp || "",
      }));
    } else {
      alert("No customer found with this phone number.");
    }
  };

  const isInsurance = form.service?.toLowerCase().includes("insurance");
  const canSubmit = isInsurance
    ? form.name.trim() && form.phone.trim() && form.insuranceDate
    : form.name.trim() && form.phone.trim() && form.destination && form.travelDate;

  const set =
    (k: keyof typeof EMPTY_FORM) =>
      (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
        setForm((f) => ({ ...f, [k]: e.target.value }));

  const fieldCls =
    "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow";

  const submit = () => {
    if (!canSubmit) return;
    const isDuplicate = existingLeads.some(
      (l) =>
        l.phone === form.phone ||
        (form.email && l.email?.toLowerCase() === form.email.toLowerCase())
    );
    if (isDuplicate) {
      alert("A lead with this phone number or email already exists.");
      return;
    }
    const lmhLeads = existingLeads.filter((l) => l.id?.startsWith("T-"));
    let nextNum = 1;
    if (lmhLeads.length > 0) {
      const nums = lmhLeads.map((l) => {
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
    const id = `T-${pad(nextNum, 3)}`;
    onAdd({
      id,
      name: form.name,
      phone: form.phone,
      email: form.email,
      destination: isInsurance ? form.clientCompany || "Insurance" : form.destination,
      budget: isInsurance ? 0 : Number(form.budget) || 0,
      travelDate: isInsurance ? form.insuranceDate : form.travelDate,
      status: form.status,
      source: form.source,
      reference: form.reference,
      createdAt: new Date().toISOString().slice(0, 10),
      createdTime: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true }),
      avatar: "",
      assignedTo: form.assignedTo,
      notes: form.notes,
      pax: isInsurance ? 1 : Number(form.pax) || 2,
      service: form.service,
      priority: form.priority,
      packageType: isInsurance ? `${form.policyType} (${form.queryType})` : form.packageType,
      insuranceDate: isInsurance ? form.insuranceDate : undefined,
      policyType: isInsurance ? form.policyType : undefined,
      queryType: isInsurance ? form.queryType : undefined,
      clientCompany: isInsurance ? form.clientCompany : undefined,
      expiryDate: isInsurance ? form.expiryDate : undefined,
      totalAmount: form.totalAmount ? Number(form.totalAmount) : undefined,
      amountPaid: form.amountPaid ? Number(form.amountPaid) : undefined,
      vendorName: form.vendorName || undefined,
      whatsapp: form.whatsapp || form.phone,
      adults: Number(form.adults) || 2,
      children: Number(form.children) || 0,
      lastFollowUp: form.lastFollowUp || undefined,
      nextFollowUp: form.nextFollowUp || undefined,
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="w-full sm:max-w-2xl flex flex-col overflow-hidden max-h-[90vh] rounded-t-3xl sm:rounded-3xl border border-border bg-background shadow-2xl animate-float-up"
        style={{ animationDuration: "0.25s" }}
      >
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border sm:hidden" />

        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 pt-5 pb-4">
          <div className="flex items-center gap-3">
            <span
              className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Plus className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold">Add New Lead</h2>
              <p className="text-xs text-muted-foreground">Enter inquiry details below</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-secondary transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-4 px-6 pt-5 pb-6 sm:grid-cols-2 overflow-y-auto">
          {/* Service */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold">
              Service <span className="text-red-500">*</span>
            </label>
            <select
              id="lead-service"
              value={form.service}
              onChange={set("service")}
              className={fieldCls}
            >
              {SERVICES.map((g) => (
                <optgroup key={g.group} label={g.group}>
                  {g.items.map((i) => (
                    <option key={i.label} value={i.label}>
                      {i.icon} {i.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
          {/* Name */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold">
              Full name <span className="text-red-500">*</span>
            </label>
            <Input
              id="lead-name"
              placeholder="e.g. Priya Sharma"
              value={form.name}
              onChange={set("name")}
              className="rounded-xl"
            />
          </div>
          {/* Phone */}
          <div>
            <label className="mb-1.5 flex items-center justify-between text-sm font-semibold">
              <span>Phone <span className="text-red-500">*</span></span>
              <button
                type="button"
                onClick={handleFetchCustomer}
                className="text-xs text-primary hover:underline font-normal flex items-center gap-1"
              >
                <Search className="h-3 w-3" /> Find
              </button>
            </label>
            <Input
              id="lead-phone"
              type="tel"
              placeholder="+91 98200 00000"
              value={form.phone}
              onChange={(e) => {
                const val = e.target.value.replace(/[^0-9+\s-]/g, "");
                setForm((f) => ({ ...f, phone: val }));
              }}
              className="rounded-xl"
            />
          </div>
          {/* WhatsApp */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">WhatsApp</label>
            <Input
              id="lead-whatsapp"
              placeholder="+91 98200 00000"
              value={form.whatsapp}
              onChange={set("whatsapp")}
              className="rounded-xl"
            />
          </div>
          {/* Email */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Email</label>
            <Input
              id="lead-email"
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={set("email")}
              className="rounded-xl"
            />
          </div>
          {/* Travelers details */}
          {!isInsurance && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Adults</label>
                <Input
                  id="lead-adults"
                  type="number"
                  value={form.adults}
                  onChange={set("adults")}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Children</label>
                <Input
                  id="lead-children"
                  type="number"
                  value={form.children}
                  onChange={set("children")}
                  className="rounded-xl"
                />
              </div>
            </div>
          )}

          {isInsurance ? (
            <>
              {/* Expiry Date */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Expiry Date</label>
                <Input
                  id="lead-exp-date"
                  type="date"
                  value={form.expiryDate}
                  onChange={set("expiryDate")}
                  className="rounded-xl"
                />
              </div>
              {/* Policy Type */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Policy Type</label>
                <select
                  id="lead-policy-type"
                  value={form.policyType}
                  onChange={set("policyType")}
                  className={fieldCls}
                >
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
                <select
                  id="lead-query-type"
                  value={form.queryType}
                  onChange={set("queryType")}
                  className={fieldCls}
                >
                  <option>New</option>
                  <option>Renewal</option>
                  <option>Expired</option>
                </select>
              </div>
              {/* Client / Company */}
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-semibold">Client / Company</label>
                <Input
                  id="lead-client-company"
                  placeholder="e.g. Acme Corp..."
                  value={form.clientCompany}
                  onChange={set("clientCompany")}
                  className="rounded-xl"
                />
              </div>
            </>
          ) : (
            <>
              {/* Destination */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">
                  Destination <span className="text-red-500">*</span>
                </label>
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
                <label className="mb-1.5 block text-sm font-semibold">
                  Travel date <span className="text-red-500">*</span>
                </label>
                <Input
                  id="lead-date"
                  type="date"
                  value={form.travelDate}
                  onChange={set("travelDate")}
                  className="rounded-xl"
                />
              </div>
              {/* Budget */}
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Budget (₹)</label>
                <Input
                  id="lead-budget"
                  type="number"
                  placeholder="e.g. 85000"
                  value={form.budget}
                  onChange={set("budget")}
                  className="rounded-xl"
                />
              </div>

            </>
          )}
          {/* Source */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Source</label>
            <Select
              value={form.source}
              onValueChange={(val) => setForm((prev) => ({ ...prev, source: val }))}
            >
              <SelectTrigger
                id="lead-source"
                className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm h-10 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
              >
                <SelectValue placeholder="Select a source" />
              </SelectTrigger>
              <SelectContent>
                {SOURCES.map((s) => (
                  <SelectItem key={s} value={s}>
                    <div className="flex items-center gap-2">
                      <span
                        className={`h-3 w-3 rounded-full ${SOURCE_COLORS[s] || "bg-gray-200"}`}
                      />
                      {s}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Lead Section */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Lead Section</label>
            <select
              id="lead-section"
              value={form.leadSection}
              onChange={set("leadSection")}
              className={fieldCls}
            >
              <option value="B2C">B2C</option>
              <option value="B2B">B2B</option>
              <option value="Corporate">Corporate</option>
              <option value="Other">Other</option>
            </select>
          </div>
          {/* Reference */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Reference</label>
            <Input
              id="lead-reference"
              placeholder="e.g. Jatin jangid"
              value={form.reference}
              onChange={set("reference")}
              className="rounded-xl"
            />
          </div>
          {/* Assignee */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Assign to</label>
            <select
              id="lead-assignee"
              value={form.assignedTo}
              onChange={set("assignedTo")}
              className={fieldCls}
            >
              {assignees.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>

id          {/* Priority */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Priority</label>
            <select
              id="lead-priority"
              value={form.priority}
              onChange={set("priority")}
              className={fieldCls}
            >
              <option value="High">🔴 High</option>
              <option value="Medium">🟡 Medium</option>
              <option value="Low">🟢 Low</option>
            </select>
          </div>
          {/* Package Type */}
          {!isInsurance && (
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Package Type</label>
              <Input
                id="lead-packageType"
                placeholder="e.g. Honeymoon, Custom"
                value={form.packageType}
                onChange={set("packageType")}
                className="rounded-xl"
              />
            </div>
          )}


          {/* Booking / Payment Details */}
          {["on conform", "in process"].includes(form.status) && (
            <div className="sm:col-span-2 grid gap-4 rounded-xl border border-border p-4 bg-secondary/30 sm:grid-cols-3">
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Vendor Name</label>
                <Input
                  id="lead-vendorName"
                  placeholder="e.g. Yes Hotels..."
                  value={form.vendorName}
                  onChange={set("vendorName")}
                  className="rounded-xl bg-background"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Total Amount (₹)</label>
                <Input
                  id="lead-totalAmount"
                  type="number"
                  placeholder="e.g. 50000"
                  value={form.totalAmount}
                  onChange={set("totalAmount")}
                  className="rounded-xl bg-background"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold">Amount Paid (₹)</label>
                <Input
                  id="lead-amountPaid"
                  type="number"
                  placeholder="e.g. 10000"
                  value={form.amountPaid}
                  onChange={set("amountPaid")}
                  className="rounded-xl bg-background"
                />
              </div>
            </div>
          )}

          {/* Notes / Description */}
          <div className="sm:col-span-2">
            <label className="mb-1.5 block text-sm font-semibold">
              {isInsurance ? "Description" : "Notes"}{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </label>
            <textarea
              id="lead-notes"
              rows={2}
              placeholder={
                isInsurance
                  ? "Policy details or description..."
                  : "Any special requests or context..."
              }
              value={form.notes}
              onChange={set("notes")}
              className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
            />
          </div>
          {/* Actions */}
          <div className="flex gap-3 sm:col-span-2">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
              Cancel
            </Button>
            <Button
              id="submit-lead-btn"
              className="flex-1 gap-2 rounded-xl"
              disabled={!canSubmit}
              style={{ background: canSubmit ? "var(--gradient-brand)" : undefined }}
              onClick={submit}
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
function LeadDetail({
  lead,
  onClose,
  onStatusChange,
  onDelete,
  isAdmin,
  assignees,
  onEditNote,
  onUpdateLead,
}: {
  lead: ExtLead;
  onClose: () => void;
  onStatusChange: (id: string, s: LeadStatus) => void;
  onDelete: (id: string) => void;
  isAdmin: boolean;
  assignees?: string[];
  onEditNote?: (id: string, newNote: string) => void;
  onUpdateLead?: (id: string, updates: Partial<ExtLead>) => void;
}) {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editNoteText, setEditNoteText] = useState(lead.notes || "");
  const [newNoteText, setNewNoteText] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [isEditingBooking, setIsEditingBooking] = useState(false);
  const [bookingDetails, setBookingDetails] = useState({
    bookingReference: lead.bookingReference || "",
    vendorName: lead.vendorName || "",
    hotelDetails: lead.hotelDetails || "",
    totalAmount: lead.totalAmount || 0,
    amountPaid: lead.amountPaid || 0,
    paymentStatus: lead.paymentStatus || "Pending",
  });

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactDetails, setContactDetails] = useState({
    phone: lead.phone || "",
    email: lead.email || "",
  });

  const [isEditingTrip, setIsEditingTrip] = useState(false);
  const [tripDetails, setTripDetails] = useState({
    destination: lead.destination || "",
    budget: lead.budget || 0,
    travelDate: lead.travelDate || "",
    pax: lead.pax || 2,
    adults: lead.adults || 2,
    children: lead.children || 0,
    whatsapp: lead.whatsapp || lead.phone || "",
    nextFollowUp: lead.nextFollowUp || "",
    source: lead.source || "Direct",
    service: lead.service || "International Package",
    priority: lead.priority || "Medium",
    expiryDate: lead.expiryDate || "",
    policyType: lead.policyType || "",
    queryType: lead.queryType || "",
    clientCompany: lead.clientCompany || "",
    reference: lead.reference || "",
    packageType: lead.packageType || "",
    leadSection: lead.leadSection || "",
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="flex w-full max-w-2xl max-h-[90vh] flex-col overflow-y-auto bg-background shadow-2xl rounded-2xl animate-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="font-display text-xl font-bold">Lead Detail</h2>
          <button onClick={onClose} className="rounded-xl p-2 hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 space-y-6 p-6">
          <div className="flex items-center gap-4">
            {lead.avatar ? (
              <img
                src={lead.avatar}
                alt={lead.name}
                className="h-16 w-16 rounded-2xl object-cover shrink-0"
              />
            ) : (
              <div className="h-16 w-16 rounded-2xl bg-gray-100 border border-border flex items-center justify-center shrink-0">
                <User className="h-8 w-8 text-gray-400" />
              </div>
            )}
            <div>
              <p className="font-display text-xl font-bold">{lead.name}</p>
              <p className="text-sm text-muted-foreground">
                {lead.id} · Created {lead.createdAt}
              </p>
              <div className="mt-2">
                <Select
                  value={lead.status}
                  onValueChange={(val: LeadStatus) => onStatusChange(lead.id, val)}
                >
                  <SelectTrigger
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border-none h-auto w-auto focus:ring-0 focus:ring-offset-0 shadow-none [&>svg]:hidden ${STATUS_PILL[lead.status]}`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[lead.status]}`} />
                      <SelectValue />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s} className="text-xs">
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact info */}
          <div className="grid gap-3 rounded-2xl border border-border bg-secondary/30 p-4">
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Contact
              </p>
              {isAdmin && onUpdateLead && !isEditingContact && (
                <button
                  onClick={() => setIsEditingContact(true)}
                  className="text-[10px] text-blue-500 hover:underline"
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingContact ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-semibold uppercase text-muted-foreground">Phone</label>
                    <Input
                      type="tel"
                      value={contactDetails.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9+\s-]/g, "");
                        setContactDetails({ ...contactDetails, phone: val });
                      }}
                      className="h-8 mt-1 text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase text-muted-foreground">Email</label>
                    <Input
                      type="email"
                      value={contactDetails.email}
                      onChange={(e) => setContactDetails({ ...contactDetails, email: e.target.value })}
                      className="h-8 mt-1 text-xs"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-border/50">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs flex-1 rounded-lg"
                    onClick={() => setIsEditingContact(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-xs flex-1 rounded-lg"
                    onClick={() => {
                      onUpdateLead?.(lead.id, contactDetails);
                      setIsEditingContact(false);
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href={`tel:${lead.phone}`} className="hover:underline">
                    {lead.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href={`mailto:${lead.email}`} className="hover:underline">
                    {lead.email || "—"}
                  </a>
                </div>
              </>
            )}
          </div>

          {/* Trip details */}
          <div className="grid gap-3 rounded-2xl border border-border bg-secondary/30 p-4">
            <div className="flex justify-between items-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {lead.service?.toLowerCase().includes("insurance")
                  ? "Insurance Details"
                  : "Trip Details"}
              </p>
              {isAdmin && onUpdateLead && !isEditingTrip && (
                <button
                  onClick={() => setIsEditingTrip(true)}
                  className="text-[10px] text-blue-500 hover:underline"
                >
                  Edit Details
                </button>
              )}
            </div>

            {isEditingTrip ? (
              <div className="space-y-4 animate-in fade-in">
                <div className="space-y-3">
                  {!lead.service?.toLowerCase().includes("insurance") && (
                    <>
                      <div>
                        <label className="text-[10px] font-semibold uppercase text-muted-foreground">Destination</label>
                        <Input
                          value={tripDetails.destination}
                          onChange={(e) => setTripDetails({ ...tripDetails, destination: e.target.value })}
                          className="h-8 mt-1 text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-semibold uppercase text-muted-foreground">Budget</label>
                          <Input
                            type="number"
                            value={tripDetails.budget}
                            onChange={(e) => setTripDetails({ ...tripDetails, budget: Number(e.target.value) })}
                            className="h-8 mt-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold uppercase text-muted-foreground">Travel Date</label>
                          <Input
                            type="date"
                            value={tripDetails.travelDate}
                            onChange={(e) => setTripDetails({ ...tripDetails, travelDate: e.target.value })}
                            className="h-8 mt-1 text-xs"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-semibold uppercase text-muted-foreground">Adults</label>
                          <Input
                            type="number"
                            value={tripDetails.adults}
                            onChange={(e) => setTripDetails({ ...tripDetails, adults: Number(e.target.value), pax: Number(e.target.value) + Number(tripDetails.children) })}
                            className="h-8 mt-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold uppercase text-muted-foreground">Children</label>
                          <Input
                            type="number"
                            value={tripDetails.children}
                            onChange={(e) => setTripDetails({ ...tripDetails, children: Number(e.target.value), pax: Number(tripDetails.adults) + Number(e.target.value) })}
                            className="h-8 mt-1 text-xs"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-semibold uppercase text-muted-foreground">Package Type</label>
                          <Input
                            value={tripDetails.packageType}
                            onChange={(e) => setTripDetails({ ...tripDetails, packageType: e.target.value })}
                            className="h-8 mt-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold uppercase text-muted-foreground">Service</label>
                          <select
                            value={tripDetails.service}
                            onChange={(e) => setTripDetails({ ...tripDetails, service: e.target.value })}
                            className="flex h-8 mt-1 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            {Object.keys(SERVICE_ICONS).map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </>
                  )}
                  {lead.service?.toLowerCase().includes("insurance") && (
                    <>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-semibold uppercase text-muted-foreground">Expiry Date</label>
                          <Input
                            type="date"
                            value={tripDetails.expiryDate}
                            onChange={(e) => setTripDetails({ ...tripDetails, expiryDate: e.target.value })}
                            className="h-8 mt-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold uppercase text-muted-foreground">Policy Type</label>
                          <Input
                            value={tripDetails.policyType}
                            onChange={(e) => setTripDetails({ ...tripDetails, policyType: e.target.value })}
                            className="h-8 mt-1 text-xs"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-semibold uppercase text-muted-foreground">Query Type</label>
                          <Input
                            value={tripDetails.queryType}
                            onChange={(e) => setTripDetails({ ...tripDetails, queryType: e.target.value })}
                            className="h-8 mt-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold uppercase text-muted-foreground">Client/Company</label>
                          <Input
                            value={tripDetails.clientCompany}
                            onChange={(e) => setTripDetails({ ...tripDetails, clientCompany: e.target.value })}
                            className="h-8 mt-1 text-xs"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-muted-foreground">Priority</label>
                      <select
                        value={tripDetails.priority}
                        onChange={(e) => setTripDetails({ ...tripDetails, priority: e.target.value as "High" | "Medium" | "Low" })}
                        className="flex h-8 mt-1 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-muted-foreground">Source</label>
                      <select
                        value={tripDetails.source}
                        onChange={(e) => setTripDetails({ ...tripDetails, source: e.target.value })}
                        className="flex h-8 mt-1 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {Object.keys(SOURCE_ICONS).map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase text-muted-foreground">Section</label>
                      <select
                        value={tripDetails.leadSection}
                        onChange={(e) => setTripDetails({ ...tripDetails, leadSection: e.target.value })}
                        className="flex h-8 mt-1 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="B2C">B2C</option>
                        <option value="B2B">B2B</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-semibold uppercase text-muted-foreground">Next Follow-up</label>
                    <Input
                      type="date"
                      value={tripDetails.nextFollowUp}
                      onChange={(e) => setTripDetails({ ...tripDetails, nextFollowUp: e.target.value })}
                      className="h-8 mt-1 text-xs"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t border-border/50">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs flex-1 rounded-lg"
                    onClick={() => setIsEditingTrip(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="h-8 text-xs flex-1 rounded-lg"
                    onClick={() => {
                      onUpdateLead?.(lead.id, tripDetails);
                      setIsEditingTrip(false);
                    }}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
              {lead.service?.toLowerCase().includes("insurance")
                ? [
                  {
                    icon: <CalendarDays className="h-4 w-4 text-primary" />,
                    label: "Expiry Date",
                    val: lead.expiryDate || "—",
                  },
                  {
                    icon: <Shield className="h-4 w-4 text-primary" />,
                    label: "Policy Type",
                    val: lead.policyType || "—",
                  },
                  {
                    icon: <AlertCircle className="h-4 w-4 text-primary" />,
                    label: "Query Type",
                    val: lead.queryType || "—",
                  },
                  {
                    icon: <Building2 className="h-4 w-4 text-primary" />,
                    label: "Client / Company",
                    val: lead.clientCompany || "—",
                  },
                  {
                    icon: <UserCheck className="h-4 w-4 text-primary" />,
                    label: "Reference",
                    val: lead.reference || "—",
                  },
                  {
                    icon: <Globe className="h-4 w-4 text-primary" />,
                    label: "Source",
                    val: `${SOURCE_ICONS[lead.source] || ""} ${lead.source}`,
                  },
                  {
                    icon: <Globe className="h-4 w-4 text-primary" />,
                    label: "Section",
                    val: lead.leadSection || "—",
                  },
                  {
                    icon: <Briefcase className="h-4 w-4 text-primary" />,
                    label: "Service",
                    val: `${SERVICE_ICONS[lead.service] || ""} ${lead.service}`,
                  },
                ].map((r) => (
                  <div key={r.label} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0">{r.icon}</span>
                    <div>
                      <p className="text-xs text-muted-foreground">{r.label}</p>
                      <p className="text-sm font-semibold">{r.val}</p>
                    </div>
                  </div>
                ))
                : [
                  {
                    icon: <MapPin className="h-4 w-4 text-primary" />,
                    label: "Destination",
                    val: lead.destination,
                  },
                  {
                    icon: <IndianRupee className="h-4 w-4 text-primary" />,
                    label: "Budget",
                    val: formatINR(lead.budget),
                  },
                  {
                    icon: <CalendarDays className="h-4 w-4 text-primary" />,
                    label: "Travel Date",
                    val: lead.travelDate,
                  },
                  {
                    icon: <Users className="h-4 w-4 text-primary" />,
                    label: "Travellers",
                    val: `${lead.pax} pax (Adults: ${lead.adults || 2}, Children: ${lead.children || 0})`,
                  },
                  {
                    icon: <Phone className="h-4 w-4 text-primary" />,
                    label: "WhatsApp",
                    val: lead.whatsapp || lead.phone,
                  },
                  {
                    icon: <CalendarDays className="h-4 w-4 text-primary" />,
                    label: "Next Follow-up",
                    val: lead.nextFollowUp || "Not scheduled",
                  },
                  {
                    icon: <Globe className="h-4 w-4 text-primary" />,
                    label: "Source",
                    val: `${SOURCE_ICONS[lead.source] || ""} ${lead.source}`,
                  },
                  {
                    icon: <Globe className="h-4 w-4 text-primary" />,
                    label: "Section",
                    val: lead.leadSection || "—",
                  },
                  {
                    icon: <Briefcase className="h-4 w-4 text-primary" />,
                    label: "Service",
                    val: `${SERVICE_ICONS[lead.service] || ""} ${lead.service}`,
                  },
                  {
                    icon: <Package className="h-4 w-4 text-primary" />,
                    label: "Package",
                    val: lead.packageType || "—",
                  },
                  {
                    icon: <AlertCircle className="h-4 w-4 text-primary" />,
                    label: "Priority",
                    val: PRIORITY_BADGE[lead.priority] || lead.priority,
                  },
                ].map((r) => (
                  <div key={r.label} className="flex items-start gap-2">
                    <span className="mt-0.5 shrink-0">{r.icon}</span>
                    <div>
                      <p className="text-xs text-muted-foreground">{r.label}</p>
                      <p className="text-sm font-semibold">{r.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Booking & Payment Details */}
          {(lead.status === "on conform" ||
            lead.status === "in process" ||
            lead.bookingReference ||
            isEditingBooking) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Booking & Payment
                  </p>
                  {isAdmin && onUpdateLead && !isEditingBooking && (
                    <button
                      onClick={() => setIsEditingBooking(true)}
                      className="text-[10px] text-blue-500 hover:underline"
                    >
                      Edit Details
                    </button>
                  )}
                </div>

                {isEditingBooking ? (
                  <div className="rounded-2xl border border-border bg-secondary/30 p-4 space-y-4 animate-in fade-in">
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-semibold uppercase text-muted-foreground">
                          Vendor Name
                        </label>
                        <Input
                          value={bookingDetails.vendorName}
                          onChange={(e) =>
                            setBookingDetails({ ...bookingDetails, vendorName: e.target.value })
                          }
                          className="h-8 mt-1 text-xs"
                          placeholder="e.g. MakeMyTrip"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase text-muted-foreground">
                          Booking Ref / PNR
                        </label>
                        <Input
                          value={bookingDetails.bookingReference}
                          onChange={(e) =>
                            setBookingDetails({ ...bookingDetails, bookingReference: e.target.value })
                          }
                          className="h-8 mt-1 text-xs"
                          placeholder="e.g. PNR12345"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase text-muted-foreground">
                          Hotel Details
                        </label>
                        <Input
                          value={bookingDetails.hotelDetails}
                          onChange={(e) =>
                            setBookingDetails({ ...bookingDetails, hotelDetails: e.target.value })
                          }
                          className="h-8 mt-1 text-xs"
                          placeholder="e.g. Taj Hotel, 3 Nights"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-semibold uppercase text-muted-foreground">
                            Total Amount
                          </label>
                          <Input
                            type="number"
                            value={bookingDetails.totalAmount}
                            onChange={(e) =>
                              setBookingDetails({
                                ...bookingDetails,
                                totalAmount: Number(e.target.value),
                              })
                            }
                            className="h-8 mt-1 text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-semibold uppercase text-muted-foreground">
                            Amount Paid
                          </label>
                          <Input
                            type="number"
                            value={bookingDetails.amountPaid}
                            onChange={(e) =>
                              setBookingDetails({
                                ...bookingDetails,
                                amountPaid: Number(e.target.value),
                              })
                            }
                            className="h-8 mt-1 text-xs"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold uppercase text-muted-foreground">
                          Payment Status
                        </label>
                        <select
                          value={bookingDetails.paymentStatus}
                          onChange={(e) =>
                            setBookingDetails({
                              ...bookingDetails,
                              paymentStatus: e.target.value as "Pending" | "Partial" | "Paid",
                            })
                          }
                          className="flex h-8 mt-1 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Partial">Partial</option>
                          <option value="Paid">Paid</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2 border-t border-border/50">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs flex-1 rounded-lg"
                        onClick={() => setIsEditingBooking(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 text-xs flex-1 rounded-lg"
                        onClick={() => {
                          onUpdateLead?.(lead.id, bookingDetails);
                          setIsEditingBooking(false);
                        }}
                      >
                        Save Details
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-border p-4 space-y-3 bg-secondary/10">
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2">
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                          Vendor
                        </p>
                        <p className="text-xs font-medium mt-0.5">{lead.vendorName || "—"}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                          Ref / PNR
                        </p>
                        <p className="text-xs font-medium mt-0.5">{lead.bookingReference || "—"}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                          Hotel
                        </p>
                        <p className="text-xs font-medium mt-0.5">{lead.hotelDetails || "—"}</p>
                      </div>
                    </div>

                    <div className="border-t border-border pt-3 mt-1 grid grid-cols-3 gap-2">
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                          Total
                        </p>
                        <p className="text-xs font-semibold mt-0.5">
                          {formatINR(lead.totalAmount || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                          Paid
                        </p>
                        <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                          {formatINR(lead.amountPaid || 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                          Status
                        </p>
                        <div className="mt-1">
                          <span
                            className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${lead.paymentStatus === "Paid"
                                ? "bg-emerald-100 text-emerald-700"
                                : lead.paymentStatus === "Partial"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-rose-100 text-rose-700"
                              }`}
                          >
                            {lead.paymentStatus || "Pending"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Notes & Updates Feed */}
            <div className="mt-4 pt-3 border-t border-border border-dashed w-full block">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Notes & Updates
                </p>
              </div>

              <div className="space-y-3 max-h-[240px] overflow-y-auto pr-2 custom-scrollbar">
                {lead.allNotes && lead.allNotes.length > 0 ? (
                  lead.allNotes.map((note, idx) => (
                    <div key={idx} className="bg-secondary/20 rounded-xl p-3 border border-border/50 text-sm">
                      <p className="text-foreground whitespace-pre-wrap">{note.text}</p>
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground font-medium">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(note.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                ) : lead.notes ? (
                  <div className="bg-secondary/20 rounded-xl p-3 border border-border/50 text-sm">
                    <p className="text-foreground whitespace-pre-wrap">{lead.notes}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground font-medium">
                      <Calendar className="h-3 w-3" />
                      <span>{lead.noteDate ? new Date(lead.noteDate).toLocaleDateString() : "Legacy Note"}</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-xs text-muted-foreground bg-secondary/10 rounded-xl border border-dashed border-border">
                    No notes yet. Add one below.
                  </div>
                )}
              </div>

              {onUpdateLead && (
                <div className="mt-3 flex gap-2">
                  <Input
                    placeholder="Type an update..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && newNoteText.trim()) {
                        const noteDate = new Date().toISOString();
                        const currentNotes = lead.allNotes ? [...lead.allNotes] : [];
                        if (lead.notes && currentNotes.length === 0) {
                          currentNotes.push({ text: lead.notes, date: lead.noteDate || new Date().toISOString() });
                        }
                        currentNotes.push({ text: newNoteText.trim(), date: noteDate });
                        onUpdateLead(lead.id, { notes: newNoteText.trim(), noteDate, allNotes: currentNotes });
                        setNewNoteText("");
                      }
                    }}
                    className="h-9 text-xs flex-1 rounded-xl bg-background shadow-sm"
                  />
                  <Button 
                    size="sm" 
                    className="h-9 rounded-xl px-4 shrink-0 text-white shadow-sm" 
                    style={{ background: "var(--gradient-brand)" }}
                    onClick={() => {
                      if (newNoteText.trim()) {
                        const noteDate = new Date().toISOString();
                        const currentNotes = lead.allNotes ? [...lead.allNotes] : [];
                        if (lead.notes && currentNotes.length === 0) {
                          currentNotes.push({ text: lead.notes, date: lead.noteDate || new Date().toISOString() });
                        }
                        currentNotes.push({ text: newNoteText.trim(), date: noteDate });
                        onUpdateLead(lead.id, { notes: newNoteText.trim(), noteDate, allNotes: currentNotes });
                        setNewNoteText("");
                      }
                    }}
                    disabled={!newNoteText.trim()}
                  >
                    Add
                  </Button>
                </div>
              )}
            </div>

            {/* Assignee Card */}
            <div className="mt-4 pt-3 border-t border-border border-dashed w-full block">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Assigned To
              </p>
              {isAdmin && assignees && assignees.length > 0 ? (
                <select
                  value={lead.assignedTo}
                  onChange={(e) => onUpdateLead?.(lead.id, { assignedTo: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {assignees.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="scale-90 sm:scale-95 origin-top-left -mx-2 -mt-2">
                  <EmployeeProfileCard employeeName={lead.assignedTo} compact={true} />
                </div>
              )}
            </div>
          {/* WhatsApp Quick Actions */}
          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              💬 WhatsApp Customer Share
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  const url = window.location.origin + `/crm/portal?leadId=${lead.id}`;
                  const msg = `Hello ${lead.name},\n\nWe are excited to share your customized itinerary & quotation details for ${lead.destination}. You can view the details here:\n${url}\n\nWarm regards,\nLook My Holidays`;
                  window.open(
                    `https://wa.me/${lead.whatsapp || lead.phone}?text=${encodeURIComponent(msg)}`,
                    "_blank",
                  );
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 py-2 text-[10px] font-semibold text-emerald-800 dark:text-emerald-200 transition-colors cursor-pointer"
              >
                Send Itinerary
              </button>
              <button
                onClick={() => {
                  const url = window.location.origin + `/crm/portal?leadId=${lead.id}`;
                  const msg = `Dear ${lead.name},\n\nThis is a friendly reminder for the pending payment balance on your booking for ${lead.destination}. Please find booking invoice details at: ${url}`;
                  window.open(
                    `https://wa.me/${lead.whatsapp || lead.phone}?text=${encodeURIComponent(msg)}`,
                    "_blank",
                  );
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 py-2 text-[10px] font-semibold text-emerald-800 dark:text-emerald-200 transition-colors cursor-pointer"
              >
                Remind Payment
              </button>
              <button
                onClick={() => {
                  const url = window.location.origin + `/crm/portal?leadId=${lead.id}`;
                  const msg = `Hello ${lead.name},\n\nYour travel vouchers for ${lead.destination} are ready! Please download vouchers here: ${url}`;
                  window.open(
                    `https://wa.me/${lead.whatsapp || lead.phone}?text=${encodeURIComponent(msg)}`,
                    "_blank",
                  );
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 py-2 text-[10px] font-semibold text-emerald-800 dark:text-emerald-200 transition-colors cursor-pointer"
              >
                Send Vouchers
              </button>
              <button
                onClick={() => {
                  const msg = `Welcome back ${lead.name}! We hope you had a wonderful trip to ${lead.destination}. Please leave us feedback at: https://g.page/lookmyholidays/review`;
                  window.open(
                    `https://wa.me/${lead.whatsapp || lead.phone}?text=${encodeURIComponent(msg)}`,
                    "_blank",
                  );
                }}
                className="flex items-center justify-center gap-1.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 hover:bg-emerald-500/20 py-2 text-[10px] font-semibold text-emerald-800 dark:text-emerald-200 transition-colors cursor-pointer"
              >
                Request Review
              </button>
            </div>
          </div>


        </div>

        {/* Footer actions */}
        <div className="flex gap-3 border-t border-border p-6">
          {isAdmin && (
            <Button
              variant="destructive"
              className="flex-none gap-2 rounded-xl"
              onClick={() => setDeleteConfirmId(lead.id)}
            >
              <X className="h-4 w-4" /> Delete
            </Button>
          )}
          <Button
            variant="outline"
            className="flex-1 gap-2 rounded-xl"
            onClick={() => (window.location.href = `tel:${lead.phone}`)}
          >
            <Phone className="h-4 w-4" /> Call
          </Button>
          <Button
            className="flex-1 gap-2 rounded-xl"
            style={{ background: "var(--gradient-brand)" }}
            onClick={() =>
              (window.location.href = `mailto:${lead.email}?subject=Your Quote from Grand Journeys`)
            }
          >
            <Mail className="h-4 w-4" /> Send Quote
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in p-4">
          <div
            className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold font-display text-foreground">Delete Lead?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete this lead? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setDeleteConfirmId(null)}
                className="rounded-xl"
              >
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
function KanbanCol({
  status,
  leads,
  onSelect,
  onDropLead,
}: {
  status: LeadStatus;
  leads: ExtLead[];
  onSelect: (l: ExtLead) => void;
  onDropLead: (id: string) => void;
}) {
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

  const total = leads.reduce((s, l) => s + (Number(l.budget) || 0), 0);
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
        <span className="rounded-full bg-border px-2 py-0.5 text-xs font-semibold">
          {leads.length}
        </span>
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
                <img
                  src={l.avatar}
                  alt={l.name}
                  className="h-7 w-7 rounded-lg object-cover shrink-0"
                />
              ) : (
                <div className="h-7 w-7 rounded-lg bg-gray-100 border border-border flex items-center justify-center shrink-0">
                  <User className="h-4 w-4 text-gray-400" />
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold">{l.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {l.service?.toLowerCase().includes("insurance")
                    ? `${l.policyType || "Insurance"} · ${l.clientCompany || "—"}`
                    : l.destination}
                </p>
              </div>
              <ChevronRight className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            {l.budget > 0 && (
              <p className="mt-1.5 text-xs font-bold text-primary">{formatINR(l.budget)}</p>
            )}
            <p className="mt-1 text-xs font-medium text-muted-foreground">
              {SERVICE_ICONS[l.service]} {l.service}
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {PRIORITY_BADGE[l.priority]} ·{" "}
              {l.service?.toLowerCase().includes("insurance")
                ? l.insuranceDate || l.travelDate
                : l.travelDate}
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
  const [leads, setLeads] = useSupabaseTable<ExtLead[]>("leads", _LEADS_INIT);
  const [localEmployees] = useSupabaseTable<unknown[]>("employees", INITIAL_EMPLOYEES);
  const employees = localEmployees?.length ? localEmployees : INITIAL_EMPLOYEES;
  const [, setCustomers] = useSupabaseTable<ExtCustomer[]>("customers", []);
  const [newNote, setNewNote] = useState("");
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [filterStatus, setFilterStatus] = useState<LeadStatus | "All">("All");
  const [view, setView] = useState<"table" | "kanban">("table");
  const [showModal, setShowModal] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [selected, setSelected] = useState<ExtLead | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [editingTableNoteId, setEditingTableNoteId] = useState<string | null>(null);
  const [tableEditNoteText, setTableEditNoteText] = useState("");
  
  const [allTasks, setAllTasks] = useSupabaseTable<any[]>("tasks", []);
  const [tableEditTaskText, setTableEditTaskText] = useState("");
  const [editingTaskLeadId, setEditingTaskLeadId] = useState<string | null>(null);
  const auth = getAuth();
  const isAdmin = auth?.role === "admin" || auth?.role === "manager";

  const assignees = Array.from(
    new Set([...employees.map((e: any) => e.name), ...(auth?.name ? [auth.name] : []), "Other"]),
  );

  const exportToExcel = () => {
    const headers = [
      "ID",
      "Name",
      "Phone",
      "Email",
      "Destination",
      "Budget",
      "Travel Date",
      "Pax",
      "Source",
      "Reference",
      "Status",
      "Assigned To",
      "Service",
      "Priority",
      "Section",
      "Created At",
    ];
    const csvRows = [
      headers.join(","),
      ...filtered.map((l) =>
        [
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
          `"${l.leadSection || ""}"`,
          `"${l.createdAt}"`,
        ].join(","),
      ),
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
    const tableHeader =
      "<tr><th>ID</th><th>Name</th><th>Phone</th><th>Destination</th><th>Budget</th><th>Travel Date</th><th>Status</th><th>Priority</th><th>Section</th></tr>";
    const tableRows = filtered
      .map(
        (l) =>
          `<tr><td>${l.id}</td><td>${l.name}</td><td>${l.phone}</td><td>${l.destination}</td><td>₹${l.budget}</td><td>${l.travelDate}</td><td>${l.status}</td><td>${l.priority}</td></tr>`,
      )
      .join("");
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
    const tableHeader =
      "<tr><th>ID</th><th>Name</th><th>Phone</th><th>Destination</th><th>Budget</th><th>Travel Date</th><th>Status</th><th>Priority</th><th>Section</th></tr>";
    const tableRows = filtered
      .map(
        (l) =>
          `<tr><td>${l.id}</td><td>${l.name}</td><td>${l.phone}</td><td>${l.destination || ""}</td><td>${l.budget}</td><td>${l.travelDate}</td><td>${l.status}</td><td>${l.priority}</td><td>${l.leadSection || ""}</td></tr>`,
      )
      .join("");
    const css = `body{font-family:sans-serif;padding:20px;color:#333}h2{color:#f43f5e;margin-bottom:5px}p{font-size:12px;color:#666;margin-bottom:20px}table{border-collapse:collapse;width:100%;font-size:12px}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f9fafb;font-weight:bold}tr:nth-child(even){background:#f3f4f6}`;
    const styleEl = printWindow.document.createElement("style");
    styleEl.textContent = css;
    printWindow.document.head.appendChild(styleEl);
    const titleEl = printWindow.document.createElement("title");
    titleEl.textContent = "Leads Export PDF";
    printWindow.document.head.appendChild(titleEl);
    const bodyHtml = `<h2>Grand Journeys CRM - Leads Export</h2><p>Generated on ${new Date().toLocaleDateString("en-IN")} | Total Leads: ${filtered.length}</p><table><thead>${tableHeader}</thead><tbody>${tableRows}</tbody></table>`;
    const wrapper = printWindow.document.createElement("div");
    wrapper.innerHTML = bodyHtml;
    printWindow.document.body.appendChild(wrapper);
    const script = printWindow.document.createElement("script");
    script.textContent =
      "window.onload=function(){window.print();window.onafterprint=function(){window.close();}}";
    printWindow.document.body.appendChild(script);
    printWindow.document.close();
  };

  const handleImportLeads = (data: any[]) => {
    const lmhLeads = leads.filter((l) => l.id.startsWith("T-"));
    let nextNum = 1;
    if (lmhLeads.length > 0) {
      const nums = lmhLeads.map((l) => {
        const parts = l.id?.split("-");
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

    const importedLeads: ExtLead[] = data.map((row, idx) => ({
      id: `T-${pad(nextNum + idx, 3)}`,
      name: String(row["Client / Company"] || "Unknown"), // Mapping Client/Company to name for the table
      clientCompany: String(row["Client / Company"] || "Unknown"),
      phone: String(row["Phone"] || ""),
      email: "",
      destination: "Unknown",
      budget: 0,
      travelDate: String(row["Travel Date"] || new Date().toISOString().slice(0, 10)),
      source: String(row["Source"] || SOURCES[0]),
      reference: String(row["Reference"] || ""),
      status: (String(row["Status"]) || "New Lead") as LeadStatus,
      assignedTo: String(row["Assigned To"] || assignees[0]),
      pax: parseInt(String(row["Pax"] || "2")) || 2,
      notes: String(row["Description"] || ""),
      avatar: "",
      createdAt: String(row["Date"] || new Date().toISOString().slice(0, 10)),
      createdTime: String(row["Time"] || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true })),
      service: "International Package",
      priority: (String(row["Priority"]) || "Medium") as "High" | "Medium" | "Low",
      packageType: "",
      queryType: String(row["Query Type"] || "New"),
      leadSection: "B2C",
    }));
    setLeads((prev) => [...importedLeads, ...prev]);
  };

  const visibleLeads = isAdmin
    ? leads
    : leads.filter((l) => l.assignedTo?.toLowerCase() === auth?.name?.toLowerCase());

  const filtered = visibleLeads.filter(
    (l) =>
      (filterStatus === "All" || l.status === filterStatus) &&
      (q === "" ||
        l.name?.toLowerCase().includes(q.toLowerCase()) ||
        l.destination?.toLowerCase().includes(q.toLowerCase()) ||
        l.id?.toLowerCase().includes(q.toLowerCase())),
  );

  const addLead = (l: ExtLead) => {
    setLeads((prev) => [l, ...prev]);
  };

  const updateStatus = (id: string, status: LeadStatus) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
    setSelected((sel) => (sel ? { ...sel, status } : sel));

    if (["on conform", "Confirmed", "in process"].includes(status)) {
      const lead = leads.find((l) => l.id === id);
      if (lead && lead.phone) {
        setCustomers((prev) => {
          const exists = prev.find((c) => c.phone === lead.phone);
          if (exists) {
            return prev.map((c) =>
              c.phone === lead.phone
                ? { ...c, trips: (c.trips || 0) + 1, totalSpend: (c.totalSpend || 0) + (Number(lead.budget) || 0) }
                : c
            );
          } else {
            const currentMaxId = prev.reduce((max, c) => {
              const num = parseInt(c.id.replace("CRN", ""));
              return !isNaN(num) && num > max ? num : max;
            }, 0);
            const nextId = `CRN${String(currentMaxId + 1).padStart(3, "0")}`;
            return [
              {
                id: nextId,
                name: lead.name,
                email: lead.email || "",
                phone: lead.phone,
                company: lead.clientCompany || "",
                city: lead.destination || "", // Using destination as placeholder if city isn't present
                source: lead.source || "Website",
                status: "Active",
                assignedTo: lead.assignedTo || "Unassigned", // Can customize based on feedback later
                createdAt: new Date().toISOString().slice(0, 10),
                trips: 1,
                totalSpend: Number(lead.budget) || 0,
                tier: "Silver",
              },
              ...prev,
            ];
          }
        });
      }
    }
  };

  const deleteLead = (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    setSelected(null);
  };

  /* Stats */
  const totalBudget = leads.reduce((s, l) => s + (Number(l.budget) || 0), 0);
  const completedLeads = leads.filter((l) => l.status === "in process").length;
  const newToday = leads.filter(
    (l) => l.createdAt === new Date().toISOString().slice(0, 10),
  ).length;
  const conversion = leads.length > 0 ? Math.round((completedLeads / leads.length) * 100) : 0;

  return (
    <>
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Leads</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Track every inquiry from first contact to booked trip.
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={() => setIsExportOpen(true)}
            >
              <Download className="h-4 w-4" /> Export Leads
            </Button>
            <Button
              variant="outline"
              className="gap-2 rounded-xl"
              onClick={() => setIsImportOpen(true)}
            >
              <Upload className="h-4 w-4" /> Import Leads
            </Button>
            <Button
              id="add-lead-btn"
              onClick={() => setShowModal(true)}
              className="gap-2 rounded-xl"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Plus className="h-4 w-4" /> Add Lead
            </Button>
          </div>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-3">
          {[
            {
              label: "Total Leads",
              value: leads.length,
              icon: <UserCheck className="h-4 w-4" />,
              color: "bg-blue-100 text-blue-600",
              sub: `${newToday} added today`,
            },
            {
              label: "Completed",
              value: completedLeads,
              icon: <Sparkles className="h-4 w-4" />,
              color: "bg-emerald-100 text-emerald-600",
              sub: `${conversion}% conversion`,
            },

            {
              label: "Avg Budget",
              value: formatINR(leads.length ? Math.round(totalBudget / leads.length) : 0),
              icon: <TrendingUp className="h-4 w-4" />,
              color: "bg-violet-100 text-violet-600",
              sub: "Per lead",
            },
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
                <span
                  className={`text-xl font-display font-bold ${filterStatus === s ? "text-primary" : ""}`}
                >
                  {count}
                </span>
                <div className="h-1 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className={`h-full rounded-full ${STATUS_DOT[s]}`}
                    style={{ width: `${pct}%` }}
                  />
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
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, destination or ID..."
              className="pl-9 rounded-xl"
            />
          </div>
          <div className="flex items-center gap-2 text-sm ml-auto">
            <Filter className="h-4 w-4 shrink-0 text-muted-foreground" />
            <span className="text-muted-foreground font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as typeof filterStatus)}
              className="h-9 cursor-pointer appearance-none rounded-full border border-border bg-card text-card-foreground pl-4 pr-9 py-1.5 font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%24%2024%22%20fill%3D%22none%22%20stroke%3D%22%23111827%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-[length:1em_1em] bg-[right_1rem_center] bg-no-repeat"
            >
              <option value="All">All Statuses</option>
              {STATUSES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          {/* View toggle */}
          <div className="flex rounded-xl border border-border overflow-hidden">
            <button
              onClick={() => setView("table")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors ${view === "table" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
            >
              <Table2 className="h-3.5 w-3.5" /> Table
            </button>
            <button
              onClick={() => setView("kanban")}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-l border-border transition-colors ${view === "kanban" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`}
            >
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
                <thead className="bg-primary text-left text-xs uppercase tracking-wider text-white">
                  <tr>
                    <th className="px-4 py-4 font-medium">Status</th>
                    <th className="px-4 py-4 font-medium">Name</th>
                    <th className="px-4 py-4 font-medium whitespace-nowrap">Create Date & Time</th>
                    <th className="px-4 py-4 font-medium">Des. / Service</th>
                    <th className="px-4 py-4 font-medium whitespace-nowrap">Travel Date / Budget</th>
                    <th className="px-4 py-4 font-medium">Priority</th>
                    <th className="px-4 py-4 font-medium">Assigned To</th>
                    <th className="px-4 py-4 font-medium">Section</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-muted-foreground text-sm">
                        No leads match your filters.
                      </td>
                    </tr>
                  )}
                  {filtered.map((l) => (
                    <React.Fragment key={l.id}>
                    <tr
                      className="border-t border-border hover:bg-secondary/30 transition-colors cursor-pointer"
                      onClick={() => setSelected(l)}
                    >
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={l.status}
                          onValueChange={(val: LeadStatus) => {
                            setLeads((prev) => prev.map((lead) => (lead.id === l.id ? { ...lead, status: val } : lead)));
                          }}
                        >
                          <SelectTrigger className={`inline-flex items-center rounded-sm px-2 py-1 text-xs font-semibold whitespace-nowrap border-none h-auto w-auto focus:ring-0 focus:ring-offset-0 shadow-none [&>svg]:hidden ${STATUS_PILL[l.status]}`}>
                            <SelectValue />
                            <ChevronDown className="h-4 w-4 opacity-50 ml-1" />
                          </SelectTrigger>
                          <SelectContent>
                            {STATUSES.map((s) => (
                              <SelectItem key={s} value={s} className="text-sm">
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className="text-sm font-semibold whitespace-nowrap">{l.name}</div>
                        </div>
                        {l.clientCompany && <div className="text-xs text-muted-foreground truncate max-w-[120px] mt-0.5">{l.clientCompany}</div>}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium">{l.createdAt}</div>
                        <div className="text-xs text-muted-foreground">{l.createdTime || "-"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm max-w-[150px] truncate" title={l.destination}>{l.destination || "-"}</div>
                        <div className="text-xs font-semibold text-muted-foreground">{l.service || "-"}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium">{l.travelDate || "-"}</div>
                        <div className="text-xs text-emerald-600 font-medium">{l.budget ? `₹${l.budget}` : "-"}</div>
                      </td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <Select
                          value={l.priority || "Medium"}
                          onValueChange={(val: "High" | "Medium" | "Low") => {
                            setLeads((prev) => prev.map((lead) => (lead.id === l.id ? { ...lead, priority: val } : lead)));
                          }}
                        >
                          <SelectTrigger className="justify-between rounded-md border border-input ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 inline-flex items-center px-1 py-1 text-sm whitespace-nowrap border-none h-auto w-auto focus:ring-0 focus:ring-offset-0 shadow-none bg-transparent hover:bg-transparent [&>svg]:hidden">
                            <SelectValue placeholder="-" />
                            <ChevronDown className="h-4 w-4 opacity-50 ml-1" />
                          </SelectTrigger>
                          <SelectContent>
                            {["High", "Medium", "Low"].map((p) => (
                              <SelectItem key={p} value={p} className="text-sm">
                                {p}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-4 py-3 text-sm align-top min-w-[140px]">
                        <div className="mb-2 font-medium text-gray-800">{l.assignedTo || "-"}</div>
                        <div className="pl-2.5 border-l-[3px] border-[#e8dfd5] py-0.5 flex flex-col gap-2.5">
                          {l.allNotes && l.allNotes.length > 0 ? (
                            l.allNotes.map((n, i) => (
                              <div key={i} className="text-sm text-muted-foreground italic flex flex-wrap items-baseline gap-x-1.5 leading-tight">
                                <span className="text-muted-foreground/60">•</span>
                                <span className="text-muted-foreground">{n.text}</span>
                                {n.date && (
                                  <span className="text-xs text-muted-foreground/60 not-italic ml-0.5">
                                    ({new Date(n.date).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).replace(',', '')})
                                  </span>
                                )}
                              </div>
                            ))
                          ) : l.notes ? (
                            <div className="text-sm text-muted-foreground italic flex flex-wrap items-baseline gap-x-1.5 leading-tight">
                              <span className="text-muted-foreground/60">•</span>
                              <span className="text-muted-foreground">{l.notes}</span>
                              {l.noteDate && (
                                <span className="text-xs text-muted-foreground/60 not-italic ml-0.5">
                                  ({new Date(l.noteDate).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).replace(',', '')})
                                </span>
                              )}
                            </div>
                          ) : null}
                          {editingTableNoteId === l.id ? (
                            <div className="mt-1 flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-200" onClick={(e) => e.stopPropagation()}>
                              <textarea
                                autoFocus
                                value={tableEditNoteText}
                                onChange={(e) => setTableEditNoteText(e.target.value)}
                                placeholder="Type your note here..."
                                rows={2}
                                className="w-full min-w-[160px] max-w-[200px] resize-none rounded-xl border border-border bg-background px-2.5 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-sm"
                              />
                              <div className="flex gap-2 mt-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 text-xs rounded-full px-3"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingTableNoteId(null);
                                    setTableEditNoteText("");
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  className="h-7 text-xs rounded-full px-3 text-white"
                                  style={{ background: "var(--gradient-brand)" }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (tableEditNoteText.trim()) {
                                      const noteDate = new Date().toISOString();
                                      const newLeads = leads.map((x) => {
                                        if (x.id === l.id) {
                                          let currentNotes = x.allNotes ? [...x.allNotes] : [];
                                          if (x.notes && currentNotes.length === 0) {
                                            currentNotes.push({ text: x.notes, date: x.noteDate || new Date().toISOString() });
                                          }
                                          currentNotes.push({ text: tableEditNoteText.trim(), date: noteDate });
                                          return { ...x, notes: tableEditNoteText.trim(), noteDate, allNotes: currentNotes };
                                        }
                                        return x;
                                      });
                                      setLeads(newLeads);
                                    }
                                    setEditingTableNoteId(null);
                                    setTableEditNoteText("");
                                  }}
                                >
                                  Add Note
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingTableNoteId(l.id);
                                setTableEditNoteText("");
                              }}
                              className="text-sm text-blue-500 hover:text-blue-600 font-medium text-left whitespace-nowrap mt-1 pl-1"
                            >
                              + Add Note
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        {l.leadSection ? (
                          <div className="inline-flex items-center rounded-full bg-secondary/80 px-3 py-1 text-sm font-semibold text-secondary-foreground shadow-sm">
                            {l.leadSection}
                          </div>
                        ) : (
                          <span className="text-muted-foreground font-medium text-sm">-</span>
                        )}
                      </td>
                    </tr>
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Table footer */}
            <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-5 py-3">
              <p className="text-xs text-muted-foreground">
                Showing {filtered.length} of {leads.length} leads
              </p>
              <p className="text-xs font-semibold text-muted-foreground">
                Pipeline:{" "}
                <span className="text-primary">
                  {formatINR(filtered.reduce((s, l) => s + (Number(l.budget) || 0), 0))}
                </span>
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
      <ImportLeadsModal
        open={isImportOpen}
        onOpenChange={setIsImportOpen}
        onImport={handleImportLeads}
        allowedStatuses={STATUSES}
        allowedPriorities={["High", "Medium", "Low"]}
        allowedAssignees={assignees}
      />
      {showModal && (
        <AddLeadModal
          existingLeads={leads}
          onClose={() => setShowModal(false)}
          onAdd={(l) => {
            addLead(l);
            setShowModal(false);
          }}
        />
      )}
      {selected && (
        <LeadDetail
          lead={selected}
          onClose={() => setSelected(null)}
          onStatusChange={updateStatus}
          onDelete={deleteLead}
          isAdmin={isAdmin}
          assignees={assignees}
          onEditNote={(id, newNote) => {
            const noteDate = new Date().toISOString();
            const newLeads = leads.map((x) => {
              if (x.id === id) {
                let currentNotes = x.allNotes ? [...x.allNotes] : [];
                if (x.notes && currentNotes.length === 0) {
                  currentNotes.push({ text: x.notes, date: x.noteDate || new Date().toISOString() });
                }
                currentNotes.push({ text: newNote, date: noteDate });
                return { ...x, notes: newNote, noteDate, allNotes: currentNotes };
              }
              return x;
            });
            setLeads(newLeads);
            setSelected(newLeads.find((x) => x.id === id) || null);
          }}
          onUpdateLead={(id, updates) => {
            const newLeads = leads.map((x) => (x.id === id ? { ...x, ...updates } : x));
            setLeads(newLeads);
            setSelected(newLeads.find((x) => x.id === id) || null);
          }}
        />
      )}

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
    </>
  );
}
