const mongoose = require("mongoose");

const DocSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["Passport", "Visa", "Ticket", "Hotel Voucher", "Insurance", "Invoice", "Other"],
      default: "Other",
    },
    url: { type: String, default: "" },           // Cloudinary / file URL
    fileKey: { type: String, default: "" },       // For deletion from storage
    size: { type: Number, default: 0 },           // bytes
    mimeType: { type: String },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    customerName: { type: String },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    bookingId: { type: String },
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    uploadedBy: { type: String },
    notes: { type: String, default: "" },
    expiryDate: { type: String },
    status: { type: String, enum: ["Active", "Expired", "Archived"], default: "Active" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", DocSchema);
