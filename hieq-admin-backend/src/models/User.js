const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, required: true, index: true, unique: true },
    passwordHash: { type: String },
    name: { type: String, required: true },
    blocked: { type: Boolean, default: false },
    deleted: { type: Boolean, default: false },

    role: {
      type: String,
      enum: [
        "SUPER_ADMIN",
        "ADMIN",
        "CONTENT_ADMIN",
        "VERIFICATION_ADMIN",
        "SUPPORT_ADMIN",
        "EMPLOYER",
        "STUDENT",
        "JOB_SEEKER",
      ],
      default: "STUDENT",
      index: true,
    },
    permissions: [{
      type: String,
      trim: true
    }],
    phone: String,
    contact: String,
    gender: String,
    dob: Date,
    summary: String,
    aadharFile: String, // File path
    profile: Schema.Types.Mixed,
    // Candidate/Job Seeker fields
    education: [{
      degree: String,
      university: String,
      year: String,
      degreeFile: String // File path
    }],
    experience: [{
      company: String,
      role: String,
      years: String
    }],
    // Employer fields
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

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
