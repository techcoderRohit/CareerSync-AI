const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const Settings = require("../models/Settings");
const Contact = require("../models/Contact");
const Notification = require("../models/Notification");
const nodemailer = require("nodemailer");

// GET /api/admin/stats
const handleGetDashboardStats = async (req, res) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    // Get recent applications
    const recentApplications = await Application.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('userId', 'fullName email')
      .populate('jobId', 'title company');

    // Calculate Application Trends (Last 7 Days)
    const last7Days = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d.toISOString().split('T')[0];
    }).reverse();

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const appsInLast7Days = await Application.find({ createdAt: { $gte: sevenDaysAgo } }, 'createdAt');

    const trendData = last7Days.map(dateStr => {
      const count = appsInLast7Days.filter(app => app.createdAt.toISOString().startsWith(dateStr)).length;
      const dayName = new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' });
      return { name: dayName, applications: count, date: dateStr };
    });

    // Calculate Course Distribution
    const courseDistributionAgg = await User.aggregate([
      { $match: { role: "student", course: { $exists: true, $ne: "" } } },
      { $group: { _id: "$course", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);
    const courseDistribution = courseDistributionAgg.map(c => ({
      name: c._id,
      value: c.count
    }));

    // Calculate Application Status Distribution
    const statusDistributionAgg = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);
    const statusDistribution = statusDistributionAgg.map(s => ({
      name: s._id || 'Applied',
      value: s.count
    }));

    return res.status(200).json({
      message: "Dashboard stats fetched successfully",
      stats: {
        totalStudents,
        totalJobs,
        totalApplications
      },
      recentApplications,
      trendData,
      courseDistribution,
      statusDistribution
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// GET /api/admin/students
const handleGetAllStudents = async (req, res) => {
  try {
    const students = await User.find({ role: "student" })
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Students fetched successfully",
      students
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// GET /api/admin/applications
const handleGetAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate('userId', 'fullName email phone collegeName linkedinProfile githubProfile')
      .populate('jobId', 'title company location')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Applications fetched successfully",
      applications
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// GET /api/admin/settings
const handleGetSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({}); // Creates default
    }

    const adminUser = await User.findById(req.user.id).select("-password");

    return res.status(200).json({
      message: "Settings fetched successfully",
      settings,
      admin: adminUser
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// PUT /api/admin/settings
const handleUpdateSettings = async (req, res) => {
  try {
    const { platformName, supportEmail, status } = req.body;
    
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    if (platformName) settings.platformName = platformName;
    if (supportEmail) settings.supportEmail = supportEmail;
    if (status) settings.status = status;

    await settings.save();

    return res.status(200).json({
      message: "Settings updated successfully",
      settings
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// PUT /api/admin/profile
const handleUpdateAdminProfile = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    
    if (!firstName) {
      return res.status(400).json({ error: "First name is required" });
    }

    const fullName = lastName ? `${firstName} ${lastName}` : firstName;
    const updateData = { fullName };

    if (req.body.removeAvatar === "true") {
      updateData.profilePic = "";
    } else if (req.file) {
      updateData.profilePic = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Admin profile updated successfully",
      user
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// PUT /api/admin/applications/:id/status
const handleUpdateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["Applied", "Reviewing", "Interviewing", "Accepted", "Rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value." });
    }

    const Application = require("../models/Application");
    const updatedApplication = await Application.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedApplication) {
      return res.status(404).json({ error: "Application not found." });
    }

    return res.status(200).json({
      message: "Application status updated.",
      application: updatedApplication
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// DELETE /api/admin/students/:id
const handleDeleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const User = require("../models/User");
    const deletedStudent = await User.findByIdAndDelete(id);

    if (!deletedStudent) {
      return res.status(404).json({ error: "Student not found." });
    }

    // Cascade delete applications and resumes
    const Application = require("../models/Application");
    const Resume = require("../models/Resume");
    
    await Application.deleteMany({ userId: id });
    await Resume.deleteMany({ userId: id });

    return res.status(200).json({
      message: "Student and associated records deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// GET /api/admin/contacts
const handleGetAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return res.status(200).json({
      message: "Contacts fetched successfully",
      contacts
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// PUT /api/admin/contacts/:id/reply
const handleReplyContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { replyMessage } = req.body;

    if (!replyMessage) {
      return res.status(400).json({ error: "Reply message is required" });
    }

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ error: "Contact query not found" });
    }

    if (contact.status === 'Resolved') {
      return res.status(400).json({ error: "Query is already resolved" });
    }

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can change this to use SMTP_HOST, etc.
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const mailOptions = {
      from: process.env.SMTP_USER || '"CareerSync Support" <no-reply@careersync.com>',
      to: contact.email,
      subject: `Re: ${contact.subject} - CareerSync Support`,
      text: `Hello ${contact.fullName},\n\nRegarding your query:\n"${contact.message}"\n\n${replyMessage}\n\nBest regards,\nCareerSync Team`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2>Hello ${contact.fullName},</h2>
          <p>Regarding your query:</p>
          <blockquote style="border-left: 4px solid #7c3aed; padding-left: 10px; color: #555; background: #f3f4f6; padding: 10px;">
            ${contact.message}
          </blockquote>
          <p>${replyMessage.replace(/\n/g, '<br>')}</p>
          <br>
          <p>Best regards,<br><strong>CareerSync Team</strong></p>
        </div>
      `
    };

    // Send email
    await transporter.sendMail(mailOptions);

    // Update contact
    contact.replyMessage = replyMessage;
    contact.status = 'Resolved';
    contact.repliedAt = new Date();
    await contact.save();

    return res.status(200).json({
      message: "Reply sent successfully",
      contact
    });

  } catch (error) {
    console.error("Mail Error:", error);
    return res.status(500).json({ error: "Failed to send reply", message: error.message });
  }
};

// GET /api/admin/notifications
const handleGetAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ targetRole: "admin" })
      .sort({ createdAt: -1 })
      .limit(50); // Get latest 50
    return res.status(200).json({ notifications });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// PUT /api/admin/notifications/:id/read
const handleMarkAdminNotificationRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ error: "Notification not found" });
    }
    return res.status(200).json({ message: "Notification marked as read", notification });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// PUT /api/admin/notifications/read-all
const handleMarkAllAdminNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { targetRole: "admin", isRead: false },
      { $set: { isRead: true } }
    );
    return res.status(200).json({ message: "All notifications marked as read" });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// POST /api/admin/newsletter
const handleSendNewsletter = async (req, res) => {
  try {
    const { subject, message, isHtml } = req.body;
    
    if (!subject || !message) {
      return res.status(400).json({ error: "Subject and message are required" });
    }

    // Fetch all student emails
    const students = await User.find({ role: "student" }).select("email fullName");
    if (students.length === 0) {
      return res.status(400).json({ error: "No students found to send email to." });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    const emailPromises = students.map(student => {
      const mailOptions = {
        from: process.env.SMTP_USER || '"CareerSync Updates" <no-reply@careersync.com>',
        to: student.email,
        subject: subject,
        text: isHtml ? message.replace(/<[^>]+>/g, '') : message,
        html: isHtml ? message : `<div style="font-family: Arial, sans-serif;">${message.replace(/\n/g, '<br>')}</div>`
      };
      return transporter.sendMail(mailOptions);
    });

    await Promise.all(emailPromises);

    return res.status(200).json({ 
      message: `Newsletter sent successfully to ${students.length} students.` 
    });
  } catch (error) {
    console.error("Newsletter Error:", error);
    return res.status(500).json({ error: "Failed to send newsletter", message: error.message });
  }
};

module.exports = {
  handleGetDashboardStats,
  handleGetAllStudents,
  handleGetAllApplications,
  handleGetSettings,
  handleUpdateSettings,
  handleUpdateAdminProfile,
  handleUpdateApplicationStatus,
  handleDeleteStudent,
  handleGetAllContacts,
  handleReplyContact,
  handleGetAdminNotifications,
  handleMarkAdminNotificationRead,
  handleMarkAllAdminNotificationsRead,
  handleSendNewsletter
};
