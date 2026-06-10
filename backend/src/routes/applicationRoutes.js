const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const { 
  handleJobApplication, 
  handleGetUserAppliedJobIds,
  handleGetUserApplicationHistory,
  handleUpdateApplicationStatus
} = require("../controllers/applicationController");

const router = express.Router();

// Route: POST /api/applications/apply - Submit job application (Protected)
router.post("/apply", authenticateToken, handleJobApplication);

// Route: GET /api/applications/my-applications - Get user's applied job IDs list (Protected)
router.get("/my-applications", authenticateToken, handleGetUserAppliedJobIds);

// Route: GET /api/applications/history - Get user's detailed application history (Protected)
router.get("/history", authenticateToken, handleGetUserApplicationHistory);

// Route: PUT /api/applications/:id/status - Update application status (Protected)
router.put("/:id/status", authenticateToken, handleUpdateApplicationStatus);

module.exports = router;
