const mongoose = require("mongoose");

const resumeDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },
  personalInfo: {
    fullName: { type: String, default: "" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    linkedin: { type: String, default: "" },
    github: { type: String, default: "" },
    portfolio: { type: String, default: "" }
  },
  summary: { type: String, default: "" },
  education: [{
    school: { type: String, default: "" },
    degree: { type: String, default: "" },
    fieldOfStudy: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    grade: { type: String, default: "" }
  }],
  experience: [{
    company: { type: String, default: "" },
    role: { type: String, default: "" },
    startDate: { type: String, default: "" },
    endDate: { type: String, default: "" },
    description: { type: String, default: "" }
  }],
  projects: [{
    title: { type: String, default: "" },
    link: { type: String, default: "" },
    description: { type: String, default: "" }
  }],
  skills: [{ type: String }],
  theme: {
    template: { type: String, default: "modern" },
    color: { type: String, default: "#0f172a" },
    fontFamily: { type: String, default: "'Inter', sans-serif" }
  }
}, { timestamps: true });

module.exports = mongoose.model("ResumeData", resumeDataSchema);
