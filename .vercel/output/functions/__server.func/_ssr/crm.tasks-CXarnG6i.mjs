import { i as __toESM } from "../_runtime.mjs";
import { n as getAuth } from "./auth-B0Z-CWJL.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { t as useLocalStorage } from "./use-local-storage-C6y5r3WN.mjs";
import { I as Mail, O as Phone, T as Plus, Z as Funnel, _t as Circle, b as Sparkles, f as Trash2, gt as Clock, kt as CalendarDays, mt as CreditCard, n as X, rt as FileText, xt as CircleAlert, yt as CircleCheck, z as ListChecks } from "../_libs/lucide-react.mjs";
import { t as INITIAL_EMPLOYEES } from "./crm.employees-B3X2ArRi.mjs";
import { t as EmployeeProfileCard } from "./EmployeeProfileCard-DdSpIE3i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm.tasks-CXarnG6i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TASKS_LS_KEY = "crm_tasks_v2";
function loadTasks() {
	try {
		const r = localStorage.getItem(TASKS_LS_KEY);
		return r ? JSON.parse(r) : null;
	} catch {
		return null;
	}
}
function saveTasks(tasks) {
	localStorage.setItem(TASKS_LS_KEY, JSON.stringify(tasks));
}
var today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
var SEED = [];
var TYPE_ICONS = {
	Call: Phone,
	Email: Mail,
	Payment: CreditCard,
	Document: FileText,
	"Follow-up": CalendarDays,
	Other: CircleAlert
};
var TYPE_COLORS = {
	Call: "bg-blue-100   text-blue-700",
	Email: "bg-violet-100 text-violet-700",
	Payment: "bg-emerald-100 text-emerald-700",
	Document: "bg-amber-100  text-amber-700",
	"Follow-up": "bg-pink-100   text-pink-700",
	Other: "bg-slate-100  text-slate-600"
};
var TYPE_ACCENT = {
	Call: "border-l-blue-400",
	Email: "border-l-violet-400",
	Payment: "border-l-emerald-400",
	Document: "border-l-amber-400",
	"Follow-up": "border-l-pink-400",
	Other: "border-l-slate-400"
};
var PRIORITY_PILL = {
	High: "bg-red-100   text-red-700",
	Medium: "bg-amber-100 text-amber-700",
	Low: "bg-emerald-100 text-emerald-700"
};
var PRIORITY_DOT = {
	High: "bg-red-500",
	Medium: "bg-amber-500",
	Low: "bg-emerald-500"
};
var TASK_TYPES = [
	"Call",
	"Email",
	"Payment",
	"Document",
	"Follow-up",
	"Other"
];
var PRIORITIES = [
	"High",
	"Medium",
	"Low"
];
function formatDate(d) {
	return (/* @__PURE__ */ new Date(d + "T00:00:00")).toLocaleDateString("en-IN", {
		day: "numeric",
		month: "short",
		year: "numeric"
	});
}
function StatCard({ label, value, total, color, icon, onClick, active }) {
	const pct = total > 0 ? Math.round(value / total * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		onClick,
		className: `rounded-2xl border bg-card p-5 shadow-card transition-all duration-200 ${onClick ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 select-none" : ""} ${active ? "border-primary ring-2 ring-primary/20 scale-[1.01]" : "border-border"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `grid h-8 w-8 place-items-center rounded-xl ${color}`,
					children: icon
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-display text-4xl font-bold",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: `h-full rounded-full transition-all duration-700 ${color.replace(/bg-(\w+-\d+).*/, "bg-$1")}`,
					style: { width: `${pct}%` }
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1.5 text-xs text-muted-foreground",
				children: [pct, "% of total"]
			})
		]
	});
}
function formatNoteDate(isoString) {
	try {
		const d = new Date(isoString);
		if (isNaN(d.getTime())) return "";
		return d.toLocaleDateString("en-IN", {
			day: "numeric",
			month: "short",
			hour: "2-digit",
			minute: "2-digit",
			hour12: true
		}).replace(",", "");
	} catch {
		return "";
	}
}
function TaskCard({ task, isAdmin, onToggle, onDelete, onEditNote }) {
	const Icon = TYPE_ICONS[task.type];
	const isOverdue = task.status === "Pending" && task.dueDate < today;
	const isDone = task.status === "Done";
	const [isEditingNote, setIsEditingNote] = (0, import_react.useState)(false);
	const [editNoteText, setEditNoteText] = (0, import_react.useState)("");
	const allNotes = [task.note, ...task.notes || []].filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `
        group relative flex items-start gap-4 rounded-2xl border-l-4 border border-border bg-card
        px-4 py-4 shadow-card transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5
        ${isDone ? "opacity-55" : ""}
        ${isOverdue && !isDone ? "border-red-200 bg-red-50/30" : ""}
        ${!isOverdue && !isDone ? TYPE_ACCENT[task.type] : ""}
        ${isOverdue && !isDone ? "border-l-red-400" : ""}
        ${isDone ? "border-l-emerald-300" : ""}
      `,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				id: `toggle-${task.id}`,
				onClick: onToggle,
				className: "mt-0.5 shrink-0 transition-transform hover:scale-110 active:scale-95",
				"aria-label": isDone ? "Mark pending" : "Mark done",
				children: isDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 text-emerald-500" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-5 w-5 text-muted-foreground/60 hover:text-primary transition-colors" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold ${TYPE_COLORS[task.type]}`,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1 space-y-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-start gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `text-sm font-semibold leading-snug ${isDone ? "line-through text-muted-foreground" : ""}`,
								children: task.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${PRIORITY_PILL[task.priority]}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `inline-block h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[task.priority]}` }), task.priority]
							}),
							isOverdue && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 animate-pulse",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-3 w-3" }), " Overdue"]
							}),
							isDone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-3 w-3" }), " Done"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground",
						children: [task.lead && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1 font-medium text-foreground/70",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-primary/60" }), task.lead]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }), formatDate(task.dueDate)]
						})]
					}),
					allNotes.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 space-y-1.5 pl-2 border-l-2 border-border/80",
						children: allNotes.map((note, idx) => {
							const isString = typeof note === "string";
							const noteText = isString ? note : note.text;
							const noteTime = isString ? "" : formatNoteDate(note.createdAt);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-xs text-muted-foreground/80 italic leading-relaxed flex flex-wrap items-baseline gap-x-1.5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground/60",
										children: "•"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: noteText }),
									noteTime && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[10px] text-muted-foreground/50 not-italic font-medium",
										children: [
											"(",
											noteTime,
											")"
										]
									})
								]
							}, idx);
						})
					}),
					isEditingNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 w-full animate-in fade-in slide-in-from-top-2 duration-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							autoFocus: true,
							placeholder: "Add another detail or follow-up note...",
							value: editNoteText,
							onChange: (e) => setEditNoteText(e.target.value),
							rows: 2,
							className: "w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 mt-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								className: "h-7 text-xs rounded-full px-4",
								onClick: () => {
									setIsEditingNote(false);
									setEditNoteText("");
								},
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								className: "h-7 text-xs rounded-full px-4 text-white hover:opacity-90",
								style: { background: "var(--gradient-brand)" },
								onClick: () => {
									if (editNoteText.trim()) onEditNote(editNoteText.trim());
									setIsEditingNote(false);
									setEditNoteText("");
								},
								children: "Add"
							})]
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							setEditNoteText("");
							setIsEditingNote(true);
						},
						className: "text-xs text-blue-500 hover:text-blue-600 hover:underline mt-1.5 flex items-center gap-1",
						children: "+ Add Note"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 pt-3 border-t border-border border-dashed w-full block",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2",
							children: "Assigned To"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "scale-90 sm:scale-95 origin-top-left -mx-2 -mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeProfileCard, { employeeName: task.assignee })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: `hidden shrink-0 rounded-lg px-2 py-1 text-xs font-semibold sm:inline-block ${TYPE_COLORS[task.type]}`,
				children: task.type
			}),
			isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				id: `delete-${task.id}`,
				onClick: onDelete,
				className: "absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-red-100 hover:text-red-600 group-hover:opacity-100",
				"aria-label": "Delete task",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
			})
		]
	});
}
function AddTaskModal({ assignees, onClose, onAdd }) {
	const [form, setForm] = (0, import_react.useState)({
		title: "",
		type: "Call",
		priority: "Medium",
		assignee: assignees[0] || "Riya Bansal",
		dueDate: "",
		note: "",
		lead: ""
	});
	const titleRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		titleRef.current?.focus();
	}, []);
	const canSubmit = form.title.trim() !== "" && form.dueDate !== "";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm",
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-border bg-background shadow-2xl animate-float-up",
			style: { animationDuration: "0.25s" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-3 h-1 w-10 rounded-full bg-border sm:hidden" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between px-6 pt-5 pb-4 border-b border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-xl text-primary-foreground",
							style: { background: "var(--gradient-brand)" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-bold leading-tight",
							children: "New Task"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Add a call, reminder or follow-up"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						id: "close-modal-btn",
						onClick: onClose,
						className: "rounded-xl p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 px-6 pt-5 pb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mb-1.5 block text-sm font-semibold",
							children: ["Task title ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-red-500",
								children: "*"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							ref: titleRef,
							id: "task-title-input",
							placeholder: "e.g. Call Ananya about Bali visa",
							value: form.title,
							onChange: (e) => setForm((f) => ({
								...f,
								title: e.target.value
							})),
							onKeyDown: (e) => {
								if (e.key === "Enter" && canSubmit) onAdd(form);
							},
							className: "rounded-xl"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-2 block text-sm font-semibold",
							children: "Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: TASK_TYPES.map((t) => {
								const Ic = TYPE_ICONS[t];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setForm((f) => ({
										...f,
										type: t
									})),
									className: `flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${form.type === t ? `${TYPE_COLORS[t]} border-transparent shadow-sm` : "border-border bg-background text-muted-foreground hover:bg-secondary"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ic, { className: "h-3 w-3" }), t]
								}, t);
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-2 block text-sm font-semibold",
							children: "Priority"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex gap-2",
							children: PRIORITIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setForm((f) => ({
									...f,
									priority: p
								})),
								className: `flex items-center gap-1.5 rounded-xl border px-4 py-1.5 text-xs font-semibold transition-all ${form.priority === p ? `${PRIORITY_PILL[p]} border-transparent shadow-sm` : "border-border bg-background text-muted-foreground hover:bg-secondary"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[p]}` }), p]
							}, p))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-2 gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1.5 block text-sm font-semibold",
								children: "Assignee"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								id: "task-assignee-select",
								value: form.assignee,
								onChange: (e) => setForm((f) => ({
									...f,
									assignee: e.target.value
								})),
								className: "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow",
								children: assignees.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: a }, a))
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mb-1.5 block text-sm font-semibold",
								children: ["Due date ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "task-due-date-input",
								type: "date",
								value: form.dueDate,
								onChange: (e) => setForm((f) => ({
									...f,
									dueDate: e.target.value
								})),
								className: "rounded-xl"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mb-1.5 block text-sm font-semibold",
							children: ["Lead / Customer ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground font-normal",
								children: "(optional)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "task-lead-input",
							placeholder: "e.g. Ananya Verma",
							value: form.lead,
							onChange: (e) => setForm((f) => ({
								...f,
								lead: e.target.value
							})),
							className: "rounded-xl"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mb-1.5 block text-sm font-semibold",
							children: ["Note ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground font-normal",
								children: "(optional)"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							id: "task-note-input",
							placeholder: "Context or reminder details...",
							value: form.note,
							onChange: (e) => setForm((f) => ({
								...f,
								note: e.target.value
							})),
							rows: 2,
							className: "w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "flex-1 rounded-xl",
								onClick: onClose,
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								id: "submit-task-btn",
								className: "flex-1 gap-2 rounded-xl",
								style: { background: canSubmit ? "var(--gradient-brand)" : void 0 },
								onClick: () => canSubmit && onAdd(form),
								disabled: !canSubmit,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Task"]
							})]
						})
					]
				})
			]
		})
	});
}
function Pill({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick,
		className: `rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${active ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"}`,
		children
	});
}
function TasksPage() {
	const [tasks, setTasks] = (0, import_react.useState)(() => loadTasks() ?? SEED);
	const [localEmployees] = useLocalStorage("crm_employees_v3", INITIAL_EMPLOYEES);
	const employees = localEmployees?.length ? localEmployees : INITIAL_EMPLOYEES;
	const auth = getAuth();
	const assignees = Array.from(new Set([
		...employees.map((e) => e.name),
		...auth?.name ? [auth.name] : [],
		"Other"
	]));
	const isAdmin = auth?.role === "admin" || auth?.role === "HR & Admin Manager";
	const userAssigneeName = auth?.name || "";
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [deleteConfirmId, setDeleteConfirmId] = (0, import_react.useState)(null);
	const [filterStatus, setFilterStatus] = (0, import_react.useState)("All");
	const [filterPriority, setFilterPriority] = (0, import_react.useState)("All");
	const [filterType, setFilterType] = (0, import_react.useState)("All");
	const [filterAssignee, setFilterAssignee] = (0, import_react.useState)("All");
	(0, import_react.useEffect)(() => {
		saveTasks(tasks);
	}, [tasks]);
	const addTask = (formData) => {
		const id = `T-${String(Date.now()).slice(-4)}`;
		setTasks((prev) => [{
			...formData,
			id,
			status: "Pending"
		}, ...prev]);
		setShowModal(false);
	};
	const visibleTasks = isAdmin ? tasks : tasks.filter((t) => t.assignee.toLowerCase() === userAssigneeName.toLowerCase());
	const filtered = visibleTasks.filter((t) => {
		if (filterStatus === "Overdue") {
			if (t.status !== "Pending" || t.dueDate >= today) return false;
		} else if (filterStatus !== "All" && t.status !== filterStatus) return false;
		if (filterPriority !== "All" && t.priority !== filterPriority) return false;
		if (filterType !== "All" && t.type !== filterType) return false;
		if (isAdmin && filterAssignee !== "All" && t.assignee !== filterAssignee) return false;
		return true;
	});
	const pending = visibleTasks.filter((t) => t.status === "Pending").length;
	const done = visibleTasks.filter((t) => t.status === "Done").length;
	const overdue = visibleTasks.filter((t) => t.status === "Pending" && t.dueDate < today).length;
	const total = visibleTasks.length;
	(0, import_react.useEffect)(() => {
		const handler = (e) => {
			if (e.key === "n" && !showModal && e.target.tagName !== "INPUT" && e.target.tagName !== "TEXTAREA") setShowModal(true);
			if (e.key === "Escape" && showModal) setShowModal(false);
		};
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [showModal, isAdmin]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-bold",
						children: "Tasks & Follow-ups"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Manage calls, emails and payment reminders."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						id: "add-task-btn",
						onClick: () => setShowModal(true),
						className: "gap-2 rounded-xl px-5",
						style: { background: "var(--gradient-brand)" },
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Task"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Pending",
							value: pending,
							total,
							color: "bg-amber-100  text-amber-600",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
							onClick: () => setFilterStatus(filterStatus === "Pending" ? "All" : "Pending"),
							active: filterStatus === "Pending"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Completed",
							value: done,
							total,
							color: "bg-emerald-100 text-emerald-600",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }),
							onClick: () => setFilterStatus(filterStatus === "Done" ? "All" : "Done"),
							active: filterStatus === "Done"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Overdue",
							value: overdue,
							total,
							color: "bg-red-100    text-red-600",
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4" }),
							onClick: () => setFilterStatus(filterStatus === "Overdue" ? "All" : "Overdue"),
							active: filterStatus === "Overdue"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-2xl border border-border bg-card p-4 shadow-card",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-3.5 w-3.5 shrink-0 text-muted-foreground" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								active: filterStatus === "All",
								onClick: () => setFilterStatus("All"),
								children: "All"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								active: filterStatus === "Pending",
								onClick: () => setFilterStatus("Pending"),
								children: "⏳ Pending"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								active: filterStatus === "Done",
								onClick: () => setFilterStatus("Done"),
								children: "✅ Done"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								active: filterStatus === "Overdue",
								onClick: () => setFilterStatus("Overdue"),
								children: "🚨 Overdue"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-1 h-4 w-px bg-border" }),
							PRIORITIES.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pill, {
								active: filterPriority === p,
								onClick: () => setFilterPriority(filterPriority === p ? "All" : p),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `mr-1 inline-block h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[p]}` }), p]
							}, p)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-1 h-4 w-px bg-border" }),
							TASK_TYPES.map((t) => {
								const Ic = TYPE_ICONS[t];
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Pill, {
									active: filterType === t,
									onClick: () => setFilterType(filterType === t ? "All" : t),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ic, { className: "mr-1 inline h-3 w-3" }), t]
								}, t);
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "mx-1 h-4 w-px bg-border" }),
							isAdmin && assignees.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pill, {
								active: filterAssignee === a,
								onClick: () => setFilterAssignee(filterAssignee === a ? "All" : a),
								children: a.split(" ")[0]
							}, a)),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-auto text-xs text-muted-foreground",
								children: [
									filtered.length,
									" task",
									filtered.length !== 1 ? "s" : ""
								]
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2.5",
					children: filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid min-h-[28vh] place-items-center rounded-2xl border border-dashed border-border bg-card p-10 text-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ListChecks, { className: "mx-auto h-12 w-12 text-primary/25" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 font-semibold text-foreground/70",
								children: "All clear here!"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-muted-foreground",
								children: "No tasks match the current filters."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								className: "mt-4 rounded-xl",
								onClick: () => {
									setFilterStatus("All");
									setFilterPriority("All");
									setFilterType("All");
								},
								children: "Clear filters"
							})
						] })
					}) : filtered.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskCard, {
						task: t,
						isAdmin,
						onToggle: () => {
							const newTasks = tasks.map((x) => x.id === t.id ? {
								...x,
								status: x.status === "Pending" ? "Done" : "Pending"
							} : x);
							setTasks(newTasks);
							saveTasks(newTasks);
						},
						onEditNote: (newNote) => {
							const newTasks = tasks.map((x) => {
								if (x.id === t.id) {
									const currentNotes = x.notes || [];
									return {
										...x,
										notes: [...currentNotes, {
											text: newNote,
											createdAt: (/* @__PURE__ */ new Date()).toISOString()
										}]
									};
								}
								return x;
							});
							setTasks(newTasks);
							saveTasks(newTasks);
						},
						onDelete: () => {
							setDeleteConfirmId(t.id);
						}
					}, t.id))
				}),
				filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3.5 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 shrink-0 text-primary" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-2 w-full overflow-hidden rounded-full bg-border",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-full rounded-full transition-all duration-700",
									style: {
										width: `${total > 0 ? Math.round(done / total * 100) : 0}%`,
										background: "var(--gradient-brand)"
									}
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "shrink-0 text-xs font-semibold text-muted-foreground",
							children: [
								done,
								"/",
								total,
								" tasks completed"
							]
						})
					]
				})
			]
		}),
		showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddTaskModal, {
			assignees,
			onClose: () => setShowModal(false),
			onAdd: addTask
		}),
		deleteConfirmId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl animate-in zoom-in-95",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl font-bold font-display text-foreground",
						children: "Delete Task?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Are you sure you want to delete this task? This action cannot be undone."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex justify-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setDeleteConfirmId(null),
							className: "rounded-xl",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "destructive",
							onClick: () => {
								const newTasks = tasks.filter((x) => x.id !== deleteConfirmId);
								setTasks(newTasks);
								saveTasks(newTasks);
								setDeleteConfirmId(null);
							},
							className: "rounded-xl",
							children: "Delete"
						})]
					})
				]
			})
		})
	] });
}
//#endregion
export { TasksPage as component };
