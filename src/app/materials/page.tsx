"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { FileUp, FileText, File, Image as ImageIcon, Trash2, Loader2 } from "lucide-react";

export default function MaterialsPage() {
  const materials = useLiveQuery(() => db.materials.toArray());
  const subjects = useLiveQuery(() => db.subjects.toArray());
  
  const [isUploading, setIsUploading] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setIsUploading(true);

    const file = files[0];
    const arrayBuffer = await file.arrayBuffer();

    // Simulate processing time
    setTimeout(async () => {
      
      await db.materials.add({
        id: uuidv4(),
        title: file.name.split('.').slice(0, -1).join('.'),
        fileName: file.name,
        fileType: file.type || 'unknown',
        fileSize: file.size,
        fileData: arrayBuffer,
        subjectId: selectedSubjectId || undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      setIsUploading(false);
      // Reset input
      e.target.value = '';
    }, 1500);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this material?")) {
      await db.materials.delete(id);
    }
  };

  const handleOpen = (material: any) => {
    if (!material.fileData) {
      alert("File content not available. This file might have been uploaded before the data storage feature was added.");
      return;
    }
    const blob = new Blob([material.fileData], { type: material.fileType });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const getFileIcon = (type: string) => {
    if (type.includes('pdf')) return <FileText className="h-8 w-8 text-red-500" />;
    if (type.includes('image')) return <ImageIcon className="h-8 w-8 text-blue-500" />;
    return <File className="h-8 w-8 text-slate-500" />;
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Study Materials</h1>
          <p className="text-slate-500 mt-1">Upload and manage your documents, PDFs, and resources.</p>
        </div>
      </div>

      <div className="bg-white border-2 border-dashed border-slate-300 rounded-xl p-8 text-center transition-colors hover:border-blue-500 relative">
        <input 
          type="file" 
          onChange={handleFileUpload} 
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          accept=".pdf,.doc,.docx,.txt,image/*"
        />
        
        {isUploading ? (
          <div className="flex flex-col items-center justify-center text-blue-600">
            <Loader2 className="h-10 w-10 animate-spin mb-4" />
            <p className="font-medium">Uploading and extracting text...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center pointer-events-none">
            <div className="bg-blue-50 p-4 rounded-full mb-4">
              <FileUp className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-slate-800 text-lg mb-1">Upload Material</h3>
            <p className="text-slate-500 text-sm mb-4">Drag & drop files or click to browse</p>
            
            <div className="flex items-center gap-2 pointer-events-auto z-10">
              <label className="text-sm font-medium text-slate-700">Link to Subject:</label>
              <select 
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="border rounded-md px-3 py-1.5 text-sm outline-none"
              >
                <option value="">-- None --</option>
                {subjects?.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {materials === undefined ? (
        <div className="text-center py-12 text-slate-500">Loading materials...</div>
      ) : materials.length === 0 ? (
        null
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materials.map((material) => (
            <div key={material.id} className="bg-white border rounded-xl p-5 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
              <div 
                className="bg-slate-50 p-3 rounded-lg border cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => handleOpen(material)}
              >
                {getFileIcon(material.fileType)}
              </div>
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-start">
                  <h3 
                    className="font-bold text-slate-800 truncate cursor-pointer hover:text-blue-600 transition-colors" 
                    title={material.title}
                    onClick={() => handleOpen(material)}
                  >
                    {material.title}
                  </h3>
                  <button 
                    onClick={() => handleDelete(material.id)}
                    className="text-slate-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex flex-col mt-1 space-y-1">
                  <span className="text-xs text-slate-500">{formatBytes(material.fileSize)}</span>
                  {material.subjectId && subjects && (
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md w-fit truncate max-w-full">
                      {subjects.find(s => s.id === material.subjectId)?.name || 'Unknown'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
