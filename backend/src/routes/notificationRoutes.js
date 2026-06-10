const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const { handleGetNotifications, handleMarkAsRead } = require("../controllers/notificationController");

const router = express.Router();

router.get("/", authenticateToken, handleGetNotifications);
router.put("/mark-read", authenticateToken, handleMarkAsRead);

module.exports = router;
