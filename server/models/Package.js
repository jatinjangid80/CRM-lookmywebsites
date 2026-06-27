const mongoose = require("mongoose");

const InclusionSchema = new mongoose.Schema({ item: String });
const ExclusionSchema = new mongoose.Schema({ item: String });
const ItineraryDaySchema = new mongoose.Schema({
  day: { type: Number },
  title: { type: String },
  description: { type: String },
  meals: { type: String },
  accommodation: { type: String },
});

const PackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    destination: { type: String, required: true },
    duration: { type: String },               // "5 Nights / 6 Days"
    nights: { type: Number, default: 0 },
    days: { type: Number, default: 0 },
    price: { type: Number, default: 0 },
    priceType: { type: String, enum: ["Per Person", "Per Couple", "Group"], default: "Per Person" },
    category: {
      type: String,
      enum: ["Honeymoon", "Family", "Adventure", "Pilgrimage", "International", "Domestic", "Group Tour", "Corporate"],
      default: "Domestic",
    },
    status: { type: String, enum: ["Active", "Inactive", "Seasonal"], default: "Active" },
    coverImage: { type: String, default: "" },
    images: [{ type: String }],
    description: { type: String, default: "" },
    highlights: [{ type: String }],
    inclusions: [InclusionSchema],
    exclusions: [ExclusionSchema],
    itinerary: [ItineraryDaySchema],
    hotelDetails: { type: String },
    transportDetails: { type: String },
    minGroupSize: { type: Number, default: 1 },
    maxGroupSize: { type: Number, default: 50 },
    tags: [{ type: String }],
    totalBookings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PackageSchema.index({ name: "text", destination: "text" });

module.exports = mongoose.model("Package", PackageSchema);
