import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { t as useLocalStorage } from "./use-local-storage-C6y5r3WN.mjs";
import { T as Plus, f as Trash2, i as User, pt as Crown } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as DialogTrigger, t as Dialog } from "./dialog-BvYONHWJ.mjs";
import { n as formatINR, t as bookings } from "./mock-data-4__fbKqF.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm.customers-CwmLYrGK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var tierColor = {
	Silver: "bg-slate-100 text-slate-700",
	Gold: "bg-amber-100 text-amber-700",
	Platinum: "bg-violet-100 text-violet-700"
};
function CustomersPage() {
	const [customerList, setCustomerList] = useLocalStorage("crm_customers_v2", []);
	const [isAddOpen, setIsAddOpen] = (0, import_react.useState)(false);
	const [newCustomer, setNewCustomer] = (0, import_react.useState)({
		name: "",
		phone: "",
		email: ""
	});
	const [selectedCustomer, setSelectedCustomer] = (0, import_react.useState)(null);
	const [dialogType, setDialogType] = (0, import_react.useState)(null);
	const handleAddCustomer = (e) => {
		e.preventDefault();
		if (!newCustomer.name || !newCustomer.phone) return;
		setCustomerList([{
			id: `C-${Math.floor(1e3 + Math.random() * 9e3)}`,
			name: newCustomer.name,
			phone: newCustomer.phone,
			email: newCustomer.email,
			trips: 0,
			totalSpend: 0,
			tier: "Silver"
		}, ...customerList]);
		setIsAddOpen(false);
		setNewCustomer({
			name: "",
			phone: "",
			email: ""
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-bold",
					children: "Customers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Repeat travellers, loyalty tiers and lifetime value."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Dialog, {
					open: isAddOpen,
					onOpenChange: setIsAddOpen,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTrigger, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "btn-hero",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " Add customer"]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
						className: "sm:max-w-[425px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add Customer" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
							onSubmit: handleAddCustomer,
							className: "space-y-4 pt-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "name",
										children: "Full Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "name",
										required: true,
										placeholder: "e.g. Rahul Sharma",
										value: newCustomer.name,
										onChange: (e) => setNewCustomer({
											...newCustomer,
											name: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "phone",
										children: "Phone Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "phone",
										required: true,
										placeholder: "e.g. +91 98765 43210",
										value: newCustomer.phone,
										onChange: (e) => setNewCustomer({
											...newCustomer,
											phone: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
										htmlFor: "email",
										children: "Email Address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										id: "email",
										type: "email",
										placeholder: "e.g. rahul@example.com",
										value: newCustomer.email,
										onChange: (e) => setNewCustomer({
											...newCustomer,
											email: e.target.value
										})
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setIsAddOpen(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									children: "Save Customer"
								})] })
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 md:grid-cols-2 lg:grid-cols-3",
				children: customerList.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-5 shadow-card relative group",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setSelectedCustomer(c);
								setDialogType("delete");
							},
							className: "absolute right-3 top-3 p-1.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 rounded-md",
							title: "Delete customer",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "h-12 w-12 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-6 w-6 text-gray-400" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1 pr-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate font-semibold",
									children: c.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [
										c.id,
										" · ",
										c.phone
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: `inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${tierColor[c.tier]}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Crown, { className: "h-3 w-3" }),
									" ",
									c.tier
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 grid grid-cols-2 gap-3 border-t border-border pt-3 text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Trips"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg font-bold",
								children: c.trips
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Total spend"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-lg font-bold text-primary",
								children: formatINR(c.totalSpend)
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								className: "flex-1",
								onClick: () => {
									setSelectedCustomer(c);
									setDialogType("profile");
								},
								children: "Profile"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								className: "flex-1",
								onClick: () => {
									setSelectedCustomer(c);
									setDialogType("history");
								},
								children: "History"
							})]
						})
					]
				}, c.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: dialogType !== null,
				onOpenChange: (open) => !open && setDialogType(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[425px]",
					children: [
						dialogType === "profile" && selectedCustomer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Customer Profile" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 pt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "h-16 w-16 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-8 w-8 text-gray-400" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "font-bold text-lg",
									children: selectedCustomer.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-sm text-muted-foreground",
									children: [
										selectedCustomer.id,
										" · ",
										selectedCustomer.tier
									]
								})] })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4 text-sm bg-secondary/20 p-4 rounded-xl border border-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground mb-1",
										children: "Email Address"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium break-all",
										children: selectedCustomer.email
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground mb-1",
										children: "Phone Number"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: selectedCustomer.phone
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground mb-1",
										children: "Total Trips"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium",
										children: selectedCustomer.trips
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-muted-foreground mb-1",
										children: "Total Spend"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-medium text-primary",
										children: formatINR(selectedCustomer.totalSpend)
									})] })
								]
							})]
						})] }),
						dialogType === "history" && selectedCustomer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Booking History" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							"Past and upcoming trips for ",
							selectedCustomer.name,
							"."
						] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-3 pt-2 max-h-[60vh] overflow-y-auto",
							children: bookings.filter((b) => b.customer === selectedCustomer.name).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground text-center py-6 bg-secondary/20 rounded-xl border border-border border-dashed",
								children: "No booking history found for this customer."
							}) : bookings.filter((b) => b.customer === selectedCustomer.name).map((booking) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border border-border bg-card rounded-xl p-4 shadow-sm flex flex-col gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-start gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-semibold text-sm leading-tight",
										children: booking.package
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `shrink-0 text-[10px] uppercase tracking-wider font-bold px-2.5 py-1 rounded-full ${booking.status === "Confirmed" ? "bg-green-100 text-green-700" : booking.status === "Pending" ? "bg-amber-100 text-amber-700" : booking.status === "Completed" ? "bg-blue-100 text-blue-700" : "bg-red-100 text-red-700"}`,
										children: booking.status
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between items-end text-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-muted-foreground font-medium",
										children: [
											"Travels on:",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-foreground",
												children: booking.travelDate
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-muted-foreground font-medium",
											children: "Amount:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-display font-bold text-sm text-primary",
											children: formatINR(booking.amount)
										})]
									})]
								})]
							}, booking.id))
						})] }),
						dialogType === "delete" && selectedCustomer && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "text-red-600 flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-5 w-5" }), "Delete Customer"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							"Are you sure you want to delete ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: selectedCustomer.name }),
							"? This action will remove them from the list and cannot be undone."
						] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
							className: "mt-4 gap-2 sm:gap-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								onClick: () => setDialogType(null),
								children: "Cancel"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "destructive",
								onClick: () => {
									setCustomerList(customerList.filter((c) => c.id !== selectedCustomer.id));
									setDialogType(null);
								},
								children: "Yes, delete customer"
							})]
						})] })
					]
				})
			})
		]
	});
}
//#endregion
export { CustomersPage as component };
