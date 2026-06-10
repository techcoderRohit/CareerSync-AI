const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const { handleGetOverview } = require("../controllers/dashboardController");

const router = express.Router();

// GET /api/dashboard/overview
router.get("/overview", authenticateToken, handleGetOverview);

module.exports = router;
