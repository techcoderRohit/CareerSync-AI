const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const { 
  handleGetAllJobs, 
  handleGetJobById, 
  handleSeedJobs,
  handleCreateJob,
  handleUpdateJob,
  handleDeleteJob
} = require("../controllers/jobController");

const router = express.Router();

// Route: GET /api/jobs - Query job list with filters (Public)
router.get("/", handleGetAllJobs);

// Route: GET /api/jobs/:id - Get specific job details (Public)
router.get("/:id", handleGetJobById);

// Route: GET /api/jobs/:id/match - Get match score (Protected)
router.get("/:id/match", authenticateToken, require("../controllers/jobController").handleGetJobMatch);

// Route: POST /api/jobs/seed - Developer seeding endpoint (Public/Dev)
router.post("/seed", handleSeedJobs);

// Route: POST /api/jobs - Admin create new job (Protected)
router.post("/", authenticateToken, handleCreateJob);

// Route: PUT /api/jobs/:id - Admin update job (Protected)
router.put("/:id", authenticateToken, handleUpdateJob);

// Route: DELETE /api/jobs/:id - Admin delete job (Protected)
router.delete("/:id", authenticateToken, handleDeleteJob);

module.exports = router;
