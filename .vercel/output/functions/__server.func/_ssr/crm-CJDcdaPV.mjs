import { i as __toESM } from "../_runtime.mjs";
import { t as lookmyholidays_default } from "./lookmyholidays-BFBoVuwX.mjs";
import { n as getAuth, t as clearAuth } from "./auth-B0Z-CWJL.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { r as cn } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { t as useLocalStorage } from "./use-local-storage-C6y5r3WN.mjs";
import { B as ListChecks, Dt as Check, Ft as Briefcase, O as Plane, P as Package, Pt as Building2, R as LogOut, S as Settings, Tt as ChevronRight, U as LayoutDashboard, ht as CreditCard, it as FileText, jt as CalendarCheck, o as UserCheck, r as Users, vt as Circle, w as Search, x as Shield } from "../_libs/lucide-react.mjs";
import { t as EmployeeProfileModal } from "./EmployeeProfileModal-C91jDn03.mjs";
import { _ as useNavigate, f as Outlet, g as Link, l as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm-CJDcdaPV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var FULL_NAV = [
	{
		to: "/crm",
		label: "Dashboard",
		icon: LayoutDashboard,
		exact: true
	},
	{
		to: "/crm/leads",
		label: "Leads",
		icon: Users
	},
	{
		to: "/crm/tasks",
		label: "Tasks",
		icon: ListChecks
	},
	{
		to: "/crm/visa",
		label: "Visa",
		icon: Plane
	},
	{
		to: "/crm/customers",
		label: "Customers",
		icon: UserCheck
	},
	{
		to: "/crm/bookings",
		label: "Bookings",
		icon: CalendarCheck
	},
	{
		to: "/crm/documents",
		label: "Documents",
		icon: FileText
	},
	{
		to: "/crm/packages",
		label: "Packages",
		icon: Package
	},
	{
		to: "/crm/employees",
		label: "Employees",
		icon: Briefcase
	},
	{
		to: "/crm/vendors",
		label: "Vendors",
		icon: Building2
	},
	{
		to: "/crm/payments",
		label: "Payments",
		icon: CreditCard
	},
	{
		to: "/crm/settings",
		label: "Settings",
		icon: Settings
	}
];
function getNavForUser(auth) {
	if (auth.name.toLowerCase().includes("nikita")) return FULL_NAV.filter((n) => [
		"Leads",
		"Tasks",
		"Settings"
	].includes(n.label));
	if (auth.name.toLowerCase().includes("aman") || auth.role === "Accounts Manager" || auth.role === "Accounts") return FULL_NAV.filter((n) => [
		"Vendors",
		"Payments",
		"Settings",
		"Tasks"
	].includes(n.label));
	if (auth.role === "admin" || auth.role === "HR & Admin Manager") return FULL_NAV;
	if (auth.role === "Sales Executive" || auth.role === "Travel Consultant") return FULL_NAV.filter((n) => [
		"Leads",
		"Tasks",
		"Customers",
		"Bookings",
		"Packages",
		"Documents",
		"Settings"
	].includes(n.label));
	if (auth.role === "Visa Executive" || auth.name.toLowerCase().includes("deepak")) return FULL_NAV.filter((n) => [
		"Visa",
		"Tasks",
		"Settings"
	].includes(n.label));
	return FULL_NAV.filter((n) => [
		"Leads",
		"Tasks",
		"Packages",
		"Settings"
	].includes(n.label));
}
function CrmLayout() {
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const [auth, setAuth] = (0, import_react.useState)(null);
	const [selectedEmployee, setSelectedEmployee] = (0, import_react.useState)(null);
	const [appearance] = useLocalStorage("crm-appearance", {
		theme: "light",
		sidebarCompact: false,
		fontSize: "default",
		accentColor: "#f43f5e"
	});
	const isCompact = appearance.sidebarCompact;
	(0, import_react.useEffect)(() => {
		try {
			const authStored = localStorage.getItem("crm_auth_v1");
			if (authStored) {
				const authObj = JSON.parse(authStored);
				if (authObj.name === "Suman Yadav" || authObj.avatar === "/avatars/suman.jpeg") {
					authObj.name = "Manvendra Singhal";
					authObj.avatar = "/avatars/manvendra.png";
					localStorage.setItem("crm_auth_v1", JSON.stringify(authObj));
				}
			}
			const employeesStored = localStorage.getItem("crm_employees_v3");
			if (employeesStored) {
				const employeesList = JSON.parse(employeesStored);
				let updated = false;
				const newList = employeesList.map((emp) => {
					if (emp.id === "LMH-01" && (emp.name === "Suman Yadav" || emp.avatar === "/avatars/suman.jpeg")) {
						updated = true;
						return {
							...emp,
							name: "Manvendra Singhal",
							avatar: "/avatars/manvendra.png",
							description: "Oversees Human Resources and Administrative operations."
						};
					}
					return emp;
				});
				if (updated) localStorage.setItem("crm_employees_v3", JSON.stringify(newList));
			}
			const detailsStored = localStorage.getItem("crm_employee_details_v2");
			if (detailsStored) {
				const detailsObj = JSON.parse(detailsStored);
				let updatedDetails = false;
				for (const empId in detailsObj) {
					const emp = detailsObj[empId];
					if (emp.manager === "Suman Yadav (LMH-01)") {
						emp.manager = "Manvendra Singhal (LMH-01)";
						updatedDetails = true;
					}
					if (emp.reportingManager === "Suman Yadav (LMH-01)") {
						emp.reportingManager = "Manvendra Singhal (LMH-01)";
						updatedDetails = true;
					}
					if (emp.teamLead === "Suman Yadav") {
						emp.teamLead = empId === "LMH-01" ? "Self" : "Manvendra Singhal";
						updatedDetails = true;
					}
					if (empId === "LMH-01") {
						if (emp.personalEmail === "suman.yadav@gmail.com") {
							emp.personalEmail = "manvendra.singhal@gmail.com";
							updatedDetails = true;
						}
					}
				}
				if (updatedDetails) localStorage.setItem("crm_employee_details_v2", JSON.stringify(detailsObj));
			}
		} catch (e) {
			console.error("Migration error:", e);
		}
		const user = getAuth();
		if (!user) {
			navigate({ to: "/login" });
			return;
		}
		setAuth(user);
		const userNav = getNavForUser(user);
		const hasDashboard = userNav.some((n) => n.to === "/crm");
		if (pathname === "/crm" && !hasDashboard && userNav.length > 0) {
			navigate({
				to: userNav[0].to,
				replace: true
			});
			return;
		}
		if (user.role === "employee" && !pathname.startsWith("/crm")) navigate({
			to: userNav.length > 0 ? userNav[0].to : "/crm",
			replace: true
		});
	}, [pathname, navigate]);
	function handleLogout() {
		clearAuth();
		navigate({ to: "/login" });
	}
	if (!auth) return null;
	const nav = getNavForUser(auth);
	const isAdmin = auth.role === "admin" || auth.role === "HR & Admin Manager";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen bg-secondary/30",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: `sticky top-0 hidden h-screen ${isCompact ? "w-20" : "w-64"} shrink-0 flex-col border-r border-border bg-sidebar p-4 lg:flex transition-all duration-300`,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/crm",
						className: `mb-6 flex items-center ${isCompact ? "justify-center" : "px-2"}`,
						children: isCompact ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-10 w-10 items-center justify-center rounded-full bg-[#3b9f4e] text-white shadow-sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display font-bold text-2xl italic pr-1",
								children: "H"
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: lookmyholidays_default,
							alt: "LookMyHolidays",
							className: "h-12 w-auto mix-blend-multiply dark:mix-blend-normal dark:bg-white dark:p-1.5 dark:rounded-xl transition-all"
						})
					}),
					!isCompact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: `mb-4 flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${isAdmin ? "bg-primary/10 text-primary" : "bg-violet-100 text-violet-700"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shield, { className: "h-3.5 w-3.5" }), isAdmin ? "Admin Portal" : `Employee — ${auth.name.split(" ")[0]}`]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 space-y-0.5 overflow-y-auto",
						children: nav.map((n) => {
							const active = n.exact ? pathname === n.to : pathname.startsWith(n.to);
							const Icon = n.icon;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: n.to,
								title: isCompact ? n.label : void 0,
								className: `flex items-center ${isCompact ? "justify-center p-3" : "gap-3 px-3 py-2.5"} rounded-lg text-sm font-medium transition-colors ${active ? "bg-primary text-primary-foreground shadow-card" : "text-sidebar-foreground hover:bg-sidebar-accent"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: isCompact ? "h-6 w-6" : "h-5 w-5" }), !isCompact && n.label]
							}, n.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: handleLogout,
						title: isCompact ? "Logout" : void 0,
						className: `mt-4 flex items-center ${isCompact ? "justify-center p-3" : "gap-2 px-3 py-2.5"} rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-red-100 hover:text-red-600 transition-colors`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: isCompact ? "h-6 w-6" : "h-5 w-5" }),
							" ",
							!isCompact && "Logout"
						]
					}),
					!isCompact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 rounded-2xl border border-sidebar-border bg-sidebar-accent p-3 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: "Need help?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sidebar-accent-foreground/70",
							children: "Contact your support desk."
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-w-0 flex-1 flex-col",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur sm:px-8",
					children: [isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative max-w-md flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search leads, bookings...",
							className: "pl-9"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "ml-auto flex items-center gap-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								className: "flex items-center gap-3 border-l border-border pl-4 outline-none hover:opacity-85 transition-opacity text-left cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: auth.avatar ?? "https://i.pravatar.cc/80",
									alt: auth.name,
									className: "h-9 w-9 rounded-full object-cover ring-2 ring-primary/20"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "hidden sm:block",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold leading-tight text-foreground",
										children: auth.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground",
										children: isAdmin ? "Administrator" : "Employee"
									})]
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuContent, {
							align: "end",
							className: "w-56 mt-2 rounded-xl",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuLabel, {
									className: "font-normal",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold leading-none",
											children: auth.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs leading-none text-muted-foreground",
											children: auth.role === "admin" ? "Administrator" : "Team Member"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: () => navigate({ to: "/crm/settings" }),
									className: "cursor-pointer gap-2 py-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Settings" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuSeparator, {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenuItem, {
									onClick: handleLogout,
									className: "cursor-pointer gap-2 py-2 text-red-600 focus:text-red-600 focus:bg-red-50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "h-4 w-4 text-red-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Log out" })]
								})
							]
						})] })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "p-4 sm:p-8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmployeeProfileModal, {
				employee: selectedEmployee,
				open: !!selectedEmployee,
				onOpenChange: (open) => !open && setSelectedEmployee(null),
				onAssignTask: () => {
					setSelectedEmployee(null);
					navigate({ to: "/crm/employees" });
				},
				onApproveLeave: () => {
					setSelectedEmployee(null);
					navigate({ to: "/crm/employees" });
				}
			})
		]
	});
}
//#endregion
export { CrmLayout as component };
