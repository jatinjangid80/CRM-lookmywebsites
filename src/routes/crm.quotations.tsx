import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { getAuth } from "@/lib/auth";
import { formatINR } from "@/lib/mock-data";
import {
  FileText,
  Plus,
  Trash2,
  Share2,
  Printer,
  Download,
  CheckCircle2,
  ChevronRight,
  Plane,
  Building2,
  ListChecks,
  User,
  MapPin,
  Calendar,
  Sparkles,
  QrCode,
  DollarSign,
  XCircle,
  History,
  Edit2,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { generateWhatsAppLink, whatsappTemplates } from "@/lib/whatsapp";
import logoImg from "../assets/Logo.svg";

export const Route = createFileRoute("/crm/quotations")({
  component: QuotationsPage,
});

interface DayItinerary {
  day: number;
  title: string;
  description: string;
}

interface QuoteForm {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  packageName: string;
  destination: string;
  durationNights: number;
  durationDays: number;
  hotelName: string;
  hotelNights: number;
  mealPlan: string;
  flightSector: string;
  airline: string;
  flightNotes: string;
  basePrice: number;
  gstRate: number; // 0, 5, 18
  tcsRate: number; // 0, 5, 20
  discount: number;
  discountType: "amount" | "percentage";
  inclusions: string;
  exclusions: string;
  terms: string;
  itinerary: DayItinerary[];
}

const DEFAULT_FORM: QuoteForm = {
  customerName: "",
  customerPhone: "",
  customerEmail: "",
  packageName: "Custom Holiday Package",
  destination: "",
  durationNights: 4,
  durationDays: 5,
  hotelName: "",
  hotelNights: 4,
  mealPlan: "Breakfast Included (CP)",
  flightSector: "",
  airline: "",
  flightNotes: "Economy return flights included",
  basePrice: 25000,
  gstRate: 5,
  tcsRate: 0,
  discount: 0,
  discountType: "amount",
  inclusions:
    "Standard Hotel Room\nDaily Breakfast\nReturn Airport Transfers\nSightseeing as per itinerary\n24/7 Local Support",
  exclusions:
    "Any personal expenses\nMeals other than specified\nTips and gratuities\nTravel Insurance\nVisa fees (unless specified)",
  terms:
    "50% advance payment required for confirmation.\nCancellation policies apply as per supplier rules.\nRates are subject to availability at the time of actual booking.",
  itinerary: [
    {
      day: 1,
      title: "Arrival & Leisure",
      description:
        "Arrive at the destination. Meet our local representative and transfer to the hotel. Spend the rest of the day relaxing.",
    },
    {
      day: 2,
      title: "City Tour",
      description:
        "After breakfast, proceed for a guided city tour covering major tourist attractions.",
    },
    {
      day: 3,
      title: "Adventure Activities",
      description: "Full day dedicated to local sightseeing and optional adventure sports.",
    },
    {
      day: 4,
      title: "Shopping & Relaxation",
      description:
        "Day at leisure. Explore the local markets for shopping and experience traditional cuisine.",
    },
    {
      day: 5,
      title: "Departure",
      description: "Check out from the hotel. Transfer to the airport for your flight back home.",
    },
  ],
};

function QuotationsPage() {
  const auth = getAuth();
  const [customers] = useSupabaseTable<any[]>("customers", []);
  const [packages] = useSupabaseTable<any[]>("packages", []);
  const [quotations, setQuotations] = useSupabaseTable<any[]>("quotations", []);
  const [editingQuoteId, setEditingQuoteId] = useState<string | null>(null);

  const [form, setForm] = useState<QuoteForm>({ ...DEFAULT_FORM });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [savedQuoteId, setSavedQuoteId] = useState<string | null>(null);

  // Sync itinerary days count with durationDays
  useEffect(() => {
    const targetDays = Number(form.durationDays) || 1;
    setForm((f) => {
      const current = [...f.itinerary];
      if (current.length < targetDays) {
        // Add days
        for (let i = current.length + 1; i <= targetDays; i++) {
          current.push({
            day: i,
            title: `Day ${i} Itinerary`,
            description: "Activity details to be specified.",
          });
        }
      } else if (current.length > targetDays) {
        // Trim days
        current.length = targetDays;
      }
      return { ...f, itinerary: current };
    });
  }, [form.durationDays]);

  // Handle customer select auto-fill
  const handleCustomerSelect = (custId: string) => {
    const cust = customers.find((c) => c.id === custId);
    if (cust) {
      setForm((f) => ({
        ...f,
        customerName: cust.name,
        customerPhone: cust.phone,
        customerEmail: cust.email || "",
      }));
    }
  };

  // Handle package select auto-fill
  const handlePackageSelect = (pkgId: string) => {
    const pkg = packages.find((p) => p.id === pkgId);
    if (pkg) {
      const nights = parseInt(pkg.nights?.split("N")[0]) || 4;
      const days = parseInt(pkg.nights?.split("/")[1]?.replace(/[^\d]/g, "")) || 5;

      setForm((f) => ({
        ...f,
        packageName: pkg.title,
        destination: pkg.destination,
        durationNights: nights,
        durationDays: days,
        hotelNights: nights,
        basePrice: pkg.priceNum || parseInt(pkg.price.replace(/[^\d]/g, "")) || 25000,
        inclusions: pkg.incl?.join("\n") || f.inclusions,
        description: pkg.description,
        itinerary:
          pkg.itinerary && pkg.itinerary.length > 0
            ? pkg.itinerary.map((it: any) => ({
                day: it.day,
                title: it.title,
                description: it.description,
              }))
            : f.itinerary,
      }));
    }
  };

  const gstAmount = Math.round((form.basePrice * form.gstRate) / 100);
  const tcsAmount = Math.round((form.basePrice * form.tcsRate) / 100);
  const discountAmount = form.discountType === "percentage" 
    ? Math.round((form.basePrice * form.discount) / 100) 
    : form.discount;
  const totalAmount = form.basePrice + gstAmount + tcsAmount - discountAmount;

  const handleItineraryChange = (idx: number, field: keyof DayItinerary, val: string) => {
    setForm((f) => {
      const copy = [...f.itinerary];
      copy[idx] = { ...copy[idx], [field]: val };
      return { ...f, itinerary: copy };
    });
  };

  // Save quotation to Database
  const handleSaveQuotation = async () => {
    const maxNumber = quotations.reduce((max: number, q: any) => {
      if (q.id && q.id.startsWith("QT-")) {
        const num = parseInt(q.id.replace("QT-", ""), 10);
        if (!isNaN(num) && num > max) return num;
      }
      return max;
    }, 0);
    const id = editingQuoteId || `QT-${String(maxNumber + 1).padStart(3, "0")}`;
    const newQuoteObj = {
      id,
      customer_name: form.customerName,
      customer_phone: form.customerPhone,
      customer_email: form.customerEmail,
      package_name: form.packageName,
      destination: form.destination,
      total_amount: totalAmount,
      created_at: editingQuoteId ? (quotations.find(q => q.id === editingQuoteId)?.created_at || new Date().toISOString()) : new Date().toISOString(),
      details: form,
      agent_name: auth?.name || "Admin",
    };

    if (editingQuoteId) {
      setQuotations(quotations.map(q => q.id === editingQuoteId ? newQuoteObj : q));
    } else {
      setQuotations([newQuoteObj, ...quotations]);
    }
    
    setSavedQuoteId(id);
    setPreviewOpen(true);
    setEditingQuoteId(null);
  };

  // Generate WhatsApp Message
  const getWhatsAppMessage = () => {
    const portalUrl = window.location.origin + `/crm/portal?quoteId=${savedQuoteId || "QT-102"}`;
    return whatsappTemplates.quotation(
      form.customerName || "Customer",
      form.packageName,
      formatINR(totalAmount),
      portalUrl,
    );
  };

  const shareOnWhatsApp = () => {
    const link = generateWhatsAppLink(form.customerPhone || "919876543210", getWhatsAppMessage());
    window.open(link, "_blank");
  };

  // Trigger PDF print view
  const handlePrint = () => {
    window.print();
  };

  // Simulated AI Itinerary generator helper
  const handleGenerateAIItinerary = () => {
    if (!form.destination) {
      alert("Please specify a Destination first to generate AI Itinerary.");
      return;
    }
    const dest = form.destination.toLowerCase();
    let aiItinerary: DayItinerary[] = [];

    if (dest.includes("dubai")) {
      aiItinerary = [
        {
          day: 1,
          title: "Arrive in Dubai & Marina Dhow Cruise",
          description:
            "Arrive in Dubai. Meet representative and transfer to hotel. In the evening, enjoy a premium Marina Dhow Cruise with buffet dinner.",
        },
        {
          day: 2,
          title: "Dubai City Tour & Burj Khalifa 124th Floor",
          description:
            "Half-day Dubai city tour covering Dubai Museum, Jumeirah Mosque, Burj Al Arab photo op. Evening entry to Burj Khalifa Observatory.",
        },
        {
          day: 3,
          title: "Desert Safari with BBQ Dinner",
          description:
            "Morning at leisure. Afternoon 4x4 dune bashing, camel riding, sandboarding, belly dancing show, and BBQ dinner at desert camp.",
        },
        {
          day: 4,
          title: "Abu Dhabi Day Tour & Yas Island",
          description:
            "Full-day excursion to Abu Dhabi. Visit the magnificent Sheikh Zayed Grand Mosque, Heritage Village, and drive past Yas Marina.",
        },
        {
          day: 5,
          title: "Departure with memories",
          description: "Breakfast at hotel. Private transfer to airport for final departure.",
        },
      ];
    } else if (dest.includes("thailand") || dest.includes("phuket")) {
      aiItinerary = [
        {
          day: 1,
          title: "Arrive in Phuket & Patong Leisure",
          description:
            "Arrive in Phuket. Check in to Patong beach resort. Evening stroll around Bangla Road and local street food tour.",
        },
        {
          day: 2,
          title: "Phi Phi Island Speedboat Tour",
          description:
            "Full-day speedboat excursion to Phi Phi Don and Phi Phi Ley. Enjoy snorkeling, swimming in Maya Bay, and lunch.",
        },
        {
          day: 3,
          title: "Transfer to Krabi & Ao Nang Beach",
          description:
            "Scenic road transfer to Krabi. Check in to Ao Nang beach resort. Sunset walk along the cliffs.",
        },
        {
          day: 4,
          title: "Four Island Tour by Longtail Boat",
          description:
            "Island hopping tour of Phranang Cave, Tup Island, Chicken Island, and Poda Island with picnic lunch.",
        },
        {
          day: 5,
          title: "Departure from Krabi",
          description: "Breakfast at hotel. Private transfer to Krabi International Airport.",
        },
      ];
    } else {
      aiItinerary = [
        {
          day: 1,
          title: `Welcome to ${form.destination}`,
          description: `Arrive at the airport. Transfer to your resort/hotel. Leisure day to explore.`,
        },
        {
          day: 2,
          title: "Historical & Local Landmarks",
          description:
            "Guided sightseeing tour of top-rated local heritage landmarks and scenic valleys.",
        },
        {
          day: 3,
          title: "Scenic Nature Trails & Excursions",
          description:
            "Experience panoramic viewpoints, waterfall treks, and premium activities in the area.",
        },
        {
          day: 4,
          title: "Local Craft Shopping & Cultural Show",
          description:
            "Visit traditional artisan markets and watch a native dance/music show in the evening.",
        },
        {
          day: 5,
          title: "Farewell Transfer",
          description: "Check out and ride comfortably to the airport for your flight back.",
        },
      ];
    }

    setForm((f) => ({
      ...f,
      durationDays: aiItinerary.length,
      durationNights: aiItinerary.length - 1,
      itinerary: aiItinerary,
    }));
  };

  return (
    <div className="space-y-8 print:p-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" /> Quotation Builder
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create, style, and share customized travel itineraries and payment estimates.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => {
              setForm({ ...DEFAULT_FORM });
              setEditingQuoteId(null);
            }}
          >
            Reset Form
          </Button>
          <Button onClick={handleSaveQuotation} className="btn-hero rounded-xl shadow-lg">
            Generate Quote
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 print:hidden">
        {/* Left Side: Builder Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer & Package Auto-fill hooks */}
          <div className="grid gap-4 sm:grid-cols-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div>
              <Label
                htmlFor="cust-select"
                className="mb-2 block font-semibold text-xs uppercase tracking-wider text-muted-foreground"
              >
                Auto-fill Customer Profile
              </Label>
              <select
                id="cust-select"
                onChange={(e) => handleCustomerSelect(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">-- Select Existing Client --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label
                htmlFor="pkg-select"
                className="mb-2 block font-semibold text-xs uppercase tracking-wider text-muted-foreground"
              >
                Auto-fill Package Template
              </Label>
              <select
                id="pkg-select"
                onChange={(e) => handlePackageSelect(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">-- Select Package --</option>
                {packages.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Customer Inputs */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider">
              1. Client Details
            </h3>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="cname">Client Name</Label>
                <Input
                  id="cname"
                  placeholder="Priya Sharma"
                  value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="rounded-xl mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="cphone">Client Mobile</Label>
                <Input
                  id="cphone"
                  placeholder="9876543210"
                  value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  className="rounded-xl mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="cemail">Client Email</Label>
                <Input
                  id="cemail"
                  placeholder="priya@example.com"
                  value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  className="rounded-xl mt-1.5"
                />
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider">
                2. Trip & Package Configuration
              </h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleGenerateAIItinerary}
                className="rounded-xl text-xs gap-1 border-primary/30 hover:bg-primary/5 text-primary"
              >
                <Sparkles className="h-3.5 w-3.5 animate-pulse" /> AI Generate Itinerary
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="sm:col-span-2">
                <Label htmlFor="pkgname">Trip Title</Label>
                <Input
                  id="pkgname"
                  placeholder="e.g. Dubai Marina & Desert Retreat"
                  value={form.packageName}
                  onChange={(e) => setForm({ ...form, packageName: e.target.value })}
                  className="rounded-xl mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="dest">Destination</Label>
                <Input
                  id="dest"
                  placeholder="e.g. Dubai"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  className="rounded-xl mt-1.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="days">Days</Label>
                  <Input
                    id="days"
                    type="number"
                    value={form.durationDays}
                    onChange={(e) => setForm({ ...form, durationDays: Number(e.target.value) })}
                    className="rounded-xl mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="nights">Nights</Label>
                  <Input
                    id="nights"
                    type="number"
                    value={form.durationNights}
                    onChange={(e) => setForm({ ...form, durationNights: Number(e.target.value) })}
                    className="rounded-xl mt-1.5"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 border-t border-border pt-4">
              <div>
                <Label htmlFor="hotelname">Hotel Option</Label>
                <Input
                  id="hotelname"
                  placeholder="Hotel name & stars"
                  value={form.hotelName}
                  onChange={(e) => setForm({ ...form, hotelName: e.target.value })}
                  className="rounded-xl mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="meal">Meal Plan</Label>
                <Input
                  id="meal"
                  placeholder="Breakfast, Dinner, etc."
                  value={form.mealPlan}
                  onChange={(e) => setForm({ ...form, mealPlan: e.target.value })}
                  className="rounded-xl mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="flight">Flights sector</Label>
                <Input
                  id="flight"
                  placeholder="DEL - DXB - DEL"
                  value={form.flightSector}
                  onChange={(e) => setForm({ ...form, flightSector: e.target.value })}
                  className="rounded-xl mt-1.5"
                />
              </div>
            </div>
          </div>

          {/* Day Wise Itinerary */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider">
              3. Day-Wise Program
            </h3>
            <div className="space-y-4">
              {form.itinerary.map((day, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-border/80 bg-secondary/20 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="grid h-6 w-12 place-items-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                      Day {day.day}
                    </span>
                    <Input
                      placeholder="Day Title"
                      value={day.title}
                      onChange={(e) => handleItineraryChange(idx, "title", e.target.value)}
                      className="rounded-xl h-8 text-xs bg-background"
                    />
                  </div>
                  <Textarea
                    placeholder="Day details and highlights"
                    value={day.description}
                    onChange={(e) => handleItineraryChange(idx, "description", e.target.value)}
                    className="rounded-xl text-xs bg-background"
                    rows={2}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full rounded-xl border-dashed border-2 mt-2"
                onClick={() => setForm(f => ({ ...f, durationDays: Number(f.durationDays) + 1 }))}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Another Day
              </Button>
            </div>
          </div>
        </div>

        {/* Right Side Column: Pricing & Share */}
        <div className="space-y-6">
          {/* Pricing & GST Ledger */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider">
              4. Pricing Estimate
            </h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="basep">Base Package Price (₹)</Label>
                <Input
                  id="basep"
                  type="number"
                  value={form.basePrice}
                  onChange={(e) => setForm({ ...form, basePrice: Number(e.target.value) })}
                  className="rounded-xl mt-1.5 font-bold"
                />
              </div>
              <div>
                <Label htmlFor="gstrate">GST Rate</Label>
                <select
                  id="gstrate"
                  value={form.gstRate}
                  onChange={(e) => setForm({ ...form, gstRate: Number(e.target.value) })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-1.5"
                >
                  <option value="0">None</option>
                  <option value="5">5% GST (Standard Tour)</option>
                  <option value="18">18% GST (Hotel/Flights)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="tcsrate">TCS Rate (International Pack)</Label>
                <select
                  id="tcsrate"
                  value={form.tcsRate}
                  onChange={(e) => setForm({ ...form, tcsRate: Number(e.target.value) })}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary mt-1.5"
                >
                  <option value="0">None</option>
                  <option value="5">5% TCS (With PAN)</option>
                  <option value="20">20% TCS (Without PAN)</option>
                </select>
              </div>
              <div>
                <Label htmlFor="disc">Special Discount</Label>
                <div className="flex items-center gap-2 mt-1.5">
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value as "amount" | "percentage" })}
                    className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary w-28 shrink-0"
                  >
                    <option value="amount">₹ Flat</option>
                    <option value="percentage">% Perc</option>
                  </select>
                  <Input
                    id="disc"
                    type="number"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                    className="rounded-xl flex-1"
                    placeholder={form.discountType === "percentage" ? "e.g. 5" : "e.g. 1000"}
                  />
                </div>
              </div>

              <div className="border-t border-border pt-4 mt-2 space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                  <span>Base Price:</span>
                  <span>{formatINR(form.basePrice)}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                  <span>GST Amount ({form.gstRate}%):</span>
                  <span>{formatINR(gstAmount)}</span>
                </div>
                {form.tcsRate > 0 && (
                  <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                    <span>TCS Amount ({form.tcsRate}%):</span>
                    <span>{formatINR(tcsAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-muted-foreground font-semibold">
                  <span>Discount {form.discountType === "percentage" ? `(${form.discount}%)` : ""}:</span>
                  <span className="text-emerald-600">- {formatINR(discountAmount)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-3 font-display font-bold text-lg text-primary">
                  <span>Total Cost:</span>
                  <span>{formatINR(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inclusions & Exclusions */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider">
              5. Inclusions & Exclusions
            </h3>
            <div className="space-y-3">
              <div>
                <Label htmlFor="incls">Inclusions</Label>
                <Textarea
                  id="incls"
                  value={form.inclusions}
                  onChange={(e) => setForm({ ...form, inclusions: e.target.value })}
                  className="rounded-xl text-xs mt-1.5"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="excls">Exclusions</Label>
                <Textarea
                  id="excls"
                  value={form.exclusions}
                  onChange={(e) => setForm({ ...form, exclusions: e.target.value })}
                  className="rounded-xl text-xs mt-1.5"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="terms">Terms & Policies</Label>
                <Textarea
                  id="terms"
                  value={form.terms}
                  onChange={(e) => setForm({ ...form, terms: e.target.value })}
                  className="rounded-xl text-xs mt-1.5"
                  rows={3}
                />
              </div>
            </div>
          </div>

          {/* Recent Quotations */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
            <h3 className="font-display font-bold text-sm text-primary uppercase tracking-wider flex items-center gap-2">
              <History className="h-4 w-4" /> Recent Quotes
            </h3>
            {!quotations || quotations.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No recent quotes</p>
            ) : (
              <div className="space-y-3">
                {quotations.slice(0, 5).map((q: any) => (
                  <div key={q.id} className="flex flex-col gap-1.5 p-3 rounded-xl border border-border bg-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs">{q.id} - {q.customer_name}</span>
                      <span className="font-bold text-primary text-xs">{formatINR(q.total_amount)}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="truncate max-w-[150px]">{q.package_name}</span>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          className="h-6 text-[10px] px-2 rounded-lg"
                          onClick={() => {
                            if (q.details) {
                              try {
                                let parsedDetails = q.details;
                                if (typeof parsedDetails === 'string') {
                                  parsedDetails = JSON.parse(parsedDetails);
                                }
                                const clonedDetails = JSON.parse(JSON.stringify(parsedDetails));
                                setForm(clonedDetails);
                                setEditingQuoteId(q.id);
                                setPreviewOpen(true);
                              } catch (error) {
                                console.error("Failed to parse quote details", error);
                                toast.error("Could not load quote details");
                              }
                            }
                          }}
                        >
                          <Eye className="h-3 w-3 mr-1" /> View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 text-[10px] px-2 rounded-lg"
                          onClick={() => {
                            if (q.details) {
                              try {
                                let parsedDetails = q.details;
                                if (typeof parsedDetails === 'string') {
                                  parsedDetails = JSON.parse(parsedDetails);
                                }
                                // Clone to avoid mutation
                                const clonedDetails = JSON.parse(JSON.stringify(parsedDetails));
                                setForm(clonedDetails);
                                setEditingQuoteId(q.id);
                                window.scrollTo({ top: 0, behavior: "smooth" });
                                toast.success(`Quote ${q.id} loaded for editing`);
                              } catch (error) {
                                console.error("Failed to parse quote details", error);
                                toast.error("Could not load quote details");
                              }
                            }
                          }}
                        >
                          <Edit2 className="h-3 w-3 mr-1" /> Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="h-6 text-[10px] px-2 rounded-lg"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this quotation?")) {
                              setQuotations(quotations.filter((quote: any) => quote.id !== q.id));
                              toast.success(`Quote ${q.id} deleted`);
                            }
                          }}
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Branded A4 PDF & Share Preview Panel */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-[1000px] max-h-[90vh] overflow-y-auto rounded-3xl p-0 border border-border shadow-2xl bg-card print:max-w-none print:w-full print:shadow-none print:border-none print:bg-card text-card-foreground print:overflow-visible">
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border print:hidden sticky top-0 bg-card z-10">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <DialogTitle className="font-display font-bold text-lg">Quotation Preview & Sharing</DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Share directly with client or download offline PDF invoice format
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="rounded-xl gap-2 text-xs" onClick={handlePrint}>
                  <Printer className="h-4 w-4" /> Print / Save PDF
                </Button>
                <Button
                  style={{ background: "var(--gradient-brand)" }}
                  className="rounded-xl gap-2 text-xs text-primary-foreground shadow-md"
                  onClick={shareOnWhatsApp}
                >
                  <Share2 className="h-4 w-4" /> Share WhatsApp
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="p-8 bg-muted/30 print:p-0 print:bg-card text-card-foreground">
            {/* Printable branded A4 block */}
            <div className="border border-border/80 rounded-2xl bg-card text-card-foreground p-8 max-w-3xl mx-auto shadow-md text-slate-800 print:border-none print:shadow-none print:p-0 print:text-black">
              {/* Branded Header */}
            <div className="flex items-center justify-between border-b-2 border-primary/20 pb-6">
              <div className="flex items-center gap-3">
                <img
                  src={logoImg}
                  alt="Look My Holidays Logo"
                  className="h-16 w-auto mix-blend-multiply"
                />
                <div>
                  <h2 className="font-display font-extrabold text-2xl text-primary tracking-tight">
                    Look My Holidays
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Expert Travel Consultants & Visa Solutions
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-xs font-semibold uppercase px-2.5 py-1 rounded-md bg-secondary text-primary border border-primary/20 inline-block mb-1">
                  {savedQuoteId || "QT-1002"}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Date: {new Date().toLocaleDateString("en-IN")}
                </p>
                <p className="text-[10px] text-muted-foreground">
                  Agent: {auth?.name || "Nikita Bairwa"}
                </p>
              </div>
            </div>

            {/* Client info */}
            <div className="grid grid-cols-2 gap-4 pt-6 text-xs">
              <div className="bg-secondary/20 p-4 rounded-xl border border-border/40">
                <p className="font-bold text-primary mb-1 uppercase tracking-wider text-[10px]">
                  Prepared For
                </p>
                <p className="font-semibold text-sm">{form.customerName || "Valued Customer"}</p>
                <p className="text-muted-foreground mt-0.5">{form.customerPhone}</p>
                <p className="text-muted-foreground">{form.customerEmail}</p>
              </div>
              <div className="bg-secondary/20 p-4 rounded-xl border border-border/40 text-right">
                <p className="font-bold text-primary mb-1 uppercase tracking-wider text-[10px]">
                  Package Summary
                </p>
                <p className="font-semibold text-sm">{form.packageName}</p>
                <p className="text-muted-foreground mt-0.5">
                  Destination: {form.destination || "Multiple"}
                </p>
                <p className="text-muted-foreground">
                  Duration: {form.durationNights} Nights / {form.durationDays} Days
                </p>
              </div>
            </div>

            {/* Flight & Hotel configuration details */}
            <div className="grid grid-cols-2 gap-4 pt-6 text-xs">
              {form.hotelName && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-border">
                  <Building2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase tracking-wider text-[9px] text-muted-foreground">
                      Stay Option
                    </p>
                    <p className="font-semibold mt-0.5">
                      {form.hotelName}
                    </p>
                    <p className="text-muted-foreground text-[11px]">
                      {form.hotelNights} Nights stay with {form.mealPlan}
                    </p>
                  </div>
                </div>
              )}
              {form.flightSector && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl border border-border">
                  <Plane className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold uppercase tracking-wider text-[9px] text-muted-foreground">
                      Flight details
                    </p>
                    <p className="font-semibold mt-0.5">
                      {form.airline} ({form.flightSector})
                    </p>
                    <p className="text-muted-foreground text-[11px]">{form.flightNotes}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Day Wise Itinerary */}
            <div className="pt-8 text-xs">
              <h3 className="font-display font-extrabold text-sm border-b border-border pb-2 text-primary uppercase tracking-wider">
                Day-Wise Program
              </h3>
              <div className="mt-4 space-y-4">
                {form.itinerary.map((day, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <div className="h-8 w-14 rounded-lg bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0 font-bold">
                      Day {day.day}
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{day.title}</p>
                      <p className="text-muted-foreground mt-1 leading-relaxed text-xs">
                        {day.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Inclusions & Exclusions details grid */}
            <div className="grid grid-cols-2 gap-6 pt-8 text-xs border-t border-border mt-8">
              <div>
                <h4 className="flex items-center gap-1.5 font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider text-[10px] mb-2">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Inclusions
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-muted-foreground text-[11px]">
                  {form.inclusions.split("\n").map((inc, i) => (
                    <li key={i}>{inc}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="flex items-center gap-1.5 font-bold text-rose-800 dark:text-rose-300 uppercase tracking-wider text-[10px] mb-2">
                  <XCircle className="h-3.5 w-3.5" /> Exclusions
                </h4>
                <ul className="space-y-1.5 list-disc pl-4 text-muted-foreground text-[11px]">
                  {form.exclusions.split("\n").map((exc, i) => (
                    <li key={i}>{exc}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Ledger breakdown & UPI QR */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border mt-8 items-center bg-secondary/10 p-5 rounded-2xl">
              <div className="col-span-2 text-xs space-y-1.5">
                <p className="font-bold uppercase tracking-wider text-[10px] text-muted-foreground">
                  Estimate Summary
                </p>
                <div className="flex justify-between pr-8 text-muted-foreground">
                  <span>Base Price:</span>
                  <span>{formatINR(form.basePrice)}</span>
                </div>
                <div className="flex justify-between pr-8 text-muted-foreground">
                  <span>GST ({form.gstRate}%):</span>
                  <span>{formatINR(gstAmount)}</span>
                </div>
                {form.tcsRate > 0 && (
                  <div className="flex justify-between pr-8 text-muted-foreground">
                    <span>TCS ({form.tcsRate}%):</span>
                    <span>{formatINR(tcsAmount)}</span>
                  </div>
                )}
                {form.discount > 0 && (
                  <div className="flex justify-between pr-8 text-emerald-600">
                    <span>Discount {form.discountType === "percentage" ? `(${form.discount}%)` : ""}:</span>
                    <span>- {formatINR(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between pr-8 pt-2 border-t border-border/80 font-display font-black text-base text-primary">
                  <span>Total Amount:</span>
                  <span>{formatINR(totalAmount)}</span>
                </div>
              </div>

              {/* UPI Payment Code */}
              <div className="flex flex-col items-center justify-center p-3 border border-border bg-card rounded-xl text-center overflow-hidden">
                <img src="/upi-qr.png" alt="UPI QR Code" className="w-full max-w-[160px] object-contain rounded-md" />
                <p className="text-[9px] text-muted-foreground mt-2 font-medium">
                  Scan to pay with any UPI App
                </p>
              </div>
            </div>

            {/* Terms and conditions */}
            <div className="pt-6 text-[10px] text-muted-foreground border-t border-border mt-6">
              <p className="font-bold uppercase tracking-wider mb-1 text-[9px]">
                Terms & Conditions
              </p>
              <p className="whitespace-pre-line leading-relaxed">{form.terms}</p>
              <p className="mt-4 text-center font-display font-semibold text-slate-400">
                Thank you for letting us plan your holidays! ✈️
              </p>
            </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
