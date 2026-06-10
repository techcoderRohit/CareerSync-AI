const User = require("../models/User");
const Application = require("../models/Application");
const Resume = require("../models/Resume");
const Notification = require("../models/Notification");

const handleGetOverview = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Fetch User Data for Profile Completion
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const completionFields = [
      'fullName', 'email', 'collegeName', 'phone', 
      'course', 'graduationYear', 'skills', 
      'linkedinProfile', 'githubProfile', 'profilePic'
    ];
    let filledFields = 0;
    completionFields.forEach(field => {
      if (user[field] && user[field].toString().trim() !== '') {
        filledFields++;
      }
    });
    const profileCompletionPercentage = Math.round((filledFields / completionFields.length) * 100);

    // 2. Fetch Latest ATS Score
    const latestResume = await Resume.findOne({ userId }).sort({ createdAt: -1 });
    const atsScore = latestResume && latestResume.analysisResult && latestResume.analysisResult.score 
      ? latestResume.analysisResult.score 
      : 0;

    // 3. Fetch Applied Jobs Count
    const appliedJobsCount = await Application.countDocuments({ userId });

    // 4. Fetch Interview Calls Count
    const interviewCallsCount = await Application.countDocuments({ 
      userId, 
      status: "Interviewing" 
    });

    // 5. Fetch Recent Notifications
    const recentActivity = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(3);

    return res.status(200).json({
      overview: {
        profileCompletion: profileCompletionPercentage,
        atsScore,
        appliedJobsCount,
        interviewCallsCount,
        recentActivity
      }
    });

  } catch (error) {
    console.error("Dashboard Overview Error:", error);
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

module.exports = {
  handleGetOverview
};
