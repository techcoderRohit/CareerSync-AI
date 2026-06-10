const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
  {
    platformName: {
      type: String,
      default: "CareerSync AI",
      trim: true,
    },
    supportEmail: {
      type: String,
      default: "support@careersync.ai",
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "maintenance"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.models.Settings || mongoose.model("Settings", settingsSchema);

module.exports = Settings;
