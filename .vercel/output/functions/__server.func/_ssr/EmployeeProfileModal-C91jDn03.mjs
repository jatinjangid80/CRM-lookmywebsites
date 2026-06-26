import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { t as useLocalStorage } from "./use-local-storage-C6y5r3WN.mjs";
import { C as Send, Dt as Check, E as Plus, Et as ChevronDown, L as Mail, Lt as Award, W as Key, _t as Clock, f as Trash2, i as User, it as FileText, k as Phone, kt as Camera, lt as Eye, n as X, pt as Download, u as TrendingUp, ut as EyeOff, wt as ChevronUp, xt as CircleCheckBig, y as SquarePen } from "../_libs/lucide-react.mjs";
import { n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BvYONHWJ.mjs";
import { n as createDefaultEmployeeDetails, t as INITIAL_EMPLOYEE_DETAILS } from "./employee-profile-defaults-wd6GGcin.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmployeeProfileModal-C91jDn03.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EmployeeProfileModal({ employee, open, onOpenChange, onEmployeeUpdated, onAssignTask, onApproveLeave }) {
	if (!employee) return null;
	const [employeesDetails, setEmployeesDetails] = useLocalStorage("crm_employee_details_v3", INITIAL_EMPLOYEE_DETAILS);
	const empDetails = employeesDetails[employee.id] || createDefaultEmployeeDetails(employee.id, employee.name, employee.role, employee.email, employee.phone);
	const [isEditing, setIsEditing] = (0, import_react.useState)(false);
	const [editDetails, setEditDetails] = (0, import_react.useState)(null);
	const [editAvatar, setEditAvatar] = (0, import_react.useState)(null);
	const [editCore, setEditCore] = (0, import_react.useState)({
		name: "",
		role: "",
		email: "",
		phone: "",
		status: "",
		joinDate: ""
	});
	const [expandedSection, setExpandedSection] = (0, import_react.useState)(null);
	const [leaves, setLeaves] = useLocalStorage("crm_leaves_v1", []);
	const [attendance, setAttendance] = useLocalStorage("crm_attendance_v2", []);
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
	const [hrFiles, setHrFiles] = useLocalStorage("crm_hr_files_v1", [
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
	]);
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
	const [credUsername, setCredUsername] = (0, import_react.useState)("");
	const [credPassword, setCredPassword] = (0, import_react.useState)("");
	const [credConfirm, setCredConfirm] = (0, import_react.useState)("");
	const [showCredPass, setShowCredPass] = (0, import_react.useState)(false);
	const [credSaved, setCredSaved] = (0, import_react.useState)(false);
	const [credError, setCredError] = (0, import_react.useState)("");
	const [showCredModal, setShowCredModal] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setIsEditing(false);
		setEditDetails(null);
		setExpandedSection(null);
		try {
			const raw = localStorage.getItem("crm_employees_v3");
			if (raw) {
				const emp = JSON.parse(raw).find((e) => e.id === employee.id);
				setCredUsername(emp?.username || "");
				setCredPassword(emp?.password || "");
				setCredConfirm(emp?.password || "");
			} else {
				setCredUsername("");
				setCredPassword("");
				setCredConfirm("");
			}
		} catch {
			setCredUsername("");
			setCredPassword("");
			setCredConfirm("");
		}
		setCredSaved(false);
		setCredError("");
		setShowCredModal(false);
	}, [employee.id, open]);
	const handleStartEdit = () => {
		setEditCore({
			name: employee.name,
			role: employee.role,
			email: employee.email,
			phone: employee.phone,
			status: employee.status,
			joinDate: employee.joinDate
		});
		setEditAvatar(null);
		setEditDetails(JSON.parse(JSON.stringify(empDetails)));
		setIsEditing(true);
	};
	const handleCancelEdit = () => {
		setIsEditing(false);
		setEditDetails(null);
	};
	const handleSaveCredentials = () => {
		setCredError("");
		if (!credUsername.trim()) {
			setCredError("Username is required.");
			return;
		}
		if (credPassword.length < 4) {
			setCredError("Password must be at least 4 characters.");
			return;
		}
		if (credPassword !== credConfirm) {
			setCredError("Passwords do not match.");
			return;
		}
		try {
			const raw = localStorage.getItem("crm_employees_v3");
			const list = raw ? JSON.parse(raw) : [];
			const idx = list.findIndex((e) => e.id === employee.id);
			if (idx !== -1) list[idx] = {
				...list[idx],
				username: credUsername.trim(),
				password: credPassword
			};
			else list.push({
				id: employee.id,
				name: employee.name,
				username: credUsername.trim(),
				password: credPassword
			});
			localStorage.setItem("crm_employees_v3", JSON.stringify(list));
			setCredSaved(true);
			setTimeout(() => setCredSaved(false), 3e3);
		} catch (err) {
			setCredError("Failed to save credentials.");
		}
	};
	const handleSave = () => {
		if (!editDetails) return;
		setEmployeesDetails({
			...employeesDetails,
			[employee.id]: editDetails
		});
		try {
			const stored = localStorage.getItem("crm_employees_v3");
			const updatedList = (stored ? JSON.parse(stored) : []).map((e) => {
				if (e.id === employee.id) return {
					...e,
					name: editCore.name,
					role: editCore.role,
					email: editCore.email,
					phone: editCore.phone,
					status: editCore.status,
					joinDate: editCore.joinDate,
					description: editDetails.bio,
					...editAvatar ? { avatar: editAvatar } : {}
				};
				return e;
			});
			localStorage.setItem("crm_employees_v3", JSON.stringify(updatedList));
			const authStored = localStorage.getItem("crm_auth_v1");
			if (authStored) {
				const authObj = JSON.parse(authStored);
				if (authObj.empId === employee.id) {
					if (editAvatar) authObj.avatar = editAvatar;
					localStorage.setItem("crm_auth_v1", JSON.stringify(authObj));
				}
			}
			const authStored2 = localStorage.getItem("crm_auth");
			if (authStored2) {
				const authObj2 = JSON.parse(authStored2);
				if (authObj2.empId === employee.id || authObj2.name.toLowerCase() === employee.name.toLowerCase()) {
					authObj2.name = editCore.name;
					authObj2.role = editCore.role;
					authObj2.email = editCore.email;
					if (editAvatar) authObj2.avatar = editAvatar;
					localStorage.setItem("crm_auth", JSON.stringify(authObj2));
				}
			}
		} catch (err) {
			console.error("Error updating employee list", err);
		}
		setIsEditing(false);
		if (onEmployeeUpdated) onEmployeeUpdated();
	};
	const updateCareer = (index, field, value) => {
		if (!editDetails) return;
		const history = [...editDetails.careerHistory];
		history[index] = {
			...history[index],
			[field]: value
		};
		setEditDetails({
			...editDetails,
			careerHistory: history
		});
	};
	const addCareer = () => {
		if (!editDetails) return;
		setEditDetails({
			...editDetails,
			careerHistory: [...editDetails.careerHistory, {
				company: "",
				position: "",
				startDate: "",
				endDate: "",
				responsibilities: "",
				achievement: ""
			}]
		});
	};
	const deleteCareer = (index) => {
		if (!editDetails) return;
		setEditDetails({
			...editDetails,
			careerHistory: editDetails.careerHistory.filter((_, i) => i !== index)
		});
	};
	const updateAcademic = (index, field, value) => {
		if (!editDetails) return;
		const background = [...editDetails.academicBackground];
		background[index] = {
			...background[index],
			[field]: value
		};
		setEditDetails({
			...editDetails,
			academicBackground: background
		});
	};
	const addAcademic = () => {
		if (!editDetails) return;
		setEditDetails({
			...editDetails,
			academicBackground: [...editDetails.academicBackground, {
				institution: "",
				qualification: "",
				specialization: "",
				year: "",
				grade: ""
			}]
		});
	};
	const deleteAcademic = (index) => {
		if (!editDetails) return;
		setEditDetails({
			...editDetails,
			academicBackground: editDetails.academicBackground.filter((_, i) => i !== index)
		});
	};
	const updateFamily = (index, field, value) => {
		if (!editDetails) return;
		const info = [...editDetails.familyInformation];
		info[index] = {
			...info[index],
			[field]: value
		};
		setEditDetails({
			...editDetails,
			familyInformation: info
		});
	};
	const addFamily = () => {
		if (!editDetails) return;
		setEditDetails({
			...editDetails,
			familyInformation: [...editDetails.familyInformation, {
				name: "",
				relationship: "",
				dob: "",
				contactNumber: ""
			}]
		});
	};
	const deleteFamily = (index) => {
		if (!editDetails) return;
		setEditDetails({
			...editDetails,
			familyInformation: editDetails.familyInformation.filter((_, i) => i !== index)
		});
	};
	const STATUS_COLOR = {
		Active: "bg-emerald-100 text-emerald-800 border-emerald-200",
		"On Leave": "bg-amber-100 text-amber-800 border-amber-200",
		Inactive: "bg-slate-100 text-slate-800 border-slate-200"
	};
	const mockPerf = {
		kpiScore: employee.rating ? Math.round(employee.rating * 20) : 92,
		attendancePct: 98.4,
		projectsCompleted: employee.closedDeals || 12,
		monthlyRating: employee.rating || 4.8,
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-5xl h-[92vh] overflow-y-auto p-0 gap-0 bg-[#F9FAFB] text-[#111827]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "sr-only",
					children: "Company CRM Employee Profile"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
					className: "sr-only",
					children: [
						"Redesigned modern Company CRM Employee Profile for ",
						employee.name,
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-6 md:p-8 space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col md:flex-row items-center gap-5 w-full md:w-auto",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative shrink-0 group",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: editAvatar || employee.avatar,
										alt: employee.name,
										className: "h-20 w-20 rounded-2xl object-cover border border-gray-200 ring-4 ring-[#FF6B00]/10"
									}), isEditing && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										htmlFor: `avatar-upload-${employee.id}`,
										className: "absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Camera, { className: "h-6 w-6 text-white" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] text-white font-bold mt-1",
												children: "Change"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												id: `avatar-upload-${employee.id}`,
												type: "file",
												accept: "image/*",
												className: "hidden",
												onChange: (e) => {
													const file = e.target.files?.[0];
													if (!file) return;
													const reader = new FileReader();
													reader.onload = (ev) => {
														setEditAvatar(ev.target?.result);
													};
													reader.readAsDataURL(file);
												}
											})
										]
									})]
								}), isEditing && editDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-3 w-full md:max-w-md",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "text-[10px] font-bold text-muted-foreground uppercase",
												children: "Full Name"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												value: editCore.name,
												onChange: (e) => setEditCore({
													...editCore,
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
												value: editCore.role,
												onChange: (e) => setEditCore({
													...editCore,
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
												value: editCore.email,
												onChange: (e) => setEditCore({
													...editCore,
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
												value: editCore.status,
												onChange: (e) => setEditCore({
													...editCore,
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
												children: employee.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLOR[employee.status] || "bg-slate-100"}`,
												children: employee.status
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[#FF6B00] font-semibold text-sm",
											children: [
												employee.role,
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
													employee.email
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5" }),
													" ",
													employee.phone
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
										children: employee.id
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-center pl-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] uppercase font-semibold text-muted-foreground tracking-wider",
										children: "Joining Date"
									}), isEditing && editDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "date",
										value: editCore.joinDate,
										onChange: (e) => setEditCore({
											...editCore,
											joinDate: e.target.value
										}),
										className: "text-xs bg-white border border-gray-200 rounded px-1.5 py-0.5 mt-0.5 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-bold text-gray-800 mt-0.5",
										children: new Date(employee.joinDate).toLocaleDateString("en-IN", {
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
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										title: isEditing ? "Actions" : "Quick Actions",
										children: isEditing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
													onClick: () => onAssignTask?.(employee.name),
													className: "w-full justify-start gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-md h-9 text-xs font-semibold transition-all hover:shadow-lg hover:-translate-y-0.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Task"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													variant: "outline",
													onClick: () => {
														const printWindow = window.open("", "_blank");
														if (printWindow) {
															printWindow.document.write(`
                            <html>
                              <head>
                                <title>Employee Profile - ${employee.name}</title>
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
                                <h1>${employee.name}</h1>
                                <div class="subtitle">${employee.role} • ${empDetails.department} (${employee.id})</div>
                                
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
                                    <div class="field"><div class="label">Work Phone</div><div class="value">${employee.phone}</div></div>
                                    <div class="field"><div class="label">Personal Phone</div><div class="value">${empDetails.personalPhone}</div></div>
                                    <div class="field"><div class="label">Work Email</div><div class="value">${employee.email}</div></div>
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
														window.location.href = `mailto:${employee.email}?subject=Regarding CRM Employee Profile`;
													},
													className: "w-full justify-start gap-2 text-xs h-9 hover:text-[#FF6B00] hover:bg-orange-50/50 hover:border-[#FF6B00]/40 transition-colors",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" }), " Send Email"]
												})
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										title: "Login Credentials",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-3 pt-1",
											children: [
												credUsername ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-xl bg-purple-50 border border-purple-100 px-3 py-2.5 flex items-center justify-between",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] font-bold text-purple-500 uppercase tracking-wider",
														children: "Current Login"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xs font-mono font-semibold text-gray-800 mt-0.5",
														children: [
															credUsername,
															" / ",
															"•".repeat(Math.min(credPassword.length, 8))
														]
													})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheckBig, { className: "h-4 w-4 text-purple-400 shrink-0" })]
												}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[11px] text-amber-700 font-medium",
														children: "No credentials set yet."
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3 w-3" }), " Username"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														value: credUsername,
														onChange: (e) => setCredUsername(e.target.value),
														placeholder: "e.g. jatin",
														className: "h-8 text-xs focus-visible:ring-purple-500"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "h-3 w-3" }), " Password"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "relative",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
															type: showCredPass ? "text" : "password",
															value: credPassword,
															onChange: (e) => setCredPassword(e.target.value),
															placeholder: "Min. 4 characters",
															className: "h-8 text-xs pr-8 focus-visible:ring-purple-500"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															type: "button",
															onClick: () => setShowCredPass(!showCredPass),
															className: "absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700",
															children: showCredPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-3.5 w-3.5" })
														})]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "space-y-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
														className: "text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "h-3 w-3" }), " Confirm Password"]
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
														type: showCredPass ? "text" : "password",
														value: credConfirm,
														onChange: (e) => setCredConfirm(e.target.value),
														placeholder: "Re-enter password",
														className: "h-8 text-xs focus-visible:ring-purple-500"
													})]
												}),
												credError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5",
													children: credError
												}),
												credSaved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Saved! Employee can now log in."]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
													onClick: handleSaveCredentials,
													className: "w-full justify-center gap-2 text-xs h-8 bg-purple-600 hover:bg-purple-700 text-white font-bold",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-3.5 w-3.5" }), " Save Credentials"]
												})
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										title: "Reporting Structure",
										children: isEditing && editDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
													label: "Reporting Manager",
													value: editDetails.reportingManager,
													onChange: (v) => setEditDetails({
														...editDetails,
														reportingManager: v
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
													label: "Team Lead",
													value: editDetails.teamLead,
													onChange: (v) => setEditDetails({
														...editDetails,
														teamLead: v
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
													label: "Direct Reports (Comma-separated)",
													value: editDetails.directReports.join(", "),
													onChange: (v) => setEditDetails({
														...editDetails,
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
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										title: "Verification Details",
										children: isEditing && editDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
													label: "PAN Number",
													value: editDetails.panNumber,
													onChange: (v) => setEditDetails({
														...editDetails,
														panNumber: v
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
													label: "Aadhaar Number",
													value: editDetails.aadhaarNumber,
													onChange: (v) => setEditDetails({
														...editDetails,
														aadhaarNumber: v
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
													label: "Passport Number",
													value: editDetails.passportNumber,
													onChange: (v) => setEditDetails({
														...editDetails,
														passportNumber: v
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditSelect, {
													label: "Verification Status",
													value: editDetails.verificationStatus,
													options: [
														"Verified",
														"Pending",
														"Unverified"
													],
													onChange: (v) => setEditDetails({
														...editDetails,
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
														children: employee.id
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
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										title: "Documents Center",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
										})
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6 md:col-span-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										title: "Performance Summary",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										title: "Employment Details",
										children: isEditing && editDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-4 sm:grid-cols-2 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Department",
														value: editDetails.department,
														onChange: (v) => setEditDetails({
															...editDetails,
															department: v
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Designation",
														value: editDetails.designation,
														onChange: (v) => setEditDetails({
															...editDetails,
															designation: v
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditSelect, {
														label: "Employment Type",
														value: editDetails.employmentType,
														options: [
															"Permanent",
															"Contract",
															"Intern",
															"Part-time"
														],
														onChange: (v) => setEditDetails({
															...editDetails,
															employmentType: v
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Work Location",
														value: editDetails.workLocation,
														onChange: (v) => setEditDetails({
															...editDetails,
															workLocation: v
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Reporting Manager",
														value: editDetails.manager,
														onChange: (v) => setEditDetails({
															...editDetails,
															manager: v
														})
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Assigned Team",
														value: editDetails.team,
														onChange: (v) => setEditDetails({
															...editDetails,
															team: v
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Total Experience",
														value: editDetails.experience,
														onChange: (v) => setEditDetails({
															...editDetails,
															experience: v
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Employee Level",
														value: editDetails.level,
														onChange: (v) => setEditDetails({
															...editDetails,
															level: v
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Skills (Comma-separated)",
														value: editDetails.skills.join(", "),
														onChange: (v) => setEditDetails({
															...editDetails,
															skills: v.split(",").map((s) => s.trim()).filter(Boolean)
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Certifications (Comma-separated)",
														value: editDetails.certifications.join(", "),
														onChange: (v) => setEditDetails({
															...editDetails,
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
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										title: "Personal Profile",
										children: isEditing && editDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-4 sm:grid-cols-2 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Date of Birth",
														value: editDetails.dob,
														onChange: (v) => setEditDetails({
															...editDetails,
															dob: v
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditSelect, {
														label: "Gender",
														value: editDetails.gender,
														options: [
															"Female",
															"Male",
															"Other"
														],
														onChange: (v) => setEditDetails({
															...editDetails,
															gender: v
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Nationality",
														value: editDetails.nationality,
														onChange: (v) => setEditDetails({
															...editDetails,
															nationality: v
														})
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditSelect, {
														label: "Marital Status",
														value: editDetails.maritalStatus,
														options: [
															"Single",
															"Married",
															"Divorced",
															"Widowed"
														],
														onChange: (v) => setEditDetails({
															...editDetails,
															maritalStatus: v
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Languages (Comma-separated)",
														value: editDetails.languages.join(", "),
														onChange: (v) => setEditDetails({
															...editDetails,
															languages: v.split(",").map((l) => l.trim()).filter(Boolean)
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "space-y-1",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
															className: "text-[10px] uppercase font-bold text-muted-foreground tracking-wider",
															children: "About / Bio"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
															value: editDetails.bio || "",
															onChange: (e) => setEditDetails({
																...editDetails,
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
															children: employee.description || "Active system user."
														})]
													})
												]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
										title: "Contact Information",
										children: isEditing && editDetails ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid gap-4 sm:grid-cols-2 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Work Phone",
														value: editCore.phone,
														onChange: (v) => setEditCore({
															...editCore,
															phone: v
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Personal Phone",
														value: editDetails.personalPhone,
														onChange: (v) => setEditDetails({
															...editDetails,
															personalPhone: v
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Work Email",
														value: editCore.email,
														onChange: (v) => setEditCore({
															...editCore,
															email: v
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Personal Email",
														value: editDetails.personalEmail,
														onChange: (v) => setEditDetails({
															...editDetails,
															personalEmail: v
														})
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Current Address",
														value: editDetails.currentAddress,
														onChange: (v) => setEditDetails({
															...editDetails,
															currentAddress: v
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Permanent Address",
														value: editDetails.permanentAddress,
														onChange: (v) => setEditDetails({
															...editDetails,
															permanentAddress: v
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EditField, {
														label: "Emergency Contact",
														value: editDetails.emergencyContact,
														onChange: (v) => setEditDetails({
															...editDetails,
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
															children: employee.phone
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
															children: employee.email
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
										})
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									title: "Career History",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
													isEditing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "px-4 py-3 text-right",
														children: "Actions"
													})
												] })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
												className: "divide-y divide-gray-100 text-gray-700 bg-white",
												children: isEditing && editDetails ? editDetails.careerHistory.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
													className: "hover:bg-orange-50/10 transition-colors",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-7 text-xs",
																value: h.company,
																onChange: (e) => updateCareer(i, "company", e.target.value)
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-7 text-xs",
																value: h.position,
																onChange: (e) => updateCareer(i, "position", e.target.value)
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-7 text-xs",
																type: "date",
																value: h.startDate,
																onChange: (e) => updateCareer(i, "startDate", e.target.value)
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-7 text-xs",
																type: "date",
																value: h.endDate,
																onChange: (e) => updateCareer(i, "endDate", e.target.value)
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-7 text-xs",
																value: h.responsibilities,
																onChange: (e) => updateCareer(i, "responsibilities", e.target.value)
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-7 text-xs",
																value: h.achievement,
																onChange: (e) => updateCareer(i, "achievement", e.target.value)
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5 text-right",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																size: "icon",
																variant: "ghost",
																className: "h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50",
																onClick: () => deleteCareer(i),
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
									}), isEditing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "pt-2 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											className: "text-[#FF6B00] border-[#FF6B00]/30 hover:bg-orange-50 text-xs",
											onClick: addCareer,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3 mr-1" }), " Add Experience Row"]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									title: "Academic Background",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
													isEditing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "px-4 py-3 text-right",
														children: "Actions"
													})
												] })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
												className: "divide-y divide-gray-100 text-gray-700 bg-white",
												children: isEditing && editDetails ? editDetails.academicBackground.map((a, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
													className: "hover:bg-orange-50/10 transition-colors",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-7 text-xs",
																value: a.institution,
																onChange: (e) => updateAcademic(i, "institution", e.target.value)
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-7 text-xs",
																value: a.qualification,
																onChange: (e) => updateAcademic(i, "qualification", e.target.value)
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-7 text-xs",
																value: a.specialization,
																onChange: (e) => updateAcademic(i, "specialization", e.target.value)
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-7 text-xs",
																value: a.year,
																onChange: (e) => updateAcademic(i, "year", e.target.value)
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-7 text-xs",
																value: a.grade,
																onChange: (e) => updateAcademic(i, "grade", e.target.value)
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5 text-right",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																size: "icon",
																variant: "ghost",
																className: "h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50",
																onClick: () => deleteAcademic(i),
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
									}), isEditing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "pt-2 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											className: "text-[#FF6B00] border-[#FF6B00]/30 hover:bg-orange-50 text-xs",
											onClick: addAcademic,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3 mr-1" }), " Add Qualification Row"]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
									title: "Family Information",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
													isEditing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
														className: "px-4 py-3 text-right",
														children: "Actions"
													})
												] })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
												className: "divide-y divide-gray-100 text-gray-700 bg-white",
												children: isEditing && editDetails ? editDetails.familyInformation.map((f, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
													className: "hover:bg-orange-50/10 transition-colors",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-7 text-xs",
																value: f.name,
																onChange: (e) => updateFamily(i, "name", e.target.value)
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-7 text-xs",
																value: f.relationship,
																onChange: (e) => updateFamily(i, "relationship", e.target.value)
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-7 text-xs",
																type: "date",
																value: f.dob,
																onChange: (e) => updateFamily(i, "dob", e.target.value)
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
																className: "h-7 text-xs",
																value: f.contactNumber,
																onChange: (e) => updateFamily(i, "contactNumber", e.target.value)
															})
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "px-2 py-1.5 text-right",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
																size: "icon",
																variant: "ghost",
																className: "h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50",
																onClick: () => deleteFamily(i),
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
									}), isEditing && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "pt-2 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											variant: "outline",
											size: "sm",
											className: "text-[#FF6B00] border-[#FF6B00]/30 hover:bg-orange-50 text-xs",
											onClick: addFamily,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3 mr-1" }), " Add Dependent Row"]
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									title: "Employee Records",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
															const empLeaves = leaves.filter((l) => l.empId === employee.id);
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
																						empId: employee.id,
																						empName: employee.name,
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
															const empAtt = attendance.filter((a) => a.empId === employee.id);
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
																						empId: employee.id,
																						name: employee.name,
																						role: employee.role,
																						phone: employee.phone,
																						avatar: employee.avatar,
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
															const empRev = reviews.filter((r) => r.empId === employee.id);
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
																						empId: employee.id,
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
															const empDocs = hrFiles.filter((d) => d.empId === employee.id || !d.empId);
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
																						empId: employee.id,
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
															const empPay = payroll.filter((p) => p.empId === employee.id);
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
																						empId: employee.id,
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
															const empAssets = assets.filter((a) => a.empId === employee.id);
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
																						empId: employee.id,
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
															const empCerts = certificates.filter((c) => c.empId === employee.id);
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
																						empId: employee.id,
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
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
									title: "Activity Timeline",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
									})
								})
							]
						})
					]
				})
			]
		})
	}), showCredModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: showCredModal,
		onOpenChange: setShowCredModal,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "max-w-sm",
			"aria-describedby": "cred-modal-desc",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
					className: "flex items-center gap-2 text-base font-bold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "h-4 w-4 text-purple-600" }), "Set Login Credentials"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
					id: "cred-modal-desc",
					className: "text-xs text-muted-foreground",
					children: [
						"Assign a username and password so ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold text-gray-800",
							children: employee.name
						}),
						" can log in to the CRM portal."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-3.5 w-3.5" }), " Username"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: credUsername,
								onChange: (e) => setCredUsername(e.target.value),
								placeholder: "e.g. nikita",
								className: "h-9 text-sm focus-visible:ring-purple-500"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "h-3.5 w-3.5" }), " Password"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: showCredPass ? "text" : "password",
									value: credPassword,
									onChange: (e) => setCredPassword(e.target.value),
									placeholder: "Min. 4 characters",
									className: "h-9 text-sm pr-10 focus-visible:ring-purple-500"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setShowCredPass(!showCredPass),
									className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700",
									children: showCredPass ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Key, { className: "h-3.5 w-3.5" }), " Confirm Password"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: showCredPass ? "text" : "password",
								value: credConfirm,
								onChange: (e) => setCredConfirm(e.target.value),
								placeholder: "Re-enter password",
								className: "h-9 text-sm focus-visible:ring-purple-500"
							})]
						}),
						credError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2",
							children: credError
						}),
						credSaved && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Credentials saved! Employee can now log in."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2 pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: handleSaveCredentials,
								className: "flex-1 gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-9",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), " Save Credentials"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								onClick: () => setShowCredModal(false),
								className: "flex-1 text-xs h-9",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4 mr-1" }), " Cancel"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-muted-foreground text-center pt-1 border-t border-gray-100",
							children: [
								"Employee ID: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-mono font-semibold",
									children: employee.id
								}),
								" · Role: ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: employee.role
								})
							]
						})
					]
				})
			]
		})
	})] });
}
function Card({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-bold text-base text-gray-900 border-b border-gray-100 pb-2",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children })]
	});
}
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
//#endregion
export { EmployeeProfileModal as t };
