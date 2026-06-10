const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
    },
    company: {
      type: String,
      required: [true, "Company name is required"],
      trim: true,
    },
    logo: {
      type: String,
      default: "",
    },
    logoBg: {
      type: String,
      default: "bg-violet-600",
    },
    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
    },
    salary: {
      type: String,
      required: [true, "Salary information is required"],
    },
    type: {
      type: String,
      required: [true, "Job type (Full-time/Internship) is required"],
      enum: ["Full-time", "Internship"],
    },
    category: {
      type: String,
      required: [true, "Job category is required"],
      enum: ["Frontend", "Backend", "Full Stack", "AI / ML", "Data Science", "UI/UX"],
    },
    matchScore: {
      type: Number,
      default: 80,
    },
    skills: {
      type: [String],
      default: [],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Job = mongoose.models.Job || mongoose.model("Job", jobSchema);

module.exports = Job;
