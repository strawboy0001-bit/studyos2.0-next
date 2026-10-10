"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { subjectRepo } from "@/lib/db/repositories";
import { Plus, BookOpen, MoreVertical, Search, Trash2 } from "lucide-react";

export default function SubjectsPage() {
  const subjects = useLiveQuery(() => db.subjects.toArray());
  const [isAdding, setIsAdding] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState("");

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName.trim()) return;
    
    await subjectRepo.create({
      name: newSubjectName,
    });
    setNewSubjectName("");
    setIsAdding(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      await subjectRepo.delete(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Subjects</h1>
          <p className="text-slate-500 mt-1">Manage your courses and study units.</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_4px_16px_rgba(139,92,246,0.3)] border border-white/20 text-white px-4 py-2 rounded-md hover:from-violet-600 hover:to-fuchsia-600 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Subject
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddSubject} className="bg-white p-4 border rounded-xl shadow-sm flex gap-4 items-center">
          <input
            type="text"
            autoFocus
            placeholder="Subject Name (e.g. Data Structures)"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="bg-gradient-to-r from-violet-500 to-fuchsia-500 shadow-[0_4px_16px_rgba(139,92,246,0.3)] border border-white/20 text-white px-4 py-2 rounded-md hover:from-violet-600 hover:to-fuchsia-600">
            Save
          </button>
          <button type="button" onClick={() => setIsAdding(false)} className="text-slate-500 hover:text-slate-700">
            Cancel
          </button>
        </form>
      )}

      {subjects === undefined ? (
        <div className="text-slate-500 text-center py-12">Loading subjects...</div>
      ) : subjects.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-xl flex flex-col items-center">
          <BookOpen className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No subjects yet</h3>
          <p className="text-slate-500 mt-1">Add your first subject to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((subject) => (
            <div key={subject.id} className="bg-white border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-white/50 backdrop-blur-md border border-white/60 shadow-[0_4px_16px_rgba(0,0,0,0.02)] text-violet-700 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6" />
                </div>
                <button 
                  onClick={() => handleDelete(subject.id)}
                  className="text-slate-400 hover:text-red-500 transition-colors p-1"
                  title="Delete subject"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="text-xl font-bold text-slate-800">{subject.name}</h3>
              <p className="text-sm text-slate-500 mt-1 line-clamp-2">
                {subject.description || "No description provided."}
              </p>
              <div className="mt-auto pt-6 flex justify-between items-center text-sm text-slate-500 border-t mt-4">
                <span>Created {new Date(subject.createdAt).toLocaleDateString()}</span>
                <span className="font-medium text-violet-700 hover:underline cursor-pointer">Open</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
