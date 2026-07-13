export type Customer = {
  id: string;
  customer_name: string;
  email: string | null;
  phone: string | null;
  reference_name: string | null;
  address: string | null;
  created_at: string;
};

export type Vendor = {
  id: string;
  vendor_name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  city: string | null;
  vendor_type: string | null;
  bank_name: string | null;
  account_number: string | null;
  ifsc: string | null;
  upi: string | null;
  created_at: string;
};

export type Lead = {
  id: string;
  customer_id: string | null;
  destination: string | null;
  travel_date: string | null;
  budget: number;
  adults: number;
  children: number;
  status: string; // New, Quoted, Negotiation, Booked, Cancelled, Postponed
  created_by: string | null;
  created_at: string;
};

export type Quotation = {
  id: string;
  lead_id: string | null;
  quotation_no: string | null;
  amount: number;
  discount: number;
  gst: number;
  total: number;
  pdf_url: string | null;
  status: string; // Draft, Sent, Accepted, Rejected
  created_at: string;
};

export type Booking = {
  id: string;
  booking_no: string | null;
  customer_id: string | null;
  lead_id: string | null;
  quotation_id: string | null;
  booking_amount: number;
  paid_amount: number;
  remaining_amount: number;
  booking_status: string; // Pending, Confirmed, Cancelled, Completed
  created_at: string;
};

export type CustomerPayment = {
  id: string;
  booking_id: string | null;
  amount: number;
  payment_mode: string | null;
  transaction_id: string | null;
  payment_date: string | null;
  remarks: string | null;
  receipt_url: string | null;
  created_at: string;
};

export type VendorPaymentRequest = {
  id: string;
  booking_id: string | null;
  vendor_id: string | null;
  amount: number;
  requested_by: string | null;
  status: string; // Pending, Approved, Rejected, Paid
  remarks: string | null;
  created_at: string;
};

export type PaymentApproval = {
  id: string;
  request_id: string | null;
  reviewed_by: string | null;
  status: string | null; // Approved, Rejected
  remarks: string | null;
  reviewed_at: string;
};

export type PaymentFollowup = {
  id: string;
  booking_id: string | null;
  customer_id: string | null;
  followup_date: string | null;
  amount_due: number;
  message: string | null;
  status: string; // Pending, Done, Cancelled
  created_at: string;
};

export type ActivityLog = {
  id: string;
  action: string;
  actor_name: string | null;
  created_at: string;
  details: any;
};

export type Document = {
  id: string;
  entity_type: string | null; // booking, lead, customer, vendor_payment
  entity_id: string | null;
  file_name: string | null;
  file_url: string | null;
  uploaded_by: string | null;
  created_at: string;
};
