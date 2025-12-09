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
      ],
      default: "STUDENT",
      index: true,
    },
    phone: String,
    profile: Schema.Types.Mixed,
    refreshTokens: [{ token: String, createdAt: Date }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
