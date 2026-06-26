import React, { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Booking, BookingType, PaymentMode, PaymentStatus } from "@/lib/mock-data";
import { Plane, Train, Hotel, Map, Car, FileText, Shield, Bus, Calculator } from "lucide-react";

interface AddBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (booking: Booking) => void;
}

const bookingTypes: { type: BookingType; icon: any; label: string }[] = [
  { type: "Air Ticket", icon: Plane, label: "Air Ticket" },
  { type: "Train Ticket", icon: Train, label: "Train Ticket" },
  { type: "Hotel", icon: Hotel, label: "Hotel" },
  { type: "Holiday Package", icon: Map, label: "Holiday Package" },
  { type: "Taxi", icon: Car, label: "Taxi" },
  { type: "Visa", icon: FileText, label: "Visa" },
  { type: "Travel Insurance", icon: Shield, label: "Travel Insurance" },
  { type: "Bus Ticket", icon: Bus, label: "Bus Ticket" },
];

export function AddBookingModal({ open, onOpenChange, onSave }: AddBookingModalProps) {
  const [bookingType, setBookingType] = useState<BookingType>("Holiday Package");
  
  // Common Header
  const [supplier, setSupplier] = useState("");
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().slice(0, 10));
  const [customer, setCustomer] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [bookedBy, setBookedBy] = useState("");
  const [company, setCompany] = useState("");
  const [reference, setReference] = useState("");
  const [saleInvoiceNo, setSaleInvoiceNo] = useState("");
  const [purchaseInvoiceNo, setPurchaseInvoiceNo] = useState("");
  const [remarks, setRemarks] = useState("");

  // Auto Calculated & Core Financials
  const [sellingPrice, setSellingPrice] = useState<number>(0);
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  const [serviceCharges, setServiceCharges] = useState<number>(0);
  const [gstAmount, setGstAmount] = useState<number>(0);
  const [ticketAmount, setTicketAmount] = useState<number>(0); // For Bus
  
  const [refundDate, setRefundDate] = useState("");
  const [refundAmount, setRefundAmount] = useState<number>(0);

  // Payment Details
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("Cash");
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("Pending");
  const [transactionId, setTransactionId] = useState("");

  // Details Object
  const [details, setDetails] = useState<any>({});

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setBookingType("Holiday Package");
      setSupplier("");
      setBookingDate(new Date().toISOString().slice(0, 10));
      setCustomer("");
      setMobileNumber("");
      setBookedBy("");
      setCompany("");
      setReference("");
      setSaleInvoiceNo("");
      setPurchaseInvoiceNo("");
      setRemarks("");
      
      setSellingPrice(0);
      setPurchasePrice(0);
      setServiceCharges(0);
      setGstAmount(0);
      setTicketAmount(0);
      setRefundDate("");
      setRefundAmount(0);
      
      setAmountPaid(0);
      setPaymentMode("Cash");
      setPaymentStatus("Pending");
      setTransactionId("");
      
      setDetails({});
    }
  }, [open]);

  // Handle Detail Change
  const updateDetail = (key: string, value: any) => {
    setDetails((prev: any) => ({ ...prev, [key]: value }));
  };

  // Calculations
  const profit = useMemo(() => {
    return (sellingPrice || 0) - (purchasePrice || 0);
  }, [sellingPrice, purchasePrice]);

  const margin = useMemo(() => {
    if (!sellingPrice || sellingPrice === 0) return 0;
    return Number(((profit / sellingPrice) * 100).toFixed(2));
  }, [profit, sellingPrice]);

  const pendingAmount = useMemo(() => {
    return (sellingPrice || 0) - (amountPaid || 0);
  }, [sellingPrice, amountPaid]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) {
      alert("Customer name is required.");
      return;
    }

    const newBooking: Booking = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      bookingType,
      supplier,
      bookingDate,
      customer,
      mobileNumber,
      bookedBy,
      company,
      reference,
      saleInvoiceNo,
      purchaseInvoiceNo,
      remarks,
      
      sellingPrice,
      purchasePrice,
      serviceCharges,
      gstAmount,
      ticketAmount,
      profit,
      margin,
      refundDate,
      refundAmount,
      
      amount: sellingPrice,
      paid: amountPaid,
      paymentMode,
      transactionId,
      status: paymentStatus,
      
      // Legacy fallbacks
      package: details.packageType || details.hotelName || details.airline || details.trainName || bookingType,
      travelDate: details.travelDate || details.checkIn || details.processDate || bookingDate,
      
      details
    };

    onSave(newBooking);
    onOpenChange(false);
  };

  const renderSectionHeader = (title: string) => (
    <div className="col-span-full border-b border-border pb-2 mt-4 mb-2 flex items-center gap-2">
      <div className="h-4 w-1 bg-primary rounded-full"></div>
      <h3 className="text-sm font-bold tracking-tight">{title}</h3>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto rounded-2xl border border-border p-0 shadow-2xl bg-card">
        <div className="sticky top-0 z-10 bg-card border-b border-border p-6 pb-4">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold">Add New Booking</DialogTitle>
            <DialogDescription className="text-xs mt-1">
              Select a booking type and fill in the details below.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 pt-2">
          {/* Booking Type Selector */}
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Booking Type *</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {bookingTypes.map((bt) => {
                const Icon = bt.icon;
                const isSelected = bookingType === bt.type;
                return (
                  <button
                    key={bt.type}
                    type="button"
                    onClick={() => setBookingType(bt.type)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-primary/10 border-primary/50 text-primary ring-1 ring-primary/20"
                        : "bg-secondary/40 border-border text-muted-foreground hover:bg-secondary/80 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {bt.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderSectionHeader("Common Details")}
            
            <div className="space-y-2">
              <Label>Supplier *</Label>
              <Input required value={supplier} onChange={(e) => setSupplier(e.target.value)} placeholder="Supplier name" />
            </div>
            <div className="space-y-2">
              <Label>Booking Date *</Label>
              <Input type="date" required value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Customer Name *</Label>
              <Input required value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="e.g. John Doe" />
            </div>
            <div className="space-y-2">
              <Label>Mobile Number *</Label>
              <Input required type="tel" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} placeholder="+91 XXXXX XXXXX" />
            </div>
            <div className="space-y-2">
              <Label>Booked By</Label>
              <Input value={bookedBy} onChange={(e) => setBookedBy(e.target.value)} placeholder="Agent/Employee name" />
            </div>
            <div className="space-y-2">
              <Label>Company</Label>
              <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company name" />
            </div>
            <div className="space-y-2">
              <Label>Reference</Label>
              <Input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Ref ID" />
            </div>
            <div className="space-y-2">
              <Label>Sale Invoice No.</Label>
              <Input value={saleInvoiceNo} onChange={(e) => setSaleInvoiceNo(e.target.value)} placeholder="INV-001" />
            </div>
            <div className="space-y-2">
              <Label>Purchase Invoice No.</Label>
              <Input value={purchaseInvoiceNo} onChange={(e) => setPurchaseInvoiceNo(e.target.value)} placeholder="PINV-001" />
            </div>

            {renderSectionHeader("Booking Details")}

            {/* DYNAMIC FORM FIELDS BASED ON TYPE */}
            {(bookingType === "Train Ticket" || bookingType === "Air Ticket") && (
              <>
                <div className="space-y-2"><Label>Travel Date *</Label><Input type="date" required value={details.travelDate || ""} onChange={(e) => updateDetail("travelDate", e.target.value)} /></div>
                <div className="space-y-2"><Label>Sector *</Label><Input required value={details.sector || ""} onChange={(e) => updateDetail("sector", e.target.value)} placeholder="DEL - MUM" /></div>
                {bookingType === "Train Ticket" ? (
                  <div className="space-y-2"><Label>Train Name *</Label><Input required value={details.trainName || ""} onChange={(e) => updateDetail("trainName", e.target.value)} placeholder="Rajdhani Exp" /></div>
                ) : (
                  <div className="space-y-2"><Label>Airline *</Label><Input required value={details.airline || ""} onChange={(e) => updateDetail("airline", e.target.value)} placeholder="IndiGo" /></div>
                )}
                <div className="space-y-2"><Label>PNR *</Label><Input required value={details.pnr || ""} onChange={(e) => updateDetail("pnr", e.target.value)} placeholder="PNR12345" /></div>
                <div className="space-y-2"><Label>Passenger Name *</Label><Input required value={details.passengerName || ""} onChange={(e) => updateDetail("passengerName", e.target.value)} placeholder="Passenger Name" /></div>
              </>
            )}

            {bookingType === "Hotel" && (
              <>
                <div className="space-y-2"><Label>Check In *</Label><Input type="date" required value={details.checkIn || ""} onChange={(e) => updateDetail("checkIn", e.target.value)} /></div>
                <div className="space-y-2"><Label>Check Out *</Label><Input type="date" required value={details.checkOut || ""} onChange={(e) => updateDetail("checkOut", e.target.value)} /></div>
                <div className="space-y-2"><Label>City *</Label><Input required value={details.city || ""} onChange={(e) => updateDetail("city", e.target.value)} placeholder="Goa" /></div>
                <div className="space-y-2"><Label>Hotel Name *</Label><Input required value={details.hotelName || ""} onChange={(e) => updateDetail("hotelName", e.target.value)} placeholder="Taj Hotel" /></div>
                <div className="space-y-2"><Label>Meal Plan</Label><Input value={details.mealPlan || ""} onChange={(e) => updateDetail("mealPlan", e.target.value)} placeholder="CP/MAP" /></div>
                <div className="space-y-2"><Label>Leader Name *</Label><Input required value={details.leaderName || ""} onChange={(e) => updateDetail("leaderName", e.target.value)} placeholder="Guest Name" /></div>
              </>
            )}

            {bookingType === "Holiday Package" && (
              <>
                <div className="space-y-2"><Label>Travel From *</Label><Input type="date" required value={details.travelFrom || ""} onChange={(e) => updateDetail("travelFrom", e.target.value)} /></div>
                <div className="space-y-2"><Label>Travel To *</Label><Input type="date" required value={details.travelTo || ""} onChange={(e) => updateDetail("travelTo", e.target.value)} /></div>
                <div className="space-y-2"><Label>Destination *</Label><Input required value={details.destination || ""} onChange={(e) => updateDetail("destination", e.target.value)} placeholder="Maldives" /></div>
                <div className="space-y-2"><Label>Package Type *</Label><Input required value={details.packageType || ""} onChange={(e) => updateDetail("packageType", e.target.value)} placeholder="Honeymoon" /></div>
                <div className="space-y-2"><Label>No. of Pax *</Label><Input type="number" required value={details.noOfPax || ""} onChange={(e) => updateDetail("noOfPax", Number(e.target.value))} placeholder="2" /></div>
                <div className="space-y-2"><Label>Leader Name *</Label><Input required value={details.leaderName || ""} onChange={(e) => updateDetail("leaderName", e.target.value)} placeholder="Guest Name" /></div>
              </>
            )}

            {bookingType === "Taxi" && (
              <>
                <div className="space-y-2"><Label>Travel Date *</Label><Input type="date" required value={details.travelDate || ""} onChange={(e) => updateDetail("travelDate", e.target.value)} /></div>
                <div className="space-y-2"><Label>City / Route *</Label><Input required value={details.cityRoute || ""} onChange={(e) => updateDetail("cityRoute", e.target.value)} placeholder="Delhi - Agra" /></div>
                <div className="space-y-2"><Label>Vehicle Type *</Label><Input required value={details.vehicleType || ""} onChange={(e) => updateDetail("vehicleType", e.target.value)} placeholder="Innova Crysta" /></div>
                <div className="space-y-2"><Label>Days *</Label><Input type="number" required value={details.days || ""} onChange={(e) => updateDetail("days", Number(e.target.value))} placeholder="3" /></div>
                <div className="space-y-2"><Label>Vehicle No.</Label><Input value={details.vehicleNo || ""} onChange={(e) => updateDetail("vehicleNo", e.target.value)} placeholder="DL 1C AA 1111" /></div>
                <div className="space-y-2"><Label>Driver Name</Label><Input value={details.driverName || ""} onChange={(e) => updateDetail("driverName", e.target.value)} placeholder="Driver Name" /></div>
                <div className="space-y-2"><Label>Driver Mobile</Label><Input type="tel" value={details.driverMobile || ""} onChange={(e) => updateDetail("driverMobile", e.target.value)} placeholder="Mobile" /></div>
                <div className="space-y-2"><Label>Total KM</Label><Input type="number" value={details.totalKm || ""} onChange={(e) => updateDetail("totalKm", Number(e.target.value))} placeholder="0" /></div>
                <div className="space-y-2"><Label>Night Charges (₹)</Label><Input type="number" value={details.nightCharges || ""} onChange={(e) => updateDetail("nightCharges", Number(e.target.value))} placeholder="0" /></div>
                <div className="space-y-2"><Label>Toll Tax (₹)</Label><Input type="number" value={details.tollTax || ""} onChange={(e) => updateDetail("tollTax", Number(e.target.value))} placeholder="0" /></div>
                <div className="space-y-2"><Label>Rate (₹)</Label><Input type="number" value={details.rate || ""} onChange={(e) => updateDetail("rate", Number(e.target.value))} placeholder="0" /></div>
              </>
            )}

            {bookingType === "Visa" && (
              <>
                <div className="space-y-2"><Label>Country *</Label><Input required value={details.country || ""} onChange={(e) => updateDetail("country", e.target.value)} placeholder="Dubai" /></div>
                <div className="space-y-2"><Label>Visa Type *</Label><Input required value={details.visaType || ""} onChange={(e) => updateDetail("visaType", e.target.value)} placeholder="Tourist 30 Days" /></div>
                <div className="space-y-2"><Label>Process Date *</Label><Input type="date" required value={details.processDate || ""} onChange={(e) => updateDetail("processDate", e.target.value)} /></div>
                <div className="space-y-2"><Label>Application Status</Label><Input value={details.applicationStatus || ""} onChange={(e) => updateDetail("applicationStatus", e.target.value)} placeholder="Submitted" /></div>
                <div className="space-y-2"><Label>Passenger Name *</Label><Input required value={details.passengerName || ""} onChange={(e) => updateDetail("passengerName", e.target.value)} placeholder="Passenger Name" /></div>
              </>
            )}

            {bookingType === "Travel Insurance" && (
              <>
                <div className="space-y-2"><Label>Country *</Label><Input required value={details.country || ""} onChange={(e) => updateDetail("country", e.target.value)} placeholder="Schengen" /></div>
                <div className="space-y-2"><Label>Insurance Type *</Label><Input required value={details.insuranceType || ""} onChange={(e) => updateDetail("insuranceType", e.target.value)} placeholder="Comprehensive" /></div>
                <div className="space-y-2"><Label>Process Date *</Label><Input type="date" required value={details.processDate || ""} onChange={(e) => updateDetail("processDate", e.target.value)} /></div>
                <div className="space-y-2"><Label>Passenger Name *</Label><Input required value={details.passengerName || ""} onChange={(e) => updateDetail("passengerName", e.target.value)} placeholder="Passenger Name" /></div>
              </>
            )}

            {bookingType === "Bus Ticket" && (
              <>
                <div className="space-y-2"><Label>Travel Date *</Label><Input type="date" required value={details.travelDate || ""} onChange={(e) => updateDetail("travelDate", e.target.value)} /></div>
                <div className="space-y-2"><Label>Sector *</Label><Input required value={details.sector || ""} onChange={(e) => updateDetail("sector", e.target.value)} placeholder="DEL - MANALI" /></div>
                <div className="space-y-2"><Label>Bus Operator *</Label><Input required value={details.busOperator || ""} onChange={(e) => updateDetail("busOperator", e.target.value)} placeholder="Zingbus" /></div>
                <div className="space-y-2"><Label>PNR / Ticket No.</Label><Input value={details.pnr || ""} onChange={(e) => updateDetail("pnr", e.target.value)} placeholder="TKT123" /></div>
                <div className="space-y-2"><Label>Passenger Name *</Label><Input required value={details.passengerName || ""} onChange={(e) => updateDetail("passengerName", e.target.value)} placeholder="Passenger Name" /></div>
              </>
            )}

            {renderSectionHeader("Financial Details")}
            
            {bookingType === "Bus Ticket" && (
              <div className="space-y-2"><Label>Ticket Amount (₹)</Label><Input type="number" value={ticketAmount || ""} onChange={(e) => setTicketAmount(Number(e.target.value))} /></div>
            )}
            
            {(bookingType === "Train Ticket" || bookingType === "Air Ticket" || bookingType === "Bus Ticket") && (
              <div className="space-y-2"><Label>Service Charges (₹)</Label><Input type="number" value={serviceCharges || ""} onChange={(e) => setServiceCharges(Number(e.target.value))} /></div>
            )}

            {(bookingType === "Train Ticket" || bookingType === "Bus Ticket") && (
              <div className="space-y-2"><Label>GST Amount (₹)</Label><Input type="number" value={gstAmount || ""} onChange={(e) => setGstAmount(Number(e.target.value))} /></div>
            )}

            <div className="space-y-2"><Label>Selling Price (₹)</Label><Input type="number" required value={sellingPrice || ""} onChange={(e) => setSellingPrice(Number(e.target.value))} /></div>
            <div className="space-y-2"><Label>Purchase Price (₹)</Label><Input type="number" required value={purchasePrice || ""} onChange={(e) => setPurchasePrice(Number(e.target.value))} /></div>
            
            <div className="space-y-2"><Label>Refund Date</Label><Input type="date" value={refundDate} onChange={(e) => setRefundDate(e.target.value)} /></div>
            <div className="space-y-2"><Label>Refund Amount (₹)</Label><Input type="number" value={refundAmount || ""} onChange={(e) => setRefundAmount(Number(e.target.value))} /></div>

            {/* Calculations Box */}
            <div className="col-span-full mt-2 rounded-xl bg-secondary/30 p-4 border border-border flex flex-wrap gap-6 items-center">
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Auto-Calc:</span>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Profit</p>
                <p className={`font-mono font-bold ${profit > 0 ? "text-emerald-600" : profit < 0 ? "text-red-500" : "text-gray-700"}`}>
                  ₹{profit.toLocaleString()}
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Margin %</p>
                <p className={`font-mono font-bold ${margin > 0 ? "text-emerald-600" : margin < 0 ? "text-red-500" : "text-gray-700"}`}>
                  {margin}%
                </p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase text-muted-foreground font-bold">Pending Amount</p>
                <p className="font-mono font-bold text-orange-600">
                  ₹{pendingAmount.toLocaleString()}
                </p>
              </div>
            </div>

            {renderSectionHeader("Payment Details")}
            
            <div className="space-y-2"><Label>Total Amount (₹)</Label><Input disabled value={sellingPrice} className="bg-secondary/50 font-mono font-semibold" /></div>
            <div className="space-y-2"><Label>Amount Paid (₹)</Label><Input type="number" required value={amountPaid || ""} onChange={(e) => setAmountPaid(Number(e.target.value))} /></div>
            
            <div className="space-y-2">
              <Label>Payment Mode</Label>
              <select 
                value={paymentMode} 
                onChange={(e) => setPaymentMode(e.target.value as PaymentMode)} 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Payment Status</Label>
              <select 
                value={paymentStatus} 
                onChange={(e) => setPaymentStatus(e.target.value as PaymentStatus)} 
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>

            <div className="space-y-2 col-span-1 md:col-span-2"><Label>Transaction ID</Label><Input value={transactionId} onChange={(e) => setTransactionId(e.target.value)} placeholder="TXN..." /></div>

            {renderSectionHeader("Remarks")}
            <div className="space-y-2 col-span-full">
              <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="Add any additional notes here..." />
            </div>

          </div>

          <div className="sticky bottom-0 bg-card border-t border-border p-4 -mx-6 -mb-6 mt-6 flex justify-end gap-3 z-10">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-[#FF6B00] hover:bg-[#E05E00] text-white">Save Booking</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
