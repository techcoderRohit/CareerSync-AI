const User = require("../models/User");

// Dummy quizzes for demonstration
const quizzes = {
  react: [
    { id: 1, question: "What is the virtual DOM?", options: ["A direct copy of the HTML DOM", "A lightweight Javascript representation of the DOM", "A browser feature", "A React Native feature"], answer: 1 },
    { id: 2, question: "Which hook is used for side effects in React?", options: ["useState", "useEffect", "useContext", "useReducer"], answer: 1 },
    { id: 3, question: "React is a...", options: ["Framework", "Library", "Database", "Language"], answer: 1 },
    { id: 4, question: "What does JSX stand for?", options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Syntax Extension"], answer: 0 },
    { id: 5, question: "How do you pass data to a child component?", options: ["Using Context", "Using State", "Using Props", "Using Redux"], answer: 2 },
  ],
  python: [
    { id: 1, question: "Which keyword is used to define a function in Python?", options: ["func", "def", "function", "define"], answer: 1 },
    { id: 2, question: "What is the output of 2 ** 3?", options: ["6", "8", "9", "12"], answer: 1 },
    { id: 3, question: "Which of the following is mutable?", options: ["Tuple", "String", "List", "Integer"], answer: 2 },
    { id: 4, question: "What is the correct extension of a Python file?", options: [".py", ".python", ".p", ".pt"], answer: 0 },
    { id: 5, question: "Which collection is ordered, changeable, and allows duplicate members?", options: ["Set", "Dictionary", "Tuple", "List"], answer: 3 },
  ],
  "ui/ux": [
    { id: 1, question: "What does UI stand for?", options: ["User Interface", "User Interaction", "User Integration", "Universal Interface"], answer: 0 },
    { id: 2, question: "Which tool is primarily used for UI design?", options: ["Photoshop", "VS Code", "Figma", "Blender"], answer: 2 },
    { id: 3, question: "What is a Wireframe?", options: ["A low-fidelity visual representation of a website", "A high-fidelity prototype", "A CSS framework", "A database schema"], answer: 0 },
    { id: 4, question: "What does UX stand for?", options: ["User Exchange", "User Experience", "User Execution", "User Example"], answer: 1 },
    { id: 5, question: "Which principle focuses on making elements look like what they do?", options: ["Affordance", "Contrast", "Alignment", "Proximity"], answer: 0 },
  ],
  "node.js": [
    { id: 1, question: "Node.js is built on which JavaScript engine?", options: ["SpiderMonkey", "V8", "Chakra", "JavaScriptCore"], answer: 1 },
    { id: 2, question: "Which module is used to create a web server in Node.js?", options: ["http", "fs", "path", "url"], answer: 0 },
    { id: 3, question: "Node.js uses an event-driven, non-blocking I/O model.", options: ["True", "False", "Only on Windows", "Only for databases"], answer: 0 },
    { id: 4, question: "What is npm?", options: ["Node Package Manager", "Node Project Manager", "New Package Manager", "Node Program Maker"], answer: 0 },
    { id: 5, question: "Which framework is most commonly used with Node.js?", options: ["Django", "Flask", "Express", "Spring"], answer: 2 },
  ]
};

// GET /api/skills/quizzes
const handleGetQuizzes = (req, res) => {
  try {
    const availableQuizzes = Object.keys(quizzes).map(skill => ({
      skill,
      name: skill.toUpperCase(),
      questionCount: quizzes[skill].length
    }));

    return res.status(200).json({ quizzes: availableQuizzes });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// GET /api/skills/quiz/:skill
const handleGetQuiz = (req, res) => {
  try {
    const skill = req.params.skill.toLowerCase();
    const quiz = quizzes[skill];

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found for this skill." });
    }

    // Remove answers before sending to client
    const sanitizedQuiz = quiz.map(q => ({
      id: q.id,
      question: q.question,
      options: q.options
    }));

    return res.status(200).json({ skill, questions: sanitizedQuiz });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// POST /api/skills/quiz/:skill/submit
const handleSubmitQuiz = async (req, res) => {
  try {
    const skill = req.params.skill.toLowerCase();
    const { answers } = req.body; // answers: { [questionId]: optionIndex }
    const userId = req.user.id;

    const quiz = quizzes[skill];
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found." });
    }

    let score = 0;
    quiz.forEach(q => {
      if (answers[q.id] === q.answer) {
        score++;
      }
    });

    const percentage = (score / quiz.length) * 100;
    const passed = percentage >= 70; // 70% passing score

    if (passed) {
      // Add to verifiedSkills
      const user = await User.findById(userId);
      if (user) {
        if (!user.verifiedSkills) {
          user.verifiedSkills = [];
        }
        // Capitalize for uniform display
        const displaySkill = skill === 'ui/ux' ? 'UI/UX' : skill === 'node.js' ? 'Node.js' : skill.charAt(0).toUpperCase() + skill.slice(1);
        if (!user.verifiedSkills.includes(displaySkill)) {
          user.verifiedSkills.push(displaySkill);
          await user.save();
        }
      }
    }

    return res.status(200).json({
      score,
      total: quiz.length,
      percentage,
      passed,
      message: passed ? "Congratulations! Skill verified." : "You did not pass. Try again later."
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

module.exports = {
  handleGetQuizzes,
  handleGetQuiz,
  handleSubmitQuiz
};
