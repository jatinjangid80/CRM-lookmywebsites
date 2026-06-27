import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { INITIAL_EMPLOYEES } from "./crm.employees";
import {
  Plus, CheckCircle2, Circle, Clock, AlertCircle,
  Phone, Mail, CreditCard, FileText, CalendarDays,
  Trash2, X, Filter, Sparkles, ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmployeeProfileCard } from "@/components/EmployeeProfileCard";
import { getAuth } from "@/lib/auth";

export const Route = createFileRoute("/crm/tasks")({ component: TasksPage });



/* ─── Types ─────────────────────────────────────────── */
type Priority = "High" | "Medium" | "Low";
type TaskType = "Call" | "Email" | "Payment" | "Document" | "Follow-up" | "Other";
type TaskStatus = "Pending" | "Done";

interface TaskNote {
  text: string;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  type: TaskType;
  priority: Priority;
  assignee: string;
  dueDate: string;
  status: TaskStatus;
  note: string;
  notes?: (string | TaskNote)[];
  lead?: string;
}

/* ─── Seed data ──────────────────────────────────────── */
const today = new Date().toISOString().slice(0, 10);
const SEED: Task[] = [];

/* ─── Constants ──────────────────────────────────────── */
const TYPE_ICONS: Record<TaskType, typeof Phone> = {
  Call: Phone,
  Email: Mail,
  Payment: CreditCard,
  Document: FileText,
  "Follow-up": CalendarDays,
  Other: AlertCircle,
};

const TYPE_COLORS: Record<TaskType, string> = {
  Call:        "bg-blue-100   text-blue-700",
  Email:       "bg-violet-100 text-violet-700",
  Payment:     "bg-emerald-100 text-emerald-700",
  Document:    "bg-amber-100  text-amber-700",
  "Follow-up": "bg-pink-100   text-pink-700",
  Other:       "bg-slate-100  text-slate-600",
};

const TYPE_ACCENT: Record<TaskType, string> = {
  Call:        "border-l-blue-400",
  Email:       "border-l-violet-400",
  Payment:     "border-l-emerald-400",
  Document:    "border-l-amber-400",
  "Follow-up": "border-l-pink-400",
  Other:       "border-l-slate-400",
};

const PRIORITY_PILL: Record<Priority, string> = {
  High:   "bg-red-100   text-red-700",
  Medium: "bg-amber-100 text-amber-700",
  Low:    "bg-emerald-100 text-emerald-700",
};

const PRIORITY_DOT: Record<Priority, string> = {
  High:   "bg-red-500",
  Medium: "bg-amber-500",
  Low:    "bg-emerald-500",
};


const TASK_TYPES: TaskType[] = ["Call", "Email", "Payment", "Document", "Follow-up", "Other"];
const PRIORITIES: Priority[] = ["High", "Medium", "Low"];

/* ─── Helpers ────────────────────────────────────────── */
function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}
const AVATAR_COLORS = [
  "bg-blue-500", "bg-violet-500", "bg-rose-500", "bg-teal-500",
];
function avatarColor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function formatDate(d: string) {
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

/* ─── Sub-components ─────────────────────────────────── */
function StatCard({ label, value, total, color, icon, onClick, active }: {
  label: string; value: number; total: number; color: string; icon: React.ReactNode;
  onClick?: () => void; active?: boolean;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div 
      onClick={onClick}
      className={`rounded-2xl border bg-card p-5 shadow-card transition-all duration-200 ${
        onClick ? "cursor-pointer hover:shadow-md hover:-translate-y-0.5 select-none" : ""
      } ${
        active 
          ? "border-primary ring-2 ring-primary/20 scale-[1.01]" 
          : "border-border"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <span className={`grid h-8 w-8 place-items-center rounded-xl ${color}`}>{icon}</span>
      </div>
      <p className="mt-3 font-display text-4xl font-bold">{value}</p>
      {/* Progress bar */}
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-border">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color.replace(/bg-(\w+-\d+).*/, "bg-$1")}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">{pct}% of total</p>
    </div>
  );
}

function formatNoteDate(isoString: string) {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).replace(",", "");
  } catch {
    return "";
  }
}

function TaskCard({ task, isAdmin, onToggle, onDelete, onEditNote }: {
  task: Task;
  isAdmin: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onEditNote: (newNote: string) => void;
}) {
  const Icon = TYPE_ICONS[task.type];
  const isOverdue = task.status === "Pending" && task.dueDate < today;
  const isDone = task.status === "Done";
  
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editNoteText, setEditNoteText] = useState("");

  const allNotes = [task.note, ...(task.notes || [])].filter(Boolean);

  return (
    <div
      className={`
        group relative flex items-start gap-4 rounded-2xl border-l-4 border border-border bg-card
        px-4 py-4 shadow-card transition-all duration-200
        hover:shadow-md hover:-translate-y-0.5
        ${isDone ? "opacity-55" : ""}
        ${isOverdue && !isDone ? "border-red-200 bg-red-50/30" : ""}
        ${!isOverdue && !isDone ? TYPE_ACCENT[task.type] : ""}
        ${isOverdue && !isDone ? "border-l-red-400" : ""}
        ${isDone ? "border-l-emerald-300" : ""}
      `}
    >
      {/* Checkbox */}
      <button
        id={`toggle-${task.id}`}
        onClick={onToggle}
        className="mt-0.5 shrink-0 transition-transform hover:scale-110 active:scale-95"
        aria-label={isDone ? "Mark pending" : "Mark done"}
      >
        {isDone
          ? <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          : <Circle className="h-5 w-5 text-muted-foreground/60 hover:text-primary transition-colors" />}
      </button>

      {/* Type icon badge */}
      <span className={`mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl text-sm font-bold ${TYPE_COLORS[task.type]}`}>
        <Icon className="h-4 w-4" />
      </span>

      {/* Body */}
      <div className="min-w-0 flex-1 space-y-1.5">
        {/* Title row */}
        <div className="flex flex-wrap items-start gap-2">
          <p className={`text-sm font-semibold leading-snug ${isDone ? "line-through text-muted-foreground" : ""}`}>
            {task.title}
          </p>
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${PRIORITY_PILL[task.priority]}`}>
            <span className={`inline-block h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[task.priority]}`} />
            {task.priority}
          </span>
          {isOverdue && (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700 animate-pulse">
              <AlertCircle className="h-3 w-3" /> Overdue
            </span>
          )}
          {isDone && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="h-3 w-3" /> Done
            </span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {task.lead && (
            <span className="flex items-center gap-1 font-medium text-foreground/70">
              <span className="h-1.5 w-1.5 rounded-full bg-primary/60" />
              {task.lead}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDate(task.dueDate)}
          </span>
        </div>

        {/* Notes list */}
        {allNotes.length > 0 && (
          <div className="mt-2 space-y-1.5 pl-2 border-l-2 border-border/80">
            {allNotes.map((note, idx) => {
              const isString = typeof note === "string";
              const noteText = isString ? note : note.text;
              const noteTime = isString ? "" : formatNoteDate(note.createdAt);
              return (
                <div key={idx} className="text-xs text-muted-foreground/80 italic leading-relaxed flex flex-wrap items-baseline gap-x-1.5">
                  <span className="text-muted-foreground/60">•</span>
                  <span>{noteText}</span>
                  {noteTime && (
                    <span className="text-[10px] text-muted-foreground/50 not-italic font-medium">
                      ({noteTime})
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {isEditingNote ? (
          <div className="mt-2 w-full animate-in fade-in slide-in-from-top-2 duration-200">
            <textarea
              autoFocus
              placeholder="Add another detail or follow-up note..."
              value={editNoteText}
              onChange={(e) => setEditNoteText(e.target.value)}
              rows={2}
              className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
            />
            <div className="flex gap-2 mt-2">
              <Button size="sm" variant="outline" className="h-7 text-xs rounded-full px-4" onClick={() => { setIsEditingNote(false); setEditNoteText(""); }}>Cancel</Button>
              <Button size="sm" className="h-7 text-xs rounded-full px-4 text-white hover:opacity-90" style={{ background: "var(--gradient-brand)" }} onClick={() => { if (editNoteText.trim()) { onEditNote(editNoteText.trim()); } setIsEditingNote(false); setEditNoteText(""); }}>Add</Button>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => { setEditNoteText(""); setIsEditingNote(true); }} 
            className="text-xs text-blue-500 hover:text-blue-600 hover:underline mt-1.5 flex items-center gap-1"
          >
            + Add Note
          </button>
        )}

        {/* Assigned Profile Card */}
        <div className="mt-3 pt-3 border-t border-border border-dashed w-full block">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2">Assigned To</p>
          <div className="scale-90 sm:scale-95 origin-top-left -mx-2 -mt-2">
            <EmployeeProfileCard employeeName={task.assignee} />
          </div>
        </div>
      </div>

      {/* Type pill (right side) */}
      <span className={`hidden shrink-0 rounded-lg px-2 py-1 text-xs font-semibold sm:inline-block ${TYPE_COLORS[task.type]}`}>
        {task.type}
      </span>

      {/* Delete */}
      {isAdmin && (
        <button
          id={`delete-${task.id}`}
          onClick={onDelete}
          className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-red-100 hover:text-red-600 group-hover:opacity-100"
          aria-label="Delete task"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}

/* ─── Modal ──────────────────────────────────────────── */
function AddTaskModal({ assignees, onClose, onAdd }: {
  assignees: string[];
  onClose: () => void;
  onAdd: (task: Omit<Task, "id" | "status">) => void;
}) {
  const [form, setForm] = useState<Omit<Task, "id" | "status">>({
    title: "", type: "Call", priority: "Medium",
    assignee: assignees[0] || "Riya Bansal", dueDate: "", note: "", lead: "",
  });
  const titleRef = useRef<HTMLInputElement>(null);
  useEffect(() => { titleRef.current?.focus(); }, []);

  const canSubmit = form.title.trim() !== "" && form.dueDate !== "";
  const fieldCls = "w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-shadow";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Sheet on mobile, dialog on sm+ */}
      <div
        className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl border border-border bg-background shadow-2xl animate-float-up"
        style={{ animationDuration: "0.25s" }}
      >
        {/* Handle (mobile) */}
        <div className="mx-auto mt-3 h-1 w-10 rounded-full bg-border sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-xl text-primary-foreground" style={{ background: "var(--gradient-brand)" }}>
              <Plus className="h-4 w-4" />
            </span>
            <div>
              <h2 className="font-display text-lg font-bold leading-tight">New Task</h2>
              <p className="text-xs text-muted-foreground">Add a call, reminder or follow-up</p>
            </div>
          </div>
          <button
            id="close-modal-btn"
            onClick={onClose}
            className="rounded-xl p-2 text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 px-6 pt-5 pb-6">
          {/* Title */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">
              Task title <span className="text-red-500">*</span>
            </label>
            <Input
              ref={titleRef}
              id="task-title-input"
              placeholder="e.g. Call Ananya about Bali visa"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              onKeyDown={(e) => { if (e.key === "Enter" && canSubmit) onAdd(form); }}
              className="rounded-xl"
            />
          </div>

          {/* Type pills */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Type</label>
            <div className="flex flex-wrap gap-2">
              {TASK_TYPES.map((t) => {
                const Ic = TYPE_ICONS[t];
                const active = form.type === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, type: t }))}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all ${
                      active
                        ? `${TYPE_COLORS[t]} border-transparent shadow-sm`
                        : "border-border bg-background text-muted-foreground hover:bg-secondary"
                    }`}
                  >
                    <Ic className="h-3 w-3" />{t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Priority pills */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm((f) => ({ ...f, priority: p }))}
                  className={`flex items-center gap-1.5 rounded-xl border px-4 py-1.5 text-xs font-semibold transition-all ${
                    form.priority === p
                      ? `${PRIORITY_PILL[p]} border-transparent shadow-sm`
                      : "border-border bg-background text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[p]}`} />
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Assignee & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-sm font-semibold">Assignee</label>
              <select
                id="task-assignee-select"
                value={form.assignee}
                onChange={(e) => setForm((f) => ({ ...f, assignee: e.target.value }))}
                className={fieldCls}
              >
                {assignees.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-semibold">
                Due date <span className="text-red-500">*</span>
              </label>
              <Input
                id="task-due-date-input"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                className="rounded-xl"
              />
            </div>
          </div>

          {/* Lead */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Lead / Customer <span className="text-muted-foreground font-normal">(optional)</span></label>
            <Input
              id="task-lead-input"
              placeholder="e.g. Ananya Verma"
              value={form.lead}
              onChange={(e) => setForm((f) => ({ ...f, lead: e.target.value }))}
              className="rounded-xl"
            />
          </div>

          {/* Note */}
          <div>
            <label className="mb-1.5 block text-sm font-semibold">Note <span className="text-muted-foreground font-normal">(optional)</span></label>
            <textarea
              id="task-note-input"
              placeholder="Context or reminder details..."
              value={form.note}
              onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
              rows={2}
              className="w-full resize-none rounded-xl border border-border bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-shadow"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>
              Cancel
            </Button>
            <Button
              id="submit-task-btn"
              className="flex-1 gap-2 rounded-xl"
              style={{ background: canSubmit ? "var(--gradient-brand)" : undefined }}
              onClick={() => canSubmit && onAdd(form)}
              disabled={!canSubmit}
            >
              <Plus className="h-4 w-4" /> Add Task
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Filter pill ─────────────────────────────────────── */
function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all ${
        active
          ? "border-primary bg-primary text-primary-foreground shadow-sm"
          : "border-border bg-background text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

/* ─── Main page ──────────────────────────────────────── */
function TasksPage() {
  const [tasks, setTasks] = useSupabaseTable<Task[]>("tasks", SEED);
  const [localEmployees] = useSupabaseTable<any[]>("employees", INITIAL_EMPLOYEES);
  const employees = localEmployees?.length ? localEmployees : INITIAL_EMPLOYEES;
  const auth = getAuth();
  const assignees = Array.from(new Set([
    ...(employees.map((e: any) => e.name)),
    ...(auth?.name ? [auth.name] : []),
    "Other"
  ]));
  const isAdmin = auth?.role === "admin" || auth?.role === "manager" || auth?.role === "HR & Admin Manager";
  const userAssigneeName = auth?.name || "";

  const [showModal, setShowModal] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<"All" | TaskStatus | "Overdue">("All");
  const [filterPriority, setFilterPriority] = useState<"All" | Priority>("All");
  const [filterType, setFilterType] = useState<"All" | TaskType>("All");
  const [filterAssignee, setFilterAssignee] = useState<"All" | string>("All");

  // Persist every time tasks change


  const toggle = (id: string) =>
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: t.status === "Done" ? "Pending" : "Done" } as Task : t));

  const remove = (id: string) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const addTask = (formData: Omit<Task, "id" | "status">) => {
    const id = `T-${String(Date.now()).slice(-4)}`;
    setTasks((prev) => [{ ...formData, id, status: "Pending" }, ...prev]);
    setShowModal(false);
  };

  const visibleTasks = isAdmin 
    ? tasks 
    : tasks.filter((t) => t.assignee.toLowerCase() === userAssigneeName.toLowerCase());

  const filtered = visibleTasks.filter((t) => {
    if (filterStatus === "Overdue") {
      if (t.status !== "Pending" || t.dueDate >= today) return false;
    } else if (filterStatus !== "All" && t.status !== filterStatus) {
      return false;
    }
    if (filterPriority !== "All" && t.priority !== filterPriority) return false;
    if (filterType !== "All" && t.type !== filterType) return false;
    if (isAdmin && filterAssignee !== "All" && t.assignee !== filterAssignee) return false;
    return true;
  });

  const pending  = visibleTasks.filter((t) => t.status === "Pending").length;
  const done     = visibleTasks.filter((t) => t.status === "Done").length;
  const overdue  = visibleTasks.filter((t) => t.status === "Pending" && t.dueDate < today).length;
  const total    = visibleTasks.length;

  /* Keyboard shortcut: N → open modal */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "n" && !showModal && (e.target as HTMLElement).tagName !== "INPUT" && (e.target as HTMLElement).tagName !== "TEXTAREA") {
        setShowModal(true);
      }
      if (e.key === "Escape" && showModal) setShowModal(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [showModal, isAdmin]);

  return (
    <>
      <div className="space-y-6">
        {/* ── Header ── */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold">Tasks &amp; Follow-ups</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage calls, emails and payment reminders.
            </p>
          </div>
          <Button
            id="add-task-btn"
            onClick={() => setShowModal(true)}
            className="gap-2 rounded-xl px-5"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Plus className="h-4 w-4" /> Add Task
          </Button>
        </div>

        {/* ── Stat cards ── */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard 
            label="Pending"   
            value={pending}  
            total={total} 
            color="bg-amber-100  text-amber-600"   
            icon={<Clock className="h-4 w-4" />} 
            onClick={() => setFilterStatus(filterStatus === "Pending" ? "All" : "Pending")}
            active={filterStatus === "Pending"}
          />
          <StatCard 
            label="Completed" 
            value={done}     
            total={total} 
            color="bg-emerald-100 text-emerald-600" 
            icon={<CheckCircle2 className="h-4 w-4" />} 
            onClick={() => setFilterStatus(filterStatus === "Done" ? "All" : "Done")}
            active={filterStatus === "Done"}
          />
          <StatCard 
            label="Overdue"   
            value={overdue}  
            total={total} 
            color="bg-red-100    text-red-600"      
            icon={<AlertCircle className="h-4 w-4" />} 
            onClick={() => setFilterStatus(filterStatus === "Overdue" ? "All" : "Overdue")}
            active={filterStatus === "Overdue"}
          />
        </div>

        {/* ── Filters ── */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
          <div className="flex flex-wrap items-center gap-2">
            <Filter className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />

            {/* Status */}
            <Pill active={filterStatus === "All"} onClick={() => setFilterStatus("All")}>All</Pill>
            <Pill active={filterStatus === "Pending"} onClick={() => setFilterStatus("Pending")}>⏳ Pending</Pill>
            <Pill active={filterStatus === "Done"} onClick={() => setFilterStatus("Done")}>✅ Done</Pill>
            <Pill active={filterStatus === "Overdue"} onClick={() => setFilterStatus("Overdue")}>🚨 Overdue</Pill>

            <span className="mx-1 h-4 w-px bg-border" />

            {/* Priority */}
            {PRIORITIES.map((p) => (
              <Pill key={p} active={filterPriority === p} onClick={() => setFilterPriority(filterPriority === p ? "All" : p)}>
                <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${PRIORITY_DOT[p]}`} />
                {p}
              </Pill>
            ))}

            <span className="mx-1 h-4 w-px bg-border" />

            {/* Type */}
            {TASK_TYPES.map((t) => {
              const Ic = TYPE_ICONS[t];
              return (
                <Pill key={t} active={filterType === t} onClick={() => setFilterType(filterType === t ? "All" : t)}>
                  <Ic className="mr-1 inline h-3 w-3" />{t}
                </Pill>
              );
            })}

            <span className="mx-1 h-4 w-px bg-border" />

            {/* Assignee */}
            {isAdmin && assignees.map((a) => (
              <Pill key={a} active={filterAssignee === a} onClick={() => setFilterAssignee(filterAssignee === a ? "All" : a)}>
                {a.split(" ")[0]}
              </Pill>
            ))}

            <span className="ml-auto text-xs text-muted-foreground">{filtered.length} task{filtered.length !== 1 ? "s" : ""}</span>
          </div>
        </div>

        {/* ── Task list ── */}
        <div className="space-y-2.5">
          {filtered.length === 0 ? (
            <div className="grid min-h-[28vh] place-items-center rounded-2xl border border-dashed border-border bg-card p-10 text-center">
              <div>
                <ListChecks className="mx-auto h-12 w-12 text-primary/25" />
                <p className="mt-4 font-semibold text-foreground/70">All clear here!</p>
                <p className="mt-1 text-sm text-muted-foreground">No tasks match the current filters.</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4 rounded-xl"
                  onClick={() => { setFilterStatus("All"); setFilterPriority("All"); setFilterType("All"); }}
                >
                  Clear filters
                </Button>
              </div>
            </div>
          ) : (
            filtered.map((t) => (
              <TaskCard
                key={t.id}
                task={t}
                isAdmin={isAdmin}
                onToggle={() => {
                  const newTasks = tasks.map(x => x.id === t.id ? { ...x, status: x.status === "Pending" ? "Done" as TaskStatus : "Pending" as TaskStatus } : x);
                  setTasks(newTasks);

                }}
                onEditNote={(newNote) => {
                  const newTasks = tasks.map(x => {
                    if (x.id === t.id) {
                      const currentNotes = x.notes || [];
                      return {
                        ...x,
                        notes: [...currentNotes, { text: newNote, createdAt: new Date().toISOString() }]
                      };
                    }
                    return x;
                  });
                  setTasks(newTasks);

                }}
                onDelete={() => {
                  setDeleteConfirmId(t.id);
                }}
              />
            ))
          )}
        </div>

        {/* ── Completion footer ── */}
        {filtered.length > 0 && (
          <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3.5 shadow-card">
            <Sparkles className="h-4 w-4 shrink-0 text-primary" />
            <div className="flex-1">
              <div className="h-2 w-full overflow-hidden rounded-full bg-border">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${total > 0 ? Math.round((done / total) * 100) : 0}%`, background: "var(--gradient-brand)" }}
                />
              </div>
            </div>
            <p className="shrink-0 text-xs font-semibold text-muted-foreground">
              {done}/{total} tasks completed
            </p>
          </div>
        )}
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <AddTaskModal assignees={assignees} onClose={() => setShowModal(false)} onAdd={addTask} />
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in p-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-bold font-display text-foreground">Delete Task?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setDeleteConfirmId(null)} className="rounded-xl">
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  const newTasks = tasks.filter(x => x.id !== deleteConfirmId);
                  setTasks(newTasks);

                  setDeleteConfirmId(null);
                }} 
                className="rounded-xl"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
