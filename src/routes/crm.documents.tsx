import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  Folder,
  FolderOpen,
  FolderPlus,
  Pencil,
  Trash2,
  Search,
  MoreVertical,
  File,
  X,
  Check,
  Upload,
  ArrowLeft,
  Download,
  FileText,
  FileImage,
  Film,
  Archive,
  ChevronRight,
  HardDrive,
  Cloud,
  Link2,
  Unlink,
} from "lucide-react";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { useGoogleLogin } from "@react-oauth/google";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmployeeProfileCard } from "@/components/EmployeeProfileCard";

export const Route = createFileRoute("/crm/documents")({ component: FoldersPage });

/* ─── Types ─── */
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  dataUrl: string; // base64 data URL – survives refresh
}

interface FolderItem {
  id: string;
  name: string;
  color: string;
  iconColor: string;
  createdAt: string;
  description: string;
  files: UploadedFile[];
  manager?: string;
}

/* ─── Persistence key ─── */
const LS_KEY = "crm_documents_v1";

function loadFromStorage(): FolderItem[] | null {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as FolderItem[];
  } catch {
    return null;
  }
}

function saveToStorage(folders: FolderItem[]) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(folders));
  } catch (e) {
    // Storage full – warn quietly
    console.warn("localStorage full, could not save documents:", e);
  }
}

/* ─── Helpers ─── */
const COLORS = [
  { bg: "bg-blue-100 text-blue-600 border-blue-200", icon: "#3b82f6" },
  { bg: "bg-violet-100 text-violet-600 border-violet-200", icon: "#8b5cf6" },
  { bg: "bg-amber-100 text-amber-600 border-amber-200", icon: "#f59e0b" },
  { bg: "bg-emerald-100 text-emerald-600 border-emerald-200", icon: "#10b981" },
  { bg: "bg-rose-100 text-rose-600 border-rose-200", icon: "#f43f5e" },
  { bg: "bg-cyan-100 text-cyan-600 border-cyan-200", icon: "#06b6d4" },
];

function pickColor(idx: number) {
  return COLORS[idx % COLORS.length];
}

function fmtSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function fileIcon(mime: string) {
  if (mime.startsWith("image/")) return <FileImage className="h-4 w-4 text-emerald-500" />;
  if (mime.startsWith("video/")) return <Film className="h-4 w-4 text-purple-500" />;
  if (mime === "application/pdf") return <FileText className="h-4 w-4 text-red-500" />;
  if (mime.includes("zip") || mime.includes("rar"))
    return <Archive className="h-4 w-4 text-amber-500" />;
  return <File className="h-4 w-4 text-blue-400" />;
}

function fileTypeLabel(mime: string) {
  if (mime === "application/pdf") return "PDF";
  if (mime.startsWith("image/")) return mime.replace("image/", "").toUpperCase();
  if (mime.startsWith("video/")) return mime.replace("video/", "").toUpperCase();
  if (mime.includes("word") || mime.includes("document")) return "WORD";
  if (mime.includes("sheet") || mime.includes("excel")) return "EXCEL";
  if (mime.includes("zip")) return "ZIP";
  return mime.split("/").pop()?.toUpperCase() ?? "FILE";
}

/** Read a File as a base64 data URL (async) */
function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

let _fid = 7;
function genFolderId() {
  return `F-${String(_fid++).padStart(2, "0")}`;
}
let _uid = 1;
function genFileId() {
  return `U-${String(_uid++).padStart(4, "0")}`;
}

/* ─── Seed folders (only used when localStorage is empty) ─── */
const SEED_FOLDERS: FolderItem[] = [
  {
    id: "F-01",
    name: "Passports & IDs",
    color: pickColor(0).bg,
    iconColor: pickColor(0).icon,
    createdAt: "2026-01-10",
    description: "Customer passport scans and ID documents",
    files: [],
    manager: "Pushplata Kriplani",
  },
  {
    id: "F-02",
    name: "Visa Applications",
    color: pickColor(1).bg,
    iconColor: pickColor(1).icon,
    createdAt: "2026-01-15",
    description: "Submitted and approved visa documents",
    files: [],
    manager: "Pushplata Kriplani",
  },
  {
    id: "F-04",
    name: "Hotel Vouchers",
    color: pickColor(3).bg,
    iconColor: pickColor(3).icon,
    createdAt: "2026-02-20",
    description: "Confirmed booking vouchers for all hotels",
    files: [],
    manager: "Pushplata Kriplani",
  },
  {
    id: "F-05",
    name: "Flight Tickets",
    color: pickColor(4).bg,
    iconColor: pickColor(4).icon,
    createdAt: "2026-03-05",
    description: "E-tickets and boarding pass copies",
    files: [],
    manager: "Pushplata Kriplani",
  },
  {
    id: "F-06",
    name: "Tour Itineraries",
    color: pickColor(5).bg,
    iconColor: pickColor(5).icon,
    createdAt: "2026-03-18",
    description: "Day-wise itinerary PDFs for each package",
    files: [],
    manager: "Pushplata Kriplani",
  },
];

/* ─── Modal ─── */
function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)" }}
    >
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold">{title}</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted-foreground hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ─── Inline rename ─── */
function RenameInput({
  value,
  onSave,
  onCancel,
}: {
  value: string;
  onSave: (v: string) => void;
  onCancel: () => void;
}) {
  const [v, setV] = useState(value);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
    ref.current?.select();
  }, []);
  return (
    <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
      <input
        ref={ref}
        value={v}
        onChange={(e) => setV(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") onSave(v.trim());
          if (e.key === "Escape") onCancel();
        }}
        className="flex-1 rounded-lg border border-primary bg-background px-2 py-1 text-sm font-semibold outline-none ring-2 ring-primary/30"
      />
      <button
        onClick={() => onSave(v.trim())}
        className="rounded-md p-1 text-emerald-600 hover:bg-emerald-50 transition-colors"
      >
        <Check className="h-3.5 w-3.5" />
      </button>
      <button
        onClick={onCancel}
        className="rounded-md p-1 text-red-500 hover:bg-red-50 transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

/* ─── Folder Card ─── */
function FolderCard({
  folder,
  onRename,
  onDelete,
  onOpen,
}: {
  folder: FolderItem;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onOpen: (folder: FolderItem) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [menuOpen]);

  const totalSize = folder.files.reduce((s, f) => s + f.size, 0);

  return (
    <div
      className="group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
      onClick={() => !renaming && onOpen(folder)}
    >
      {/* Menu */}
      <div className="absolute right-3 top-3" ref={menuRef} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={() => setMenuOpen((p) => !p)}
          className="rounded-lg p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-8 z-20 min-w-[140px] rounded-xl border border-border bg-card py-1 shadow-xl">
            <button
              onClick={() => {
                setRenaming(true);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors"
            >
              <Pencil className="h-3.5 w-3.5" /> Rename
            </button>
            <button
              onClick={() => {
                onDelete(folder.id);
                setMenuOpen(false);
              }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Icon */}
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 ${folder.color}`}
      >
        <Folder className="h-6 w-6" />
      </div>

      {/* Name */}
      {renaming ? (
        <RenameInput
          value={folder.name}
          onSave={(v) => {
            if (v) onRename(folder.id, v);
            setRenaming(false);
          }}
          onCancel={() => setRenaming(false)}
        />
      ) : (
        <p className="font-semibold leading-tight line-clamp-1">{folder.name}</p>
      )}

      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
        {folder.description}
      </p>

      <div className="mt-auto flex items-center justify-between pt-3 border-t border-border">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <File className="h-3 w-3" />
          {folder.files.length} file{folder.files.length !== 1 ? "s" : ""}
          {totalSize > 0 && <span className="ml-1 opacity-60">· {fmtSize(totalSize)}</span>}
        </span>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          Open <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </div>
  );
}

/* ─── Drop Zone ─── */
function DropZone({
  onFiles,
  uploading,
  isZoho,
}: {
  onFiles: (files: File[]) => void;
  uploading: boolean;
  isZoho: boolean;
}) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      onFiles(Array.from(e.dataTransfer.files));
    },
    [onFiles],
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !uploading && inputRef.current?.click()}
      className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10 transition-all ${
        uploading
          ? "border-primary/40 bg-primary/5 cursor-wait"
          : dragging
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-border bg-secondary/30 hover:border-primary/50 hover:bg-primary/5"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.zip,.rar,.txt,image/*,video/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            onFiles(Array.from(e.target.files));
            e.target.value = "";
          }
        }}
      />
      <div
        className={`grid h-14 w-14 place-items-center rounded-2xl transition-colors ${uploading ? "bg-primary/20" : "bg-primary/10"}`}
      >
        {uploading ? (
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          <Upload className="h-7 w-7 text-primary" />
        )}
      </div>
      <div className="text-center">
        {uploading ? (
          <p className="font-semibold text-sm text-primary">Saving files…</p>
        ) : (
          <>
            <p className="font-semibold text-sm">Drag & drop files here</p>
            <p className="mt-1 text-xs text-muted-foreground">
              or click to browse — PDF, Images, Docs, Excel, ZIP…
            </p>
            <p className="mt-1 text-xs text-muted-foreground flex items-center justify-center gap-1">
              {isZoho ? (
                <>
                  <Cloud className="h-3 w-3 text-[#0F9D58]" /> Files will be saved directly to
                  Google Drive
                </>
              ) : (
                <>
                  <HardDrive className="h-3 w-3" /> Files are saved locally in your browser
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

/* ─── File Row ─── */
function FileRow({
  file,
  onDelete,
  onPreview,
}: {
  file: UploadedFile;
  onDelete: (id: string) => void;
  onPreview: (file: UploadedFile) => void;
}) {
  return (
    <tr className="group border-b border-border/60 transition-colors hover:bg-secondary/40">
      <td className="py-3 pl-4 pr-2">
        <div className="flex items-center gap-2.5">
          {fileIcon(file.type)}
          <button
            onClick={() => onPreview(file)}
            className="max-w-[260px] truncate text-sm font-medium text-left hover:text-primary hover:underline transition-colors"
          >
            {file.name}
          </button>
        </div>
      </td>
      <td className="py-3 px-3">
        <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold uppercase text-muted-foreground">
          {fileTypeLabel(file.type)}
        </span>
      </td>
      <td className="py-3 px-3 text-sm text-muted-foreground">{fmtSize(file.size)}</td>
      <td className="py-3 px-3 text-sm text-muted-foreground">{fmtDate(file.uploadedAt)}</td>
      <td className="py-3 pl-3 pr-4">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <a
            href={file.dataUrl}
            download={file.name}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            title="Download"
          >
            <Download className="h-3.5 w-3.5" />
          </a>
          <button
            onClick={() => onDelete(file.id)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ─── Folder Detail View ─── */
function FolderDetail({
  folder,
  onBack,
  onUpload,
  onDeleteFile,
  isZoho,
}: {
  folder: FolderItem;
  onBack: () => void;
  onUpload: (folderId: string, files: File[]) => Promise<void>;
  onDeleteFile: (folderId: string, fileId: string) => void;
  isZoho: boolean;
}) {
  const [search, setSearch] = useState("");
  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [savedBanner, setSavedBanner] = useState(false);

  const filtered = folder.files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));

  const handleDrop = async (files: File[]) => {
    setUploading(true);
    await onUpload(folder.id, files);
    setUploading(false);
    setSavedBanner(true);
    setTimeout(() => setSavedBanner(false), 3000);
  };

  const totalSize = folder.files.reduce((s, f) => s + f.size, 0);

  return (
    <div className="space-y-6">
      {/* Back + Header */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium shadow-sm hover:bg-secondary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Folders
        </button>
        <div className="flex items-center gap-2">
          <div
            className={`flex h-9 w-9 items-center justify-center rounded-xl border-2 ${folder.color}`}
          >
            <FolderOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold leading-tight">{folder.name}</h2>
            <p className="text-xs text-muted-foreground">{folder.description}</p>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <File className="h-3.5 w-3.5" /> {folder.files.length} file
            {folder.files.length !== 1 ? "s" : ""}
          </span>
          {totalSize > 0 && (
            <span className="flex items-center gap-1">
              <HardDrive className="h-3.5 w-3.5" /> {fmtSize(totalSize)}
            </span>
          )}
        </div>
      </div>

      {/* Saved banner */}
      {savedBanner && (
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm animate-in fade-in duration-300 ${
            isZoho
              ? "border-primary/30 bg-green-50 text-[#0F9D58]"
              : "border-emerald-200 bg-emerald-50 text-emerald-700"
          }`}
        >
          <Check className="h-4 w-4 shrink-0" />
          <span>
            Files{" "}
            {isZoho
              ? "uploaded successfully to Google Drive."
              : "saved successfully — they will persist after page refresh."}
          </span>
        </div>
      )}

      {/* Drop Zone */}
      <DropZone onFiles={handleDrop} uploading={uploading} isZoho={isZoho} />

      {/* File List */}
      <div className="rounded-2xl border border-border bg-card shadow-card overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">
            Files
            {folder.files.length > 0 && (
              <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium">
                {folder.files.length}
              </span>
            )}
          </p>
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search files…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 text-sm rounded-lg"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary">
              <File className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <p className="font-semibold text-muted-foreground">
              {search ? "No files match your search" : "No files yet"}
            </p>
            <p className="text-xs text-muted-foreground">
              {search ? "Try a different search term." : "Upload a file using the area above."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-2.5 pl-4 pr-2 text-left">File Name</th>
                  <th className="py-2.5 px-3 text-left">Type</th>
                  <th className="py-2.5 px-3 text-left">Size</th>
                  <th className="py-2.5 px-3 text-left">Uploaded</th>
                  <th className="py-2.5 pl-3 pr-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((file) => (
                  <FileRow
                    key={file.id}
                    file={file}
                    onDelete={(id) => onDeleteFile(folder.id, id)}
                    onPreview={setPreviewFile}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Modal
        open={!!previewFile}
        onClose={() => setPreviewFile(null)}
        title={previewFile?.name ?? ""}
      >
        {previewFile && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3">
              {fileIcon(previewFile.type)}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{previewFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {fmtSize(previewFile.size)} · {fmtDate(previewFile.uploadedAt)}
                </p>
              </div>
            </div>

            {previewFile.type.startsWith("image/") && (
              <img
                src={previewFile.dataUrl}
                alt={previewFile.name}
                className="max-h-64 w-full rounded-xl object-contain bg-secondary/30"
              />
            )}
            {previewFile.type === "application/pdf" && (
              <iframe
                src={previewFile.dataUrl}
                className="h-64 w-full rounded-xl border border-border"
                title={previewFile.name}
              />
            )}

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setPreviewFile(null)} className="rounded-xl">
                Close
              </Button>
              <a href={previewFile.dataUrl} download={previewFile.name}>
                <Button className="gap-2 rounded-xl">
                  <Download className="h-4 w-4" /> Download
                </Button>
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

/* ─── Main Page ─── */
function FoldersPage() {
  // Load from Supabase, fall back to seed
  const [folders, setFolders] = useSupabaseTable<FolderItem[]>("folders", SEED_FOLDERS);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [openFolderId, setOpenFolderId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FolderItem | null>(null);

  // Google Drive State
  const [googleAccessToken, setGoogleAccessToken] = useLocalStorage("crm_gdrive_token", "");
  const isZohoConnected = !!googleAccessToken;
  const [zohoModalOpen, setZohoModalOpen] = useState(false);
  const [isConnectingZoho, setIsConnectingZoho] = useState(false);

  // Always call useGoogleLogin unconditionally (React hook rules).
  // When no clientId is configured, GoogleOAuthProvider still wraps the app
  // but login will show an alert instead of launching the OAuth popup.
  const googleLogin = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setGoogleAccessToken(tokenResponse.access_token);
      setIsConnectingZoho(false);
      setZohoModalOpen(false);
    },
    onError: () => {
      setIsConnectingZoho(false);
      console.error("Google Login Failed");
      alert("Google Login Failed. Make sure a valid Google OAuth Client ID is configured.");
    },
    scope: "https://www.googleapis.com/auth/drive.file",
  });

  const loginWithGoogle = () => {
    const clientId = import.meta.env.VITE_GOOGLE_DRIVE_CLIENT_ID as string | undefined;
    if (!clientId) {
      setIsConnectingZoho(false);
      alert(
        "Google Drive is not configured. To enable it, add your VITE_GOOGLE_DRIVE_CLIENT_ID to the .env file.",
      );
      return;
    }
    googleLogin();
  };

  const openFolder = folders.find((f) => f.id === openFolderId) ?? null;

  const filtered = folders.filter(
    (f) =>
      f?.name?.toLowerCase().includes(search.toLowerCase()) ||
      f?.description?.toLowerCase().includes(search.toLowerCase()),
  );

  /* ── CRUD ── */
  function handleCreate() {
    const name = newName.trim();
    if (!name) return;
    const idx = folders.length;
    const color = pickColor(idx);
    const folder: FolderItem = {
      id: genFolderId(),
      name,
      color: color.bg,
      iconColor: color.icon,
      files: [],
      createdAt: new Date().toISOString().slice(0, 10),
      description: newDesc.trim() || "No description",
      manager: "Pushplata Kriplani",
    };
    setFolders((p) => [folder, ...p]);
    setNewName("");
    setNewDesc("");
    setCreateOpen(false);
  }

  function handleRename(id: string, name: string) {
    setFolders((p) => p.map((f) => (f.id === id ? { ...f, name } : f)));
  }

  function handleDelete(id: string) {
    setFolders((p) => p.filter((f) => f.id !== id));
    if (openFolderId === id) setOpenFolderId(null);
    setDeleteTarget(null);
  }

  /* ── File upload – reads files to base64 & persists ── */
  async function handleUpload(folderId: string, rawFiles: File[]) {
    if (googleAccessToken) {
      try {
        for (const file of rawFiles) {
          const metadata = {
            name: file.name,
            mimeType: file.type || "application/octet-stream",
          };

          const form = new FormData();
          form.append(
            "metadata",
            new Blob([JSON.stringify(metadata)], { type: "application/json" }),
          );
          form.append("file", file);

          const res = await fetch(
            "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${googleAccessToken}`,
              },
              body: form,
            },
          );

          if (!res.ok) {
            console.error("Failed to upload to Google Drive", await res.text());
            alert("Failed to upload " + file.name + " to Google Drive.");
          }
        }
      } catch (e) {
        console.error(e);
        alert("Failed to upload to Google Drive. Check console.");
      }
    }

    const uploads = await Promise.all(
      rawFiles.map(
        async (rf) =>
          ({
            id: genFileId(),
            name: rf.name,
            size: rf.size,
            type: rf.type || "application/octet-stream",
            uploadedAt: new Date().toISOString(),
            dataUrl: await readAsDataUrl(rf),
          }) satisfies UploadedFile,
      ),
    );
    setFolders((p) =>
      p.map((f) => (f.id === folderId ? { ...f, files: [...uploads, ...f.files] } : f)),
    );
  }

  function handleDeleteFile(folderId: string, fileId: string) {
    setFolders((p) =>
      p.map((f) =>
        f.id === folderId ? { ...f, files: f.files.filter((u) => u.id !== fileId) } : f,
      ),
    );
  }

  const totalFiles = folders.reduce((s, f) => s + f.files.length, 0);

  /* ── Folder detail ── */
  if (openFolder) {
    return (
      <FolderDetail
        folder={openFolder}
        onBack={() => setOpenFolderId(null)}
        onUpload={handleUpload}
        onDeleteFile={handleDeleteFile}
        isZoho={isZohoConnected}
      />
    );
  }

  /* ── Folder grid ── */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Folders</h1>
          <p className="mt-1 text-sm text-muted-foreground flex items-center gap-1.5">
            {folders.length} folders · {totalFiles} total files
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setCreateOpen(true)}
            className="gap-2 rounded-xl text-white text-xs font-semibold h-9 hover:opacity-90 transition-opacity"
            style={{ background: "var(--gradient-brand)" }}
            id="new-folder-btn"
          >
            <FolderPlus className="h-4 w-4" /> New Folder
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search folders…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Total Folders", value: folders.length, icon: <Folder className="h-4 w-4" /> },
          { label: "Total Files", value: totalFiles, icon: <File className="h-4 w-4" /> },
          {
            label: "Recent (30d)",
            value: folders.filter(
              (f) => f.createdAt >= new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10),
            ).length,
            icon: <FolderOpen className="h-4 w-4" />,
          },
          {
            label: "Empty Folders",
            value: folders.filter((f) => f.files.length === 0).length,
            icon: <Folder className="h-4 w-4" />,
          },
        ].map((s) => (
          <div
            key={s.label}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-card"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              {s.icon}
            </span>
            <div>
              <p className="font-display text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="grid min-h-[40vh] place-items-center">
          <div className="text-center">
            <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 font-semibold text-muted-foreground">No folders found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {search ? "Try a different search term." : "Create your first folder to get started."}
            </p>
            {!search && (
              <Button
                onClick={() => setCreateOpen(true)}
                className="mt-4 gap-2 rounded-xl"
                variant="outline"
              >
                <FolderPlus className="h-4 w-4" /> New Folder
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onRename={handleRename}
              onDelete={(id) => setDeleteTarget(folders.find((f) => f.id === id) ?? null)}
              onOpen={(f) => setOpenFolderId(f.id)}
            />
          ))}
        </div>
      )}

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New Folder">
        <div className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Folder Name *
            </label>
            <Input
              id="folder-name-input"
              placeholder="e.g. Client Contracts 2026"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreate();
              }}
              autoFocus
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Description
            </label>
            <textarea
              placeholder="Optional description…"
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button variant="outline" onClick={() => setCreateOpen(false)} className="rounded-xl">
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!newName.trim()} className="gap-2 rounded-xl">
              <FolderPlus className="h-4 w-4" /> Create Folder
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Folder">
        {deleteTarget && (
          <div className="space-y-4">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              Are you sure you want to delete <strong>"{deleteTarget.name}"</strong>?
              {deleteTarget.files.length > 0 &&
                ` This folder contains ${deleteTarget.files.length} file${deleteTarget.files.length !== 1 ? "s" : ""}.`}{" "}
              This action cannot be undone.
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDelete(deleteTarget.id)}
                className="gap-2 rounded-xl bg-red-600 text-white hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Zoho Integration Modal */}
      <Modal
        open={zohoModalOpen}
        onClose={() => {
          if (!isConnectingZoho) setZohoModalOpen(false);
        }}
        title="Google Drive Integration"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-4 bg-green-50 border border-green-100 p-4 rounded-xl">
            <div className="bg-card text-card-foreground p-2 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
              <Cloud className="h-6 w-6 text-[#0F9D58]" />
            </div>
            <div>
              <p className="font-bold text-foreground text-sm">Google Drive Workspace</p>
              <p className="text-xs text-muted-foreground">
                {isZohoConnected ? "Status: Connected & Synchronized" : "Status: Not Connected"}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            {isZohoConnected
              ? "Your CRM documents are actively syncing with Google Drive. Files uploaded here are automatically transferred to your secure Google cloud."
              : "Connect your Google Drive account to seamlessly synchronize travel documents, booking vouchers, and passenger passports securely."}
          </p>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setZohoModalOpen(false)}
              disabled={isConnectingZoho}
              className="rounded-xl text-xs h-9"
            >
              Close
            </Button>
            {isZohoConnected ? (
              <Button
                onClick={() => {
                  if (
                    confirm(
                      "Disconnect Google Drive? Your files will remain but new uploads will save locally.",
                    )
                  ) {
                    setGoogleAccessToken("");
                    setZohoModalOpen(false);
                  }
                }}
                className="gap-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-semibold h-9"
              >
                <Unlink className="h-4 w-4" /> Disconnect
              </Button>
            ) : (
              <Button
                onClick={() => {
                  setIsConnectingZoho(true);
                  loginWithGoogle();
                }}
                disabled={isConnectingZoho}
                className="gap-2 rounded-xl bg-[#0F9D58] hover:bg-[#0B8043] text-white text-xs font-semibold h-9 min-w-[140px]"
              >
                {isConnectingZoho ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />{" "}
                    Connecting...
                  </>
                ) : (
                  <>
                    <Link2 className="h-4 w-4" /> Connect to Google Drive
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
