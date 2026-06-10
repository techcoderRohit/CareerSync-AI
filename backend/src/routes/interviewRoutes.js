const express = require("express");
const { handleGenerateInterviewPrep, handleMockInterviewChat } = require("../controllers/interviewController");
const authenticateToken = require("../middlewares/authMiddleware");

const router = express.Router();

// Route: GET /api/interview/generate
router.get("/generate", authenticateToken, handleGenerateInterviewPrep);
router.post("/chat", handleMockInterviewChat);

module.exports = router;
