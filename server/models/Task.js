const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Review", "Done", "Cancelled"],
      default: "Todo",
    },
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
    category: {
      type: String,
      enum: ["Lead", "Booking", "Visa", "Document", "Follow Up", "Internal", "Other"],
      default: "Other",
    },
    assignedTo: { type: String },
    assignedToName: { type: String },
    assignedBy: { type: String },
    dueDate: { type: String },
    completedAt: { type: Date },
    relatedLead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    relatedBooking: { type: mongoose.Schema.Types.ObjectId, ref: "Booking" },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);
