const mongoose = require("mongoose");

const AttendanceRecordSchema = new mongoose.Schema({
  date: { type: String },           // "YYYY-MM-DD"
  status: { type: String, enum: ["Present", "Absent", "Half Day", "Leave", "Holiday", "WFH"], default: "Present" },
  checkIn: { type: String },
  checkOut: { type: String },
  notes: { type: String, default: "" },
});

const LeaveSchema = new mongoose.Schema({
  type: { type: String },
  from: { type: String },
  to: { type: String },
  days: { type: Number },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  reason: { type: String },
  appliedOn: { type: String },
});

const PayrollSchema = new mongoose.Schema({
  month: { type: String },          // "2024-01"
  salary: { type: Number },
  bonus: { type: Number, default: 0 },
  deductions: { type: Number, default: 0 },
  net: { type: Number },
  status: { type: String, enum: ["Paid", "Pending", "Processing"], default: "Pending" },
  paidOn: { type: String },
});

const CertificateSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  issuer: { type: String },
  date: { type: String },
  url: { type: String, default: "#" },
});

const DocumentSchema = new mongoose.Schema({
  id: { type: String },
  name: { type: String },
  type: { type: String },
  url: { type: String },
  uploadedOn: { type: String },
});

const EmployeeSchema = new mongoose.Schema(
  {
    empId: { type: String, unique: true, required: true },  // "LMH-01"
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true },
    department: { type: String, default: "" },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    joinDate: { type: String },
    status: { type: String, enum: ["Active", "Inactive", "On Leave"], default: "Active" },
    rating: { type: Number, default: 0 },
    leads: { type: Number, default: 0 },
    closedDeals: { type: Number, default: 0 },
    revenue: { type: Number, default: 0 },
    description: { type: String, default: "" },
    recentActivity: { type: String, default: "" },

    // Credentials (synced with User)
    username: { type: String, default: "" },

    // Extended profile
    dob: { type: String },
    gender: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    emergencyContact: { type: String },
    emergencyPhone: { type: String },
    bloodGroup: { type: String },
    aadhaar: { type: String },
    pan: { type: String },
    bankName: { type: String },
    accountNumber: { type: String },
    ifsc: { type: String },
    manager: { type: String },
    reportingManager: { type: String },
    teamLead: { type: String },
    workLocation: { type: String, default: "Office" },
    salary: { type: Number, default: 0 },

    // Related records
    attendance: [AttendanceRecordSchema],
    leaves: [LeaveSchema],
    payroll: [PayrollSchema],
    certificates: [CertificateSchema],
    documents: [DocumentSchema],
    skills: [{ type: String }],
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Employee", EmployeeSchema);
