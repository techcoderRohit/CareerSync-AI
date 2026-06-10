const express = require("express");
const { handleCreateContactMessage } = require("../controllers/contactController");

const router = express.Router();

// Route: POST /api/contact - Submit contact message (Public)
router.post("/", handleCreateContactMessage);

module.exports = router;
