import { i as __toESM } from "../_runtime.mjs";
import { i as setAuth, n as getAuth } from "./auth-B0Z-CWJL.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { t as useLocalStorage } from "./use-local-storage-C6y5r3WN.mjs";
import { G as Instagram, I as MapPin, It as Bell, K as Info, L as Mail, N as Palette, Pt as Building2, T as Save, Tt as ChevronRight, Z as Globe, _t as Clock, bt as CircleCheck, ct as Facebook, dt as ExternalLink, i as User, k as Phone, lt as Eye, r as Users, t as Youtube, ut as EyeOff, x as Shield, z as Lock } from "../_libs/lucide-react.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { t as INITIAL_EMPLOYEES } from "./crm.employees-CDZEcDLI.mjs";
import { t as EmployeeProfileCard } from "./EmployeeProfileCard-SAOwbpeD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm.settings-CRR9I4DS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TABS = [
	{
		id: "company",
		label: "Company Info",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-4 w-4" }),
		adminOnly: true
	},
	{
		id: "profile",
		label: "My Profile",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4" })
	},
	{
		id: "appearance",
		label: "Appearance",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, { className: "h-4 w-4" })
	},
	{
		id: "notifications",
		label: "Notifications",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "h-4 w-4" })
	},
	{
		id: "security",
		label: "Security",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4" })
	},
	{
		id: "team",
		label: "Employees",
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "h-4 w-4" }),
		adminOnly: true
	}
];
function Toast({ msg, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed bottom-6 right-6 z-50 flex items-center gap-3 rounded-2xl bg-emerald-600 px-5 py-3 text-white shadow-2xl",
		style: { animation: "slideUpIn 0.35s cubic-bezier(0.34,1.56,0.64,1) both" },
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-5 w-5 shrink-0" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-semibold",
				children: msg
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: onClose,
				className: "ml-2 opacity-70 hover:opacity-100 text-white text-lg leading-none",
				children: "✕"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `@keyframes slideUpIn{0%{opacity:0;transform:translateY(24px)}100%{opacity:1;transform:translateY(0)}}` })
		]
	});
}
var SectionCard = ({ title, children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "rounded-2xl border border-border bg-card shadow-card overflow-hidden",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border-b border-border px-6 py-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "font-display font-bold text-base",
			children: title
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "p-6",
		children
	})]
});
var Field = ({ label, id, children }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "space-y-1.5",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
		htmlFor: id,
		className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
		children: label
	}), children]
});
var ToggleRow = ({ label, sub, checked, onChange }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "flex items-center justify-between py-3 border-b border-border last:border-0",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm font-medium",
		children: label
	}), sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs text-muted-foreground",
		children: sub
	})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		onClick: () => onChange(!checked),
		className: `relative h-6 w-11 rounded-full border transition-all ${checked ? "bg-primary border-primary" : "bg-secondary border-border"}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `absolute top-1 left-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0"}` })
	})]
});
function SettingsPage() {
	const [auth, setLocalAuth] = (0, import_react.useState)(getAuth());
	const isAdmin = auth?.role === "admin";
	const [activeTab, setActiveTab] = (0, import_react.useState)(isAdmin ? "company" : "profile");
	const [toast, setToast] = (0, import_react.useState)("");
	const [avatarPreview, setAvatarPreview] = (0, import_react.useState)(auth?.avatar || null);
	const avatarInputRef = (0, import_react.useRef)(null);
	const [localLiveEmps] = useLocalStorage("crm_employees_v3", INITIAL_EMPLOYEES);
	const liveEmps = localLiveEmps?.length ? localLiveEmps : INITIAL_EMPLOYEES;
	const showToast = (msg) => {
		setToast(msg);
		setTimeout(() => setToast(""), 3e3);
	};
	const handleSaveProfile = () => {
		if (!auth) return;
		const newAuth = {
			...auth,
			name: profile.name,
			email: profile.email || auth.email,
			phone: profile.phone || auth.phone,
			avatar: avatarPreview || auth.avatar
		};
		setAuth(newAuth);
		setLocalAuth(newAuth);
		try {
			const storedEmps = localStorage.getItem("crm_employees_v3");
			if (storedEmps) {
				const updated = JSON.parse(storedEmps).map((e) => e.id === auth.empId ? {
					...e,
					name: profile.name,
					email: profile.email || e.email,
					phone: profile.phone || e.phone,
					avatar: avatarPreview || e.avatar
				} : e);
				localStorage.setItem("crm_employees_v3", JSON.stringify(updated));
			}
		} catch {}
		showToast("✅ Profile saved successfully!");
	};
	const handleAvatarChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		const reader = new FileReader();
		reader.onload = () => setAvatarPreview(reader.result);
		reader.readAsDataURL(file);
		showToast("Avatar updated! (preview only)");
	};
	const [company, setCompany] = useLocalStorage("crm-company", {
		name: "LookMyHolidays",
		tagline: "Plan memorable trips with LookMyHolidays",
		email: "resv@lookmyholidays.in",
		phone: "+91-95291-55562",
		altPhone: "+91-9887155570",
		address: "FF-35, JTM Mall, Jagatpura",
		city: "Jaipur",
		state: "Rajasthan",
		pincode: "302017",
		website: "https://www.lookmyholidays.in",
		instagram: "https://www.instagram.com/lookmyholidays",
		facebook: "https://www.facebook.com/lookmyholidays",
		youtube: "",
		gstin: "",
		pan: "",
		currency: "INR",
		timezone: "Asia/Kolkata"
	});
	const [profile, setProfile] = (0, import_react.useState)({
		name: auth?.name || "",
		email: "",
		phone: "",
		empId: auth?.empId || "",
		role: auth?.role || ""
	});
	const [appearance, setAppearance] = useLocalStorage("crm-appearance", {
		theme: "light",
		sidebarCompact: false,
		fontSize: "default",
		accentColor: "#f43f5e"
	});
	(0, import_react.useEffect)(() => {
		const root = window.document.documentElement;
		root.classList.remove("light", "dark");
		if (appearance.theme === "system") {
			if ((window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light") === "dark") root.classList.add("dark");
		} else if (appearance.theme === "dark") root.classList.add("dark");
		if (appearance.fontSize === "small") root.style.fontSize = "14px";
		else if (appearance.fontSize === "large") root.style.fontSize = "18px";
		else root.style.fontSize = "16px";
		const colorMap = {
			"#f43f5e": "0.6 0.2 20",
			"#3b82f6": "0.6 0.15 250",
			"#10b981": "0.65 0.15 150",
			"#8b5cf6": "0.6 0.18 290",
			"#f59e0b": "0.7 0.2 45",
			"#06b6d4": "0.7 0.12 210"
		};
		if (appearance.accentColor && colorMap[appearance.accentColor]) root.style.setProperty("--primary", `oklch(${colorMap[appearance.accentColor]})`);
		else root.style.removeProperty("--primary");
	}, [appearance]);
	const [notifications, setNotifications] = useLocalStorage("crm-notifications", {
		leadAssigned: true,
		taskDue: true,
		bookingConfirmed: true,
		leaveRequested: true,
		systemUpdates: false,
		emailDigest: true,
		whatsapp: false
	});
	const [security, setSecurity] = (0, import_react.useState)({
		current: "",
		newPass: "",
		confirm: ""
	});
	const [showPw, setShowPw] = (0, import_react.useState)({
		current: false,
		newPass: false,
		confirm: false
	});
	const [pwError, setPwError] = (0, import_react.useState)("");
	const handlePasswordChange = (e) => {
		e.preventDefault();
		setPwError("");
		if (!security.current) {
			setPwError("Enter your current password.");
			return;
		}
		if (![
			"admin123",
			"emp123",
			auth?.password
		].includes(security.current)) {
			setPwError("Current password is incorrect.");
			return;
		}
		if (security.newPass.length < 6) {
			setPwError("New password must be at least 6 characters.");
			return;
		}
		if (security.newPass !== security.confirm) {
			setPwError("Passwords do not match.");
			return;
		}
		if (auth) {
			const updatedAuth = {
				...auth,
				password: security.newPass
			};
			setAuth(updatedAuth);
			setLocalAuth(updatedAuth);
		}
		setSecurity({
			current: "",
			newPass: "",
			confirm: ""
		});
		showToast("🔒 Password updated successfully!");
	};
	const visibleTabs = TABS.filter((t) => !t.adminOnly || isAdmin);
	const renderTab = () => {
		switch (activeTab) {
			case "company": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Business Details",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Company Name",
									id: "co-name",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "co-name",
										value: company.name,
										onChange: (e) => setCompany({
											...company,
											name: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Tagline",
									id: "co-tag",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "co-tag",
										value: company.tagline,
										onChange: (e) => setCompany({
											...company,
											tagline: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "GST / GSTIN",
									id: "co-gst",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "co-gst",
										placeholder: "e.g. 08ABCDE1234Z1ZF",
										value: company.gstin,
										onChange: (e) => setCompany({
											...company,
											gstin: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "PAN Number",
									id: "co-pan",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "co-pan",
										placeholder: "e.g. ABCDE1234F",
										value: company.pan,
										onChange: (e) => setCompany({
											...company,
											pan: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Currency",
									id: "co-cur",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										id: "co-cur",
										value: company.currency,
										onChange: (e) => setCompany({
											...company,
											currency: e.target.value
										}),
										className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "INR",
												children: "₹ INR — Indian Rupee"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "USD",
												children: "$ USD — US Dollar"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "EUR",
												children: "€ EUR — Euro"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "AED",
												children: "AED — UAE Dirham"
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Timezone",
									id: "co-tz",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										id: "co-tz",
										value: company.timezone,
										onChange: (e) => setCompany({
											...company,
											timezone: e.target.value
										}),
										className: "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Asia/Kolkata",
												children: "Asia/Kolkata (IST, UTC+5:30)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "UTC",
												children: "UTC"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Asia/Dubai",
												children: "Asia/Dubai (GST, UTC+4)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "Europe/London",
												children: "Europe/London (GMT/BST)"
											})
										]
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Contact & Address",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Primary Email",
									id: "co-email",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "co-email",
											className: "pl-9",
											value: company.email,
											onChange: (e) => setCompany({
												...company,
												email: e.target.value
											})
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Primary Phone",
									id: "co-phone",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "co-phone",
											className: "pl-9",
											value: company.phone,
											onChange: (e) => setCompany({
												...company,
												phone: e.target.value
											})
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Alt Phone / WhatsApp",
									id: "co-alt",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "co-alt",
										value: company.altPhone,
										onChange: (e) => setCompany({
											...company,
											altPhone: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Website",
									id: "co-web",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Globe, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "co-web",
											className: "pl-9",
											value: company.website,
											onChange: (e) => setCompany({
												...company,
												website: e.target.value
											})
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Street Address",
									id: "co-addr",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "co-addr",
											className: "pl-9",
											value: company.address,
											onChange: (e) => setCompany({
												...company,
												address: e.target.value
											})
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "City",
									id: "co-city",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "co-city",
										value: company.city,
										onChange: (e) => setCompany({
											...company,
											city: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "State",
									id: "co-state",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "co-state",
										value: company.state,
										onChange: (e) => setCompany({
											...company,
											state: e.target.value
										})
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "PIN Code",
									id: "co-pin",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "co-pin",
										value: company.pincode,
										onChange: (e) => setCompany({
											...company,
											pincode: e.target.value
										})
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Social Media",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Instagram",
									id: "co-ig",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pink-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "co-ig",
											className: "pl-9",
											placeholder: "https://instagram.com/…",
											value: company.instagram,
											onChange: (e) => setCompany({
												...company,
												instagram: e.target.value
											})
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Facebook",
									id: "co-fb",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "co-fb",
											className: "pl-9",
											placeholder: "https://facebook.com/…",
											value: company.facebook,
											onChange: (e) => setCompany({
												...company,
												facebook: e.target.value
											})
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "YouTube",
									id: "co-yt",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "co-yt",
											className: "pl-9",
											placeholder: "https://youtube.com/…",
											value: company.youtube,
											onChange: (e) => setCompany({
												...company,
												youtube: e.target.value
											})
										})]
									})
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Preview",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-secondary/20 p-5 flex flex-col sm:flex-row gap-5 items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-16 w-16 shrink-0 rounded-2xl bg-primary/10 grid place-items-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "h-8 w-8 text-primary" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
										className: "font-display font-bold text-xl",
										children: company.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: company.tagline
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-4 text-xs text-muted-foreground pt-1",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" }), company.phone]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }), company.email]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "flex items-center gap-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3 w-3" }),
													company.address,
													", ",
													company.city
												]
											})
										]
									}),
									company.website && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
										href: company.website,
										target: "_blank",
										rel: "noopener noreferrer",
										className: "inline-flex items-center gap-1 text-xs text-primary hover:underline pt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "h-3 w-3" }), company.website]
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "rounded-xl",
							onClick: () => {
								setCompany({
									name: "LookMyHolidays",
									tagline: "Plan memorable trips with LookMyHolidays",
									email: "resv@lookmyholidays.in",
									phone: "+91-95291-55562",
									altPhone: "+91-9887155570",
									address: "FF-35, JTM Mall, Jagatpura",
									city: "Jaipur",
									state: "Rajasthan",
									pincode: "302017",
									website: "https://www.lookmyholidays.in",
									instagram: "https://www.instagram.com/lookmyholidays",
									facebook: "https://www.facebook.com/lookmyholidays",
									youtube: "",
									gstin: "",
									pan: "",
									currency: "INR",
									timezone: "Asia/Kolkata"
								});
								showToast("Company settings reset to defaults.");
							},
							children: "Reset"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "btn-hero gap-2 rounded-xl",
							onClick: () => showToast("✅ Company settings saved successfully!"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " Save Company Settings"]
						})]
					})
				]
			});
			case "profile": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionCard, {
					title: "Personal Information",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-5 pb-5 mb-5 border-b border-border",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative h-20 w-20 overflow-hidden rounded-full bg-gradient-to-br from-primary/80 to-rose-400 flex items-center justify-center shadow-lg shrink-0",
							children: avatarPreview || auth?.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: avatarPreview || auth?.avatar,
								alt: auth?.name,
								className: "absolute inset-0 h-full w-full object-cover"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-3xl font-bold text-white relative z-10",
								children: auth?.name?.[0]?.toUpperCase()
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display font-bold text-xl",
								children: auth?.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground capitalize",
								children: [
									auth?.role,
									" · ",
									auth?.empId
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*",
								className: "hidden",
								ref: avatarInputRef,
								onChange: handleAvatarChange
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								className: "mt-2 rounded-xl text-xs",
								onClick: () => avatarInputRef.current?.click(),
								children: "Change Avatar"
							})
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Full Name",
								id: "pr-name",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "pr-name",
									value: profile.name,
									onChange: (e) => setProfile({
										...profile,
										name: e.target.value
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Employee ID",
								id: "pr-empid",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "pr-empid",
									value: profile.empId,
									disabled: true,
									className: "opacity-60 cursor-not-allowed"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Role",
								id: "pr-role",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "pr-role",
									value: profile.role,
									disabled: true,
									className: "opacity-60 cursor-not-allowed capitalize"
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Email Address",
								id: "pr-email",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "pr-email",
										className: "pl-9",
										placeholder: "your@email.com",
										value: profile.email,
										onChange: (e) => setProfile({
											...profile,
											email: e.target.value
										})
									})]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Phone Number",
								id: "pr-phone",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "pr-phone",
										className: "pl-9",
										placeholder: "+91 00000 00000",
										value: profile.phone,
										onChange: (e) => setProfile({
											...profile,
											phone: e.target.value
										})
									})]
								})
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "rounded-xl",
						onClick: () => {
							setProfile({
								name: auth?.name || "",
								email: "",
								phone: "",
								empId: auth?.empId || "",
								role: auth?.role || ""
							});
							setAvatarPreview(auth?.avatar || null);
							showToast("Profile reset.");
						},
						children: "Discard Changes"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "btn-hero gap-2 rounded-xl",
						onClick: handleSaveProfile,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " Save Profile"]
					})]
				})]
			});
			case "appearance": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Theme & Layout",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
								children: "Theme Mode"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 grid grid-cols-3 gap-3",
								children: [
									"light",
									"dark",
									"system"
								].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setAppearance({
										...appearance,
										theme: t
									}),
									className: `relative rounded-xl border-2 p-4 text-center transition-all ${appearance.theme === t ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"}`,
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-2xl block mb-1",
											children: t === "light" ? "☀️" : t === "dark" ? "🌙" : "💻"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold capitalize",
											children: t
										}),
										appearance.theme === t && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" })
									]
								}, t))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
								children: "Accent Color"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-3",
								children: [
									"#f43f5e",
									"#3b82f6",
									"#10b981",
									"#8b5cf6",
									"#f59e0b",
									"#06b6d4"
								].map((color) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setAppearance({
										...appearance,
										accentColor: color
									}),
									style: { background: color },
									className: `h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${appearance.accentColor === color ? "border-foreground scale-110" : "border-transparent"}`
								}, color))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								className: "text-xs font-semibold text-muted-foreground uppercase tracking-wide",
								children: "Font Size"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex gap-3",
								children: [
									"small",
									"default",
									"large"
								].map((fs) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setAppearance({
										...appearance,
										fontSize: fs
									}),
									className: `flex-1 rounded-xl border py-2.5 text-sm font-semibold capitalize transition-all ${appearance.fontSize === fs ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"}`,
									children: fs
								}, fs))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Compact Sidebar",
								sub: "Show only icons in the sidebar to save space",
								checked: appearance.sidebarCompact,
								onChange: (v) => setAppearance({
									...appearance,
									sidebarCompact: v
								})
							})
						]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						className: "rounded-xl",
						onClick: () => {
							setAppearance({
								theme: "light",
								sidebarCompact: false,
								fontSize: "default",
								accentColor: "#f43f5e"
							});
							showToast("Appearance reset to defaults.");
						},
						children: "Reset to Defaults"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "btn-hero gap-2 rounded-xl",
						onClick: () => showToast("✅ Appearance settings saved!"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " Save Appearance"]
					})]
				})]
			});
			case "notifications": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "In-App Notifications",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Lead Assigned to Me",
								sub: "Get notified when a lead is assigned",
								checked: notifications.leadAssigned,
								onChange: (v) => setNotifications({
									...notifications,
									leadAssigned: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Task Due Reminder",
								sub: "Remind 24h before task deadline",
								checked: notifications.taskDue,
								onChange: (v) => setNotifications({
									...notifications,
									taskDue: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Booking Confirmed",
								sub: "Alert when a new booking is confirmed",
								checked: notifications.bookingConfirmed,
								onChange: (v) => setNotifications({
									...notifications,
									bookingConfirmed: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "Leave Requested",
								sub: "Notify when an employee requests leave",
								checked: notifications.leaveRequested,
								onChange: (v) => setNotifications({
									...notifications,
									leaveRequested: v
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
								label: "System Updates",
								sub: "CRM feature updates and announcements",
								checked: notifications.systemUpdates,
								onChange: (v) => setNotifications({
									...notifications,
									systemUpdates: v
								})
							})
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Communication Channels",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
							label: "Email Digest",
							sub: "Receive daily summary via email",
							checked: notifications.emailDigest,
							onChange: (v) => setNotifications({
								...notifications,
								emailDigest: v
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ToggleRow, {
							label: "WhatsApp Alerts",
							sub: "Get critical alerts on WhatsApp",
							checked: notifications.whatsapp,
							onChange: (v) => setNotifications({
								...notifications,
								whatsapp: v
							})
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-end gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "rounded-xl",
							onClick: () => {
								setNotifications({
									leadAssigned: true,
									taskDue: true,
									bookingConfirmed: true,
									leaveRequested: true,
									systemUpdates: false,
									emailDigest: true,
									whatsapp: false
								});
								showToast("Notifications reset to defaults.");
							},
							children: "Reset"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "btn-hero gap-2 rounded-xl",
							onClick: () => showToast("✅ Notification preferences saved!"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "h-4 w-4" }), " Save Preferences"]
						})]
					})
				]
			});
			case "security": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Change Password",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handlePasswordChange,
							className: "space-y-4 max-w-md",
							children: [
								[
									"current",
									"newPass",
									"confirm"
								].map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: field === "current" ? "Current Password" : field === "newPass" ? "New Password" : "Confirm New Password",
									id: `pw-${field}`,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												id: `pw-${field}`,
												type: showPw[field] ? "text" : "password",
												placeholder: field === "current" ? "Enter current password" : field === "newPass" ? "Min. 6 characters" : "Re-enter new password",
												value: security[field],
												onChange: (e) => setSecurity({
													...security,
													[field]: e.target.value
												}),
												className: "flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => setShowPw((p) => ({
													...p,
													[field]: !p[field]
												})),
												className: "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors",
												children: showPw[field] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "h-4 w-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "h-4 w-4" })
											})
										]
									})
								}, field)),
								pwError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-red-600 flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5" }), pwError]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "submit",
									className: "btn-hero gap-2 rounded-xl",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "h-4 w-4" }), " Update Password"]
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Active Session",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between rounded-xl border border-border bg-secondary/20 px-4 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-9 w-9 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-4 w-4" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm font-semibold",
									children: "Current Session"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3 w-3" }),
										"Logged in as ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: auth?.name }),
										" (",
										auth?.role,
										")"
									]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1 rounded-full bg-emerald-100 text-emerald-700 px-2.5 py-1 text-xs font-bold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" }), "Active"]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
						title: "Two-Factor Authentication",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "2FA via Email OTP"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Add an extra layer of security to your account"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "rounded-xl text-xs gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3.5 w-3.5" }), " Enable 2FA"]
							})]
						})
					})
				]
			});
			case "team": return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Employee Directory",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid grid-cols-1 xl:grid-cols-2 gap-4",
						children: liveEmps.map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeProfileCard, { employeeName: u.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1 rounded-full bg-slate-100 text-slate-700 px-2 py-0.5 text-xs font-bold border border-slate-200",
									children: ["ID: ", u.id]
								})
							})]
						}, u.id))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionCard, {
					title: "Default Passwords",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-amber-200 bg-amber-50 p-4 flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-5 w-5 text-amber-600 shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-sm text-amber-800 space-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: "Default Login Credentials"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Admin password: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "bg-amber-100 px-1 rounded font-mono text-xs",
									children: "admin123"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Employee password: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
									className: "bg-amber-100 px-1 rounded font-mono text-xs",
									children: "emp123"
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-amber-700 pt-1",
									children: "⚠️ Advise all employees to change their passwords after first login."
								})
							]
						})]
					})
				})]
			});
			default: return null;
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-bold",
				children: "Settings"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Manage your CRM preferences, company info, and account security."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col lg:flex-row gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "w-full lg:w-56 shrink-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "rounded-2xl border border-border bg-card shadow-card overflow-hidden",
						children: visibleTabs.map((tab, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveTab(tab.id),
							className: `w-full flex items-center justify-between gap-3 px-4 py-3.5 text-sm font-medium transition-all text-left ${i !== 0 ? "border-t border-border" : ""} ${activeTab === tab.id ? "bg-primary/10 text-primary font-semibold" : "text-foreground hover:bg-secondary/60"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: activeTab === tab.id ? "text-primary" : "text-muted-foreground",
									children: tab.icon
								}), tab.label]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: `h-3.5 w-3.5 transition-transform ${activeTab === tab.id ? "text-primary rotate-90" : "text-muted-foreground/40"}` })]
						}, tab.id))
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "flex-1 min-w-0",
					children: renderTab()
				})]
			}),
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toast, {
				msg: toast,
				onClose: () => setToast("")
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
