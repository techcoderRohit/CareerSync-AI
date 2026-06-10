const User = require("../models/User");
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function handleGenerateInterviewPrep(req, res) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (!user.skills || user.skills.trim() === "") {
      return res.status(400).json({ error: "Please add some skills to your profile first to generate relevant questions." });
    }

    const skills = user.skills;

    const prompt = `
You are a friendly technical interviewer and HR manager.
I am a beginner-level candidate (student/fresher) preparing for a job interview. My core skills are: ${skills}

Based ONLY on these skills, please generate:
1. 5 Technical Interview Questions that are simple and foundational (e.g., "What is React?", "Explain useState vs useEffect"). Do not ask overly complex scenario-based questions.
2. 5 HR / Behavioral Interview Questions suitable for a fresher.

Use very simple, plain English that is easy for a beginner to understand.
Provide a clear, simple answer for each question.

Return the response EXACTLY as a structured JSON object. Do NOT wrap it in Markdown formatting like \`\`\`json. Return pure JSON matching this exact structure:

{
  "technical": [
    {
      "question": "The question string",
      "answer": "A detailed, professional answer to the question."
    }
  ],
  "hr": [
    {
      "question": "The question string",
      "answer": "A detailed, professional answer to the question."
    }
  ]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    let responseText = response.text;
    
    // Sometimes the model still wraps in markdown even with responseMimeType
    if (responseText.startsWith('```json')) {
      responseText = responseText.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (responseText.startsWith('```')) {
      responseText = responseText.replace(/^```/, '').replace(/```$/, '').trim();
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON Parsing Error from Gemini:", responseText);
      return res.status(500).json({ error: "AI returned invalid format. Please try again." });
    }

    return res.status(200).json({
      message: "Interview questions generated successfully.",
      data: parsedResponse
    });

  } catch (error) {
    console.error("Interview Gen Error:", error);
    return res.status(500).json({ error: "Failed to generate interview questions.", details: error.message });
  }
}

async function handleMockInterviewChat(req, res) {
  try {
    const { messages, jobRole, interviewType } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    const systemPrompt = `You are a friendly ${interviewType === 'Technical' ? 'Technical' : 'HR'} Interviewer conducting a mock interview for the role of "${jobRole}". 
IMPORTANT Rules:
1. The candidate is a BEGINNER (student/fresher). Ask very simple, foundational questions. For example, if it's React, ask "What is React?" or "What is the difference between state and props?". 
2. Use very plain, easy-to-understand English. Avoid complex jargon or highly advanced scenarios.
3. Act exclusively as the interviewer. Never break character.
4. Ask ONE question at a time. Do not ask multiple questions.
5. Wait for the candidate's answer. Evaluate it silently, then respond with a brief, encouraging acknowledgment, followed by the next question.
6. Keep your responses concise (under 3-4 sentences).
7. If the candidate asks for feedback or says they want to end the interview, provide a brief summary of their performance in simple language.`;

    const formattedMessages = messages.map((msg, idx) => {
      let text = msg.text;
      if (idx === 0) {
        text = `SYSTEM INSTRUCTION: ${systemPrompt}\n\nStart or continue the interview.\n\nCandidate says: ${text}`;
      }
      return {
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text }]
      };
    });

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: formattedMessages,
    });

    return res.status(200).json({
      text: response.text
    });

  } catch (error) {
    console.error("Mock Interview Chat Error:", error);
    return res.status(500).json({ error: "Failed to generate AI response.", details: error.message });
  }
}

module.exports = {
  handleGenerateInterviewPrep,
  handleMockInterviewChat
};
