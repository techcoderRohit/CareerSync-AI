"use client";

import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, Award, BookOpen, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function AssessmentPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizLoading, setQuizLoading] = useState(false);
  
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/skills/quizzes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(res.data.quizzes || []);
    } catch (err) {
      toast.error("Failed to load assessments.");
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async (skill) => {
    setQuizLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/skills/quiz/${skill}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuestions(res.data.questions);
      setSelectedQuiz(skill);
      setCurrentQuestionIdx(0);
      setAnswers({});
      setResult(null);
    } catch (err) {
      toast.error("Failed to load quiz.");
    } finally {
      setQuizLoading(false);
    }
  };

  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers({
      ...answers,
      [questionId]: optionIndex
    });
  };

  const submitQuiz = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer all questions before submitting.");
      return;
    }
    
    setQuizLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/skills/quiz/${selectedQuiz}/submit`, { answers }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(res.data);
    } catch (err) {
      toast.error("Failed to submit quiz.");
    } finally {
      setQuizLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 flex justify-center text-slate-500 animate-pulse">Loading assessments...</div>;
  }

  // Quiz Result View
  if (result) {
    return (
      <div className="animate-fade-up max-w-2xl mx-auto mt-10">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center">
          <div className="flex justify-center mb-6">
            {result.passed ? (
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500 shadow-inner">
                <Award size={48} />
              </div>
            ) : (
              <div className="w-24 h-24 bg-rose-100 rounded-full flex items-center justify-center text-rose-500 shadow-inner">
                <AlertCircle size={48} />
              </div>
            )}
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">
            {result.passed ? "Assessment Passed!" : "Assessment Failed"}
          </h2>
          <p className="text-slate-500 font-medium mb-8">
            You scored {result.score} out of {result.total} ({result.percentage.toFixed(0)}%).
          </p>
          
          {result.passed ? (
            <p className="text-emerald-600 font-bold mb-8 bg-emerald-50 p-4 rounded-xl border border-emerald-100">
              Congratulations! This skill is now marked as Verified on your profile.
            </p>
          ) : (
            <p className="text-rose-600 font-bold mb-8 bg-rose-50 p-4 rounded-xl border border-rose-100">
              You need at least 70% to pass. Please review the material and try again later.
            </p>
          )}

          <div className="flex justify-center gap-4">
            <button 
              onClick={() => { setResult(null); setSelectedQuiz(null); }}
              className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md"
            >
              Back to Assessments
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Quiz View
  if (selectedQuiz && questions.length > 0) {
    const currentQ = questions[currentQuestionIdx];
    return (
      <div className="animate-fade-up max-w-3xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <button 
            onClick={() => setSelectedQuiz(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors"
          >
            <ArrowLeft size={18} /> Exit Assessment
          </button>
          <div className="text-sm font-bold text-violet-600 bg-violet-100 px-3 py-1 rounded-full border border-violet-200">
            {selectedQuiz.toUpperCase()}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-[0_10px_25px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-slate-400">Question {currentQuestionIdx + 1} of {questions.length}</h3>
            <div className="flex gap-1">
              {questions.map((_, i) => (
                <div key={i} className={`h-2 w-8 rounded-full ${i <= currentQuestionIdx ? 'bg-violet-600' : 'bg-slate-100'}`}></div>
              ))}
            </div>
          </div>

          <h2 className="text-2xl font-extrabold text-slate-900 mb-8 leading-snug">
            {currentQ.question}
          </h2>

          <div className="space-y-4 mb-10">
            {currentQ.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => handleSelectOption(currentQ.id, i)}
                className={`w-full text-left p-5 rounded-2xl border-2 font-bold transition-all ${
                  answers[currentQ.id] === i 
                  ? 'border-violet-600 bg-violet-50 text-violet-900 shadow-md' 
                  : 'border-slate-200 bg-white text-slate-600 hover:border-violet-300 hover:bg-slate-50'
                }`}
              >
                <span className="inline-block w-8 text-slate-400">{String.fromCharCode(65 + i)}.</span> {opt}
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-6 border-t border-slate-100">
            {currentQuestionIdx < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                disabled={answers[currentQ.id] === undefined}
                className="bg-violet-600 text-white px-8 py-3.5 rounded-xl font-bold shadow-md shadow-violet-200 hover:bg-violet-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Question
              </button>
            ) : (
              <button
                onClick={submitQuiz}
                disabled={quizLoading || answers[currentQ.id] === undefined}
                className="bg-emerald-500 text-white px-8 py-3.5 rounded-xl font-bold shadow-md shadow-emerald-200 hover:bg-emerald-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {quizLoading ? "Evaluating..." : "Submit Assessment"} <CheckCircle2 size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Quizzes List View
  return (
    <div className="animate-fade-up">
      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => window.location.href='/dashboard/skills'} className="text-slate-400 hover:text-slate-900 transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-[2.5rem] font-extrabold text-slate-900 tracking-tight">Skill Assessments</h1>
      </div>
      <p className="text-slate-500 text-[1.1rem] mb-10 ml-9">Take quick quizzes to earn Verified badges for your skills.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-9">
        {quizzes.map((quiz, idx) => (
          <div key={idx} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-violet-900/5 transition-all duration-300 group">
            <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-6">
              <BookOpen size={28} />
            </div>
            <h3 className="text-xl font-extrabold text-slate-900 mb-2">{quiz.name}</h3>
            <p className="text-slate-500 font-medium text-sm mb-6 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-500" /> {quiz.questionCount} Multiple Choice Questions
            </p>
            <button 
              onClick={() => startQuiz(quiz.skill)}
              disabled={quizLoading}
              className="w-full bg-slate-50 border border-slate-200 text-slate-700 font-bold py-3 rounded-xl group-hover:bg-violet-600 group-hover:border-violet-600 group-hover:text-white transition-colors"
            >
              Start Assessment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
