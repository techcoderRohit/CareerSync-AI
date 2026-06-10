const express = require("express");
const requireAdmin = require("../middlewares/adminMiddleware");
const {
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
} = require("../controllers/adminController");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'profile_' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

const router = express.Router();

// All routes require Admin privileges
router.use(requireAdmin);

// Route: GET /api/admin/stats
router.get("/stats", handleGetDashboardStats);

// Route: GET /api/admin/students
router.get("/students", handleGetAllStudents);

// Route: GET /api/admin/applications
router.get("/applications", handleGetAllApplications);

// Route: GET /api/admin/settings
router.get("/settings", handleGetSettings);

// Route: PUT /api/admin/settings
router.put("/settings", handleUpdateSettings);

// Route: PUT /api/admin/profile
router.put("/profile", upload.single("profilePic"), handleUpdateAdminProfile);

// Route: PUT /api/admin/applications/:id/status
router.put("/applications/:id/status", handleUpdateApplicationStatus);

// Route: DELETE /api/admin/students/:id
router.delete("/students/:id", handleDeleteStudent);

// Route: GET /api/admin/contacts
router.get("/contacts", handleGetAllContacts);

// Route: PUT /api/admin/contacts/:id/reply
router.put("/contacts/:id/reply", handleReplyContact);

// Route: GET /api/admin/notifications
router.get("/notifications", handleGetAdminNotifications);

// Route: PUT /api/admin/notifications/read-all
router.put("/notifications/read-all", handleMarkAllAdminNotificationsRead);

// Route: PUT /api/admin/notifications/:id/read
router.put("/notifications/:id/read", handleMarkAdminNotificationRead);

// Route: POST /api/admin/newsletter
router.post("/newsletter", handleSendNewsletter);

module.exports = router;
