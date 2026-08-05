import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search, FileText, ArrowUpRight, ArrowDownRight, Edit2, Trash2, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { formatINR } from "@/lib/mock-data";
import { InsuranceGenTransactionModal } from "./InsuranceGenTransactionModal";

export function InsuranceTransactionsView({ policies }: { policies: any[] }) {
  const [transactions, setTransactions] = useSupabaseTable<any[]>("transactions", []);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);

  const policyIds = new Set(policies.map(p => String(p.id).toLowerCase()));
  const policyNos = new Set(policies.map(p => String(p.policy_number).toLowerCase())); // Note: policy_number instead of policy_no

  // Filter transactions for insurance policies
  const insuranceTransactions = transactions.filter(t => {
    // If it was explicitly marked as insurance
    if (t.module === "Insurance") return true;
    
    // Otherwise check if invoiceId matches a policy id or policy no
    if (t.invoiceId) {
      const invId = String(t.invoiceId).toLowerCase();
      if (policyIds.has(invId) || policyNos.has(invId)) return true;
    }
    return false;
  }).sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

  const filteredTransactions = insuranceTransactions.filter(t => 
    (t.entityName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.invoiceId?.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (() => {
      if (!dateFrom && !dateTo) return true;
      const tDate = new Date(t.date || 0).getTime();
      const fromTime = dateFrom ? new Date(dateFrom).getTime() : 0;
      
      if (dateTo) {
          const toDateObj = new Date(dateTo);
          toDateObj.setHours(23, 59, 59, 999);
          return tDate >= fromTime && tDate <= toDateObj.getTime();
      }
      
      return tDate >= fromTime;
    })()
  );

  const handleExportTransactions = () => {
    const csvData = [
      ["Transaction ID", "Date", "Entity Name", "Entity Type", "Linked Policy", "Amount", "Mode", "Status"]
    ];

    filteredTransactions.forEach(tx => {
      const typeSign = (tx.type === 'Receipt' || tx.entityType === 'Customer') ? '+' : '-';
      const linked = policies.find(p => String(p.id).toLowerCase() === String(tx.invoiceId).toLowerCase() || String(p.policy_number).toLowerCase() === String(tx.invoiceId).toLowerCase());
      const linkedPolicyText = tx.invoiceId ? `${tx.invoiceId}${linked?.customer_name ? ` (${linked.customer_name})` : ''}` : "N/A";
      
      csvData.push([
        tx.id || "N/A",
        tx.date ? new Date(tx.date).toLocaleDateString() : "N/A",
        tx.entityName || "Unknown",
        tx.entityType || "N/A",
        linkedPolicyText,
        `${typeSign}${tx.amount}`,
        tx.paymentMode || "N/A",
        tx.status || "Completed"
      ]);
    });

    const csvContent = csvData.map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `General_Insurance_Transactions_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full sm:w-[150px]"
          />
          <span className="text-muted-foreground">to</span>
          <Input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full sm:w-[150px]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-9 bg-background/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" onClick={handleExportTransactions} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={() => setIsAddTxOpen(true)} className="shadow-sm ml-2">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground font-medium border-b border-border">
              <tr>
                <th className="px-6 py-4">Transaction Details</th>
                <th className="px-6 py-4">Entity</th>
                <th className="px-6 py-4">Linked Policy</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Mode & Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No insurance transactions found.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${(tx.type === 'Receipt' || tx.entityType === 'Customer') ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                          {(tx.type === 'Receipt' || tx.entityType === 'Customer') ? <ArrowDownRight className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{tx.id}</p>
                          <p className="text-xs text-muted-foreground">{new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{tx.entityName || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{tx.entityType}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                          <span className="font-medium text-blue-600 dark:text-blue-400 truncate max-w-[200px]">{tx.invoiceId || "N/A"}</span>
                        </div>
                        {(() => {
                          const linked = policies.find(p => String(p.id).toLowerCase() === String(tx.invoiceId).toLowerCase() || String(p.policy_number).toLowerCase() === String(tx.invoiceId).toLowerCase());
                          if (linked && linked.customer_name) {
                            return <span className="text-xs text-muted-foreground mt-1 ml-6">{linked.customer_name}</span>;
                          }
                          return null;
                        })()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-bold ${(tx.type === 'Receipt' || tx.entityType === 'Customer') ? 'text-emerald-600 dark:text-emerald-500' : 'text-rose-600 dark:text-rose-500'}`}>
                        {(tx.type === 'Receipt' || tx.entityType === 'Customer') ? '+' : '-'}{formatINR(tx.amount)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{tx.paymentMode}</p>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${tx.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}`}>
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <InsuranceGenTransactionModal 
        isOpen={isAddTxOpen} 
        onClose={() => setIsAddTxOpen(false)}
        policies={policies}
      />
    </div>
  );
}
