require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./connection");

const app = express();
const PORT = process.env.PORT || 5000;

const authRoute = require("./routes/authRoutes");
const resumeRoute = require("./routes/resumeRoutes");
const jobRoute = require("./routes/jobRoutes");
const applicationRoute = require("./routes/applicationRoutes");
const contactRoute = require("./routes/contactRoutes");
const notificationRoute = require("./routes/notificationRoutes");
const adminRoute = require("./routes/adminRoutes");
const interviewRoute = require("./routes/interviewRoutes");
const skillRoute = require("./routes/skillRoutes");
const dashboardRoute = require("./routes/dashboardRoutes");

// Connect to Database
connectDB(process.env.MONGODB_URL);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const allowedOrigins = [
  "http://localhost:3000",
  "https://career-sync-ai-chi.vercel.app",
  process.env.CORS_ORIGIN
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/resume", resumeRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/applications", applicationRoute);
app.use("/api/contact", contactRoute);
app.use("/api/notifications", notificationRoute);
app.use("/api/admin", adminRoute);
app.use("/api/interview", interviewRoute);
app.use("/api/skills", skillRoute);
app.use("/api/dashboard", dashboardRoute);

// Basic Health Check Route
app.get("/", (req, res) => {
  return res.json({ message: "Welcome to CareerSync AI Backend API" });
});

// Sample Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server started at http://localhost:${PORT}`);
});
