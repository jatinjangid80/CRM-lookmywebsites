const mongoose = require("mongoose");

const CustomerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String },
    phone2: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String, default: "India" },
    dob: { type: String },
    anniversary: { type: String },
    aadhaar: { type: String },
    pan: { type: String },
    passport: { type: String },
    passportExpiry: { type: String },
    source: { type: String },                  // How they found us
    assignedTo: { type: String },              // Employee name/id
    totalBookings: { type: Number, default: 0 },
    totalSpend: { type: Number, default: 0 },
    status: { type: String, enum: ["Active", "Inactive", "VIP", "Blacklisted"], default: "Active" },
    notes: { type: String, default: "" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

CustomerSchema.index({ name: "text", email: "text", phone: "text" });

module.exports = mongoose.model("Customer", CustomerSchema);
