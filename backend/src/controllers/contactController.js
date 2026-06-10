const Contact = require("../models/Contact");

const handleCreateContactMessage = async (req, res) => {
  try {
    const { fullName, email, subject, message } = req.body;

    if (!fullName || !email || !subject || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newMessage = await Contact.create({
      fullName,
      email,
      subject,
      message
    });

    // Notify Admin
    const Notification = require("../models/Notification");
    await Notification.create({
      targetRole: "admin",
      title: "New Contact Query",
      message: `${fullName} sent a query: ${subject}`,
      type: "NEW_CONTACT",
      link: "/admin/contact-support"
    });

    return res.status(201).json({
      message: "Your message has been sent successfully!",
      data: newMessage
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ error: messages.join(", ") });
    }
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

module.exports = {
  handleCreateContactMessage
};
