const mongoose = require("mongoose");

const TravelerSchema = new mongoose.Schema({
  name: { type: String },
  age: { type: Number },
  gender: { type: String },
  passport: { type: String },
  aadhaar: { type: String },
});

const BookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, unique: true },    // "BK-2024-001"
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    customerName: { type: String, required: true },
    customerPhone: { type: String },
    customerEmail: { type: String },
    destination: { type: String, required: true },
    packageRef: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
    packageName: { type: String },
    departureDate: { type: String },
    returnDate: { type: String },
    travelers: { type: Number, default: 1 },
    travelerDetails: [TravelerSchema],
    totalAmount: { type: Number, default: 0 },
    paidAmount: { type: Number, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled", "Completed", "On Hold"],
      default: "Pending",
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Partial", "Paid", "Refunded"],
      default: "Unpaid",
    },
    assignedTo: { type: String },
    assignedToName: { type: String },
    leadRef: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    notes: { type: String, default: "" },
    specialRequirements: { type: String, default: "" },
    hotelName: { type: String },
    flightDetails: { type: String },
    visaRequired: { type: Boolean, default: false },
    visaStatus: { type: String, enum: ["NA", "Pending", "Applied", "Approved", "Rejected"], default: "NA" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Auto-generate bookingId
BookingSchema.pre("save", async function (next) {
  if (!this.bookingId) {
    const count = await mongoose.model("Booking").countDocuments();
    const year = new Date().getFullYear();
    this.bookingId = `BK-${year}-${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

BookingSchema.index({ customerName: "text", destination: "text", bookingId: "text" });

module.exports = mongoose.model("Booking", BookingSchema);
