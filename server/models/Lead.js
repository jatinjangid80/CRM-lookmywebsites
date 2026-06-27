const mongoose = require("mongoose");

const FollowUpSchema = new mongoose.Schema({
  date: { type: String },
  note: { type: String },
  by: { type: String },
  outcome: { type: String },
});

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String },
    phone2: { type: String },
    source: {
      type: String,
      enum: ["Website", "WhatsApp", "Instagram", "Facebook", "Referral", "Walk-in", "Phone", "Email", "Other"],
      default: "Other",
    },
    destination: { type: String },
    departureDate: { type: String },
    returnDate: { type: String },
    travelers: { type: Number, default: 1 },
    budget: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["New", "Contacted", "Interested", "Quoted", "Negotiation", "Won", "Lost", "On Hold"],
      default: "New",
    },
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
    assignedTo: { type: String },             // Employee empId or name
    assignedToName: { type: String },
    notes: { type: String, default: "" },
    requirements: { type: String, default: "" },
    quotedAmount: { type: Number, default: 0 },
    finalAmount: { type: Number, default: 0 },
    followUps: [FollowUpSchema],
    nextFollowUp: { type: String },           // Date string "YYYY-MM-DD"
    convertedToBooking: { type: Boolean, default: false },
    bookingId: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

LeadSchema.index({ name: "text", email: "text", phone: "text", destination: "text" });

module.exports = mongoose.model("Lead", LeadSchema);
