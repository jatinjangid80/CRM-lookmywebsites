const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["admin", "employee"],
      default: "employee",
    },
    jobRole: {
      type: String,
      enum: [
        "HR & Admin Manager",
        "Sales Executive",
        "Travel Consultant",
        "Accounts Manager",
        "Visa Executive",
        "Executive",
        "admin",
      ],
      default: "Sales Executive",
    },
    empId: { type: String },
    avatar: { type: String, default: "" },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String },
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Hash password before save
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove sensitive fields from JSON output
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

module.exports = mongoose.model("User", UserSchema);
