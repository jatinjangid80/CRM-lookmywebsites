const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    paymentId: { type: String, unique: true },   // "PAY-2024-001"
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    bookingId: { type: String },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    customerName: { type: String, required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["Advance", "Partial", "Final", "Refund"], default: "Advance" },
    method: {
      type: String,
      enum: ["Cash", "UPI", "Bank Transfer", "Card", "Cheque", "Online"],
      default: "UPI",
    },
    status: { type: String, enum: ["Pending", "Completed", "Failed", "Refunded"], default: "Completed" },
    transactionId: { type: String, default: "" },
    receivedBy: { type: String },
    notes: { type: String, default: "" },
    date: { type: String },                      // "YYYY-MM-DD"
  },
  { timestamps: true }
);

// Auto-generate paymentId
PaymentSchema.pre("save", async function (next) {
  if (!this.paymentId) {
    const count = await mongoose.model("Payment").countDocuments();
    const year = new Date().getFullYear();
    this.paymentId = `PAY-${year}-${String(count + 1).padStart(3, "0")}`;
  }
  next();
});

module.exports = mongoose.model("Payment", PaymentSchema);
