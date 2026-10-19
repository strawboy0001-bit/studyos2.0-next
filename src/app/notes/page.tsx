"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Edit3, Plus, Search, Tag, FileText, Trash2, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function NotesPage() {
  const notes = useLiveQuery(() => db.notes.toArray());
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = notes?.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this note?")) {
      await db.notes.delete(id);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-24 text-slate-100">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-black tracking-tight text-white">Lecture Notes Vault</h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pink-500/15 text-pink-300 border border-pink-500/30">
              Earth-65 Synthesizer
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              Encrypted Local
            </span>
          </div>
          <p className="text-slate-400 text-xs mt-1">Capture, synthesize, and review encrypted study notes.</p>
        </div>
        <Link
          href="/notes/new"
          className="flex items-center gap-2 bg-gradient-to-r from-pink-600 via-rose-500 to-cyan-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:brightness-110 transition-all shadow-[0_0_20px_rgba(236,72,153,0.35)] shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>New Note</span>
        </Link>
      </div>

      {/* Earth-65 Gwen Stacy Notes Card */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-[#180a1c] via-[#0c1224] to-[#081826] border border-pink-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="relative w-11 h-11 rounded-2xl overflow-hidden border border-pink-500/40 shrink-0 shadow-[0_0_15px_rgba(236,72,153,0.35)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/gwen.png" alt="Gwen" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase text-pink-400 tracking-wider">Gwen Stacy • Earth-65 Knowledge Base</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-semibold">Fast Markdown</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              Synthesize messy class discussions into crisp Cornell notes. Clean structure makes exam prep seamless.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-[#0d1424] border border-white/10 rounded-2xl p-3 shadow-sm flex gap-3 items-center hover:border-pink-500/30 transition-all">
        <Search className="h-4 w-4 text-slate-400 ml-1" />
        <input
          type="text"
          placeholder="Search encrypted notes by keyword or tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 outline-none text-white placeholder-slate-500 bg-transparent text-xs"
        />
      </div>

      {notes === undefined ? (
        <div className="text-center py-12 text-slate-400 text-xs">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16 bg-[#0b1226]/50 border border-dashed border-white/10 rounded-3xl flex flex-col items-center">
          <Edit3 className="h-12 w-12 text-slate-500 mb-4" />
          <h3 className="text-lg font-bold text-white">No notes yet</h3>
          <p className="text-slate-400 text-xs mt-1 mb-4">Start writing notes or summarize study materials.</p>
          <Link
            href="/notes/new"
            className="bg-blue-600/20 text-blue-300 border border-blue-500/30 px-4 py-2 rounded-xl text-xs font-semibold hover:bg-blue-600/30 transition-colors"
          >
            Create First Note
          </Link>
        </div>
      ) : filteredNotes?.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-xs">No notes match your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredNotes?.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              className="group bg-[#0d1424] border border-white/10 rounded-3xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-blue-500/40 transition-all flex flex-col min-h-[220px]"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="bg-blue-500/10 border border-blue-500/20 p-2.5 rounded-xl text-blue-400">
                  <FileText className="h-5 w-5" />
                </div>
                <button 
                  onClick={(e) => handleDelete(note.id, e)}
                  className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-blue-300 transition-colors">
                {note.title}
              </h3>
              <p className="text-xs text-slate-400 mt-2 line-clamp-3 flex-1 leading-relaxed">
                {note.content}
              </p>
              
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-4">
                  {note.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[10px] bg-white/5 border border-white/10 text-slate-300 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <Tag className="h-2.5 w-2.5 text-blue-400" /> {tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && <span className="text-[10px] text-slate-500">+{note.tags.length - 3}</span>}
                </div>
              )}
              
              <div className="mt-4 pt-3 border-t border-white/5 text-[10px] text-slate-500 flex justify-between items-center">
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                {note.isAiGenerated && (
                  <span className="text-blue-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> AI Synthesized
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
