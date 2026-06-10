const Resume = require("../models/Resume");
const ResumeData = require("../models/ResumeData");
const fs = require('fs');
const pdfParse = require('pdf-parse');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function analyzeWithGemini(pdfPath, jobDescription) {
  // Read PDF
  const dataBuffer = fs.readFileSync(pdfPath);
  const pdfData = await pdfParse(dataBuffer);
  const resumeText = pdfData.text;

  // Formulate Prompt
  const prompt = `
You are an expert ATS (Applicant Tracking System) analyzer and career coach.
I am providing you with the extracted text from a candidate's resume and optionally a target Job Description.

Target Job Description:
${jobDescription || "No specific job description provided. Analyze against standard software engineering/tech industry best practices."}

Resume Text:
${resumeText}

Analyze the resume and return a structured JSON response matching EXACTLY the format below. Do NOT wrap the JSON in Markdown block formatting like \`\`\`json. Return pure JSON.

{
  "score": (a number between 0 and 100),
  "grade": (A, B, C, D, or F based on the score),
  "readability": (string, e.g. "Excellent", "Moderate", "Poor"),
  "matched": [ array of matched keywords found in the resume relevant to the JD ],
  "missing": [ array of critical keywords missing from the resume but present in the JD or expected for this role ],
  "strengths": [ 3-4 strings detailing what the resume does well ],
  "improvements": [
    {
      "title": (Short title of the issue),
      "severity": ("High Impact", "Medium Impact", or "Low Impact"),
      "issue": (Description of the problem),
      "howToCorrect": (Actionable advice to fix it),
      "beforeText": (An example of how it is currently or what's wrong),
      "afterText": (An example of how it should be)
    }
  ]
}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-flash-latest',
    contents: prompt,
  });

  let rawOutput = response.text;
  
  // Clean up potential markdown formatting from Gemini response
  rawOutput = rawOutput.replace(/```json/g, '').replace(/```/g, '').trim();
  
  try {
    return JSON.parse(rawOutput);
  } catch (e) {
    console.error("Failed to parse JSON from Gemini", e, "Raw Output:", rawOutput);
    throw new Error("Invalid response format from AI");
  }
}

// POST /api/resume/analyze
const handleResumeAnalysis = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a valid resume file." });
    }

    const { jobDescription } = req.body;
    const userId = req.user.id;

    // Ensure we have API key
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_key_here') {
      // Provide a fallback simulated response if no key is set yet
      return res.status(500).json({ error: "Gemini API Key is missing. Please add it to backend/.env" });
    }

    // Run AI analysis
    const analysisResult = await analyzeWithGemini(req.file.path, jobDescription);

    // Save report to database
    const newAnalysis = await Resume.create({
      userId,
      fileName: req.file.originalname,
      filePath: req.file.path,
      jobDescription: jobDescription || "",
      analysisResult
    });

    // Fetch user for email
    const User = require("../models/User");
    const user = await User.findById(userId);

    // Create Notification
    const Notification = require("../models/Notification");
    await Notification.create({
      userId,
      title: "ATS Resume Scan Complete",
      message: `Your resume "${req.file.originalname}" has been analyzed. You scored a ${analysisResult.score}/100.`,
      type: "RESUME_SCAN"
    });

    // Send Email
    const { sendEmail } = require("../utils/emailService");
    if (user && user.email) {
      await sendEmail({
        to: user.email,
        subject: `Your Resume ATS Score: ${analysisResult.score}/100`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
            <h2 style="color: #4f46e5; text-align: center;">Resume Scan Results</h2>
            <p>Hi <strong>${user.fullName || 'User'}</strong>,</p>
            <p>Your resume <strong>${req.file.originalname}</strong> has just been analyzed by CareerSync AI.</p>
            <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <h1 style="color: #4f46e5; margin: 0; font-size: 36px;">${analysisResult.score}<span style="font-size: 18px; color: #64748b;">/100</span></h1>
              <p style="margin-top: 5px; font-weight: bold; color: #334155;">Grade: ${analysisResult.grade}</p>
            </div>
            <p>Log in to your dashboard to view the full detailed report, including missing keywords and actionable improvements to boost your chances.</p>
            <br/>
            <p>Best regards,</p>
            <p><strong>The CareerSync AI Team</strong></p>
          </div>
        `
      });
    }

    return res.status(201).json({
      message: "Resume analyzed and saved successfully.",
      data: newAnalysis
    });
  } catch (error) {
    console.error("Analysis Error:", error);
    return res.status(500).json({ error: "Failed to analyze resume with AI.", message: error.message });
  }
};

// GET /api/resume/history
const handleGetResumeHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await Resume.find({ userId }).sort({ createdAt: -1 });
    
    return res.status(200).json({
      message: "Resume history fetched successfully.",
      history
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// DELETE /api/resume/:id
const handleDeleteResumeRecord = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;

    const deletedRecord = await Resume.findOneAndDelete({ _id: resumeId, userId });
    
    if (!deletedRecord) {
      return res.status(404).json({ error: "Resume record not found or unauthorized." });
    }

    return res.status(200).json({
      message: "Resume record deleted successfully."
    });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// GET /api/resume/download/:id
const handleDownloadResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;

    const resumeRecord = await Resume.findOne({ _id: resumeId, userId });
    
    if (!resumeRecord) {
      return res.status(404).json({ error: "Resume record not found or unauthorized." });
    }

    const path = require('path');
    const absolutePath = path.resolve(resumeRecord.filePath);
    
    // Check if file exists
    if (!fs.existsSync(absolutePath)) {
      return res.status(404).json({ error: "Physical file not found on server." });
    }

    // Serve the file with the original name for inline viewing
    const safeName = encodeURIComponent(resumeRecord.fileName);
    const options = {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename*=UTF-8''${safeName}`
      }
    };
    
    res.sendFile(absolutePath, options, (err) => {
      if (err) {
        console.error("Error sending file:", err);
        if (!res.headersSent) {
          res.status(500).json({ error: "Error viewing file." });
        }
      }
    });

  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// GET /api/resume/view/:id
const handleViewResumePage = async (req, res) => {
  try {
    const userId = req.user.id;
    const resumeId = req.params.id;
    const token = req.query.token || "";

    const resumeRecord = await Resume.findOne({ _id: resumeId, userId });
    
    if (!resumeRecord) {
      return res.status(404).send("Resume record not found or unauthorized.");
    }

    const safeName = resumeRecord.fileName;
    
    // Return HTML wrapper to force the browser tab title to be the file name
    const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${safeName}</title>
        <style>
            body, html { margin: 0; padding: 0; height: 100%; overflow: hidden; background-color: #525659; }
            iframe { width: 100%; height: 100%; border: none; }
        </style>
    </head>
    <body>
        <iframe src="/api/resume/download/${resumeId}?token=${token}#toolbar=1&navpanes=0" title="${safeName}"></iframe>
    </body>
    </html>
    `;

    res.setHeader('Content-Type', 'text/html');
    res.send(html);

  } catch (error) {
    return res.status(500).send("Server Error");
  }
};

// GET /api/resume/builder
const handleGetResumeBuilderData = async (req, res) => {
  try {
    const userId = req.user.id;
    let resumeData = await ResumeData.findOne({ userId });
    
    if (!resumeData) {
      // Create empty template if not exists
      resumeData = await ResumeData.create({ userId });
    }
    
    return res.status(200).json({ data: resumeData });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

// PUT /api/resume/builder
const handleSaveResumeBuilderData = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;
    
    const resumeData = await ResumeData.findOneAndUpdate(
      { userId },
      { $set: updateData },
      { new: true, upsert: true }
    );
    
    return res.status(200).json({ message: "Resume saved successfully", data: resumeData });
  } catch (error) {
    return res.status(500).json({ error: "Server Error", message: error.message });
  }
};

module.exports = {
  handleResumeAnalysis,
  handleGetResumeHistory,
  handleDeleteResumeRecord,
  handleDownloadResume,
  handleViewResumePage,
  handleGetResumeBuilderData,
  handleSaveResumeBuilderData
};
