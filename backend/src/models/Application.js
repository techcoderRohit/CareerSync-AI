const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User association is required"],
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: [true, "Job association is required"],
    },
    status: {
      type: String,
      enum: ["Applied", "Reviewing", "Interviewing", "Accepted", "Rejected"],
      default: "Applied",
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce unique application: a user cannot apply to the same job twice
applicationSchema.index({ userId: 1, jobId: 1 }, { unique: true });

const Application = mongoose.models.Application || mongoose.model("Application", applicationSchema);

module.exports = Application;
