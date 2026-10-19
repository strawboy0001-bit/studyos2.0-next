"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import {
  Layers,
  Plus,
  RotateCcw,
  Brain,
  X,
  Search,
  Trash2,
  Edit2,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
  Code2,
  HelpCircle,
  BookmarkCheck,
  ChevronRight,
  ArrowLeft
} from "lucide-react";
import type { Flashcard } from "@/lib/db/schema";

interface Template {
  id: string;
  name: string;
  icon: React.ElementType;
  frontPlaceholder: string;
  backPlaceholder: string;
}

const TEMPLATES: Template[] = [
  {
    id: "qa",
    name: "Question & Answer",
    icon: HelpCircle,
    frontPlaceholder: "e.g., What is Amdahl's Law in parallel computing?",
    backPlaceholder: "e.g., Amdahl's Law predicts the theoretical speedup in latency of the execution of a task at fixed workload that can be expected of a system whose resources are improved.",
  },
  {
    id: "concept",
    name: "Concept & Definition",
    icon: BookmarkCheck,
    frontPlaceholder: "e.g., Dijkstra's Algorithm",
    backPlaceholder: "Definition: An algorithm for finding the shortest paths between nodes in a weighted graph.\n\nTime Complexity: O(V^2) or O(E + V log V) with min-priority queue.",
  },
  {
    id: "formula",
    name: "Formula & Law",
    icon: Sparkles,
    frontPlaceholder: "e.g., Bayes' Theorem Formula",
    backPlaceholder: "P(A|B) = [P(B|A) * P(A)] / P(B)\n\nWhere:\n• P(A|B) = Posterior probability\n• P(B|A) = Likelihood\n• P(A) = Prior probability",
  },
  {
    id: "code",
    name: "Code & Syntax",
    icon: Code2,
    frontPlaceholder: "e.g., Binary Search implementation in Python",
    backPlaceholder: "def binary_search(arr, target):\n    low, high = 0, len(arr) - 1\n    while low <= high:\n        mid = (low + high) // 2\n        if arr[mid] == target: return mid\n        elif arr[mid] < target: low = mid + 1\n        else: high = mid - 1\n    return -1",
  },
];

export default function FlashcardsPage() {
  const flashcards = useLiveQuery(() => db.flashcards.toArray());
  const subjects = useLiveQuery(() => db.subjects.toArray());

  // Management State
  const [isCreating, setIsCreating] = useState(false);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("qa");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "due" | "mastered">("all");
  const [isSaving, setIsSaving] = useState(false);
  const [previewSide, setPreviewSide] = useState<"front" | "back">("front");

  // Review Session State
  const [isReviewing, setIsReviewing] = useState(false);
  const [reviewDeck, setReviewDeck] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, remembered: 0, forgot: 0 });

  const activeReviewCard = reviewDeck[currentIndex] || null;

  // Due cards calculation
  const dueCards = flashcards?.filter((c) => new Date(c.nextReviewDate) <= new Date()) || [];
  const masteredCards = flashcards?.filter((c) => c.interval > 21) || [];

  // Filtered list of cards
  const filteredCards = flashcards?.filter((card) => {
    const matchesSearch =
      card.front.toLowerCase().includes(searchQuery.toLowerCase()) ||
      card.back.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (subjectFilter !== "all" && card.subjectId !== subjectFilter) return false;

    if (statusFilter === "due") return new Date(card.nextReviewDate) <= new Date();
    if (statusFilter === "mastered") return card.interval > 21;

    return true;
  });

  // Handle template selection
  const handleSelectTemplate = (tplId: string) => {
    setSelectedTemplate(tplId);
  };

  const handleOpenCreate = () => {
    setEditingCard(null);
    setFront("");
    setBack("");
    setSelectedSubjectId("");
    setPreviewSide("front");
    setIsCreating(true);
  };

  const handleOpenEdit = (card: Flashcard) => {
    setEditingCard(card);
    setFront(card.front);
    setBack(card.back);
    setSelectedSubjectId(card.subjectId || "");
    setPreviewSide("front");
    setIsCreating(true);
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSaving) return;
    if (!front.trim() || !back.trim()) return;

    setIsSaving(true);
    try {
      if (editingCard) {
        // Update existing
        await db.flashcards.update(editingCard.id, {
          front: front.trim(),
          back: back.trim(),
          subjectId: selectedSubjectId || undefined,
          updatedAt: new Date(),
        });
      } else {
        // Create new
        await db.flashcards.add({
          id: uuidv4(),
          subjectId: selectedSubjectId || undefined,
          front: front.trim(),
          back: back.trim(),
          nextReviewDate: new Date(), // due immediately
          interval: 0,
          easeFactor: 2.5,
          repetitions: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      }

      setFront("");
      setBack("");
      setEditingCard(null);
      setIsCreating(false);
    } catch {
      // Error handling
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCard = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this flashcard?")) {
      await db.flashcards.delete(id);
    }
  };

  // Start Review Session
  const startReviewSession = (cardsToReview?: Flashcard[]) => {
    const deck = cardsToReview && cardsToReview.length > 0 ? cardsToReview : dueCards.length > 0 ? dueCards : flashcards || [];
    if (deck.length === 0) return;

    setReviewDeck(deck);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionCompleted(false);
    setSessionStats({ reviewed: 0, remembered: 0, forgot: 0 });
    setIsReviewing(true);
  };

  // SM-2 Review Algorithm
  const handleReviewAnswer = useCallback(
    async (quality: number) => {
      if (!activeReviewCard) return;

      let { interval, easeFactor, repetitions } = activeReviewCard;

      const isRemembered = quality >= 3;
      setSessionStats((prev) => ({
        reviewed: prev.reviewed + 1,
        remembered: prev.remembered + (isRemembered ? 1 : 0),
        forgot: prev.forgot + (!isRemembered ? 1 : 0),
      }));

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
        updatedAt: new Date(),
      });

      if (currentIndex < reviewDeck.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
      } else {
        setSessionCompleted(true);
      }
    },
    [activeReviewCard, currentIndex, reviewDeck.length]
  );

  // Keyboard shortcut listener for review session
  useEffect(() => {
    if (!isReviewing || sessionCompleted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped) {
        if (e.key === "1") handleReviewAnswer(1);
        else if (e.key === "2") handleReviewAnswer(3);
        else if (e.key === "3") handleReviewAnswer(4);
        else if (e.key === "4") handleReviewAnswer(5);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isReviewing, isFlipped, sessionCompleted, handleReviewAnswer]);

  // Review Mode View
  if (isReviewing) {
    if (sessionCompleted) {
      return (
        <div className="max-w-2xl mx-auto py-16 px-4 text-slate-100 font-sans">
          <div className="bg-[#0c1224] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-sm text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto shadow-[0_0_20px_rgba(16,185,129,0.2)]">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <h2 className="text-2xl font-black text-white">Review Session Complete!</h2>
              <p className="text-xs text-slate-400 mt-1">
                Your spaced repetition intervals have been recalculated.
              </p>
            </div>

            {/* Session Stats */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                <p className="text-[10px] uppercase font-bold text-slate-400">Cards Reviewed</p>
                <p className="text-2xl font-black text-white mt-1">{sessionStats.reviewed}</p>
              </div>
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                <p className="text-[10px] uppercase font-bold text-emerald-400">Remembered</p>
                <p className="text-2xl font-black text-emerald-400 mt-1">{sessionStats.remembered}</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                <p className="text-[10px] uppercase font-bold text-amber-400">Needs Review</p>
                <p className="text-2xl font-black text-amber-400 mt-1">{sessionStats.forgot}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-4">
              <button
                onClick={() => startReviewSession(reviewDeck)}
                className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-200 transition-colors"
              >
                Review Again
              </button>
              <button
                onClick={() => setIsReviewing(false)}
                className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-all"
              >
                Return to Decks
              </button>
            </div>
          </div>
        </div>
      );
    }

    const currentCardSubject = subjects?.find((s) => s.id === activeReviewCard?.subjectId);
    const progressPercent = Math.round(((currentIndex + 1) / reviewDeck.length) * 100);

    return (
      <div className="max-w-3xl mx-auto py-8 px-4 text-slate-100 font-sans space-y-6">
        {/* Gwen Spider-Sense Focus Banner */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-gradient-to-r from-pink-950/40 via-[#0c1224] to-cyan-950/30 border border-pink-500/25 shadow-sm">
          <div className="w-9 h-9 rounded-full overflow-hidden border border-pink-500/40 shrink-0 shadow-[0_0_12px_rgba(236,72,153,0.3)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gwen.png" alt="Gwen" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-black uppercase text-pink-400">Earth-65 • Gwen Stacy</span>
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <p className="text-xs text-slate-300">
              Active recall works best before you peek. Trust your instincts!
            </p>
          </div>
        </div>

        {/* Top Control Bar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setIsReviewing(false)}
            className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Exit Review</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-medium">
              Card {currentIndex + 1} of {reviewDeck.length}
            </span>
            <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-cyan-400 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* 3D Flashcard Container with Spider-Gwen Glow */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative min-h-[340px] sm:min-h-[380px] rounded-3xl bg-[#0c1224] border border-white/10 hover:border-pink-500/50 p-8 shadow-[0_15px_40px_rgba(0,0,0,0.4)] hover:shadow-[0_0_35px_rgba(236,72,153,0.2)] cursor-pointer flex flex-col justify-between transition-all select-none group"
        >
          {/* Card Top Pill */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 uppercase tracking-wider">
              {isFlipped ? "Answer / Back" : "Question / Front"}
            </span>

            {currentCardSubject && (
              <span className="text-[11px] font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 rounded-full">
                {currentCardSubject.name}
              </span>
            )}
          </div>

          {/* Card Center Content */}
          <div className="py-8 my-auto text-center flex flex-col items-center justify-center">
            <p className="text-xl sm:text-2xl font-bold text-white leading-relaxed max-w-xl whitespace-pre-line">
              {isFlipped ? activeReviewCard?.back : activeReviewCard?.front}
            </p>
          </div>

          {/* Card Bottom Hint */}
          <div className="text-center">
            <p className="text-xs text-slate-500 font-medium">
              {isFlipped ? "Select your rating below or press keys 1 - 4" : "Click anywhere or press Space to reveal answer"}
            </p>
          </div>
        </div>

        {/* Rating Controls (Shown after flip) */}
        {isFlipped ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <button
              onClick={() => handleReviewAnswer(1)}
              className="p-3.5 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 font-semibold text-xs transition-all flex flex-col items-center gap-1 group"
            >
              <span className="text-sm font-bold text-red-400">1 • Again</span>
              <span className="text-[10px] text-slate-400">Forgot (1 day)</span>
            </button>

            <button
              onClick={() => handleReviewAnswer(3)}
              className="p-3.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 font-semibold text-xs transition-all flex flex-col items-center gap-1 group"
            >
              <span className="text-sm font-bold text-amber-400">2 • Hard</span>
              <span className="text-[10px] text-slate-400">Hesitated</span>
            </button>

            <button
              onClick={() => handleReviewAnswer(4)}
              className="p-3.5 rounded-2xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-semibold text-xs transition-all flex flex-col items-center gap-1 group"
            >
              <span className="text-sm font-bold text-cyan-400">3 • Good</span>
              <span className="text-[10px] text-slate-400">Optimal pace</span>
            </button>

            <button
              onClick={() => handleReviewAnswer(5)}
              className="p-3.5 rounded-2xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-300 font-semibold text-xs transition-all flex flex-col items-center gap-1 group"
            >
              <span className="text-sm font-bold text-pink-400">4 • Easy</span>
              <span className="text-[10px] text-slate-400">Mastered</span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setIsFlipped(true)}
              className="px-6 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 transition-colors"
            >
              Reveal Answer (Space)
            </button>
          </div>
        )}
      </div>
    );
  }

  // Main Flashcards Dashboard
  const currentTpl = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 text-slate-100 font-sans">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-black tracking-tight text-white">Adaptive Flashcards</h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30">
              SM-2 Reflex Algorithm
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Earth-65 Grid
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">
            Strengthen long-term memory with spaced intervals and structured templates.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {dueCards.length > 0 && (
            <button
              onClick={() => startReviewSession(dueCards)}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-600 via-rose-500 to-indigo-600 hover:brightness-110 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-[0_0_20px_rgba(236,72,153,0.35)]"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Review Due ({dueCards.length})</span>
            </button>
          )}

          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span>New Flashcard</span>
          </button>
        </div>
      </div>

      {/* Earth-65 Gwen Stacy Deck Motivator Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#180a1c] via-[#0c1224] to-[#081826] border border-pink-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-pink-500/40 shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.35)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gwen.png" alt="Gwen" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-pink-400 tracking-wider">Earth-65 • Spaced Recall Sync</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">Light Reflex AI</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Rapid recall builds instinctual neural pathways. Clear your due cards before the curve decays.
            </p>
          </div>
        </div>
        {dueCards.length > 0 && (
          <button
            onClick={() => startReviewSession(dueCards)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(236,72,153,0.35)] transition-all shrink-0 flex items-center gap-2"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Start Reflex Drill ({dueCards.length})</span>
          </button>
        )}
      </div>

      {/* Deck Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0c1224] border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Total Cards</p>
            <p className="text-2xl font-black text-white mt-1">{flashcards?.length || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1224] border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Due for Review</p>
            <p className="text-2xl font-black text-purple-400 mt-1">{dueCards.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1224] border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Mastered (21d+)</p>
            <p className="text-2xl font-black text-emerald-400 mt-1">{masteredCards.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#0c1224] border border-white/10 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-slate-400">Subjects Linked</p>
            <p className="text-2xl font-black text-cyan-400 mt-1">{subjects?.length || 0}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Creation / Edit Modal */}
      {isCreating && (
        <div className="p-6 rounded-3xl bg-[#0c1224] border border-blue-500/30 shadow-[0_10px_35px_rgba(0,0,0,0.5)] space-y-5 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              <h3 className="text-base font-bold text-white">
                {editingCard ? "Edit Flashcard" : "Create New Flashcard"}
              </h3>
            </div>
            <button
              onClick={() => setIsCreating(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Template Selection Chips */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-2">Select Template:</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TEMPLATES.map((tpl) => {
                const IconComponent = tpl.icon;
                const isSelected = selectedTemplate === tpl.id;
                return (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 text-xs font-semibold transition-all ${
                      isSelected
                        ? "bg-blue-600/20 border-blue-500/40 text-blue-300"
                        : "bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    <IconComponent className="w-4 h-4 shrink-0 text-blue-400" />
                    <span className="truncate">{tpl.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSaveCard} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Front (Question / Prompt / Term)
                </label>
                <textarea
                  value={front}
                  onChange={(e) => setFront(e.target.value)}
                  required
                  rows={4}
                  placeholder={currentTpl.frontPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 text-white text-xs outline-none resize-none placeholder-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Back (Answer / Definition / Derivation)
                </label>
                <textarea
                  value={back}
                  onChange={(e) => setBack(e.target.value)}
                  required
                  rows={4}
                  placeholder={currentTpl.backPlaceholder}
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/10 focus:border-blue-500 text-white text-xs outline-none resize-none placeholder-slate-500"
                />
              </div>
            </div>

            {/* Live Interactive Card Preview */}
            {(front.trim() || back.trim()) && (
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold uppercase tracking-wider text-slate-400">Card Live Preview</span>
                  <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-lg border border-white/10">
                    <button
                      type="button"
                      onClick={() => setPreviewSide("front")}
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                        previewSide === "front" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Front (Prompt)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewSide("back")}
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold transition-colors ${
                        previewSide === "back" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
                      }`}
                    >
                      Back (Answer)
                    </button>
                  </div>
                </div>

                <div
                  onClick={() => setPreviewSide(previewSide === "front" ? "back" : "front")}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer min-h-[100px] flex flex-col justify-between ${
                    previewSide === "front"
                      ? "bg-[#0b1020] border-blue-500/30"
                      : "bg-[#140b24] border-purple-500/30"
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-2">
                    <span className="font-medium text-slate-400">
                      {previewSide === "front" ? "FRONT PROMPT" : "BACK ANSWER"}
                    </span>
                    <span className="text-[10px] text-slate-500">Click to flip preview</span>
                  </div>

                  <p className="text-white text-xs font-medium leading-relaxed whitespace-pre-wrap">
                    {previewSide === "front"
                      ? front.trim() || "(Empty prompt)"
                      : back.trim() || "(Empty answer)"}
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-400 font-medium">Course Subject:</label>
                <select
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="bg-[#070b19] border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="">-- No Subject (General) --</option>
                  {subjects?.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  disabled={isSaving}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving || !front.trim() || !back.trim()}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {isSaving ? (
                    <span>Saving Card...</span>
                  ) : (
                    <span>{editingCard ? "Save Changes" : "Add to Deck"}</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cards by question or answer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-2xl bg-[#0c1224] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1 p-1 rounded-2xl bg-[#0c1224] border border-white/10 text-xs">
            <button
              onClick={() => setStatusFilter("all")}
              className={`px-3 py-1 rounded-xl font-semibold transition-colors ${
                statusFilter === "all" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              All ({flashcards?.length || 0})
            </button>
            <button
              onClick={() => setStatusFilter("due")}
              className={`px-3 py-1 rounded-xl font-semibold transition-colors ${
                statusFilter === "due" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Due ({dueCards.length})
            </button>
            <button
              onClick={() => setStatusFilter("mastered")}
              className={`px-3 py-1 rounded-xl font-semibold transition-colors ${
                statusFilter === "mastered" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Mastered ({masteredCards.length})
            </button>
          </div>

          {/* Subject Filter */}
          {subjects && subjects.length > 0 && (
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-[#0c1224] border border-white/10 rounded-2xl px-3 py-1.5 text-xs text-white outline-none"
            >
              <option value="all">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Cards Grid */}
      {flashcards === undefined ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading flashcards...</div>
      ) : flashcards.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-[#0c1224] border border-dashed border-white/10 p-8 space-y-3">
          <Brain className="w-12 h-12 text-purple-400 mx-auto" />
          <h3 className="text-base font-bold text-white">No flashcards yet</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Create structured flashcards from formulas, lecture notes, or key concepts using our templates.
          </p>
          <div className="pt-2">
            <button
              onClick={handleOpenCreate}
              className="px-5 py-2 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition-all shadow-sm"
            >
              Create First Card
            </button>
          </div>
        </div>
      ) : filteredCards?.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs">
          No flashcards match your search or filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCards?.map((card) => {
            const cardSubject = subjects?.find((s) => s.id === card.subjectId);
            const isDue = new Date(card.nextReviewDate) <= new Date();

            return (
              <div
                key={card.id}
                onClick={() => handleOpenEdit(card)}
                className="p-5 rounded-3xl bg-[#0c1224] border border-white/10 hover:border-blue-500/30 transition-all flex flex-col justify-between group cursor-pointer shadow-sm min-h-[200px]"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isDue
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : card.interval > 21
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                      }`}
                    >
                      {isDue ? "Due Today" : card.interval > 21 ? "Mastered" : `Interval: ${card.interval}d`}
                    </span>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(card);
                        }}
                        className="text-slate-400 hover:text-white p-1 rounded"
                        title="Edit card"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteCard(card.id, e)}
                        className="text-slate-400 hover:text-red-400 p-1 rounded"
                        title="Delete card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="font-bold text-white text-sm line-clamp-2 leading-snug">
                    {card.front}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {card.back}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="truncate max-w-[150px]">
                    {cardSubject ? cardSubject.name : "General"}
                  </span>
                  <span className="text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 font-medium">
                    Edit <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
