const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email address is required"],
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true
    },
    message: {
      type: String,
      required: [true, "Message body is required"],
      trim: true
    },
    status: {
      type: String,
      enum: ["Pending", "Resolved"],
      default: "Pending"
    },
    replyMessage: {
      type: String,
      default: ""
    },
    repliedAt: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
