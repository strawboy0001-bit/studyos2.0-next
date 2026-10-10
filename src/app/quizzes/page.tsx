"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { HelpCircle, Play, CheckCircle2, XCircle, BrainCircuit } from "lucide-react";

export default function QuizzesPage() {
  const quizzes = useLiveQuery(() => db.quizzes.toArray());
  const attempts = useLiveQuery(() => db.quizAttempts.toArray());
  
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isFinished, setIsFinished] = useState(false);

  // Generate a mock quiz for demonstration
  const handleGenerateMockQuiz = async () => {
    await db.quizzes.add({
      id: uuidv4(),
      title: "Data Structures Basics",
      createdAt: new Date(),
      questions: [
        {
          id: uuidv4(),
          type: "mcq",
          question: "Which data structure uses LIFO (Last In First Out)?",
          options: ["Queue", "Stack", "Linked List", "Tree"],
          correctAnswer: "Stack"
        },
        {
          id: uuidv4(),
          type: "true-false",
          question: "A binary search tree can have duplicate values depending on implementation.",
          options: ["True", "False"],
          correctAnswer: "True"
        },
        {
          id: uuidv4(),
          type: "mcq",
          question: "What is the time complexity of searching in a Hash Table in the best case?",
          options: ["O(1)", "O(log n)", "O(n)", "O(n^2)"],
          correctAnswer: "O(1)"
        }
      ]
    });
  };

  const activeQuiz = quizzes?.find(q => q.id === activeQuizId);
  const currentQuestion = activeQuiz?.questions[currentQuestionIndex];

  const handleSelectAnswer = (answer: string) => {
    if (!currentQuestion) return;
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: answer
    });
  };

  const handleNext = () => {
    if (activeQuiz && currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    if (!activeQuiz) return;
    
    let score = 0;
    activeQuiz.questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correctAnswer) score++;
    });

    await db.quizAttempts.add({
      id: uuidv4(),
      quizId: activeQuiz.id,
      score,
      totalQuestions: activeQuiz.questions.length,
      completedAt: new Date()
    });

    setIsFinished(true);
  };

  const exitQuiz = () => {
    setActiveQuizId(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
  };

  if (activeQuizId && activeQuiz) {
    if (isFinished) {
      const score = Object.keys(selectedAnswers).filter(
        qId => selectedAnswers[qId] === activeQuiz.questions.find(q => q.id === qId)?.correctAnswer
      ).length;

      return (
        <div className="max-w-2xl mx-auto space-y-6 text-center py-12">
          <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-4">
            <h2 className="text-2xl font-bold text-slate-800">Quiz Completed!</h2>
            <div className="text-6xl font-bold text-purple-600 my-6">
              {score} / {activeQuiz.questions.length}
            </div>
            <p className="text-slate-600">
              {score === activeQuiz.questions.length ? "Perfect score! Great job." : "Keep practicing to improve your score."}
            </p>
            <button 
              onClick={exitQuiz}
              className="bg-slate-900 text-white px-8 py-3 rounded-full font-medium hover:bg-slate-800 transition-colors mt-6 inline-block"
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
          <h2 className="font-bold text-slate-800">{activeQuiz.title}</h2>
          <span className="text-sm font-medium bg-slate-100 px-3 py-1 rounded-full text-slate-600">
            Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
          </span>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-sm border space-y-6">
          <h3 className="text-xl font-medium text-slate-900">{currentQuestion?.question}</h3>
          
          <div className="space-y-3">
            {currentQuestion?.options?.map(option => (
              <button
                key={option}
                onClick={() => handleSelectAnswer(option)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-colors ${
                  selectedAnswers[currentQuestion.id] === option 
                  ? 'border-purple-500 bg-purple-50 text-purple-700 font-medium' 
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleNext}
              disabled={!currentQuestion || !selectedAnswers[currentQuestion.id]}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
            >
              {currentQuestionIndex < activeQuiz.questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Quiz & Test Centre</h1>
          <p className="text-slate-500 mt-1">Test your knowledge and track your performance.</p>
        </div>
        <button
          onClick={handleGenerateMockQuiz}
          className="flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-100 transition-colors font-medium"
        >
          <BrainCircuit className="h-4 w-4" />
          Generate AI Quiz
        </button>
      </div>

      {quizzes === undefined ? (
        <div className="text-center py-12 text-slate-500">Loading quizzes...</div>
      ) : quizzes.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-xl flex flex-col items-center">
          <HelpCircle className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No quizzes available</h3>
          <p className="text-slate-500 mt-1 mb-4">Generate a quiz from your notes or syllabus to get started.</p>
          <button onClick={handleGenerateMockQuiz} className="bg-purple-600 text-white px-6 py-2 rounded-md font-medium hover:bg-purple-700 transition-colors">
            Generate Sample Quiz
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => {
            const quizAttempts = attempts?.filter(a => a.quizId === quiz.id) || [];
            const bestScore = quizAttempts.length > 0 
              ? Math.max(...quizAttempts.map(a => Math.round((a.score / a.totalQuestions) * 100))) 
              : null;

            return (
              <div key={quiz.id} className="bg-white border rounded-xl p-6 shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{quiz.title}</h3>
                <div className="flex gap-4 text-sm text-slate-500 mb-6">
                  <span>{quiz.questions.length} Questions</span>
                  <span>•</span>
                  <span>{quizAttempts.length} Attempts</span>
                </div>
                
                {bestScore !== null && (
                  <div className="mb-6 p-3 bg-slate-50 rounded-lg flex items-center justify-between border">
                    <span className="text-sm font-medium text-slate-700">Best Score:</span>
                    <span className={`font-bold ${bestScore >= 80 ? 'text-green-600' : bestScore >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                      {bestScore}%
                    </span>
                  </div>
                )}
                
                <button
                  onClick={() => setActiveQuizId(quiz.id)}
                  className="mt-auto w-full bg-slate-900 text-white py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors font-medium"
                >
                  <Play className="h-4 w-4" /> Start Quiz
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
