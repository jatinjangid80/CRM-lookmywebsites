import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { F as require_jsx_runtime } from "../_libs/@radix-ui/react-alert-dialog+[...].mjs";
import { t as Button } from "./button-PwNqyxv_.mjs";
import { St as CircleAlert, s as Upload } from "../_libs/lucide-react.mjs";
import { a as DialogHeader, n as DialogContent, o as DialogTitle, r as DialogDescription, t as Dialog } from "./dialog-BvYONHWJ.mjs";
import { t as require_papaparse } from "../_libs/papaparse.mjs";
import { n as utils, t as readSync } from "../_libs/xlsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/import-modal-CK1ZeX3c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_papaparse = /* @__PURE__ */ __toESM(require_papaparse());
function ImportModal({ open, onOpenChange, onImport, title = "Import Data", description = "Upload a CSV or Excel file to import records." }) {
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const handleFileUpload = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setLoading(true);
		setError(null);
		const fileExt = file.name.split(".").pop()?.toLowerCase();
		if (fileExt === "csv") import_papaparse.default.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				setLoading(false);
				if (results.errors.length > 0) setError(`Failed to parse CSV: ${results.errors[0].message}`);
				else {
					onImport(results.data);
					onOpenChange(false);
				}
			},
			error: (error) => {
				setLoading(false);
				setError(error.message || "Failed to read CSV file.");
			}
		});
		else if (fileExt === "xls" || fileExt === "xlsx") {
			const reader = new FileReader();
			reader.onload = (evt) => {
				try {
					const bstr = evt.target?.result;
					const wb = readSync(bstr, { type: "binary" });
					const wsname = wb.SheetNames[0];
					const ws = wb.Sheets[wsname];
					const data = utils.sheet_to_json(ws, { raw: false });
					setLoading(false);
					onImport(data);
					onOpenChange(false);
				} catch (err) {
					setLoading(false);
					setError(err.message || "Failed to read Excel file.");
				}
			};
			reader.onerror = () => {
				setLoading(false);
				setError("Error reading the file.");
			};
			reader.readAsBinaryString(file);
		} else {
			setLoading(false);
			setError("Please upload a valid .csv or .xlsx file.");
		}
		e.target.value = "";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (val) => {
			onOpenChange(val);
			if (!val) setError(null);
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "sm:max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: title }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: description })] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center justify-center w-full mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						htmlFor: "dropzone-file",
						className: "flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-secondary/50 border-border bg-card transition-colors",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col items-center justify-center pt-5 pb-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "w-10 h-10 mb-4 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mb-2 text-sm text-muted-foreground",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-semibold",
										children: "Click to upload"
									}), " or drag and drop"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted-foreground",
									children: "CSV, XLS, or XLSX"
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							id: "dropzone-file",
							type: "file",
							className: "hidden",
							accept: ".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
							onChange: handleFileUpload,
							disabled: loading
						})]
					})
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-2 p-3 mt-2 text-sm text-red-600 rounded-lg bg-red-50",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "w-4 h-4 mt-0.5 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: error })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex justify-end mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => onOpenChange(false),
						children: "Cancel"
					})
				})
			]
		})
	});
}
//#endregion
export { ImportModal as t };
