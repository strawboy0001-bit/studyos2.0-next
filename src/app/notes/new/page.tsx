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
      .map(t => t.trim())
      .filter(t => t.length > 0);

    await db.notes.add({
      id: uuidv4(),
      title,
      content,
      tags: parsedTags,
      isAiGenerated: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    router.push("/notes");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 h-full flex flex-col">
      <div className="flex items-center justify-between">
        <Link href="/notes" className="text-slate-500 hover:text-slate-800 flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" /> Back to Notes
        </Link>
        <button
          onClick={handleSave}
          disabled={!title || !content}
          className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
        >
          <Save className="h-4 w-4" /> Save Note
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border flex flex-col flex-1 overflow-hidden min-h-[500px]">
        <div className="p-6 border-b space-y-4">
          <input
            type="text"
            placeholder="Note Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl font-bold text-slate-900 outline-none placeholder:text-slate-300"
            autoFocus
          />
          <div className="flex items-center gap-3 text-slate-500">
            <Tag className="h-4 w-4 shrink-0" />
            <input
              type="text"
              placeholder="Add tags separated by commas (e.g. biology, exam-prep)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="flex-1 text-sm outline-none placeholder:text-slate-300"
            />
          </div>
        </div>
        <textarea
          placeholder="Start writing your notes here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="flex-1 w-full p-6 outline-none resize-none text-slate-700 leading-relaxed"
        />
      </div>
    </div>
  );
}
