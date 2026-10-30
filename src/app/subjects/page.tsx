"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { subjectRepo } from "@/lib/db/repositories";
import { Plus, BookOpen, Trash2, ArrowRight } from "lucide-react";

export default function SubjectsPage() {
  const subjects = useLiveQuery(() => db.subjects.toArray());
  const [isAdding, setIsAdding] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");
  const [newSubjectDesc, setNewSubjectDesc] = useState("");

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    
    await subjectRepo.create({
      name: newSubjectName.trim(),
      description: newSubjectDesc.trim() || undefined,
    });
    setNewSubjectName("");
    setNewSubjectDesc("");
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this course from your curriculum?")) {
      await subjectRepo.delete(id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Course Curriculum</h1>
            <span className="tag-outline">
              {subjects?.length || 0} Enrolled
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">Manage your active academic courses and syllabus units.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2.5 rounded-xl text-xs font-medium transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Course</span>
        </button>
      </div>

      {/* Gwen Stacy Curriculum Card */}
      <div className="p-4 rounded-2xl bg-[#0c1222] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-white/20 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gwen.png" alt="Gwen" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">Gwen Stacy</span>
              <span className="tag-outline text-[10px]">CURRICULUM MATRIX</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Organize syllabus units and map flashcards, quizzes, and tasks directly to their corresponding courses.
            </p>
          </div>
        </div>
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubject} className="bg-[#0c1222] p-5 border border-white/[0.08] rounded-2xl space-y-3">
          <h3 className="text-sm font-semibold text-white">New Academic Subject</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              autoFocus
              placeholder="Course Title (e.g. Distributed Systems CS402)"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 text-xs outline-none focus:border-blue-500"
            />
            <input
              type="text"
              placeholder="Description or Professor Name (Optional)"
              value={newSubjectDesc}
              onChange={(e) => setNewSubjectDesc(e.target.value)}
              className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-slate-500 text-xs outline-none focus:border-blue-500"
            />
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl hover:bg-white/[0.05] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1.5 rounded-xl text-xs font-medium transition-colors"
            >
              Save Course
            </button>
          </div>
        </form>
      )}

      {subjects === undefined ? (
        <div className="text-slate-400 text-center py-12 text-xs">Loading courses...</div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-16 bg-[#0c1222] border border-dashed border-white/[0.08] rounded-2xl flex flex-col items-center">
          <BookOpen className="h-10 w-10 text-slate-500 mb-3" />
          <h3 className="text-base font-semibold text-white">No courses enrolled yet</h3>
          <p className="text-slate-400 text-xs mt-1 mb-4">Add your academic subjects to link materials, flashcards, and tasks.</p>
          <button
            onClick={() => setIsAdding(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-medium transition-colors"
          >
            Add First Course
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="bg-[#0c1222] border border-white/[0.08] rounded-2xl p-5 hover:border-white/[0.16] transition-colors flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="w-8 h-8 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 group-hover:text-blue-400 transition-colors">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <button 
                    onClick={() => handleDelete(subject.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded"
                    title="Delete subject"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors">
                  {subject.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {subject.description || "Active academic course unit."}
                </p>
              </div>

              <div className="pt-4 flex justify-between items-center text-xs text-slate-500 border-t border-white/[0.06] mt-4">
                <span>Enrolled {new Date(subject.createdAt).toLocaleDateString()}</span>
                <span className="font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer">
                  Explore <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
