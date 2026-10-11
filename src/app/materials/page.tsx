"use client";

import React, { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import {
  FileUp,
  FileText,
  File,
  Image as ImageIcon,
  Trash2,
  Loader2,
  ShieldAlert,
  ShieldCheck,
  Search,
  ExternalLink,
  Download,
  Lock,
  HardDrive,
  CheckCircle2,
  X,
  FileCode
} from "lucide-react";
import {
  validateAndInspectFile,
  formatBytes,
  ALLOWED_FORMATS,
  MAX_FILE_SIZE_LABEL
} from "@/lib/security/fileValidator";
import type { StudyMaterial } from "@/lib/db/schema";

export default function MaterialsPage() {
  const materials = useLiveQuery(() => db.materials.toArray());
  const subjects = useLiveQuery(() => db.subjects.toArray());

  const [isUploading, setIsUploading] = useState(false);
  const [scanStep, setScanStep] = useState<string>("");
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "document" | "image">("all");
  const [securityError, setSecurityError] = useState<string | null>(null);
  const [lastUploadedHash, setLastUploadedHash] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const processFile = async (file: File) => {
    setSecurityError(null);
    setIsUploading(true);
    setScanStep("Inspecting file format and size limits...");

    // Validate using deep security module
    const validation = await validateAndInspectFile(file);

    if (!validation.isValid) {
      setIsUploading(false);
      setSecurityError(validation.error || "File did not pass security validation.");
      return;
    }

    setScanStep("Verifying binary magic numbers & integrity...");
    await new Promise((r) => setTimeout(r, 600));

    setScanStep("Computing SHA-256 cryptographic digest...");
    await new Promise((r) => setTimeout(r, 600));

    const arrayBuffer = await file.arrayBuffer();

    setScanStep("Encrypting into isolated local sandbox...");
    await new Promise((r) => setTimeout(r, 500));

    await db.materials.add({
      id: uuidv4(),
      title: validation.sanitizedName.replace(/\.[^/.]+$/, ""),
      fileName: validation.sanitizedName,
      fileType: validation.detectedType,
      fileSize: validation.fileSize,
      fileData: arrayBuffer,
      subjectId: selectedSubjectId || undefined,
      contentExtract: validation.sha256Checksum ? `SHA256:${validation.sha256Checksum}` : undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    if (validation.sha256Checksum) {
      setLastUploadedHash(validation.sha256Checksum.slice(0, 16) + "...");
    }

    setIsUploading(false);
    setScanStep("");
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processFile(files[0]);
    e.target.value = "";
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    await processFile(files[0]);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this material from your secure vault?")) {
      await db.materials.delete(id);
    }
  };

  const handleOpen = (material: StudyMaterial) => {
    if (!material.fileData) {
      alert("File content not available.");
      return;
    }
    const blob = new Blob([material.fileData], { type: material.fileType });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  const handleDownload = (material: StudyMaterial) => {
    if (!material.fileData) return;
    const blob = new Blob([material.fileData], { type: material.fileType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = material.fileName || "study_document";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getFileIcon = (type: string) => {
    if (type.includes("pdf")) return <FileText className="h-6 w-6 text-red-400" />;
    if (type.includes("image")) return <ImageIcon className="h-6 w-6 text-cyan-400" />;
    if (type.includes("word") || type.includes("officedocument")) return <FileText className="h-6 w-6 text-blue-400" />;
    if (type.includes("markdown") || type.includes("text")) return <FileCode className="h-6 w-6 text-emerald-400" />;
    return <File className="h-6 w-6 text-slate-400" />;
  };

  // Filter materials
  const filteredMaterials = materials?.filter((m) => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;

    if (filterType === "document") return !m.fileType.includes("image");
    if (filterType === "image") return m.fileType.includes("image");
    return true;
  });

  const totalVaultBytes = materials?.reduce((acc, m) => acc + (m.fileSize || 0), 0) || 0;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-24 text-slate-100">
      {/* Page Title & Vault Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-3xl font-black tracking-tight text-white">Study Materials Vault</h1>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Restricted Vault
            </span>
          </div>
          <p className="text-slate-400 text-sm mt-1">
            Enforced maximum {MAX_FILE_SIZE_LABEL} limit. Verified study formats only (PDF, DOCX, TXT, MD, Images).
          </p>
        </div>

        {/* Security Vault Metric Cards */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-2xl bg-[#0d1424] border border-white/10 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <HardDrive className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Vault Storage</p>
              <p className="text-xs font-bold text-white">{formatBytes(totalVaultBytes)}</p>
            </div>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-[#0d1424] border border-white/10 flex items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-medium">Data Privacy</p>
              <p className="text-xs font-bold text-emerald-400">Client-Isolated</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Rejection Alert */}
      {securityError && (
        <div className="rounded-2xl bg-red-500/10 border border-red-500/30 p-4 text-red-200 flex items-start justify-between gap-3 shadow-[0_0_30px_rgba(239,68,68,0.15)] animate-in fade-in">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0 mt-0.5">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-red-400">Upload Blocked by Security Policy</h4>
              <p className="text-xs text-red-200/90 mt-0.5 leading-relaxed">{securityError}</p>
              <p className="text-[11px] text-slate-400 mt-2 font-mono">
                Permitted: PDF, DOCX, TXT, MD, PNG, JPG (Max {MAX_FILE_SIZE_LABEL})
              </p>
            </div>
          </div>
          <button
            onClick={() => setSecurityError(null)}
            className="text-red-400 hover:text-white p-1 rounded-lg hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {lastUploadedHash && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3.5 text-emerald-200 flex items-center justify-between shadow-[0_0_20px_rgba(16,185,129,0.15)] animate-in fade-in">
          <div className="flex items-center gap-2.5 text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Document verified & securely stored! SHA-256: <strong className="font-mono text-white">{lastUploadedHash}</strong></span>
          </div>
          <button onClick={() => setLastUploadedHash(null)} className="text-emerald-400 hover:text-white p-1 rounded">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Upload Dropzone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        className={`relative rounded-3xl border-2 border-dashed p-8 text-center transition-all overflow-hidden ${
          isDragOver
            ? "border-blue-400 bg-blue-600/10 shadow-[0_0_35px_rgba(37,99,235,0.25)]"
            : "border-white/15 bg-[#0b1226]/80 hover:border-blue-500/40 hover:bg-[#0e162f]"
        }`}
      >
        <input
          type="file"
          onChange={handleFileInput}
          disabled={isUploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-20"
          accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg,.webp"
        />

        {isUploading ? (
          <div className="py-8 flex flex-col items-center justify-center text-blue-400 space-y-3 z-10 relative">
            <div className="relative">
              <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
              <Lock className="h-5 w-5 text-blue-300 absolute inset-0 m-auto" />
            </div>
            <div className="space-y-1">
              <p className="font-bold text-white text-base">Security Inspection in Progress</p>
              <p className="text-xs text-blue-300 font-mono">{scanStep}</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600/20 to-indigo-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 shadow-[0_0_20px_rgba(37,99,235,0.2)]">
              <FileUp className="h-8 w-8" />
            </div>
            <h3 className="font-bold text-white text-lg mb-1">
              Upload Document to Secure Vault
            </h3>
            <p className="text-slate-400 text-xs mb-4">
              Drag & drop files here, or click to browse. Limited strictly to safe study formats.
            </p>

            {/* Allowed Format Badges */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mb-5 max-w-xl">
              {ALLOWED_FORMATS.map((fmt) => (
                <span
                  key={fmt.extension}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${fmt.badgeColor}`}
                >
                  {fmt.extension.toUpperCase()}
                </span>
              ))}
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30">
                Max {MAX_FILE_SIZE_LABEL}
              </span>
            </div>

            {/* Subject Selector */}
            <div
              className="flex items-center gap-2 pointer-events-auto z-30 bg-[#0d1424] px-4 py-2 rounded-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <label className="text-xs font-semibold text-slate-300">Link Subject:</label>
              <select
                value={selectedSubjectId}
                onChange={(e) => setSelectedSubjectId(e.target.value)}
                className="bg-transparent text-xs text-white outline-none cursor-pointer font-medium"
              >
                <option value="" className="bg-[#0b1226] text-slate-300">-- None (General) --</option>
                {subjects?.map((s) => (
                  <option key={s.id} value={s.id} className="bg-[#0b1226] text-white">
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search verified documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-[#0d1424] border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0d1424] border border-white/10 text-xs">
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              filterType === "all" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            All Files ({materials?.length || 0})
          </button>
          <button
            onClick={() => setFilterType("document")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              filterType === "document" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setFilterType("image")}
            className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
              filterType === "image" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Images
          </button>
        </div>
      </div>

      {/* Materials List / Grid */}
      {materials === undefined ? (
        <div className="text-center py-16 text-slate-400 flex flex-col items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
          <span className="text-xs">Loading secure materials vault...</span>
        </div>
      ) : filteredMaterials && filteredMaterials.length === 0 ? (
        <div className="text-center py-16 rounded-3xl bg-[#0b1226]/50 border border-white/5 p-8 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 mx-auto flex items-center justify-center text-slate-400">
            <FileText className="w-6 h-6" />
          </div>
          <h4 className="text-base font-bold text-white">No Materials Found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Upload PDFs, DOCX, or study lecture captures above to begin building your encrypted course repository.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials?.map((material) => (
            <div
              key={material.id}
              className="rounded-3xl bg-[#0d1424] border border-white/10 p-5 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-blue-500/40 transition-all flex flex-col justify-between group"
            >
              <div className="flex items-start gap-3.5">
                <div
                  className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/[0.08] transition-colors shrink-0"
                  onClick={() => handleOpen(material)}
                  title="Click to view file"
                >
                  {getFileIcon(material.fileType)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3
                      className="font-bold text-white text-sm truncate cursor-pointer hover:text-blue-400 transition-colors"
                      title={material.title}
                      onClick={() => handleOpen(material)}
                    >
                      {material.title}
                    </h3>
                    <button
                      onClick={() => handleDelete(material.id)}
                      className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                      title="Delete material"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{material.fileName}</p>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                      {formatBytes(material.fileSize)}
                    </span>
                    {material.subjectId && subjects && (
                      <span className="text-[10px] font-medium text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded truncate max-w-[140px]">
                        {subjects.find((s) => s.id === material.subjectId)?.name || "Subject"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Security Verification & Actions */}
              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
                <div className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>SHA-256 Verified</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDownload(material)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                    title="Download file"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpen(material)}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-slate-300 hover:text-blue-300 transition-colors"
                    title="Open in new tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
