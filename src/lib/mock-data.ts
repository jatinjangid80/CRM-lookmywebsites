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

export const leads: Lead[] = [
  {
    id: "L-1001",
    name: "Aarav Mehta",
    phone: "9876543210",
    whatsapp: "9876543210",
    email: "aarav.mehta@gmail.com",
    destination: "Dubai",
    budget: 52000,
    travelDate: in5DaysStr,
    status: "New Lead",
    source: "Instagram",
    createdAt: todayStr,
    createdTime: "10:30 AM",
    service: "International Package",
    priority: "High",
    pax: 2,
    packageType: "Luxury",
    assignedTo: "Nikita Bairwa",
    adults: 2,
    children: 0,
    nextFollowUp: todayStr,
    notes: "Client requested Burj Khalifa tickets and premium transfers.",
  },
  {
    id: "L-1002",
    name: "Ishita Sharma",
    phone: "9123456789",
    whatsapp: "9123456789",
    email: "ishita@yahoo.com",
    destination: "Thailand",
    budget: 45000,
    travelDate: "2026-08-10",
    status: "Contacted",
    source: "Website",
    createdAt: yesterdayStr,
    createdTime: "02:15 PM",
    service: "International Package",
    priority: "Medium",
    pax: 3,
    packageType: "Family",
    assignedTo: "Pushplata Kriplani",
    adults: 2,
    children: 1,
    nextFollowUp: in3DaysStr,
    notes: "Contacted via call. Sending family resort packages in Phuket.",
  },
  {
    id: "L-1003",
    name: "Rohan Gupta",
    phone: "8888888888",
    whatsapp: "8888888888",
    email: "rohan.g@gmail.com",
    destination: "Kashmir",
    budget: 35000,
    travelDate: in3DaysStr,
    status: "Quotation Sent",
    source: "Referral",
    createdAt: yesterdayStr,
    createdTime: "09:45 AM",
    service: "Domestic Package",
    priority: "High",
    pax: 2,
    packageType: "Honeymoon",
    assignedTo: "Nikita Bairwa",
    adults: 2,
    children: 0,
    nextFollowUp: todayStr,
    notes: "Sent luxury houseboat quote. Follow-up today for confirmation.",
  },
  {
    id: "L-1004",
    name: "Preeti Patel",
    phone: "9999999999",
    whatsapp: "9999999999",
    email: "preeti@outlook.com",
    destination: "Goa",
    budget: 28000,
    travelDate: "2026-07-20",
    status: "Negotiation",
    source: "Facebook",
    createdAt: yesterdayStr,
    createdTime: "04:20 PM",
    service: "Domestic Package",
    priority: "Low",
    pax: 4,
    packageType: "Group",
    assignedTo: "Pushplata Kriplani",
    adults: 4,
    children: 0,
    nextFollowUp: in5DaysStr,
    notes: "Negotiating on hotel rating. Wants 4-star instead of 3-star.",
  },
  {
    id: "L-1005",
    name: "Karan Johar",
    phone: "7777777777",
    whatsapp: "7777777777",
    email: "karan@dharmaprod.com",
    destination: "Maldives",
    budget: 120000,
    travelDate: in5DaysStr,
    status: "on conform",
    source: "Ads",
    createdAt: yesterdayStr,
    createdTime: "11:10 AM",
    service: "International Package",
    priority: "High",
    pax: 2,
    packageType: "Luxury",
    assignedTo: "Nikita Bairwa",
    adults: 2,
    children: 0,
    notes: "Booking confirmed. Fully paid.",
  },
];

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  trips: number;
  totalSpend: number;
  tier: "Silver" | "Gold" | "Platinum";
  dob?: string;
  relationship?: string;
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

export const bookings: Booking[] = [
  {
    id: "BK-001",
    bookingType: "Holiday Package",
    supplier: "RezLive",
    bookingDate: todayStr,
    customer: "Karan Johar",
    mobileNumber: "7777777777",
    bookedBy: "Nikita Bairwa",
    company: "Dharma Prod",
    reference: "REF-777",
    saleInvoiceNo: "SAL-5001",
    purchaseInvoiceNo: "PUR-5001",
    remarks: "Premium overwater villa booked",
    sellingPrice: 120000,
    purchasePrice: 105000,
    profit: 15000,
    margin: 12.5,
    amount: 120000,
    paid: 120000,
    paymentMode: "UPI",
    transactionId: "TXN1029384",
    status: "Confirmed",
    package: "Maldives Luxury Escape",
    travelDate: in5DaysStr,
    details: {
      travelFrom: "Delhi",
      travelTo: "Male",
      destination: "Maldives",
      packageType: "Luxury",
      noOfPax: 2,
      hotelName: "Soneva Jani",
      mealPlan: "All Inclusive",
      pnr: "PNR-MAL-992",
    },
  },
  {
    id: "BK-002",
    bookingType: "Holiday Package",
    supplier: "GTA Holidays",
    bookingDate: yesterdayStr,
    customer: "Aarav Mehta",
    mobileNumber: "9876543210",
    bookedBy: "Nikita Bairwa",
    company: "",
    reference: "",
    saleInvoiceNo: "SAL-5002",
    purchaseInvoiceNo: "PUR-5002",
    remarks: "Dubai package pending balance",
    sellingPrice: 52000,
    purchasePrice: 46000,
    profit: 6000,
    margin: 11.5,
    amount: 52000,
    paid: 30000,
    paymentMode: "Bank Transfer",
    transactionId: "TXN58392",
    status: "Pending",
    package: "Dubai City & Safari",
    travelDate: in5DaysStr,
    details: {
      travelFrom: "Mumbai",
      travelTo: "Dubai",
      destination: "Dubai",
      packageType: "Luxury",
      noOfPax: 2,
      hotelName: "Atlantis The Palm",
      mealPlan: "Half Board",
      pnr: "PNR-DXB-112",
    },
  },
];

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
};

export const paymentFollowUps: PaymentFollowUp[] = [
  {
    id: "PFU-1001",
    invoiceId: "BK-002",
    customerId: "C-101",
    customerName: "Aarav Mehta",
    customerPhone: "9876543210",
    invoiceDate: yesterdayStr,
    totalAmount: 52000,
    pendingAmount: 22000,
    nextFollowUpDate: todayStr,
    nextFollowUpTime: "14:00",
    repeat: "Daily",
    notificationReminder: 7,
    notes: "Client promised to pay by evening.",
  }
];

export type Expense = {
  id: string;
  date: string;
  category: string;
  amount: number;
  paymentMode: string;
  reference: string;
  description: string;
  status: "Paid" | "Pending" | "Cancelled";
};

export const expenses: Expense[] = [
  {
    id: "EXP-001",
    date: todayStr,
    category: "Office Supplies",
    amount: 1500,
    paymentMode: "UPI",
    reference: "UPI/123456789",
    description: "Printer ink and paper",
    status: "Paid",
  },
  {
    id: "EXP-002",
    date: yesterdayStr,
    category: "Software Subscription",
    amount: 4500,
    paymentMode: "Card",
    reference: "CRD/5544",
    description: "Monthly CRM License",
    status: "Paid",
  },
  {
    id: "EXP-003",
    date: todayStr,
    category: "Travel",
    amount: 12000,
    paymentMode: "Bank Transfer",
    reference: "NEFT/ABC1234",
    description: "Flight for client meeting in Delhi",
    status: "Pending",
  }
];
