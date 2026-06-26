import { i as __toESM } from "../_runtime.mjs";
import { n as getAuth } from "./auth-B0Z-CWJL.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { t as useLocalStorage } from "./use-local-storage-C6y5r3WN.mjs";
import { A as Pen, C as Search, N as Package, Pt as Briefcase, T as Plus, f as Trash2, ft as Download, g as Star, gt as Clock, h as Table2, j as Paperclip, m as Tag, ot as FileImage, r as Users, rt as FileText, s as Upload } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BvYONHWJ.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { n as SEED_PACKAGES } from "./crm.packages-CdSm2AnR.mjs";
import { t as EmployeeProfileCard } from "./EmployeeProfileCard-DdSpIE3i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm.packages-BlYnADB-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ALL_TAGS = [
	"All",
	"Family",
	"Adventure",
	"Beach",
	"Scenic",
	"Trekking",
	"Honeymoon",
	"Cultural",
	"Luxury"
];
var TAG_COLORS = {
	Family: "bg-blue-50 text-blue-700 border-blue-100",
	Adventure: "bg-orange-50 text-orange-700 border-orange-100",
	Beach: "bg-cyan-50 text-cyan-700 border-cyan-100",
	Scenic: "bg-teal-50 text-teal-700 border-teal-100",
	Trekking: "bg-lime-50 text-lime-700 border-lime-100",
	Honeymoon: "bg-pink-50 text-pink-700 border-pink-100",
	Cultural: "bg-amber-50 text-amber-700 border-amber-100",
	Luxury: "bg-purple-50 text-purple-700 border-purple-100"
};
var EMPTY = {
	title: "",
	nights: "",
	img: "",
	price: "",
	priceNum: 0,
	tag: "Family",
	incl: [],
	destination: "",
	description: "",
	active: true,
	assignedTo: "Pushplata Kriplani"
};
function PackagesPage() {
	const isAdmin = getAuth()?.role === "admin";
	const [packages, setPackages] = useLocalStorage("crm_packages", SEED_PACKAGES);
	const [q, setQ] = (0, import_react.useState)("");
	const [filterTag, setFilterTag] = (0, import_react.useState)("All");
	const [isFormOpen, setIsFormOpen] = (0, import_react.useState)(false);
	const [editingPkg, setEditingPkg] = (0, import_react.useState)(null);
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const [isExportOpen, setIsExportOpen] = (0, import_react.useState)(false);
	const [inclInput, setInclInput] = (0, import_react.useState)("");
	const [localForm, setLocalForm] = (0, import_react.useState)(EMPTY);
	const [managingFilesPkg, setManagingFilesPkg] = (0, import_react.useState)(null);
	const [isFilesOpen, setIsFilesOpen] = (0, import_react.useState)(false);
	const [uploadFile, setUploadFile] = (0, import_react.useState)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const form = localForm;
	const setForm = setLocalForm;
	const filtered = packages.filter((p) => {
		const matchTag = filterTag === "All" || p.tag === filterTag;
		const matchQ = q === "" || p.title.toLowerCase().includes(q.toLowerCase()) || p.destination.toLowerCase().includes(q.toLowerCase()) || p.tag.toLowerCase().includes(q.toLowerCase());
		return matchTag && matchQ;
	});
	function getFileIcon(type, name) {
		const lowercaseName = name.toLowerCase();
		if (type === "application/pdf" || lowercaseName.endsWith(".pdf")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-rose-500" });
		if (type.includes("sheet") || type.includes("excel") || lowercaseName.endsWith(".xlsx") || lowercaseName.endsWith(".xls") || lowercaseName.endsWith(".csv")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table2, { className: "h-4 w-4 text-emerald-500" });
		if (type.includes("word") || type.includes("document") || lowercaseName.endsWith(".docx") || lowercaseName.endsWith(".doc")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4 text-blue-500" });
		if (type.startsWith("image/")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileImage, { className: "h-4 w-4 text-purple-500" });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-gray-400" });
	}
	function fmtSize(bytes) {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
	}
	function readAsDataUrl(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}
	const handleAddFile = async (e) => {
		e.preventDefault();
		if (!uploadFile || !managingFilesPkg) return;
		setUploading(true);
		try {
			const dataUrl = await readAsDataUrl(uploadFile);
			const newFile = {
				name: uploadFile.name,
				size: uploadFile.size,
				type: uploadFile.type || "application/octet-stream",
				uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
				dataUrl
			};
			const updatedPkg = {
				...managingFilesPkg,
				files: [...managingFilesPkg.files || [], newFile]
			};
			setPackages((prev) => prev.map((p) => p.id === managingFilesPkg.id ? updatedPkg : p));
			setManagingFilesPkg(updatedPkg);
			setUploadFile(null);
			const fileInput = document.getElementById("pkg-doc-file");
			if (fileInput) fileInput.value = "";
		} catch (err) {
			console.error("File upload failed", err);
		} finally {
			setUploading(false);
		}
	};
	const handleDeleteFile = (fileName) => {
		if (!managingFilesPkg) return;
		const updatedPkg = {
			...managingFilesPkg,
			files: (managingFilesPkg.files || []).filter((f) => f.name !== fileName)
		};
		setPackages((prev) => prev.map((p) => p.id === managingFilesPkg.id ? updatedPkg : p));
		setManagingFilesPkg(updatedPkg);
	};
	const openAdd = () => {
		setEditingPkg(null);
		setForm(EMPTY);
		setInclInput("");
		setIsFormOpen(true);
	};
	const openEdit = (pkg) => {
		setEditingPkg(pkg);
		setForm({ ...pkg });
		setInclInput(pkg.incl.join(", "));
		setIsFormOpen(true);
	};
	const handleSave = (e) => {
		e.preventDefault();
		const inclArr = inclInput.split(",").map((s) => s.trim()).filter(Boolean);
		const priceNum = parseInt(form.price.replace(/[^\d]/g, "")) || 0;
		const formatted = form.price.startsWith("₹") ? form.price : `₹${Number(priceNum).toLocaleString("en-IN")}`;
		if (editingPkg) setPackages((prev) => prev.map((p) => p.id === editingPkg.id ? {
			...p,
			...form,
			incl: inclArr,
			priceNum,
			price: formatted
		} : p));
		else {
			const newPkg = {
				id: `PKG-${(packages.length + 1).toString().padStart(3, "0")}`,
				...form,
				incl: inclArr,
				priceNum,
				price: formatted
			};
			setPackages((prev) => [newPkg, ...prev]);
		}
		setIsFormOpen(false);
	};
	const handleDelete = () => {
		if (!deleteTarget) return;
		setPackages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
		setDeleteTarget(null);
	};
	const toggleActive = (id) => {
		setPackages((prev) => prev.map((p) => p.id === id ? {
			...p,
			active: !p.active
		} : p));
	};
	const exportToExcel = () => {
		const rows = [[
			"ID",
			"Title",
			"Destination",
			"Nights",
			"Price",
			"Tag",
			"Includes",
			"Active"
		].join(","), ...filtered.map((p) => [
			`"${p.id}"`,
			`"${p.title.replace(/"/g, "\"\"")}"`,
			`"${p.destination}"`,
			`"${p.nights}"`,
			`"${p.price}"`,
			`"${p.tag}"`,
			`"${p.incl.join("; ")}"`,
			p.active ? "Yes" : "No"
		].join(","))];
		const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `packages_export_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};
	const exportToWord = () => {
		const html = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'><head><title>Packages Export</title><style>table{border-collapse:collapse;width:100%;font-family:Arial}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f2f2f2}</style></head><body><h2>Grand Journeys CRM - Package Catalog</h2><table><tr><th>ID</th><th>Title</th><th>Destination</th><th>Nights</th><th>Price</th><th>Tag</th><th>Includes</th></tr>${filtered.map((p) => `<tr><td>${p.id}</td><td>${p.title}</td><td>${p.destination}</td><td>${p.nights}</td><td>${p.price}</td><td>${p.tag}</td><td>${p.incl.join(", ")}</td></tr>`).join("")}</table></body></html>`;
		const blob = new Blob([html], { type: "application/msword" });
		const a = document.createElement("a");
		a.href = URL.createObjectURL(blob);
		a.download = `packages_export_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.doc`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
	};
	const exportToPDF = () => {
		const win = window.open("", "_blank");
		if (!win) return;
		const th = "<tr><th>ID</th><th>Title</th><th>Destination</th><th>Duration</th><th>Price</th><th>Tag</th><th>Includes</th></tr>";
		const rows = filtered.map((p) => `<tr><td>${p.id}</td><td>${p.title}</td><td>${p.destination}</td><td>${p.nights}</td><td>${p.price}</td><td>${p.tag}</td><td>${p.incl.join(", ")}</td></tr>`).join("");
		win.document.write(`<html><head><title>Package Catalog PDF</title><style>body{font-family:sans-serif;padding:20px;color:#333}h2{color:#f43f5e}p{font-size:12px;color:#666;margin-bottom:20px}table{border-collapse:collapse;width:100%;font-size:11px}th,td{border:1px solid #ddd;padding:6px;text-align:left}th{background:#f9fafb;font-weight:bold}tr:nth-child(even){background:#f3f4f6}</style></head><body><h2>Grand Journeys CRM — Package Catalog</h2><p>Generated on ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")} | Packages: ${filtered.length}</p><table><thead>${th}</thead><tbody>${rows}</tbody></table><script>window.onload=function(){window.print();window.onafterprint=function(){window.close();}}<\/script></body></html>`);
		win.document.close();
	};
	const activeCount = packages.filter((p) => p.active).length;
	const avgPrice = packages.length ? Math.round(packages.reduce((s, p) => s + p.priceNum, 0) / packages.length) : 0;
	const topTag = (() => {
		const count = {};
		packages.forEach((p) => {
			count[p.tag] = (count[p.tag] || 0) + 1;
		});
		return Object.entries(count).sort((a, b) => b[1] - a[1])[0]?.[0] || "—";
	})();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-bold",
					children: "Package Catalog"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Manage holiday packages synced with LookMyHolidays."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2 flex-wrap",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						className: "gap-2 rounded-xl",
						onClick: () => setIsExportOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Export"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "btn-hero gap-2",
						onClick: openAdd,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New Package"]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 sm:grid-cols-4 gap-4",
				children: [
					{
						label: "Total Packages",
						value: packages.length,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-5 w-5" }),
						color: "text-primary bg-primary/10"
					},
					{
						label: "Active Packages",
						value: activeCount,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-5 w-5" }),
						color: "text-emerald-600 bg-emerald-50"
					},
					{
						label: "Avg. Price",
						value: `₹${avgPrice.toLocaleString("en-IN")}`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-5 w-5" }),
						color: "text-amber-600 bg-amber-50"
					},
					{
						label: "Top Category",
						value: topTag,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-5 w-5" }),
						color: "text-purple-600 bg-purple-50"
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: `inline-grid h-10 w-10 place-items-center rounded-xl ${s.color}`,
							children: s.icon
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-2xl font-bold",
							children: s.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: s.label
						})
					]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-3 items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 min-w-[200px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search packages, destinations, tags…",
						value: q,
						onChange: (e) => setQ(e.target.value),
						className: "pl-9 rounded-xl"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 flex-wrap",
					children: ALL_TAGS.map((tag) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setFilterTag(tag),
						className: `px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${filterTag === tag ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card text-muted-foreground hover:border-primary/40"}`,
						children: tag
					}, tag))
				})]
			}),
			filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-12 w-12 opacity-30" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm",
					children: "No packages match your search."
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5",
				children: filtered.map((pkg) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card hover:shadow-premium hover:-translate-y-1 transition-all duration-300 ${!pkg.active ? "opacity-60" : ""}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative h-44 overflow-hidden bg-secondary/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: pkg.img,
								alt: pkg.title,
								className: "h-full w-full object-cover transition-transform duration-500 group-hover:scale-105",
								onError: (e) => {
									e.target.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=60";
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `absolute top-3 left-3 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold backdrop-blur-sm ${TAG_COLORS[pkg.tag] || "bg-gray-50 text-gray-600 border-gray-100"}`,
								children: pkg.tag
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => toggleActive(pkg.id),
								title: pkg.active ? "Deactivate" : "Activate",
								className: `absolute top-3 right-3 h-6 w-11 rounded-full border transition-all ${pkg.active ? "bg-emerald-500 border-emerald-400" : "bg-gray-300 border-gray-200"}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `block h-4 w-4 rounded-full bg-white shadow transition-transform mx-1 ${pkg.active ? "translate-x-5" : "translate-x-0"}` })
							}),
							pkg.files && pkg.files.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "absolute bottom-3 left-3 inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50/90 px-2 py-0.5 text-[9px] font-bold text-blue-700 backdrop-blur-sm shadow-sm",
								children: [
									"📁 ",
									pkg.files.length,
									" file",
									pkg.files.length !== 1 ? "s" : ""
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-col gap-2 p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-start justify-between gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-display font-bold text-base leading-tight",
									children: pkg.title
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "flex items-center gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), pkg.nights]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate",
									children: pkg.destination
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground line-clamp-2",
								children: pkg.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap gap-1 mt-1 mb-2",
								children: [pkg.incl.slice(0, 3).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-md bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-foreground",
									children: i
								}, i)), pkg.incl.length > 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "rounded-md bg-secondary/60 px-2 py-0.5 text-[10px] font-medium text-muted-foreground",
									children: [
										"+",
										pkg.incl.length - 3,
										" more"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-auto pt-2 border-t border-border border-dashed",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2",
									children: "Package Manager"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "scale-90 origin-left -mx-2 -mt-1",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeProfileCard, { employeeName: pkg.assignedTo || "Pushplata Kriplani" })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-2 flex items-center justify-between pt-3 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-bold text-primary text-lg",
									children: pkg.price
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												setManagingFilesPkg(pkg);
												setIsFilesOpen(true);
											},
											className: "rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
											title: "Manage Attachments",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-3.5 w-3.5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => openEdit(pkg),
											className: "rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
											title: "Edit",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3.5 w-3.5" })
										}),
										isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setDeleteTarget(pkg),
											className: "rounded-lg p-1.5 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors",
											title: "Delete (Admin only)",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
										})
									]
								})]
							})
						]
					})]
				}, pkg.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isFormOpen,
				onOpenChange: setIsFormOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
						className: "font-display text-lg font-bold flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-5 w-5 text-primary" }), editingPkg ? "Edit Package" : "Add New Package"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
						className: "text-xs text-muted-foreground",
						children: editingPkg ? `Editing: ${editingPkg.title}` : "Fill in details to add a new holiday package to the catalog."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSave,
						className: "space-y-4 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pkg-title",
										children: "Package Title *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "pkg-title",
										required: true,
										placeholder: "e.g. Bali Honeymoon Escape",
										value: form.title,
										onChange: (e) => setForm({
											...form,
											title: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pkg-dest",
										children: "Destination *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "pkg-dest",
										required: true,
										placeholder: "e.g. Bali, Indonesia",
										value: form.destination,
										onChange: (e) => setForm({
											...form,
											destination: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pkg-nights",
										children: "Duration *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "pkg-nights",
										required: true,
										placeholder: "e.g. 6N / 7D",
										value: form.nights,
										onChange: (e) => setForm({
											...form,
											nights: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pkg-price",
										children: "Price (₹) *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "pkg-price",
										required: true,
										placeholder: "e.g. ₹64,999",
										value: form.price,
										onChange: (e) => setForm({
											...form,
											price: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pkg-tag",
										children: "Category *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										id: "pkg-tag",
										value: form.tag,
										onChange: (e) => setForm({
											...form,
											tag: e.target.value
										}),
										className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
										children: ALL_TAGS.filter((t) => t !== "All").map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: t,
											children: t
										}, t))
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pkg-img",
										children: "Image URL"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "pkg-img",
										placeholder: "https://images.unsplash.com/…",
										value: form.img,
										onChange: (e) => setForm({
											...form,
											img: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pkg-incl",
										children: "Inclusions (comma separated)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "pkg-incl",
										placeholder: "e.g. Hotel, Flights, Spa, Meals",
										value: inclInput,
										onChange: (e) => setInclInput(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pkg-assigned",
										children: "Package Manager"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										id: "pkg-assigned",
										value: form.assignedTo || "Pushplata Kriplani",
										onChange: (e) => setForm({
											...form,
											assignedTo: e.target.value
										}),
										className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Suman Yadav",
												children: "Suman Yadav"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Nikita Bairwa",
												children: "Nikita Bairwa"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Pushplata Kriplani",
												children: "Pushplata Kriplani"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "AMAN SHARMA",
												children: "AMAN SHARMA"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Deepak Kumar",
												children: "Deepak Kumar"
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pkg-desc",
										children: "Description"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										id: "pkg-desc",
										rows: 3,
										placeholder: "Short description of the package…",
										value: form.description,
										onChange: (e) => setForm({
											...form,
											description: e.target.value
										}),
										className: "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 col-span-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										id: "pkg-active",
										checked: form.active,
										onChange: (e) => setForm({
											...form,
											active: e.target.checked
										}),
										className: "h-4 w-4 rounded border-input accent-primary"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "pkg-active",
										className: "cursor-pointer",
										children: "Active (visible on website)"
									})]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "pt-4 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								className: "rounded-xl",
								onClick: () => setIsFormOpen(false),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "rounded-xl",
								children: editingPkg ? "Save Changes" : "Add Package"
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!deleteTarget,
				onOpenChange: () => setDeleteTarget(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-sm rounded-2xl border border-border bg-card shadow-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-lg font-bold text-red-600",
						children: "Delete Package?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "text-sm text-muted-foreground",
						children: [
							"Are you sure you want to delete ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [
								"\"",
								deleteTarget?.title,
								"\""
							] }),
							"? This action cannot be undone."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "gap-2 pt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "rounded-xl",
							onClick: () => setDeleteTarget(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							className: "rounded-xl bg-red-600 hover:bg-red-700 text-white",
							onClick: handleDelete,
							children: "Yes, Delete"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isExportOpen,
				onOpenChange: setIsExportOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-display text-lg font-bold",
							children: "Export Packages"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "text-xs text-muted-foreground mt-1",
							children: [
								"Export the current list of ",
								filtered.length,
								" packages in your preferred file format."
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-3 py-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										exportToPDF();
										setIsExportOpen(false);
									},
									className: "flex flex-col items-center justify-center gap-2 rounded-xl border border-border p-4 hover:border-rose-300 hover:bg-rose-50/50 hover:text-rose-600 transition-all text-center group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-10 w-10 place-items-center rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-100",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold",
										children: "PDF Report"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										exportToExcel();
										setIsExportOpen(false);
									},
									className: "flex flex-col items-center justify-center gap-2 rounded-xl border border-border p-4 hover:border-emerald-300 hover:bg-emerald-50/50 hover:text-emerald-600 transition-all text-center group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-10 w-10 place-items-center rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table2, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold",
										children: "Excel (CSV)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										exportToWord();
										setIsExportOpen(false);
									},
									className: "flex flex-col items-center justify-center gap-2 rounded-xl border border-border p-4 hover:border-blue-300 hover:bg-blue-50/50 hover:text-blue-600 transition-all text-center group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-5 w-5" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs font-semibold",
										children: "Word (.doc)"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
							className: "border-t border-border pt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								className: "rounded-xl",
								onClick: () => setIsExportOpen(false),
								children: "Cancel"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isFilesOpen,
				onOpenChange: setIsFilesOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl border border-border p-6 shadow-2xl bg-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "font-display text-lg font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Paperclip, { className: "h-5 w-5 text-primary" }), "Manage Package Files"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground mt-1",
							children: "Upload itineraries (PDF), brochures, photos (JPG/PNG) or pricing details for this package."
						})] }),
						managingFilesPkg && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6 py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-secondary/20 p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-[10px] font-bold text-primary",
											children: managingFilesPkg.id
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
											className: "font-bold text-sm text-foreground mt-1",
											children: managingFilesPkg.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground mt-0.5",
											children: [
												managingFilesPkg.destination,
												" • ",
												managingFilesPkg.nights
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleAddFile,
									className: "space-y-3 border-t border-border pt-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Attach File"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "pkg-doc-file",
											type: "file",
											required: true,
											accept: ".pdf,.jpg,.jpeg,.png,.gif,.xls,.xlsx,.doc,.docx",
											onChange: (e) => setUploadFile(e.target.files?.[0] || null),
											className: "h-9 text-xs rounded-lg cursor-pointer"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "submit",
											disabled: uploading || !uploadFile,
											className: "w-full h-9 rounded-lg text-xs gap-1.5",
											style: { background: "var(--gradient-brand)" },
											children: [uploading ? "Uploading..." : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), uploading ? "Uploading..." : "Upload File"]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t border-border pt-4 space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h5", {
										className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground",
										children: "Attached Documents & Images"
									}), !managingFilesPkg.files || managingFilesPkg.files.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-center py-6 text-xs text-muted-foreground border border-dashed rounded-xl p-4 bg-secondary/15",
										children: "No files attached. Upload itineraries, flight details or maps."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2 max-h-48 overflow-y-auto pr-1",
										children: managingFilesPkg.files.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between rounded-xl border border-border p-3 bg-secondary/10 hover:bg-secondary/20 transition-all text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2.5 min-w-0 flex-1",
												children: [getFileIcon(file.type, file.name), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0 flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-semibold truncate text-foreground",
														children: file.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] text-muted-foreground",
														children: fmtSize(file.size)
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5 ml-3 shrink-0",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
													href: file.dataUrl,
													download: file.name,
													className: "rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
													title: "Download file",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => handleDeleteFile(file.name),
													className: "rounded-lg p-1 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors",
													title: "Delete file",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
												})]
											})]
										}, file.name))
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, {
							className: "border-t border-border pt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								className: "rounded-xl",
								onClick: () => setIsFilesOpen(false),
								children: "Close"
							})
						})
					]
				})
			})
		]
	});
}
//#endregion
export { PackagesPage as component };
