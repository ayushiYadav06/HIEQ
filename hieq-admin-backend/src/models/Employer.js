const mongoose = require("mongoose");
const { Schema } = mongoose;

const EmployerSchema = new Schema(
  {
    email: { type: String, required: true, index: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    emailVerificationStatus: {
      type: String,
      enum: ['Pending', 'Verified'],
      default: 'Pending'
    },
    emailVerificationToken: { type: String },
    emailVerificationTokenExpiry: { type: Date },
    passwordResetToken: { type: String },
    passwordResetTokenExpiry: { type: Date },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    blocked: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },
    phone: String,
    contact: String,
    gender: String,
    dob: Date,
    summary: String,
    aadharFile: String, // File path
    aadharStatus: {
      type: String,
      enum: ['Pending', 'Approve', 'Reject'],
      default: 'Pending'
    },
    profileImage: String, // Profile image file path
    profile: Schema.Types.Mixed,
    // Employer-specific fields
    skills: [String],
    companyExperience: [{
      company: String,
      role: String,
      years: String
    }],
    refreshTokens: [{ token: String, createdAt: Date }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.models.Employer || mongoose.model("Employer", EmployerSchema);

