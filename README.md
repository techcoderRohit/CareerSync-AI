# CareerSync AI 🚀

> **CareerSync AI** is a smart, AI-driven placement and career guidance platform designed to bridge the gap between students, colleges, and recruiters. It offers AI-powered resume analysis, mock interviews, skill assessments, and a seamless job application process.

---

## ✨ Features

### For Students:
- 📄 **AI Resume Analyzer:** Get your resume scored and reviewed by AI (Powered by Google Gemini).
- 🎤 **Mock Interviews:** Practice your interview skills with an AI interviewer.
- 🎯 **Skill Assessments:** Take quizzes and earn verified skill badges for your profile.
- 💼 **Job & Internship Portal:** Apply to jobs seamlessly with one click.
- 🔔 **Real-Time Notifications:** Stay updated on application statuses.

### For Admins / Placement Officers:
- 📊 **Advanced Analytics Dashboard:** Track student placements, application statuses, and overall engagement.
- 👨‍🎓 **Student Management:** View and manage student profiles and their performance.
- 🏢 **Job Management:** Post, edit, and close job or internship opportunities.
- 📩 **Contact & Support:** Reply to student queries directly from the dashboard.

---

## 🛠️ Tech Stack

**Frontend:**
- [Next.js (App Router)](https://nextjs.org/)
- React.js
- Tailwind CSS
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) for Authentication
- Google Gemini AI API (for Resume Analysis & Interviews)

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally on your machine.

### Prerequisites:
- [Node.js](https://nodejs.org/en/) installed
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/techcoderRohit/CareerSync-AI.git
cd CareerSync-AI
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder and add the following:
```env
PORT=5000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CORS_ORIGIN=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
```

Run the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend` folder and add:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Run the frontend server:
```bash
npm run dev
```

The application will now be running on `http://localhost:3000` 🚀

---

## 🌐 Live Demo
- **Frontend:** [https://career-sync-ai-chi.vercel.app](https://career-sync-ai-chi.vercel.app)
- **Backend API:** [https://careersync-ai-tarn.onrender.com](https://careersync-ai-tarn.onrender.com)

*(Note: The backend is hosted on Render's free tier and might take 30-50 seconds to wake up from inactivity).*

---

## 📝 License
This project is [MIT](https://choosealicense.com/licenses/mit/) licensed.

---
*Developed with ❤️ by [techcoderRohit](https://github.com/techcoderRohit)*
