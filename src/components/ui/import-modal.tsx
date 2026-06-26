import { useState } from "react";
import { Upload, File, X, AlertCircle } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function ImportModal({ 
  open, 
  onOpenChange, 
  onImport,
  title = "Import Data",
  description = "Upload a CSV or Excel file to import records."
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  onImport: (data: any[]) => void;
  title?: string;
  description?: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);

    const fileExt = file.name.split('.').pop()?.toLowerCase();

    if (fileExt === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          setLoading(false);
          if (results.errors.length > 0) {
            setError(`Failed to parse CSV: ${results.errors[0].message}`);
          } else {
            onImport(results.data);
            onOpenChange(false);
          }
        },
        error: (error: any) => {
          setLoading(false);
          setError(error.message || "Failed to read CSV file.");
        }
      });
    } else if (fileExt === 'xls' || fileExt === 'xlsx') {
      const reader = new FileReader();
      reader.onload = (evt) => {
        try {
          const bstr = evt.target?.result;
          const wb = XLSX.read(bstr, { type: 'binary' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const data = XLSX.utils.sheet_to_json(ws, { raw: false });
          setLoading(false);
          onImport(data);
          onOpenChange(false);
        } catch (err: any) {
          setLoading(false);
          setError(err.message || "Failed to read Excel file.");
        }
      };
      reader.onerror = () => {
        setLoading(false);
        setError("Error reading the file.");
      }
      reader.readAsBinaryString(file);
    } else {
      setLoading(false);
      setError("Please upload a valid .csv or .xlsx file.");
    }

    // Reset the input value
    e.target.value = '';
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      onOpenChange(val);
      if (!val) setError(null);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex items-center justify-center w-full mt-4">
          <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer hover:bg-secondary/50 border-border bg-card transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-10 h-10 mb-4 text-muted-foreground" />
              <p className="mb-2 text-sm text-muted-foreground">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">CSV, XLS, or XLSX</p>
            </div>
            <input 
              id="dropzone-file" 
              type="file" 
              className="hidden" 
              accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
              onChange={handleFileUpload}
              disabled={loading}
            />
          </label>
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 mt-2 text-sm text-red-600 rounded-lg bg-red-50">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
