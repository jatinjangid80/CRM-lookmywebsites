import { i as __toESM } from "../_runtime.mjs";
import { n as getAuth } from "./auth-B0Z-CWJL.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { t as Input } from "./input-uzm9g8Y7.mjs";
import { t as useLocalStorage } from "./use-local-storage-C6y5r3WN.mjs";
import { D as Plane, Dt as Car, Mt as Bus, P as Map, Pt as Briefcase, T as Plus, f as Trash2, ft as Download, h as Table2, it as FileSpreadsheet, jt as Calculator, n as X, nt as File, ot as FileImage, p as TramFront, q as Hotel, rt as FileText, s as Upload, x as Shield } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BvYONHWJ.mjs";
import { n as formatINR, t as bookings } from "./mock-data-4__fbKqF.mjs";
import { t as Label } from "./label-BeT0bXvu.mjs";
import { t as ImportModal } from "./import-modal-CK1ZeX3c.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/crm.bookings-CpxoEPaa.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var bookingTypes = [
	{
		type: "Air Ticket",
		icon: Plane,
		label: "Air Ticket"
	},
	{
		type: "Train Ticket",
		icon: TramFront,
		label: "Train Ticket"
	},
	{
		type: "Hotel",
		icon: Hotel,
		label: "Hotel"
	},
	{
		type: "Holiday Package",
		icon: Map,
		label: "Holiday Package"
	},
	{
		type: "Taxi",
		icon: Car,
		label: "Taxi"
	},
	{
		type: "Visa",
		icon: FileText,
		label: "Visa"
	},
	{
		type: "Travel Insurance",
		icon: Shield,
		label: "Travel Insurance"
	},
	{
		type: "Bus Ticket",
		icon: Bus,
		label: "Bus Ticket"
	}
];
function AddBookingModal({ open, onOpenChange, onSave }) {
	const [bookingType, setBookingType] = (0, import_react.useState)("Holiday Package");
	const [supplier, setSupplier] = (0, import_react.useState)("");
	const [bookingDate, setBookingDate] = (0, import_react.useState)((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [customer, setCustomer] = (0, import_react.useState)("");
	const [mobileNumber, setMobileNumber] = (0, import_react.useState)("");
	const [bookedBy, setBookedBy] = (0, import_react.useState)("");
	const [company, setCompany] = (0, import_react.useState)("");
	const [reference, setReference] = (0, import_react.useState)("");
	const [saleInvoiceNo, setSaleInvoiceNo] = (0, import_react.useState)("");
	const [purchaseInvoiceNo, setPurchaseInvoiceNo] = (0, import_react.useState)("");
	const [remarks, setRemarks] = (0, import_react.useState)("");
	const [sellingPrice, setSellingPrice] = (0, import_react.useState)(0);
	const [purchasePrice, setPurchasePrice] = (0, import_react.useState)(0);
	const [serviceCharges, setServiceCharges] = (0, import_react.useState)(0);
	const [gstAmount, setGstAmount] = (0, import_react.useState)(0);
	const [ticketAmount, setTicketAmount] = (0, import_react.useState)(0);
	const [refundDate, setRefundDate] = (0, import_react.useState)("");
	const [refundAmount, setRefundAmount] = (0, import_react.useState)(0);
	const [amountPaid, setAmountPaid] = (0, import_react.useState)(0);
	const [paymentMode, setPaymentMode] = (0, import_react.useState)("Cash");
	const [paymentStatus, setPaymentStatus] = (0, import_react.useState)("Pending");
	const [transactionId, setTransactionId] = (0, import_react.useState)("");
	const [details, setDetails] = (0, import_react.useState)({});
	(0, import_react.useEffect)(() => {
		if (open) {
			setBookingType("Holiday Package");
			setSupplier("");
			setBookingDate((/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
			setCustomer("");
			setMobileNumber("");
			setBookedBy("");
			setCompany("");
			setReference("");
			setSaleInvoiceNo("");
			setPurchaseInvoiceNo("");
			setRemarks("");
			setSellingPrice(0);
			setPurchasePrice(0);
			setServiceCharges(0);
			setGstAmount(0);
			setTicketAmount(0);
			setRefundDate("");
			setRefundAmount(0);
			setAmountPaid(0);
			setPaymentMode("Cash");
			setPaymentStatus("Pending");
			setTransactionId("");
			setDetails({});
		}
	}, [open]);
	const updateDetail = (key, value) => {
		setDetails((prev) => ({
			...prev,
			[key]: value
		}));
	};
	const profit = (0, import_react.useMemo)(() => {
		return (sellingPrice || 0) - (purchasePrice || 0);
	}, [sellingPrice, purchasePrice]);
	const margin = (0, import_react.useMemo)(() => {
		if (!sellingPrice || sellingPrice === 0) return 0;
		return Number((profit / sellingPrice * 100).toFixed(2));
	}, [profit, sellingPrice]);
	const pendingAmount = (0, import_react.useMemo)(() => {
		return (sellingPrice || 0) - (amountPaid || 0);
	}, [sellingPrice, amountPaid]);
	const handleSubmit = (e) => {
		e.preventDefault();
		if (!customer) {
			alert("Customer name is required.");
			return;
		}
		onSave({
			id: `BK-${Math.floor(1e3 + Math.random() * 9e3)}`,
			bookingType,
			supplier,
			bookingDate,
			customer,
			mobileNumber,
			bookedBy,
			company,
			reference,
			saleInvoiceNo,
			purchaseInvoiceNo,
			remarks,
			sellingPrice,
			purchasePrice,
			serviceCharges,
			gstAmount,
			ticketAmount,
			profit,
			margin,
			refundDate,
			refundAmount,
			amount: sellingPrice,
			paid: amountPaid,
			paymentMode,
			transactionId,
			status: paymentStatus,
			package: details.packageType || details.hotelName || details.airline || details.trainName || bookingType,
			travelDate: details.travelDate || details.checkIn || details.processDate || bookingDate,
			details
		});
		onOpenChange(false);
	};
	const renderSectionHeader = (title) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "col-span-full border-b border-border pb-2 mt-4 mb-2 flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-1 bg-primary rounded-full" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
			className: "text-sm font-bold tracking-tight",
			children: title
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-[800px] max-h-[90vh] overflow-y-auto rounded-2xl border border-border p-0 shadow-2xl bg-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "sticky top-0 z-10 bg-card border-b border-border p-6 pb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display text-xl font-bold",
					children: "Add New Booking"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
					className: "text-xs mt-1",
					children: "Select a booking type and fill in the details below."
				})] })
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: handleSubmit,
				className: "p-6 space-y-6 pt-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
							children: "Booking Type *"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 md:grid-cols-4 gap-2",
							children: bookingTypes.map((bt) => {
								const Icon = bt.icon;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setBookingType(bt.type),
									className: `flex items-center gap-2 p-2.5 rounded-xl border text-xs font-semibold transition-all ${bookingType === bt.type ? "bg-primary/10 border-primary/50 text-primary ring-1 ring-primary/20" : "bg-secondary/40 border-border text-muted-foreground hover:bg-secondary/80 hover:text-foreground"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-4 w-4" }), bt.label]
								}, bt.type);
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 md:grid-cols-2 gap-4",
						children: [
							renderSectionHeader("Common Details"),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Supplier *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									value: supplier,
									onChange: (e) => setSupplier(e.target.value),
									placeholder: "Supplier name"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Booking Date *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									required: true,
									value: bookingDate,
									onChange: (e) => setBookingDate(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Customer Name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									value: customer,
									onChange: (e) => setCustomer(e.target.value),
									placeholder: "e.g. John Doe"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Mobile Number *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									required: true,
									type: "tel",
									value: mobileNumber,
									onChange: (e) => setMobileNumber(e.target.value),
									placeholder: "+91 XXXXX XXXXX"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Booked By" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: bookedBy,
									onChange: (e) => setBookedBy(e.target.value),
									placeholder: "Agent/Employee name"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Company" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: company,
									onChange: (e) => setCompany(e.target.value),
									placeholder: "Company name"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Reference" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: reference,
									onChange: (e) => setReference(e.target.value),
									placeholder: "Ref ID"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sale Invoice No." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: saleInvoiceNo,
									onChange: (e) => setSaleInvoiceNo(e.target.value),
									placeholder: "INV-001"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Purchase Invoice No." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: purchaseInvoiceNo,
									onChange: (e) => setPurchaseInvoiceNo(e.target.value),
									placeholder: "PINV-001"
								})]
							}),
							renderSectionHeader("Booking Details"),
							(bookingType === "Train Ticket" || bookingType === "Air Ticket") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Travel Date *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										required: true,
										value: details.travelDate || "",
										onChange: (e) => updateDetail("travelDate", e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sector *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.sector || "",
										onChange: (e) => updateDetail("sector", e.target.value),
										placeholder: "DEL - MUM"
									})]
								}),
								bookingType === "Train Ticket" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Train Name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.trainName || "",
										onChange: (e) => updateDetail("trainName", e.target.value),
										placeholder: "Rajdhani Exp"
									})]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Airline *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.airline || "",
										onChange: (e) => updateDetail("airline", e.target.value),
										placeholder: "IndiGo"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PNR *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.pnr || "",
										onChange: (e) => updateDetail("pnr", e.target.value),
										placeholder: "PNR12345"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Passenger Name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.passengerName || "",
										onChange: (e) => updateDetail("passengerName", e.target.value),
										placeholder: "Passenger Name"
									})]
								})
							] }),
							bookingType === "Hotel" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Check In *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										required: true,
										value: details.checkIn || "",
										onChange: (e) => updateDetail("checkIn", e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Check Out *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										required: true,
										value: details.checkOut || "",
										onChange: (e) => updateDetail("checkOut", e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "City *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.city || "",
										onChange: (e) => updateDetail("city", e.target.value),
										placeholder: "Goa"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Hotel Name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.hotelName || "",
										onChange: (e) => updateDetail("hotelName", e.target.value),
										placeholder: "Taj Hotel"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Meal Plan" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: details.mealPlan || "",
										onChange: (e) => updateDetail("mealPlan", e.target.value),
										placeholder: "CP/MAP"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Leader Name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.leaderName || "",
										onChange: (e) => updateDetail("leaderName", e.target.value),
										placeholder: "Guest Name"
									})]
								})
							] }),
							bookingType === "Holiday Package" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Travel From *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										required: true,
										value: details.travelFrom || "",
										onChange: (e) => updateDetail("travelFrom", e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Travel To *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										required: true,
										value: details.travelTo || "",
										onChange: (e) => updateDetail("travelTo", e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Destination *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.destination || "",
										onChange: (e) => updateDetail("destination", e.target.value),
										placeholder: "Maldives"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Package Type *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.packageType || "",
										onChange: (e) => updateDetail("packageType", e.target.value),
										placeholder: "Honeymoon"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "No. of Pax *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										required: true,
										value: details.noOfPax || "",
										onChange: (e) => updateDetail("noOfPax", Number(e.target.value)),
										placeholder: "2"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Leader Name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.leaderName || "",
										onChange: (e) => updateDetail("leaderName", e.target.value),
										placeholder: "Guest Name"
									})]
								})
							] }),
							bookingType === "Taxi" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Travel Date *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										required: true,
										value: details.travelDate || "",
										onChange: (e) => updateDetail("travelDate", e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "City / Route *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.cityRoute || "",
										onChange: (e) => updateDetail("cityRoute", e.target.value),
										placeholder: "Delhi - Agra"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Vehicle Type *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.vehicleType || "",
										onChange: (e) => updateDetail("vehicleType", e.target.value),
										placeholder: "Innova Crysta"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Days *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										required: true,
										value: details.days || "",
										onChange: (e) => updateDetail("days", Number(e.target.value)),
										placeholder: "3"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Vehicle No." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: details.vehicleNo || "",
										onChange: (e) => updateDetail("vehicleNo", e.target.value),
										placeholder: "DL 1C AA 1111"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Driver Name" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: details.driverName || "",
										onChange: (e) => updateDetail("driverName", e.target.value),
										placeholder: "Driver Name"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Driver Mobile" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "tel",
										value: details.driverMobile || "",
										onChange: (e) => updateDetail("driverMobile", e.target.value),
										placeholder: "Mobile"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Total KM" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: details.totalKm || "",
										onChange: (e) => updateDetail("totalKm", Number(e.target.value)),
										placeholder: "0"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Night Charges (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: details.nightCharges || "",
										onChange: (e) => updateDetail("nightCharges", Number(e.target.value)),
										placeholder: "0"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Toll Tax (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: details.tollTax || "",
										onChange: (e) => updateDetail("tollTax", Number(e.target.value)),
										placeholder: "0"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Rate (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										value: details.rate || "",
										onChange: (e) => updateDetail("rate", Number(e.target.value)),
										placeholder: "0"
									})]
								})
							] }),
							bookingType === "Visa" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Country *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.country || "",
										onChange: (e) => updateDetail("country", e.target.value),
										placeholder: "Dubai"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Visa Type *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.visaType || "",
										onChange: (e) => updateDetail("visaType", e.target.value),
										placeholder: "Tourist 30 Days"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Process Date *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										required: true,
										value: details.processDate || "",
										onChange: (e) => updateDetail("processDate", e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Application Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: details.applicationStatus || "",
										onChange: (e) => updateDetail("applicationStatus", e.target.value),
										placeholder: "Submitted"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Passenger Name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.passengerName || "",
										onChange: (e) => updateDetail("passengerName", e.target.value),
										placeholder: "Passenger Name"
									})]
								})
							] }),
							bookingType === "Travel Insurance" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Country *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.country || "",
										onChange: (e) => updateDetail("country", e.target.value),
										placeholder: "Schengen"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Insurance Type *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.insuranceType || "",
										onChange: (e) => updateDetail("insuranceType", e.target.value),
										placeholder: "Comprehensive"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Process Date *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										required: true,
										value: details.processDate || "",
										onChange: (e) => updateDetail("processDate", e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Passenger Name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.passengerName || "",
										onChange: (e) => updateDetail("passengerName", e.target.value),
										placeholder: "Passenger Name"
									})]
								})
							] }),
							bookingType === "Bus Ticket" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Travel Date *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "date",
										required: true,
										value: details.travelDate || "",
										onChange: (e) => updateDetail("travelDate", e.target.value)
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Sector *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.sector || "",
										onChange: (e) => updateDetail("sector", e.target.value),
										placeholder: "DEL - MANALI"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Bus Operator *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.busOperator || "",
										onChange: (e) => updateDetail("busOperator", e.target.value),
										placeholder: "Zingbus"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "PNR / Ticket No." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: details.pnr || "",
										onChange: (e) => updateDetail("pnr", e.target.value),
										placeholder: "TKT123"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Passenger Name *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										required: true,
										value: details.passengerName || "",
										onChange: (e) => updateDetail("passengerName", e.target.value),
										placeholder: "Passenger Name"
									})]
								})
							] }),
							renderSectionHeader("Financial Details"),
							bookingType === "Bus Ticket" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Ticket Amount (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: ticketAmount || "",
									onChange: (e) => setTicketAmount(Number(e.target.value))
								})]
							}),
							(bookingType === "Train Ticket" || bookingType === "Air Ticket" || bookingType === "Bus Ticket") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Service Charges (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: serviceCharges || "",
									onChange: (e) => setServiceCharges(Number(e.target.value))
								})]
							}),
							(bookingType === "Train Ticket" || bookingType === "Bus Ticket") && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "GST Amount (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: gstAmount || "",
									onChange: (e) => setGstAmount(Number(e.target.value))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Selling Price (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									required: true,
									value: sellingPrice || "",
									onChange: (e) => setSellingPrice(Number(e.target.value))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Purchase Price (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									required: true,
									value: purchasePrice || "",
									onChange: (e) => setPurchasePrice(Number(e.target.value))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Refund Date" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "date",
									value: refundDate,
									onChange: (e) => setRefundDate(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Refund Amount (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: refundAmount || "",
									onChange: (e) => setRefundAmount(Number(e.target.value))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "col-span-full mt-2 rounded-xl bg-secondary/30 p-4 border border-border flex flex-wrap gap-6 items-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calculator, { className: "h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-semibold text-muted-foreground uppercase tracking-wider",
											children: "Auto-Calc:"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase text-muted-foreground font-bold",
											children: "Profit"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: `font-mono font-bold ${profit > 0 ? "text-emerald-600" : profit < 0 ? "text-red-500" : "text-gray-700"}`,
											children: ["₹", profit.toLocaleString()]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase text-muted-foreground font-bold",
											children: "Margin %"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: `font-mono font-bold ${margin > 0 ? "text-emerald-600" : margin < 0 ? "text-red-500" : "text-gray-700"}`,
											children: [margin, "%"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[10px] uppercase text-muted-foreground font-bold",
											children: "Pending Amount"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-mono font-bold text-orange-600",
											children: ["₹", pendingAmount.toLocaleString()]
										})]
									})
								]
							}),
							renderSectionHeader("Payment Details"),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Total Amount (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									disabled: true,
									value: sellingPrice,
									className: "bg-secondary/50 font-mono font-semibold"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Amount Paid (₹)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									required: true,
									value: amountPaid || "",
									onChange: (e) => setAmountPaid(Number(e.target.value))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payment Mode" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: paymentMode,
									onChange: (e) => setPaymentMode(e.target.value),
									className: "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Cash",
											children: "Cash"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "UPI",
											children: "UPI"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Card",
											children: "Card"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Bank Transfer",
											children: "Bank Transfer"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Cheque",
											children: "Cheque"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Payment Status" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									value: paymentStatus,
									onChange: (e) => setPaymentStatus(e.target.value),
									className: "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Pending",
											children: "Pending"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Partial",
											children: "Partial"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Paid",
											children: "Paid"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "Refunded",
											children: "Refunded"
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 col-span-1 md:col-span-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Transaction ID" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: transactionId,
									onChange: (e) => setTransactionId(e.target.value),
									placeholder: "TXN..."
								})]
							}),
							renderSectionHeader("Remarks"),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-2 col-span-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: remarks,
									onChange: (e) => setRemarks(e.target.value),
									placeholder: "Add any additional notes here..."
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sticky bottom-0 bg-card border-t border-border p-4 -mx-6 -mb-6 mt-6 flex justify-end gap-3 z-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => onOpenChange(false),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							className: "bg-[#FF6B00] hover:bg-[#E05E00] text-white",
							children: "Save Booking"
						})]
					})
				]
			})]
		})
	});
}
var statusColor = {
	Confirmed: "bg-emerald-100 text-emerald-700",
	Pending: "bg-amber-100 text-amber-700",
	Cancelled: "bg-rose-100 text-rose-700",
	Completed: "bg-blue-100 text-blue-700",
	Partial: "bg-blue-100 text-blue-700",
	Paid: "bg-emerald-100 text-emerald-700",
	Refunded: "bg-purple-100 text-purple-700"
};
function BookingsPage() {
	const isAdmin = getAuth()?.role === "admin";
	const [bookingList, setBookingList] = useLocalStorage("crm_bookings", bookings);
	const [leads] = useLocalStorage("crm_leads_v2", []);
	const allBookings = (0, import_react.useMemo)(() => {
		const derived = leads.filter((l) => l.bookingReference || l.status === "Booked" || l.status === "Completed").map((l) => ({
			id: "LD-" + l.id.replace("L-", ""),
			bookingType: l.service || "Holiday Package",
			supplier: l.vendorName || "Not Assigned",
			bookingDate: l.createdAt,
			customer: l.name,
			mobileNumber: l.phone,
			bookedBy: l.assignedTo || "Admin",
			company: l.clientCompany || "",
			reference: l.bookingReference || "",
			saleInvoiceNo: "",
			purchaseInvoiceNo: "",
			remarks: l.notes || "",
			sellingPrice: l.totalAmount || 0,
			purchasePrice: 0,
			profit: 0,
			margin: 0,
			amount: l.totalAmount || 0,
			paid: l.amountPaid || 0,
			paymentMode: "Card",
			transactionId: "",
			status: l.paymentStatus || "Pending",
			package: l.destination || "Unknown",
			travelDate: l.travelDate || "TBD"
		}));
		return [...bookingList, ...derived];
	}, [leads, bookingList]);
	const [isAddOpen, setIsAddOpen] = (0, import_react.useState)(false);
	const [isImportOpen, setIsImportOpen] = (0, import_react.useState)(false);
	const [managingBooking, setManagingBooking] = (0, import_react.useState)(null);
	const [isManageOpen, setIsManageOpen] = (0, import_react.useState)(false);
	const [deleteTarget, setDeleteTarget] = (0, import_react.useState)(null);
	const [activeTab, setActiveTab] = (0, import_react.useState)("All");
	const [successBooking, setSuccessBooking] = (0, import_react.useState)(null);
	const [showSuccess, setShowSuccess] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (showSuccess) {
			const t = setTimeout(() => setShowSuccess(false), 4e3);
			return () => clearTimeout(t);
		}
	}, [showSuccess]);
	const [isExportOpen, setIsExportOpen] = (0, import_react.useState)(false);
	const exportToExcel = () => {
		const csvRows = [[
			"ID",
			"Customer",
			"Package",
			"Travel Date",
			"Amount (₹)",
			"Paid (₹)",
			"Status"
		].join(","), ...allBookings.map((b) => [
			`"${b.id}"`,
			`"${b.customer.replace(/"/g, "\"\"")}"`,
			`"${b.package.replace(/"/g, "\"\"")}"`,
			`"${b.travelDate}"`,
			b.amount,
			b.paid,
			`"${b.status}"`
		].join(","))];
		const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", `bookings_export_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.csv`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	const exportToWord = () => {
		const htmlString = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><title>Bookings Export</title><style>table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; } th, td { border: 1px solid #dddddd; padding: 8px; text-align: left; } th { background-color: #f2f2f2; }</style></head>
      <body><h2>Grand Journeys CRM - Bookings Export</h2><table><tr><th>ID</th><th>Customer</th><th>Package</th><th>Travel Date</th><th>Amount</th><th>Paid</th><th>Status</th></tr>${allBookings.map((b) => `<tr><td>${b.id}</td><td>${b.customer}</td><td>${b.package}</td><td>${b.travelDate}</td><td>₹${b.amount}</td><td>₹${b.paid}</td><td>${b.status}</td></tr>`).join("")}</table></body>
      </html>
    `;
		const blob = new Blob([htmlString], { type: "application/msword" });
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.setAttribute("href", url);
		link.setAttribute("download", `bookings_export_${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}.doc`);
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	};
	const exportToPDF = () => {
		const printWindow = window.open("", "_blank");
		if (!printWindow) return;
		const tableHeader = "<tr><th>ID</th><th>Customer</th><th>Package</th><th>Travel Date</th><th>Amount</th><th>Paid</th><th>Status</th></tr>";
		const tableRows = allBookings.map((b) => `<tr><td>${b.id}</td><td>${b.customer}</td><td>${b.package}</td><td>${b.travelDate}</td><td>\u20b9${b.amount}</td><td>\u20b9${b.paid}</td><td>${b.status}</td></tr>`).join("");
		const css = `body{font-family:sans-serif;padding:20px;color:#333}h2{color:#f43f5e;margin-bottom:5px}p{font-size:12px;color:#666;margin-bottom:20px}table{border-collapse:collapse;width:100%;font-size:12px}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f9fafb;font-weight:bold}tr:nth-child(even){background:#f3f4f6}`;
		const styleEl = printWindow.document.createElement("style");
		styleEl.textContent = css;
		printWindow.document.head.appendChild(styleEl);
		const titleEl = printWindow.document.createElement("title");
		titleEl.textContent = "Bookings Export PDF";
		printWindow.document.head.appendChild(titleEl);
		const bodyHtml = `<h2>Grand Journeys CRM - Bookings Export</h2><p>Generated on ${(/* @__PURE__ */ new Date()).toLocaleDateString("en-IN")} | Total Bookings: ${allBookings.length}</p><table><thead>${tableHeader}</thead><tbody>${tableRows}</tbody></table>`;
		const wrapper = printWindow.document.createElement("div");
		wrapper.innerHTML = bodyHtml;
		printWindow.document.body.appendChild(wrapper);
		const script = printWindow.document.createElement("script");
		script.textContent = "window.onload=function(){window.print();window.onafterprint=function(){window.close();}}";
		printWindow.document.body.appendChild(script);
		printWindow.document.close();
	};
	const [uploadFile, setUploadFile] = (0, import_react.useState)(null);
	const [uploadPriority, setUploadPriority] = (0, import_react.useState)("Medium");
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const handleManageBooking = (booking) => {
		setManagingBooking(booking);
		setIsManageOpen(true);
		setUploadFile(null);
		setUploadPriority("Medium");
	};
	function readAsDataUrl(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = () => resolve(reader.result);
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}
	const handleAddFile = async (e) => {
		e.preventDefault();
		if (!uploadFile || !managingBooking) return;
		setUploading(true);
		try {
			const dataUrl = await readAsDataUrl(uploadFile);
			const newFile = {
				name: uploadFile.name,
				size: uploadFile.size,
				type: uploadFile.type || "application/octet-stream",
				priority: uploadPriority,
				uploadedAt: (/* @__PURE__ */ new Date()).toISOString(),
				dataUrl
			};
			const updatedBooking = {
				...managingBooking,
				files: [...managingBooking.files || [], newFile]
			};
			setBookingList((prev) => prev.map((b) => b.id === managingBooking.id ? updatedBooking : b));
			setManagingBooking(updatedBooking);
			setUploadFile(null);
			setUploadPriority("Medium");
			const fileInput = document.getElementById("booking-doc-file");
			if (fileInput) fileInput.value = "";
		} catch (err) {
			console.error("File upload failed", err);
			alert("File upload failed: " + (err instanceof Error ? err.message : "Unknown error"));
		} finally {
			setUploading(false);
		}
	};
	const handleDeleteFile = (fileName) => {
		if (!managingBooking) return;
		const updatedBooking = {
			...managingBooking,
			files: (managingBooking.files || []).filter((f) => f.name !== fileName)
		};
		setBookingList((prev) => prev.map((b) => b.id === managingBooking.id ? updatedBooking : b));
		setManagingBooking(updatedBooking);
	};
	const handleDeleteBooking = () => {
		if (!deleteTarget) return;
		setBookingList((prev) => prev.filter((b) => b.id !== deleteTarget.id));
		setDeleteTarget(null);
	};
	function getFileIcon(type, name) {
		const lowercaseName = name.toLowerCase();
		if (type === "application/pdf" || lowercaseName.endsWith(".pdf")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-rose-500" });
		if (type.includes("sheet") || type.includes("excel") || lowercaseName.endsWith(".xlsx") || lowercaseName.endsWith(".xls") || lowercaseName.endsWith(".csv")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-4 w-4 text-emerald-500" });
		if (type.includes("word") || type.includes("document") || lowercaseName.endsWith(".docx") || lowercaseName.endsWith(".doc")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileText, { className: "h-4 w-4 text-blue-500" });
		if (type.startsWith("image/")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileImage, { className: "h-4 w-4 text-purple-500" });
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(File, { className: "h-4 w-4 text-gray-400" });
	}
	function fmtSize(bytes) {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
	}
	const priorityColor = {
		High: "bg-red-50 text-red-700 border-red-200",
		Medium: "bg-amber-50 text-amber-700 border-amber-200",
		Low: "bg-blue-50 text-blue-700 border-blue-200"
	};
	const handleImportBookings = (data) => {
		const importedBookings = data.map((row) => ({
			id: `BK-${1e3 + Math.floor(Math.random() * 9e3)}`,
			bookingType: "Legacy",
			supplier: row["Supplier"] || "Unknown",
			bookingDate: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			customer: row["Customer"] || row["customer"] || row["Name"] || "Unknown",
			mobileNumber: "",
			bookedBy: "",
			company: "",
			reference: "",
			saleInvoiceNo: "",
			purchaseInvoiceNo: "",
			remarks: "",
			sellingPrice: parseInt(row["Amount"] || row["amount"] || row["Total"]) || 0,
			purchasePrice: 0,
			profit: 0,
			margin: 0,
			package: row["Package"] || row["package"] || row["Service"] || "Custom Package",
			travelDate: row["Travel Date"] || row["travelDate"] || row["Date"] || (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
			status: row["Status"] || row["status"] || "Pending",
			amount: parseInt(row["Amount"] || row["amount"] || row["Total"]) || 0,
			paid: parseInt(row["Paid"] || row["paid"]) || 0,
			paymentMode: "Cash",
			transactionId: ""
		}));
		setBookingList((prev) => [...importedBookings, ...prev]);
	};
	const handleAddBookingSave = (booking) => {
		setBookingList([booking, ...bookingList]);
		setSuccessBooking(booking);
		setShowSuccess(true);
	};
	const filteredBookings = allBookings.filter((b) => activeTab === "All" || b.bookingType === activeTab || activeTab === "Holiday Package" && !b.bookingType);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-bold",
					children: "Bookings"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Packages, flights, hotels, visas and transfers — all in one place."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "gap-2 rounded-xl",
							onClick: () => setIsExportOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-4 w-4" }), " Export Bookings"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "outline",
							className: "gap-2",
							onClick: () => setIsImportOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), " Import Bookings"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "btn-hero",
							onClick: () => setIsAddOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "mr-2 h-4 w-4" }), " New booking"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddBookingModal, {
							open: isAddOpen,
							onOpenChange: setIsAddOpen,
							onSave: handleAddBookingSave
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide border-b border-border",
				children: [
					"All",
					"Air Ticket",
					"Train Ticket",
					"Hotel",
					"Holiday Package",
					"Taxi",
					"Visa",
					"Travel Insurance",
					"Bus Ticket"
				].map((tab) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => setActiveTab(tab),
					className: `whitespace-nowrap px-4 py-2 rounded-t-lg text-sm font-semibold transition-colors ${activeTab === tab ? "bg-card text-primary border-b-2 border-primary" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`,
					children: tab
				}, tab))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-2xl border border-border bg-card shadow-card",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
							className: "bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Booking ID"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Customer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Type / Service"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Travel Date"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Amount"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Profit / Margin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3",
									children: "Files"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-4 py-3" })
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filteredBookings.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							colSpan: 9,
							className: "py-8 text-center text-muted-foreground",
							children: [
								"No bookings found for ",
								activeTab,
								"."
							]
						}) }) : filteredBookings.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border hover:bg-secondary/30",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-mono text-xs text-primary font-semibold",
									children: b.id
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-semibold",
									children: b.customer
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-semibold text-xs text-foreground/80",
											children: b.bookingType || "Holiday Package"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted-foreground truncate max-w-[150px]",
											title: b.package,
											children: b.package
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-sm",
									children: b.travelDate
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-medium",
									children: formatINR(b.amount || 0)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: b.profit > 0 ? "text-emerald-600 font-semibold text-xs" : "text-muted-foreground text-xs",
											children: formatINR(b.profit || 0)
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-[10px] text-muted-foreground",
											children: [b.margin || 0, "%"]
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `rounded-full px-2 py-1 text-[10px] font-bold tracking-wider uppercase ${statusColor[b.status] || statusColor["Pending"]}`,
										children: b.status
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: b.files && b.files.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1.5 rounded-full bg-blue-50 text-blue-700 px-2 py-0.5 text-xs font-semibold border border-blue-100",
										children: [
											"📄 ",
											b.files.length,
											" file",
											b.files.length !== 1 ? "s" : ""
										]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground/50 text-xs",
										children: "—"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-end gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => handleManageBooking(b),
											children: "Manage"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											className: "text-rose-500 hover:text-rose-700 hover:bg-rose-50 h-8 w-8 p-0 rounded-xl",
											onClick: () => setDeleteTarget(b),
											title: "Delete Booking",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" })
										})]
									})
								})
							]
						}, b.id)) })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImportModal, {
				open: isImportOpen,
				onOpenChange: setIsImportOpen,
				onImport: handleImportBookings,
				title: "Import Bookings",
				description: "Upload a CSV or Excel file containing your bookings."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isManageOpen,
				onOpenChange: setIsManageOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-border p-6 shadow-2xl bg-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-display text-lg font-bold",
							children: "Manage Booking Details"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
							className: "text-xs text-muted-foreground mt-1",
							children: "Upload visa documents, tickets, hotel vouchers, and set document priorities."
						})] }),
						managingBooking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6 py-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-border bg-secondary/20 p-4 space-y-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between items-center",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs font-semibold text-primary",
											children: managingBooking.id
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `rounded-full px-2 py-0.5 text-xs font-semibold ${statusColor[managingBooking.status]}`,
											children: managingBooking.status
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-4 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Customer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: managingBooking.customer
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Travel Date"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: managingBooking.travelDate
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-muted-foreground",
													children: "Package / Service"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-muted-foreground",
													children: managingBooking.package
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Total Budget"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-primary",
												children: formatINR(managingBooking.amount)
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-muted-foreground",
												children: "Amount Paid"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-emerald-700",
												children: formatINR(managingBooking.paid)
											})] })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleAddFile,
									className: "space-y-4 border-t border-border pt-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
											children: "Attach Document"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "grid grid-cols-3 gap-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-span-2 space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "booking-doc-file",
													className: "text-xs",
													children: "Document File (.pdf, .xlsx, .doc, image)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
													id: "booking-doc-file",
													type: "file",
													required: true,
													accept: ".pdf,.xls,.xlsx,.doc,.docx,image/*",
													onChange: (e) => setUploadFile(e.target.files?.[0] || null),
													className: "h-9 text-xs rounded-lg cursor-pointer"
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
													htmlFor: "booking-doc-priority",
													className: "text-xs",
													children: "File Priority"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													id: "booking-doc-priority",
													value: uploadPriority,
													onChange: (e) => setUploadPriority(e.target.value),
													className: "flex h-9 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary",
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
												})]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
											type: "submit",
											disabled: uploading || !uploadFile,
											className: "w-full h-9 rounded-lg text-xs gap-1.5",
											style: { background: "var(--gradient-brand)" },
											children: [uploading ? "Saving File..." : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), uploading ? "Uploading..." : "Attach Document"]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border-t border-border pt-4 space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
										children: "Attached Files"
									}), !managingBooking.files || managingBooking.files.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-center py-6 text-xs text-muted-foreground border border-dashed rounded-xl p-4 bg-secondary/15",
										children: "No documents attached yet. Upload flights, hotels, or visa documents."
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-2 max-h-48 overflow-y-auto pr-1",
										children: managingBooking.files.map((file) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between rounded-xl border border-border p-3 bg-secondary/10 hover:bg-secondary/20 transition-all text-xs",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2.5 min-w-0 flex-1",
												children: [getFileIcon(file.type, file.name), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "min-w-0 flex-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-semibold truncate text-foreground",
														children: file.name
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-[10px] text-muted-foreground",
														children: fmtSize(file.size)
													})]
												})]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2.5 ml-3 shrink-0",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: `inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${priorityColor[file.priority]}`,
														children: file.priority
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
														href: file.dataUrl,
														download: file.name,
														className: "rounded-lg p-1 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
														title: "Download file",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-3.5 w-3.5" })
													}),
													isAdmin && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														type: "button",
														onClick: () => handleDeleteFile(file.name),
														className: "rounded-lg p-1 text-muted-foreground hover:bg-red-50 hover:text-red-600 transition-colors",
														title: "Delete file (Admin only)",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-3.5 w-3.5" })
													})
												]
											})]
										}, file.name))
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
								onClick: () => setIsManageOpen(false),
								children: "Close"
							})
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: isExportOpen,
				onOpenChange: setIsExportOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
							className: "font-display text-lg font-bold",
							children: "Export Bookings"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
							className: "text-xs text-muted-foreground mt-1",
							children: [
								"Export the current list of ",
								allBookings.length,
								" bookings in your preferred file format."
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
			}),
			showSuccess && successBooking && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-[100] flex items-center justify-center",
				style: {
					background: "rgba(0,0,0,0.45)",
					backdropFilter: "blur(4px)"
				},
				onClick: () => setShowSuccess(false),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-4 w-full max-w-sm rounded-3xl bg-card shadow-2xl border border-border overflow-hidden",
					style: { animation: "successPop 0.45s cubic-bezier(0.34,1.56,0.64,1) both" },
					onClick: (e) => e.stopPropagation(),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 w-full",
							style: { background: "linear-gradient(90deg, #f43f5e, #f59e0b, #10b981, #3b82f6, #a855f7)" }
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setShowSuccess(false),
							className: "absolute top-4 right-4 rounded-full p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center gap-4 px-8 py-8 text-center",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg",
									style: { animation: "thumbBounce 0.6s 0.2s cubic-bezier(0.34,1.56,0.64,1) both" },
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										style: {
											fontSize: "3rem",
											lineHeight: 1
										},
										children: "👍"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-2xl font-extrabold tracking-tight text-foreground",
										children: "Thank You for Booking!"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted-foreground",
										children: "Your booking has been confirmed successfully."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "w-full rounded-2xl bg-secondary/40 border border-border p-4 text-left space-y-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "font-mono text-xs font-bold text-primary",
											children: successBooking.id
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-[10px] font-bold",
											children: successBooking.status
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground uppercase tracking-wide",
												children: "Customer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-foreground",
												children: successBooking.customer
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground uppercase tracking-wide",
												children: "Travel Date"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold text-foreground",
												children: successBooking.travelDate || "—"
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "col-span-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] text-muted-foreground uppercase tracking-wide",
													children: "Package"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-foreground truncate",
													children: successBooking.package
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground uppercase tracking-wide",
												children: "Total Amount"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-primary",
												children: formatINR(successBooking.amount)
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-[10px] text-muted-foreground uppercase tracking-wide",
												children: "Paid"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-bold text-emerald-600",
												children: formatINR(successBooking.paid)
											})] })
										]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => setShowSuccess(false),
									className: "w-full rounded-xl py-2.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90 active:scale-95",
									style: { background: "linear-gradient(135deg, #10b981, #059669)" },
									children: "🎉 Awesome, Got it!"
								})
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
            @keyframes successPop {
              0% { opacity: 0; transform: scale(0.7) translateY(30px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
            @keyframes thumbBounce {
              0% { opacity: 0; transform: scale(0.3) rotate(-20deg); }
              100% { opacity: 1; transform: scale(1) rotate(0deg); }
            }
          ` })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!deleteTarget,
				onOpenChange: () => setDeleteTarget(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "sm:max-w-[400px] rounded-3xl border-border bg-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
						className: "font-display text-lg font-bold",
						children: "Delete Booking"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, {
						className: "text-sm text-muted-foreground mt-2",
						children: [
							"Are you sure you want to delete the booking for ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-foreground",
								children: deleteTarget?.customer
							}),
							" (",
							deleteTarget?.id,
							")? This action cannot be undone."
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, {
						className: "gap-2 sm:gap-0 mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							className: "rounded-xl",
							onClick: () => setDeleteTarget(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "destructive",
							className: "rounded-xl",
							onClick: handleDeleteBooking,
							children: "Delete"
						})]
					})]
				})
			})
		]
	});
}
//#endregion
export { BookingsPage as component };
