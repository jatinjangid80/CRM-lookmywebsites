import { i as __toESM } from "../_runtime.mjs";
import { n as getAuth } from "./auth-B0Z-CWJL.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn, t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { t as useLocalStorage } from "./use-local-storage-C6y5r3WN.mjs";
import { At as CalendarDays, Dt as Check, E as Plus, Et as ChevronDown, Ft as Briefcase, H as LayoutGrid, I as MapPin, L as Mail, P as Package, Pt as Building2, Q as Funnel, St as CircleAlert, Tt as ChevronRight, Z as Globe, b as Sparkles, h as Table2, i as User, it as FileText, k as Phone, n as X, o as UserCheck, pt as Download, q as IndianRupee, r as Users, s as Upload, u as TrendingUp, w as Search, wt as ChevronUp, x as Shield } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BvYONHWJ.mjs";
import { n as formatINR, r as leads } from "./mock-data-4__fbKqF.mjs";
import { t as ImportModal } from "./import-modal-CK1ZeX3c.mjs";
import { t as INITIAL_EMPLOYEES } from "./crm.employees-CDZEcDLI.mjs";
import { t as EmployeeProfileCard } from "./EmployeeProfileCard-SAOwbpeD.mjs";
import { a as SelectItemIndicator, c as SelectPortal, d as SelectSeparator$1, f as SelectTrigger$1, i as SelectItem$1, l as SelectScrollDownButton$1, m as SelectViewport, n as SelectContent$1, o as SelectItemText, p as SelectValue$1, r as SelectIcon, s as SelectLabel$1, t as Select$1, u as SelectScrollUpButton$1 } from "../_libs/@radix-ui/react-select+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm.leads-BmRZmJvp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Select = Select$1;
var SelectValue = SelectValue$1;
var SelectTrigger = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectTrigger$1, {
	ref,
	className: cn("flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background cursor-pointer data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectIcon, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4 opacity-50" })
	})]
}));
SelectTrigger.displayName = SelectTrigger$1.displayName;
var SelectScrollUpButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-4 w-4" })
}));
SelectScrollUpButton.displayName = SelectScrollUpButton$1.displayName;
var SelectScrollDownButton = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton$1, {
	ref,
	className: cn("flex cursor-default items-center justify-center py-1", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
}));
SelectScrollDownButton.displayName = SelectScrollDownButton$1.displayName;
var SelectContent = import_react.forwardRef(({ className, children, position = "popper", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPortal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent$1, {
	ref,
	className: cn("relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-select-content-transform-origin)", position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1", className),
	position,
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollUpButton, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewport, {
			className: cn("p-1", position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"),
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollDownButton, {})
	]
}) }));
SelectContent.displayName = SelectContent$1.displayName;
var SelectLabel = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectLabel$1, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", className),
	...props
}));
SelectLabel.displayName = SelectLabel$1.displayName;
var SelectItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectItem$1, {
	ref,
	className: cn("relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute right-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemIndicator, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemText, { children })]
}));
SelectItem.displayName = SelectItem$1.displayName;
var SelectSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectSeparator$1, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
SelectSeparator.displayName = SelectSeparator$1.displayName;
var AVATARS = [""];
var SOURCES = [
	"Instagram",
	"Facebook",
	"WhatsApp",
	"Walk-in",
	"Website",
	"Referral",
	"Ads",
	"BNI",
	"DD Pharma",
	"Other",
	"Old Ref",
	"BNI INC"
];
var SOURCE_COLORS = {
	"Instagram": "bg-pink-400",
	"Facebook": "bg-blue-600",
	"WhatsApp": "bg-emerald-700",
	"Walk-in": "bg-yellow-200",
	"Website": "bg-orange-500",
	"Referral": "bg-purple-300",
	"Ads": "bg-gray-200",
	"BNI": "bg-teal-800",
	"DD Pharma": "bg-green-200",
	"Other": "bg-pink-200",
	"Old Ref": "bg-blue-300",
	"BNI INC": "bg-green-400"
};
var SERVICES = [
	{
		group: "Travel Services",
		items: [
			{
				label: "Air Ticket",
				icon: "✈️"
			},
			{
				label: "Hotel Booking",
				icon: "🏨"
			},
			{
				label: "Visa",
				icon: "🛂"
			},
			{
				label: "Cruise Booking",
				icon: "🚢"
			},
			{
				label: "Passport Assistance",
				icon: "📘"
			},
			{
				label: "Forex Exchange",
				icon: "💱"
			},
			{
				label: "Airport Transfer",
				icon: "🚕"
			},
			{
				label: "Car Rental",
				icon: "🚗"
			},
			{
				label: "Train Ticket",
				icon: "🚆"
			},
			{
				label: "Bus Ticket",
				icon: "🚌"
			},
			{
				label: "Taxi Booking",
				icon: "🚕"
			},
			{
				label: "Travel Insurance",
				icon: "🛡️"
			}
		]
	},
	{
		group: "Holiday Packages",
		items: [
			{
				label: "International Package",
				icon: "🌍"
			},
			{
				label: "Domestic Package",
				icon: "🏝"
			},
			{
				label: "Honeymoon Package",
				icon: "💖"
			},
			{
				label: "Family Package",
				icon: "👨‍👩‍👧‍👦"
			},
			{
				label: "Group Tour",
				icon: "🚌"
			},
			{
				label: "Corporate Tour",
				icon: "🏢"
			},
			{
				label: "Luxury Tour",
				icon: "✨"
			},
			{
				label: "Adventure Tour",
				icon: "🧗"
			}
		]
	},
	{
		group: "Business",
		items: [
			{
				label: "Corporate Travel",
				icon: "💼"
			},
			{
				label: "MICE Events",
				icon: "🎤"
			},
			{
				label: "Conference Booking",
				icon: "🎟"
			}
		]
	},
	{
		group: "Insurance Services",
		items: [{
			label: "General Insurance",
			icon: "🛡️"
		}]
	}
];
var SERVICE_ICONS = SERVICES.reduce((acc, group) => {
	group.items.forEach((item) => acc[item.label] = item.icon);
	return acc;
}, {});
leads.map((l, i) => ({
	...l,
	avatar: AVATARS[i % AVATARS.length],
	notes: ""
}));
var STATUSES = [
	"New Lead",
	"Contacted",
	"Quotation Sent",
	"Negotiation",
	"Booked",
	"Completed",
	"Lost"
];
var STATUS_PILL = {
	"New Lead": "bg-blue-100 text-blue-700",
	Contacted: "bg-amber-100 text-amber-700",
	"Quotation Sent": "bg-cyan-100 text-cyan-700",
	Negotiation: "bg-purple-100 text-purple-700",
	Booked: "bg-indigo-100 text-indigo-700",
	Completed: "bg-emerald-100 text-emerald-700",
	Lost: "bg-rose-100 text-rose-700"
};
var STATUS_ACCENT = {
	"New Lead": "border-l-blue-400",
	Contacted: "border-l-amber-400",
	"Quotation Sent": "border-l-cyan-400",
	Negotiation: "border-l-purple-400",
	Booked: "border-l-indigo-400",
	Completed: "border-l-emerald-400",
	Lost: "border-l-rose-400"
};
var STATUS_DOT = {
	"New Lead": "bg-blue-500",
	Contacted: "bg-amber-500",
	"Quotation Sent": "bg-cyan-500",
	Negotiation: "bg-purple-500",
	Booked: "bg-indigo-500",
	Completed: "bg-emerald-500",
	Lost: "bg-rose-500"
};
var PRIORITY_BADGE = {
	High: "🔴 High",
	Medium: "🟡 Medium",
	Low: "🟢 Low"
};
var SOURCE_ICONS = {
	Website: "🌐",
	Instagram: "📸",
	Referral: "🤝",
	"Google Ads": "🔍",
	WhatsApp: "💬",
	"Walk-in": "🚶"
};
function initials(n) {
	return n.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}
var EMPTY_FORM = {
	name: "",
	phone: "",
	email: "",
	destination: "",
	budget: "",
	travelDate: "",
	source: SOURCES[0],
	reference: "",
	status: "New Lead",
	assignedTo: "",
	pax: "2",
	notes: "",
	service: "International Package",
	priority: "Medium",
	packageType: "",
	insuranceDate: "",
	policyType: "Four Wheeler",
	queryType: "New",
	clientCompany: "",
	expiryDate: ""
};
function AddLeadModal({ onClose, onAdd, existingLeads }) {
	const [localEmployees] = useLocalStorage("crm_employees_v3", INITIAL_EMPLOYEES);
	const employees = localEmployees?.length ? localEmployees : INITIAL_EMPLOYEES;
	const auth = getAuth();
	const assignees = Array.from(new Set([
		...employees.map((e) => e.name),
		...auth?.name ? [auth.name] : [],
		"Other"
	]));
	const [form, setForm] = (0, import_react.useState)({
		...EMPTY_FORM,
		assignedTo: assignees[0] || ""
	});
	const isInsurance = form.service.toLowerCase().includes("insurance");
	const canSubmit = isInsurance ? form.name.trim() && form.phone.trim() && form.insuranceDate : form.name.trim() && form.phone.trim() && form.destination && form.travelDate;
	const set = (k) => (e) => setForm((f) => ({
		...f,
		[k]: e.target.value
	}));
	const fieldCls = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow";
	const submit = () => {
		if (!canSubmit) return;
		const lmhLeads = existingLeads.filter((l) => l.id.startsWith("LMH-"));
		let nextNum = 1;
		if (lmhLeads.length > 0) {
			const nums = lmhLeads.map((l) => {
				const parts = l.id.split("-");
				const n = parseInt(parts[1], 10);
				return isNaN(n) ? 0 : n;
			});
			nextNum = Math.max(...nums) + 1;
		}
		const pad = (num, size) => {
			let s = num + "";
			while (s.length < size) s = "0" + s;
			return s;
		};
		onAdd({
			id: `LMH-${pad(nextNum, 3)}`,
			name: form.name,
			phone: form.phone,
			email: form.email,
			destination: isInsurance ? form.clientCompany || "Insurance" : form.destination,
			budget: isInsurance ? 0 : Number(form.budget) || 0,
			travelDate: isInsurance ? form.insuranceDate : form.travelDate,
			status: form.status,
			source: form.source,
			reference: form.reference,
			createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			avatar: "",
			assignedTo: form.assignedTo,
			notes: form.notes,
			pax: isInsurance ? 1 : Number(form.pax) || 2,
			service: form.service,
			priority: form.priority,
			packageType: isInsurance ? `${form.policyType} (${form.queryType})` : form.packageType,
			insuranceDate: isInsurance ? form.insuranceDate : void 0,
			policyType: isInsurance ? form.policyType : void 0,
			queryType: isInsurance ? form.queryType : void 0,
			clientCompany: isInsurance ? form.clientCompany : void 0,
			expiryDate: isInsurance ? form.expiryDate : void 0
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm",
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl border border-border bg-background shadow-2xl animate-float-up",
			style: { animationDuration: "0.25s" },
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mt-3 h-1 w-10 rounded-full bg-border sm:hidden" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-6 pt-5 pb-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "grid h-9 w-9 place-items-center rounded-xl text-primary-foreground",
							style: { background: "var(--gradient-brand)" },
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-bold",
							children: "Add New Lead"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Enter inquiry details below"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-xl p-2 hover:bg-secondary transition-colors",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-4 px-6 pt-5 pb-6 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mb-1.5 block text-sm font-semibold",
								children: ["Full name ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "lead-name",
								placeholder: "e.g. Priya Sharma",
								value: form.name,
								onChange: set("name"),
								className: "rounded-xl"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mb-1.5 block text-sm font-semibold",
							children: ["Phone ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-red-500",
								children: "*"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "lead-phone",
							placeholder: "+91 98200 00000",
							value: form.phone,
							onChange: set("phone"),
							className: "rounded-xl"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-sm font-semibold",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "lead-email",
							type: "email",
							placeholder: "name@example.com",
							value: form.email,
							onChange: set("email"),
							className: "rounded-xl"
						})] }),
						isInsurance ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1.5 block text-sm font-semibold",
								children: "Expiry Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "lead-exp-date",
								type: "date",
								value: form.expiryDate,
								onChange: set("expiryDate"),
								className: "rounded-xl"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1.5 block text-sm font-semibold",
								children: "Policy Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "lead-policy-type",
								value: form.policyType,
								onChange: set("policyType"),
								className: fieldCls,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Four Wheeler" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Two Wheeler" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "School Bus" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Pickup" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Tractor" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Health" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "LIC" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Commercial Vehicle" })
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1.5 block text-sm font-semibold",
								children: "Query Type"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								id: "lead-query-type",
								value: form.queryType,
								onChange: set("queryType"),
								className: fieldCls,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "New" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Renewal" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Expired" })
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "sm:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1.5 block text-sm font-semibold",
									children: "Client / Company"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "lead-client-company",
									placeholder: "e.g. Acme Corp...",
									value: form.clientCompany,
									onChange: set("clientCompany"),
									className: "rounded-xl"
								})]
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mb-1.5 block text-sm font-semibold",
								children: ["Destination ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "lead-destination",
								placeholder: "e.g. Bali, Paris...",
								value: form.destination,
								onChange: set("destination"),
								className: "rounded-xl"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mb-1.5 block text-sm font-semibold",
								children: ["Travel date ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-red-500",
									children: "*"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "lead-date",
								type: "date",
								value: form.travelDate,
								onChange: set("travelDate"),
								className: "rounded-xl"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1.5 block text-sm font-semibold",
								children: "Budget (₹)"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "lead-budget",
								type: "number",
								placeholder: "e.g. 85000",
								value: form.budget,
								onChange: set("budget"),
								className: "rounded-xl"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-1.5 block text-sm font-semibold",
								children: "Travellers"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "lead-pax",
								type: "number",
								min: 1,
								max: 50,
								value: form.pax,
								onChange: set("pax"),
								className: "rounded-xl"
							})] })
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-sm font-semibold",
							children: "Source"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: form.source,
							onValueChange: (val) => setForm((prev) => ({
								...prev,
								source: val
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								id: "lead-source",
								className: "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm h-10 focus:outline-none focus:ring-2 focus:ring-primary transition-shadow",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select a source" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: SOURCES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-3 w-3 rounded-full ${SOURCE_COLORS[s] || "bg-gray-200"}` }), s]
								})
							}, s)) })]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-sm font-semibold",
							children: "Reference"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "lead-reference",
							placeholder: "e.g. John Doe...",
							value: form.reference,
							onChange: set("reference"),
							className: "rounded-xl"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-sm font-semibold",
							children: "Assign to"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "lead-assignee",
							value: form.assignedTo,
							onChange: set("assignedTo"),
							className: fieldCls,
							children: assignees.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: a }, a))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mb-1.5 block text-sm font-semibold",
							children: ["Service ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-red-500",
								children: "*"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
							id: "lead-service",
							value: form.service,
							onChange: set("service"),
							className: fieldCls,
							children: SERVICES.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
								label: g.group,
								children: g.items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: i.label,
									children: [
										i.icon,
										" ",
										i.label
									]
								}, i.label))
							}, g.group))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-sm font-semibold",
							children: "Priority"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							id: "lead-priority",
							value: form.priority,
							onChange: set("priority"),
							className: fieldCls,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "High",
									children: "🔴 High"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Medium",
									children: "🟡 Medium"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Low",
									children: "🟢 Low"
								})
							]
						})] }),
						!isInsurance && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "mb-1.5 block text-sm font-semibold",
							children: "Package Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "lead-packageType",
							placeholder: "e.g. Honeymoon, Custom",
							value: form.packageType,
							onChange: set("packageType"),
							className: "rounded-xl"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "mb-2 block text-sm font-semibold",
								children: "Status"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2",
								children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setForm((f) => ({
										...f,
										status: s
									})),
									className: `flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${form.status === s ? `${STATUS_PILL[s]} border-transparent shadow-sm` : "border-border bg-background text-muted-foreground hover:bg-secondary"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${STATUS_DOT[s]}` }), s]
								}, s))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "mb-1.5 block text-sm font-semibold",
								children: [
									isInsurance ? "Description" : "Notes",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground font-normal",
										children: "(optional)"
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								id: "lead-notes",
								rows: 2,
								placeholder: isInsurance ? "Policy details or description..." : "Any special requests or context...",
								value: form.notes,
								onChange: set("notes"),
								className: "w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3 sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								className: "flex-1 rounded-xl",
								onClick: onClose,
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								id: "submit-lead-btn",
								className: "flex-1 gap-2 rounded-xl",
								disabled: !canSubmit,
								style: { background: canSubmit ? "var(--gradient-brand)" : void 0 },
								onClick: submit,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Lead"]
							})]
						})
					]
				})
			]
		})
	});
}
function LeadDetail({ lead, onClose, onStatusChange, onDelete, isAdmin, onEditNote }) {
	const [isEditingNote, setIsEditingNote] = (0, import_react.useState)(false);
	const [editNoteText, setEditNoteText] = (0, import_react.useState)(lead.notes || "");
	const [deleteConfirmId, setDeleteConfirmId] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm",
		onClick: (e) => {
			if (e.target === e.currentTarget) onClose();
		},
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex h-full w-full max-w-md flex-col overflow-y-auto bg-background shadow-2xl animate-float-up",
			style: {
				animationDuration: "0.2s",
				animationName: "slide-in"
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-6 py-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-bold",
						children: "Lead Detail"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded-xl p-2 hover:bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-6 p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-4",
							children: [lead.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: lead.avatar,
								alt: lead.name,
								className: "h-16 w-16 rounded-2xl object-cover shrink-0"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-16 w-16 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-8 w-8 text-gray-400" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-xl font-bold",
									children: lead.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground",
									children: [
										lead.id,
										" · Created ",
										lead.createdAt
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${STATUS_PILL[lead.status]}`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${STATUS_DOT[lead.status]}` }), lead.status]
									})
								})
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 rounded-2xl border border-border bg-secondary/30 p-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Contact"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `tel:${lead.phone}`,
										className: "hover:underline",
										children: lead.phone
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
										href: `mailto:${lead.email}`,
										className: "hover:underline",
										children: lead.email || "—"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 rounded-2xl border border-border bg-secondary/30 p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: lead.service.toLowerCase().includes("insurance") ? "Insurance Details" : "Trip Details"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-3",
								children: lead.service.toLowerCase().includes("insurance") ? [
									{
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4 text-primary" }),
										label: "Expiry Date",
										val: lead.expiryDate || "—"
									},
									{
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4 text-primary" }),
										label: "Policy Type",
										val: lead.policyType || "—"
									},
									{
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-primary" }),
										label: "Query Type",
										val: lead.queryType || "—"
									},
									{
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4 text-primary" }),
										label: "Client / Company",
										val: lead.clientCompany || "—"
									},
									{
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4 text-primary" }),
										label: "Reference",
										val: lead.reference || "—"
									},
									{
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4 text-primary" }),
										label: "Source",
										val: `${SOURCE_ICONS[lead.source] || ""} ${lead.source}`
									},
									{
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4 text-primary" }),
										label: "Service",
										val: `${SERVICE_ICONS[lead.service] || ""} ${lead.service}`
									}
								].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-0.5 shrink-0",
										children: r.icon
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: r.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: r.val
									})] })]
								}, r.label)) : [
									{
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 text-primary" }),
										label: "Destination",
										val: lead.destination
									},
									{
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "h-4 w-4 text-primary" }),
										label: "Budget",
										val: formatINR(lead.budget)
									},
									{
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, { className: "h-4 w-4 text-primary" }),
										label: "Travel Date",
										val: lead.travelDate
									},
									{
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4 text-primary" }),
										label: "Travellers",
										val: `${lead.pax} pax`
									},
									{
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "h-4 w-4 text-primary" }),
										label: "Source",
										val: `${SOURCE_ICONS[lead.source] || ""} ${lead.source}`
									},
									{
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Briefcase, { className: "h-4 w-4 text-primary" }),
										label: "Service",
										val: `${SERVICE_ICONS[lead.service] || ""} ${lead.service}`
									},
									{
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Package, { className: "h-4 w-4 text-primary" }),
										label: "Package",
										val: lead.packageType || "—"
									},
									{
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-primary" }),
										label: "Priority",
										val: PRIORITY_BADGE[lead.priority] || lead.priority
									}
								].map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-0.5 shrink-0",
										children: r.icon
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: r.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold",
										children: r.val
									})] })]
								}, r.label))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
								children: "Assignee"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeProfileCard, { employeeName: lead.assignedTo })]
						}),
						isEditingNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-secondary/30 p-4 animate-in fade-in slide-in-from-top-2 duration-200",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "mb-1.5 block text-xs font-semibold text-foreground uppercase tracking-wider",
									children: ["Note ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground font-normal normal-case",
										children: "(optional)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									autoFocus: true,
									placeholder: "Context or reminder details...",
									value: editNoteText,
									onChange: (e) => setEditNoteText(e.target.value),
									rows: 2,
									className: "w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex gap-2 mt-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "outline",
										className: "h-8 text-xs rounded-lg px-4",
										onClick: () => {
											setIsEditingNote(false);
											setEditNoteText(lead.notes || "");
										},
										children: "Cancel"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										className: "h-8 text-xs rounded-lg px-4",
										onClick: () => {
											onEditNote?.(lead.id, editNoteText);
											setIsEditingNote(false);
										},
										children: "Save Note"
									})]
								})
							]
						}) : lead.notes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-secondary/30 p-4 group/note relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between mb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: "Notes"
								}), isAdmin && onEditNote && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setEditNoteText(lead.notes || "");
										setIsEditingNote(true);
									},
									className: "text-[10px] text-blue-500 hover:underline opacity-0 group-hover/note:opacity-100 transition-opacity",
									children: "Edit Note"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground italic",
								children: [
									"\"",
									lead.notes,
									"\""
								]
							})]
						}) : isAdmin && onEditNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-2xl border border-border border-dashed p-4 flex items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => {
									setEditNoteText("");
									setIsEditingNote(true);
								},
								className: "text-xs text-blue-500 hover:underline",
								children: "+ Add Note"
							})
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: "Move to stage"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => onStatusChange(lead.id, s),
								className: `flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${lead.status === s ? `${STATUS_PILL[s]} border-transparent shadow-sm` : "border-border bg-background text-muted-foreground hover:bg-secondary"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${STATUS_DOT[s]}` }), s]
							}, s))
						})] })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 border-t border-border p-6",
					children: [
						isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "destructive",
							className: "flex-none gap-2 rounded-xl",
							onClick: () => setDeleteConfirmId(lead.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), " Delete"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "flex-1 gap-2 rounded-xl",
							onClick: () => window.location.href = `tel:${lead.phone}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4" }), " Call"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "flex-1 gap-2 rounded-xl",
							style: { background: "var(--gradient-brand)" },
							onClick: () => window.location.href = `mailto:${lead.email}?subject=Your Quote from Grand Journeys`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4" }), " Send Quote"]
						})
					]
				})
			]
		}), deleteConfirmId && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl animate-in zoom-in-95",
				onClick: (e) => e.stopPropagation(),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-xl font-bold font-display text-foreground",
						children: "Delete Lead?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Are you sure you want to delete this lead? This action cannot be undone."
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
								onDelete(deleteConfirmId);
								setDeleteConfirmId(null);
							},
							className: "rounded-xl",
							children: "Delete"
						})]
					})
				]
			})
		})]
	});
}
function KanbanCol({ status, leads, onSelect, onDropLead }) {
	const handleDragOver = (e) => {
		e.preventDefault();
	};
	const handleDrop = (e) => {
		e.preventDefault();
		const leadId = e.dataTransfer.getData("leadId");
		if (leadId) onDropLead(leadId);
	};
	const total = leads.reduce((s, l) => s + l.budget, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-w-[220px] flex-1 flex-col rounded-2xl border border-border bg-secondary/30 p-3 transition-colors hover:bg-secondary/50",
		onDragOver: handleDragOver,
		onDrop: handleDrop,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between px-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-2 w-2 rounded-full ${STATUS_DOT[status]}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs font-bold uppercase tracking-wider",
						children: status
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded-full bg-border px-2 py-0.5 text-xs font-semibold",
					children: leads.length
				})]
			}),
			total > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 px-1 text-xs text-muted-foreground",
				children: formatINR(total)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 min-h-[100px]",
				children: [leads.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					draggable: true,
					onDragStart: (e) => {
						e.dataTransfer.setData("leadId", l.id);
					},
					onClick: () => onSelect(l),
					className: "group rounded-xl border border-border bg-card p-3 text-left shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 cursor-grab active:cursor-grabbing",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								l.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: l.avatar,
									alt: l.name,
									className: "h-7 w-7 rounded-lg object-cover shrink-0"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-7 w-7 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-gray-400" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs font-semibold",
										children: l.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-xs text-muted-foreground",
										children: l.service.toLowerCase().includes("insurance") ? `${l.policyType || "Insurance"} · ${l.clientCompany || "—"}` : l.destination
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" })
							]
						}),
						l.budget > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-xs font-bold text-primary",
							children: formatINR(l.budget)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs font-medium text-muted-foreground",
							children: [
								SERVICE_ICONS[l.service],
								" ",
								l.service
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-xs text-muted-foreground",
							children: [
								PRIORITY_BADGE[l.priority],
								" · ",
								l.service.toLowerCase().includes("insurance") ? l.insuranceDate || l.travelDate : l.travelDate
							]
						})
					]
				}, l.id)), leads.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "py-6 text-center text-xs text-muted-foreground/50",
					children: "No leads"
				})]
			})
		]
	});
}
function LeadsPage() {
	const [leads, setLeads] = useLocalStorage("crm_leads_v2", []);
	const [localEmployees] = useLocalStorage("crm_employees_v3", INITIAL_EMPLOYEES);
	const employees = localEmployees?.length ? localEmployees : INITIAL_EMPLOYEES;
	const [newNote, setNewNote] = (0, import_react.useState)("");
	const [deleteConfirmId, setDeleteConfirmId] = (0, import_react.useState)(null);
	const [q, setQ] = (0, import_react.useState)("");
	const [filterStatus, setFilterStatus] = (0, import_react.useState)("All");
	const [view, setView] = (0, import_react.useState)("table");
	const [showModal, setShowModal] = (0, import_react.useState)(false);
	const [isImportOpen, setIsImportOpen] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(null);
	const [isExportOpen, setIsExportOpen] = (0, import_react.useState)(false);
	const auth = getAuth();
	const isAdmin = auth?.role === "admin" || auth?.role === "HR & Admin Manager";
	const assignees = Array.from(new Set([
		...employees.map((e) => e.name),
		...auth?.name ? [auth.name] : [],
		"Other"
	]));
	const exportToExcel = () => {
		const csvContent = [[
			"ID",
			"Name",
			"Phone",
			"Email",
			"Destination",
			"Budget",
			"Travel Date",
			"Pax",
			"Source",
			"Reference",
			"Status",
			"Assigned To",
			"Service",
			"Priority",
			"Created At"
		].join(","), ...filtered.map((l) => [
			`"${l.id}"`,
			`"${l.name.replace(/"/g, "\"\"")}"`,
			`"${l.phone}"`,
			`"${l.email}"`,
			`"${l.destination.replace(/"/g, "\"\"")}"`,
			l.budget,
			`"${l.travelDate}"`,
			l.pax,
			`"${l.source}"`,
			`"${l.reference || ""}"`,
			`"${l.status}"`,
			`"${l.assignedTo}"`,
			`"${l.service}"`,
			`"${l.priority}"`,
			`"${l.createdAt}"`
		].join(","))].join("\n");
		const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", `leads_export_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	const exportToWord = () => {
		const htmlString = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Leads Export</title><style>table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; } th, td { border: 1px solid #dddddd; padding: 8px; text-align: left; } th { background-color: #f2f2f2; }</style></head>
      <body><h2>Grand Journeys CRM - Leads Export</h2><table><tr><th>ID</th><th>Name</th><th>Phone</th><th>Destination</th><th>Budget</th><th>Travel Date</th><th>Status</th><th>Priority</th></tr>${filtered.map((l) => `<tr><td>${l.id}</td><td>${l.name}</td><td>${l.phone}</td><td>${l.destination}</td><td>₹${l.budget}</td><td>${l.travelDate}</td><td>${l.status}</td><td>${l.priority}</td></tr>`).join("")}</table></body>
      </html>
    `;
		const blob = new Blob([htmlString], { type: "application/msword" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", `leads_export_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.doc`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	const exportToPDF = () => {
		const printWindow = window.open("", "_blank");
		if (!printWindow) return;
		const tableHeader = "<tr><th>ID</th><th>Name</th><th>Phone</th><th>Destination</th><th>Budget</th><th>Travel Date</th><th>Status</th><th>Priority</th></tr>";
		const tableRows = filtered.map((l) => `<tr><td>${l.id}</td><td>${l.name}</td><td>${l.phone}</td><td>${l.destination}</td><td>₹${l.budget}</td><td>${l.travelDate}</td><td>${l.status}</td><td>${l.priority}</td></tr>`).join("");
		printWindow.document.write(`
      <html>
      <head>
        <title>Leads Export PDF</title>
        <style>
          body { font-family: sans-serif; padding: 20px; color: #333; }
          h2 { color: #f43f5e; margin-bottom: 5px; }
          p { font-size: 12px; color: #666; margin-bottom: 20px; }
          table { border-collapse: collapse; width: 100%; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f9fafb; font-weight: bold; }
          tr:nth-child(even) { background-color: #f3f4f6; }
        </style>
      </head>
      <body>
        <h2>Grand Journeys CRM - Leads Export</h2>
        <p>Generated on ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")} | Total Leads: ${filtered.length}</p>
        <table>
          <thead>${tableHeader}</thead>
          <tbody>${tableRows}</tbody>
        </table>
        <script>
          window.onload = function() {
            window.print();
            window.onafterprint = function() { window.close(); };
          }
        <\/script>
      </body>
      </html>
    `);
		printWindow.document.close();
	};
	const handleImportLeads = (data) => {
		const lmhLeads = leads.filter((l) => l.id.startsWith("LMH-"));
		let nextNum = 1;
		if (lmhLeads.length > 0) {
			const nums = lmhLeads.map((l) => {
				const parts = l.id.split("-");
				const n = parseInt(parts[1], 10);
				return isNaN(n) ? 0 : n;
			});
			nextNum = Math.max(...nums) + 1;
		}
		const pad = (num, size) => {
			let s = num + "";
			while (s.length < size) s = "0" + s;
			return s;
		};
		const importedLeads = data.map((row, idx) => ({
			id: `LMH-${pad(nextNum + idx, 3)}`,
			name: row["Name"] || row["name"] || "Unknown",
			phone: row["Phone"] || row["phone"] || "",
			email: row["Email"] || row["email"] || "",
			destination: row["Destination"] || row["destination"] || "Unknown",
			budget: parseInt(row["Budget"] || row["budget"]) || 0,
			travelDate: row["Travel Date"] || row["travelDate"] || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			source: row["Source"] || row["source"] || SOURCES[0],
			reference: row["Reference"] || row["reference"] || "",
			status: "New Lead",
			assignedTo: assignees[0],
			pax: parseInt(row["Pax"] || row["Travellers"] || "2") || 2,
			notes: "",
			avatar: "",
			createdAt: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			service: row["Service"] || row["service"] || "International Package",
			priority: row["Priority"] || row["priority"] || "Medium",
			packageType: row["PackageType"] || row["package type"] || ""
		}));
		setLeads((prev) => [...importedLeads, ...prev]);
	};
	const filtered = leads.filter((l) => (filterStatus === "All" || l.status === filterStatus) && (q === "" || l.name.toLowerCase().includes(q.toLowerCase()) || l.destination.toLowerCase().includes(q.toLowerCase()) || l.id.toLowerCase().includes(q.toLowerCase())));
	const addLead = (l) => {
		setLeads((prev) => [l, ...prev]);
	};
	const updateStatus = (id, status) => {
		setLeads((prev) => prev.map((l) => l.id === id ? {
			...l,
			status
		} : l));
		setSelected((sel) => sel ? {
			...sel,
			status
		} : sel);
	};
	const deleteLead = (id) => {
		setLeads((prev) => prev.filter((l) => l.id !== id));
		setSelected(null);
	};
	const totalBudget = leads.reduce((s, l) => s + l.budget, 0);
	const completedLeads = leads.filter((l) => l.status === "Completed").length;
	const newToday = leads.filter((l) => l.createdAt === (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)).length;
	const conversion = leads.length > 0 ? Math.round(completedLeads / leads.length * 100) : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl font-bold",
						children: "Leads"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted-foreground",
						children: "Track every inquiry from first contact to booked trip."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "gap-2 rounded-xl",
								onClick: () => setIsExportOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Export Leads"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "gap-2 rounded-xl",
								onClick: () => setIsImportOpen(true),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), " Import Leads"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								id: "add-lead-btn",
								onClick: () => setShowModal(true),
								className: "gap-2 rounded-xl",
								style: { background: "var(--gradient-brand)" },
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add Lead"]
							})
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: [
						{
							label: "Total Leads",
							value: leads.length,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4" }),
							color: "bg-blue-100 text-blue-600",
							sub: `${newToday} added today`
						},
						{
							label: "Completed",
							value: completedLeads,
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4" }),
							color: "bg-emerald-100 text-emerald-600",
							sub: `${conversion}% conversion`
						},
						{
							label: "Total Pipeline",
							value: formatINR(totalBudget),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "h-4 w-4" }),
							color: "bg-primary/15 text-primary",
							sub: "Combined budgets"
						},
						{
							label: "Avg Budget",
							value: formatINR(leads.length ? Math.round(totalBudget / leads.length) : 0),
							icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }),
							color: "bg-violet-100 text-violet-600",
							sub: "Per lead"
						}
					].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-5 shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
									children: s.label
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `grid h-9 w-9 place-items-center rounded-xl ${s.color}`,
									children: s.icon
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-2xl font-bold truncate",
								children: s.value
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: s.sub
							})
						]
					}, s.label))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex overflow-x-auto rounded-2xl border border-border bg-card shadow-card",
					children: STATUSES.map((s, i) => {
						const count = leads.filter((l) => l.status === s).length;
						const pct = leads.length ? Math.round(count / leads.length * 100) : 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setFilterStatus(filterStatus === s ? "All" : s),
							className: `flex flex-1 min-w-[90px] flex-col items-center gap-1 border-r border-border px-4 py-4 text-center transition-colors last:border-r-0 hover:bg-secondary/50 ${filterStatus === s ? "bg-secondary" : ""}`,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `text-xl font-display font-bold ${filterStatus === s ? "text-primary" : ""}`,
									children: count
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-1 w-full overflow-hidden rounded-full bg-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `h-full rounded-full ${STATUS_DOT[s]}`,
										style: { width: `${pct}%` }
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium text-muted-foreground",
									children: s
								})
							]
						}, s);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative max-w-xs flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: q,
								onChange: (e) => setQ(e.target.value),
								placeholder: "Search name, destination or ID...",
								className: "pl-9 rounded-xl"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1.5",
							children: ["All", ...STATUSES].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setFilterStatus(s),
								className: `flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${filterStatus === s ? "border-primary bg-primary text-primary-foreground shadow-sm" : "border-border bg-background text-muted-foreground hover:bg-secondary"}`,
								children: [s !== "All" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${STATUS_DOT[s]}` }), s]
							}, s))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex rounded-xl border border-border overflow-hidden",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setView("table"),
								className: `flex items-center gap-1.5 px-3 py-2 text-xs font-semibold transition-colors ${view === "table" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table2, { className: "h-3.5 w-3.5" }), " Table"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setView("kanban"),
								className: `flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border-l border-border transition-colors ${view === "kanban" ? "bg-primary text-primary-foreground" : "hover:bg-secondary"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LayoutGrid, { className: "h-3.5 w-3.5" }), " Kanban"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [filtered.length, " leads"]
						})
					]
				}),
				view === "table" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "overflow-hidden rounded-2xl border border-border bg-card shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
								className: "bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3",
										children: "Lead"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3",
										children: "Destination / Company"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3",
										children: "Service"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3",
										children: "Budget"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3",
										children: "Priority"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3",
										children: "Assignee"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3",
										children: "Status"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "px-5 py-3",
										children: "Created"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-5 py-3" })
								] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 9,
								className: "py-12 text-center text-muted-foreground text-sm",
								children: "No leads match your filters."
							}) }), filtered.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: `border-t border-border hover:bg-secondary/30 transition-colors border-l-4 ${STATUS_ACCENT[l.status]}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-3",
											children: [l.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: l.avatar,
												alt: l.name,
												className: "h-9 w-9 rounded-xl object-cover shrink-0"
											}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-9 w-9 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-5 w-5 text-gray-400" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: l.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: l.id
											})] })]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-1.5",
											children: l.service.toLowerCase().includes("insurance") ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-3.5 w-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.clientCompany || l.destination || "Insurance" })] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-primary shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l.destination })] })
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/50 px-2 py-1 text-xs font-semibold",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: SERVICE_ICONS[l.service] }), l.service]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3.5 font-semibold text-primary",
										children: formatINR(l.budget)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3.5 text-xs",
										children: PRIORITY_BADGE[l.priority]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5 text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground text-[9px] font-bold",
												children: initials(l.assignedTo)
											}), l.assignedTo.split(" ")[0]]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3.5",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_PILL[l.status]}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `h-1.5 w-1.5 rounded-full ${STATUS_DOT[l.status]}` }), l.status]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3.5 text-muted-foreground text-xs whitespace-nowrap",
										children: l.createdAt
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-3.5 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											size: "sm",
											variant: "ghost",
											className: "rounded-xl gap-1 text-xs",
											onClick: () => setSelected(l),
											children: ["View ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })]
										})
									})
								]
							}, l.id))] })]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between border-t border-border bg-secondary/30 px-5 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Showing ",
								filtered.length,
								" of ",
								leads.length,
								" leads"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-semibold text-muted-foreground",
							children: ["Pipeline: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-primary",
								children: formatINR(filtered.reduce((s, l) => s + l.budget, 0))
							})]
						})]
					})]
				}),
				view === "kanban" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto pb-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex gap-3 min-w-max",
						children: STATUSES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(KanbanCol, {
							status: s,
							leads: filtered.filter((l) => l.status === s),
							onSelect: setSelected,
							onDropLead: (id) => updateStatus(id, s)
						}, s))
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportModal, {
			open: isImportOpen,
			onOpenChange: setIsImportOpen,
			onImport: handleImportLeads,
			title: "Import Leads",
			description: "Upload a CSV or Excel file containing your leads. Make sure you have columns like Name, Phone, Email, Destination, etc."
		}),
		showModal && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddLeadModal, {
			existingLeads: leads,
			onClose: () => setShowModal(false),
			onAdd: (l) => {
				addLead(l);
				setShowModal(false);
			}
		}),
		selected && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LeadDetail, {
			lead: selected,
			onClose: () => setSelected(null),
			onStatusChange: updateStatus,
			onDelete: deleteLead,
			isAdmin,
			onEditNote: (id, newNote) => {
				const newLeads = leads.map((x) => x.id === id ? {
					...x,
					notes: newNote
				} : x);
				setLeads(newLeads);
				setSelected(newLeads.find((x) => x.id === id) || null);
			}
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: isExportOpen,
			onOpenChange: setIsExportOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "sm:max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-lg font-bold",
						children: "Export Leads"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "text-xs text-muted-foreground mt-1",
						children: [
							"Export the current list of ",
							filtered.length,
							" leads in your preferred file format."
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
		})
	] });
}
//#endregion
export { LeadsPage as component };
