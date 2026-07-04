import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { formatINR } from "@/lib/mock-data";
import {
  Plane,
  Building2,
  Calendar,
  Shield,
  FileText,
  Upload,
  Download,
  CheckCircle,
  HelpCircle,
  MapPin,
  QrCode,
  Users,
  Search,
  ArrowRight,
  Sparkles,
  PartyPopper,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import logoImg from "../assets/Logo.svg";

export const Route = createFileRoute("/crm/portal")({
  component: CustomerPortalPage,
});

interface PortalDocument {
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

function CustomerPortalPage() {
  // Read query params manually
  const [params, setParams] = useState({ leadId: "", quoteId: "" });
  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = window.location.search;
      const urlParams = new URLSearchParams(search);
      setParams({
        leadId: urlParams.get("leadId") || "",
        quoteId: urlParams.get("quoteId") || "",
      });
    }
  }, []);

  const [leads] = useSupabaseTable<any[]>("leads", []);
  const [quotations] = useSupabaseTable<any[]>("quotations", []);
  const [bookings] = useSupabaseTable<any[]>("bookings", []);

  const [phoneLookup, setPhoneLookup] = useState("");
  const [lookupResult, setLookupResult] = useState<any[] | null>(null);
  const [activeTab, setActiveTab] = useState<"itinerary" | "vouchers" | "payment" | "documents">(
    "itinerary",
  );

  // Portal files state (simulated file uploads)
  const [uploadedDocs, setUploadedDocs] = useState<PortalDocument[]>([
    {
      name: "Flight_Ticket_E_Ticket.pdf",
      type: "application/pdf",
      size: 450000,
      uploadedAt: "2026-06-28",
    },
  ]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);

  // Find targeted entity
  const targetLead = leads.find((l) => l.id === params.leadId);
  const targetQuote = quotations.find((q) => q.id === params.quoteId);
  const targetBooking = bookings.find(
    (b) => b.mobileNumber === targetLead?.phone || b.customer === targetLead?.name,
  );

  // Combine data for a unified view
  const tripDetails = targetLead || targetQuote || (lookupResult && lookupResult[0]);
  const invoiceDetails = targetBooking || targetLead || (lookupResult && lookupResult[0]);

  const handleLookup = () => {
    if (!phoneLookup.trim()) return;
    const sanitized = phoneLookup.replace(/[^\d]/g, "");

    // Search in leads or bookings
    const matchedLeads = leads.filter(
      (l) =>
        l.phone?.replace(/[^\d]/g, "").includes(sanitized) ||
        l.whatsapp?.replace(/[^\d]/g, "").includes(sanitized),
    );
    if (matchedLeads.length > 0) {
      setLookupResult(matchedLeads);
    } else {
      setLookupResult([]);
    }
  };

  const handleFileUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    const newDoc: PortalDocument = {
      name: uploadFile.name,
      type: uploadFile.type,
      size: uploadFile.size,
      uploadedAt: new Date().toISOString().slice(0, 10),
    };

    setUploadedDocs([newDoc, ...uploadedDocs]);
    setUploadFile(null);
    alert(`File "${uploadFile.name}" has been uploaded to Look My Holidays consultants securely.`);
  };

  const formattedBalance = invoiceDetails
    ? formatINR(
      (invoiceDetails.totalAmount || invoiceDetails.amount || 0) -
      (invoiceDetails.amountPaid || invoiceDetails.paid || 0),
    )
    : "₹0";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16 font-sans">
      {/* Premium Gradient Header */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-primary text-white py-12 px-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-card text-card-foreground/5 blur-3xl" />
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={logoImg}
              alt="Look My Holidays Logo"
              className="h-16 w-auto rounded-xl bg-card text-card-foreground p-1"
            />
            <div>
              <h1 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight">
                Customer Care Portal
              </h1>
              <p className="text-sm text-blue-100 mt-1 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 animate-pulse text-amber-300" /> Powered by Look My
                Holidays
              </p>
            </div>
          </div>
          {tripDetails && (
            <div className="text-left md:text-right bg-card text-card-foreground/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl">
              <p className="text-xs uppercase tracking-wider text-blue-200">Trip Destination</p>
              <p className="font-display font-bold text-lg">
                {tripDetails.destination || "Holiday Getaway"}
              </p>
              <p className="text-xs text-blue-100">
                {tripDetails.travelDate || "TBD"} · {tripDetails.pax || 2} Pax
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 -mt-6 relative z-20">
        {/* If no active ID, render phone lookup */}
        {!tripDetails ? (
          <div className="bg-card rounded-3xl border border-border p-8 shadow-2xl space-y-6 text-center">
            <div className="max-w-md mx-auto space-y-3">
              <PartyPopper className="h-12 w-12 text-primary mx-auto" />
              <h2 className="font-display text-2xl font-bold">Track Your Holiday Plans</h2>
              <p className="text-sm text-muted-foreground">
                Enter your mobile number registered with Look My Holidays to access your day-wise
                itinerary, vouchers, invoices, and upload passport files.
              </p>

              <div className="flex gap-2 pt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Enter registered mobile number"
                    value={phoneLookup}
                    onChange={(e) => setPhoneLookup(e.target.value)}
                    className="pl-10 h-12 rounded-xl text-sm"
                    onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                  />
                </div>
                <Button
                  onClick={handleLookup}
                  className="h-12 px-6 rounded-xl btn-hero gap-1.5 shadow-lg"
                >
                  Lookup <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {lookupResult && lookupResult.length === 0 && (
                <p className="text-xs text-rose-500 font-semibold pt-2">
                  No active itinerary or bookings found for this mobile number. Please check with
                  your agent.
                </p>
              )}

              {lookupResult && lookupResult.length > 0 && (
                <div className="pt-6 text-left border-t border-border space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Matching Trip Records
                  </p>
                  {lookupResult.map((res) => (
                    <button
                      key={res.id}
                      onClick={() => setParams({ leadId: res.id, quoteId: "" })}
                      className="w-full text-left p-4 rounded-2xl border border-border bg-secondary/15 hover:bg-secondary/35 transition-all flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-sm">{res.destination}</p>
                        <p className="text-xs text-muted-foreground">
                          Travel Date: {res.travelDate} · Budget: {formatINR(res.budget)}
                        </p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-primary" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Active Client Portal Hub */
          <div className="space-y-6">
            {/* Quick Stats overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Check-in Date",
                  value: tripDetails.travelDate || "TBD",
                  icon: Calendar,
                  color: "text-blue-600 bg-blue-50",
                },
                {
                  label: "Total Cost",
                  value: formatINR(invoiceDetails?.totalAmount || invoiceDetails?.amount || 0),
                  icon: FileText,
                  color: "text-purple-600 bg-purple-50",
                },
                {
                  label: "Pending Balance",
                  value: formattedBalance,
                  icon: QrCode,
                  color: "text-rose-600 bg-rose-50",
                },
                {
                  label: "Trip Status",
                  value: targetLead?.status || "Confirmed",
                  icon: CheckCircle,
                  color: "text-emerald-600 bg-emerald-50",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-card border border-border p-4 rounded-2xl shadow-sm"
                >
                  <div
                    className={`inline-grid h-8 w-8 place-items-center rounded-lg ${stat.color} mb-3`}
                  >
                    <stat.icon className="h-4 w-4" />
                  </div>
                  <p className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="font-display font-bold text-sm md:text-base mt-0.5 truncate text-foreground">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-border bg-card rounded-2xl p-1.5 shadow-sm">
              {[
                { id: "itinerary", label: "🗺️ Itinerary" },
                { id: "vouchers", label: "✈️ Vouchers & Files" },
                { id: "payment", label: "💳 Pay Online" },
                { id: "documents", label: "📁 Upload Documents" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex-1 text-center py-2.5 rounded-xl text-xs font-semibold transition-all ${activeTab === tab.id
                      ? "bg-primary text-primary-foreground shadow-sm font-bold"
                      : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground"
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Itinerary Tab */}
            {activeTab === "itinerary" && (
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
                <div className="border-b border-border pb-4">
                  <h3 className="font-display font-extrabold text-lg">Your Custom Itinerary</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Day-wise activities scheduled for your dream vacation.
                  </p>
                </div>

                {/* Day Program items */}
                <div className="space-y-6 relative before:absolute before:left-6 before:top-4 before:bottom-4 before:w-[2px] before:bg-slate-200 dark:before:bg-slate-800">
                  {tripDetails.details?.itinerary
                    ? tripDetails.details.itinerary.map((day: any, idx: number) => (
                      <div key={idx} className="flex gap-4 relative z-10">
                        <div className="h-12 w-12 rounded-xl bg-primary border-2 border-white dark:border-slate-900 shadow-md text-white font-bold text-xs flex items-center justify-center shrink-0">
                          Day {day.day}
                        </div>
                        <div className="bg-secondary/15 border border-border/80 rounded-2xl p-4 flex-1 space-y-1">
                          <p className="font-semibold text-sm">{day.title}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {day.description}
                          </p>
                        </div>
                      </div>
                    ))
                    : /* Default Fallback Itinerary */
                    [
                      {
                        day: 1,
                        title: "Arrival & Hotel Transfer",
                        desc: "Our private chauffeur will meet you at the terminal and drop you at the hotel. Rest of day is at leisure.",
                      },
                      {
                        day: 2,
                        title: "Scenic Guided Sightseeing Tour",
                        desc: "Enjoy a complete morning city tour showing landmarks, viewpoints, local heritage, and historic locations.",
                      },
                      {
                        day: 3,
                        title: "Adventure & Cultural Experience",
                        desc: "Special day of safari, cruise, or local village excursions. Includes gourmet lunch buffet.",
                      },
                      {
                        day: 4,
                        title: "Departure",
                        desc: "Check out of the hotel. Free time for souvenir shopping until your private departure transfer.",
                      },
                    ].map((day) => (
                      <div key={day.day} className="flex gap-4 relative z-10">
                        <div className="h-12 w-12 rounded-xl bg-primary border-2 border-white dark:border-slate-900 shadow-md text-white font-bold text-xs flex items-center justify-center shrink-0">
                          Day {day.day}
                        </div>
                        <div className="bg-secondary/15 border border-border/80 rounded-2xl p-4 flex-1 space-y-1">
                          <p className="font-semibold text-sm">{day.title}</p>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {day.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Vouchers & Files Tab */}
            {activeTab === "vouchers" && (
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
                <div className="border-b border-border pb-4">
                  <h3 className="font-display font-extrabold text-lg">
                    Vouchers & Travel Documents
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Download your verified vouchers, flight tickets, and hotel bookings.
                  </p>
                </div>

                <div className="grid gap-3">
                  {[
                    {
                      name: "Hotel_Voucher_LookMyHolidays.pdf",
                      desc: "Confirmed check-in voucher for resort stay",
                      size: "320 KB",
                    },
                    {
                      name: "Sightseeing_Tours_Pass.pdf",
                      desc: "Passes for included city tours & safari admission tickets",
                      size: "1.2 MB",
                    },
                    {
                      name: "LookMyHolidays_Travel_Invoice.pdf",
                      desc: "Official booking receipt and paid balance confirmation",
                      size: "180 KB",
                    },
                  ].map((doc) => (
                    <div
                      key={doc.name}
                      className="flex items-center justify-between rounded-2xl border border-border p-4 bg-secondary/10 hover:bg-secondary/20 transition-all text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-8 w-8 text-primary shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">{doc.name}</p>
                          <p className="text-muted-foreground">
                            {doc.desc} · {doc.size}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="rounded-xl h-9 gap-1 text-xs"
                        onClick={() => alert("Downloading file offline...")}
                      >
                        <Download className="h-3.5 w-3.5" /> Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Online Payment Tab */}
            {activeTab === "payment" && (
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
                <div className="border-b border-border pb-4">
                  <h3 className="font-display font-extrabold text-lg">Scan & Pay Balance Online</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Make instant, secure payments via UPI QR Code directly into the lookmyholidays
                    account.
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 items-center bg-secondary/10 p-6 rounded-2xl border border-border">
                  <div className="space-y-4">
                    <p className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
                      Ledger Breakdown
                    </p>
                    <div className="space-y-2 text-sm text-slate-800">
                      <div className="flex justify-between border-b border-border/80 pb-1.5 text-muted-foreground">
                        <span>Total Invoiced Cost:</span>
                        <span>
                          {formatINR(invoiceDetails?.totalAmount || invoiceDetails?.amount || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between border-b border-border/80 pb-1.5 text-emerald-700">
                        <span>Total Amount Paid:</span>
                        <span>
                          {formatINR(invoiceDetails?.amountPaid || invoiceDetails?.paid || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between pt-2 font-display font-bold text-base text-primary">
                        <span>Pending Balance:</span>
                        <span>{formattedBalance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center p-3 bg-card rounded-xl border border-border/80 text-center overflow-hidden">
                    <img src="/upi-qr.png" alt="UPI QR Code" className="w-[200px] object-contain rounded-lg" />
                    <p className="text-[10px] text-muted-foreground mt-2 font-medium">
                      Scan to pay with any UPI App
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Upload Documents Tab */}
            {activeTab === "documents" && (
              <div className="bg-card border border-border rounded-3xl p-6 shadow-sm space-y-6">
                <div className="border-b border-border pb-4">
                  <h3 className="font-display font-extrabold text-lg">Upload Travel Documents</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Securely upload passport scans, photos, or visa copies for travel compliance
                    check.
                  </p>
                </div>

                <form
                  onSubmit={handleFileUpload}
                  className="space-y-4 border border-dashed border-primary/30 p-6 rounded-2xl text-center bg-primary/5"
                >
                  <Upload className="h-8 w-8 text-primary mx-auto mb-2 animate-bounce" />
                  <div className="max-w-xs mx-auto space-y-2">
                    <Input
                      type="file"
                      required
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                      className="cursor-pointer h-9 text-xs bg-background rounded-lg"
                    />
                    <p className="text-[10px] text-muted-foreground">
                      Supported file formats: PDF, JPG, PNG up to 5MB
                    </p>
                  </div>
                  <Button
                    type="submit"
                    disabled={!uploadFile}
                    className="btn-hero h-9 text-xs rounded-xl shadow-md"
                  >
                    Upload Document
                  </Button>
                </form>

                {/* Uploaded Documents display */}
                <div className="space-y-2 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Uploaded Files History
                  </p>
                  {uploadedDocs.map((doc) => (
                    <div
                      key={doc.name}
                      className="flex justify-between items-center rounded-xl border border-border/80 p-3 bg-secondary/15 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <div>
                          <p className="font-semibold">{doc.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            Uploaded at: {doc.uploadedAt}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
