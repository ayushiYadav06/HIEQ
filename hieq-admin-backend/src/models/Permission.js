const mongoose = require('mongoose');
const { Schema } = mongoose;

const PermissionSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    displayName: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      trim: true,
      default: 'general'
    },
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    updatedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.models.Permission || mongoose.model('Permission', PermissionSchema);

