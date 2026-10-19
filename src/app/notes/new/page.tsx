"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { Save, ArrowLeft, Tag } from "lucide-react";
import Link from "next/link";

export default function NewNotePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    await db.notes.add({
      id: uuidv4(),
      title: title.trim(),
      content: content.trim(),
      tags: parsedTags,
      isAiGenerated: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    router.push("/notes");
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
        <button
          onClick={handleSave}
          disabled={!title.trim() || !content.trim()}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm transition-all disabled:opacity-40 flex items-center gap-2"
        >
          <Save className="h-4 w-4" />
          <span>Save Note</span>
        </button>
      </div>

      <div className="bg-[#0c1224] rounded-3xl border border-white/10 shadow-sm flex flex-col flex-1 overflow-hidden min-h-[520px]">
        <div className="p-6 border-b border-white/10 space-y-3">
          <input
            type="text"
            placeholder="Note Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-2xl sm:text-3xl font-black text-white outline-none placeholder:text-slate-600 bg-transparent"
            autoFocus
          />
          <div className="flex items-center gap-2.5 text-slate-400 text-xs">
            <Tag className="h-4 w-4 shrink-0 text-blue-400" />
            <input
              type="text"
              placeholder="Add tags separated by commas (e.g. distributed-systems, exam-review, algorithms)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="flex-1 text-xs outline-none placeholder:text-slate-600 bg-transparent text-slate-200"
            />
          </div>
        </div>
        <textarea
          placeholder="Start writing lecture notes, summaries, or code explanations..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 w-full p-6 outline-none resize-none text-slate-200 bg-transparent text-sm leading-relaxed placeholder:text-slate-600"
        />
      </div>
    </div>
  );
}
