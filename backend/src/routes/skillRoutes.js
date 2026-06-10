const express = require("express");
const authenticateToken = require("../middlewares/authMiddleware");
const {
  handleGetQuizzes,
  handleGetQuiz,
  handleSubmitQuiz
} = require("../controllers/skillController");

const router = express.Router();

// GET /api/skills/quizzes
router.get("/quizzes", authenticateToken, handleGetQuizzes);

// GET /api/skills/quiz/:skill
router.get("/quiz/:skill", authenticateToken, handleGetQuiz);

// POST /api/skills/quiz/:skill/submit
router.post("/quiz/:skill/submit", authenticateToken, handleSubmitQuiz);

module.exports = router;
