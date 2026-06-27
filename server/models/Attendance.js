const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    empId: { type: String, required: true },
    empName: { type: String },
    date: { type: String, required: true },        // "YYYY-MM-DD"
    status: {
      type: String,
      enum: ["Present", "Absent", "Half Day", "Leave", "Holiday", "WFH"],
      default: "Present",
    },
    checkIn: { type: String },                    // "09:00"
    checkOut: { type: String },                   // "18:00"
    workHours: { type: Number, default: 0 },
    notes: { type: String, default: "" },
    markedBy: { type: String },
  },
  { timestamps: true }
);

// Unique attendance per employee per day
AttendanceSchema.index({ empId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", AttendanceSchema);
