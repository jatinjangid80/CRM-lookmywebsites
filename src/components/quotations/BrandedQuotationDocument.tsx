import React from "react";
import logoImg from "../../assets/Logo.svg";
import {
  Calendar,
  Clock,
  Users,
  FileText,
  Building2,
  Utensils,
  Bed,
  MapPin,
  Wifi,
  Sparkles,
  Phone,
  Mail,
  Globe,
  CheckCircle2,
  XCircle,
  Car,
  Headphones,
  ShieldCheck,
  Plane,
  Compass,
  Instagram,
  Linkedin,
  Facebook,
  Twitter,
} from "lucide-react";

interface HotelOption {
  id: string;
  hotelName: string;
  rating: string;
  location: string;
  checkIn: string;
  checkOut: string;
  rooms: string;
  adults: string;
  children: string;
  roomType: string;
  nights: number;
  mealPlan: string;
  confirmationNo?: string;
}

interface FlightOption {
  id: string;
  airline: string;
  flightNo: string;
  sector: string;
  dateTime: string;
  pnr?: string;
}

interface DayItinerary {
  day: number;
  title: string;
  description: string;
}

export interface QuoteFormData {
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  packageName: string;
  destination: string;
  durationNights: number;
  durationDays: number;
  hotels: HotelOption[];
  flights: FlightOption[];
  basePrice: number;
  gstRate: number;
  tcsRate: number;
  discount: number;
  discountType: "amount" | "percentage";
  inclusions: string;
  exclusions: string;
  terms: string;
  bankDetails: string;
  itinerary: DayItinerary[];
}

interface BrandedQuotationDocumentProps {
  form: QuoteFormData;
  quoteId?: string;
  agentName?: string;
}

export const BrandedQuotationDocument: React.FC<BrandedQuotationDocumentProps> = ({
  form,
  quoteId = "LMH/2026/001",
  agentName = "Look My Holiday Team",
}) => {
  const isHotelQuote =
    form.packageName?.toLowerCase().includes("hotel") &&
    !form.packageName?.toLowerCase().includes("package") &&
    !form.packageName?.toLowerCase().includes("holiday");

  const primaryHotel = form.hotels?.[0] || {
    hotelName: form.destination ? `${form.destination} Luxury Hotel` : "Grand Hyatt Luxury Resort",
    rating: "4 Star",
    location: form.destination || "Dubai, UAE",
    checkIn: "12 Oct 2026",
    checkOut: "17 Oct 2026",
    rooms: "1",
    adults: "2",
    children: "1",
    roomType: "Deluxe Room",
    nights: form.durationNights || 5,
    mealPlan: "Breakfast",
  };

  const discountAmount =
    form.discountType === "percentage"
      ? (form.basePrice * (form.discount || 0)) / 100
      : Number(form.discount || 0);

  const priceAfterDiscount = Math.max(0, form.basePrice - discountAmount);
  const gstAmount = (priceAfterDiscount * (form.gstRate || 0)) / 100;
  const tcsAmount = (priceAfterDiscount * (form.tcsRate || 0)) / 100;
  const totalAmount = priceAfterDiscount + gstAmount + tcsAmount;

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const totalGuests = `${primaryHotel.adults || "2"} Adults${
    primaryHotel.children && primaryHotel.children !== "0"
      ? ` + ${primaryHotel.children} Child`
      : ""
  }`;

  const quotationDate = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const travelDates =
    primaryHotel.checkIn && primaryHotel.checkOut
      ? `${primaryHotel.checkIn} - ${primaryHotel.checkOut}`
      : "12 Oct - 17 Oct 2026";

  const durationText = `${form.durationNights || primaryHotel.nights || 5} Nights / ${
    form.durationDays || (form.durationNights || 5) + 1
  } Days`;

  // Default Travel Package Itinerary if not provided
  const travelItinerary: DayItinerary[] =
    form.itinerary && form.itinerary.length > 0
      ? form.itinerary
      : isHotelQuote
      ? [
          {
            day: 1,
            title: `Arrival & Check-in at ${primaryHotel.hotelName}`,
            description: `Arrive at destination. Transfer to ${primaryHotel.hotelName}. Smooth check-in to ${primaryHotel.roomType}. Welcome drink on arrival. Spend the evening relaxing and enjoying property amenities.`,
          },
          {
            day: 2,
            title: "Leisure, Dining & Hotel Amenities",
            description:
              "Enjoy a lavish buffet breakfast. Explore local attractions or unwind by the swimming pool, fitness club, and spa.",
          },
          {
            day: 3,
            title: "City Exploration & Experiences",
            description:
              "Breakfast at hotel. Day free for leisure, shopping malls, sightseeing tours, and exquisite in-house dining.",
          },
          {
            day: 4,
            title: "Relaxation & Resort Experiences",
            description:
              "Relax at the hotel, enjoy complimentary Wi-Fi and premium hospitality services.",
          },
          {
            day: 5,
            title: "Check-out & Farewell Departure",
            description:
              "Breakfast at the hotel. Complete check-out formalities. Transfer to the airport with wonderful holiday memories.",
          },
        ]
      : [
          {
            day: 1,
            title: "Arrival in Dubai",
            description:
              "• Arrival at Dubai International Airport\n• Meet & greet by our representative\n• Private transfer to hotel & Check-in\n• Leisure time at hotel",
          },
          {
            day: 2,
            title: "Dubai City Tour",
            description:
              "• After breakfast, proceed for Dubai City Tour\n• Visit Dubai Frame, Jumeirah Beach\n• Burj Al Arab (Photo Stop), Palm Jumeirah\n• Return to hotel",
          },
          {
            day: 3,
            title: "Desert Safari with Dinner",
            description:
              "• Morning free for leisure\n• Afternoon Desert Safari with Dune Bashing\n• Camel Ride, Tanoura Show & BBQ Dinner\n• Return to hotel",
          },
          {
            day: 4,
            title: "Abu Dhabi City Tour",
            description:
              "• Full day Abu Dhabi City Tour\n• Visit Sheikh Zayed Grand Mosque\n• Emirates Palace, Corniche\n• Return to hotel",
          },
          {
            day: 5,
            title: "Leisure Day",
            description:
              "• Day free at leisure or shop at Dubai Mall\n• Optional: Burj Khalifa Ticket (At extra cost)\n• Return to hotel",
          },
          {
            day: 6,
            title: "Departure",
            description:
              "• Check-out from hotel\n• Private transfer to Dubai Airport\n• Departure with wonderful memories",
          },
        ];

  return (
    <div id="quotation-print-area" className="flex flex-col gap-8 print:gap-0 font-sans text-slate-800 antialiased selection:bg-orange-500 selection:text-white">
      {/* ========================================================================= */}
      {/* PAGE 1: PREMIUM COVER PAGE */}
      {/* ========================================================================= */}
      <div
        className="print-page w-full max-w-[800px] mx-auto bg-white rounded-2xl shadow-xl print:shadow-none print:rounded-none overflow-hidden relative flex flex-col justify-between print:m-0 print:border-none"
        style={{
          minHeight: "1120px",
          aspectRatio: "1 / 1.414",
          backgroundColor: "#ffffff",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        {/* Header Ribbon with Brand Logo */}
        <div className="p-8 pb-4 flex justify-between items-center z-10">
          <div className="flex items-center">
            <img
              src={logoImg}
              alt="Look My Holiday Logo"
              className="h-12 md:h-14 w-auto max-w-[200px] object-contain"
            />
          </div>
        </div>

        {/* Hero Section */}
        <div className="px-8 grid grid-cols-12 gap-6 relative z-10 my-auto">
          {/* Left Column: Details */}
          <div className="col-span-7 flex flex-col justify-center pr-2">
            <div className="mb-4">
              <h1 className="text-3xl sm:text-4xl font-black text-[#0f2942] tracking-tight leading-none uppercase">
                {isHotelQuote ? "HOTEL" : "TRAVEL"} <br />
                <span className="text-[#f25c05]">QUOTATION</span>
              </h1>
              <div
                className="mt-3 inline-flex items-center gap-2 text-white px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase shadow-sm"
                style={{ backgroundColor: "#0f2942", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
              >
                <span>{form.packageName || (isHotelQuote ? `${primaryHotel.hotelName}` : "DUBAI HOLIDAY PACKAGE")}</span>
                <Plane className="h-3.5 w-3.5 text-orange-400 rotate-45" />
              </div>
            </div>

            {/* Prepared For Box */}
            <div className="mt-4 mb-2">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prepared for</p>
              <h2 className="text-xl font-bold text-[#0f2942] mt-0.5">
                {form.customerName || "Mr. Rajesh Sharma"}
              </h2>
            </div>

            {/* 2-Column Info Grid */}
            <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
              <div
                className="flex items-start gap-2.5 p-2.5 rounded-xl border border-orange-100"
                style={{ backgroundColor: "#fff7ed", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
              >
                <div
                  className="h-7 w-7 rounded-lg text-white flex items-center justify-center shrink-0 shadow-sm"
                  style={{ backgroundColor: "#f25c05", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                >
                  <Calendar className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Travel Dates</p>
                  <p className="font-bold text-slate-800 text-[11px] leading-tight mt-0.5">{travelDates}</p>
                </div>
              </div>

              <div
                className="flex items-start gap-2.5 p-2.5 rounded-xl border border-orange-100"
                style={{ backgroundColor: "#fff7ed", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
              >
                <div
                  className="h-7 w-7 rounded-lg text-white flex items-center justify-center shrink-0 shadow-sm"
                  style={{ backgroundColor: "#f25c05", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                >
                  <Clock className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Duration</p>
                  <p className="font-bold text-slate-800 text-[11px] leading-tight mt-0.5">{durationText}</p>
                </div>
              </div>

              <div
                className="flex items-start gap-2.5 p-2.5 rounded-xl border border-orange-100"
                style={{ backgroundColor: "#fff7ed", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
              >
                <div
                  className="h-7 w-7 rounded-lg text-white flex items-center justify-center shrink-0 shadow-sm"
                  style={{ backgroundColor: "#f25c05", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                >
                  <Users className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Travellers</p>
                  <p className="font-bold text-slate-800 text-[11px] leading-tight mt-0.5">{totalGuests}</p>
                </div>
              </div>

              <div
                className="flex items-start gap-2.5 p-2.5 rounded-xl border border-orange-100"
                style={{ backgroundColor: "#fff7ed", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
              >
                <div
                  className="h-7 w-7 rounded-lg text-white flex items-center justify-center shrink-0 shadow-sm"
                  style={{ backgroundColor: "#f25c05", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                >
                  <FileText className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Quote No.</p>
                  <p className="font-bold text-slate-800 text-[11px] leading-tight mt-0.5">{quoteId}</p>
                </div>
              </div>

              <div
                className="col-span-2 flex items-start gap-2.5 p-2.5 rounded-xl border border-orange-100"
                style={{ backgroundColor: "#fff7ed", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
              >
                <div
                  className="h-7 w-7 rounded-lg text-white flex items-center justify-center shrink-0 shadow-sm"
                  style={{ backgroundColor: "#f25c05", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                >
                  <Calendar className="h-3.5 w-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-slate-500 uppercase">Date of Quotation</p>
                  <p className="font-bold text-slate-800 text-[11px] leading-tight mt-0.5">{quotationDate}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual */}
          <div className="col-span-5 relative flex items-center justify-center">
            <div className="w-full h-84 rounded-2xl overflow-hidden shadow-2xl relative border-2 border-white group">
              <img
                src={
                  isHotelQuote
                    ? "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    : "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                }
                alt="Destination & Property"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f2942]/70 via-transparent to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <p className="text-[11px] font-bold drop-shadow-md">
                  {form.destination || primaryHotel.location || "Dubai, UAE"}
                </p>
                <p className="text-[9px] text-white/90 drop-shadow-sm flex items-center gap-1">
                  <MapPin className="h-2.5 w-2.5 text-orange-400" />
                  {primaryHotel.hotelName || "Exclusive Luxury Stay"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote Callout Banner */}
        <div className="px-8 z-10 mt-2 mb-4">
          <div
            className="rounded-2xl p-4 shadow-md border border-slate-100 flex items-center gap-3 relative overflow-hidden"
            style={{ backgroundColor: "#ffffff", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
          >
            <div className="text-3xl text-orange-500 font-serif leading-none select-none shrink-0 font-bold">“</div>
            <p className="text-xs text-slate-700 italic font-medium leading-relaxed">
              A perfect holiday is not just about the destination, it&apos;s about the experience we create for you.
              <span className="block text-[10px] text-orange-600 font-semibold not-italic mt-0.5">— Look My Holiday</span>
            </p>
          </div>
        </div>

        {/* Bottom Services Ribbon */}
        <div
          className="text-white px-6 py-4 z-10"
          style={{
            backgroundColor: "#0f2942",
            backgroundImage: "linear-gradient(to right, #0a233b, #0f2942, #163b65)",
            WebkitPrintColorAdjust: "exact",
            printColorAdjust: "exact",
          }}
        >
          <div className="grid grid-cols-7 gap-2 text-center items-center">
            {[
              { icon: Sparkles, label: "Holiday Packages" },
              { icon: Plane, label: "Air Tickets" },
              { icon: Building2, label: "Hotels" },
              { icon: FileText, label: "Visa" },
              { icon: Users, label: "Mice" },
              { icon: Bed, label: "Weddings" },
              { icon: Headphones, label: "Events & Conferences" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1">
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center border border-white/20 text-orange-400"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.15)", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                >
                  <item.icon className="h-4 w-4" />
                </div>
                <span className="text-[9px] font-medium tracking-tight text-white/90 leading-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 2: TRIP & HOTEL OVERVIEW + HIGHLIGHTS */}
      {/* ========================================================================= */}
      <div
        className="print-page w-full max-w-[800px] mx-auto bg-white rounded-2xl shadow-xl print:shadow-none print:rounded-none overflow-hidden relative flex flex-col justify-between print:m-0 print:border-none"
        style={{
          minHeight: "1120px",
          aspectRatio: "1 / 1.414",
          backgroundColor: "#ffffff",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        {/* Header with Logo on Top Right */}
        <div className="p-8 pb-3 flex justify-between items-center z-10 border-b border-slate-100">
          <p className="text-base font-serif italic text-slate-700 font-bold">Your Journey, Our Expertise!</p>
          <img
            src={logoImg}
            alt="Look My Holiday Logo"
            className="h-10 md:h-12 w-auto max-w-[170px] object-contain"
          />
        </div>

        {/* Main Section */}
        <div className="p-8 py-4 space-y-6 flex-1 flex flex-col justify-start">
          {/* Section Title */}
          <div>
            <div className="flex items-center gap-2">
              <div className="h-5 w-1.5 bg-[#f25c05] rounded-full"></div>
              <h2 className="text-lg font-black text-[#0f2942] tracking-wider uppercase">
                {isHotelQuote ? "HOTEL OVERVIEW" : "TRIP OVERVIEW"}
              </h2>
            </div>
            <div className="h-0.5 w-24 bg-[#0f2942] mt-1"></div>
          </div>

          {/* 2-Column Overview & Highlights Grid */}
          <div className="grid grid-cols-12 gap-6 items-start">
            {/* Left Column: Spec Table */}
            <div className="col-span-6 rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-xs">
                <tbody className="divide-y divide-slate-200">
                  <tr style={{ backgroundColor: "#f8fafc", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                    <td className="py-2.5 px-3.5 font-bold text-slate-700 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500"></span> Destination
                    </td>
                    <td className="py-2.5 px-3.5 font-semibold text-slate-800 text-right">
                      {form.destination || primaryHotel.location || "Dubai, UAE"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-bold text-slate-700 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500"></span> Duration
                    </td>
                    <td className="py-2.5 px-3.5 font-semibold text-slate-800 text-right">{durationText}</td>
                  </tr>
                  <tr style={{ backgroundColor: "#f8fafc", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                    <td className="py-2.5 px-3.5 font-bold text-slate-700 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500"></span> Travel Dates
                    </td>
                    <td className="py-2.5 px-3.5 font-semibold text-slate-800 text-right">{travelDates}</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-bold text-slate-700 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500"></span> Travellers
                    </td>
                    <td className="py-2.5 px-3.5 font-semibold text-slate-800 text-right">{totalGuests}</td>
                  </tr>
                  <tr style={{ backgroundColor: "#f8fafc", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                    <td className="py-2.5 px-3.5 font-bold text-slate-700 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500"></span> Hotel Category
                    </td>
                    <td className="py-2.5 px-3.5 font-semibold text-slate-800 text-right">
                      {primaryHotel.rating || "4 Star"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-bold text-slate-700 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500"></span> Meal Plan
                    </td>
                    <td className="py-2.5 px-3.5 font-semibold text-slate-800 text-right">
                      {primaryHotel.mealPlan || "Breakfast"}
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: "#f8fafc", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                    <td className="py-2.5 px-3.5 font-bold text-slate-700 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500"></span> Transport
                    </td>
                    <td className="py-2.5 px-3.5 font-semibold text-slate-800 text-right">
                      {isHotelQuote ? primaryHotel.roomType || "Standard Room" : "Private"}
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3.5 font-bold text-slate-700 flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-orange-500"></span> Package Type
                    </td>
                    <td className="py-2.5 px-3.5 font-semibold text-slate-800 text-right">
                      {isHotelQuote ? "Luxury Hotel Stay" : "Family Holiday"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Right Column: Highlights Box */}
            <div className="col-span-6 rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
              <div
                className="text-white px-4 py-2.5 text-center"
                style={{ backgroundColor: "#0f2942", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
              >
                <h3 className="text-xs font-bold uppercase tracking-wider">
                  {isHotelQuote ? "HOTEL HIGHLIGHTS" : "PACKAGE HIGHLIGHTS"}
                </h3>
              </div>
              <div className="p-4 space-y-2.5 text-xs">
                {[
                  { icon: Bed, text: "Comfortable Stay" },
                  { icon: Utensils, text: "Daily Breakfast" },
                  { icon: Compass, text: isHotelQuote ? "Prime City Location" : "Dubai City Tour" },
                  { icon: Sparkles, text: isHotelQuote ? "Swimming Pool & Gym" : "Desert Safari with Dinner" },
                  { icon: Car, text: isHotelQuote ? "Airport Transfers" : "All Transfers & Sightseeing" },
                  { icon: FileText, text: "Visa Assistance" },
                  { icon: ShieldCheck, text: "Travel Insurance" },
                  { icon: Headphones, text: "24/7 Travel Support" },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-slate-700">
                    <div
                      className="h-5 w-5 rounded-full text-orange-600 flex items-center justify-center shrink-0"
                      style={{ backgroundColor: "#ffedd5", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                    >
                      <item.icon className="h-3 w-3" />
                    </div>
                    <span className="font-medium text-[11px]">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Package Include Icon Strip */}
          <div className="mt-4">
            <h3 className="text-xs font-bold text-[#0f2942] uppercase tracking-wider mb-3">
              {isHotelQuote ? "HOTEL AMENITIES" : "PACKAGE INCLUDE"}
            </h3>
            <div className="grid grid-cols-7 gap-2 text-center">
              {[
                { icon: Plane, label: "Flights" },
                { icon: Building2, label: "Hotels" },
                { icon: Car, label: "Transfers" },
                { icon: Utensils, label: "Meals" },
                { icon: Compass, label: "Sightseeing" },
                { icon: FileText, label: "Visa" },
                { icon: ShieldCheck, label: "Insurance" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-orange-100"
                  style={{ backgroundColor: "#fff7ed", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                >
                  <div
                    className="h-8 w-8 rounded-full text-white flex items-center justify-center shadow-sm"
                    style={{ backgroundColor: "#f25c05", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                  >
                    <item.icon className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-700">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quote Box */}
          <div className="mt-auto pt-2">
            <div
              className="rounded-xl p-3 border border-slate-200 text-center relative"
              style={{ backgroundColor: "#f8fafc", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
            >
              <p className="text-[11px] text-slate-600 italic font-medium">
                “A perfect holiday is not just about the destination, it&apos;s about the experience we create for you.”
              </p>
              <p className="text-[9px] text-orange-600 font-bold mt-0.5">— Look My Holiday</p>
            </div>
          </div>
        </div>

        {/* Decorative Wave Footer */}
        <div className="relative w-full h-12 overflow-hidden leading-none mt-auto">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z"
              fill="#f25c05"
              opacity="0.9"
            ></path>
            <path
              d="M0,20 C200,110 450,10 700,80 C950,140 1100,40 1200,80 L1200,120 L0,120 Z"
              fill="#0f2942"
            ></path>
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 3: DAY-WISE ITINERARY / STAY DETAILS */}
      {/* ========================================================================= */}
      <div
        className="print-page w-full max-w-[800px] mx-auto bg-white rounded-2xl shadow-xl print:shadow-none print:rounded-none overflow-hidden relative flex flex-col justify-between print:m-0 print:border-none"
        style={{
          minHeight: "1120px",
          aspectRatio: "1 / 1.414",
          backgroundColor: "#ffffff",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        {/* Header with Logo on Top Right */}
        <div className="p-8 pb-3 flex justify-between items-center z-10 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1.5 bg-[#f25c05] rounded-full"></div>
            <h2 className="text-lg font-black text-[#0f2942] tracking-wider uppercase">
              {isHotelQuote ? "STAY & ROOM DETAILS" : "ITINERARY"}
            </h2>
          </div>
          <img
            src={logoImg}
            alt="Look My Holiday Logo"
            className="h-10 md:h-12 w-auto max-w-[170px] object-contain"
          />
        </div>

        {/* Content Body */}
        <div className="p-8 py-4 flex-1 flex flex-col justify-start space-y-3.5">
          {/* Timeline */}
          <div className="relative pl-6 space-y-3 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:border-l-2 before:border-dashed before:border-orange-300">
            {travelItinerary.map((item, idx) => (
              <div key={idx} className="relative flex items-start gap-4">
                {/* Orange Day Circle */}
                <div
                  className="absolute -left-6 top-0 h-6 w-6 rounded-full text-white flex items-center justify-center text-[10px] font-black shadow-md border-2 border-white"
                  style={{ backgroundColor: "#f25c05", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                >
                  {item.day < 10 ? `0${item.day}` : item.day}
                </div>

                {/* Day Content Card */}
                <div
                  className="flex-1 p-3 rounded-xl border border-slate-200/80 shadow-xs"
                  style={{ backgroundColor: "#f8fafc", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                >
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h4 className="font-bold text-xs text-[#0f2942] uppercase tracking-wide">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 mt-1 leading-relaxed whitespace-pre-line">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0 flex flex-col items-end gap-1">
                      <span
                        className="inline-flex items-center gap-1 text-[9px] font-semibold text-[#0f2942] px-2 py-0.5 rounded-md border border-blue-100"
                        style={{ backgroundColor: "#eff6ff", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                      >
                        <Bed className="h-2.5 w-2.5 text-orange-500" />
                        Overnight: {form.destination ? form.destination.split(",")[0] : "Dubai"}
                      </span>
                      <span
                        className="inline-flex items-center gap-1 text-[9px] font-semibold text-orange-700 px-2 py-0.5 rounded-md border border-orange-100"
                        style={{ backgroundColor: "#fff7ed", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                      >
                        <Utensils className="h-2.5 w-2.5 text-orange-600" />
                        Meals: {idx === 0 ? "Dinner" : idx === 2 ? "Breakfast, Dinner" : "Breakfast"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Room Configuration / Special Notes Box */}
          <div
            className="p-3.5 rounded-xl border border-orange-200 mt-auto"
            style={{ backgroundColor: "#fff7ed", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
          >
            <h4 className="text-xs font-bold text-[#0f2942] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-orange-500" />
              Accommodation Details
            </h4>
            <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-700">
              <div>
                <span className="font-bold text-slate-900">Hotel:</span> {primaryHotel.hotelName || "4 Star Hotel"}
              </div>
              <div>
                <span className="font-bold text-slate-900">Room Type:</span> {primaryHotel.roomType || "Standard / Deluxe"}
              </div>
              <div>
                <span className="font-bold text-slate-900">Meal Plan:</span> {primaryHotel.mealPlan || "Daily Breakfast"}
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Wave Footer */}
        <div className="relative w-full h-12 overflow-hidden leading-none mt-auto">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z"
              fill="#f25c05"
              opacity="0.9"
            ></path>
            <path
              d="M0,20 C200,110 450,10 700,80 C950,140 1100,40 1200,80 L1200,120 L0,120 Z"
              fill="#0f2942"
            ></path>
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 4: PACKAGE COST BREAKUP & INCLUSIONS / EXCLUSIONS / TERMS */}
      {/* ========================================================================= */}
      <div
        className="print-page w-full max-w-[800px] mx-auto bg-white rounded-2xl shadow-xl print:shadow-none print:rounded-none overflow-hidden relative flex flex-col justify-between print:m-0 print:border-none"
        style={{
          minHeight: "1120px",
          aspectRatio: "1 / 1.414",
          backgroundColor: "#ffffff",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >
        {/* Header with Logo on Top Right */}
        <div className="p-8 pb-3 flex justify-between items-center z-10 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1.5 bg-[#f25c05] rounded-full"></div>
            <h2 className="text-lg font-black text-[#0f2942] tracking-wider uppercase">
              {isHotelQuote ? "HOTEL TARIFF BREAKUP" : "PACKAGE COST BREAKUP"}
            </h2>
          </div>
          <img
            src={logoImg}
            alt="Look My Holiday Logo"
            className="h-10 md:h-12 w-auto max-w-[170px] object-contain"
          />
        </div>

        {/* Main Content */}
        <div className="p-8 py-4 flex-1 flex flex-col justify-start space-y-4">
          {/* Cost Table */}
          <div className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
            <table className="w-full text-xs">
              <thead style={{ backgroundColor: "#0f2942", color: "#ffffff", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                <tr>
                  <th className="py-2.5 px-4 text-left font-bold uppercase tracking-wider text-white">Component</th>
                  <th className="py-2.5 px-4 text-right font-bold uppercase tracking-wider text-white">Amount (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {isHotelQuote ? (
                  <>
                    <tr>
                      <td className="py-2.5 px-4 font-semibold text-slate-700">
                        Hotel Accommodation ({primaryHotel.hotelName} - {durationText})
                      </td>
                      <td className="py-2.5 px-4 font-bold text-slate-800 text-right">
                        {formatINR(form.basePrice)}
                      </td>
                    </tr>
                    {form.gstRate > 0 && (
                      <tr style={{ backgroundColor: "#f8fafc", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                        <td className="py-2.5 px-4 font-semibold text-slate-700">
                          Applicable Taxes & GST ({form.gstRate}%)
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-800 text-right">
                          {formatINR(gstAmount)}
                        </td>
                      </tr>
                    )}
                  </>
                ) : (
                  <>
                    <tr>
                      <td className="py-2 px-4 font-semibold text-slate-700">Air Tickets (Return)</td>
                      <td className="py-2 px-4 font-bold text-slate-800 text-right">
                        {formatINR(Math.round(form.basePrice * 0.38))}
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: "#f8fafc", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                      <td className="py-2 px-4 font-semibold text-slate-700">Hotel ({form.durationNights || 5} Nights)</td>
                      <td className="py-2 px-4 font-bold text-slate-800 text-right">
                        {formatINR(Math.round(form.basePrice * 0.35))}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-semibold text-slate-700">Transfers (Airport + Sightseeing)</td>
                      <td className="py-2 px-4 font-bold text-slate-800 text-right">
                        {formatINR(Math.round(form.basePrice * 0.11))}
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: "#f8fafc", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                      <td className="py-2 px-4 font-semibold text-slate-700">Sightseeing & Activities</td>
                      <td className="py-2 px-4 font-bold text-slate-800 text-right">
                        {formatINR(Math.round(form.basePrice * 0.09))}
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4 font-semibold text-slate-700">Visa Assistance</td>
                      <td className="py-2 px-4 font-bold text-slate-800 text-right">
                        {formatINR(Math.round(form.basePrice * 0.045))}
                      </td>
                    </tr>
                    <tr style={{ backgroundColor: "#f8fafc", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                      <td className="py-2 px-4 font-semibold text-slate-700">Travel Insurance</td>
                      <td className="py-2 px-4 font-bold text-slate-800 text-right">
                        {formatINR(Math.round(form.basePrice * 0.025))}
                      </td>
                    </tr>
                  </>
                )}

                {discountAmount > 0 && (
                  <tr style={{ backgroundColor: "#ecfdf5", color: "#065f46", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
                    <td className="py-2 px-4 font-semibold">
                      Special Discount {form.discountType === "percentage" ? `(${form.discount}%)` : ""}
                    </td>
                    <td className="py-2 px-4 font-bold text-right">
                      - {formatINR(discountAmount)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Grand Total Banner */}
          <div
            className="rounded-2xl text-white p-4 text-center shadow-lg relative overflow-hidden"
            style={{
              backgroundColor: "#0f2942",
              backgroundImage: "linear-gradient(to right, #0a233b, #0f2942, #163b65)",
              WebkitPrintColorAdjust: "exact",
              printColorAdjust: "exact",
            }}
          >
            <p className="text-xs uppercase font-bold tracking-widest text-orange-400">
              TOTAL PACKAGE COST
            </p>
            <h3 className="text-3xl font-black mt-1 tracking-tight">
              {formatINR(totalAmount)}/-
            </h3>
            <p className="text-xs text-white/80 mt-0.5">For {totalGuests}</p>
            <p className="text-[10px] text-white/60 mt-0.5 italic">
              Rates are subject to availability at the time of confirmation.
            </p>
          </div>

          {/* Inclusions & Exclusions 2-Column */}
          <div className="grid grid-cols-2 gap-4">
            {/* Inclusions */}
            <div
              className="p-3.5 rounded-xl border border-emerald-200"
              style={{ backgroundColor: "#ecfdf5", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
            >
              <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                Component
              </h4>
              <ul className="text-[10.5px] text-slate-700 space-y-1 pl-1">
                {(form.inclusions
                  ? form.inclusions.split("\n").filter((i) => i.trim())
                  : [
                      `Accommodation in ${primaryHotel.rating || "4 Star"} Hotel`,
                      "Daily Breakfast",
                      "Return Air Tickets",
                      "Airport Transfers",
                      "All Sightseeing & Transfers as per itinerary",
                      "All Applicable Taxes",
                      "Visa Assistance",
                      "Travel Insurance",
                    ]
                ).map((inc, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold">•</span>
                    <span>{inc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Exclusions */}
            <div
              className="p-3.5 rounded-xl border border-rose-200"
              style={{ backgroundColor: "#fff1f2", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
            >
              <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <XCircle className="h-4 w-4 text-rose-600" />
                Exclusions
              </h4>
              <ul className="text-[10.5px] text-slate-700 space-y-1 pl-1">
                {(form.exclusions
                  ? form.exclusions.split("\n").filter((e) => e.trim())
                  : [
                      "Personal Expenses",
                      "Lunch & Dinner (Except as mentioned)",
                      "Room Service",
                      "Tips & Gratuities",
                      "Optional Activities",
                      "Anything not mentioned in Inclusions",
                    ]
                ).map((exc, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-rose-600 font-bold">•</span>
                    <span>{exc}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Terms & Conditions */}
          <div
            className="p-3.5 rounded-xl border border-slate-200 mt-auto"
            style={{ backgroundColor: "#f8fafc", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
          >
            <h4 className="text-xs font-bold text-[#0f2942] uppercase tracking-wider mb-1.5">
              Terms & Conditions
            </h4>
            <ul className="text-[10px] text-slate-600 space-y-1 leading-relaxed pl-1">
              {(form.terms
                ? form.terms.split("\n").filter((t) => t.trim())
                : [
                    "Prices are subject to availability at the time of confirmation.",
                    "Package cost may change without prior notice.",
                    "Hotel check-in time: 02:00 PM | Check-out time: 11:00 AM.",
                    "Cancellation charges will be applicable as per hotel/airline policy.",
                    "Passport must be valid for minimum 6 months from date of travel.",
                    "Look My Holiday reserves the right to modify the itinerary for operational reasons.",
                  ]
              ).map((term, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>{term}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Decorative Wave Footer */}
        <div className="relative w-full h-12 overflow-hidden leading-none mt-auto">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z"
              fill="#f25c05"
              opacity="0.9"
            ></path>
            <path
              d="M0,20 C200,110 450,10 700,80 C950,140 1100,40 1200,80 L1200,120 L0,120 Z"
              fill="#0f2942"
            ></path>
          </svg>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PAGE 5: COMPANY BRANDING & 17+ YEARS EXPERTISE */}
      {/* ========================================================================= */}
      <div
        className="print-page w-full max-w-[800px] mx-auto bg-white rounded-2xl shadow-xl print:shadow-none print:rounded-none overflow-hidden relative flex flex-col justify-between print:m-0 print:border-none"
        style={{
          minHeight: "1120px",
          aspectRatio: "1 / 1.414",
          backgroundColor: "#ffffff",
          WebkitPrintColorAdjust: "exact",
          printColorAdjust: "exact",
        }}
      >


        {/* Center Brand Hero */}
        <div className="px-8 text-center my-auto space-y-4">
          <div className="flex justify-center">
            <img
              src={logoImg}
              alt="Look My Holiday Logo"
              className="h-16 md:h-20 w-auto max-w-[240px] object-contain"
            />
          </div>

          <div className="inline-flex items-center gap-3">
            <span className="text-5xl font-black text-[#f25c05]">17+</span>
            <span className="text-left font-bold text-2xl text-[#0f2942] leading-tight">
              Years of <br />
              <span className="text-slate-700">Travel Expertise</span>
            </span>
          </div>

          {/* Orange Capabilities Card */}
          <div
            className="text-white p-5 rounded-2xl shadow-md max-w-xl mx-auto text-xs font-semibold"
            style={{ backgroundColor: "#f25c05", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
          >
            <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-left">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                <span>Holiday Package</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                <span>Best Deals on Hotels & Flights</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                <span>Visa Assistance</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                <span>Villa & Luxury Stays</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                <span>Corporate & Incentive Tours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-white"></span>
                <span>24/7 Support: Hassle-Free Journey</span>
              </div>
            </div>
          </div>

          {/* Contact Details Card with QR */}
          <div
            className="rounded-2xl p-5 shadow-xl border border-slate-100 max-w-xl mx-auto text-xs text-left grid grid-cols-12 gap-4 items-center"
            style={{ backgroundColor: "#ffffff", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
          >
            <div className="col-span-8 space-y-2 text-slate-700">
              <div className="flex items-center gap-2.5">
                <div
                  className="h-6 w-6 rounded-full text-orange-600 flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#ffedd5", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                >
                  <Phone className="h-3.5 w-3.5" />
                </div>
                <span className="font-semibold text-[11px]">+91 - 9413095483, 9529155562</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div
                  className="h-6 w-6 rounded-full text-orange-600 flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#ffedd5", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                >
                  <Mail className="h-3.5 w-3.5" />
                </div>
                <span className="font-semibold text-[11px]">resv@lookmyholidays.in</span>
              </div>

              <div className="flex items-center gap-2.5">
                <div
                  className="h-6 w-6 rounded-full text-orange-600 flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "#ffedd5", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                >
                  <Globe className="h-3.5 w-3.5" />
                </div>
                <span className="font-semibold text-[11px]">www.lookmyholidays.in</span>
              </div>

              <div className="flex items-start gap-2.5">
                <div
                  className="h-6 w-6 rounded-full text-orange-600 flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: "#ffedd5", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
                >
                  <MapPin className="h-3.5 w-3.5" />
                </div>
                <span className="text-[10px] text-slate-600 leading-tight">
                  FF-35 1st Floor, JTM Mall, Jagatpura Phatak, Jaipur 302017, India
                </span>
              </div>

              {/* Social Icons */}
              <div className="flex items-center gap-3 pt-2 pl-1 text-slate-500">
                <Instagram className="h-4 w-4 hover:text-pink-600 transition-colors" />
                <Linkedin className="h-4 w-4 hover:text-blue-700 transition-colors" />
                <Facebook className="h-4 w-4 hover:text-blue-600 transition-colors" />
                <Twitter className="h-4 w-4 hover:text-sky-500 transition-colors" />
              </div>
            </div>

            {/* QR Code */}
            <div
              className="col-span-4 flex flex-col items-center justify-center text-center p-2 rounded-xl border border-slate-200"
              style={{ backgroundColor: "#f8fafc", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
            >
              <img
                src="/upi-qr.png"
                alt="Scan to Connect"
                className="h-24 w-24 object-contain rounded-lg"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
              <span className="text-[9px] font-bold text-slate-700 mt-1">Scan to Connect</span>
              <span className="text-[8px] text-slate-500">Instant WhatsApp Support</span>
            </div>
          </div>
        </div>

        {/* Decorative Wave Footer */}
        <div className="relative w-full h-12 overflow-hidden leading-none mt-auto">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
            <path
              d="M0,0 C150,90 350,-40 500,45 C650,130 900,10 1200,60 L1200,120 L0,120 Z"
              fill="#f25c05"
              opacity="0.9"
            ></path>
            <path
              d="M0,20 C200,110 450,10 700,80 C950,140 1100,40 1200,80 L1200,120 L0,120 Z"
              fill="#0f2942"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};
