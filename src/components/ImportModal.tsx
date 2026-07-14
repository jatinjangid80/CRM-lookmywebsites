import { useState, useRef } from "react";
import { Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import * as XLSX from "xlsx";
import Papa from "papaparse";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (data: any[]) => void;
  title: string;
  subtitle?: string;
  templateUrl?: string;
}

export function ImportModal({ isOpen, onClose, onImport, title, subtitle, templateUrl }: ImportModalProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (extension === 'csv') {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          onImport(results.data);
          onClose();
        },
      });
    } else if (extension === 'xls' || extension === 'xlsx') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        onImport(json);
        onClose();
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Invalid file format. Please upload a CSV, XLS, or XLSX file.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-white">
        <DialogHeader className="p-6 pb-4 border-b border-gray-100">
          <DialogTitle className="text-xl font-bold text-gray-900">{title}</DialogTitle>
          {subtitle && <DialogDescription className="text-gray-500 mt-1">{subtitle}</DialogDescription>}
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Template Banner */}
          <div className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex items-center justify-between">
            <div className="space-y-1">
              <h4 className="text-red-600 font-semibold text-sm">Official Template Required</h4>
              <p className="text-red-400/80 text-xs">Your file must exactly match the expected column headers.</p>
            </div>
            {templateUrl && (
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-white hover:bg-red-50 text-red-600 border-red-200 shadow-sm"
                onClick={() => window.open(templateUrl, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Template
              </Button>
            )}
          </div>

          {/* Drag & Drop Area */}
          <div 
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-colors cursor-pointer
              ${isDragging ? 'border-red-400 bg-red-50' : 'border-orange-100/60 bg-[#fffdfb] hover:bg-orange-50/30'}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files[0];
              if (file) handleFile(file);
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept=".csv, .xls, .xlsx"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
            />
            <div className="mx-auto w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <Upload className="w-5 h-5" />
            </div>
            <p className="text-gray-900 font-medium mb-1">
              Click to upload <span className="text-gray-500 font-normal">or drag and drop</span>
            </p>
            <p className="text-gray-400 text-sm">CSV, XLS, or XLSX files only</p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex justify-end">
          <Button variant="outline" onClick={onClose} className="rounded-full px-6">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
