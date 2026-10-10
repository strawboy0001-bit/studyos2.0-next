"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { Layers, Plus, RotateCcw, Brain, Check, X } from "lucide-react";

export default function FlashcardsPage() {
  const flashcards = useLiveQuery(() => db.flashcards.toArray());
  const subjects = useLiveQuery(() => db.subjects.toArray());

  const [isCreating, setIsCreating] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");

  const [activeReviewCard, setActiveReviewCard] = useState<any>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  const dueCards = flashcards?.filter(c => new Date(c.nextReviewDate) <= new Date()) || [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    await db.flashcards.add({
      id: uuidv4(),
      subjectId: selectedSubjectId || undefined,
      front,
      back,
      nextReviewDate: new Date(), // due immediately
      interval: 0,
      easeFactor: 2.5,
      repetitions: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    setFront("");
    setBack("");
    setIsCreating(false);
  };

  const startReview = () => {
    if (dueCards.length > 0) {
      setActiveReviewCard(dueCards[0]);
      setIsFlipped(false);
    }
  };

  const handleReviewAnswer = async (quality: number) => {
    // Basic Spaced Repetition (SuperMemo-2 inspired)
    if (!activeReviewCard) return;

    let { interval, easeFactor, repetitions } = activeReviewCard;

    if (quality >= 3) {
      if (repetitions === 0) interval = 1;
      else if (repetitions === 1) interval = 6;
      else interval = Math.round(interval * easeFactor);
      
      repetitions += 1;
      easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    } else {
      repetitions = 0;
      interval = 1;
    }

    if (easeFactor < 1.3) easeFactor = 1.3;

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + interval);

    await db.flashcards.update(activeReviewCard.id, {
      interval,
      easeFactor,
      repetitions,
      nextReviewDate,
      updatedAt: new Date()
    });

    // Move to next card
    const nextDueCards = flashcards?.filter(c => 
      c.id !== activeReviewCard.id && new Date(c.nextReviewDate) <= new Date()
    ) || [];

    if (nextDueCards.length > 0) {
      setActiveReviewCard(nextDueCards[0]);
      setIsFlipped(false);
    } else {
      setActiveReviewCard(null);
    }
  };

  if (activeReviewCard) {
    return (
      <div className="max-w-2xl mx-auto space-y-8 flex flex-col h-full items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-800">Review Session</h2>
          <p className="text-slate-500">How well do you know this?</p>
        </div>

        <div 
          className="w-full aspect-video bg-white border-2 border-slate-200 rounded-2xl shadow-sm flex items-center justify-center p-8 cursor-pointer text-center hover:border-purple-300 transition-colors"
          onClick={() => setIsFlipped(!isFlipped)}
        >
          <p className="text-2xl font-medium text-slate-800">
            {isFlipped ? activeReviewCard.back : activeReviewCard.front}
          </p>
        </div>
        
        {!isFlipped ? (
          <p className="text-slate-400 text-sm animate-pulse">Click the card to flip</p>
        ) : (
          <div className="flex gap-4 w-full justify-center">
            <button onClick={() => handleReviewAnswer(1)} className="flex-1 bg-red-100 text-red-700 py-3 rounded-lg font-medium hover:bg-red-200">Again (Forgot)</button>
            <button onClick={() => handleReviewAnswer(3)} className="flex-1 bg-amber-100 text-amber-700 py-3 rounded-lg font-medium hover:bg-amber-200">Hard</button>
            <button onClick={() => handleReviewAnswer(4)} className="flex-1 bg-blue-100 text-blue-700 py-3 rounded-lg font-medium hover:bg-blue-200">Good</button>
            <button onClick={() => handleReviewAnswer(5)} className="flex-1 bg-green-100 text-green-700 py-3 rounded-lg font-medium hover:bg-green-200">Easy</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Flashcards</h1>
          <p className="text-slate-500 mt-1">Memorize concepts efficiently using spaced repetition.</p>
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
        >
          {isCreating ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {isCreating ? 'Cancel' : 'Create Card'}
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreate} className="bg-white p-6 border rounded-xl shadow-sm space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Front (Question/Prompt)</label>
              <textarea
                value={front}
                onChange={(e) => setFront(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md outline-none focus:border-purple-500 h-20 resize-none"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1">Back (Answer)</label>
              <textarea
                value={back}
                onChange={(e) => setBack(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md outline-none focus:border-purple-500 h-20 resize-none"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <select 
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm outline-none"
            >
              <option value="">No Subject</option>
              {subjects?.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-md hover:bg-slate-800">
              Save Flashcard
            </button>
          </div>
        </form>
      )}

      {flashcards === undefined ? (
        <div className="text-center py-12 text-slate-500">Loading flashcards...</div>
      ) : flashcards.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-xl flex flex-col items-center">
          <Layers className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No flashcards yet</h3>
          <p className="text-slate-500 mt-1">Create your first card to start memorizing.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-8 flex flex-col items-center justify-center text-center">
            <Brain className="h-12 w-12 text-purple-500 mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Review Session</h3>
            <p className="text-slate-600 mb-6">
              You have <strong className="text-purple-700">{dueCards.length}</strong> cards due for review today.
            </p>
            <button 
              onClick={startReview}
              disabled={dueCards.length === 0}
              className="bg-purple-600 text-white px-8 py-3 rounded-full font-medium hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <RotateCcw className="h-5 w-5" />
              {dueCards.length > 0 ? 'Start Review' : 'All Caught Up!'}
            </button>
          </div>

          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-bold text-slate-800 mb-4">Deck Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-slate-600">Total Cards</span>
                <span className="font-bold text-slate-900">{flashcards.length}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span className="text-slate-600">Due for Review</span>
                <span className="font-bold text-purple-600">{dueCards.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600">Mastered (Interval &gt; 21d)</span>
                <span className="font-bold text-green-600">
                  {flashcards.filter(c => c.interval > 21).length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
