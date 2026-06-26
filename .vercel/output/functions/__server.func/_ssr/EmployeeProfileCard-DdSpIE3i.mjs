import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as useLocalStorage } from "./use-local-storage-C6y5r3WN.mjs";
import { I as Mail, O as Phone, i as User } from "../_libs/lucide-react.mjs";
import { n as createDefaultEmployeeDetails, t as INITIAL_EMPLOYEE_DETAILS } from "./employee-profile-defaults-wd6GGcin.mjs";
import { t as INITIAL_EMPLOYEES } from "./crm.employees-B3X2ArRi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/EmployeeProfileCard-DdSpIE3i.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_COLOR = {
	Active: "bg-emerald-100 text-emerald-800 border-emerald-200",
	"On Leave": "bg-amber-100 text-amber-800 border-amber-200",
	Inactive: "bg-slate-100 text-slate-800 border-slate-200"
};
function EmployeeProfileCard({ employeeName }) {
	const [imgError, setImgError] = (0, import_react.useState)(false);
	const [localEmployees] = useLocalStorage("crm_employees_v3", INITIAL_EMPLOYEES);
	const employees = localEmployees?.length ? localEmployees : INITIAL_EMPLOYEES;
	const [employeesDetails] = useLocalStorage("crm_employee_details_v3", INITIAL_EMPLOYEE_DETAILS);
	let employee = employees.find((e) => e.name === employeeName || e.name.toLowerCase() === employeeName.toLowerCase() || e.name.toLowerCase().includes(employeeName.toLowerCase()) || employeeName.toLowerCase().includes(e.name.toLowerCase()) || e.id === employeeName);
	if (!employee) employee = INITIAL_EMPLOYEES.find((e) => e.name === employeeName || e.name.toLowerCase() === employeeName.toLowerCase() || e.name.toLowerCase().includes(employeeName.toLowerCase()) || employeeName.toLowerCase().includes(e.name.toLowerCase()) || e.id === employeeName);
	if (!employee) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex items-center gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-12 w-12 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-6 w-6 text-gray-400" })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-bold text-gray-900",
			children: employeeName
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs text-muted-foreground",
			children: "Assignee details not found"
		})] })]
	});
	const empDetails = employeesDetails[employee.id] || createDefaultEmployeeDetails(employee.id, employee.name, employee.role, employee.email, employee.phone);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-white rounded-2xl border border-gray-200 p-4 shadow-sm flex flex-col sm:flex-row items-center sm:justify-start gap-4",
		children: [imgError || !employee.avatar ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-16 w-16 rounded-2xl bg-gray-100 border border-gray-200 ring-4 ring-[#FF6B00]/10 flex items-center justify-center shrink-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-8 w-8 text-gray-400" })
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: employee.avatar,
			alt: employee.name,
			onError: () => setImgError(true),
			className: "h-16 w-16 rounded-2xl object-cover border border-gray-200 ring-4 ring-[#FF6B00]/10 shrink-0"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "text-center sm:text-left space-y-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-center sm:justify-start gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-lg font-bold font-display text-gray-900",
						children: employee.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `rounded-full border px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLOR[employee.status] || "bg-slate-100"}`,
						children: employee.status
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[#FF6B00] font-semibold text-xs",
					children: [
						employee.role,
						" • ",
						empDetails.department
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-3 w-3" }),
							" ",
							employee.email
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3 w-3" }),
							" ",
							employee.phone
						]
					})]
				})
			]
		})]
	});
}
//#endregion
export { EmployeeProfileCard as t };
