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
  "Place",
  "Vendor Name",
  "Contact Person",
  "Mobile Number",
  "Email ID",
  "Website",
  "Office City",
  "Vendor Type",
  "Status",
];

interface ValidatedRow {
  isValid: boolean;
  rowNumber: number;
  data: any;
  errors: string[];
}

export function ImportVendorsModal({
  open,
  onOpenChange,
  onImport,
  allowedTypes,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImport: (data: any[]) => void;
  allowedTypes: string[];
}) {
  const [step, setStep] = useState<"UPLOAD" | "PREVIEW" | "IMPORTING">("UPLOAD");
  const [error, setError] = useState<string | null>(null);
  const [validatedRows, setValidatedRows] = useState<ValidatedRow[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDownloadTemplate = () => {
    const sampleRow = [
      "Dubai, UAE",
      "Address Beach Resort",
      "jatin jangid",
      "971501234567",
      "jatinjangid@addressbeach.com",
      "https://www.addressbeach.com",
      "Dubai",
      "Hotel",
      "Active",
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([EXPECTED_HEADERS, sampleRow]);
    ws["!cols"] = [
      { wch: 20 }, // Place
      { wch: 28 }, // Vendor Name
      { wch: 20 }, // Contact Person
      { wch: 18 }, // Mobile Number
      { wch: 28 }, // Email ID
      { wch: 30 }, // Website
      { wch: 16 }, // Office City
      { wch: 18 }, // Vendor Type
      { wch: 10 }, // Status
    ];

    XLSX.utils.book_append_sheet(wb, ws, "Vendor Import");
    XLSX.writeFile(wb, "LookMyHolidays_Vendor_Import_Template.xlsx");
  };

  const validateData = (data: any[]) => {
    if (!data || data.length === 0) {
      setError("The uploaded file is empty.");
      return;
    }

    const actualHeaders = Object.keys(data[0]);
    // More relaxed header matching: just make sure we have some essential columns
    const hasEssentials = actualHeaders.some(h => h.includes("Vendor Name") || h.includes("Mobile"));
    
    if (!hasEssentials) {
      setError("Invalid Template. Please ensure the file has 'Vendor Name' and 'Mobile Number' columns.");
      return;
    }

    const rows: ValidatedRow[] = [];
    const seenMobiles = new Set<string>();

    data.forEach((row, index) => {
      // Skip completely empty rows
      if (Object.values(row).every((v) => !v || String(v).trim() === "")) return;

      const cleanField = (val: any) => {
        const s = String(val || "").trim();
        return (s.toUpperCase() === "NA" || s.toUpperCase() === "N/A" || s === "-") ? "" : s;
      };

      const rowErrors: string[] = [];
      
      // We map whatever headers the user gave us to our expected fields
      // This is a bit robust to case differences
      const findVal = (keyStr: string) => {
         const key = Object.keys(row).find(k => k.toLowerCase().includes(keyStr.toLowerCase()));
         return key ? cleanField(row[key]) : "";
      };

      const name = findVal("Vendor Name") || findVal("Name");
      const contact = findVal("Contact Person") || findVal("Contact");
      const mobile = findVal("Mobile");
      const email = findVal("Email");
      let website = findVal("Website") || findVal("Web");
      const place = findVal("Place");
      const city = findVal("City");
      let type = findVal("Vendor Type") || findVal("Type");
      
      if (website && !/^https?:\/\//i.test(website)) {
        website = "http://" + website;
      }
      
      // Instead of failing on unknown types, we map it to "Other" or just pass it as string.
      // We'll let it pass even if it's not strictly in the dropdown to avoid blocking imports.
      if (!type) {
         type = "Other";
      }

      if (!name) rowErrors.push("Vendor Name is required.");
      if (!mobile) {
        rowErrors.push("Mobile Number is required.");
      } else if (seenMobiles.has(mobile)) {
        rowErrors.push("Duplicate Mobile Number within the same file.");
      } else {
        seenMobiles.add(mobile);
      }

      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        rowErrors.push("Email format is invalid.");
      }

      // Reconstruct a cleaned row that matches EXPECTED_HEADERS perfectly so the rest of the app works
      const cleanedRow = {
        "Vendor Name": name,
        "Contact Person": contact || name, // Fallback to vendor name
        "Mobile Number": mobile,
        "Email ID": email,
        "Website": website,
        "Place": place || "Unknown",
        "Office City": city || "Unknown",
        "Vendor Type": type,
        "Status": cleanField(row["Status"]) || "Active"
      };

      rows.push({ rowNumber: index + 2, data: cleanedRow, isValid: rowErrors.length === 0, errors: rowErrors });
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
        error: (err: any) => setError(err.message || "Failed to read CSV file."),
      });
    } else if (fileExt === "xls" || fileExt === "xlsx") {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: "binary" });
          const ws = wb.Sheets[wb.SheetNames[0]];
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
    const validData = validatedRows.filter((r) => r.isValid).map((r) => r.data);
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

  const validCount = validatedRows.filter((r) => r.isValid).length;
  const invalidCount = validatedRows.length - validCount;

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) resetAndClose(); }}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border bg-card">
          <DialogTitle>Import Vendors</DialogTitle>
          <DialogDescription>Strictly import vendors using the official template format.</DialogDescription>
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

              <label htmlFor="dropzone-vendors" className="flex flex-col items-center justify-center w-full h-52 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-secondary/50 border-border bg-card transition-colors group">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">CSV, XLS, or XLSX files only</p>
                </div>
                <input id="dropzone-vendors" type="file" className="hidden" accept=".csv,.xls,.xlsx" onChange={handleFileUpload} ref={fileInputRef} />
              </label>

              {error && (
                <div className="flex items-start gap-3 p-4 text-sm text-red-700 rounded-xl bg-red-50 border border-red-100">
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
                <div className="bg-card border border-red-200 rounded-xl overflow-hidden flex flex-col max-h-[300px]">
                  <div className="bg-red-50 px-4 py-3 border-b border-red-200 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <h4 className="font-semibold text-red-900 text-sm">Failed Records</h4>
                  </div>
                  <div className="overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-left">Row</th>
                          <th className="px-4 py-2 text-left">Vendor Name</th>
                          <th className="px-4 py-2 text-left">Errors</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {validatedRows.filter((r) => !r.isValid).map((row, i) => (
                          <tr key={i} className="hover:bg-secondary/30">
                            <td className="px-4 py-3 font-medium text-muted-foreground">#{row.rowNumber}</td>
                            <td className="px-4 py-3">{row.data["Vendor Name"] || <span className="italic text-muted-foreground">Missing</span>}</td>
                            <td className="px-4 py-3 text-red-600">
                              <ul className="list-disc pl-4 space-y-1 text-xs">
                                {row.errors.map((err, j) => <li key={j}>{err}</li>)}
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
                  <p className="text-sm text-muted-foreground mt-2 text-center max-w-sm">
                    Ready to import {validCount} vendors into the CRM.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === "IMPORTING" && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <h3 className="text-lg font-semibold">Importing Vendors...</h3>
              <p className="text-sm text-muted-foreground mt-1">Please wait while we save your data.</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-border bg-card flex justify-end gap-2">
          {step === "PREVIEW" && <Button variant="outline" onClick={() => setStep("UPLOAD")}>Back</Button>}
          <Button variant="outline" onClick={resetAndClose} disabled={step === "IMPORTING"}>Cancel</Button>
          {step === "PREVIEW" && validCount > 0 && (
            <Button onClick={handleConfirmImport} style={{ background: "var(--gradient-brand)" }} className="text-white">
              Import {validCount} {validCount === 1 ? "Vendor" : "Vendors"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
