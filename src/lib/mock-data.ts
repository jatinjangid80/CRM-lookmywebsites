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

const img = (q: string) => `https://images.unsplash.com/${q}?auto=format&fit=crop&w=1400&q=80`;

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
  status:
  | "New Lead"
  | "Contacted"
  | "Quotation Sent"
  | "Negotiation"
  | "Confirmed"
  | "Payment Pending"
  | "on conform"
  | "in process"
  | "Postponed"
  | "Lost";
  source: string;
  reference?: string;
  createdAt: string;
  service: string;
  priority: "High" | "Medium" | "Low";
  pax: number;
  packageType: string;
  assignedTo: string;
  createdTime?: string;
  insuranceDate?: string;
  policyType?: string;
  queryType?: string;
  clientCompany?: string;
  expiryDate?: string;
  notes?: string;
  noteDate?: string;
  allNotes?: { text: string; date: string }[];
  // Extended fields
  whatsapp?: string;
  adults?: number;
  children?: number;
  lastFollowUp?: string;
  nextFollowUp?: string;
  // Air Ticket fields
  sourceCity?: string;
  destinationCity?: string;
  infants?: number;
  fareType?: string;
  directFlight?: boolean;
  flightClass?: string;
  preferredAirline?: string;
  // Hotel fields
  checkIn?: string;
  checkOut?: string;
  nights?: string;
  nationality?: string;
  starRating?: string;
  mealPreference?: string;
  // Visa fields
  visaType?: string;
  passportExpiry?: string;
  country?: string;
  // Package / Holiday fields
  goingFrom?: string;
  noOfDays?: string;
  inclusions?: string;
  theme?: string;
  hotelPreference?: string;
  foodPreference?: string;
  // Corporate / MICE fields
  companyName?: string;
  eventType?: string;
  // Ops assignment
  assignToOps?: boolean;
  assignOpsTo?: string;
  leadSection?: string;
};

const todayStr = new Date().toISOString().slice(0, 10);
const yesterdayStr = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
const in3DaysStr = new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10);
const in5DaysStr = new Date(Date.now() + 86400000 * 5).toISOString().slice(0, 10);

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  trips: number;
  totalSpend: number;
  tier: "Silver" | "Gold" | "Platinum";
  companyName?: string;
  city?: string;
  referenceName?: string;
  leadSource?: string;
  status?: "Active" | "Inactive" | "VIP";
  assignedEmployee?: string;
  dob?: string;
  dateOfAnniversary?: string;
  gst?: string;
};

export const customers: Customer[] = [];

export type BookingType =
  | "Air Ticket"
  | "Train Ticket"
  | "Hotel"
  | "Holiday Package"
  | "Taxi"
  | "Visa"
  | "Travel Insurance"
  | "General Insurance"
  | "Bus Ticket"
  | "Legacy";
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
  paid: number; // Amount Paid
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

    // General Insurance
    expiryDate?: string;
    policyType?: string;
    queryType?: string;
    clientCompany?: string;

    // Bus
    busOperator?: string;
  };
};

export type PaymentRequest = {
  id: string;
  date: string;
  employeeId: string;
  employeeName: string;
  invoiceId: string;
  entityType: "Customer" | "Vendor" | "Employee" | "";
  entityId: string;
  entityName: string;
  amount: number;
  status: "Pending Approval" | "Accounts Verified" | "Approved" | "Rejected" | "Paid";
  remark?: string;
  receiptId?: string; // Links to the generated receipt once paid
  auditLog: {
    timestamp: string;
    action: string;
    user: string;
    remark?: string;
  }[];
};

export const initialPaymentRequests: PaymentRequest[] = [];

export const revenueByMonth: any[] = [
  { month: "Jan", revenue: 4.2 },
  { month: "Feb", revenue: 5.8 },
  { month: "Mar", revenue: 8.5 },
  { month: "Apr", revenue: 7.9 },
  { month: "May", revenue: 12.4 },
  { month: "Jun", revenue: 15.6 },
];

export const destinationPerformance: any[] = [
  { name: "Dubai", sales: 12 },
  { name: "Thailand", sales: 18 },
  { name: "Maldives", sales: 8 },
  { name: "Kashmir", sales: 15 },
  { name: "Bali", sales: 9 },
  { name: "Goa", sales: 22 },
];

export function formatINR(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export type PaymentFollowUp = {
  id: string;
  invoiceId: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  invoiceDate: string;
  totalAmount: number;
  pendingAmount: number;
  nextFollowUpDate: string;
  nextFollowUpTime: string;
  repeat: "None" | "Daily" | "Weekly";
  notificationReminder: number;
  notes: string;
  createdBy?: string;
};



export type Expense = {
  id: string;
  date: string;
  category: string;
  amount: number;
  paymentMode: string;
  reference: string;
  description: string;
  status: "Paid" | "Pending" | "Cancelled";
  createdBy?: string;
};


