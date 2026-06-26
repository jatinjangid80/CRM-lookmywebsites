import { i as __toESM } from "../_runtime.mjs";
import { n as getAuth } from "./auth-B0Z-CWJL.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { t as useLocalStorage } from "./use-local-storage-C6y5r3WN.mjs";
import { C as Send, D as Play, Dt as Check, E as Plus, Et as ChevronDown, L as Mail, Lt as Award, Y as Heart, _t as Clock, a as UserCog, bt as CircleCheck, f as Trash2, g as Star, i as User, it as FileText, jt as CalendarCheck, k as Phone, n as X, o as UserCheck, ot as FilePenLine, pt as Download, s as Upload, u as TrendingUp, v as Square, w as Search, wt as ChevronUp, x as Shield, xt as CircleCheckBig, y as SquarePen } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-BvYONHWJ.mjs";
import { n as createDefaultEmployeeDetails, t as INITIAL_EMPLOYEE_DETAILS } from "./employee-profile-defaults-wd6GGcin.mjs";
import { t as EmployeeProfileModal } from "./EmployeeProfileModal-C91jDn03.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { t as INITIAL_EMPLOYEES } from "./crm.employees-CDZEcDLI.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm.employees-CuOR4uS8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EditField({ label, value, onChange, type = "text" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type,
			value: value || "",
			onChange: (e) => onChange(e.target.value),
			className: "h-8 text-xs focus-visible:ring-[#FF6B00]"
		})]
	});
}
function EditSelect({ label, value, options, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
			className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
			value,
			onChange: (e) => onChange(e.target.value),
			className: "flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring",
			children: options.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: opt,
				children: opt
			}, opt))
		})]
	});
}
var ROLE_COLOR = {
	"Operations Manager": "bg-primary/15 text-primary",
	"Travel Consultant": "bg-blue-100 text-blue-700",
	"Visa Executive": "bg-violet-100 text-violet-700",
	"Accounts": "bg-amber-100 text-amber-700",
	"Marketing": "bg-pink-100 text-pink-700",
	"Sales Executive": "bg-indigo-100 text-indigo-700",
	"Executive": "bg-teal-100 text-teal-700",
	"HR & Admin Manager": "bg-rose-100 text-rose-700",
	"Accounts Manager": "bg-amber-100 text-amber-700"
};
var STATUS_COLOR = {
	Active: "bg-emerald-100 text-emerald-700",
	"On Leave": "bg-amber-100 text-amber-700",
	Inactive: "bg-slate-100 text-slate-500"
};
var formatINR = (n) => new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 0
}).format(n);
function StarRating({ rating }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		children: [[
			1,
			2,
			3,
			4,
			5
		].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-3 w-3 ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-border"}` }, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "ml-1 text-xs font-semibold",
			children: rating.toFixed(1)
		})]
	});
}
var DEFAULT_LEAVES = [
	{
		id: "LV-01",
		empId: "LMH-02",
		empName: "Nikita Bairwa",
		type: "Sick Leave",
		fromDate: "2026-06-25",
		toDate: "2026-06-26",
		reason: "Fever and high body temp",
		status: "Pending"
	},
	{
		id: "LV-02",
		empId: "LMH-03",
		empName: "Pushplata Kriplani",
		type: "Casual Leave",
		fromDate: "2026-07-02",
		toDate: "2026-07-03",
		reason: "Attending cousin's wedding",
		status: "Approved"
	},
	{
		id: "LV-03",
		empId: "LMH-04",
		empName: "AMAN SHARMA",
		type: "Earned Leave",
		fromDate: "2026-07-10",
		toDate: "2026-07-15",
		reason: "Summer vacation with family",
		status: "Pending"
	}
];
var DEFAULT_FEEDS = [
	{
		id: "feed-1",
		user: "Manvendra Singhal",
		avatar: "/avatars/manvendra.png",
		role: "HR & Admin Manager",
		content: "📣 Welcome to our new HRMS dashboard! Now you can clock in/out, view your profile details, apply for leaves, and track tasks directly inside the Employees portal.",
		date: "2026-06-19T10:00:00.000Z",
		likes: 5,
		likedBy: []
	},
	{
		id: "feed-2",
		user: "Nikita Bairwa",
		avatar: "/avatars/nikita.jpeg",
		role: "Sales Executive",
		content: "🎉 Closed a customized package for Dubai (4 Pax, 5 Nights)! Big thanks to the team for support.",
		date: "2026-06-18T14:30:00.000Z",
		likes: 8,
		likedBy: []
	},
	{
		id: "feed-3",
		user: "Deepak Kumar",
		avatar: "/avatars/deepak.jpeg",
		role: "Visa Executive",
		content: "🚀 Submitted Schengen visa files for our premium group travelers today! Fingers crossed.",
		date: "2026-06-17T09:15:00.000Z",
		likes: 4,
		likedBy: []
	}
];
var DEFAULT_FILES = [
	{
		id: "file-1",
		name: "Employee_Handbook_2026.pdf",
		size: "1.2 MB",
		date: "2026-01-10",
		uploader: "Manvendra Singhal"
	},
	{
		id: "file-2",
		name: "Travel_Expense_Guidelines.pdf",
		size: "840 KB",
		date: "2026-02-15",
		uploader: "Manvendra Singhal"
	},
	{
		id: "file-3",
		name: "Leave_Policy_Manual.pdf",
		size: "620 KB",
		date: "2026-03-01",
		uploader: "Manvendra Singhal"
	},
	{
		id: "file-4",
		name: "Company_Holidays_2026.pdf",
		size: "450 KB",
		date: "2026-01-05",
		uploader: "Manvendra Singhal"
	}
];
var DEFAULT_TIMELOGS = [
	{
		id: "log-1",
		project: "Grand Journeys Itinerary",
		task: "Dubai Hotel & Flight selection",
		hours: 4,
		date: "2026-06-19",
		employee: "Nikita Bairwa"
	},
	{
		id: "log-2",
		project: "Visa Processing",
		task: "Schengen Documents Review",
		hours: 3.5,
		date: "2026-06-19",
		employee: "Deepak Kumar"
	},
	{
		id: "log-3",
		project: "Accounts Reconciliation",
		task: "GST filings & payroll prep",
		hours: 6,
		date: "2026-06-19",
		employee: "AMAN SHARMA"
	}
];
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
function EmployeeTaskCard({ task, isAdmin, onToggle, onEditNote }) {
	const [isEditingNote, setIsEditingNote] = (0, import_react.useState)(false);
	const [editNoteText, setEditNoteText] = (0, import_react.useState)("");
	const isOverdue = task.dueDate < (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const isDone = task.status === "Done";
	const allNotes = [task.note, ...task.notes || []].filter(Boolean);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `bg-card border border-border rounded-xl p-4 shadow-sm transition-shadow flex items-start gap-3 ${isDone ? "opacity-75 hover:opacity-100" : "hover:shadow"}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => onToggle(task.id),
			className: `mt-0.5 cursor-pointer transition-colors ${isDone ? "text-emerald-600" : "text-muted-foreground hover:text-primary"}`,
			children: isDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 fill-emerald-100" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "block h-5 w-5 rounded-full border border-muted-foreground flex items-center justify-center hover:border-primary" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1 space-y-1 min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `font-medium text-sm text-foreground/90 ${isDone ? "line-through text-muted-foreground" : ""}`,
					children: task.title
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
							className: "h-7 text-xs rounded-full px-4 text-white hover:opacity-90 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-0",
							onClick: () => {
								if (editNoteText.trim()) onEditNote(task.id, editNoteText.trim());
								setIsEditingNote(false);
								setEditNoteText("");
							},
							children: "Add"
						})]
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setEditNoteText("");
						setIsEditingNote(true);
					},
					className: "text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" }), " Add Note"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "bg-secondary px-2 py-0.5 rounded-md",
							children: task.type
						}),
						!isDone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `px-2 py-0.5 rounded-md ${task.priority === "High" ? "bg-red-50 text-red-600" : task.priority === "Medium" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`,
							children: task.priority
						}),
						isDone && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Completed" }),
						isAdmin && !isDone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Assignee: ", task.assignee] }),
						!isDone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: isOverdue ? "text-red-600" : "",
							children: ["Due: ", new Date(task.dueDate).toLocaleDateString("en-GB", {
								day: "numeric",
								month: "short"
							})]
						})
					]
				})
			]
		})]
	});
}
function EmployeesPage() {
	const [localEmployees, setEmployees] = useLocalStorage("crm_employees_v3", INITIAL_EMPLOYEES);
	const [deleteConfirmId, setDeleteConfirmId] = (0, import_react.useState)(null);
	const employees = localEmployees?.length ? localEmployees : INITIAL_EMPLOYEES;
	const [employeesDetails, setEmployeesDetails] = useLocalStorage("crm_employee_details_v3", INITIAL_EMPLOYEE_DETAILS);
	const [profileIsEditing, setProfileIsEditing] = (0, import_react.useState)(false);
	const [profileEditDetails, setProfileEditDetails] = (0, import_react.useState)(null);
	const [profileEditCore, setProfileEditCore] = (0, import_react.useState)({
		name: "",
		role: "",
		email: "",
		phone: "",
		status: "",
		joinDate: ""
	});
	const updateProfileCareer = (index, field, value) => {
		if (!profileEditDetails) return;
		const history = [...profileEditDetails.careerHistory];
		history[index] = {
			...history[index],
			[field]: value
		};
		setProfileEditDetails({
			...profileEditDetails,
			careerHistory: history
		});
	};
	const addProfileCareer = () => {
		if (!profileEditDetails) return;
		setProfileEditDetails({
			...profileEditDetails,
			careerHistory: [...profileEditDetails.careerHistory, {
				company: "",
				position: "",
				startDate: "",
				endDate: "",
				responsibilities: "",
				achievement: ""
			}]
		});
	};
	const deleteProfileCareer = (index) => {
		if (!profileEditDetails) return;
		setProfileEditDetails({
			...profileEditDetails,
			careerHistory: profileEditDetails.careerHistory.filter((_, i) => i !== index)
		});
	};
	const updateProfileAcademic = (index, field, value) => {
		if (!profileEditDetails) return;
		const background = [...profileEditDetails.academicBackground];
		background[index] = {
			...background[index],
			[field]: value
		};
		setProfileEditDetails({
			...profileEditDetails,
			academicBackground: background
		});
	};
	const addProfileAcademic = () => {
		if (!profileEditDetails) return;
		setProfileEditDetails({
			...profileEditDetails,
			academicBackground: [...profileEditDetails.academicBackground, {
				institution: "",
				qualification: "",
				specialization: "",
				year: "",
				grade: ""
			}]
		});
	};
	const deleteProfileAcademic = (index) => {
		if (!profileEditDetails) return;
		setProfileEditDetails({
			...profileEditDetails,
			academicBackground: profileEditDetails.academicBackground.filter((_, i) => i !== index)
		});
	};
	const updateProfileFamily = (index, field, value) => {
		if (!profileEditDetails) return;
		const info = [...profileEditDetails.familyInformation];
		info[index] = {
			...info[index],
			[field]: value
		};
		setProfileEditDetails({
			...profileEditDetails,
			familyInformation: info
		});
	};
	const addProfileFamily = () => {
		if (!profileEditDetails) return;
		setProfileEditDetails({
			...profileEditDetails,
			familyInformation: [...profileEditDetails.familyInformation, {
				name: "",
				relationship: "",
				dob: "",
				contactNumber: ""
			}]
		});
	};
	const deleteProfileFamily = (index) => {
		if (!profileEditDetails) return;
		setProfileEditDetails({
			...profileEditDetails,
			familyInformation: profileEditDetails.familyInformation.filter((_, i) => i !== index)
		});
	};
	const [tasks, setTasks] = useLocalStorage("crm_tasks_v1", []);
	const auth = getAuth();
	const isAdmin = auth?.role === "admin";
	const [leaves, setLeaves] = useLocalStorage("crm_leaves_v1", DEFAULT_LEAVES);
	const [attendance, setAttendance] = useLocalStorage("crm_attendance_v2", []);
	const [feeds, setFeeds] = useLocalStorage("crm_feeds_v1", DEFAULT_FEEDS);
	const [timeLogs, setTimeLogs] = useLocalStorage("crm_timelogs_v1", DEFAULT_TIMELOGS);
	const [hrFiles, setHrFiles] = useLocalStorage("crm_hr_files_v1", DEFAULT_FILES);
	const [expandedSection, setExpandedSection] = (0, import_react.useState)(null);
	const [reviews, setReviews] = useLocalStorage("crm_reviews_v1", [{
		id: "REV-01",
		empId: "LMH-02",
		period: "Q1 2026",
		rating: 4.5,
		feedback: "Excellent sales performance, exceeded targets.",
		reviewer: "Manvendra Singhal",
		date: "2026-04-05"
	}, {
		id: "REV-02",
		empId: "LMH-03",
		period: "Q1 2026",
		rating: 4.8,
		feedback: "Great coordination and support on tour bookings.",
		reviewer: "Manvendra Singhal",
		date: "2026-04-06"
	}]);
	const [payroll, setPayroll] = useLocalStorage("crm_payroll_v1", [
		{
			id: "PAY-01",
			empId: "LMH-02",
			month: "May 2026",
			salary: 35e3,
			status: "Paid",
			txId: "TXN1029384",
			date: "2026-06-01"
		},
		{
			id: "PAY-02",
			empId: "LMH-03",
			month: "May 2026",
			salary: 32e3,
			status: "Paid",
			txId: "TXN1029385",
			date: "2026-06-01"
		},
		{
			id: "PAY-03",
			empId: "LMH-04",
			month: "May 2026",
			salary: 45e3,
			status: "Paid",
			txId: "TXN1029386",
			date: "2026-06-01"
		}
	]);
	const [assets, setAssets] = useLocalStorage("crm_assets_v1", [
		{
			id: "AST-01",
			empId: "LMH-02",
			name: "Dell Latitude 5420 Laptop",
			serial: "CN-0V2H3Y-1234",
			type: "Laptop",
			value: 65e3,
			date: "2023-03-10"
		},
		{
			id: "AST-02",
			empId: "LMH-03",
			name: "HP ProBook 440 G8 Laptop",
			serial: "CN-0V2H3Y-5678",
			type: "Laptop",
			value: 58e3,
			date: "2022-06-25"
		},
		{
			id: "AST-03",
			empId: "LMH-04",
			name: "MacBook Air M1",
			serial: "FVFCX123QY7",
			type: "Laptop",
			value: 85e3,
			date: "2021-11-05"
		},
		{
			id: "AST-04",
			empId: "LMH-05",
			name: "Lenovo ThinkPad L14",
			serial: "CN-0V2H3Y-9012",
			type: "Laptop",
			value: 55e3,
			date: "2023-08-12"
		}
	]);
	const [certificates, setCertificates] = useLocalStorage("crm_certificates_v1", [
		{
			id: "CRT-01",
			empId: "LMH-02",
			name: "Destination Expert - Middle East",
			issuer: "Tourism Board",
			date: "2024-05-15",
			url: "#"
		},
		{
			id: "CRT-02",
			empId: "LMH-03",
			name: "IATA Foundation Course",
			issuer: "IATA",
			date: "2023-11-20",
			url: "#"
		},
		{
			id: "CRT-03",
			empId: "LMH-05",
			name: "Visa Regulations & Compliance",
			issuer: "VFS Global Academy",
			date: "2024-02-18",
			url: "#"
		}
	]);
	const [addLeaveType, setAddLeaveType] = (0, import_react.useState)("Casual Leave");
	const [addLeaveFrom, setAddLeaveFrom] = (0, import_react.useState)("");
	const [addLeaveTo, setAddLeaveTo] = (0, import_react.useState)("");
	const [addLeaveReason, setAddLeaveReason] = (0, import_react.useState)("");
	const [addAttDate, setAddAttDate] = (0, import_react.useState)("");
	const [addAttIn, setAddAttIn] = (0, import_react.useState)("09:30");
	const [addAttOut, setAddAttOut] = (0, import_react.useState)("18:30");
	const [addAttLoc, setAddAttLoc] = (0, import_react.useState)("JTM Mall Office");
	const [addReviewPeriod, setAddReviewPeriod] = (0, import_react.useState)("");
	const [addReviewRating, setAddReviewRating] = (0, import_react.useState)("5.0");
	const [addReviewFeedback, setAddReviewFeedback] = (0, import_react.useState)("");
	const [addDocName, setAddDocName] = (0, import_react.useState)("");
	const [addDocType, setAddDocType] = (0, import_react.useState)("Resume");
	const [addDocSize, setAddDocSize] = (0, import_react.useState)("1.0 MB");
	const [addPayMonth, setAddPayMonth] = (0, import_react.useState)("");
	const [addPaySalary, setAddPaySalary] = (0, import_react.useState)("");
	const [addPayStatus, setAddPayStatus] = (0, import_react.useState)("Paid");
	const [addAssetName, setAddAssetName] = (0, import_react.useState)("");
	const [addAssetSerial, setAddAssetSerial] = (0, import_react.useState)("");
	const [addAssetType, setAddAssetType] = (0, import_react.useState)("Laptop");
	const [addCertName, setAddCertName] = (0, import_react.useState)("");
	const [addCertIssuer, setAddCertIssuer] = (0, import_react.useState)("");
	const [isLeaveModalOpen, setIsLeaveModalOpen] = (0, import_react.useState)(false);
	const [leaveType, setLeaveType] = (0, import_react.useState)("Casual Leave");
	const [leaveFrom, setLeaveFrom] = (0, import_react.useState)("");
	const [leaveTo, setLeaveTo] = (0, import_react.useState)("");
	const [leaveReason, setLeaveReason] = (0, import_react.useState)("");
	const [punchLocation, setPunchLocation] = (0, import_react.useState)("JTM Mall Office");
	const [punchNote, setPunchNote] = (0, import_react.useState)("");
	const [feedText, setFeedText] = (0, import_react.useState)("");
	const [isFileModalOpen, setIsFileModalOpen] = (0, import_react.useState)(false);
	const [newFileName, setNewFileName] = (0, import_react.useState)("");
	const [newFileSize, setNewFileSize] = (0, import_react.useState)("");
	const [isTimeLogModalOpen, setIsTimeLogModalOpen] = (0, import_react.useState)(false);
	const [logProject, setLogProject] = (0, import_react.useState)("");
	const [logTask, setLogTask] = (0, import_react.useState)("");
	const [logHours, setLogHours] = (0, import_react.useState)("");
	const [logDate, setLogDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [isTaskModalOpen, setIsTaskModalOpen] = (0, import_react.useState)(false);
	const [taskTitle, setTaskTitle] = (0, import_react.useState)("");
	const [taskType, setTaskType] = (0, import_react.useState)("Call");
	const [taskPriority, setTaskPriority] = (0, import_react.useState)("Medium");
	const [taskAssignee, setTaskAssignee] = (0, import_react.useState)("");
	const [taskDueDate, setTaskDueDate] = (0, import_react.useState)("");
	const [taskNote, setTaskNote] = (0, import_react.useState)("");
	const [q, setQ] = (0, import_react.useState)("");
	const [roleFilter, setRoleFilter] = (0, import_react.useState)("All");
	const allRoles = [
		"Operations Manager",
		"Travel Consultant",
		"Visa Executive",
		"Accounts",
		"Marketing",
		"Sales Executive",
		"Executive",
		"HR & Admin Manager",
		"Accounts Manager"
	];
	const [activeTab, setActiveTab] = (0, import_react.useState)(isAdmin ? "Employees" : "Profile");
	const [selectedEmployee, setSelectedEmployee] = (0, import_react.useState)(null);
	const [isAddOpen, setIsAddOpen] = (0, import_react.useState)(false);
	const [newEmployee, setNewEmployee] = (0, import_react.useState)({
		id: "",
		name: "",
		email: "",
		phone: "",
		role: "Travel Consultant",
		status: "Active",
		description: "",
		username: "",
		password: "emp123"
	});
	(0, import_react.useEffect)(() => {
		if (isAddOpen) {
			let maxNum = 5;
			employees.forEach((emp) => {
				if (emp.id.startsWith("LMH-")) {
					const num = parseInt(emp.id.replace("LMH-", ""), 10);
					if (!isNaN(num) && num > maxNum) maxNum = num;
				}
			});
			setNewEmployee({
				id: `LMH-${String(maxNum + 1).padStart(2, "0")}`,
				name: "",
				email: "",
				phone: "",
				role: "Travel Consultant",
				status: "Active",
				description: "",
				username: "",
				password: "emp123"
			});
		}
	}, [isAddOpen, employees]);
	const handleNameChange = (name) => {
		const parts = name.trim().toLowerCase().split(/\s+/);
		const generatedUsername = parts.length ? parts[0] : "";
		setNewEmployee((prev) => ({
			...prev,
			name,
			username: prev.username ? prev.username : generatedUsername
		}));
	};
	const filtered = employees.filter((e) => (roleFilter === "All" || e.role === roleFilter) && (q === "" || e.name.toLowerCase().includes(q.toLowerCase()) || e.email.toLowerCase().includes(q.toLowerCase())));
	const totalRevenue = employees.reduce((s, e) => s + e.revenue, 0);
	const handleDeleteEmployee = (e, id) => {
		e.stopPropagation();
		setDeleteConfirmId(id);
	};
	const handleAddEmployee = (e) => {
		e.preventDefault();
		if (!newEmployee.name || !newEmployee.email || !newEmployee.id || !newEmployee.username || !newEmployee.password) return;
		setEmployees([{
			id: newEmployee.id,
			name: newEmployee.name,
			avatar: "",
			role: newEmployee.role,
			email: newEmployee.email,
			phone: newEmployee.phone,
			joinDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			status: newEmployee.status,
			leads: 0,
			closedDeals: 0,
			revenue: 0,
			rating: 0,
			recentActivity: "Newly added to the team",
			description: newEmployee.description || "No description provided.",
			username: newEmployee.username,
			password: newEmployee.password
		}, ...employees]);
		setIsAddOpen(false);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-bold",
					children: "Employees"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Team directory, roles, and performance overview."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open: isAddOpen,
					onOpenChange: setIsAddOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "gap-2 rounded-xl",
							style: { background: "var(--gradient-brand)" },
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Employee"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "sm:max-w-[500px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add New Employee" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Enter the details of the new team member. Click save when you're done." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleAddEmployee,
							className: "space-y-4 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "id",
											children: "Employee ID"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "id",
											required: true,
											placeholder: "e.g. LMH-06",
											value: newEmployee.id,
											onChange: (e) => setNewEmployee({
												...newEmployee,
												id: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "name",
											children: "Full Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "name",
											required: true,
											placeholder: "e.g. John Doe",
											value: newEmployee.name,
											onChange: (e) => handleNameChange(e.target.value)
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "email",
											children: "Email"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "email",
											type: "email",
											required: true,
											placeholder: "e.g. john@lmh.in",
											value: newEmployee.email,
											onChange: (e) => setNewEmployee({
												...newEmployee,
												email: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "phone",
											children: "Phone"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "phone",
											required: true,
											placeholder: "e.g. +91 98765 43210",
											value: newEmployee.phone,
											onChange: (e) => setNewEmployee({
												...newEmployee,
												phone: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "username",
											children: "Login Username"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "username",
											required: true,
											placeholder: "e.g. john",
											value: newEmployee.username,
											onChange: (e) => setNewEmployee({
												...newEmployee,
												username: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "password",
											children: "Login Password"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "password",
											required: true,
											placeholder: "e.g. emp123",
											value: newEmployee.password,
											onChange: (e) => setNewEmployee({
												...newEmployee,
												password: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "role",
											children: "Role"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											id: "role",
											value: newEmployee.role,
											onChange: (e) => setNewEmployee({
												...newEmployee,
												role: e.target.value
											}),
											className: "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
											children: allRoles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: r,
												children: r
											}, r))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "status",
											children: "Status"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											id: "status",
											value: newEmployee.status,
											onChange: (e) => setNewEmployee({
												...newEmployee,
												status: e.target.value
											}),
											className: "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Active",
													children: "Active"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "On Leave",
													children: "On Leave"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Inactive",
													children: "Inactive"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2 col-span-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "description",
											children: "Description"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "description",
											placeholder: "Brief bio or description...",
											value: newEmployee.description,
											onChange: (e) => setNewEmployee({
												...newEmployee,
												description: e.target.value
											})
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setIsAddOpen(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									children: "Save Employee"
								})]
							})]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-1 overflow-x-auto border-b border-border pb-px scrollbar-hide",
				children: [
					"Profile",
					"Jobs",
					"Employees"
				].filter((tab) => {
					if (!isAdmin && tab === "Employees") return false;
					return true;
				}).map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveTab(tab),
					className: `whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`,
					children: tab
				}, tab))
			}),
			activeTab === "Employees" && isAdmin ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-4",
					children: [
						{
							label: "Total Staff",
							value: employees.length,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCog, { className: "h-4 w-4" }),
							color: "bg-blue-100 text-blue-600"
						},
						{
							label: "Active",
							value: employees.filter((e) => e.status === "Active").length,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4" }),
							color: "bg-emerald-100 text-emerald-600"
						},
						{
							label: "Total Bookings",
							value: employees.reduce((s, e) => s + e.closedDeals, 0),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-4 w-4" }),
							color: "bg-violet-100 text-violet-600"
						},
						{
							label: "Team Revenue",
							value: formatINR(totalRevenue),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }),
							color: "bg-amber-100 text-amber-600"
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-card",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: s.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `grid h-8 w-8 place-items-center rounded-xl ${s.color}`,
								children: s.icon
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 font-display text-2xl font-bold",
							children: s.value
						})]
					}, s.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative max-w-xs flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "Search by name or email...",
							className: "pl-9 rounded-xl"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setRoleFilter("All"),
							className: `rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${roleFilter === "All" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`,
							children: "All"
						}), allRoles.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setRoleFilter(r),
							className: `rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${roleFilter === r ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`,
							children: r
						}, r))]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
					children: [filtered.map((emp) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						onClick: () => setSelectedEmployee(emp),
						className: "group relative rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
						children: [
							isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: (e) => handleDeleteEmployee(e, emp.id),
								className: "absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 z-10",
								title: "Delete Employee",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3",
									children: [emp.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: emp.avatar,
										alt: emp.name,
										className: "h-12 w-12 rounded-2xl object-cover shrink-0"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-12 w-12 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-6 w-6 text-gray-400" })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold leading-tight",
										children: emp.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: emp.id
									})] })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLOR[emp.status]}`,
									children: emp.status
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${ROLE_COLOR[emp.role]}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3 w-3" }),
										" ",
										emp.role
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm text-muted-foreground line-clamp-2",
								children: emp.description
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 space-y-1 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }),
										" ",
										emp.email
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "flex items-center gap-1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" }),
										" ",
										emp.phone
									]
								})]
							}),
							emp.revenue > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid grid-cols-3 gap-2 rounded-xl bg-secondary/50 p-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-lg font-bold text-primary",
											children: emp.leads
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Leads"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display text-lg font-bold text-primary",
											children: emp.closedDeals
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Deals"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-display text-lg font-bold text-primary",
											children: [Math.round(emp.revenue / 1e5), "L"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground",
											children: "Revenue"
										})]
									})
								]
							}),
							(() => {
								const empTasks = tasks.filter((t) => t.assignee === emp.name);
								const pendingCount = empTasks.filter((t) => t.status === "Pending").length;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 pt-4 border-t border-border",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between mb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2",
											children: ["Tasks", empTasks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "bg-primary/10 text-primary px-1.5 py-0.5 rounded-md",
												children: [
													pendingCount,
													" pending / ",
													empTasks.length,
													" total"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: (e) => {
												e.stopPropagation();
												setTaskAssignee(emp.name);
												setIsTaskModalOpen(true);
											},
											className: "gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-md px-3 py-1.5 text-[10px] font-semibold flex items-center transition-all hover:shadow-lg hover:-translate-y-0.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" }), " Add Task"]
										})]
									}), empTasks.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin",
										children: empTasks.map((task) => {
											const isOverdue = task.status === "Pending" && task.dueDate < (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
											const isDone = task.status === "Done";
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: `text-xs bg-secondary/40 p-2.5 rounded-lg border border-border/50 transition-colors flex items-center justify-between gap-2 ${isDone ? "opacity-60 bg-secondary/10" : ""}`,
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0 flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: `font-medium truncate text-foreground/90 ${isDone ? "line-through text-muted-foreground" : ""}`,
														title: task.title,
														children: task.title
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2 mt-1 text-[9px] uppercase tracking-wide font-semibold text-muted-foreground",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "bg-background px-1.5 py-0.5 rounded-md border border-border/50",
															children: task.type
														}), !isDone && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: isOverdue ? "text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md border border-red-100" : "text-muted-foreground",
															children: ["Due: ", new Date(task.dueDate).toLocaleDateString("en-GB", {
																day: "numeric",
																month: "short"
															})]
														})]
													})]
												}), isDone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100 shrink-0",
													children: "Done"
												}) : isOverdue ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md border border-red-100 shrink-0",
													children: "Overdue"
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100 shrink-0",
													children: "Active"
												})]
											}, task.id);
										})
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground italic",
										children: "No tasks assigned."
									})]
								});
							})(),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 pt-4 border-t border-border",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between mb-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StarRating, { rating: emp.rating }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-muted-foreground",
										children: ["Joined ", new Date(emp.joinDate).getFullYear()]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground italic truncate",
									children: [
										"\"",
										emp.recentActivity,
										"\""
									]
								})]
							})
						]
					}, emp.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "col-span-full py-8 text-center text-muted-foreground",
						children: "No employees found matching the current filters."
					})]
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-6",
				children: [
					activeTab === "Profile" && (() => {
						const cur = employees.find((e) => e.name.toLowerCase() === auth?.name?.toLowerCase() || e.id === auth?.empId) || employees[0];
						const empDetails = employeesDetails[cur.id] || createDefaultEmployeeDetails(cur.id, cur.name, cur.role, cur.email, cur.phone);
						const handleStartEdit = () => {
							setProfileEditCore({
								name: cur.name,
								role: cur.role,
								email: cur.email,
								phone: cur.phone,
								status: cur.status,
								joinDate: cur.joinDate
							});
							setProfileEditDetails(JSON.parse(JSON.stringify(empDetails)));
							setProfileIsEditing(true);
						};
						const handleCancelEdit = () => {
							setProfileIsEditing(false);
							setProfileEditDetails(null);
						};
						const handleSave = () => {
							if (!profileEditDetails) return;
							setEmployeesDetails({
								...employeesDetails,
								[cur.id]: profileEditDetails
							});
							setEmployees(employees.map((e) => {
								if (e.id === cur.id) return {
									...e,
									name: profileEditCore.name,
									role: profileEditCore.role,
									email: profileEditCore.email,
									phone: profileEditCore.phone,
									status: profileEditCore.status,
									joinDate: profileEditCore.joinDate,
									description: profileEditDetails.bio
								};
								return e;
							}));
							const authStored = localStorage.getItem("crm_auth");
							if (authStored) {
								const authObj = JSON.parse(authStored);
								if (authObj.empId === cur.id || authObj.name.toLowerCase() === profileEditCore.name.toLowerCase()) {
									authObj.name = profileEditCore.name;
									authObj.role = profileEditCore.role;
									authObj.email = profileEditCore.email;
									localStorage.setItem("crm_auth", JSON.stringify(authObj));
								}
							}
							setProfileIsEditing(false);
						};
						const mockPerf = {
							kpiScore: cur.rating ? Math.round(cur.rating * 20) : 92,
							attendancePct: 98.4,
							projectsCompleted: cur.closedDeals || 12,
							monthlyRating: cur.rating || 4.8,
							activeProjects: [{
								name: "Maldives Luxury Group Travel",
								status: "In Progress",
								deadline: "2026-06-30",
								progress: 75
							}, {
								name: "Europe Summer Itinerary Prep",
								status: "Planning",
								deadline: "2026-07-15",
								progress: 40
							}],
							activityTimeline: [
								{
									title: "Logged In",
									desc: "Clocked in from JTM Mall Office",
									time: "Today, 09:30 AM"
								},
								{
									title: "Task Completed",
									desc: "Updated Maldives package prices",
									time: "Yesterday, 04:15 PM"
								},
								{
									title: "Profile Updated",
									desc: "Modified emergency contact info",
									time: "18-Jun-2026"
								}
							],
							documents: [
								{
									name: "Resume_Updated.pdf",
									type: "Resume",
									size: "1.2 MB"
								},
								{
									name: "Offer_Letter_LMH.pdf",
									type: "Offer Letter",
									size: "840 KB"
								},
								{
									name: "Aadhaar_Card_Masked.pdf",
									type: "ID Proof",
									size: "620 KB"
								}
							]
						};
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6 animate-in fade-in-50 duration-200",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col md:flex-row items-center gap-5 w-full md:w-auto",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: cur.avatar,
											alt: cur.name,
											className: "h-20 w-20 rounded-2xl object-cover border border-gray-200 ring-4 ring-[#FF6B00]/10 shrink-0"
										}), profileIsEditing && profileEditDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-3 w-full md:max-w-md",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-2 gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "text-[10px] font-bold text-muted-foreground uppercase",
														children: "Full Name"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: profileEditCore.name,
														onChange: (e) => setProfileEditCore({
															...profileEditCore,
															name: e.target.value
														}),
														className: "h-8 text-xs focus-visible:ring-[#FF6B00]"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "text-[10px] font-bold text-muted-foreground uppercase",
														children: "Job Title / Role"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: profileEditCore.role,
														onChange: (e) => setProfileEditCore({
															...profileEditCore,
															role: e.target.value
														}),
														className: "h-8 text-xs focus-visible:ring-[#FF6B00]"
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "grid grid-cols-3 gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1 col-span-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "text-[10px] font-bold text-muted-foreground uppercase",
														children: "Work Email"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: profileEditCore.email,
														onChange: (e) => setProfileEditCore({
															...profileEditCore,
															email: e.target.value
														}),
														className: "h-8 text-xs focus-visible:ring-[#FF6B00]"
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "text-[10px] font-bold text-muted-foreground uppercase",
														children: "Status"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														value: profileEditCore.status,
														onChange: (e) => setProfileEditCore({
															...profileEditCore,
															status: e.target.value
														}),
														className: "flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Active",
																children: "Active"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "On Leave",
																children: "On Leave"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "Inactive",
																children: "Inactive"
															})
														]
													})]
												})]
											})]
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center md:text-left space-y-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-center justify-center md:justify-start gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
														className: "text-2xl font-bold font-display text-gray-900",
														children: cur.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLOR[cur.status] || "bg-slate-100"}`,
														children: cur.status
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[#FF6B00] font-semibold text-sm",
													children: [
														cur.role,
														" • ",
														empDetails.department
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3.5 w-3.5" }),
															" ",
															cur.email
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "flex items-center gap-1",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5" }),
															" ",
															cur.phone
														]
													})]
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl p-3.5 px-5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center pr-4 border-r border-gray-200",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] uppercase font-semibold text-muted-foreground tracking-wider",
												children: "Employee ID"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-bold text-gray-800 mt-0.5",
												children: cur.id
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "text-center pl-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] uppercase font-semibold text-muted-foreground tracking-wider",
												children: "Joining Date"
											}), profileIsEditing && profileEditDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "date",
												value: profileEditCore.joinDate,
												onChange: (e) => setProfileEditCore({
													...profileEditCore,
													joinDate: e.target.value
												}),
												className: "text-xs bg-white border border-gray-200 rounded px-1.5 py-0.5 mt-0.5 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm font-bold text-gray-800 mt-0.5",
												children: new Date(cur.joinDate).toLocaleDateString("en-IN", {
													day: "numeric",
													month: "short",
													year: "numeric"
												})
											})]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-6 md:grid-cols-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-6 md:col-span-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-bold text-base text-gray-900 border-b border-gray-100 pb-2",
													children: profileIsEditing ? "Actions" : "Quick Actions"
												}), profileIsEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2.5 pt-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														onClick: handleSave,
														className: "w-full justify-center gap-2 text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Save Details"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														variant: "outline",
														onClick: handleCancelEdit,
														className: "w-full justify-center gap-2 text-xs h-9 hover:bg-slate-100 transition-colors",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), " Cancel Edit"]
													})]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-2.5 pt-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															variant: "outline",
															onClick: handleStartEdit,
															className: "w-full justify-start gap-2 text-xs h-9 hover:text-[#FF6B00] hover:bg-orange-50/50 hover:border-[#FF6B00]/40 transition-colors",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SquarePen, { className: "h-4 w-4" }), " Edit Profile Details"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															variant: "outline",
															onClick: () => {
																setTaskAssignee(cur.name);
																setIsTaskModalOpen(true);
															},
															className: "w-full justify-start gap-2 text-xs h-9 hover:text-[#FF6B00] hover:bg-orange-50/50 hover:border-[#FF6B00]/40 transition-colors",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Assign Task"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															variant: "outline",
															onClick: () => {
																const printWindow = window.open("", "_blank");
																if (printWindow) {
																	printWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>Employee Profile - ${cur.name}</title>
                                      <style>
                                        body { font-family: sans-serif; padding: 40px; color: #333; }
                                        h1 { color: #FF6B00; margin-bottom: 5px; }
                                        .subtitle { color: #666; margin-bottom: 30px; font-weight: bold; }
                                        .section { margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
                                        .section-title { font-size: 18px; color: #FF6B00; margin-bottom: 10px; }
                                        .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 15px; }
                                        .field { margin-bottom: 8px; }
                                        .label { font-size: 11px; text-transform: uppercase; color: #888; font-weight: bold; }
                                        .value { font-size: 14px; font-weight: 500; margin-top: 2px; }
                                      </style>
                                    </head>
                                    <body>
                                      <h1>${cur.name}</h1>
                                      <div class="subtitle">${cur.role} • ${empDetails.department} (${cur.id})</div>
                                      
                                      <div class="section">
                                        <div class="section-title">Employment Details</div>
                                        <div class="grid">
                                          <div class="field"><div class="label">Designation</div><div class="value">${empDetails.designation}</div></div>
                                          <div class="field"><div class="label">Employment Type</div><div class="value">${empDetails.employmentType}</div></div>
                                          <div class="field"><div class="label">Work Location</div><div class="value">${empDetails.workLocation}</div></div>
                                          <div class="field"><div class="label">Reporting Manager</div><div class="value">${empDetails.manager}</div></div>
                                        </div>
                                      </div>

                                      <div class="section">
                                        <div class="section-title">Contact Information</div>
                                        <div class="grid">
                                          <div class="field"><div class="label">Work Phone</div><div class="value">${cur.phone}</div></div>
                                          <div class="field"><div class="label">Personal Phone</div><div class="value">${empDetails.personalPhone}</div></div>
                                          <div class="field"><div class="label">Work Email</div><div class="value">${cur.email}</div></div>
                                          <div class="field"><div class="label">Personal Email</div><div class="value">${empDetails.personalEmail}</div></div>
                                        </div>
                                      </div>
                                      
                                      <script>
                                        window.onload = function() {
                                          window.print();
                                          window.close();
                                        };
                                      <\/script>
                                    </body>
                                  </html>
                                `);
																	printWindow.document.close();
																}
															},
															className: "w-full justify-start gap-2 text-xs h-9 hover:text-[#FF6B00] hover:bg-orange-50/50 hover:border-[#FF6B00]/40 transition-colors",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Download Profile"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
															variant: "outline",
															onClick: () => {
																window.location.href = `mailto:${cur.email}?subject=Regarding CRM Employee Profile`;
															},
															className: "w-full justify-start gap-2 text-xs h-9 hover:text-[#FF6B00] hover:bg-orange-50/50 hover:border-[#FF6B00]/40 transition-colors",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), " Send Email"]
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-bold text-base text-gray-900 border-b border-gray-100 pb-2",
													children: "Reporting Structure"
												}), profileIsEditing && profileEditDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-3",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
															label: "Reporting Manager",
															value: profileEditDetails.reportingManager,
															onChange: (v) => setProfileEditDetails({
																...profileEditDetails,
																reportingManager: v
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
															label: "Team Lead",
															value: profileEditDetails.teamLead,
															onChange: (v) => setProfileEditDetails({
																...profileEditDetails,
																teamLead: v
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
															label: "Direct Reports (Comma-separated)",
															value: profileEditDetails.directReports.join(", "),
															onChange: (v) => setProfileEditDetails({
																...profileEditDetails,
																directReports: v.split(",").map((item) => item.trim()).filter(Boolean)
															})
														})
													]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-3.5 text-sm",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "space-y-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-xs text-muted-foreground font-medium",
																children: "Reporting Manager"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "font-semibold text-gray-800",
																children: empDetails.reportingManager
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "space-y-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-xs text-muted-foreground font-medium",
																children: "Team Lead"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "font-semibold text-gray-800",
																children: empDetails.teamLead
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "space-y-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-xs text-muted-foreground font-medium",
																children: "Direct Reports"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "flex flex-wrap gap-1.5 pt-0.5",
																children: empDetails.directReports.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-xs bg-gray-100 font-semibold px-2 py-0.5 rounded-md text-gray-700",
																	children: r
																}, i))
															})]
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-bold text-base text-gray-900 border-b border-gray-100 pb-2",
													children: "Verification Details"
												}), profileIsEditing && profileEditDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-3",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
															label: "PAN Number",
															value: profileEditDetails.panNumber,
															onChange: (v) => setProfileEditDetails({
																...profileEditDetails,
																panNumber: v
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
															label: "Aadhaar Number",
															value: profileEditDetails.aadhaarNumber,
															onChange: (v) => setProfileEditDetails({
																...profileEditDetails,
																aadhaarNumber: v
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
															label: "Passport Number",
															value: profileEditDetails.passportNumber,
															onChange: (v) => setProfileEditDetails({
																...profileEditDetails,
																passportNumber: v
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditSelect, {
															label: "Verification Status",
															value: profileEditDetails.verificationStatus,
															options: [
																"Verified",
																"Pending",
																"Unverified"
															],
															onChange: (v) => setProfileEditDetails({
																...profileEditDetails,
																verificationStatus: v
															})
														})
													]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-3 text-sm",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex justify-between items-center py-1.5 border-b border-gray-100",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-muted-foreground text-xs font-medium",
																children: "Employee Code"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-semibold text-gray-800",
																children: cur.id
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex justify-between items-center py-1.5 border-b border-gray-100",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-muted-foreground text-xs font-medium",
																children: "PAN Number"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-semibold text-gray-800 tracking-wider",
																children: empDetails.panNumber
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex justify-between items-center py-1.5 border-b border-gray-100",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-muted-foreground text-xs font-medium",
																children: "Aadhaar Number"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-semibold text-gray-800",
																children: empDetails.aadhaarNumber
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex justify-between items-center py-1.5 border-b border-gray-100",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-muted-foreground text-xs font-medium",
																children: "Passport Number"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-semibold text-gray-800",
																children: empDetails.passportNumber
															})]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex justify-between items-center py-1.5 pt-1.5",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "text-muted-foreground text-xs font-medium",
																children: "Verification Status"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																className: `inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${empDetails.verificationStatus === "Verified" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-amber-600 bg-amber-50 border-amber-200"}`,
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-3 w-3" }),
																	" ",
																	empDetails.verificationStatus
																]
															})]
														})
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-bold text-base text-gray-900 border-b border-gray-100 pb-2",
													children: "Documents Center"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "space-y-2 pt-1",
													children: mockPerf.documents.map((doc, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center justify-between p-2 border border-gray-100 bg-gray-50/50 hover:bg-orange-50/20 rounded-xl transition-colors text-xs",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-2 truncate",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-orange-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "truncate",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																	className: "font-semibold text-gray-800 truncate",
																	title: doc.name,
																	children: doc.name
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																	className: "text-[10px] text-muted-foreground",
																	children: [
																		doc.type,
																		" • ",
																		doc.size
																	]
																})]
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => alert(`Downloading ${doc.name}...`),
															className: "p-1.5 rounded-lg border border-gray-200 text-muted-foreground hover:text-[#FF6B00] hover:bg-white hover:border-[#FF6B00]/40 transition-colors cursor-pointer",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" })
														})]
													}, i))
												})]
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-6 md:col-span-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-bold text-base text-gray-900 border-b border-gray-100 pb-2",
													children: "Performance Summary"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "grid gap-4 sm:grid-cols-4 pt-1",
													children: [
														{
															label: "KPI Score",
															value: `${mockPerf.kpiScore}%`,
															icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-4 w-4" }),
															color: "bg-orange-50 text-[#FF6B00] border-orange-100"
														},
														{
															label: "Attendance %",
															value: `${mockPerf.attendancePct}%`,
															icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }),
															color: "bg-emerald-50 text-emerald-600 border-emerald-100"
														},
														{
															label: "Projects Completed",
															value: mockPerf.projectsCompleted,
															icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-4 w-4" }),
															color: "bg-blue-50 text-blue-600 border-blue-100"
														},
														{
															label: "Monthly Rating",
															value: `${mockPerf.monthlyRating} / 5`,
															icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }),
															color: "bg-purple-50 text-purple-600 border-purple-100"
														}
													].map((stat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: `rounded-xl border p-4 text-center ${stat.color} flex flex-col items-center justify-center`,
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "p-1.5 bg-white/80 rounded-lg shadow-sm border border-inherit mb-2 shrink-0",
																children: stat.icon
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-xl font-bold",
																children: stat.value
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-1.5",
																children: stat.label
															})
														]
													}, stat.label))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-bold text-base text-gray-900 border-b border-gray-100 pb-2",
													children: "Active Projects"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "space-y-4 pt-1",
													children: mockPerf.activeProjects.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2 border border-gray-100 rounded-xl p-3.5 bg-gray-50/50",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center justify-between",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "font-semibold text-sm text-gray-800",
																children: p.name
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "text-[11px] text-muted-foreground",
																children: ["Deadline: ", new Date(p.deadline).toLocaleDateString("en-GB", {
																	day: "numeric",
																	month: "short",
																	year: "numeric"
																})]
															})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: `text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.status === "In Progress" ? "bg-orange-50 border-orange-200 text-[#FF6B00]" : "bg-blue-50 border-blue-200 text-blue-600"}`,
																children: p.status
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "space-y-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "flex justify-between text-[10px] font-semibold",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground",
																	children: "Progress"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
																	className: "text-gray-700",
																	children: [p.progress, "%"]
																})]
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "h-1.5 w-full bg-gray-200 rounded-full overflow-hidden",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "h-full bg-[#FF6B00] rounded-full transition-all duration-500",
																	style: { width: `${p.progress}%` }
																})
															})]
														})]
													}, i))
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-bold text-base text-gray-900 border-b border-gray-100 pb-2",
													children: "Employment Details"
												}), profileIsEditing && profileEditDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-4 sm:grid-cols-2 text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Department",
																value: profileEditDetails.department,
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	department: v
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Designation",
																value: profileEditDetails.designation,
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	designation: v
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditSelect, {
																label: "Employment Type",
																value: profileEditDetails.employmentType,
																options: [
																	"Permanent",
																	"Contract",
																	"Intern",
																	"Part-time"
																],
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	employmentType: v
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Work Location",
																value: profileEditDetails.workLocation,
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	workLocation: v
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Reporting Manager",
																value: profileEditDetails.manager,
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	manager: v
																})
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Assigned Team",
																value: profileEditDetails.team,
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	team: v
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Total Experience",
																value: profileEditDetails.experience,
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	experience: v
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Employee Level",
																value: profileEditDetails.level,
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	level: v
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Skills (Comma-separated)",
																value: profileEditDetails.skills.join(", "),
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	skills: v.split(",").map((s) => s.trim()).filter(Boolean)
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Certifications (Comma-separated)",
																value: profileEditDetails.certifications.join(", "),
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	certifications: v.split(",").map((c) => c.trim()).filter(Boolean)
																})
															})
														]
													})]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-4 sm:grid-cols-2 text-sm",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Department"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800",
																	children: empDetails.department
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Designation"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800",
																	children: empDetails.designation
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Employment Type"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800",
																	children: empDetails.employmentType
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Work Location"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800",
																	children: empDetails.workLocation
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Reporting Manager"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800",
																	children: empDetails.manager
																})]
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Assigned Team"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800",
																	children: empDetails.team
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Total Experience"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800",
																	children: empDetails.experience
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Employee Level"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800",
																	children: empDetails.level
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Skills"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "col-span-2 flex flex-wrap gap-1",
																	children: empDetails.skills.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "text-[10px] font-bold bg-orange-50 text-[#FF6B00] border border-orange-100 px-1.5 py-0.5 rounded",
																		children: s
																	}, i))
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Certifications"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																	className: "col-span-2 flex flex-wrap gap-1",
																	children: empDetails.certifications.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																		className: "text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded",
																		children: c
																	}, i))
																})]
															})
														]
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-bold text-base text-gray-900 border-b border-gray-100 pb-2",
													children: "Personal Profile"
												}), profileIsEditing && profileEditDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-4 sm:grid-cols-2 text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Date of Birth",
																value: profileEditDetails.dob,
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	dob: v
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditSelect, {
																label: "Gender",
																value: profileEditDetails.gender,
																options: [
																	"Female",
																	"Male",
																	"Other"
																],
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	gender: v
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Nationality",
																value: profileEditDetails.nationality,
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	nationality: v
																})
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditSelect, {
																label: "Marital Status",
																value: profileEditDetails.maritalStatus,
																options: [
																	"Single",
																	"Married",
																	"Divorced",
																	"Widowed"
																],
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	maritalStatus: v
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Languages (Comma-separated)",
																value: profileEditDetails.languages.join(", "),
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	languages: v.split(",").map((l) => l.trim()).filter(Boolean)
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "space-y-1",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
																	className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider",
																	children: "About / Bio"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
																	value: profileEditDetails.bio || "",
																	onChange: (e) => setProfileEditDetails({
																		...profileEditDetails,
																		bio: e.target.value
																	}),
																	className: "flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
																})]
															})
														]
													})]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-4 sm:grid-cols-2 text-sm",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Date of Birth"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800",
																	children: new Date(empDetails.dob).toLocaleDateString("en-IN", {
																		day: "numeric",
																		month: "short",
																		year: "numeric"
																	})
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Gender"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800",
																	children: empDetails.gender
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Nationality"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800",
																	children: empDetails.nationality
																})]
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Marital Status"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800",
																	children: empDetails.maritalStatus
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Languages"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800",
																	children: empDetails.languages.join(", ")
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "About / Bio"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 text-gray-700 leading-relaxed font-medium",
																	children: cur.description || "Active system user."
																})]
															})
														]
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-bold text-base text-gray-900 border-b border-gray-100 pb-2",
													children: "Contact Information"
												}), profileIsEditing && profileEditDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-4 sm:grid-cols-2 text-xs",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Work Phone",
																value: profileEditCore.phone,
																onChange: (v) => setProfileEditCore({
																	...profileEditCore,
																	phone: v
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Personal Phone",
																value: profileEditDetails.personalPhone,
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	personalPhone: v
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Work Email",
																value: profileEditCore.email,
																onChange: (v) => setProfileEditCore({
																	...profileEditCore,
																	email: v
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Personal Email",
																value: profileEditDetails.personalEmail,
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	personalEmail: v
																})
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2.5",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Current Address",
																value: profileEditDetails.currentAddress,
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	currentAddress: v
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Permanent Address",
																value: profileEditDetails.permanentAddress,
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	permanentAddress: v
																})
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
																label: "Emergency Contact",
																value: profileEditDetails.emergencyContact,
																onChange: (v) => setProfileEditDetails({
																	...profileEditDetails,
																	emergencyContact: v
																})
															})
														]
													})]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid gap-4 sm:grid-cols-2 text-sm",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Work Phone"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800",
																	children: cur.phone
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Personal Phone"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800",
																	children: empDetails.personalPhone
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Work Email"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800",
																	children: cur.email
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Personal Email"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800",
																	children: empDetails.personalEmail
																})]
															})
														]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-2",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Current Address"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 text-xs font-medium text-gray-800 leading-relaxed",
																	children: empDetails.currentAddress
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Permanent Address"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 text-xs font-medium text-gray-800 leading-relaxed",
																	children: empDetails.permanentAddress
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "grid grid-cols-3 gap-2 py-1.5",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "text-muted-foreground text-xs font-medium",
																	children: "Emergency Contact"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																	className: "col-span-2 font-semibold text-gray-800 text-xs",
																	children: empDetails.emergencyContact
																})]
															})
														]
													})]
												})]
											})
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-6",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-bold text-base text-gray-900 border-b border-gray-100 pb-2",
													children: "Career History"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "border border-gray-200 rounded-xl overflow-hidden shadow-sm",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
														className: "w-full text-sm text-left",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
															className: "bg-orange-50/50 text-[#FF6B00] text-xs font-bold border-b border-gray-200",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3",
																	children: "Company"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3",
																	children: "Position"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3",
																	children: "Start Date"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3",
																	children: "End Date"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3",
																	children: "Responsibilities"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3",
																	children: "Achievement"
																}),
																profileIsEditing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3 text-right",
																	children: "Actions"
																})
															] })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
															className: "divide-y divide-gray-100 text-gray-700 bg-white",
															children: profileIsEditing && profileEditDetails ? profileEditDetails.careerHistory.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
																className: "hover:bg-orange-50/10 transition-colors",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																			className: "h-7 text-xs",
																			value: h.company,
																			onChange: (e) => updateProfileCareer(i, "company", e.target.value)
																		})
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																			className: "h-7 text-xs",
																			value: h.position,
																			onChange: (e) => updateProfileCareer(i, "position", e.target.value)
																		})
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																			className: "h-7 text-xs",
																			type: "date",
																			value: h.startDate,
																			onChange: (e) => updateProfileCareer(i, "startDate", e.target.value)
																		})
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																			className: "h-7 text-xs",
																			type: "date",
																			value: h.endDate,
																			onChange: (e) => updateProfileCareer(i, "endDate", e.target.value)
																		})
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																			className: "h-7 text-xs",
																			value: h.responsibilities,
																			onChange: (e) => updateProfileCareer(i, "responsibilities", e.target.value)
																		})
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																			className: "h-7 text-xs",
																			value: h.achievement,
																			onChange: (e) => updateProfileCareer(i, "achievement", e.target.value)
																		})
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5 text-right",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																			size: "icon",
																			variant: "ghost",
																			className: "h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50",
																			onClick: () => deleteProfileCareer(i),
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
																		})
																	})
																]
															}, i)) : empDetails.careerHistory.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																colSpan: 6,
																className: "px-4 py-8 text-center text-xs text-muted-foreground",
																children: "No career history records logged."
															}) }) : empDetails.careerHistory.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
																className: "hover:bg-orange-50/10 transition-colors",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-4 py-3.5 font-semibold text-gray-800",
																		children: h.company
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-4 py-3.5 text-xs",
																		children: h.position
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-4 py-3.5 text-xs text-muted-foreground",
																		children: h.startDate ? new Date(h.startDate).toLocaleDateString("en-IN", {
																			month: "short",
																			year: "numeric"
																		}) : "N/A"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-4 py-3.5 text-xs text-muted-foreground",
																		children: h.endDate ? new Date(h.endDate).toLocaleDateString("en-IN", {
																			month: "short",
																			year: "numeric"
																		}) : "Present"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-4 py-3.5 text-xs max-w-xs truncate",
																		title: h.responsibilities,
																		children: h.responsibilities
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-4 py-3.5 text-xs font-medium text-emerald-700",
																		children: h.achievement
																	})
																]
															}, i))
														})]
													})
												}),
												profileIsEditing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "pt-2 text-right",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														variant: "outline",
														size: "sm",
														className: "text-[#FF6B00] border-[#FF6B00]/30 hover:bg-orange-50 text-xs",
														onClick: addProfileCareer,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3 mr-1" }), " Add Experience Row"]
													})
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-bold text-base text-gray-900 border-b border-gray-100 pb-2",
													children: "Academic Background"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "border border-gray-200 rounded-xl overflow-hidden shadow-sm",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
														className: "w-full text-sm text-left",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
															className: "bg-orange-50/50 text-[#FF6B00] text-xs font-bold border-b border-gray-200",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3",
																	children: "Institution"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3",
																	children: "Qualification"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3",
																	children: "Specialization"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3",
																	children: "Year"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3",
																	children: "Grade"
																}),
																profileIsEditing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3 text-right",
																	children: "Actions"
																})
															] })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
															className: "divide-y divide-gray-100 text-gray-700 bg-white",
															children: profileIsEditing && profileEditDetails ? profileEditDetails.academicBackground.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
																className: "hover:bg-orange-50/10 transition-colors",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																			className: "h-7 text-xs",
																			value: a.institution,
																			onChange: (e) => updateProfileAcademic(i, "institution", e.target.value)
																		})
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																			className: "h-7 text-xs",
																			value: a.qualification,
																			onChange: (e) => updateProfileAcademic(i, "qualification", e.target.value)
																		})
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																			className: "h-7 text-xs",
																			value: a.specialization,
																			onChange: (e) => updateProfileAcademic(i, "specialization", e.target.value)
																		})
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																			className: "h-7 text-xs",
																			value: a.year,
																			onChange: (e) => updateProfileAcademic(i, "year", e.target.value)
																		})
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																			className: "h-7 text-xs",
																			value: a.grade,
																			onChange: (e) => updateProfileAcademic(i, "grade", e.target.value)
																		})
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5 text-right",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																			size: "icon",
																			variant: "ghost",
																			className: "h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50",
																			onClick: () => deleteProfileAcademic(i),
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
																		})
																	})
																]
															}, i)) : empDetails.academicBackground.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																colSpan: 5,
																className: "px-4 py-8 text-center text-xs text-muted-foreground",
																children: "No academic records logged."
															}) }) : empDetails.academicBackground.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
																className: "hover:bg-orange-50/10 transition-colors",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-4 py-3.5 font-semibold text-gray-800",
																		children: a.institution
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-4 py-3.5 text-xs",
																		children: a.qualification
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-4 py-3.5 text-xs text-muted-foreground",
																		children: a.specialization
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-4 py-3.5 text-xs text-muted-foreground",
																		children: a.year
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-4 py-3.5 text-xs font-semibold text-gray-800",
																		children: a.grade
																	})
																]
															}, i))
														})]
													})
												}),
												profileIsEditing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "pt-2 text-right",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														variant: "outline",
														size: "sm",
														className: "text-[#FF6B00] border-[#FF6B00]/30 hover:bg-orange-50 text-xs",
														onClick: addProfileAcademic,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3 mr-1" }), " Add Qualification Row"]
													})
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "font-bold text-base text-gray-900 border-b border-gray-100 pb-2",
													children: "Family Information"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "border border-gray-200 rounded-xl overflow-hidden shadow-sm",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
														className: "w-full text-sm text-left",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
															className: "bg-orange-50/50 text-[#FF6B00] text-xs font-bold border-b border-gray-200",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3",
																	children: "Name"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3",
																	children: "Relationship"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3",
																	children: "Date of Birth"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3",
																	children: "Contact Number"
																}),
																profileIsEditing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																	className: "px-4 py-3 text-right",
																	children: "Actions"
																})
															] })
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
															className: "divide-y divide-gray-100 text-gray-700 bg-white",
															children: profileIsEditing && profileEditDetails ? profileEditDetails.familyInformation.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
																className: "hover:bg-orange-50/10 transition-colors",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																			className: "h-7 text-xs",
																			value: f.name,
																			onChange: (e) => updateProfileFamily(i, "name", e.target.value)
																		})
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																			className: "h-7 text-xs",
																			value: f.relationship,
																			onChange: (e) => updateProfileFamily(i, "relationship", e.target.value)
																		})
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																			className: "h-7 text-xs",
																			type: "date",
																			value: f.dob,
																			onChange: (e) => updateProfileFamily(i, "dob", e.target.value)
																		})
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																			className: "h-7 text-xs",
																			value: f.contactNumber,
																			onChange: (e) => updateProfileFamily(i, "contactNumber", e.target.value)
																		})
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-2 py-1.5 text-right",
																		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																			size: "icon",
																			variant: "ghost",
																			className: "h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50",
																			onClick: () => deleteProfileFamily(i),
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
																		})
																	})
																]
															}, i)) : empDetails.familyInformation.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																colSpan: 4,
																className: "px-4 py-8 text-center text-xs text-muted-foreground",
																children: "No dependent records logged."
															}) }) : empDetails.familyInformation.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
																className: "hover:bg-orange-50/10 transition-colors",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-4 py-3.5 font-semibold text-gray-800",
																		children: f.name
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-4 py-3.5 text-xs text-muted-foreground",
																		children: f.relationship
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-4 py-3.5 text-xs text-muted-foreground",
																		children: f.dob ? new Date(f.dob).toLocaleDateString("en-IN", {
																			day: "numeric",
																			month: "short",
																			year: "numeric"
																		}) : "N/A"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																		className: "px-4 py-3.5 text-xs text-gray-800 font-medium",
																		children: f.contactNumber
																	})
																]
															}, i))
														})]
													})
												}),
												profileIsEditing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "pt-2 text-right",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
														variant: "outline",
														size: "sm",
														className: "text-[#FF6B00] border-[#FF6B00]/30 hover:bg-orange-50 text-xs",
														onClick: addProfileFamily,
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3 mr-1" }), " Add Dependent Row"]
													})
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-bold text-base text-gray-900 border-b border-gray-100 pb-2",
												children: "Employee Records"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "divide-y divide-gray-200 rounded-xl border border-gray-200 overflow-hidden bg-white",
												children: [
													"Leave Requests",
													"Attendance History",
													"Performance Reviews",
													"Documents",
													"Payroll Records",
													"Company Assets",
													"Training Certificates"
												].map((rec) => {
													const isExpanded = expandedSection === rec;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "border-b last:border-b-0 border-gray-100",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															onClick: () => setExpandedSection(isExpanded ? null : rec),
															className: "flex items-center justify-between px-4 py-3.5 hover:bg-orange-50/20 cursor-pointer group transition-colors",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "font-semibold text-sm text-gray-700 group-hover:text-[#FF6B00] transition-colors",
																children: rec
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																className: "flex items-center gap-2 text-muted-foreground",
																children: isExpanded ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4 text-[#FF6B00]" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
															})]
														}), isExpanded && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "bg-gray-50/50 p-4 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-1 duration-150",
															children: [
																rec === "Leave Requests" && (() => {
																	const empLeaves = leaves.filter((l) => l.empId === cur.id);
																	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "space-y-3",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: "overflow-x-auto border border-gray-200 rounded-lg bg-white",
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
																				className: "w-full text-left text-xs",
																				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
																					className: "bg-gray-50 text-gray-700 font-bold border-b border-gray-200",
																					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Type"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Dates"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Reason"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Status"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5 text-right",
																							children: "Action"
																						})
																					] })
																				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
																					className: "divide-y divide-gray-100",
																					children: [empLeaves.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
																						className: "hover:bg-gray-50",
																						children: [
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 font-medium",
																								children: l.type
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																								className: "p-2.5 text-muted-foreground",
																								children: [
																									l.fromDate,
																									" to ",
																									l.toDate
																								]
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-muted-foreground max-w-[150px] truncate",
																								title: l.reason,
																								children: l.reason
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5",
																								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																									className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${l.status === "Approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : l.status === "Rejected" ? "bg-red-50 text-red-700 border border-red-100" : "bg-amber-50 text-amber-700 border border-amber-100"}`,
																									children: l.status
																								})
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-right",
																								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																									variant: "ghost",
																									size: "icon",
																									className: "h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50",
																									onClick: () => setLeaves(leaves.filter((item) => item.id !== l.id)),
																									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
																								})
																							})
																						]
																					}, l.id)), empLeaves.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																						colSpan: 5,
																						className: "p-4 text-center text-muted-foreground",
																						children: "No leave records."
																					}) })]
																				})]
																			})
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																			className: "bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5",
																			children: [
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																					className: "text-xs font-bold text-gray-800",
																					children: "Apply / Log Leave"
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																					className: "grid grid-cols-2 md:grid-cols-4 gap-2",
																					children: [
																						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
																							value: addLeaveType,
																							onChange: (e) => setAddLeaveType(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs focus:ring-1 focus:ring-[#FF6B00] outline-none",
																							children: [
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Sick Leave" }),
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Casual Leave" }),
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Earned Leave" })
																							]
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																							type: "date",
																							value: addLeaveFrom,
																							onChange: (e) => setAddLeaveFrom(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																							type: "date",
																							value: addLeaveTo,
																							onChange: (e) => setAddLeaveTo(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																							type: "text",
																							placeholder: "Reason",
																							value: addLeaveReason,
																							onChange: (e) => setAddLeaveReason(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none col-span-1 md:col-span-1"
																						})
																					]
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																					className: "text-right",
																					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																						onClick: () => {
																							if (!addLeaveFrom || !addLeaveTo || !addLeaveReason) return alert("Please fill dates and reason");
																							const newL = {
																								id: `LV-${Date.now()}`,
																								empId: cur.id,
																								empName: cur.name,
																								type: addLeaveType,
																								fromDate: addLeaveFrom,
																								toDate: addLeaveTo,
																								reason: addLeaveReason,
																								status: "Pending"
																							};
																							setLeaves([...leaves, newL]);
																							setAddLeaveFrom("");
																							setAddLeaveTo("");
																							setAddLeaveReason("");
																						},
																						className: "h-7 text-[11px] px-3 bg-[#FF6B00] text-white hover:bg-[#E05E00]",
																						children: "Apply Leave"
																					})
																				})
																			]
																		})]
																	});
																})(),
																rec === "Attendance History" && (() => {
																	const empAtt = attendance.filter((a) => a.empId === cur.id);
																	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "space-y-3",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: "overflow-x-auto border border-gray-200 rounded-lg bg-white",
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
																				className: "w-full text-left text-xs",
																				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
																					className: "bg-gray-50 text-gray-700 font-bold border-b border-gray-200",
																					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Date"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Clock In"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Clock Out"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Location"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Status"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5 text-right",
																							children: "Action"
																						})
																					] })
																				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
																					className: "divide-y divide-gray-100",
																					children: [empAtt.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
																						className: "hover:bg-gray-50",
																						children: [
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 font-medium",
																								children: a.date
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-emerald-600 font-semibold",
																								children: a.clockIn || "--"
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-amber-600 font-semibold",
																								children: a.clockOut || "--"
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-muted-foreground",
																								children: a.clockInLocation || "Office"
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5",
																								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																									className: `px-2 py-0.5 rounded-full text-[10px] font-bold ${a.status === "Present" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"}`,
																									children: a.status
																								})
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-right",
																								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																									variant: "ghost",
																									size: "icon",
																									className: "h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50",
																									onClick: () => setAttendance(attendance.filter((item) => item.id !== a.id)),
																									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
																								})
																							})
																						]
																					}, a.id)), empAtt.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																						colSpan: 6,
																						className: "p-4 text-center text-muted-foreground",
																						children: "No attendance history logged."
																					}) })]
																				})]
																			})
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																			className: "bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5",
																			children: [
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																					className: "text-xs font-bold text-gray-800",
																					children: "Add Attendance Entry"
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																					className: "grid grid-cols-2 md:grid-cols-4 gap-2",
																					children: [
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																							type: "date",
																							value: addAttDate,
																							onChange: (e) => setAddAttDate(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																							type: "text",
																							placeholder: "Clock In Time",
																							value: addAttIn,
																							onChange: (e) => setAddAttIn(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																							type: "text",
																							placeholder: "Clock Out Time",
																							value: addAttOut,
																							onChange: (e) => setAddAttOut(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
																							value: addAttLoc,
																							onChange: (e) => setAddAttLoc(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none",
																							children: [
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "JTM Mall Office" }),
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Work from Home" }),
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "On-site Client Visit" })
																							]
																						})
																					]
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																					className: "text-right",
																					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																						onClick: () => {
																							if (!addAttDate || !addAttIn) return alert("Please fill date and clock-in time");
																							setAttendance([{
																								id: `ATT-${Date.now()}`,
																								empId: cur.id,
																								name: cur.name,
																								role: cur.role,
																								phone: cur.phone,
																								avatar: cur.avatar,
																								date: addAttDate,
																								clockIn: addAttIn,
																								clockOut: addAttOut || null,
																								clockInLocation: addAttLoc,
																								status: "Present"
																							}, ...attendance]);
																							setAddAttDate("");
																						},
																						className: "h-7 text-[11px] px-3 bg-[#FF6B00] text-white hover:bg-[#E05E00]",
																						children: "Add Record"
																					})
																				})
																			]
																		})]
																	});
																})(),
																rec === "Performance Reviews" && (() => {
																	const empRev = reviews.filter((r) => r.empId === cur.id);
																	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "space-y-3",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: "overflow-x-auto border border-gray-200 rounded-lg bg-white",
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
																				className: "w-full text-left text-xs",
																				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
																					className: "bg-gray-50 text-gray-700 font-bold border-b border-gray-200",
																					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Period"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Rating"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Reviewer"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Feedback"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Date"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5 text-right",
																							children: "Action"
																						})
																					] })
																				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
																					className: "divide-y divide-gray-100",
																					children: [empRev.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
																						className: "hover:bg-gray-50",
																						children: [
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 font-medium",
																								children: r.period
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																								className: "p-2.5 text-orange-500 font-semibold",
																								children: [r.rating, " / 5.0"]
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5",
																								children: r.reviewer
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-muted-foreground max-w-[200px] truncate",
																								title: r.feedback,
																								children: r.feedback
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-muted-foreground",
																								children: r.date
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-right",
																								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																									variant: "ghost",
																									size: "icon",
																									className: "h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50",
																									onClick: () => setReviews(reviews.filter((item) => item.id !== r.id)),
																									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
																								})
																							})
																						]
																					}, r.id)), empRev.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																						colSpan: 6,
																						className: "p-4 text-center text-muted-foreground",
																						children: "No performance reviews."
																					}) })]
																				})]
																			})
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																			className: "bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5",
																			children: [
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																					className: "text-xs font-bold text-gray-800",
																					children: "Add Performance Review"
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																					className: "grid grid-cols-2 md:grid-cols-4 gap-2",
																					children: [
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																							type: "text",
																							placeholder: "Period (e.g. Q2 2026)",
																							value: addReviewPeriod,
																							onChange: (e) => setAddReviewPeriod(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
																							value: addReviewRating,
																							onChange: (e) => setAddReviewRating(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none",
																							children: [
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "5.0" }),
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "4.5" }),
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "4.0" }),
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "3.5" }),
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "3.0" })
																							]
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																							type: "text",
																							placeholder: "Feedback Comments",
																							value: addReviewFeedback,
																							onChange: (e) => setAddReviewFeedback(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none col-span-2"
																						})
																					]
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																					className: "text-right",
																					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																						onClick: () => {
																							if (!addReviewPeriod || !addReviewFeedback) return alert("Please fill review period and feedback");
																							const newRev = {
																								id: `REV-${Date.now()}`,
																								empId: cur.id,
																								period: addReviewPeriod,
																								rating: parseFloat(addReviewRating),
																								feedback: addReviewFeedback,
																								reviewer: "Manvendra Singhal",
																								date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
																							};
																							setReviews([...reviews, newRev]);
																							setAddReviewPeriod("");
																							setAddReviewFeedback("");
																						},
																						className: "h-7 text-[11px] px-3 bg-[#FF6B00] text-white hover:bg-[#E05E00]",
																						children: "Save Review"
																					})
																				})
																			]
																		})]
																	});
																})(),
																rec === "Documents" && (() => {
																	const empDocs = hrFiles.filter((d) => d.empId === cur.id || !d.empId);
																	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "space-y-3",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: "overflow-x-auto border border-gray-200 rounded-lg bg-white",
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
																				className: "w-full text-left text-xs",
																				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
																					className: "bg-gray-50 text-gray-700 font-bold border-b border-gray-200",
																					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Doc Name"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Type"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Size"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Upload Date"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5 text-right",
																							children: "Action"
																						})
																					] })
																				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
																					className: "divide-y divide-gray-100",
																					children: empDocs.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
																						className: "hover:bg-gray-50",
																						children: [
																							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																								className: "p-2.5 font-medium flex items-center gap-1.5",
																								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-3.5 w-3.5 text-orange-500 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																									className: "truncate max-w-[150px]",
																									children: d.name
																								})]
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-muted-foreground",
																								children: d.type || "Document"
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-muted-foreground",
																								children: d.size
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-muted-foreground",
																								children: d.date
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-right",
																								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																									variant: "ghost",
																									size: "icon",
																									className: "h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50",
																									onClick: () => setHrFiles(hrFiles.filter((item) => item.id !== d.id)),
																									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
																								})
																							})
																						]
																					}, d.id))
																				})]
																			})
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																			className: "bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5",
																			children: [
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																					className: "text-xs font-bold text-gray-800",
																					children: "Upload / Add Document Record"
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																					className: "grid grid-cols-2 md:grid-cols-3 gap-2",
																					children: [
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																							type: "text",
																							placeholder: "File Name (e.g. Passport.pdf)",
																							value: addDocName,
																							onChange: (e) => setAddDocName(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
																							value: addDocType,
																							onChange: (e) => setAddDocType(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none",
																							children: [
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Resume" }),
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Offer Letter" }),
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "ID Proof" }),
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Other" })
																							]
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																							type: "text",
																							placeholder: "File Size (e.g. 500 KB)",
																							value: addDocSize,
																							onChange: (e) => setAddDocSize(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
																						})
																					]
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																					className: "text-right",
																					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																						onClick: () => {
																							if (!addDocName) return alert("Please fill file name");
																							const newD = {
																								id: `DOC-${Date.now()}`,
																								empId: cur.id,
																								name: addDocName,
																								type: addDocType,
																								size: addDocSize,
																								date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
																								uploader: "Manvendra Singhal"
																							};
																							setHrFiles([...hrFiles, newD]);
																							setAddDocName("");
																						},
																						className: "h-7 text-[11px] px-3 bg-[#FF6B00] text-white hover:bg-[#E05E00]",
																						children: "Log Document"
																					})
																				})
																			]
																		})]
																	});
																})(),
																rec === "Payroll Records" && (() => {
																	const empPay = payroll.filter((p) => p.empId === cur.id);
																	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "space-y-3",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: "overflow-x-auto border border-gray-200 rounded-lg bg-white",
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
																				className: "w-full text-left text-xs",
																				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
																					className: "bg-gray-50 text-gray-700 font-bold border-b border-gray-200",
																					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Month"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Net Salary"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Tx ID"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Paid Date"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Status"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5 text-right",
																							children: "Action"
																						})
																					] })
																				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
																					className: "divide-y divide-gray-100",
																					children: [empPay.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
																						className: "hover:bg-gray-50",
																						children: [
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 font-medium",
																								children: p.month
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																								className: "p-2.5 text-gray-800 font-bold",
																								children: ["₹", p.salary.toLocaleString("en-IN")]
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-muted-foreground",
																								children: p.txId
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-muted-foreground",
																								children: p.date
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5",
																								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																									className: "px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100",
																									children: p.status
																								})
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-right",
																								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																									variant: "ghost",
																									size: "icon",
																									className: "h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50",
																									onClick: () => setPayroll(payroll.filter((item) => item.id !== p.id)),
																									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
																								})
																							})
																						]
																					}, p.id)), empPay.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																						colSpan: 6,
																						className: "p-4 text-center text-muted-foreground",
																						children: "No payroll slips logged."
																					}) })]
																				})]
																			})
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																			className: "bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5",
																			children: [
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																					className: "text-xs font-bold text-gray-800",
																					children: "Record Salary Disbursal"
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																					className: "grid grid-cols-2 md:grid-cols-3 gap-2",
																					children: [
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																							type: "text",
																							placeholder: "Month (e.g. June 2026)",
																							value: addPayMonth,
																							onChange: (e) => setAddPayMonth(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																							type: "number",
																							placeholder: "Amount (INR)",
																							value: addPaySalary,
																							onChange: (e) => setAddPaySalary(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
																							value: addPayStatus,
																							onChange: (e) => setAddPayStatus(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none",
																							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Paid" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Processing" })]
																						})
																					]
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																					className: "text-right",
																					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																						onClick: () => {
																							if (!addPayMonth || !addPaySalary) return alert("Please fill month and amount");
																							const newP = {
																								id: `PAY-${Date.now()}`,
																								empId: cur.id,
																								month: addPayMonth,
																								salary: parseInt(addPaySalary),
																								status: addPayStatus,
																								txId: `TXN${Math.floor(1e5 + Math.random() * 9e5)}`,
																								date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
																							};
																							setPayroll([...payroll, newP]);
																							setAddPayMonth("");
																							setAddPaySalary("");
																						},
																						className: "h-7 text-[11px] px-3 bg-[#FF6B00] text-white hover:bg-[#E05E00]",
																						children: "Disburse Salary"
																					})
																				})
																			]
																		})]
																	});
																})(),
																rec === "Company Assets" && (() => {
																	const empAssets = assets.filter((a) => a.empId === cur.id);
																	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "space-y-3",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: "overflow-x-auto border border-gray-200 rounded-lg bg-white",
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
																				className: "w-full text-left text-xs",
																				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
																					className: "bg-gray-50 text-gray-700 font-bold border-b border-gray-200",
																					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Asset Name"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Type"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Serial No"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Assigned Date"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5 text-right",
																							children: "Action"
																						})
																					] })
																				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
																					className: "divide-y divide-gray-100",
																					children: [empAssets.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
																						className: "hover:bg-gray-50",
																						children: [
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 font-medium",
																								children: a.name
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-muted-foreground",
																								children: a.type
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-muted-foreground font-mono",
																								children: a.serial
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-muted-foreground",
																								children: a.date
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-right",
																								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																									variant: "ghost",
																									size: "icon",
																									className: "h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50",
																									onClick: () => setAssets(assets.filter((item) => item.id !== a.id)),
																									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
																								})
																							})
																						]
																					}, a.id)), empAssets.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																						colSpan: 5,
																						className: "p-4 text-center text-muted-foreground",
																						children: "No assets assigned."
																					}) })]
																				})]
																			})
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																			className: "bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5",
																			children: [
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																					className: "text-xs font-bold text-gray-800",
																					children: "Assign Company Asset"
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																					className: "grid grid-cols-2 md:grid-cols-3 gap-2",
																					children: [
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																							type: "text",
																							placeholder: "Asset Name (e.g. iPhone 13)",
																							value: addAssetName,
																							onChange: (e) => setAddAssetName(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																							type: "text",
																							placeholder: "Serial / Tag Number",
																							value: addAssetSerial,
																							onChange: (e) => setAddAssetSerial(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
																							value: addAssetType,
																							onChange: (e) => setAddAssetType(e.target.value),
																							className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none",
																							children: [
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Laptop" }),
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Mobile Phone" }),
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Accessories" }),
																								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Other" })
																							]
																						})
																					]
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																					className: "text-right",
																					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																						onClick: () => {
																							if (!addAssetName || !addAssetSerial) return alert("Please fill asset name and serial number");
																							const newAst = {
																								id: `AST-${Date.now()}`,
																								empId: cur.id,
																								name: addAssetName,
																								serial: addAssetSerial,
																								type: addAssetType,
																								value: 3e4,
																								date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
																							};
																							setAssets([...assets, newAst]);
																							setAddAssetName("");
																							setAddAssetSerial("");
																						},
																						className: "h-7 text-[11px] px-3 bg-[#FF6B00] text-white hover:bg-[#E05E00]",
																						children: "Assign Asset"
																					})
																				})
																			]
																		})]
																	});
																})(),
																rec === "Training Certificates" && (() => {
																	const empCerts = certificates.filter((c) => c.empId === cur.id);
																	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																		className: "space-y-3",
																		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																			className: "overflow-x-auto border border-gray-200 rounded-lg bg-white",
																			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
																				className: "w-full text-left text-xs",
																				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
																					className: "bg-gray-50 text-gray-700 font-bold border-b border-gray-200",
																					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Certificate Name"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Issuer"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5",
																							children: "Completion Date"
																						}),
																						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
																							className: "p-2.5 text-right",
																							children: "Action"
																						})
																					] })
																				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
																					className: "divide-y divide-gray-100",
																					children: [empCerts.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
																						className: "hover:bg-gray-50",
																						children: [
																							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																								className: "p-2.5 font-medium flex items-center gap-1.5",
																								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-3.5 w-3.5 text-[#FF6B00]" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: c.name })]
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-muted-foreground",
																								children: c.issuer
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-muted-foreground",
																								children: c.date
																							}),
																							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																								className: "p-2.5 text-right",
																								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																									variant: "ghost",
																									size: "icon",
																									className: "h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50",
																									onClick: () => setCertificates(certificates.filter((item) => item.id !== c.id)),
																									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
																								})
																							})
																						]
																					}, c.id)), empCerts.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																						colSpan: 4,
																						className: "p-4 text-center text-muted-foreground",
																						children: "No certificates logged."
																					}) })]
																				})]
																			})
																		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																			className: "bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5",
																			children: [
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																					className: "text-xs font-bold text-gray-800",
																					children: "Add Training Certificate"
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																					className: "grid grid-cols-2 md:grid-cols-3 gap-2",
																					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																						type: "text",
																						placeholder: "Certificate Name",
																						value: addCertName,
																						onChange: (e) => setAddCertName(e.target.value),
																						className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
																					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																						type: "text",
																						placeholder: "Issuing Authority (e.g. Udemy)",
																						value: addCertIssuer,
																						onChange: (e) => setAddCertIssuer(e.target.value),
																						className: "h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
																					})]
																				}),
																				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
																					className: "text-right",
																					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																						onClick: () => {
																							if (!addCertName || !addCertIssuer) return alert("Please fill certificate name and issuer");
																							const newCert = {
																								id: `CRT-${Date.now()}`,
																								empId: cur.id,
																								name: addCertName,
																								issuer: addCertIssuer,
																								date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
																								url: "#"
																							};
																							setCertificates([...certificates, newCert]);
																							setAddCertName("");
																							setAddCertIssuer("");
																						},
																						className: "h-7 text-[11px] px-3 bg-[#FF6B00] text-white hover:bg-[#E05E00]",
																						children: "Log Certificate"
																					})
																				})
																			]
																		})]
																	});
																})()
															]
														})]
													}, rec);
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-bold text-base text-gray-900 border-b border-gray-100 pb-2",
												children: "Activity Timeline"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "p-4 space-y-4",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "relative border-l-2 border-orange-100 pl-6 ml-3 space-y-5",
													children: mockPerf.activityTimeline.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "relative",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-[31px] top-1 bg-white border-2 border-[#FF6B00] h-3.5 w-3.5 rounded-full flex items-center justify-center shadow-sm" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "font-bold text-xs text-gray-800",
																children: item.title
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-[11px] text-muted-foreground mt-0.5",
																children: item.desc
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
																className: "text-[10px] font-semibold text-orange-500 mt-1",
																children: item.time
															})
														] })]
													}, i))
												})
											})]
										})
									]
								})
							]
						});
					})(),
					activeTab === "Leave" && (() => {
						const cur = employees.find((e) => e.name.toLowerCase() === auth?.name?.toLowerCase() || e.id === auth?.empId) || employees[0];
						const myLeaves = leaves.filter((l) => l.empId === cur.id || l.empName === cur.name);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6 animate-in fade-in-50 duration-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-4 grid-cols-3",
								children: [
									{
										label: "Casual Leave",
										total: 8,
										booked: myLeaves.filter((l) => l.type === "Casual Leave" && l.status === "Approved").length,
										color: "border-l-emerald-500 bg-emerald-500/5 text-emerald-700"
									},
									{
										label: "Sick Leave",
										total: 5,
										booked: myLeaves.filter((l) => l.type === "Sick Leave" && l.status === "Approved").length,
										color: "border-l-blue-500 bg-blue-500/5 text-blue-700"
									},
									{
										label: "Earned Leave",
										total: 10,
										booked: myLeaves.filter((l) => l.type === "Earned Leave" && l.status === "Approved").length,
										color: "border-l-amber-500 bg-amber-500/5 text-amber-700"
									}
								].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: `rounded-xl border border-border border-l-4 p-4 shadow-sm ${s.color}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase tracking-wider opacity-80",
										children: s.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-2 flex items-baseline justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-2xl font-bold",
											children: [
												s.total - s.booked,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs font-normal opacity-70",
													children: "Avail"
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs font-medium",
											children: [
												"Booked: ",
												s.booked,
												" / ",
												s.total
											]
										})]
									})]
								}, s.label))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-6 md:grid-cols-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "md:col-span-2 space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-semibold text-lg",
											children: "My Leave Applications"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											onClick: () => setIsLeaveModalOpen(true),
											className: "gap-1.5 rounded-xl text-xs h-9",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Apply Leave"]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-card rounded-xl border border-border shadow-sm overflow-hidden",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
											className: "w-full text-sm text-left",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
												className: "bg-secondary/40 text-muted-foreground text-xs font-medium border-b border-border",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "px-4 py-3",
														children: "Leave Type"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "px-4 py-3",
														children: "Dates"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "px-4 py-3",
														children: "Reason"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "px-4 py-3 text-right",
														children: "Status"
													})
												] })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
												className: "divide-y divide-border",
												children: [myLeaves.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
													className: "hover:bg-secondary/20",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-4 py-3.5 font-medium",
															children: l.type
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
															className: "px-4 py-3.5 text-muted-foreground",
															children: [
																new Date(l.fromDate).toLocaleDateString("en-GB", {
																	day: "numeric",
																	month: "short"
																}),
																" - ",
																new Date(l.toDate).toLocaleDateString("en-GB", {
																	day: "numeric",
																	month: "short",
																	year: "2-digit"
																})
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-4 py-3.5 text-muted-foreground max-w-xs truncate",
															title: l.reason,
															children: l.reason
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-4 py-3.5 text-right",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: `inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${l.status === "Approved" ? "bg-emerald-100 text-emerald-700" : l.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"}`,
																children: l.status
															})
														})
													]
												}, l.id)), myLeaves.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													colSpan: 4,
													className: "px-4 py-8 text-center text-muted-foreground",
													children: "No leave requests found."
												}) })]
											})]
										})
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "font-semibold text-lg",
										children: "Upcoming Holidays"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-card rounded-xl border border-border shadow-sm p-4 divide-y divide-border",
										children: [
											{
												name: "Raksha Bandhan",
												date: "2026-08-28",
												day: "Friday",
												color: "bg-red-500"
											},
											{
												name: "Independence Day",
												date: "2026-08-15",
												day: "Saturday",
												color: "bg-orange-500"
											},
											{
												name: "Dussehra",
												date: "2026-10-20",
												day: "Tuesday",
												color: "bg-amber-500"
											},
											{
												name: "Diwali",
												date: "2026-11-09",
												day: "Monday",
												color: "bg-yellow-500"
											},
											{
												name: "Christmas",
												date: "2026-12-25",
												day: "Friday",
												color: "bg-emerald-500"
											}
										].map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "py-3 first:pt-0 last:pb-0 flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-sm",
												children: h.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: h.day
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs font-semibold bg-secondary px-2.5 py-1 rounded-lg text-muted-foreground",
												children: new Date(h.date).toLocaleDateString("en-GB", {
													day: "numeric",
													month: "short"
												})
											})]
										}, h.name))
									})]
								})]
							})]
						});
					})(),
					activeTab === "Attendance" && (() => {
						const cur = employees.find((e) => e.name.toLowerCase() === auth?.name?.toLowerCase() || e.id === auth?.empId) || employees[0];
						const myLogs = attendance.filter((r) => r.empId === cur.id);
						const todayStr = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
						const todayLog = myLogs.find((r) => r.date === todayStr);
						const handlePunch = () => {
							const nowTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-GB", {
								hour: "2-digit",
								minute: "2-digit"
							});
							if (!todayLog) {
								setAttendance([{
									id: `ATT-${Date.now()}`,
									empId: cur.id,
									name: cur.name,
									role: cur.role,
									phone: cur.phone,
									avatar: cur.avatar,
									date: todayStr,
									clockIn: nowTime,
									clockOut: null,
									clockInLocation: punchLocation,
									note: punchNote || "Punch in via dashboard",
									status: "Present"
								}, ...attendance]);
								setPunchNote("");
							} else if (!todayLog.clockOut) setAttendance(attendance.map((r) => r.id === todayLog.id ? {
								...r,
								clockOut: nowTime,
								clockOutLocation: punchLocation
							} : r));
						};
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 md:grid-cols-3 animate-in fade-in-50 duration-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-card rounded-2xl border border-border p-6 shadow-card space-y-5",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-10 w-10 text-primary mx-auto mb-2 animate-pulse" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-semibold text-lg",
												children: "Punch Clock"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-2xl font-bold tracking-tight mt-1",
												children: (/* @__PURE__ */ new Date()).toLocaleTimeString("en-IN", {
													hour: "2-digit",
													minute: "2-digit",
													second: "2-digit"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground mt-1",
												children: (/* @__PURE__ */ new Date()).toLocaleDateString("en-IN", {
													weekday: "long",
													day: "numeric",
													month: "short"
												})
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "p-loc",
												children: "Work Location"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												id: "p-loc",
												disabled: !!todayLog?.clockOut,
												value: punchLocation,
												onChange: (e) => setPunchLocation(e.target.value),
												className: "flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "JTM Mall Office" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Work from Home" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "On-site Client Visit" })
												]
											})]
										}), !todayLog && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
												htmlFor: "p-note",
												children: "Daily Check-in Note"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												id: "p-note",
												placeholder: "What is your plan for today?",
												value: punchNote,
												onChange: (e) => setPunchNote(e.target.value),
												className: "h-8 text-xs"
											})]
										})]
									}),
									todayLog?.clockIn && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-secondary/50 p-3 space-y-1.5 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "flex justify-between",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Clocked In:" }),
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "font-semibold text-emerald-600",
														children: [
															todayLog.clockIn,
															" (",
															todayLog.clockInLocation || "Office",
															")"
														]
													})
												]
											}),
											todayLog.clockOut && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "flex justify-between",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Clocked Out:" }),
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-red-600",
														children: todayLog.clockOut
													})
												]
											}),
											todayLog.note && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-[11px] text-muted-foreground italic mt-1 border-t pt-1",
												children: [
													"\"",
													todayLog.note,
													"\""
												]
											})
										]
									}),
									!todayLog?.clockOut ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: handlePunch,
										className: `w-full py-5 rounded-xl font-bold gap-2 ${!todayLog ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`,
										children: !todayLog ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "h-4 w-4 fill-white" }), " Clock In"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Square, { className: "h-4 w-4 fill-white" }), " Clock Out"] })
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-center text-xs font-semibold",
										children: "🎉 Shift Completed Successfully!"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "md:col-span-2 space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold text-lg",
									children: "My Attendance Logs"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "bg-card rounded-xl border border-border shadow-sm overflow-hidden",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-sm text-left",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
											className: "bg-secondary/40 text-muted-foreground text-xs font-medium border-b border-border",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3",
													children: "Date"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3",
													children: "Clock In"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3",
													children: "Clock Out"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3",
													children: "Location"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "px-4 py-3 text-right",
													children: "Status"
												})
											] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
											className: "divide-y divide-border",
											children: [myLogs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "hover:bg-secondary/20",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3.5 font-medium",
														children: new Date(log.date).toLocaleDateString("en-GB", {
															day: "numeric",
															month: "short",
															year: "numeric"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3.5 font-semibold text-emerald-600",
														children: log.clockIn
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3.5 font-semibold text-red-600",
														children: log.clockOut || "-"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3.5 text-muted-foreground text-xs",
														children: log.clockInLocation || "Office"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "px-4 py-3.5 text-right",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "inline-block rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-semibold",
															children: log.status || "Present"
														})
													})
												]
											}, log.id)), myLogs.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												colSpan: 5,
												className: "px-4 py-8 text-center text-muted-foreground",
												children: "No attendance records clocked."
											}) })]
										})]
									})
								})]
							})]
						});
					})(),
					activeTab === "Jobs" && (() => {
						const myTasks = isAdmin ? tasks : tasks.filter((t) => t.assignee === auth?.name);
						const pendingTasks = myTasks.filter((t) => t.status === "Pending");
						const completedTasks = myTasks.filter((t) => t.status === "Done");
						const handleToggleTask = (id) => {
							setTasks(tasks.map((t) => t.id === id ? {
								...t,
								status: t.status === "Pending" ? "Done" : "Pending"
							} : t));
						};
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6 animate-in fade-in-50 duration-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-semibold text-lg",
									children: "Task Management"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Track assignments and action items."
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									onClick: () => setIsTaskModalOpen(true),
									className: "gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Task"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-6 md:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "font-semibold text-sm flex items-center justify-between text-amber-600 bg-amber-50 px-3 py-2 rounded-xl",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pending Tasks" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-amber-100 px-2 py-0.5 rounded-md text-xs",
											children: pendingTasks.length
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3 overflow-y-auto max-h-[400px]",
										children: [pendingTasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeTaskCard, {
											task,
											isAdmin,
											onToggle: handleToggleTask,
											onEditNote: (id, note) => {
												setTasks(tasks.map((t) => {
													if (t.id === id) {
														const currentNotes = t.notes || [];
														return {
															...t,
															notes: [...currentNotes, {
																text: note,
																createdAt: (/* @__PURE__ */ new Date()).toISOString()
															}]
														};
													}
													return t;
												}));
											}
										}, task.id)), pendingTasks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-center text-muted-foreground text-sm py-8",
											children: "🎉 All caught up! No pending tasks."
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
										className: "font-semibold text-sm flex items-center justify-between text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Completed Tasks" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-emerald-100 px-2 py-0.5 rounded-md text-xs",
											children: completedTasks.length
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3 overflow-y-auto max-h-[400px]",
										children: [completedTasks.map((task) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeTaskCard, {
											task,
											isAdmin,
											onToggle: handleToggleTask,
											onEditNote: (id, note) => {
												setTasks(tasks.map((t) => {
													if (t.id === id) {
														const currentNotes = t.notes || [];
														return {
															...t,
															notes: [...currentNotes, {
																text: note,
																createdAt: (/* @__PURE__ */ new Date()).toISOString()
															}]
														};
													}
													return t;
												}));
											}
										}, task.id)), completedTasks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-center text-muted-foreground text-sm py-8",
											children: "No tasks completed yet."
										})]
									})]
								})]
							})]
						});
					})(),
					activeTab === "Feeds" && (() => {
						const handlePost = (e) => {
							e.preventDefault();
							if (!feedText.trim()) return;
							setFeeds([{
								id: `feed-${Date.now()}`,
								user: auth?.name || "Manvendra Singhal",
								avatar: auth?.avatar || "/avatars/manvendra.png",
								role: isAdmin ? "HR & Admin Manager" : "Team Member",
								content: feedText,
								date: (/* @__PURE__ */ new Date()).toISOString(),
								likes: 0,
								likedBy: []
							}, ...feeds]);
							setFeedText("");
						};
						const handleLike = (id) => {
							setFeeds(feeds.map((post) => {
								if (post.id === id) {
									const likedBy = post.likedBy || [];
									const userKey = auth?.name || "anonymous";
									const alreadyLiked = likedBy.includes(userKey);
									return {
										...post,
										likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
										likedBy: alreadyLiked ? likedBy.filter((u) => u !== userKey) : [...likedBy, userKey]
									};
								}
								return post;
							}));
						};
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "max-w-2xl mx-auto space-y-6 animate-in fade-in-50 duration-200",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handlePost,
								className: "bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									placeholder: "Share an announcement, update, or thought...",
									value: feedText,
									onChange: (e) => setFeedText(e.target.value),
									className: "w-full min-h-[80px] text-sm bg-secondary/20 focus:bg-background border border-transparent focus:border-border rounded-xl p-3 resize-none focus:outline-none transition-colors"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex justify-end",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										disabled: !feedText.trim(),
										className: "rounded-xl h-9 text-xs px-4",
										children: "Share Post"
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-4",
								children: feeds.map((post) => {
									const userKey = auth?.name || "anonymous";
									const isLiked = (post.likedBy || []).includes(userKey);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3 hover:border-border/80 transition-colors",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: post.avatar || "https://i.pravatar.cc/80",
													alt: post.user,
													className: "h-10 w-10 rounded-full object-cover border"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-sm leading-tight",
													children: post.user
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] text-muted-foreground mt-0.5",
													children: [
														post.role,
														" • ",
														new Date(post.date).toLocaleDateString("en-IN", {
															day: "numeric",
															month: "short",
															hour: "2-digit",
															minute: "2-digit"
														})
													]
												})] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-foreground/90 whitespace-pre-line leading-relaxed",
												children: post.content
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-4 pt-2 border-t text-xs",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													onClick: () => handleLike(post.id),
													className: `flex items-center gap-1.5 font-semibold py-1 px-3 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer ${isLiked ? "text-rose-600" : "text-muted-foreground"}`,
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-4 w-4 ${isLiked ? "fill-rose-600 text-rose-600" : ""}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: post.likes })]
												})
											})
										]
									}, post.id);
								})
							})]
						});
					})(),
					activeTab === "Files" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in-50 duration-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-lg",
								children: "Document Vault"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Access policies, handbooks, and documents."
							})] }), isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => setIsFileModalOpen(true),
								className: "gap-1.5 rounded-xl text-xs h-9",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), " Upload Document"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-card rounded-xl border border-border shadow-sm overflow-hidden",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
								className: "w-full text-sm text-left",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
									className: "bg-secondary/40 text-muted-foreground text-xs font-medium border-b border-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3",
											children: "Document Name"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3",
											children: "Size"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3",
											children: "Upload Date"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3",
											children: "Uploader"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-4 py-3 text-right",
											children: "Action"
										})
									] })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
									className: "divide-y divide-border",
									children: hrFiles.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "hover:bg-secondary/20",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "px-4 py-3.5 flex items-center gap-2 font-medium",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: file.name })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3.5 text-muted-foreground text-xs",
												children: file.size
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3.5 text-muted-foreground text-xs",
												children: new Date(file.date).toLocaleDateString("en-GB", {
													day: "numeric",
													month: "short",
													year: "numeric"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3.5 text-muted-foreground text-xs",
												children: file.uploader
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "px-4 py-3.5 text-right",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => alert(`Simulated download for ${file.name} triggered successfully!`),
													className: "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" })
												})
											})
										]
									}, file.id))
								})]
							})
						})]
					}),
					activeTab === "Time Logs" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in-50 duration-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-lg",
								children: "Time Tracker"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Log hours worked on client itineraries and operations."
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: () => setIsTimeLogModalOpen(true),
								className: "gap-1.5 rounded-xl text-xs h-9",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-4 w-4" }), " Log Hours"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-6 md:grid-cols-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-card rounded-2xl border border-border p-5 shadow-card text-center flex flex-col justify-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
										children: "Logged This Week"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-3xl font-bold mt-2 text-primary",
										children: [timeLogs.reduce((s, l) => s + l.hours, 0), " hrs"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground mt-1",
										children: "Goal: 40 hrs"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "md:col-span-2 bg-card rounded-xl border border-border shadow-sm overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "w-full text-sm text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-secondary/40 text-muted-foreground text-xs font-medium border-b border-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Employee"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Project"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Task Description"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3",
												children: "Hours"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "px-4 py-3 text-right",
												children: "Date"
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
										className: "divide-y divide-border",
										children: timeLogs.map((log) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "hover:bg-secondary/20",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3.5 font-medium",
													children: log.employee
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3.5 text-xs text-primary font-semibold",
													children: log.project
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3.5 text-muted-foreground text-xs max-w-xs truncate",
													title: log.task,
													children: log.task
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3.5 font-bold",
													children: log.hours
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "px-4 py-3.5 text-right text-muted-foreground text-xs",
													children: new Date(log.date).toLocaleDateString("en-GB", {
														day: "numeric",
														month: "short"
													})
												})
											]
										}, log.id))
									})]
								})
							})]
						})]
					}),
					activeTab === "Activities" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in-50 duration-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-lg",
							children: "Activity Logs"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-card rounded-xl border border-border p-6 shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative border-l-2 border-border pl-6 ml-3 space-y-6",
								children: [
									{
										title: "Checked in for the day",
										desc: "Work mode: JTM Mall Office",
										date: "2026-06-19T09:30:00Z",
										user: "Suman Yadav"
									},
									{
										title: "Submitted Maldives Package proposal",
										desc: "Itinerary sent to Mr. Gupta",
										date: "2026-06-19T11:45:00Z",
										user: "Nikita Bairwa"
									},
									{
										title: "Leave request approved",
										desc: "Pushplata Kriplani: Casual Leave approved",
										date: "2026-06-18T16:00:00Z",
										user: "Suman Yadav"
									},
									{
										title: "Schengen Visa processed",
										desc: "Deepak Kumar completed submittals",
										date: "2026-06-17T12:00:00Z",
										user: "Deepak Kumar"
									}
								].map((act, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-[31px] top-0.5 bg-background border-2 border-primary h-4 w-4 rounded-full flex items-center justify-center" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-sm text-foreground",
											children: act.title
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs text-muted-foreground mt-0.5",
											children: [
												act.desc,
												" • By ",
												act.user
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-muted-foreground mt-1",
											children: new Date(act.date).toLocaleDateString("en-IN", {
												day: "numeric",
												month: "short",
												hour: "2-digit",
												minute: "2-digit"
											})
										})
									] })]
								}, i))
							})
						})]
					}),
					activeTab === "Career History" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 animate-in fade-in-50 duration-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-semibold text-lg",
							children: "Career Milestones"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-card rounded-xl border border-border p-6 shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative border-l-2 border-border pl-6 ml-3 space-y-6",
								children: [
									{
										role: "Promoted to HR & Admin Manager",
										dept: "HR & Operations",
										date: "2025-06-01",
										desc: "Overseeing all talent and administrative functions at LookMyHolidays."
									},
									{
										role: "Senior Operations Coordinator",
										dept: "Operations",
										date: "2023-03-15",
										desc: "Managed end-to-end travel reservations and vendors."
									},
									{
										role: "Joined as Operations Associate",
										dept: "Operations",
										date: "2022-01-15",
										desc: "Coordinated local sightseeing itineraries and bookings."
									}
								].map((job, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -left-[31px] top-0.5 bg-background border-2 border-emerald-500 h-4 w-4 rounded-full flex items-center justify-center" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-semibold text-sm text-foreground",
											children: job.role
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-primary font-medium mt-0.5",
											children: job.dept
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted-foreground mt-1",
											children: job.desc
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[10px] text-muted-foreground mt-1",
											children: ["Effective: ", new Date(job.date).toLocaleDateString("en-IN", {
												day: "numeric",
												month: "short",
												year: "numeric"
											})]
										})
									] })]
								}, i))
							})
						})]
					}),
					activeTab === "Related Data" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-6 md:grid-cols-2 animate-in fade-in-50 duration-200",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-lg",
								children: "Exit & Transition Forms"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-card border border-border rounded-xl p-6 text-center text-muted-foreground text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilePenLine, { className: "h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No active exit processes initiated." })]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-lg",
								children: "Travel Requests & Expense Forms"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-card border border-border rounded-xl p-6 text-center text-muted-foreground text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No travel requests filed this quarter." })]
							})]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isLeaveModalOpen,
				onOpenChange: setIsLeaveModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[450px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Apply for Leave" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Submit a leave request. Your manager will review it." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "leave-type",
										children: "Leave Type"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										id: "leave-type",
										value: leaveType,
										onChange: (e) => setLeaveType(e.target.value),
										className: "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Casual Leave" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Sick Leave" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Earned Leave" })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "leave-from",
											children: "From Date"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "leave-from",
											type: "date",
											value: leaveFrom,
											onChange: (e) => setLeaveFrom(e.target.value)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "leave-to",
											children: "To Date"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "leave-to",
											type: "date",
											value: leaveTo,
											onChange: (e) => setLeaveTo(e.target.value)
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "leave-reason",
										children: "Reason"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "leave-reason",
										placeholder: "Reason for leave...",
										value: leaveReason,
										onChange: (e) => setLeaveReason(e.target.value)
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setIsLeaveModalOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								if (!leaveFrom || !leaveTo || !leaveReason) return;
								setLeaves([{
									id: `LV-${Math.floor(100 + Math.random() * 900)}`,
									empId: auth?.empId || "LMH-01",
									empName: auth?.name || "Manvendra Singhal",
									type: leaveType,
									fromDate: leaveFrom,
									toDate: leaveTo,
									reason: leaveReason,
									status: "Pending"
								}, ...leaves]);
								setIsLeaveModalOpen(false);
								setLeaveFrom("");
								setLeaveTo("");
								setLeaveReason("");
							},
							children: "Submit Request"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isFileModalOpen,
				onOpenChange: setIsFileModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[400px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Upload HR Document" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Add a new document to the company files directory." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "file-name",
									children: "Document Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "file-name",
									placeholder: "e.g. Code_of_Conduct_2026.pdf",
									value: newFileName,
									onChange: (e) => setNewFileName(e.target.value)
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "file-size",
									children: "File Size"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "file-size",
									placeholder: "e.g. 1.5 MB",
									value: newFileSize,
									onChange: (e) => setNewFileSize(e.target.value)
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setIsFileModalOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								if (!newFileName || !newFileSize) return;
								setHrFiles([{
									id: `file-${Date.now()}`,
									name: newFileName,
									size: newFileSize,
									date: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
									uploader: auth?.name || "Manvendra Singhal"
								}, ...hrFiles]);
								setIsFileModalOpen(false);
								setNewFileName("");
								setNewFileSize("");
							},
							children: "Upload"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isTimeLogModalOpen,
				onOpenChange: setIsTimeLogModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[400px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Log Work Hours" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Submit your timesheet details for today." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "log-proj",
										children: "Project Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										id: "log-proj",
										value: logProject,
										onChange: (e) => setLogProject(e.target.value),
										className: "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "Select Project"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Grand Journeys Itinerary" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Visa Processing" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Accounts Reconciliation" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Marketing Campaigns" })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "log-task",
										children: "Task Description"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "log-task",
										placeholder: "What did you work on?",
										value: logTask,
										onChange: (e) => setLogTask(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "log-hrs",
											children: "Hours Spent"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "log-hrs",
											type: "number",
											step: "0.5",
											placeholder: "e.g. 4.5",
											value: logHours,
											onChange: (e) => setLogHours(e.target.value)
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "log-dt",
											children: "Date"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "log-dt",
											type: "date",
											value: logDate,
											onChange: (e) => setLogDate(e.target.value)
										})]
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setIsTimeLogModalOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								if (!logProject || !logTask || !logHours) return;
								setTimeLogs([{
									id: `log-${Date.now()}`,
									project: logProject,
									task: logTask,
									hours: parseFloat(logHours),
									date: logDate,
									employee: auth?.name || "Manvendra Singhal"
								}, ...timeLogs]);
								setIsTimeLogModalOpen(false);
								setLogProject("");
								setLogTask("");
								setLogHours("");
							},
							children: "Log Time"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isTaskModalOpen,
				onOpenChange: setIsTaskModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[450px]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create New Task" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Assign a task to an employee." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "t-title",
										children: "Task Title"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "t-title",
										placeholder: "e.g. Call client about Maldives package",
										value: taskTitle,
										onChange: (e) => setTaskTitle(e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "t-type",
											children: "Type"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											id: "t-type",
											value: taskType,
											onChange: (e) => setTaskType(e.target.value),
											className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Call" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Email" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Payment" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Document" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Follow-up" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Other" })
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "t-pri",
											children: "Priority"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											id: "t-pri",
											value: taskPriority,
											onChange: (e) => setTaskPriority(e.target.value),
											className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "High" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Medium" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Low" })
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "t-assignee",
											children: "Assignee"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											id: "t-assignee",
											value: taskAssignee,
											onChange: (e) => setTaskAssignee(e.target.value),
											className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "",
												children: "Select Employee"
											}), employees.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: e.name,
												children: e.name
											}, e.id))]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "t-date",
											children: "Due Date"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "t-date",
											type: "date",
											value: taskDueDate,
											onChange: (e) => setTaskDueDate(e.target.value)
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "t-note",
										children: "Note / Description"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										id: "t-note",
										placeholder: "Optional task details...",
										value: taskNote,
										onChange: (e) => setTaskNote(e.target.value),
										rows: 3,
										className: "flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setIsTaskModalOpen(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								if (!taskTitle || !taskAssignee || !taskDueDate) return;
								setTasks([{
									id: `TSK-${Math.floor(1e3 + Math.random() * 9e3)}`,
									title: taskTitle,
									type: taskType,
									priority: taskPriority,
									assignee: taskAssignee,
									dueDate: taskDueDate,
									status: "Pending",
									note: taskNote
								}, ...tasks]);
								setIsTaskModalOpen(false);
								setTaskTitle("");
								setTaskAssignee("");
								setTaskDueDate("");
								setTaskNote("");
							},
							children: "Create Task"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeProfileModal, {
				employee: selectedEmployee,
				open: !!selectedEmployee,
				onOpenChange: (open) => !open && setSelectedEmployee(null),
				onEmployeeUpdated: () => {
					const stored = localStorage.getItem("crm_employees_v3");
					if (stored) setEmployees(JSON.parse(stored));
				},
				onAssignTask: (name) => {
					setTaskAssignee(name);
					setIsTaskModalOpen(true);
					setSelectedEmployee(null);
				},
				onApproveLeave: () => {
					setActiveTab("Approvals");
					setSelectedEmployee(null);
				}
			}),
			deleteConfirmId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl animate-in zoom-in-95",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-xl font-bold font-display text-foreground",
							children: "Delete Employee?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted-foreground",
							children: "Are you sure you want to delete this employee? This action cannot be undone."
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
									setEmployees(employees.filter((emp) => emp.id !== deleteConfirmId));
									setDeleteConfirmId(null);
								},
								className: "rounded-xl",
								children: "Delete"
							})]
						})
					]
				})
			})
		]
	});
}
//#endregion
export { EmployeesPage as component };
