import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, Edit2, Copy, FileText, Download, Trash2, ShieldAlert } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface InsuranceTableProps {
  policies: any[];
  companies: any[];
  vendors: any[];
  onEdit: (policy: any) => void;
  onDelete: (policy: any) => void;
}

export function InsuranceTable({ policies, companies, vendors, onEdit, onDelete }: InsuranceTableProps) {
  const getCompanyName = (p: any) => p.company_id === "other" ? (p.custom_company || "Other") : (companies.find(c => c.id === p.company_id)?.name || p.company_id);
  const getVendorName = (p: any) => p.vendor_id === "other" ? (p.custom_vendor || "Other") : (vendors.find(v => v.id === p.vendor_id)?.name || p.vendor_id);

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  const getStatusBadge = (policy: any) => {
    const today = new Date();
    const expiry = new Date(policy.expiry_date);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0 || policy.status === 'Expired') {
      return <span className="rounded-full bg-rose-500/100/10 text-rose-500 border-rose-500/20 border px-2 py-1 text-[10px] font-bold tracking-wider uppercase">Expired</span>;
    } else if (diffDays <= 30) {
      return <span className="rounded-full bg-amber-500/100/10 text-amber-500 border-amber-500/20 border px-2 py-1 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1"><ShieldAlert className="w-3 h-3" /> Expiring ({diffDays}d)</span>;
    }
    return <span className="rounded-full bg-emerald-500/100/10 text-emerald-500 border-emerald-500/20 border px-2 py-1 text-[10px] font-bold tracking-wider uppercase">Active</span>;
  };

  const getPaymentBadge = (status: string) => {
    if (status === 'Full Paid') return <span className="text-emerald-600 font-semibold text-xs">Full Paid</span>;
    if (status === 'Partial') return <span className="text-blue-600 font-semibold text-xs">Partial</span>;
    return <span className="text-rose-600 font-semibold text-xs">Pending</span>;
  };

  const handlePrint = (policy: any) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const css = `
      body { font-family: sans-serif; padding: 40px; color: #333; line-height: 1.6; }
      h2 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 20px; }
      .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
      .field { margin-bottom: 15px; }
      .label { font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
      .value { font-size: 15px; font-weight: 500; color: #0f172a; }
      .section { background: #f8fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; }
    `;
    
    const styleEl = printWindow.document.createElement("style");
    styleEl.textContent = css;
    printWindow.document.head.appendChild(styleEl);
    
    const titleEl = printWindow.document.createElement("title");
    titleEl.textContent = `Insurance Policy - ${policy.policy_number || "New"}`;
    printWindow.document.head.appendChild(titleEl);

    const bodyHtml = `
      <h2>Insurance Policy Details</h2>
      
      <div class="grid">
        <div class="section">
          <div class="field"><div class="label">Customer Name</div><div class="value">${policy.customer_name || "-"}</div></div>
          <div class="field"><div class="label">Mobile Number</div><div class="value">${policy.mobile_number || "-"}</div></div>
          <div class="field"><div class="label">Email</div><div class="value">${policy.email || "-"}</div></div>
          <div class="field"><div class="label">Address</div><div class="value">${policy.address || "-"}, ${policy.city || "-"}, ${policy.state || "-"}</div></div>
        </div>
        
        <div class="section">
          <div class="field"><div class="label">Policy Number</div><div class="value">${policy.policy_number || "-"}</div></div>
          <div class="field"><div class="label">Insurance Company</div><div class="value">${getCompanyName(policy)}</div></div>
          <div class="field"><div class="label">Vendor</div><div class="value">${getVendorName(policy)}</div></div>
          <div class="field"><div class="label">Policy Type</div><div class="value">${policy.policy_type || "-"}</div></div>
        </div>
      </div>
      
      <div class="grid">
        <div class="section">
          <div class="field"><div class="label">Issue Date</div><div class="value">${policy.issue_date ? new Date(policy.issue_date).toLocaleDateString("en-IN") : "-"}</div></div>
          <div class="field"><div class="label">Expiry Date</div><div class="value">${policy.expiry_date ? new Date(policy.expiry_date).toLocaleDateString("en-IN") : "-"}</div></div>
          <div class="field"><div class="label">Status</div><div class="value">${policy.status || "Active"}</div></div>
        </div>
        
        <div class="section">
          <div class="field"><div class="label">Vehicle Number</div><div class="value">${policy.vehicle_number || "-"}</div></div>
          <div class="field"><div class="label">Vehicle Model</div><div class="value">${policy.vehicle_model || "-"}</div></div>
          <div class="field"><div class="label">IDV Value</div><div class="value">${policy.idv_value ? formatINR(policy.idv_value) : "-"}</div></div>
        </div>
      </div>
      
      <div class="grid">
        <div class="section">
          <div class="field"><div class="label">Total Premium</div><div class="value">${formatINR(policy.total_premium || 0)}</div></div>
          <div class="field"><div class="label">Payment Status</div><div class="value">${policy.payment_status || "Pending"}</div></div>
        </div>
      </div>
      
      ${policy.notes ? `<div class="section" style="grid-column: 1 / -1;"><div class="field"><div class="label">Notes</div><div class="value">${policy.notes}</div></div></div>` : ""}
    `;
    
    const wrapper = printWindow.document.createElement("div");
    wrapper.innerHTML = bodyHtml;
    printWindow.document.body.appendChild(wrapper);
    
    const script = printWindow.document.createElement("script");
    script.textContent = "window.onload=function(){window.print();window.onafterprint=function(){window.close();}}";
    printWindow.document.body.appendChild(script);
    printWindow.document.close();
  };

  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/30 border-b border-border">
            <tr>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Policy No.</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Customer</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Insurer / Vendor</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Vehicle</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Dates</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Financials</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground">Status</th>
              <th className="px-4 py-3 font-semibold text-muted-foreground text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {policies.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                  No policies found.
                </td>
              </tr>
            ) : (
              policies.map((p, i) => (
                <tr key={p.id || i} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-blue-600">{p.policy_number || "Draft"}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground">{p.customer_name}</div>
                    <div className="text-xs text-muted-foreground">{p.mobile_number}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-sm">{getCompanyName(p)}</div>
                    <div className="text-xs text-muted-foreground">{getVendorName(p)}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.vehicle_number}</div>
                    <div className="text-xs text-muted-foreground">{p.policy_type}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-xs">Iss: {p.issue_date}</div>
                    <div className="text-xs font-semibold text-rose-600">Exp: {p.expiry_date}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-bold text-foreground">{formatINR(p.total_premium)}</div>
                    <div className={`text-[10px] font-semibold mt-0.5 ${p.profit >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                      Profit: {formatINR(p.profit)}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1 items-start">
                      {getStatusBadge(p)}
                      {getPaymentBadge(p.payment_status)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 px-2 rounded-lg text-xs bg-muted hover:bg-muted/80">
                          Options
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        <DropdownMenuItem onClick={() => onEdit(p)} className="cursor-pointer gap-2 py-2 rounded-lg">
                          <Eye className="h-4 w-4 text-blue-600" /> View / Edit
                        </DropdownMenuItem>

                        <DropdownMenuItem onClick={() => handlePrint(p)} className="cursor-pointer gap-2 py-2 rounded-lg">
                          <FileText className="h-4 w-4 text-emerald-600" /> Print
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onDelete(p)} className="cursor-pointer gap-2 py-2 rounded-lg text-rose-600 hover:text-rose-500 hover:bg-rose-500/10">
                          <Trash2 className="h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
