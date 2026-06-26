import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { t as useLocalStorage } from "./use-local-storage-C6y5r3WN.mjs";
import { E as Plus, I as MapPin, L as Mail, f as Trash2, g as Star, ht as CreditCard, j as Pen, k as Phone, w as Search } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BvYONHWJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm.vendors-DxSnLQDf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var formatINR = (n) => new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 0
}).format(n);
function VendorsPage() {
	const [vendors, setVendors] = useLocalStorage("crm_vendors_v2", []);
	const [q, setQ] = (0, import_react.useState)("");
	const [categoryFilter, setCategoryFilter] = (0, import_react.useState)("All");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("All");
	const [isAddOpen, setIsAddOpen] = (0, import_react.useState)(false);
	const [isEditOpen, setIsEditOpen] = (0, import_react.useState)(false);
	const [isPayOpen, setIsPayOpen] = (0, import_react.useState)(false);
	const [selectedVendor, setSelectedVendor] = (0, import_react.useState)(null);
	const [formName, setFormName] = (0, import_react.useState)("");
	const [formCategory, setFormCategory] = (0, import_react.useState)("Hotel");
	const [formContact, setFormContact] = (0, import_react.useState)("");
	const [formEmail, setFormEmail] = (0, import_react.useState)("");
	const [formPhone, setFormPhone] = (0, import_react.useState)("");
	const [formLocation, setFormLocation] = (0, import_react.useState)("");
	const [formStatus, setFormStatus] = (0, import_react.useState)("Active");
	const [formBalance, setFormBalance] = (0, import_react.useState)("0");
	const [formRating, setFormRating] = (0, import_react.useState)("5.0");
	const [formNotes, setFormNotes] = (0, import_react.useState)("");
	const [payAmount, setPayAmount] = (0, import_react.useState)("");
	const handleOpenAdd = () => {
		setFormName("");
		setFormCategory("Hotel");
		setFormContact("");
		setFormEmail("");
		setFormPhone("");
		setFormLocation("");
		setFormStatus("Active");
		setFormBalance("0");
		setFormRating("5.0");
		setFormNotes("");
		setIsAddOpen(true);
	};
	const handleAddVendor = () => {
		if (!formName || !formContact || !formPhone) {
			alert("Please fill name, contact person, and phone number.");
			return;
		}
		const newV = {
			id: `VND-${String(Date.now()).slice(-4)}`,
			name: formName,
			category: formCategory,
			contactPerson: formContact,
			email: formEmail,
			phone: formPhone,
			location: formLocation,
			status: formStatus,
			balance: parseFloat(formBalance) || 0,
			rating: parseFloat(formRating) || 5,
			notes: formNotes
		};
		setVendors([...vendors, newV]);
		setIsAddOpen(false);
	};
	const handleOpenEdit = (v) => {
		setSelectedVendor(v);
		setFormName(v.name);
		setFormCategory(v.category);
		setFormContact(v.contactPerson);
		setFormEmail(v.email);
		setFormPhone(v.phone);
		setFormLocation(v.location);
		setFormStatus(v.status);
		setFormBalance(String(v.balance));
		setFormRating(String(v.rating));
		setFormNotes(v.notes || "");
		setIsEditOpen(true);
	};
	const handleSaveEdit = () => {
		if (!selectedVendor) return;
		setVendors(vendors.map((v) => v.id === selectedVendor.id ? {
			...v,
			name: formName,
			category: formCategory,
			contactPerson: formContact,
			email: formEmail,
			phone: formPhone,
			location: formLocation,
			status: formStatus,
			balance: parseFloat(formBalance) || 0,
			rating: parseFloat(formRating) || 5,
			notes: formNotes
		} : v));
		setIsEditOpen(false);
	};
	const handleOpenPay = (v) => {
		setSelectedVendor(v);
		setPayAmount("");
		setIsPayOpen(true);
	};
	const handlePay = () => {
		if (!selectedVendor || !payAmount) return;
		const amount = parseFloat(payAmount);
		if (isNaN(amount) || amount <= 0) {
			alert("Please enter a valid positive payment amount.");
			return;
		}
		setVendors(vendors.map((v) => v.id === selectedVendor.id ? {
			...v,
			balance: Math.max(0, v.balance - amount)
		} : v));
		setIsPayOpen(false);
	};
	const handleDeleteVendor = (id) => {
		if (confirm("Are you sure you want to delete this vendor?")) setVendors(vendors.filter((v) => v.id !== id));
	};
	const filtered = vendors.filter((v) => {
		const matchQ = q === "" || v.name.toLowerCase().includes(q.toLowerCase()) || v.contactPerson.toLowerCase().includes(q.toLowerCase()) || v.email.toLowerCase().includes(q.toLowerCase()) || v.location.toLowerCase().includes(q.toLowerCase());
		const matchCat = categoryFilter === "All" || v.category === categoryFilter;
		const matchStat = statusFilter === "All" || v.status === statusFilter;
		return matchQ && matchCat && matchStat;
	});
	const totalOutstanding = filtered.reduce((sum, v) => sum + v.balance, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-3xl font-extrabold tracking-tight text-gray-900 font-display",
					children: "Vendor Directory"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Manage suppliers, hotels, flight coordinators, and outstanding balances."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: handleOpenAdd,
					className: "bg-[#FF6B00] text-white hover:bg-[#E05E00] gap-1.5 rounded-xl text-xs font-semibold h-9 shadow-sm px-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" }), " Add New Vendor"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-4",
				children: [
					{
						label: "Total Vendors",
						value: vendors.length,
						desc: "Registered suppliers"
					},
					{
						label: "Active Suppliers",
						value: vendors.filter((v) => v.status === "Active").length,
						desc: "Operational partners"
					},
					{
						label: "Outstanding Balance",
						value: formatINR(totalOutstanding),
						desc: "Total agency liability",
						highlight: true
					},
					{
						label: "Highly Rated (>4.5★)",
						value: vendors.filter((v) => v.rating >= 4.5).length,
						desc: "Premium quality partners"
					}
				].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `rounded-2xl border p-5 shadow-sm bg-white ${s.highlight ? "border-[#FF6B00]/30 ring-1 ring-[#FF6B00]/10" : "border-gray-200"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] uppercase font-bold tracking-wider text-muted-foreground",
							children: s.label
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `text-2xl font-black mt-2 tracking-tight ${s.highlight ? "text-[#FF6B00]" : "text-gray-900"}`,
							children: s.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] text-muted-foreground mt-1.5",
							children: s.desc
						})
					]
				}, s.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1 max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						placeholder: "Search by name, contact, email or city...",
						value: q,
						onChange: (e) => setQ(e.target.value),
						className: "pl-9 h-9 text-xs rounded-xl focus-visible:ring-[#FF6B00]"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Category:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: categoryFilter,
							onChange: (e) => setCategoryFilter(e.target.value),
							className: "h-8 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold focus:outline-none",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "All",
									children: "All Categories"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Hotel",
									children: "Hotel"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Local DMC",
									children: "Local DMC"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Flight DMC",
									children: "Flight DMC"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Transport DMC",
									children: "Transport DMC"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Sightseeing Vendor",
									children: "Sightseeing Vendor"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Other",
									children: "Other"
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 text-xs",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted-foreground",
							children: "Status:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: statusFilter,
							onChange: (e) => setStatusFilter(e.target.value),
							className: "h-8 rounded-lg border border-gray-200 bg-white px-2 py-1 text-xs font-semibold focus:outline-none",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "All",
									children: "All Statuses"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Active",
									children: "Active Only"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "Inactive",
									children: "Inactive Only"
								})
							]
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-left text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-orange-50/50 text-[#FF6B00] text-xs font-bold border-b border-gray-200",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-4",
									children: "Vendor details"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-4",
									children: "Category"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-4",
									children: "Contact Info"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-4",
									children: "Location"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-4",
									children: "Rating"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-4",
									children: "Outstanding Bal."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-4",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-5 py-4 text-right",
									children: "Actions"
								})
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
							className: "divide-y divide-gray-100 text-gray-700 bg-white",
							children: [filtered.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "hover:bg-orange-50/5 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-4 font-semibold text-gray-900",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: v.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] text-muted-foreground font-mono mt-0.5",
											children: v.id
										})] })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-4 text-xs font-medium",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "bg-orange-100/50 text-[#FF6B00] px-2.5 py-0.5 rounded-full border border-orange-200/40",
											children: v.category
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-4 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-0.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-gray-900",
													children: v.contactPerson
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-muted-foreground flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }),
														" ",
														v.email
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-muted-foreground flex items-center gap-1",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" }),
														" ",
														v.phone
													]
												})
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-4 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex items-center gap-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-muted-foreground shrink-0" }),
												" ",
												v.location
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-4 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "inline-flex items-center gap-0.5 font-bold text-amber-500 bg-amber-50 px-2 py-0.5 rounded border border-amber-200",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-amber-400 text-amber-400" }),
												" ",
												v.rating.toFixed(1)
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-4 text-sm font-bold text-gray-900",
										children: formatINR(v.balance)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-4 text-xs",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${v.status === "Active" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-slate-50 border-slate-200 text-slate-500"}`,
											children: v.status
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-5 py-4 text-right",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-end gap-1.5",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "outline",
													size: "icon",
													title: "Record Payment",
													className: "h-8 w-8 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50",
													onClick: () => handleOpenPay(v),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-4 w-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "outline",
													size: "icon",
													title: "Edit Details",
													className: "h-8 w-8 text-[#FF6B00] hover:text-[#E05E00] hover:bg-orange-50/50",
													onClick: () => handleOpenEdit(v),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pen, { className: "h-3.5 w-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
													variant: "outline",
													size: "icon",
													title: "Delete Vendor",
													className: "h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50",
													onClick: () => handleDeleteVendor(v.id),
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
												})
											]
										})
									})
								]
							}, v.id)), filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								colSpan: 8,
								className: "px-5 py-12 text-center text-muted-foreground",
								children: "No vendors found matching your current filter selection."
							}) })]
						})]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isAddOpen,
				onOpenChange: setIsAddOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md bg-white text-[#111827]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-xl font-bold font-display",
							children: "Add New Supplier / Vendor"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Register a new travel agency service partner." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-gray-700",
										children: "Vendor / Company Name *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formName,
										onChange: (e) => setFormName(e.target.value),
										className: "h-8 text-xs focus-visible:ring-[#FF6B00]",
										placeholder: "Address Beach Resort"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-bold text-gray-700",
											children: "Category"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: formCategory,
											onChange: (e) => setFormCategory(e.target.value),
											className: "flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Hotel",
													children: "Hotel"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Local DMC",
													children: "Local DMC"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Flight DMC",
													children: "Flight DMC"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Transport DMC",
													children: "Transport DMC"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Sightseeing Vendor",
													children: "Sightseeing Vendor"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Other",
													children: "Other"
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-bold text-gray-700",
											children: "Contact Person *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: formContact,
											onChange: (e) => setFormContact(e.target.value),
											className: "h-8 text-xs",
											placeholder: "Sarah Jenkins"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-bold text-gray-700",
											children: "Work Phone *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: formPhone,
											onChange: (e) => setFormPhone(e.target.value),
											className: "h-8 text-xs",
											placeholder: "+971 4 879 8888"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-bold text-gray-700",
											children: "Email Address"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: formEmail,
											onChange: (e) => setFormEmail(e.target.value),
											className: "h-8 text-xs",
											placeholder: "reservations@addressbeach.com"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-gray-700",
										children: "Physical Location"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formLocation,
										onChange: (e) => setFormLocation(e.target.value),
										className: "h-8 text-xs",
										placeholder: "JBR, Dubai, UAE"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "font-bold text-gray-700",
												children: "Status"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: formStatus,
												onChange: (e) => setFormStatus(e.target.value),
												className: "flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Active",
													children: "Active"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Inactive",
													children: "Inactive"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "font-bold text-gray-700",
												children: "Initial Balance (INR)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: formBalance,
												onChange: (e) => setFormBalance(e.target.value),
												className: "h-8 text-xs"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "font-bold text-gray-700",
												children: "Rating (1.0 - 5.0)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												step: "0.1",
												value: formRating,
												onChange: (e) => setFormRating(e.target.value),
												className: "h-8 text-xs"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-gray-700",
										children: "Vendor Notes"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: formNotes,
										onChange: (e) => setFormNotes(e.target.value),
										className: "flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none",
										placeholder: "Partner policies, banking details, or contract descriptions..."
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setIsAddOpen(false),
							className: "h-9 text-xs rounded-xl",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleAddVendor,
							className: "bg-[#FF6B00] text-white hover:bg-[#E05E00] h-9 text-xs rounded-xl",
							children: "Save Supplier"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isEditOpen,
				onOpenChange: setIsEditOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-md bg-white text-[#111827]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "text-xl font-bold font-display",
							children: "Edit Vendor Profile"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Modify vendor credentials and default parameters." })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3 py-2 text-xs",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-gray-700",
										children: "Vendor / Company Name *"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formName,
										onChange: (e) => setFormName(e.target.value),
										className: "h-8 text-xs focus-visible:ring-[#FF6B00]"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-bold text-gray-700",
											children: "Category"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
											value: formCategory,
											onChange: (e) => setFormCategory(e.target.value),
											className: "flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-xs",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Hotel",
													children: "Hotel"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Local DMC",
													children: "Local DMC"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Flight DMC",
													children: "Flight DMC"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Transport DMC",
													children: "Transport DMC"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Sightseeing Vendor",
													children: "Sightseeing Vendor"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Other",
													children: "Other"
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-bold text-gray-700",
											children: "Contact Person *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: formContact,
											onChange: (e) => setFormContact(e.target.value),
											className: "h-8 text-xs"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-2 gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-bold text-gray-700",
											children: "Work Phone *"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: formPhone,
											onChange: (e) => setFormPhone(e.target.value),
											className: "h-8 text-xs"
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "font-bold text-gray-700",
											children: "Email Address"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: formEmail,
											onChange: (e) => setFormEmail(e.target.value),
											className: "h-8 text-xs"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-gray-700",
										children: "Physical Location"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: formLocation,
										onChange: (e) => setFormLocation(e.target.value),
										className: "h-8 text-xs"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-3 gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "font-bold text-gray-700",
												children: "Status"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: formStatus,
												onChange: (e) => setFormStatus(e.target.value),
												className: "flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-xs",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Active",
													children: "Active"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
													value: "Inactive",
													children: "Inactive"
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "font-bold text-gray-700",
												children: "Outstanding Balance (INR)"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												value: formBalance,
												onChange: (e) => setFormBalance(e.target.value),
												className: "h-8 text-xs"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "font-bold text-gray-700",
												children: "Rating"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
												type: "number",
												step: "0.1",
												value: formRating,
												onChange: (e) => setFormRating(e.target.value),
												className: "h-8 text-xs"
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "font-bold text-gray-700",
										children: "Notes"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
										value: formNotes,
										onChange: (e) => setFormNotes(e.target.value),
										className: "flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none"
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setIsEditOpen(false),
							className: "h-9 text-xs rounded-xl",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handleSaveEdit,
							className: "bg-[#FF6B00] text-white hover:bg-[#E05E00] h-9 text-xs rounded-xl",
							children: "Save Changes"
						})] })
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isPayOpen,
				onOpenChange: setIsPayOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-sm bg-white text-[#111827]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, {
							className: "text-base font-bold font-display flex items-center gap-1.5 text-emerald-600",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CreditCard, { className: "h-5 w-5" }), " Record Vendor Disbursement"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
							"Record an outgoing payment to ",
							selectedVendor?.name,
							". This will decrease their outstanding balance."
						] })] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4 py-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-gray-50 border border-gray-100 p-3 rounded-lg flex justify-between items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[10px] text-muted-foreground font-semibold uppercase",
									children: "Current Balance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-base font-black text-gray-800 mt-0.5",
									children: selectedVendor && formatINR(selectedVendor.balance)
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-right",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-[10px] text-muted-foreground font-semibold uppercase",
										children: "Vendor Code"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-mono font-bold text-gray-500 mt-0.5",
										children: selectedVendor?.id
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "font-bold text-gray-700",
									children: "Payment Amount (INR) *"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: payAmount,
									onChange: (e) => setPayAmount(e.target.value),
									className: "h-9 text-xs focus-visible:ring-emerald-500",
									placeholder: "Enter amount to pay..."
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setIsPayOpen(false),
							className: "h-9 text-xs rounded-xl",
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: handlePay,
							className: "bg-emerald-600 hover:bg-emerald-700 text-white h-9 text-xs rounded-xl font-bold",
							children: "Confirm Payment"
						})] })
					]
				})
			})
		]
	});
}
//#endregion
export { VendorsPage as component };
