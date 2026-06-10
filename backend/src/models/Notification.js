const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  targetRole: {
    type: String,
    enum: ["student", "admin"],
    default: "student"
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["JOB_APPLY", "RESUME_SCAN", "SYSTEM_ALERT", "JOB_MATCH", "NEW_USER", "NEW_APPLICATION", "NEW_CONTACT"],
    default: "SYSTEM_ALERT"
  },
  link: {
    type: String
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", NotificationSchema);
