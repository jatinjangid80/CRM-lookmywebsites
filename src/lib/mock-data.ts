export type Package = {
  id: string;
  title: string;
  destination: string;
  country: string;
  duration: string;
  nights: number;
  days: number;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  category: "Domestic" | "International" | "Honeymoon" | "Family" | "Group" | "Luxury";
  image: string;
  summary: string;
  highlights: string[];
  inclusions: string[];
  exclusions: string[];
  hotels: { city: string; name: string; nights: number; stars: number }[];
  itinerary: { day: number; title: string; description: string }[];
};

const img = (q: string) =>
  `https://images.unsplash.com/${q}?auto=format&fit=crop&w=1400&q=80`;

export const packages: Package[] = [];

export const destinations: any[] = [];

export const testimonials: any[] = [];

export const gallery: string[] = [];

// CRM mock data
export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string;
  destination: string;
  budget: number;
  travelDate: string;
  status: "New Lead" | "Contacted" | "Quotation Sent" | "Negotiation" | "Booked" | "Completed" | "Lost";
  source: string;
  reference?: string;
  createdAt: string;
  service: string;
  priority: "High" | "Medium" | "Low";
  pax: number;
  packageType: string;
  assignedTo: string;
  insuranceDate?: string;
  policyType?: string;
  queryType?: string;
  clientCompany?: string;
  expiryDate?: string;
  notes?: string;
  noteDate?: string;
};

export const leads: Lead[] = [];

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  trips: number;
  totalSpend: number;
  tier: "Silver" | "Gold" | "Platinum";
};

export const customers: Customer[] = [];

export type BookingType = "Air Ticket" | "Train Ticket" | "Hotel" | "Holiday Package" | "Taxi" | "Visa" | "Travel Insurance" | "Bus Ticket" | "Legacy";
export type PaymentMode = "Cash" | "UPI" | "Card" | "Bank Transfer" | "Cheque" | "";
export type PaymentStatus = "Pending" | "Partial" | "Paid" | "Refunded";

export type Booking = {
  id: string;
  // Common Header
  bookingType: BookingType;
  supplier: string;
  bookingDate: string;
  customer: string;
  mobileNumber: string;
  bookedBy: string;
  company: string;
  reference: string;
  saleInvoiceNo: string;
  purchaseInvoiceNo: string;
  remarks: string;

  // Auto Calculated & Payment fields
  sellingPrice: number;
  purchasePrice: number;
  serviceCharges?: number;
  gstAmount?: number;
  ticketAmount?: number; // for Bus
  profit: number;
  margin: number;
  refundDate?: string;
  refundAmount?: number;
  
  // Payment Section
  amount: number; // maps to Selling Price (Total Amount)
  paid: number;   // Amount Paid
  paymentMode: PaymentMode;
  transactionId: string;
  status: "Confirmed" | "Pending" | "Cancelled" | "Completed" | PaymentStatus; // Merged for backward compat

  // Legacy fields (kept for backward compatibility during transition)
  package: string;
  travelDate: string;

  // Dynamic details based on BookingType
  details?: {
    // Shared
    travelDate?: string;
    sector?: string;
    passengerName?: string;
    pnr?: string;
    
    // Train / Air
    trainName?: string;
    airline?: string;
    
    // Hotel
    checkIn?: string;
    checkOut?: string;
    city?: string;
    hotelName?: string;
    mealPlan?: string;
    leaderName?: string;
    
    // Holiday Package
    travelFrom?: string;
    travelTo?: string;
    destination?: string;
    packageType?: string;
    noOfPax?: number;
    
    // Taxi
    cityRoute?: string;
    vehicleType?: string;
    days?: number;
    vehicleNo?: string;
    driverName?: string;
    driverMobile?: string;
    totalKm?: number;
    nightCharges?: number;
    tollTax?: number;
    rate?: number;

    // Visa / Insurance
    country?: string;
    visaType?: string;
    processDate?: string;
    applicationStatus?: string;
    insuranceType?: string;
    
    // Bus
    busOperator?: string;
  };
};

export const bookings: Booking[] = [];

export const revenueByMonth: any[] = [];

export const destinationPerformance: any[] = [];

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
}
