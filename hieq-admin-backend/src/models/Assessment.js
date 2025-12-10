const mongoose = require("mongoose");
const { Schema } = mongoose;

const AssessmentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    status: { type: Boolean, default: true },
    type: {
      type: String,
      enum: ["Skills", "College", "Jobs", "Industries"],
      required: true,
      index: true,
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Compound index for type and name to ensure uniqueness per type
AssessmentSchema.index({ type: 1, name: 1 }, { unique: true });

module.exports =
  mongoose.models.Assessment || mongoose.model("Assessment", AssessmentSchema);

