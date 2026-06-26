import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { At as CalendarCheck, K as IndianRupee, ft as Download, o as UserCheck, u as TrendingUp } from "../_libs/lucide-react.mjs";
import { n as formatINR, r as leads, t as bookings } from "./mock-data-4__fbKqF.mjs";
import { a as XAxis, c as Bar, d as ResponsiveContainer, f as Tooltip, i as YAxis, l as Pie, n as BarChart, o as Line, p as Legend, r as LineChart, s as CartesianGrid, t as PieChart, u as Cell } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm.reports-B6YgHfWZ.js
var import_jsx_runtime = require_jsx_runtime();
var revenueByMonth = [
	{
		month: "Jan",
		revenue: 18.2,
		bookings: 8
	},
	{
		month: "Feb",
		revenue: 22.4,
		bookings: 11
	},
	{
		month: "Mar",
		revenue: 26.1,
		bookings: 14
	},
	{
		month: "Apr",
		revenue: 31.8,
		bookings: 17
	},
	{
		month: "May",
		revenue: 28.4,
		bookings: 13
	},
	{
		month: "Jun",
		revenue: 42.9,
		bookings: 21
	}
];
var sourceData = [
	{
		name: "Website",
		value: 38
	},
	{
		name: "Instagram",
		value: 26
	},
	{
		name: "Referral",
		value: 20
	},
	{
		name: "Google Ads",
		value: 10
	},
	{
		name: "WhatsApp",
		value: 6
	}
];
var destData = [
	{
		dest: "Bali",
		revenue: 15.6
	},
	{
		dest: "Dubai",
		revenue: 12.9
	},
	{
		dest: "Maldives",
		revenue: 28.5
	},
	{
		dest: "Europe",
		revenue: 37.8
	},
	{
		dest: "Thailand",
		revenue: 11.8
	},
	{
		dest: "Singapore",
		revenue: 28.5
	}
];
var leaderboard = [
	{
		name: "Riya Bansal",
		avatar: "https://i.pravatar.cc/80?img=8",
		deals: 31,
		revenue: 184e4,
		conversion: 74
	},
	{
		name: "Rahul Gupta",
		avatar: "https://i.pravatar.cc/80?img=53",
		deals: 24,
		revenue: 126e4,
		conversion: 69
	},
	{
		name: "Amit Shah",
		avatar: "https://i.pravatar.cc/80?img=60",
		deals: 19,
		revenue: 98e4,
		conversion: 68
	},
	{
		name: "Dev Mathur",
		avatar: "https://i.pravatar.cc/80?img=65",
		deals: 8,
		revenue: 42e4,
		conversion: 53
	}
];
var COLORS = [
	"#FF6B00",
	"#FF8A33",
	"#FFA666",
	"#FFC299",
	"#FFDEC0"
];
var totalRevenue = bookings.reduce((s, b) => s + b.paid, 0);
var pendingAmount = bookings.reduce((s, b) => s + (b.amount - b.paid), 0);
var wonLeads = leads.filter((l) => l.status === "Booked" || l.status === "Completed").length;
function KpiCard({ label, value, icon, sub, color }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border border-border bg-card p-5 shadow-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: `grid h-9 w-9 place-items-center rounded-xl ${color}`,
					children: icon
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 font-display text-2xl font-bold",
				children: value
			}),
			sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: sub
			})
		]
	});
}
function SectionHeader({ title, sub }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-center justify-between",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-lg font-bold",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: sub
		})] })
	});
}
function ReportsPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-bold",
					children: "Reports & Analytics"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Revenue, pipeline and consultant performance at a glance."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					variant: "outline",
					className: "gap-2 rounded-xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Export CSV"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "MTD Revenue",
						value: formatINR(totalRevenue),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(IndianRupee, { className: "h-4 w-4" }),
						sub: "Collected this month",
						color: "bg-primary/15 text-primary"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Pending Amount",
						value: formatINR(pendingAmount),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "h-4 w-4" }),
						sub: "Awaiting collection",
						color: "bg-amber-100 text-amber-600"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Won Leads",
						value: `${wonLeads} / ${leads.length}`,
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserCheck, { className: "h-4 w-4" }),
						sub: "Conversion rate",
						color: "bg-emerald-100 text-emerald-600"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(KpiCard, {
						label: "Active Bookings",
						value: String(bookings.filter((b) => b.status !== "Cancelled").length),
						icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarCheck, { className: "h-4 w-4" }),
						sub: "Non-cancelled",
						color: "bg-blue-100 text-blue-600"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card p-6 shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
					title: "Revenue & Bookings Trend",
					sub: "Monthly figures (₹ lakhs) and total bookings"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 h-72",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LineChart, {
						data: revenueByMonth,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
								strokeDasharray: "3 3",
								stroke: "#f0f0f0"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "month",
								tick: { fontSize: 12 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								yAxisId: "left",
								tick: { fontSize: 12 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								yAxisId: "right",
								orientation: "right",
								tick: { fontSize: 12 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "left",
								type: "monotone",
								dataKey: "revenue",
								name: "Revenue (₹L)",
								stroke: "#FF6B00",
								strokeWidth: 3,
								dot: { r: 5 }
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
								yAxisId: "right",
								type: "monotone",
								dataKey: "bookings",
								name: "Bookings",
								stroke: "#6366f1",
								strokeWidth: 2,
								dot: { r: 4 },
								strokeDasharray: "5 5"
							})
						]
					}) })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
						title: "Revenue by Destination",
						sub: "₹ lakhs — current year"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 h-64",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
							data: destData,
							layout: "vertical",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
									strokeDasharray: "3 3",
									stroke: "#f0f0f0"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
									type: "number",
									tick: { fontSize: 11 }
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
									dataKey: "dest",
									type: "category",
									tick: { fontSize: 12 },
									width: 72
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { formatter: (v) => [`₹${v}L`, "Revenue"] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
									dataKey: "revenue",
									radius: [
										0,
										8,
										8,
										0
									],
									children: destData.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
								})
							]
						}) })
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6 shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SectionHeader, {
						title: "Lead Sources",
						sub: "Where inquiries come from"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex items-center gap-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-56 w-56 shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
								data: sourceData,
								dataKey: "value",
								cx: "50%",
								cy: "50%",
								innerRadius: 50,
								outerRadius: 88,
								paddingAngle: 3,
								label: false,
								children: sourceData.map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: COLORS[i % COLORS.length] }, i))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {})] }) })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-1 space-y-2",
							children: sourceData.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "h-2.5 w-2.5 shrink-0 rounded-full",
										style: { background: COLORS[i] }
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex-1 text-sm",
										children: s.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-sm font-semibold",
										children: [s.value, "%"]
									})
								]
							}, s.name))
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-bold",
						children: "Consultant Leaderboard"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Ranked by revenue generated — current year"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border",
					children: leaderboard.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `grid h-8 w-8 shrink-0 place-items-center rounded-xl font-display text-sm font-bold ${i === 0 ? "bg-amber-100 text-amber-700" : i === 1 ? "bg-slate-100 text-slate-600" : "bg-secondary text-muted-foreground"}`,
								children: ["#", i + 1]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: c.avatar,
								alt: c.name,
								className: "h-10 w-10 rounded-full"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: c.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [c.deals, " deals closed"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden text-center sm:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "font-semibold",
									children: [c.conversion, "%"]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Conversion"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-right",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg font-bold text-primary",
									children: formatINR(c.revenue)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "Revenue"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "hidden w-24 sm:block",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-1.5 w-full overflow-hidden rounded-full bg-border",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-full rounded-full",
										style: {
											width: `${Math.round(c.revenue / leaderboard[0].revenue * 100)}%`,
											background: "var(--gradient-brand)"
										}
									})
								})
							})
						]
					}, c.name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "border-b border-border px-6 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-bold",
						children: "Lead Pipeline Summary"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Stage-wise breakdown of all leads"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3",
									children: "Stage"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3",
									children: "Count"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3",
									children: "% of Total"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-3",
									children: "Progress"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: [
							"New Lead",
							"Contacted",
							"Quotation Sent",
							"Negotiation",
							"Booked",
							"Completed",
							"Lost"
						].map((stage) => {
							const count = leads.filter((l) => l.status === stage).length;
							const pct = Math.round(count / leads.length * 100);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border hover:bg-secondary/20",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-3 font-medium",
										children: stage
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-3",
										children: count
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "px-6 py-3",
										children: [pct, "%"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-6 py-3 w-40",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-1.5 overflow-hidden rounded-full bg-border",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "h-full rounded-full bg-primary",
												style: { width: `${pct}%` }
											})
										})
									})
								]
							}, stage);
						}) })]
					})
				})]
			})
		]
	});
}
//#endregion
export { ReportsPage as component };
