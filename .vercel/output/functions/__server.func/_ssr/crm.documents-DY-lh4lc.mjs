import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { t as useLocalStorage } from "./use-local-storage-C6y5r3WN.mjs";
import { $ as Folder, A as Pencil, Dt as Check, Rt as ArrowLeft, Tt as ChevronRight, V as Link2, X as HardDrive, c as Unlink, et as FolderPlus, f as Trash2, ft as EllipsisVertical, gt as Cloud, it as FileText, n as X, nt as Film, pt as Download, rt as File, s as Upload, st as FileImage, tt as FolderOpen, w as Search, zt as Archive } from "../_libs/lucide-react.mjs";
import { n as useGoogleLogin } from "../_libs/react-oauth__google.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm.documents-DY-lh4lc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var LS_KEY = "crm_documents_v1";
function loadFromStorage() {
	try {
		const raw = localStorage.getItem(LS_KEY);
		if (!raw) return null;
		return JSON.parse(raw);
	} catch {
		return null;
	}
}
function saveToStorage(folders) {
	try {
		localStorage.setItem(LS_KEY, JSON.stringify(folders));
	} catch (e) {
		console.warn("localStorage full, could not save documents:", e);
	}
}
var COLORS = [
	{
		bg: "bg-blue-100 text-blue-600 border-blue-200",
		icon: "#3b82f6"
	},
	{
		bg: "bg-violet-100 text-violet-600 border-violet-200",
		icon: "#8b5cf6"
	},
	{
		bg: "bg-amber-100 text-amber-600 border-amber-200",
		icon: "#f59e0b"
	},
	{
		bg: "bg-emerald-100 text-emerald-600 border-emerald-200",
		icon: "#10b981"
	},
	{
		bg: "bg-rose-100 text-rose-600 border-rose-200",
		icon: "#f43f5e"
	},
	{
		bg: "bg-cyan-100 text-cyan-600 border-cyan-200",
		icon: "#06b6d4"
	}
];
function pickColor(idx) {
	return COLORS[idx % COLORS.length];
}
function fmtSize(bytes) {
	if (bytes < 1024) return `${bytes} B`;
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
	return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}
function fmtDate(iso) {
	return new Date(iso).toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric"
	});
}
function fileIcon(mime) {
	if (mime.startsWith("image/")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileImage, { className: "h-4 w-4 text-emerald-500" });
	if (mime.startsWith("video/")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "h-4 w-4 text-purple-500" });
	if (mime === "application/pdf") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-red-500" });
	if (mime.includes("zip") || mime.includes("rar")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Archive, { className: "h-4 w-4 text-amber-500" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(File, { className: "h-4 w-4 text-blue-400" });
}
function fileTypeLabel(mime) {
	if (mime === "application/pdf") return "PDF";
	if (mime.startsWith("image/")) return mime.replace("image/", "").toUpperCase();
	if (mime.startsWith("video/")) return mime.replace("video/", "").toUpperCase();
	if (mime.includes("word") || mime.includes("document")) return "WORD";
	if (mime.includes("sheet") || mime.includes("excel")) return "EXCEL";
	if (mime.includes("zip")) return "ZIP";
	return mime.split("/").pop()?.toUpperCase() ?? "FILE";
}
/** Read a File as a base64 data URL (async) */
function readAsDataUrl(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => resolve(reader.result);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}
var _fid = 7;
function genFolderId() {
	return `F-${String(_fid++).padStart(2, "0")}`;
}
var _uid = 1;
function genFileId() {
	return `U-${String(_uid++).padStart(4, "0")}`;
}
var SEED_FOLDERS = [
	{
		id: "F-01",
		name: "Passports & IDs",
		color: pickColor(0).bg,
		iconColor: pickColor(0).icon,
		createdAt: "2026-01-10",
		description: "Customer passport scans and ID documents",
		files: [],
		manager: "Pushplata Kriplani"
	},
	{
		id: "F-02",
		name: "Visa Applications",
		color: pickColor(1).bg,
		iconColor: pickColor(1).icon,
		createdAt: "2026-01-15",
		description: "Submitted and approved visa documents",
		files: [],
		manager: "Pushplata Kriplani"
	},
	{
		id: "F-03",
		name: "Travel Insurance",
		color: pickColor(2).bg,
		iconColor: pickColor(2).icon,
		createdAt: "2026-02-03",
		description: "Insurance certificates and policy PDFs",
		files: [],
		manager: "Pushplata Kriplani"
	},
	{
		id: "F-04",
		name: "Hotel Vouchers",
		color: pickColor(3).bg,
		iconColor: pickColor(3).icon,
		createdAt: "2026-02-20",
		description: "Confirmed booking vouchers for all hotels",
		files: [],
		manager: "Pushplata Kriplani"
	},
	{
		id: "F-05",
		name: "Flight Tickets",
		color: pickColor(4).bg,
		iconColor: pickColor(4).icon,
		createdAt: "2026-03-05",
		description: "E-tickets and boarding pass copies",
		files: [],
		manager: "Pushplata Kriplani"
	},
	{
		id: "F-06",
		name: "Tour Itineraries",
		color: pickColor(5).bg,
		iconColor: pickColor(5).icon,
		createdAt: "2026-03-18",
		description: "Day-wise itinerary PDFs for each package",
		files: [],
		manager: "Pushplata Kriplani"
	}
];
function Modal({ open, onClose, title, children }) {
	(0, import_react.useEffect)(() => {
		const h = (e) => {
			if (e.key === "Escape") onClose();
		};
		if (open) window.addEventListener("keydown", h);
		return () => window.removeEventListener("keydown", h);
	}, [open, onClose]);
	if (!open) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center p-4",
		style: {
			background: "rgba(0,0,0,0.45)",
			backdropFilter: "blur(4px)"
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-lg font-bold",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: onClose,
					className: "rounded-lg p-1 text-muted-foreground hover:bg-secondary transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
				})]
			}), children]
		})
	});
}
function RenameInput({ value, onSave, onCancel }) {
	const [v, setV] = (0, import_react.useState)(value);
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		ref.current?.focus();
		ref.current?.select();
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		onClick: (e) => e.stopPropagation(),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref,
				value: v,
				onChange: (e) => setV(e.target.value),
				onKeyDown: (e) => {
					if (e.key === "Enter") onSave(v.trim());
					if (e.key === "Escape") onCancel();
				},
				className: "flex-1 rounded-lg border border-primary bg-background px-2 py-1 text-sm font-semibold outline-none ring-2 ring-primary/30"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => onSave(v.trim()),
				className: "rounded-md p-1 text-emerald-600 hover:bg-emerald-50 transition-colors",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onCancel,
				className: "rounded-md p-1 text-red-500 hover:bg-red-50 transition-colors",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-3.5 w-3.5" })
			})
		]
	});
}
function FolderCard({ folder, onRename, onDelete, onOpen }) {
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const [renaming, setRenaming] = (0, import_react.useState)(false);
	const menuRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const h = (e) => {
			if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
		};
		if (menuOpen) document.addEventListener("mousedown", h);
		return () => document.removeEventListener("mousedown", h);
	}, [menuOpen]);
	const totalSize = folder.files.reduce((s, f) => s + f.size, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group relative flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
		onClick: () => !renaming && onOpen(folder),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute right-3 top-3",
				ref: menuRef,
				onClick: (e) => e.stopPropagation(),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setMenuOpen((p) => !p),
					className: "rounded-lg p-1.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:bg-secondary transition-all",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EllipsisVertical, { className: "h-4 w-4" })
				}), menuOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute right-0 top-8 z-20 min-w-[140px] rounded-xl border border-border bg-card py-1 shadow-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							setRenaming(true);
							setMenuOpen(false);
						},
						className: "flex w-full items-center gap-2 px-4 py-2 text-sm hover:bg-secondary transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "h-3.5 w-3.5" }), " Rename"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => {
							onDelete(folder.id);
							setMenuOpen(false);
						},
						className: "flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" }), " Delete"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `flex h-12 w-12 items-center justify-center rounded-2xl border-2 ${folder.color}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "h-6 w-6" })
			}),
			renaming ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RenameInput, {
				value: folder.name,
				onSave: (v) => {
					if (v) onRename(folder.id, v);
					setRenaming(false);
				},
				onCancel: () => setRenaming(false)
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-semibold leading-tight line-clamp-1",
				children: folder.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground line-clamp-2 leading-relaxed",
				children: folder.description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto flex items-center justify-between pt-3 border-t border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 text-xs text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(File, { className: "h-3 w-3" }),
						folder.files.length,
						" file",
						folder.files.length !== 1 ? "s" : "",
						totalSize > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "ml-1 opacity-60",
							children: ["· ", fmtSize(totalSize)]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1 text-xs text-muted-foreground",
					children: ["Open ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })]
				})]
			})
		]
	});
}
function DropZone({ onFiles, uploading, isZoho }) {
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onDragOver: (e) => {
			e.preventDefault();
			setDragging(true);
		},
		onDragLeave: () => setDragging(false),
		onDrop: (0, import_react.useCallback)((e) => {
			e.preventDefault();
			setDragging(false);
			onFiles(Array.from(e.dataTransfer.files));
		}, [onFiles]),
		onClick: () => !uploading && inputRef.current?.click(),
		className: `flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed py-10 transition-all ${uploading ? "border-primary/40 bg-primary/5 cursor-wait" : dragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border bg-secondary/30 hover:border-primary/50 hover:bg-primary/5"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				ref: inputRef,
				type: "file",
				multiple: true,
				accept: ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.webp,.zip,.rar,.txt,image/*,video/*",
				className: "hidden",
				onChange: (e) => {
					if (e.target.files) {
						onFiles(Array.from(e.target.files));
						e.target.value = "";
					}
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: `grid h-14 w-14 place-items-center rounded-2xl transition-colors ${uploading ? "bg-primary/20" : "bg-primary/10"}`,
				children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-7 w-7 animate-spin rounded-full border-2 border-primary border-t-transparent" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-7 w-7 text-primary" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-center",
				children: uploading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold text-sm text-primary",
					children: "Saving files…"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold text-sm",
						children: "Drag & drop files here"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: "or click to browse — PDF, Images, Docs, Excel, ZIP…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground flex items-center justify-center gap-1",
						children: isZoho ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "h-3 w-3 text-[#0F9D58]" }), " Files will be saved directly to Google Drive"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "h-3 w-3" }), " Files are saved locally in your browser"] })
					})
				] })
			})
		]
	});
}
function FileRow({ file, onDelete, onPreview }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
		className: "group border-b border-border/60 transition-colors hover:bg-secondary/40",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-3 pl-4 pr-2",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [fileIcon(file.type), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onPreview(file),
						className: "max-w-[260px] truncate text-sm font-medium text-left hover:text-primary hover:underline transition-colors",
						children: file.name
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-3 px-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-[11px] font-semibold uppercase text-muted-foreground",
					children: fileTypeLabel(file.type)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-3 px-3 text-sm text-muted-foreground",
				children: fmtSize(file.size)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-3 px-3 text-sm text-muted-foreground",
				children: fmtDate(file.uploadedAt)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
				className: "py-3 pl-3 pr-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: file.dataUrl,
						download: file.name,
						className: "rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
						title: "Download",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => onDelete(file.id),
						className: "rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors",
						title: "Delete",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
					})]
				})
			})
		]
	});
}
function FolderDetail({ folder, onBack, onUpload, onDeleteFile, isZoho }) {
	const [search, setSearch] = (0, import_react.useState)("");
	const [previewFile, setPreviewFile] = (0, import_react.useState)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [savedBanner, setSavedBanner] = (0, import_react.useState)(false);
	const filtered = folder.files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
	const handleDrop = async (files) => {
		setUploading(true);
		await onUpload(folder.id, files);
		setUploading(false);
		setSavedBanner(true);
		setTimeout(() => setSavedBanner(false), 3e3);
	};
	const totalSize = folder.files.reduce((s, f) => s + f.size, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: onBack,
						className: "flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium shadow-sm hover:bg-secondary transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "h-4 w-4" }), " Back to Folders"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `flex h-9 w-9 items-center justify-center rounded-xl border-2 ${folder.color}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "h-5 w-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-bold leading-tight",
							children: folder.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: folder.description
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-4 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(File, { className: "h-3.5 w-3.5" }),
								" ",
								folder.files.length,
								" file",
								folder.files.length !== 1 ? "s" : ""
							]
						}), totalSize > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardDrive, { className: "h-3.5 w-3.5" }),
								" ",
								fmtSize(totalSize)
							]
						})]
					})
				]
			}),
			savedBanner && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: `flex items-center gap-2 rounded-xl border px-4 py-3 text-sm animate-in fade-in duration-300 ${isZoho ? "border-[#FF6B00]/30 bg-green-50 text-[#0F9D58]" : "border-emerald-200 bg-emerald-50 text-emerald-700"}`,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Files ", isZoho ? "uploaded successfully to Google Drive." : "saved successfully — they will persist after page refresh."] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropZone, {
				onFiles: handleDrop,
				uploading,
				isZoho
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card shadow-card overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-4 border-b border-border px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm font-semibold",
						children: ["Files", folder.files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary font-medium",
							children: folder.files.length
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative w-56",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search files…",
							value: search,
							onChange: (e) => setSearch(e.target.value),
							className: "pl-8 h-8 text-sm rounded-lg"
						})]
					})]
				}), filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col items-center justify-center gap-3 py-16 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid h-14 w-14 place-items-center rounded-2xl bg-secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(File, { className: "h-7 w-7 text-muted-foreground/40" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-muted-foreground",
							children: search ? "No files match your search" : "No files yet"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: search ? "Try a different search term." : "Upload a file using the area above."
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border bg-secondary/50 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2.5 pl-4 pr-2 text-left",
									children: "File Name"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2.5 px-3 text-left",
									children: "Type"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2.5 px-3 text-left",
									children: "Size"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2.5 px-3 text-left",
									children: "Uploaded"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2.5 pl-3 pr-4 text-right",
									children: "Actions"
								})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileRow, {
							file,
							onDelete: (id) => onDeleteFile(folder.id, id),
							onPreview: setPreviewFile
						}, file.id)) })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				open: !!previewFile,
				onClose: () => setPreviewFile(null),
				title: previewFile?.name ?? "",
				children: previewFile && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 rounded-xl border border-border bg-secondary/40 p-3",
							children: [fileIcon(previewFile.type), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-semibold",
									children: previewFile.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										fmtSize(previewFile.size),
										" · ",
										fmtDate(previewFile.uploadedAt)
									]
								})]
							})]
						}),
						previewFile.type.startsWith("image/") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: previewFile.dataUrl,
							alt: previewFile.name,
							className: "max-h-64 w-full rounded-xl object-contain bg-secondary/30"
						}),
						previewFile.type === "application/pdf" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							src: previewFile.dataUrl,
							className: "h-64 w-full rounded-xl border border-border",
							title: previewFile.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setPreviewFile(null),
								className: "rounded-xl",
								children: "Close"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: previewFile.dataUrl,
								download: previewFile.name,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									className: "gap-2 rounded-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Download"]
								})
							})]
						})
					]
				})
			})
		]
	});
}
function FoldersPage() {
	const [folders, setFolders] = (0, import_react.useState)(() => loadFromStorage() ?? SEED_FOLDERS);
	const [search, setSearch] = (0, import_react.useState)("");
	const [createOpen, setCreateOpen] = (0, import_react.useState)(false);
	const [newName, setNewName] = (0, import_react.useState)("");
	const [newDesc, setNewDesc] = (0, import_react.useState)("");
	const [openFolderId, setOpenFolderId] = (0, import_react.useState)(null);
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const [googleAccessToken, setGoogleAccessToken] = useLocalStorage("crm_gdrive_token", "");
	const isZohoConnected = !!googleAccessToken;
	const [zohoModalOpen, setZohoModalOpen] = (0, import_react.useState)(false);
	const [isConnectingZoho, setIsConnectingZoho] = (0, import_react.useState)(false);
	const loginWithGoogle = useGoogleLogin({
		onSuccess: (tokenResponse) => {
			setGoogleAccessToken(tokenResponse.access_token);
			setIsConnectingZoho(false);
			setZohoModalOpen(false);
		},
		onError: () => {
			setIsConnectingZoho(false);
			console.error("Google Login Failed");
			alert("Google Login Failed");
		},
		scope: "https://www.googleapis.com/auth/drive.file"
	});
	(0, import_react.useEffect)(() => {
		saveToStorage(folders);
	}, [folders]);
	const openFolder = folders.find((f) => f.id === openFolderId) ?? null;
	const filtered = folders.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()) || f.description.toLowerCase().includes(search.toLowerCase()));
	function handleCreate() {
		const name = newName.trim();
		if (!name) return;
		const idx = folders.length;
		const color = pickColor(idx);
		const folder = {
			id: genFolderId(),
			name,
			color: color.bg,
			iconColor: color.icon,
			files: [],
			createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			description: newDesc.trim() || "No description",
			manager: "Pushplata Kriplani"
		};
		setFolders((p) => [folder, ...p]);
		setNewName("");
		setNewDesc("");
		setCreateOpen(false);
	}
	function handleRename(id, name) {
		setFolders((p) => p.map((f) => f.id === id ? {
			...f,
			name
		} : f));
	}
	function handleDelete(id) {
		setFolders((p) => p.filter((f) => f.id !== id));
		if (openFolderId === id) setOpenFolderId(null);
		setDeleteTarget(null);
	}
	async function handleUpload(folderId, rawFiles) {
		if (googleAccessToken) try {
			for (const file of rawFiles) {
				const metadata = {
					name: file.name,
					mimeType: file.type || "application/octet-stream"
				};
				const form = new FormData();
				form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
				form.append("file", file);
				const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
					method: "POST",
					headers: { Authorization: `Bearer ${googleAccessToken}` },
					body: form
				});
				if (!res.ok) {
					console.error("Failed to upload to Google Drive", await res.text());
					alert("Failed to upload " + file.name + " to Google Drive.");
				}
			}
		} catch (e) {
			console.error(e);
			alert("Failed to upload to Google Drive. Check console.");
		}
		const uploads = await Promise.all(rawFiles.map(async (rf) => ({
			id: genFileId(),
			name: rf.name,
			size: rf.size,
			type: rf.type || "application/octet-stream",
			uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
			dataUrl: await readAsDataUrl(rf)
		})));
		setFolders((p) => p.map((f) => f.id === folderId ? {
			...f,
			files: [...uploads, ...f.files]
		} : f));
	}
	function handleDeleteFile(folderId, fileId) {
		setFolders((p) => p.map((f) => f.id === folderId ? {
			...f,
			files: f.files.filter((u) => u.id !== fileId)
		} : f));
	}
	const totalFiles = folders.reduce((s, f) => s + f.files.length, 0);
	if (openFolder) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderDetail, {
		folder: openFolder,
		onBack: () => setOpenFolderId(null),
		onUpload: handleUpload,
		onDeleteFile: handleDeleteFile,
		isZoho: isZohoConnected
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-bold",
					children: "Folders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted-foreground flex items-center gap-1.5",
					children: [
						folders.length,
						" folders · ",
						totalFiles,
						" total files"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setCreateOpen(true),
						className: "gap-2 rounded-xl text-white text-xs font-semibold h-9 hover:opacity-90 transition-opacity",
						style: { background: "var(--gradient-brand)" },
						id: "new-folder-btn",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "h-4 w-4" }), " New Folder"]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "Search folders…",
					value: search,
					onChange: (e) => setSearch(e.target.value),
					className: "pl-9 rounded-xl"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 sm:grid-cols-4",
				children: [
					{
						label: "Total Folders",
						value: folders.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "h-4 w-4" })
					},
					{
						label: "Total Files",
						value: totalFiles,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(File, { className: "h-4 w-4" })
					},
					{
						label: "Recent (30d)",
						value: folders.filter((f) => f.createdAt >= (/* @__PURE__ */ new Date(Date.now() - 30 * 864e5)).toISOString().slice(0, 10)).length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "h-4 w-4" })
					},
					{
						label: "Empty Folders",
						value: folders.filter((f) => f.files.length === 0).length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Folder, { className: "h-4 w-4" })
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-4 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary",
						children: s.icon
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-xl font-bold",
						children: s.value
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: s.label
					})] })]
				}, s.label))
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid min-h-[40vh] place-items-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "mx-auto h-12 w-12 text-muted-foreground/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-semibold text-muted-foreground",
							children: "No folders found"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: search ? "Try a different search term." : "Create your first folder to get started."
						}),
						!search && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => setCreateOpen(true),
							className: "mt-4 gap-2 rounded-xl",
							variant: "outline",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "h-4 w-4" }), " New Folder"]
						})
					]
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
				children: filtered.map((folder) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderCard, {
					folder,
					onRename: handleRename,
					onDelete: (id) => setDeleteTarget(folders.find((f) => f.id === id) ?? null),
					onOpen: (f) => setOpenFolderId(f.id)
				}, folder.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				open: createOpen,
				onClose: () => setCreateOpen(false),
				title: "Create New Folder",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider",
							children: "Folder Name *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "folder-name-input",
							placeholder: "e.g. Client Contracts 2026",
							value: newName,
							onChange: (e) => setNewName(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter") handleCreate();
							},
							autoFocus: true
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-xs font-semibold text-muted-foreground uppercase tracking-wider",
							children: "Description"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							placeholder: "Optional description…",
							value: newDesc,
							onChange: (e) => setNewDesc(e.target.value),
							rows: 3,
							className: "w-full resize-none rounded-xl border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setCreateOpen(false),
								className: "rounded-xl",
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: handleCreate,
								disabled: !newName.trim(),
								className: "gap-2 rounded-xl",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderPlus, { className: "h-4 w-4" }), " Create Folder"]
							})]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				open: !!deleteTarget,
				onClose: () => setDeleteTarget(null),
				title: "Delete Folder",
				children: deleteTarget && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700",
						children: [
							"Are you sure you want to delete ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
								"\"",
								deleteTarget.name,
								"\""
							] }),
							"?",
							deleteTarget.files.length > 0 && ` This folder contains ${deleteTarget.files.length} file${deleteTarget.files.length !== 1 ? "s" : ""}.`,
							" ",
							"This action cannot be undone."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setDeleteTarget(null),
							className: "rounded-xl",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => handleDelete(deleteTarget.id),
							className: "gap-2 rounded-xl bg-red-600 text-white hover:bg-red-700",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), " Delete"]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Modal, {
				open: zohoModalOpen,
				onClose: () => {
					if (!isConnectingZoho) setZohoModalOpen(false);
				},
				title: "Google Drive Integration",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4 bg-green-50 border border-green-100 p-4 rounded-xl",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "h-6 w-6 text-[#0F9D58]" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-gray-900 text-sm",
								children: "Google Drive Workspace"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: isZohoConnected ? "Status: Connected & Synchronized" : "Status: Not Connected"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-gray-600 leading-relaxed",
							children: isZohoConnected ? "Your CRM documents are actively syncing with Google Drive. Files uploaded here are automatically transferred to your secure Google cloud." : "Connect your Google Drive account to seamlessly synchronize travel documents, booking vouchers, and passenger passports securely."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-end gap-2 pt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setZohoModalOpen(false),
								disabled: isConnectingZoho,
								className: "rounded-xl text-xs h-9",
								children: "Close"
							}), isZohoConnected ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => {
									if (confirm("Disconnect Google Drive? Your files will remain but new uploads will save locally.")) {
										setGoogleAccessToken("");
										setZohoModalOpen(false);
									}
								},
								className: "gap-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 text-xs font-semibold h-9",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Unlink, { className: "h-4 w-4" }), " Disconnect"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								onClick: () => {
									setIsConnectingZoho(true);
									loginWithGoogle();
								},
								disabled: isConnectingZoho,
								className: "gap-2 rounded-xl bg-[#0F9D58] hover:bg-[#0B8043] text-white text-xs font-semibold h-9 min-w-[140px]",
								children: isConnectingZoho ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" }), " Connecting..."] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link2, { className: "h-4 w-4" }), " Connect to Google Drive"] })
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { FoldersPage as component };
