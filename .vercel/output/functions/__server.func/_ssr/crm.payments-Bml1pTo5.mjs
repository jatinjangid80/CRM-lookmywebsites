import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { t as useLocalStorage } from "./use-local-storage-C6y5r3WN.mjs";
import { E as Plus, St as CircleAlert, bt as CircleCheck, f as Trash2, ht as CreditCard, w as Search } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BvYONHWJ.mjs";
import { n as formatINR, t as bookings } from "./mock-data-4__fbKqF.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { t as DeleteConfirmModal } from "./delete-confirm-modal-FSVFJr3i.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm.payments-Bml1pTo5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PaymentsPage() {
	const [payments, setPayments] = useLocalStorage("crm_bookings", bookings);
	const [searchTerm, setSearchTerm] = (0, import_react.useState)("");
	const [deleteTargetId, setDeleteTargetId] = (0, import_react.useState)(null);
	const [isAddOpen, setIsAddOpen] = (0, import_react.useState)(false);
	const [newInvoice, setNewInvoice] = (0, import_react.useState)({
		customer: "",
		package: "",
		travelDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
		amount: 0,
		paid: 0,
		status: "Pending"
	});
	const filteredPayments = payments.filter((p) => p.customer.toLowerCase().includes(searchTerm.toLowerCase()) || `INV-${p.id.replace("BK-", "")}`.toLowerCase().includes(searchTerm.toLowerCase()));
	const total = payments.reduce((s, b) => s + b.amount, 0);
	const paid = payments.reduce((s, b) => s + b.paid, 0);
	const pending = total - paid;
	const cards = [
		{
			label: "Total Invoiced",
			value: formatINR(total),
			icon: CreditCard,
			color: "text-blue-500",
			bg: "bg-blue-500/10",
			border: "border-blue-500/20"
		},
		{
			label: "Amount Collected",
			value: formatINR(paid),
			icon: CircleCheck,
			color: "text-emerald-500",
			bg: "bg-emerald-500/10",
			border: "border-emerald-500/20"
		},
		{
			label: "Pending Balance",
			value: formatINR(pending),
			icon: CircleAlert,
			color: "text-rose-500",
			bg: "bg-rose-500/10",
			border: "border-rose-500/20"
		}
	];
	const handleDelete = (id) => {
		setDeleteTargetId(id);
	};
	const confirmDelete = () => {
		if (deleteTargetId) {
			setPayments(payments.filter((p) => p.id !== deleteTargetId));
			setDeleteTargetId(null);
		}
	};
	const handleCreate = () => {
		setIsAddOpen(true);
	};
	const handleSaveInvoice = (e) => {
		e.preventDefault();
		if (!newInvoice.customer || !newInvoice.package) return;
		setPayments([{
			id: `BK-${Math.floor(1e3 + Math.random() * 9e3)}`,
			customer: newInvoice.customer,
			package: newInvoice.package,
			travelDate: newInvoice.travelDate,
			amount: newInvoice.amount,
			paid: newInvoice.paid,
			status: newInvoice.status
		}, ...payments]);
		setIsAddOpen(false);
		setNewInvoice({
			customer: "",
			package: "",
			travelDate: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
			amount: 0,
			paid: 0,
			status: "Pending"
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-bold",
					children: "Payments"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Manage invoices, receipts, and track pending balances."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleCreate,
					className: "btn-hero gap-2 rounded-xl shadow-lg shadow-primary/25",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Create Invoice"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-6 sm:grid-cols-3",
				children: cards.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `relative overflow-hidden rounded-2xl border ${c.border} bg-card p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 group`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute -right-4 -top-4 h-24 w-24 rounded-full ${c.bg} blur-2xl transition-all group-hover:scale-150` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: `inline-flex rounded-xl ${c.bg} p-3 mb-4`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(c.icon, { className: `h-6 w-6 ${c.color}` })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs uppercase tracking-wider text-muted-foreground font-semibold",
								children: c.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl font-bold mt-1 tracking-tight",
								children: c.value
							})
						]
					})]
				}, c.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border border-border bg-card shadow-sm overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "p-4 border-b border-border flex items-center justify-between bg-secondary/20",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative max-w-sm w-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search invoices or customers...",
							className: "pl-9 rounded-xl border-border bg-background",
							value: searchTerm,
							onChange: (e) => setSearchTerm(e.target.value)
						})]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-secondary/40 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "Invoice"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "Customer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "Amount"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "Paid"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4",
									children: "Balance"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-6 py-4 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
							className: "divide-y divide-border",
							children: filteredPayments.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 6,
								className: "px-6 py-8 text-center text-muted-foreground",
								children: "No invoices found."
							}) }) : filteredPayments.map((b) => {
								const balance = b.amount - b.paid;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "transition-colors hover:bg-secondary/30 group",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-6 py-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-xs font-medium px-2.5 py-1 rounded-md bg-secondary text-secondary-foreground border border-border",
												children: ["INV-", b.id.replace("BK-", "")]
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-6 py-4 font-semibold",
											children: b.customer
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-6 py-4 font-medium",
											children: formatINR(b.amount)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-6 py-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-emerald-600 dark:text-emerald-400 font-medium",
												children: formatINR(b.paid)
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-6 py-4",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: `font-semibold ${balance > 0 ? "text-rose-600 dark:text-rose-400" : "text-muted-foreground"}`,
												children: formatINR(balance)
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "px-6 py-4 text-right",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												size: "icon",
												onClick: () => handleDelete(b.id),
												className: "h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors opacity-0 group-hover:opacity-100",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
											})
										})
									]
								}, b.id);
							})
						})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DeleteConfirmModal, {
				isOpen: deleteTargetId !== null,
				onClose: () => setDeleteTargetId(null),
				onConfirm: confirmDelete,
				title: "Delete Invoice",
				description: "Are you sure you want to delete this invoice? This action cannot be undone."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isAddOpen,
				onOpenChange: setIsAddOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[500px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Create New Invoice" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Enter invoice and customer details to create a new record." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: handleSaveInvoice,
						className: "space-y-4 py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "customer",
									children: "Customer Name"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "customer",
									required: true,
									placeholder: "e.g. Priya Sharma",
									value: newInvoice.customer,
									onChange: (e) => setNewInvoice({
										...newInvoice,
										customer: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "package",
									children: "Package / Service"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "package",
									required: true,
									placeholder: "e.g. Maldives Overwater Bliss",
									value: newInvoice.package,
									onChange: (e) => setNewInvoice({
										...newInvoice,
										package: e.target.value
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "travelDate",
											children: "Travel Date"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "travelDate",
											type: "date",
											required: true,
											value: newInvoice.travelDate,
											onChange: (e) => setNewInvoice({
												...newInvoice,
												travelDate: e.target.value
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "status",
											children: "Status"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											id: "status",
											value: newInvoice.status,
											onChange: (e) => setNewInvoice({
												...newInvoice,
												status: e.target.value
											}),
											className: "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Pending",
													children: "Pending"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Confirmed",
													children: "Confirmed"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Completed",
													children: "Completed"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Cancelled",
													children: "Cancelled"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "amount",
											children: "Total Amount (₹)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "amount",
											type: "number",
											min: "0",
											placeholder: "e.g. 150000",
											value: newInvoice.amount || "",
											onChange: (e) => setNewInvoice({
												...newInvoice,
												amount: Number(e.target.value)
											})
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
											htmlFor: "paid",
											children: "Amount Paid (₹)"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											id: "paid",
											type: "number",
											min: "0",
											placeholder: "e.g. 50000",
											value: newInvoice.paid || "",
											onChange: (e) => setNewInvoice({
												...newInvoice,
												paid: Number(e.target.value)
											})
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
								className: "pt-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "outline",
									onClick: () => setIsAddOpen(false),
									children: "Cancel"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "submit",
									children: "Create Invoice"
								})]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { PaymentsPage as component };
