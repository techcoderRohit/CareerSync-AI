const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

// Signup Handler
async function handleUserSignup(req, res) {
  const { fullName, email, collegeName, password, skills } = req.body;

  if (!fullName || !email || !collegeName || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists with this email" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      collegeName,
      password: hashedPassword,
      skills: skills || "",
    });

    // Create Notification for the new user
    const Notification = require("../models/Notification");
    await Notification.create({
      userId: newUser._id,
      title: "Welcome to CareerSync AI! 🚀",
      message: "We're thrilled to have you on board. Upload your resume to get started with ATS analysis and personalized job matching.",
      type: "SYSTEM_ALERT"
    });

    // Notify Admin
    await Notification.create({
      targetRole: "admin",
      title: "New Student Signup",
      message: `${newUser.fullName} just registered on the platform.`,
      type: "NEW_USER",
      link: "/admin/students"
    });

    // Send Welcome Email
    const { sendEmail } = require("../utils/emailService");
    await sendEmail({
      to: newUser.email,
      subject: "Welcome to CareerSync AI!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5; text-align: center;">Welcome to CareerSync AI!</h2>
          <p>Hi <strong>${newUser.fullName}</strong>,</p>
          <p>We are super excited to have you join us. CareerSync AI is designed to help you land your dream job with AI-powered resume analysis and personalized job recommendations.</p>
          <h3>Next Steps:</h3>
          <ul>
            <li><strong>Upload your Resume</strong>: Go to the Resume Analyzer to get your ATS score.</li>
            <li><strong>Complete your Profile</strong>: Fill in your skills and education details.</li>
            <li><strong>Apply for Jobs</strong>: Find jobs that match your exact profile.</li>
          </ul>
          <br/>
          <p>Best regards,</p>
          <p><strong>The CareerSync AI Team</strong></p>
        </div>
      `
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

// Login Handler
async function handleUserLogin(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

// Forgot Password Handler
async function handleForgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "No user found with this email" });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set OTP and expiry (10 minutes)
    user.verificationOTP = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Send Email
    try {
      await sendEmail({
        email: user.email,
        fullName: user.fullName,
        otp: otp,
        subject: "🔒 Your CareerSync AI Verification Code",
      });

      return res.status(200).json({ message: "OTP sent to your email" });
    } catch (emailError) {
      user.verificationOTP = undefined;
      user.otpExpires = undefined;
      await user.save();
      console.error("Email Error:", emailError);
      return res.status(500).json({ error: "Could not send email. Please try again later." });
    }
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

// Verify OTP Handler
async function handleVerifyOTP(req, res) {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ 
      email,
      verificationOTP: otp,
      otpExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Clear OTP fields after successful verification
    user.verificationOTP = undefined;
    user.otpExpires = undefined;
    // user.isVerified = true; // This might be used for signup verification, for password reset we just need OTP to be correct
    await user.save();

    return res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

// Reset Password Handler
async function handleResetPassword(req, res) {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ error: "Email and new password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

// Get User Profile Handler
async function handleGetUserProfile(req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({
      message: "Profile fetched successfully",
      user
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

// Update User Profile Handler
async function handleUpdateUserProfile(req, res) {
  try {
    const { 
      fullName, 
      collegeName, 
      phone, 
      course, 
      graduationYear, 
      skills, 
      linkedinProfile, 
      githubProfile 
    } = req.body;
    
    if (!fullName || !collegeName) {
      return res.status(400).json({ error: "Name and College name are required" });
    }

    const updateData = {
      fullName,
      collegeName,
      phone,
      course,
      graduationYear,
      skills,
      linkedinProfile,
      githubProfile
    };

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

// Update User Skills Handler
async function handleUpdateSkills(req, res) {
  try {
    const { skills } = req.body;
    
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { skills },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      message: "Skills updated successfully",
      user: updatedUser
    });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

// Change Password Handler
async function handleChangePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: "Current and new password are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Incorrect current password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

// Delete Account Handler
async function handleDeleteAccount(req, res) {
  try {
    const user = await User.findByIdAndDelete(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal Server Error", message: error.message });
  }
}

module.exports = {
  handleUserSignup,
  handleUserLogin,
  handleForgotPassword,
  handleVerifyOTP,
  handleResetPassword,
  handleGetUserProfile,
  handleUpdateUserProfile,
  handleChangePassword,
  handleDeleteAccount,
  handleUpdateSkills
};

