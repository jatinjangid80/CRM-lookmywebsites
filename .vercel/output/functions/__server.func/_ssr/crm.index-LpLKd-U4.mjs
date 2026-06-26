import { n as getAuth } from "./auth-B0Z-CWJL.mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { E as Plus, Lt as Award, St as CircleAlert, Tt as ChevronRight, b as Sparkles, d as TrendingDown, i as User, jt as CalendarCheck, o as UserCheck, q as IndianRupee, r as Users, u as TrendingUp } from "../_libs/lucide-react.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as revenueByMonth, n as formatINR, r as leads, t as bookings } from "./mock-data-4__fbKqF.mjs";
import { t as INITIAL_EMPLOYEES } from "./crm.employees-CDZEcDLI.mjs";
import { n as SEED_PACKAGES } from "./crm.packages-CnFAcYHO.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as BarChart, o as Line, p as Legend, r as LineChart, s as CartesianGrid, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm.index-LpLKd-U4.js
var import_jsx_runtime = require_jsx_runtime();
var COLORS = [
	"#FF6B00",
	"#FF8A33",
	"#FFA666",
	"#FFC299",
	"#FFD9BF",
	"#FFE9D9"
];
var AVATARS = [
	"",
	"",
	"",
	"",
	"",
	"",
	""
];
leads.map((l, i) => ({
	...l,
	avatar: AVATARS[i % AVATARS.length],
	notes: ""
}));
var RevenueTooltip = ({ active, payload, label }) => {
	if (active && payload && payload.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-3 shadow-premium text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-bold text-muted-foreground mb-1",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-display text-sm font-extrabold text-primary",
			children: [
				"₹",
				payload[0].value,
				" Lakhs"
			]
		})]
	});
	return null;
};
var FunnelTooltip = ({ active, payload, label }) => {
	if (active && payload && payload.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-3 shadow-premium text-xs",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-bold text-muted-foreground mb-1",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "font-display text-sm font-extrabold text-primary",
			children: [payload[0].value, " Leads"]
		})]
	});
	return null;
};
function getLocalStorageItem(key, fallback) {
	if (typeof window === "undefined") return fallback;
	try {
		const item = window.localStorage.getItem(key);
		return item ? JSON.parse(item) : fallback;
	} catch {
		return fallback;
	}
}
function formatLakhs(amount) {
	if (amount >= 1e5) return `₹${(amount / 1e5).toFixed(2)} Lakhs`;
	return formatINR(amount);
}
function Dashboard() {
	const user = getAuth();
	const leadsList = getLocalStorageItem("crm_leads_v2", []);
	const bookingsList = getLocalStorageItem("crm_bookings", bookings);
	const customersList = getLocalStorageItem("crm_customers_v2", []);
	const localEmployeesList = getLocalStorageItem("crm_employees_v3", []);
	const employeesList = localEmployeesList?.length ? localEmployeesList : INITIAL_EMPLOYEES;
	const packagesList = getLocalStorageItem("crm_packages", SEED_PACKAGES);
	const tagCounts = {};
	packagesList.forEach((p) => {
		if (p.active) tagCounts[p.tag] = (tagCounts[p.tag] || 0) + 1;
	});
	const packagePerformance = Object.entries(tagCounts).map(([name, value]) => ({
		name,
		value
	})).sort((a, b) => b.value - a.value);
	const totalRevenue = bookingsList.reduce((s, b) => s + b.paid, 0);
	const pending = bookingsList.reduce((s, b) => s + (b.amount - b.paid), 0);
	const staffStatsMap = {};
	if (employeesList && employeesList.length > 0) employeesList.forEach((emp) => {
		staffStatsMap[emp.name] = {
			name: emp.name,
			role: emp.role,
			totalLeads: 0,
			convertedLeads: 0,
			revenue: 0,
			avatar: emp.avatar
		};
	});
	leadsList.forEach((lead) => {
		const name = lead.assignedTo || "Unassigned";
		if (!staffStatsMap[name]) staffStatsMap[name] = {
			name,
			role: "Travel Consultant",
			totalLeads: 0,
			convertedLeads: 0,
			revenue: 0,
			avatar: lead.avatar || `https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 70)}`
		};
		staffStatsMap[name].totalLeads += 1;
		if (lead.status === "Booked" || lead.status === "Completed") {
			staffStatsMap[name].convertedLeads += 1;
			staffStatsMap[name].revenue += lead.budget || 0;
		}
	});
	const staffStats = Object.values(staffStatsMap).filter((staff) => staff.totalLeads > 0 || employeesList && employeesList.some((e) => e.name === staff.name)).sort((a, b) => b.revenue - a.revenue || b.totalLeads - a.totalLeads);
	const stats = [
		{
			label: "Total leads",
			value: leadsList.length,
			icon: UserCheck,
			trend: "+12%",
			bg: "bg-blue-50",
			color: "text-blue-600"
		},
		{
			label: "Total customers",
			value: customersList.length,
			icon: Users,
			trend: "+8%",
			bg: "bg-emerald-50",
			color: "text-emerald-600"
		},
		{
			label: "Revenue (MTD)",
			value: formatLakhs(totalRevenue),
			icon: IndianRupee,
			trend: "+18%",
			bg: "bg-amber-50",
			color: "text-amber-600"
		},
		{
			label: "Bookings",
			value: bookingsList.length,
			icon: CalendarCheck,
			trend: "+5%",
			bg: "bg-violet-50",
			color: "text-violet-600"
		},
		{
			label: "Pending payments",
			value: formatLakhs(pending),
			icon: CircleAlert,
			trend: "−3%",
			bg: "bg-rose-50",
			color: "text-rose-600"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 animate-fade-in",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative overflow-hidden rounded-3xl border border-border p-6 sm:p-8 shadow-card",
				style: { background: "linear-gradient(135deg, rgba(255, 107, 0, 0.06) 0%, rgba(255, 138, 51, 0.02) 100%)" },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative z-10 flex flex-wrap items-center justify-between gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3 w-3 animate-pulse" }), " LookMyHolidays Workspace"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "font-display text-3xl font-extrabold tracking-tight",
							children: [
								"Welcome back, ",
								user?.name || "Riya",
								" 👋"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-sm text-muted-foreground max-w-lg",
							children: "Here is what's happening with your travel business today. Monitor inquiries, track agent leads performance, and manage bookings."
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "gap-2 rounded-xl bg-background border-border hover:bg-secondary/40 shadow-sm",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/crm/leads",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " New Lead"]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							style: { background: "var(--gradient-brand)" },
							className: "gap-2 rounded-xl text-primary-foreground shadow-md hover:opacity-90 transition-opacity",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/crm/bookings",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-4 w-4" }), " New Booking"]
							})
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-5",
				children: stats.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-premium hover:-translate-y-1 transition-all duration-300",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `grid h-10 w-10 place-items-center rounded-xl ${s.bg} ${s.color}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${s.trend.startsWith("+") ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`,
								children: [
									s.trend.startsWith("+") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-3 w-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingDown, { className: "h-3 w-3" }),
									" ",
									s.trend
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground",
							children: s.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl font-black tracking-tight",
							children: s.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" })
					]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-lg font-bold",
						children: "Monthly revenue (₹ lakhs)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-72",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
							data: revenueByMonth,
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "rgba(0,0,0,0.03)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									dataKey: "month",
									stroke: "#888",
									fontSize: 12,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									stroke: "#888",
									fontSize: 12,
									tickLine: false,
									axisLine: false
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RevenueTooltip, {}) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
									type: "monotone",
									dataKey: "revenue",
									stroke: "#FF6B00",
									strokeWidth: 3,
									dot: {
										r: 5,
										fill: "#FF6B00",
										strokeWidth: 2
									},
									activeDot: { r: 7 }
								})
							]
						}) })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-lg font-bold flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "h-5 w-5 text-primary" }), " Staff Performance"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Leads conversion & pipeline won by agent"
						})] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-4",
						children: staffStats.slice(0, 5).map((staff, idx) => {
							const convRate = staff.totalLeads > 0 ? Math.round(staff.convertedLeads / staff.totalLeads * 100) : 0;
							let progressColor = "bg-rose-500";
							if (convRate >= 50) progressColor = "bg-emerald-500";
							else if (convRate >= 25) progressColor = "bg-primary";
							else if (convRate > 0) progressColor = "bg-amber-500";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between gap-4 p-2 rounded-xl hover:bg-secondary/40 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-3 min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "relative",
										children: [staff.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: staff.avatar,
											alt: staff.name,
											className: "h-10 w-10 rounded-xl object-cover border border-border"
										}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-10 w-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-5 w-5 text-gray-400" })
										}), idx === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "absolute -top-1.5 -right-1.5 text-xs font-bold drop-shadow-sm",
											children: "🏆"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold truncate text-foreground",
											children: staff.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-muted-foreground truncate",
											children: staff.role
										})]
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-end shrink-0 text-right min-w-[95px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-bold text-primary",
										children: formatINR(staff.revenue)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-1.5 mt-1 w-20",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-1.5 w-full bg-secondary rounded-full overflow-hidden",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `h-full rounded-full ${progressColor}`,
												style: { width: `${convRate || 4}%` }
											})
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] font-semibold text-muted-foreground w-6 text-right",
											children: [convRate, "%"]
										})]
									})]
								})]
							}, staff.name);
						})
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						className: "w-full mt-4 text-xs font-semibold rounded-xl text-primary hover:text-primary-foreground hover:bg-primary",
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/crm/employees",
							className: "flex items-center justify-center gap-1",
							children: ["View All Employees ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })]
						})
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-6 shadow-card",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg font-bold",
								children: "Lead funnel"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: "Distribution of active leads by stage"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 h-64",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
									data: [
										{
											stage: "New Lead",
											count: leadsList.filter((l) => l.status === "New Lead").length || 4
										},
										{
											stage: "Contacted",
											count: leadsList.filter((l) => l.status === "Contacted").length || 3
										},
										{
											stage: "Quoted",
											count: leadsList.filter((l) => l.status === "Quotation Sent" || l.status === "Quoted").length || 5
										},
										{
											stage: "Negotiate",
											count: leadsList.filter((l) => l.status === "Negotiation").length || 2
										},
										{
											stage: "Booked",
											count: leadsList.filter((l) => l.status === "Booked" || l.status === "Completed").length || 4
										}
									],
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
											strokeDasharray: "3 3",
											stroke: "rgba(0,0,0,0.03)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
											dataKey: "stage",
											stroke: "#888",
											fontSize: 11,
											tickLine: false,
											axisLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
											stroke: "#888",
											fontSize: 11,
											tickLine: false,
											axisLine: false
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { content: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FunnelTooltip, {}) }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
											dataKey: "count",
											fill: "#FF6B00",
											radius: [
												6,
												6,
												0,
												0
											],
											children: [
												1,
												2,
												3,
												4,
												5
											].map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: index === 4 ? "#FF6B00" : "#FFA666" }, `cell-${index}`))
										})
									]
								}) })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg font-bold",
								children: "Recent bookings"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: "Latest trip reservation statuses"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 overflow-y-auto max-h-60 pr-1 space-y-3 scrollbar-thin",
								children: bookingsList.slice(0, 8).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between rounded-xl bg-secondary/40 hover:bg-secondary/70 p-3 transition-colors",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm font-semibold text-foreground truncate max-w-[120px]",
										children: b.customer
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs text-muted-foreground truncate max-w-[150px]",
										children: b.package
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right shrink-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-bold text-primary",
											children: formatINR(b.amount)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `inline-block rounded-full px-2 py-0.5 text-[10px] font-bold mt-1 ${b.status === "Confirmed" || b.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`,
											children: b.status
										})]
									})]
								}, b.id))
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							className: "w-full mt-4 text-xs font-semibold rounded-xl text-primary hover:text-primary-foreground hover:bg-primary",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/crm/bookings",
								className: "flex items-center justify-center gap-1",
								children: ["View All Bookings ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })]
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-lg font-bold",
								children: "Package types"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-0.5",
								children: "Active packages distribution"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 h-56 relative flex items-center justify-center",
								children: packagePerformance.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
										data: packagePerformance,
										dataKey: "value",
										nameKey: "name",
										cx: "50%",
										cy: "40%",
										innerRadius: 40,
										outerRadius: 60,
										paddingAngle: 2,
										labelLine: false,
										label: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
										children: packagePerformance.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
										verticalAlign: "bottom",
										height: 36,
										iconType: "circle",
										wrapperStyle: { fontSize: 10 }
									})
								] }) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "No active packages"
								})
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							className: "w-full mt-4 text-xs font-semibold rounded-xl text-primary hover:text-primary-foreground hover:bg-primary",
							asChild: true,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/crm/packages",
								className: "flex items-center justify-center gap-1",
								children: ["View All Packages ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-3 w-3" })]
							})
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { Dashboard as component };
