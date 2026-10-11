/**
 * StudyOS File Security & Validation Module
 * Enforces strict MIME types, file size limits, binary magic number inspection,
 * filename sanitization, and cryptographic integrity verification.
 */

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 Megabytes
export const MAX_FILE_SIZE_LABEL = "10 MB";

export interface AllowedFormatInfo {
  extension: string;
  label: string;
  mimeType: string;
  category: "document" | "image";
  badgeColor: string;
}

export const ALLOWED_FORMATS: AllowedFormatInfo[] = [
  { extension: ".pdf", label: "PDF Document", mimeType: "application/pdf", category: "document", badgeColor: "bg-red-500/10 text-red-400 border-red-500/20" },
  { extension: ".docx", label: "Word Document", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", category: "document", badgeColor: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  { extension: ".txt", label: "Plain Text", mimeType: "text/plain", category: "document", badgeColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  { extension: ".md", label: "Markdown Note", mimeType: "text/markdown", category: "document", badgeColor: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  { extension: ".png", label: "PNG Image", mimeType: "image/png", category: "image", badgeColor: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" },
  { extension: ".jpg", label: "JPEG Image", mimeType: "image/jpeg", category: "image", badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { extension: ".jpeg", label: "JPEG Image", mimeType: "image/jpeg", category: "image", badgeColor: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  { extension: ".webp", label: "WebP Image", mimeType: "image/webp", category: "image", badgeColor: "bg-teal-500/10 text-teal-400 border-teal-500/20" },
];

export const DISALLOWED_EXTENSIONS_BLACKLIST = [
  "exe", "bat", "cmd", "sh", "bash", "vbs", "ps1", "msi", "com", "scr", "jar",
  "js", "jsx", "ts", "tsx", "mjs", "cjs", "html", "htm", "php", "py", "rb", "pl",
  "svg", "xml", // SVGs can contain executable <script> tags leading to XSS
  "zip", "rar", "7z", "tar", "gz", "iso", "dmg", "bin"
];

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedName: string;
  detectedType: string;
  sizeFormatted: string;
  fileSize: number;
  sha256Checksum?: string;
  category: "document" | "image";
}

/**
 * Format bytes into human-readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Strip directory traversal characters, control characters, null bytes,
 * and dangerous patterns from uploaded file names.
 */
export function sanitizeFileName(rawName: string): string {
  // Strip null bytes and control chars
  let clean = rawName.replace(/[\0\x00-\x1F\x7F]/g, "");
  // Strip directory paths (both unix and windows)
  clean = clean.replace(/^.*[\\/]/, "");
  // Separate name and extension
  const lastDot = clean.lastIndexOf(".");
  if (lastDot === -1) {
    return clean.replace(/[^a-zA-Z0-9_\-\s]/g, "_").slice(0, 80);
  }
  const base = clean.substring(0, lastDot).replace(/[^a-zA-Z0-9_\-\s]/g, "_").slice(0, 80).trim() || "document";
  const ext = clean.substring(lastDot).toLowerCase().replace(/[^a-z0-9.]/g, "");
  return `${base}${ext}`;
}

/**
 * Inspect magic bytes in the ArrayBuffer to verify genuine file signature.
 */
function verifyMagicBytes(bytes: Uint8Array, extension: string): { verified: boolean; error?: string } {
  const ext = extension.toLowerCase().replace(/^\./, "");

  // Helper to match bytes at offset
  const matches = (expected: number[], offset = 0) => {
    if (bytes.length < offset + expected.length) return false;
    return expected.every((val, i) => bytes[offset + i] === val);
  };

  if (ext === "pdf") {
    // PDF starts with %PDF- (0x25 0x50 0x44 0x46)
    if (matches([0x25, 0x50, 0x44, 0x46])) return { verified: true };
    return { verified: false, error: "File content does not match a valid PDF header (%PDF)." };
  }

  if (ext === "png") {
    // PNG starts with 89 50 4E 47 0D 0A 1A 0A
    if (matches([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return { verified: true };
    return { verified: false, error: "File content does not match a valid PNG image header." };
  }

  if (ext === "jpg" || ext === "jpeg") {
    // JPEG starts with FF D8 FF
    if (matches([0xff, 0xd8, 0xff])) return { verified: true };
    return { verified: false, error: "File content does not match a valid JPEG image header." };
  }

  if (ext === "webp") {
    // RIFF .... WEBP
    if (matches([0x52, 0x49, 0x46, 0x46]) && matches([0x57, 0x45, 0x42, 0x50], 8)) {
      return { verified: true };
    }
    return { verified: false, error: "File content does not match a valid WebP image header." };
  }

  if (ext === "docx") {
    // DOCX is a zip container starting with PK (0x50 0x4B 0x03 0x04)
    if (matches([0x50, 0x4b, 0x03, 0x04])) return { verified: true };
    return { verified: false, error: "File content does not match a valid DOCX container (PK header)." };
  }

  if (ext === "txt" || ext === "md") {
    // Text files shouldn't contain large amounts of binary null bytes
    const checkLength = Math.min(bytes.length, 1024);
    let nullBytes = 0;
    for (let i = 0; i < checkLength; i++) {
      if (bytes[i] === 0x00) nullBytes++;
    }
    if (nullBytes > 2) {
      return { verified: false, error: "Suspicious binary data detected in text document." };
    }
    return { verified: true };
  }

  return { verified: true };
}

/**
 * Validate a user-provided file with comprehensive security checks.
 */
export async function validateAndInspectFile(file: File): Promise<FileValidationResult> {
  const sanitizedName = sanitizeFileName(file.name);
  const sizeFormatted = formatBytes(file.size);

  // 1. Strict File Size Check
  if (file.size <= 0) {
    return {
      isValid: false,
      error: "Empty file detected (0 Bytes). Please upload a valid document.",
      sanitizedName,
      detectedType: file.type || "unknown",
      sizeFormatted,
      fileSize: file.size,
      category: "document"
    };
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds the strict ${MAX_FILE_SIZE_LABEL} limit. Selected file is ${sizeFormatted}. Please compress or choose a smaller file.`,
      sanitizedName,
      detectedType: file.type || "unknown",
      sizeFormatted,
      fileSize: file.size,
      category: "document"
    };
  }

  // 2. Extension Extraction and Blacklist Check
  const lastDot = sanitizedName.lastIndexOf(".");
  if (lastDot === -1) {
    return {
      isValid: false,
      error: "Files without a valid document extension are blocked for security.",
      sanitizedName,
      detectedType: "unknown",
      sizeFormatted,
      fileSize: file.size,
      category: "document"
    };
  }

  const rawExt = sanitizedName.substring(lastDot + 1).toLowerCase();
  const extWithDot = `.${rawExt}`;

  if (DISALLOWED_EXTENSIONS_BLACKLIST.includes(rawExt)) {
    return {
      isValid: false,
      error: `Security Alert: Files with extension .${rawExt} are strictly prohibited to prevent arbitrary code execution and protect your data.`,
      sanitizedName,
      detectedType: "blocked_executable_or_script",
      sizeFormatted,
      fileSize: file.size,
      category: "document"
    };
  }

  // 3. Whitelist format check
  const matchedFormat = ALLOWED_FORMATS.find(f => f.extension === extWithDot);
  if (!matchedFormat) {
    const supportedList = ALLOWED_FORMATS.map(f => f.extension.toUpperCase()).join(", ");
    return {
      isValid: false,
      error: `Unsupported file format (.${rawExt}). Only authorized study formats are allowed: ${supportedList}.`,
      sanitizedName,
      detectedType: file.type || "unsupported",
      sizeFormatted,
      fileSize: file.size,
      category: "document"
    };
  }

  // 4. Binary Inspection & Magic Bytes
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    const magicCheck = verifyMagicBytes(bytes, extWithDot);
    if (!magicCheck.verified) {
      return {
        isValid: false,
        error: `Security Verification Failed: ${magicCheck.error}`,
        sanitizedName,
        detectedType: matchedFormat.mimeType,
        sizeFormatted,
        fileSize: file.size,
        category: matchedFormat.category
      };
    }

    // 5. Cryptographic Checksum (SHA-256)
    let sha256Checksum = "";
    if (typeof crypto !== "undefined" && crypto.subtle) {
      const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      sha256Checksum = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    }

    return {
      isValid: true,
      sanitizedName,
      detectedType: matchedFormat.mimeType,
      sizeFormatted,
      fileSize: file.size,
      sha256Checksum,
      category: matchedFormat.category
    };
  } catch (err) {
    return {
      isValid: false,
      error: `Could not verify file binary structure: ${err instanceof Error ? err.message : "Unknown error"}`,
      sanitizedName,
      detectedType: matchedFormat.mimeType,
      sizeFormatted,
      fileSize: file.size,
      category: matchedFormat.category
    };
  }
}
