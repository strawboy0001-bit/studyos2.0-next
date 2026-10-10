"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Edit3, Plus, Search, Tag, FileText, Trash2 } from "lucide-react";
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Notes Workspace</h1>
          <p className="text-slate-500 mt-1">Capture, organize, and review your study materials.</p>
        </div>
        <Link
          href="/notes/new"
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors shrink-0"
        >
          <Plus className="h-4 w-4" />
          New Note
        </Link>
      </div>

      <div className="bg-white border rounded-xl p-4 shadow-sm flex gap-3 items-center">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search your notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 outline-none text-slate-700 bg-transparent"
        />
      </div>

      {notes === undefined ? (
        <div className="text-center py-12 text-slate-500">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="text-center py-16 bg-white border border-dashed rounded-xl flex flex-col items-center">
          <Edit3 className="h-12 w-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-medium text-slate-900">No notes yet</h3>
          <p className="text-slate-500 mt-1 mb-4">Start writing notes or save important definitions.</p>
          <Link href="/notes/new" className="bg-purple-50 text-purple-600 px-4 py-2 rounded-md font-medium hover:bg-purple-100 transition-colors">
            Create Note
          </Link>
        </div>
      ) : filteredNotes?.length === 0 ? (
        <div className="text-center py-12 text-slate-500">No notes match your search.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes?.map((note) => (
            <Link key={note.id} href={`/notes/${note.id}`} className="group bg-white border rounded-xl p-6 shadow-sm hover:shadow-md hover:border-purple-300 transition-all flex flex-col min-h-[200px]">
              <div className="flex justify-between items-start mb-3">
                <div className="bg-purple-50 p-2 rounded-lg text-purple-600">
                  <FileText className="h-5 w-5" />
                </div>
                <button 
                  onClick={(e) => handleDelete(note.id, e)}
                  className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-slate-800 line-clamp-1">{note.title}</h3>
              <p className="text-sm text-slate-500 mt-2 line-clamp-3 flex-1">
                {note.content}
              </p>
              
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {note.tags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md flex items-center gap-1">
                      <Tag className="h-3 w-3" /> {tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && <span className="text-xs text-slate-400">+{note.tags.length - 3} more</span>}
                </div>
              )}
              
              <div className="mt-4 pt-4 border-t text-xs text-slate-400 flex justify-between">
                <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                {note.isAiGenerated && (
                  <span className="text-violet-600 font-medium">AI Generated</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
