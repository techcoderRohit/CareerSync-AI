const express = require("express");
const multer = require("multer");
const authenticateToken = require("../middlewares/authMiddleware");
const {
  handleResumeAnalysis, 
  handleGetResumeHistory, 
  handleDeleteResumeRecord,
  handleGetResumeBuilderData,
  handleSaveResumeBuilderData
} = require("../controllers/resumeController");

const router = express.Router();

// Configure storage strategy for uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    const fileExtension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + fileExtension);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB Limit
});

// Route: POST /api/resume/analyze - Upload and analyze resume (Protected)
router.post("/analyze", authenticateToken, upload.single("resume"), handleResumeAnalysis);

// Route: GET /api/resume/history - Retrieve user's previous resume scans (Protected)
router.get("/history", authenticateToken, handleGetResumeHistory);

// Route: DELETE /api/resume/:id - Delete a specific scan record (Protected)
router.delete("/:id", authenticateToken, handleDeleteResumeRecord);

// Route: GET /api/resume/download/:id - Download/Stream actual PDF binary
router.get("/download/:id", authenticateToken, require("../controllers/resumeController").handleDownloadResume);

// Route: GET /api/resume/view/:id - HTML wrapper to enforce tab title
router.get("/view/:id", authenticateToken, require("../controllers/resumeController").handleViewResumePage);

// Route: GET /api/resume/builder - Fetch builder data
router.get("/builder", authenticateToken, handleGetResumeBuilderData);

// Route: PUT /api/resume/builder - Save builder data
router.put("/builder", authenticateToken, handleSaveResumeBuilderData);

module.exports = router;
