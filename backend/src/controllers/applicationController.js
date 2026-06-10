const Application = require("../models/Application");
const Job = require("../models/Job");

// POST /api/applications/apply
const handleJobApplication = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user.id;

    if (!jobId) {
      return res.status(400).json({ error: "Job ID is required." });
    }

    // Verify if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(444).json({ error: "Target job listing not found." });
    }

    // Check for duplicate application
    const existingApplication = await Application.findOne({ userId, jobId });
    if (existingApplication) {
      return res.status(400).json({ error: "You have already applied to this job." });
    }

    // Save job application record
    const application = await Application.create({
      userId,
      jobId
    });

    // Fetch user for email
    const User = require("../models/User");
    const user = await User.findById(userId);

    // Create Notification for the user
    const Notification = require("../models/Notification");
    await Notification.create({
      userId,
      title: "Application Submitted",
      message: `You have successfully applied for the ${job.title} position at ${job.company}.`,
      type: "JOB_APPLY"
    });

    // Notify Admin
    await Notification.create({
      targetRole: "admin",
      title: "New Job Application",
      message: `${user.fullName || 'A student'} applied for ${job.title} at ${job.company}.`,
      type: "NEW_APPLICATION",
      link: "/admin/applications"
    });

    // Send Email
    const { sendEmail } = require("../utils/emailService");
    if (user && user.email) {
      await sendEmail({
        to: user.email,
        subject: `Application Confirmation: ${job.title} at ${job.company}`,
        html: `
          <h2>Application Received</h2>
          <p>Hi ${user.fullName || 'User'},</p>
          <p>This is a confirmation that your application for the <strong>${job.title}</strong> role at <strong>${job.company}</strong> has been successfully received.</p>
          <p>We will notify you of any status updates regarding your application.</p>
          <br/>
          <p>Best Regards,</p>
          <p>CareerSync AI Team</p>
        `
      });
    }

    return res.status(201).json({
      message: "Applied to job successfully.",
      application
    });
  } catch (error) {
    // Catch Mongo unique index duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ error: "You have already applied to this job." });
    }
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// GET /api/applications/my-applications
const handleGetUserAppliedJobIds = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await Application.find({ userId }).select("jobId");
    
    // Return flat array of job IDs, safely ignoring nulls
    const appliedJobIds = applications
      .map(app => app.jobId ? app.jobId.toString() : null)
      .filter(id => id !== null);

    return res.status(200).json({
      message: "Applied job IDs fetched successfully.",
      appliedJobIds
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// GET /api/applications/history
const handleGetUserApplicationHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const applications = await Application.find({ userId })
      .populate("jobId")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "User application history fetched successfully.",
      applications
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// PUT /api/applications/:id/status
const handleUpdateApplicationStatus = async (req, res) => {
  try {
    const applicationId = req.params.id;
    const { status } = req.body; // e.g., 'Interviewing', 'Rejected', 'Hired'

    if (!status) {
      return res.status(400).json({ error: "Status is required." });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status },
      { new: true }
    ).populate('jobId');

    if (!application) {
      return res.status(404).json({ error: "Application not found." });
    }

    // Fetch user for email
    const User = require("../models/User");
    const user = await User.findById(application.userId);
    const job = application.jobId;

    // Create Notification
    const Notification = require("../models/Notification");
    await Notification.create({
      userId: application.userId,
      title: "Application Status Updated",
      message: `Your application for ${job.title} at ${job.company} is now marked as: ${status}.`,
      type: "SYSTEM_ALERT"
    });

    // Send Email
    const { sendEmail } = require("../utils/emailService");
    if (user && user.email) {
      await sendEmail({
        to: user.email,
        subject: `Application Update: ${job.title} at ${job.company}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4f46e5; text-align: center;">Application Status Update</h2>
            <p>Hi <strong>${user.fullName || 'User'}</strong>,</p>
            <p>There has been an update to your job application.</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="margin: 0; color: #64748b; font-size: 14px;">Position</p>
              <h3 style="margin: 5px 0 15px 0; color: #1e293b;">${job.title} at ${job.company}</h3>
              <p style="margin: 0; color: #64748b; font-size: 14px;">New Status</p>
              <h2 style="margin: 5px 0 0 0; color: #4f46e5;">${status}</h2>
            </div>
            <p>Log in to your CareerSync AI dashboard to review your active applications.</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>The CareerSync AI Team</strong></p>
          </div>
        `
      });
    }

    return res.status(200).json({
      message: "Application status updated successfully.",
      application
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

module.exports = {
  handleJobApplication,
  handleGetUserAppliedJobIds,
  handleGetUserApplicationHistory,
  handleUpdateApplicationStatus
};
