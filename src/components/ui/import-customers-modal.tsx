import { useState, useRef } from "react";
import { Upload, AlertCircle, Download, CheckCircle2 } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const EXPECTED_HEADERS = [
  "Customer Name",
  "Email Address",
  "Mobile Number",
  "Reference Name",
  "Company Name",
  "City",
  "Lead Source",
  "Status",
  "Assigned Employee",
];

interface ValidatedRow {
  isValid: boolean;
  rowNumber: number;
  data: any;
  errors: string[];
}

export function ImportCustomersModal({
  open,
  onOpenChange,
  onImport,
  allowedStatuses,
  allowedAssignees,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: any[]) => void;
  allowedStatuses: string[];
  allowedAssignees: string[];
}) {
  const [step, setStep] = useState<"UPLOAD" | "PREVIEW" | "IMPORTING">("UPLOAD");
  const [error, setError] = useState<string | null>(null);
  const [validatedRows, setValidatedRows] = useState<ValidatedRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const sampleRow = [
      "jatin Sharma",
      "jatin@example.com",
      "9876543210",
      "Self",
      "Sharma Corp",
      "Mumbai",
      "Website",
      "Active",
      "Unassigned",
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([EXPECTED_HEADERS, sampleRow]);

    // Set column widths for readability
    ws["!cols"] = [
      { wch: 20 }, // Customer Name
      { wch: 28 }, // Email Address
      { wch: 16 }, // Mobile Number
      { wch: 18 }, // Reference Name
      { wch: 20 }, // Company Name
      { wch: 14 }, // City
      { wch: 14 }, // Lead Source
      { wch: 12 }, // Status
      { wch: 22 }, // Assigned Employee
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Customer Import");
    XLSX.writeFile(wb, "LookMyHolidays_Customer_Import_Template.xlsx");
  };

  const validateData = (data: any[]) => {
    if (!data || data.length === 0) {
      setError("The uploaded file is empty.");
      return;
    }

    const actualHeaders = Object.keys(data[0]);
    const headersMatch =
      actualHeaders.length >= EXPECTED_HEADERS.length &&
      EXPECTED_HEADERS.every((header, i) => actualHeaders[i]?.trim() === header);

    if (!headersMatch) {
      setError("Invalid Excel Template. Please download and use the official Customer Import Template.");
      return;
    }

    const rows: ValidatedRow[] = [];
    const seenMobiles = new Set<string>();

    data.forEach((row, index) => {
      if (Object.values(row).every(v => !v || String(v).trim() === "")) return;
      
      const rowErrors: string[] = [];
      
      const name = String(row["Customer Name"] || "").trim();
      const mobile = String(row["Mobile Number"] || "").trim();
      const email = String(row["Email Address"] || "").trim();
      const status = String(row["Status"] || "").trim();
      const assignedTo = String(row["Assigned Employee"] || "").trim();

      if (!name) rowErrors.push("Customer Name is required.");
      if (!mobile) {
        rowErrors.push("Mobile Number is required.");
      } else {
        if (seenMobiles.has(mobile)) {
          rowErrors.push("Duplicate Mobile Number within the same file.");
        } else {
          seenMobiles.add(mobile);
        }
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        rowErrors.push("Email Address format is invalid.");
      }

      if (status && !allowedStatuses.includes(status)) {
        rowErrors.push(`Status '${status}' is not recognized.`);
      }
      
      if (assignedTo && assignedTo !== "Unassigned" && !allowedAssignees.includes(assignedTo)) {
         rowErrors.push(`Assigned Employee '${assignedTo}' is not recognized.`);
      }

      rows.push({
        rowNumber: index + 2,
        data: row,
        isValid: rowErrors.length === 0,
        errors: rowErrors,
      });
    });

    if (rows.length === 0) {
      setError("No valid data rows found in the file.");
      return;
    }

    setValidatedRows(rows);
    setStep("PREVIEW");
  };

  const processFile = (file: File) => {
    setError(null);
    const fileExt = file.name.split(".").pop()?.toLowerCase();

    if (fileExt === "csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0 && results.errors[0].type !== "Delimiter") {
            setError(`Failed to parse CSV: ${results.errors[0].message}`);
          } else {
            validateData(results.data);
          }
        },
        error: (error: any) => {
          setError(error.message || "Failed to read CSV file.");
        },
      });
    } else if (fileExt === "xls" || fileExt === "xlsx") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws, { raw: false, defval: "" });
          validateData(data);
        } catch (err: any) {
          setError(err.message || "Failed to read Excel file.");
        }
      };
      reader.onerror = () => setError("Error reading the file.");
      reader.readAsBinaryString(file);
    } else {
      setError("Please upload a valid .csv or .xlsx file.");
    }
    
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleConfirmImport = () => {
    const validData = validatedRows.filter(r => r.isValid).map(r => r.data);
    setStep("IMPORTING");
    setTimeout(() => {
      onImport(validData);
      resetAndClose();
    }, 500);
  };

  const resetAndClose = () => {
    setStep("UPLOAD");
    setError(null);
    setValidatedRows([]);
    onOpenChange(false);
  };

  const validCount = validatedRows.filter(r => r.isValid).length;
  const invalidCount = validatedRows.length - validCount;

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) resetAndClose(); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-card">
          <DialogTitle>Import Customers</DialogTitle>
          <DialogDescription>
            Strictly import customers using the official template format.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-secondary/10">
          {step === "UPLOAD" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-primary/10 border border-primary/20 rounded-xl">
                <div>
                  <h4 className="font-semibold text-primary text-sm">Official Template Required</h4>
                  <p className="text-primary/80 text-xs mt-1">Your file must exactly match the expected column headers.</p>
                </div>
                <Button size="sm" variant="outline" className="bg-card text-primary hover:bg-primary/20 border-primary/20 shrink-0" onClick={handleDownloadTemplate}>
                  <Download className="w-4 h-4 mr-2" /> Download Template
                </Button>
              </div>

              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="dropzone-file-customers"
                  className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-secondary/50 border-border bg-card transition-colors group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">CSV, XLS, or XLSX files only</p>
                  </div>
                  <input
                    id="dropzone-file-customers"
                    type="file"
                    className="hidden"
                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    onChange={handleFileUpload}
                    ref={fileInputRef}
                  />
                </label>
              </div>

              {error && (
                <div className="flex items-start gap-3 p-4 mt-2 text-sm text-red-700 rounded-xl bg-red-50 border border-red-100">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                  <p className="font-medium">{error}</p>
                </div>
              )}
            </div>
          )}

          {step === "PREVIEW" && (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-card border border-border rounded-xl p-4 shadow-sm text-center">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Rows</p>
                  <p className="text-2xl font-bold font-display mt-1">{validatedRows.length}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 shadow-sm text-center">
                  <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Ready to Import</p>
                  <p className="text-2xl font-bold font-display mt-1 text-emerald-600">{validCount}</p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 shadow-sm text-center">
                  <p className="text-xs font-semibold text-red-700 uppercase tracking-wider">Failed Rows</p>
                  <p className="text-2xl font-bold font-display mt-1 text-red-600">{invalidCount}</p>
                </div>
              </div>

              {invalidCount > 0 && (
                <div className="bg-card border border-red-200 rounded-xl shadow-sm overflow-hidden flex flex-col max-h-[300px]">
                  <div className="bg-red-50 px-4 py-3 border-b border-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <h4 className="font-semibold text-red-900 text-sm">Failed Records Review</h4>
                  </div>
                  <div className="overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground sticky top-0">
                        <tr>
                          <th className="px-4 py-2 font-medium text-left">Row</th>
                          <th className="px-4 py-2 font-medium text-left">Customer / Company</th>
                          <th className="px-4 py-2 font-medium text-left">Errors</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {validatedRows.filter(r => !r.isValid).map((row, i) => (
                          <tr key={i} className="hover:bg-secondary/30">
                            <td className="px-4 py-3 font-medium text-muted-foreground">#{row.rowNumber}</td>
                            <td className="px-4 py-3">{row.data["Customer Name"] || row.data["Company Name"] || <span className="text-muted-foreground italic">Missing</span>}</td>
                            <td className="px-4 py-3 text-red-600">
                              <ul className="list-disc pl-4 space-y-1 text-xs">
                                {row.errors.map((err, j) => (
                                  <li key={j}>{err}</li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {validCount > 0 && invalidCount === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-emerald-600">
                  <CheckCircle2 className="w-16 h-16 mb-4 opacity-80" />
                  <h3 className="text-xl font-bold font-display">All rows are valid!</h3>
                  <p className="text-sm text-muted-foreground mt-2 text-center max-w-sm text-foreground/70">
                    Your file looks perfect. You are ready to import {validCount} new customers into the CRM.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === "IMPORTING" && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <h3 className="text-lg font-semibold">Importing Customers...</h3>
              <p className="text-sm text-muted-foreground mt-1">Please wait while we save your data.</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border bg-card flex justify-end gap-2">
          {step === "PREVIEW" && (
            <Button variant="outline" onClick={() => setStep("UPLOAD")}>
              Back
            </Button>
          )}
          <Button variant="outline" onClick={resetAndClose} disabled={step === "IMPORTING"}>
            Cancel
          </Button>
          {step === "PREVIEW" && validCount > 0 && (
            <Button onClick={handleConfirmImport} style={{ background: "var(--gradient-brand)" }} className="text-white">
              Import {validCount} Valid {validCount === 1 ? "Customer" : "Customers"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
