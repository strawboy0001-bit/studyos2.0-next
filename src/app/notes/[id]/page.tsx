"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { Save, ArrowLeft, Trash2, Tag, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NoteDetailPage() {
  const params = useParams();
  const router = useRouter();
  const noteId = params?.id as string;

  const note = useLiveQuery(() => (noteId ? db.notes.get(noteId) : undefined), [noteId]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags(note.tags ? note.tags.join(", ") : "");
    }
  }, [note]);

  if (!note) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-slate-400 text-xs">
        <p>Loading note details...</p>
      </div>
    );
  }

  const handleUpdate = async () => {
    if (!title.trim() || !content.trim()) return;

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    await db.notes.update(note.id, {
      title: title.trim(),
      content: content.trim(),
      tags: parsedTags,
      updatedAt: new Date(),
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this note?")) {
      await db.notes.delete(note.id);
      router.push("/notes");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-24 text-slate-100 font-sans flex flex-col h-full">
      <div className="flex items-center justify-between">
        <Link
          href="/notes"
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Notes</span>
        </Link>

        <div className="flex items-center gap-2">
          {isSaved && (
            <span className="text-xs text-emerald-400 font-semibold animate-in fade-in">
              Changes saved!
            </span>
          )}

          <button
            onClick={handleDelete}
            className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-white/5 transition-colors"
            title="Delete note"
          >
            <Trash2 className="h-4 w-4" />
          </button>

          <button
            onClick={handleUpdate}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      <div className="bg-[#0c1224] rounded-3xl border border-white/10 shadow-sm flex flex-col flex-1 overflow-hidden min-h-[520px]">
        <div className="p-6 border-b border-white/10 space-y-3">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl sm:text-3xl font-black text-white outline-none bg-transparent"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-2 flex-1">
              <Tag className="h-4 w-4 shrink-0 text-blue-400" />
              <input
                type="text"
                placeholder="Tags (comma-separated)..."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="flex-1 text-xs outline-none bg-transparent text-slate-200"
              />
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
              {note.isAiGenerated && (
                <span className="text-blue-400 flex items-center gap-1 font-semibold">
                  <Sparkles className="w-3.5 h-3.5" /> AI Generated
                </span>
              )}
            </div>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 w-full p-6 outline-none resize-none text-slate-200 bg-transparent text-sm leading-relaxed"
        />
      </div>
    </div>
  );
}
