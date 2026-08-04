import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  Plus, Wallet, TrendingDown, Receipt, Search,
  MoreVertical, Trash2, Tag, CalendarDays, IndianRupee,
  ShoppingCart, Utensils, Car, Plane, Home, Briefcase,
  HeartPulse, BookOpen, Music, Coffee, Gift, MoreHorizontal,
  Lock, Delete, Eye, EyeOff, ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";

export const Route = createFileRoute("/crm/personal-expenses")({
  component: PersonalExpensesPage,
});

// ── PIN is kept purely in React state so it resets on EVERY page refresh ──
const CORRECT_PIN = "4611"; // ← Change this to your preferred PIN

function PinLockScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const digits = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

  function press(d: string) {
    if (d === "⌫") {
      setPin((p) => p.slice(0, -1));
      return;
    }
    if (d === "") return;
    const next = pin + d;
    setPin(next);
    if (next.length === 4) {
      if (next === CORRECT_PIN) {
        toast.success("Access granted!");
        onUnlock();
      } else {
        setShake(true);
        setTimeout(() => { setShake(false); setPin(""); }, 600);
        toast.error("Incorrect PIN. Try again.");
      }
    }
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key >= "0" && e.key <= "9") {
        press(e.key);
      } else if (e.key === "Backspace") {
        press("⌫");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pin, press]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-8 max-w-xs w-full px-6">
        {/* Icon */}
        <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center">
          <Lock className="h-9 w-9 text-primary" />
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-display font-bold">Personal Expenses</h2>
          <p className="text-muted-foreground text-sm mt-1">Enter your 4-digit PIN to continue</p>
        </div>

        {/* PIN dots */}
        <div className={`flex gap-4 transition-all ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}>
          {[0,1,2,3].map((i) => (
            <div
              key={i}
              className={`h-4 w-4 rounded-full border-2 transition-all duration-200 ${
                pin.length > i
                  ? "bg-primary border-primary scale-110"
                  : "border-muted-foreground/40"
              }`}
            />
          ))}
        </div>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-3 w-full">
          {digits.map((d, idx) => (
            <button
              key={idx}
              onClick={() => press(d)}
              disabled={d === "" || pin.length >= 4}
              className={`h-16 rounded-2xl text-xl font-semibold transition-all active:scale-95 ${
                d === ""
                  ? "opacity-0 pointer-events-none"
                  : d === "⌫"
                  ? "bg-muted hover:bg-muted/80 text-foreground text-base"
                  : "bg-card border border-border hover:bg-muted shadow-sm text-foreground"
              } ${
                pin.length >= 4 && d !== "⌫" ? "opacity-40 pointer-events-none" : ""
              }`}
            >
              {d === "⌫" ? <Delete className="h-5 w-5 mx-auto" /> : d}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">🔒 This page is PIN-protected</p>
      </div>
    </div>
  );
}


const CATEGORIES = [
  { label: "Food & Dining", icon: Utensils, color: "bg-orange-100 text-orange-600" },
  { label: "Travel", icon: Plane, color: "bg-blue-100 text-blue-600" },
  { label: "Transport", icon: Car, color: "bg-indigo-100 text-indigo-600" },
  { label: "Shopping", icon: ShoppingCart, color: "bg-pink-100 text-pink-600" },
  { label: "Home & Rent", icon: Home, color: "bg-yellow-100 text-yellow-600" },
  { label: "Office", icon: Briefcase, color: "bg-violet-100 text-violet-600" },
  { label: "Health", icon: HeartPulse, color: "bg-red-100 text-red-600" },
  { label: "Education", icon: BookOpen, color: "bg-teal-100 text-teal-600" },
  { label: "Entertainment", icon: Music, color: "bg-purple-100 text-purple-600" },
  { label: "Coffee & Snacks", icon: Coffee, color: "bg-amber-100 text-amber-600" },
  { label: "Gifts", icon: Gift, color: "bg-rose-100 text-rose-600" },
  { label: "Other", icon: MoreHorizontal, color: "bg-gray-100 text-gray-600" },
];

function getCategoryMeta(label: string) {
  return CATEGORIES.find((c) => c.label === label) ?? CATEGORIES[CATEGORIES.length - 1];
}

const PAYMENT_MODES = ["Cash", "UPI", "Credit Card", "Debit Card", "Net Banking", "Other"];

interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  payment_mode: string;
  expense_date: string;
  notes: string;
  created_at?: string;
}

const EMPTY_FORM = {
  title: "",
  amount: "",
  category: "Food & Dining",
  payment_mode: "UPI",
  expense_date: new Date().toISOString().slice(0, 10),
  notes: "",
};

function PersonalExpensesPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<Expense | null>(null);
  const [form, setForm] = useState({ ...EMPTY_FORM });

  const [dbExpenses, setDbExpenses] = useSupabaseTable<Expense[]>("personal_expenses", []);

  const expenses: Expense[] = Array.isArray(dbExpenses) ? dbExpenses : [];

  // Filtered list
  const filtered = useMemo(() => {
    return expenses
      .filter((e) => {
        const matchSearch =
          e.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.category?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchCategory = selectedCategory === "All" || e.category === selectedCategory;
        return matchSearch && matchCategory;
      })
      .sort((a, b) => new Date(b.expense_date).getTime() - new Date(a.expense_date).getTime());
  }, [expenses, searchQuery, selectedCategory]);

  // Totals
  const totalSpent = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
  const thisMonth = new Date().getMonth();
  const thisYear = new Date().getFullYear();
  const monthlySpent = expenses
    .filter((e) => {
      const d = new Date(e.expense_date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    })
    .reduce((sum, e) => sum + (Number(e.amount) || 0), 0);

  const topCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    expenses.forEach((e) => {
      counts[e.category] = (counts[e.category] || 0) + Number(e.amount);
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";
  }, [expenses]);

  function handleAdd() {
    if (!form.title.trim() || !form.amount || Number(form.amount) <= 0) {
      toast.error("Please enter a valid title and amount.");
      return;
    }
    const newExpense: Expense = {
      id: crypto.randomUUID(),
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      payment_mode: form.payment_mode,
      expense_date: form.expense_date,
      notes: form.notes,
    };
    setDbExpenses((prev: Expense[]) => [...(Array.isArray(prev) ? prev : []), newExpense]);
    toast.success("Expense added!");
    setIsAddOpen(false);
    setForm({ ...EMPTY_FORM });
  }

  function handleDelete(expense: Expense) {
    setDbExpenses((prev: Expense[]) => (Array.isArray(prev) ? prev.filter((e) => e.id !== expense.id) : []));
    toast.success("Expense deleted.");
    setExpenseToDelete(null);
  }

  const fmt = (n: number) =>
    "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 2 });

  if (!unlocked) return <PinLockScreen onUnlock={() => setUnlocked(true)} />;

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Personal Expenses</h1>
          <p className="text-muted-foreground mt-1">Track and manage your personal spending.</p>
        </div>
        <Button className="rounded-xl h-10 px-5" onClick={() => { setForm({ ...EMPTY_FORM }); setIsAddOpen(true); }}>
          <Plus className="mr-2 h-4 w-4" /> Add Expense
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <IndianRupee className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Total Spent (All Time)</p>
          </div>
          <p className="text-3xl font-bold">{fmt(totalSpent)}</p>
          <p className="text-xs text-muted-foreground mt-1">{expenses.length} expense{expenses.length !== 1 ? "s" : ""}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
              <TrendingDown className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">This Month</p>
          </div>
          <p className="text-3xl font-bold">{fmt(monthlySpent)}</p>
          <p className="text-xs text-muted-foreground mt-1">{new Date().toLocaleString("en-IN", { month: "long", year: "numeric" })}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
              <Tag className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">Top Category</p>
          </div>
          <p className="text-2xl font-bold">{topCategory}</p>
          <p className="text-xs text-muted-foreground mt-1">Highest spending area</p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex gap-2 flex-wrap">
        {["All", ...CATEGORIES.map((c) => c.label)].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all border ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Expenses Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        {/* Search Bar */}
        <div className="p-5 border-b border-border flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-xl h-10 bg-muted/50 border-none"
            />
          </div>
          <p className="text-sm text-muted-foreground ml-auto">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</p>
        </div>

        {filtered.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center justify-center">
            <Receipt className="h-12 w-12 text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-semibold mb-1">No expenses yet</h3>
            <p className="text-muted-foreground text-sm">Click "Add Expense" to start tracking your spending.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-muted-foreground text-xs font-semibold uppercase tracking-wide border-b border-border">
                  <th className="px-6 py-3 text-left">Title</th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Payment</th>
                  <th className="px-6 py-3 text-right">Amount</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((expense) => {
                  const meta = getCategoryMeta(expense.category);
                  const Icon = meta.icon;
                  return (
                    <tr key={expense.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold">{expense.title}</p>
                          {expense.notes && <p className="text-xs text-muted-foreground mt-0.5">{expense.notes}</p>}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${meta.color}`}>
                          <Icon className="h-3 w-3" />
                          {expense.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {new Date(expense.expense_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 rounded-lg bg-muted text-xs font-medium">{expense.payment_mode}</span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-foreground">
                        {fmt(Number(expense.amount))}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded-xl">
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setExpenseToDelete(expense)}
                              className="rounded-lg text-destructive focus:text-destructive cursor-pointer"
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              {/* Footer total */}
              <tfoot>
                <tr className="border-t-2 border-border bg-muted/20">
                  <td colSpan={4} className="px-6 py-3 text-sm font-semibold text-muted-foreground">
                    Showing {filtered.length} expense{filtered.length !== 1 ? "s" : ""}
                  </td>
                  <td className="px-6 py-3 text-right font-bold text-base">
                    {fmt(filtered.reduce((s, e) => s + Number(e.amount), 0))}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Add Expense Modal */}
      <Dialog open={isAddOpen} onOpenChange={(o) => { setIsAddOpen(o); if (!o) setForm({ ...EMPTY_FORM }); }}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-display flex items-center gap-2">
              <Wallet className="h-5 w-5" /> Add Expense
            </DialogTitle>
            <DialogDescription>Log a new personal expense entry.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Title *</label>
              <Input
                placeholder="e.g. Lunch at restaurant"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="rounded-xl h-10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Amount (₹) *</label>
              <Input
                type="number"
                placeholder="e.g. 250"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="rounded-xl h-10"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.label} value={c.label}>{c.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Payment Mode</label>
                <select
                  value={form.payment_mode}
                  onChange={(e) => setForm({ ...form, payment_mode: e.target.value })}
                  className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {PAYMENT_MODES.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Date</label>
              <Input
                type="date"
                value={form.expense_date}
                onChange={(e) => setForm({ ...form, expense_date: e.target.value })}
                className="rounded-xl h-10"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Notes (optional)</label>
              <textarea
                placeholder="Any additional notes..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="flex min-h-[80px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
              />
            </div>

            <Button className="w-full h-11 rounded-xl mt-2" onClick={handleAdd}>
              Save Expense
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Modal */}
      <Dialog open={!!expenseToDelete} onOpenChange={(o) => !o && setExpenseToDelete(null)}>
        <DialogContent className="max-w-md rounded-3xl p-6">
          <DialogHeader>
            <DialogTitle className="text-xl font-display flex items-center gap-2">
              <Trash2 className="h-5 w-5" /> Delete Expense
            </DialogTitle>
            <DialogDescription className="text-base mt-2">
              Are you sure you want to delete <span className="font-semibold text-foreground">{expenseToDelete?.title}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" className="rounded-xl h-11 px-6" onClick={() => setExpenseToDelete(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-xl h-11 px-6"
              onClick={() => expenseToDelete && handleDelete(expenseToDelete)}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
