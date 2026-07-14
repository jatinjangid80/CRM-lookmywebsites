import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Calendar, PhoneCall, AlertCircle, TrendingDown, Wallet } from "lucide-react";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { paymentFollowUps, expenses, formatINR, type Expense } from "@/lib/mock-data";

export const Route = createFileRoute("/crm/accounts")({
  component: AccountsPage,
});

function AccountsPage() {
  const [activeTab, setActiveTab] = useState("expenses");

  // Entities for Receipts & Payments
  const [customers] = useSupabaseTable<any[]>("customers", []);
  const [vendors] = useSupabaseTable<any[]>("vendors", []);
  const [employees] = useSupabaseTable<any[]>("employees", []);

  // Transactions State
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [newTx, setNewTx] = useState({
    type: "Receipt",
    entityType: "Customer",
    entityId: "",
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    paymentMode: "Bank Transfer",
    notes: ""
  });

  // Expenses State
  const [expenseList, setExpenseList] = useState<Expense[]>(expenses);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    date: new Date().toISOString().split("T")[0],
    category: "",
    amount: 0,
    paymentMode: "UPI",
    reference: "",
    description: "",
    status: "Paid",
  });
  // Follow-up Note State
  const [isNoteOpen, setIsNoteOpen] = useState(false);
  const [noteType, setNoteType] = useState<"Paid" | "Unpaid" | "Partial" | "Advance" | "Full" | "">("");
  const [noteContent, setNoteContent] = useState("");
  const [isAddFollowUpOpen, setIsAddFollowUpOpen] = useState(false);
  const [isLogFollowUpOpen, setIsLogFollowUpOpen] = useState(false);
  const [followUpsList, setFollowUpsList] = useState(paymentFollowUps);
  const [selectedFuId, setSelectedFuId] = useState<string | null>(null);
  const [logNotes, setLogNotes] = useState("");
  const [logDate, setLogDate] = useState("");

  const totalExpenses = expenseList.reduce((sum, e) => sum + e.amount, 0);
  const pendingExpenses = expenseList.filter(e => e.status === "Pending").reduce((sum, e) => sum + e.amount, 0);

  const handleSaveExpense = () => {
    if (!newExpense.amount || !newExpense.category) return;
    
    const exp: Expense = {
      id: `EXP-${Math.floor(1000 + Math.random() * 9000)}`,
      date: newExpense.date || new Date().toISOString().split("T")[0],
      category: newExpense.category,
      amount: newExpense.amount,
      paymentMode: newExpense.paymentMode || "Cash",
      reference: newExpense.reference || "",
      description: newExpense.description || "",
      status: newExpense.status as any || "Paid",
    };

    setExpenseList([exp, ...expenseList]);
    setIsAddExpenseOpen(false);
    setNewExpense({
      date: new Date().toISOString().split("T")[0],
      category: "",
      amount: 0,
      paymentMode: "UPI",
      reference: "",
      description: "",
      status: "Paid",
    });
  };

  const handleSaveLog = () => {
    if (selectedFuId) {
      setFollowUpsList(prev => 
        prev.map(f => f.id === selectedFuId 
          ? { 
              ...f, 
              notes: logNotes || f.notes, 
              nextFollowUpDate: logDate || f.nextFollowUpDate 
            } 
          : f
        )
      );
    }
    setIsLogFollowUpOpen(false);
    setLogNotes("");
    setLogDate("");
    setSelectedFuId(null);
  };

  return (
    <main className="flex-1 p-4 sm:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Accounts</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage expenses and track customer payment follow-ups.</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full sm:w-[600px] grid-cols-3 bg-secondary/50 rounded-xl p-1 shadow-sm">
          <TabsTrigger value="expenses" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Expenses</TabsTrigger>
          <TabsTrigger value="follow-ups" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Payment Follow-ups</TabsTrigger>
          <TabsTrigger value="receipts" className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm">Receipts & Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-6 mt-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 bg-blue-100 text-blue-600">
                  <TrendingDown className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Total Expenses</p>
                  <p className="text-3xl font-display font-bold text-foreground mt-1">{formatINR(totalExpenses)}</p>
                </div>
             </div>
             <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 bg-orange-100 text-orange-600">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Pending Expenses</p>
                  <p className="text-3xl font-display font-bold text-foreground mt-1">{formatINR(pendingExpenses)}</p>
                </div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search expenses..." className="pl-9 bg-background h-10 rounded-xl" />
            </div>
            <Button onClick={() => setIsAddExpenseOpen(true)} className="w-full sm:w-auto shadow">
              <Plus className="mr-2 h-4 w-4" /> Add Expense
            </Button>
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
             <table className="w-full text-sm text-left">
               <thead className="text-xs uppercase bg-secondary/50 text-muted-foreground border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Description</th>
                    <th className="px-6 py-4 font-semibold">Payment Mode</th>
                    <th className="px-6 py-4 font-semibold">Amount</th>
                    <th className="px-6 py-4 font-semibold text-center">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border">
                  {expenseList.map(exp => (
                    <tr key={exp.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium text-foreground">{exp.date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                          {exp.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-foreground font-medium">{exp.description}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{exp.id}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Wallet className="h-4 w-4 text-muted-foreground" />
                          <span>{exp.paymentMode}</span>
                        </div>
                        {exp.reference && <p className="text-[10px] text-muted-foreground mt-0.5 font-mono">{exp.reference}</p>}
                      </td>
                      <td className="px-6 py-4 font-bold text-foreground">
                        {formatINR(exp.amount)}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                          exp.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-rose-100 text-rose-700 border-rose-200'
                        }`}>
                          {exp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
               </tbody>
             </table>
          </div>
        </TabsContent>

        <TabsContent value="follow-ups" className="space-y-6 mt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search customers or invoices..." className="pl-9 bg-background h-10 rounded-xl" />
            </div>
            <Button onClick={() => setIsAddFollowUpOpen(true)} className="w-full sm:w-auto shadow">
              <Plus className="mr-2 h-4 w-4" /> Add Follow-up
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {followUpsList.map(fu => (
               <div key={fu.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:border-primary/40 transition-colors">
                  <div className="flex justify-between items-start mb-4">
                     <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold border border-orange-200 shrink-0">
                           {fu.customerName.charAt(0)}
                        </div>
                        <div>
                           <h3 className="font-semibold text-foreground">{fu.customerName}</h3>
                           <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                             <PhoneCall className="h-3 w-3" /> {fu.customerPhone}
                           </p>
                        </div>
                     </div>
                     <div className="text-right">
                       <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pending Amount</p>
                       <p className="text-lg font-display font-bold text-rose-600">{formatINR(fu.pendingAmount)}</p>
                     </div>
                  </div>
                  
                  <div className="bg-secondary/50 rounded-xl p-3 mb-4 border border-border">
                     <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Invoice ID:</span>
                        <span className="font-mono font-medium">{fu.invoiceId}</span>
                     </div>
                     <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Total Amount:</span>
                        <span className="font-medium">{formatINR(fu.totalAmount)}</span>
                     </div>
                     <div className="flex items-center justify-between text-sm mt-1">
                        <span className="text-muted-foreground">Notes:</span>
                        <span className="font-medium text-right max-w-[200px] truncate">{fu.notes}</span>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-border gap-4">
                     <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="font-medium text-foreground">Follow-up: {fu.nextFollowUpDate} at {fu.nextFollowUpTime}</span>
                     </div>
                     
                     <Button size="sm" className="h-8 text-xs shadow-sm" onClick={() => {
                        setSelectedFuId(fu.id);
                        setLogNotes(fu.notes);
                        setLogDate(fu.nextFollowUpDate);
                        setIsLogFollowUpOpen(true);
                     }}>
                        Log Follow-up
                     </Button>
                  </div>
               </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="receipts" className="space-y-6 mt-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4 items-center flex-1">
              <div className="relative max-w-sm flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search transactions..." className="pl-9 bg-background h-10 rounded-xl" />
              </div>
            </div>
            <Button className="shadow-sm rounded-xl px-5 h-10" onClick={() => setIsAddTxOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>

          {transactions.length === 0 ? (
            <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-foreground mb-2">No Receipts or Payments Yet</h3>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-6">
                Track all your incoming receipts and outgoing payments here.
              </p>
              <Button className="shadow-sm" onClick={() => setIsAddTxOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          ) : (
            <div className="rounded-3xl border border-border bg-card overflow-hidden shadow-sm">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/30 text-muted-foreground text-xs uppercase font-semibold">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Entity</th>
                    <th className="px-6 py-4">Mode</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transactions.map((tx, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 font-medium">{tx.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.type === 'Receipt' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{tx.entityName}</div>
                        <div className="text-xs text-muted-foreground">{tx.entityType}</div>
                      </td>
                      <td className="px-6 py-4">{tx.paymentMode}</td>
                      <td className={`px-6 py-4 text-right font-bold ${tx.type === 'Receipt' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.type === 'Receipt' ? '+' : '-'}{formatINR(tx.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add Transaction Dialog */}
      <Dialog open={isAddTxOpen} onOpenChange={setIsAddTxOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>Record a new receipt or payment.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={newTx.type} onValueChange={v => setNewTx({...newTx, type: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Receipt">Receipt (In)</SelectItem>
                    <SelectItem value="Payment">Payment (Out)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Entity Type</Label>
                <Select value={newTx.entityType} onValueChange={v => setNewTx({...newTx, entityType: v, entityId: ""})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="Vendor">Vendor</SelectItem>
                    <SelectItem value="Employee">Employee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Select {newTx.entityType}</Label>
              <Select value={newTx.entityId} onValueChange={v => setNewTx({...newTx, entityId: v})}>
                <SelectTrigger><SelectValue placeholder={`Select a ${newTx.entityType.toLowerCase()}`} /></SelectTrigger>
                <SelectContent>
                  {newTx.entityType === "Customer" && (
                    customers && customers.length > 0 
                      ? customers.map(c => <SelectItem key={c.id} value={c.id}>{c.firstName} {c.lastName || ''}</SelectItem>)
                      : <SelectItem value="no-data" disabled>No customers found</SelectItem>
                  )}
                  {newTx.entityType === "Vendor" && (
                    vendors && vendors.length > 0
                      ? vendors.map(v => <SelectItem key={v.id} value={v.id}>{v.name}</SelectItem>)
                      : <SelectItem value="no-data" disabled>No vendors found</SelectItem>
                  )}
                  {newTx.entityType === "Employee" && (
                    employees && employees.length > 0
                      ? employees.map(e => <SelectItem key={e.id} value={e.id}>{e.name}</SelectItem>)
                      : <SelectItem value="no-data" disabled>No employees found</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={newTx.date} onChange={e => setNewTx({...newTx, date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input type="number" value={newTx.amount || ""} onChange={e => setNewTx({...newTx, amount: Number(e.target.value)})} placeholder="0" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Select value={newTx.paymentMode} onValueChange={v => setNewTx({...newTx, paymentMode: v})}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes/Reference</Label>
                <Input placeholder="Optional" value={newTx.notes} onChange={e => setNewTx({...newTx, notes: e.target.value})} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTxOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              if(!newTx.entityId) return;
              let entityName = "";
              if(newTx.entityType === "Customer") {
                const c = customers.find(x => x.id === newTx.entityId);
                entityName = c ? `${c.firstName} ${c.lastName || ''}`.trim() : "";
              } else if(newTx.entityType === "Vendor") {
                const v = vendors.find(x => x.id === newTx.entityId);
                entityName = v?.name || "";
              } else if(newTx.entityType === "Employee") {
                const e = employees.find(x => x.id === newTx.entityId);
                entityName = e?.name || "";
              }
              
              setTransactions([{ ...newTx, entityName }, ...transactions]);
              setIsAddTxOpen(false);
              setNewTx({...newTx, entityId: "", amount: 0, notes: ""});
            }}>Save Transaction</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Expense Dialog */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
            <DialogDescription>Record a new company expense.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={newExpense.date} onChange={e => setNewExpense({...newExpense, date: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Amount (₹)</Label>
                <Input type="number" value={newExpense.amount || ""} onChange={e => setNewExpense({...newExpense, amount: Number(e.target.value)})} placeholder="0.00" />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Input placeholder="e.g. Travel, Office Supplies" value={newExpense.category} onChange={e => setNewExpense({...newExpense, category: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input placeholder="Brief description of the expense" value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Select value={newExpense.paymentMode} onValueChange={v => setNewExpense({...newExpense, paymentMode: v})}>
                  <SelectTrigger><SelectValue placeholder="Select mode" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Cash">Cash</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="Card">Card</SelectItem>
                    <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={newExpense.status} onValueChange={v => setNewExpense({...newExpense, status: v as any})}>
                  <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reference No. (Optional)</Label>
              <Input placeholder="Transaction ID, Cheque No, etc." value={newExpense.reference} onChange={e => setNewExpense({...newExpense, reference: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddExpenseOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveExpense}>Save Expense</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isNoteOpen} onOpenChange={setIsNoteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add {noteType} Note</DialogTitle>
            <DialogDescription>
              Please provide details or remarks for marking this as {noteType}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter your notes here..."
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsNoteOpen(false)}>Cancel</Button>
            <Button onClick={() => { setIsNoteOpen(false); setNoteContent(""); }}>Save Note</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddFollowUpOpen} onOpenChange={setIsAddFollowUpOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Follow-up</DialogTitle>
            <DialogDescription>
              Create a new payment follow-up for a customer or vendor.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Customer / Vendor Name</Label>
              <Input placeholder="Enter name" />
            </div>
            <div className="space-y-2">
              <Label>Invoice ID</Label>
              <Input placeholder="INV-001" />
            </div>
            <div className="space-y-2">
              <Label>Pending Amount (₹)</Label>
              <Input type="number" placeholder="Enter amount" />
            </div>
            <div className="space-y-2">
              <Label>Follow-up Date</Label>
              <Input type="date" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddFollowUpOpen(false)}>Cancel</Button>
            <Button onClick={() => setIsAddFollowUpOpen(false)}>Create Follow-up</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isLogFollowUpOpen} onOpenChange={(open) => {
        setIsLogFollowUpOpen(open);
        if (!open) {
          setLogNotes("");
          setLogDate("");
          setSelectedFuId(null);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Log Follow-up</DialogTitle>
            <DialogDescription>
              Record the details of your latest communication and schedule the next step.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Interaction Notes</Label>
              <Textarea 
                placeholder="What was discussed?" 
                className="min-h-[100px]" 
                value={logNotes}
                onChange={(e) => setLogNotes(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Next Follow-up Date</Label>
              <Input 
                type="date" 
                value={logDate}
                onChange={(e) => setLogDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Outcome / Status</Label>
              <Input placeholder="e.g. Call back tomorrow, Not interested, etc." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLogFollowUpOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveLog}>Save Log</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
