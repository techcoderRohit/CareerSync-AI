const express = require("express");
const { 
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
} = require("../controllers/authController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

// Route: POST /api/auth/signup
router.post("/signup", handleUserSignup);

// Route: POST /api/auth/login
router.post("/login", handleUserLogin);

// Route: POST /api/auth/forgot-password
router.post("/forgot-password", handleForgotPassword);

// Route: POST /api/auth/verify-otp
router.post("/verify-otp", handleVerifyOTP);

// Route: POST /api/auth/reset-password
router.post("/reset-password", handleResetPassword);

// Route: GET /api/auth/profile - Fetch profile (Protected)
router.get("/profile", authenticateToken, handleGetUserProfile);

// Route: PUT /api/auth/profile - Update profile (Protected)
router.put("/profile", authenticateToken, handleUpdateUserProfile);

// Route: PUT /api/auth/skills - Update skills (Protected)
router.put("/skills", authenticateToken, handleUpdateSkills);

// Route: PUT /api/auth/change-password - Change password (Protected)
router.put("/change-password", authenticateToken, handleChangePassword);

// Route: DELETE /api/auth/delete-account - Delete account (Protected)
router.delete("/delete-account", authenticateToken, handleDeleteAccount);

module.exports = router;
