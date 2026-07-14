import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useMemo } from "react";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { INITIAL_EMPLOYEES } from "./crm.employees";
import {
  Plus, CheckCircle2, Circle, Clock, AlertCircle, Phone, Mail,
  CreditCard, FileText, CalendarDays, Trash2, X, Filter, Sparkles,
  ListChecks, Calendar, Users, User, Edit, Eye, Paperclip, MessageSquare,
  MoreVertical, CheckSquare, List, CheckCircle, Copy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { getAuth } from "@/lib/auth";
import { toast } from "sonner";
import { DeleteConfirmModal } from "@/components/ui/delete-confirm-modal";

export const Route = createFileRoute("/crm/tasks")({ component: TasksPage });

type Priority = "High" | "Medium" | "Low";
type TaskStatus = "Pending" | "In Progress" | "Completed";

interface Task {
  id: string;
  task_number?: number;
  title: string;
  description?: string;
  assigned_to?: string;
  customer_id?: string;
  booking_id?: string;
  created_by: string;
  priority: Priority;
  status: TaskStatus;
  progress: number;
  start_date: string;
  due_date: string;
  completed_at: string | null;
  attachments: { name: string; url: string }[];
  created_at: string;
  task_type?: "Individual" | "Group" | "Subtask";
  parent_id?: string;
  notes?: { id: string; content: string; created_at: string; created_by: string }[];
}

const SEED: Task[] = [];
const PRIORITIES: Priority[] = ["High", "Medium", "Low"];
const STATUSES: TaskStatus[] = ["Pending", "In Progress", "Completed"];

const PRIORITY_COLORS: Record<string, string> = {
  High: "bg-red-100 text-red-800 border-red-200",
  Medium: "bg-amber-100 text-amber-800 border-amber-200",
  Low: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

const STATUS_COLORS: Record<string, string> = {
  Pending: "bg-slate-100 text-slate-800 border-slate-200",
  "In Progress": "bg-blue-100 text-blue-800 border-blue-200",
  Completed: "bg-emerald-100 text-emerald-800 border-emerald-200",
  Done: "bg-emerald-100 text-emerald-800 border-emerald-200",
};

function TasksPage() {
  const auth = getAuth();
  const currentUser = auth?.name || "Admin";
  const isAdmin = auth?.role === "admin" || currentUser.toLowerCase().includes("aman");

  const [tasks, setTasks] = useSupabaseTable<Task[]>("tasks", SEED);
  const [employees] = useSupabaseTable<any[]>("employees", INITIAL_EMPLOYEES);

  const [currentView, setCurrentView] = useState<"list" | "individual" | "group" | "calendar">("list");

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<string | null>(null);
  const [newNote, setNewNote] = useState("");
  const [editingTableNoteId, setEditingTableNoteId] = useState<string | null>(null);
  const [tableEditNoteText, setTableEditNoteText] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<Partial<Task>>({
    title: "", description: "", assigned_to: "", customer_id: "", booking_id: "",
    priority: "Medium", status: "Pending", progress: 0,
    start_date: new Date().toISOString().split('T')[0],
    due_date: new Date().toISOString().split('T')[0]
  });
  const [taskType, setTaskType] = useState<"Individual" | "Group">("Individual");
  const [subTasks, setSubTasks] = useState<{ title: string, assigned_to: string }[]>([]);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const visibleTasks = useMemo(() => {
    if (isAdmin) return tasks;
    return tasks.filter(task => {
      if (task.parent_id) {
        return task.assigned_to === currentUser;
      }
      if (task.task_type === "Group") {
        return tasks.some(st => st.parent_id === task.id && st.assigned_to === currentUser);
      }
      return task.assigned_to === currentUser;
    });
  }, [tasks, isAdmin, currentUser]);

  const totalTasks = visibleTasks.length;
  const pendingTasks = visibleTasks.filter(t => t.status === "Pending").length;
  const inProgressTasks = visibleTasks.filter(t => t.status === "In Progress").length;
  const completedTasks = visibleTasks.filter(t => t.status === "Completed").length;
  const overdueTasks = visibleTasks.filter(t => {
    const d = t.due_date || (t as any).dueDate;
    return t.status !== "Completed" && d && new Date(d) < new Date();
  }).length;

  const handleEditTask = (task: Task) => {
    setIsEditing(task.id);
    setFormData({
      title: task.title,
      description: task.description || "",
      assigned_to: task.assigned_to || (task as any).assignee || "",
      customer_id: task.customer_id || (task as any).lead || "",
      booking_id: task.booking_id || "",
      priority: task.priority as Priority,
      status: task.status as TaskStatus,
      progress: task.progress || 0,
      start_date: task.start_date ? task.start_date.split('T')[0] : new Date().toISOString().split('T')[0],
      due_date: (task.due_date || (task as any).dueDate) ? String(task.due_date || (task as any).dueDate).split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setTaskType(task.task_type === "Group" ? "Group" : "Individual");
    setSubTasks([]); // Not supporting editing existing sub-tasks deeply for now, they are edited individually
    setSelectedFiles([]);
    setShowCreateModal(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTaskToDelete(taskId);
  };

  const confirmDeleteTask = () => {
    if (taskToDelete) {
      setTasks((prev: any[]) => prev.filter(t => t.id !== taskToDelete && t.parent_id !== taskToDelete));
      toast.success("Task deleted successfully");
      setTaskToDelete(null);
    }
  };

  const handleCloneTask = (taskToClone: Task) => {
    try {
      const maxNumber = tasks.reduce((max, t) => {
        const match = t.id?.match(/\d+/);
        if (match) {
          const val = parseInt(match[0]);
          return val > max ? val : max;
        }
        return max;
      }, 0);
      const newId = `T-${String(maxNumber + 1).padStart(3, "0")}`;
      const newTasksToAdd = [];

      const clonedMainTask = {
        ...taskToClone,
        id: newId,
        title: `${taskToClone.title} (Copy)`,
        created_at: new Date().toISOString(),
        completed_at: null,
        status: "Pending" as const,
        progress: 0,
      };
      newTasksToAdd.push(clonedMainTask);

      const subTasks = tasks.filter(t => t.parent_id === taskToClone.id);
      subTasks.forEach((st, idx) => {
        const newSubId = `T-${String(maxNumber + 2 + idx).padStart(3, "0")}`;
        newTasksToAdd.push({
          ...st,
          id: newSubId,
          parent_id: newId,
          title: st.title,
          created_at: new Date().toISOString(),
          completed_at: null,
          status: "Pending" as const,
          progress: 0,
        });
      });

      setTasks((prev: Task[]) => [...prev, ...newTasksToAdd]);
      toast.success(`Task cloned successfully as ${newId}!`);
    } catch (err) {
      toast.error("Failed to clone task");
    }
  };

  const handleSaveTask = () => {
    if (!formData.title?.trim()) return;

    if (isEditing) {
      setTasks(prev => prev.map(t => {
        if (t.id === isEditing) {
          return {
            ...t,
            title: formData.title || t.title,
            description: formData.description || "",
            assigned_to: formData.assigned_to || "",
            customer_id: formData.customer_id || "",
            booking_id: formData.booking_id || "",
            priority: (formData.priority || t.priority) as Priority,
            status: (formData.status || t.status) as TaskStatus,
            progress: formData.progress || 0,
            start_date: formData.start_date || t.start_date,
            due_date: formData.due_date || t.due_date,
            completed_at: formData.status === "Completed" && t.status !== "Completed" ? new Date().toISOString() : t.completed_at
          };
        }
        return t;
      }));
    } else {
      let nextTaskNum = tasks.length > 0 ? Math.max(...tasks.map(t => t.task_number || 0)) + 1 : 1;

      const filesToSave = selectedFiles.map(f => ({
        name: f.name,
        url: URL.createObjectURL(f)
      }));

      const newTask: Task = {
        id: crypto.randomUUID(),
        task_number: nextTaskNum,
        title: formData.title || "",
        description: formData.description || "",
        assigned_to: taskType === "Individual" ? (formData.assigned_to || "") : "",
        customer_id: formData.customer_id || "",
        booking_id: formData.booking_id || "",
        created_by: currentUser,
        priority: (formData.priority || "Medium") as Priority,
        status: (formData.status || "Pending") as TaskStatus,
        progress: formData.progress || 0,
        start_date: formData.start_date || new Date().toISOString().split('T')[0],
        due_date: formData.due_date || new Date().toISOString().split('T')[0],
        completed_at: formData.status === "Completed" ? new Date().toISOString() : null,
        attachments: filesToSave,
        created_at: new Date().toISOString(),
        task_type: taskType
      };

      const newTasksToAdd = [newTask];

      if (taskType === "Group" && subTasks.length > 0) {
        subTasks.forEach(st => {
          if (!st.title.trim()) return;
          nextTaskNum++;
          newTasksToAdd.push({
            id: crypto.randomUUID(),
            task_number: nextTaskNum,
            title: st.title,
            description: "",
            assigned_to: st.assigned_to,
            customer_id: formData.customer_id || "",
            booking_id: formData.booking_id || "",
            created_by: currentUser,
            priority: (formData.priority || "Medium") as Priority,
            status: "Pending",
            progress: 0,
            start_date: formData.start_date || new Date().toISOString().split('T')[0],
            due_date: formData.due_date || new Date().toISOString().split('T')[0],
            completed_at: null,
            attachments: [],
            created_at: new Date().toISOString(),
            task_type: "Subtask",
            parent_id: newTask.id
          });
        });
      }

      setTasks([...tasks, ...newTasksToAdd]);
    }

    setShowCreateModal(false);
    setSelectedFiles([]);
    setIsEditing(null);
    setFormData({
      title: "", description: "", assigned_to: "", customer_id: "", booking_id: "",
      priority: "Medium", status: "Pending", progress: 0,
      start_date: new Date().toISOString().split('T')[0],
      due_date: new Date().toISOString().split('T')[0]
    });
  };

  const getDisplayId = (t: Task) => {
    if (!t) return "";

    if (t.task_type === "Subtask" && t.parent_id) {
      const parentTask = tasks.find(x => x.id === t.parent_id);
      const siblings = tasks.filter(x => x.parent_id === t.parent_id).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      const idx = siblings.findIndex(x => x.id === t.id);
      const letter = String.fromCharCode(65 + Math.max(0, idx));

      let parentBaseStr = "";
      if (parentTask) {
        if (parentTask.task_number) {
          parentBaseStr = `T-${String(parentTask.task_number).padStart(3, '0')}`;
        } else {
          const strId = String(parentTask.id || "").toUpperCase();
          parentBaseStr = (strId.startsWith('T-') || strId.startsWith('TSK-')) ? strId : `T-${strId.slice(0, 4)}`;
        }
      } else {
        parentBaseStr = "T-???";
      }
      return `${parentBaseStr}(${letter})`;
    }

    let baseStr = "";
    if (t.task_number) {
      baseStr = `T-${String(t.task_number).padStart(3, '0')}`;
    } else {
      const strId = String(t.id || "").toUpperCase();
      baseStr = (strId.startsWith('T-') || strId.startsWith('TSK-')) ? strId : `T-${strId.slice(0, 4)}`;
    }

    return baseStr;
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          status,
          progress: status === "Completed" ? 100 : (status === "Pending" ? 0 : 50),
          completed_at: status === "Completed" ? new Date().toISOString() : null
        };
      }
      return t;
    }));
    if (viewingTask && viewingTask.id === taskId) {
      setViewingTask(prev => prev ? {
        ...prev,
        status,
        progress: status === "Completed" ? 100 : (status === "Pending" ? 0 : 50),
        completed_at: status === "Completed" ? new Date().toISOString() : null
      } : prev);
    }
  };

  const handleAddNote = (taskId: string) => {
    if (!newNote.trim()) return;

    const note = {
      id: crypto.randomUUID(),
      content: newNote,
      created_at: new Date().toISOString(),
      created_by: currentUser || "Me"
    };

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          notes: [...(t.notes || []), note]
        };
      }
      return t;
    }));

    if (viewingTask && viewingTask.id === taskId) {
      setViewingTask(prev => prev ? { ...prev, notes: [...(prev.notes || []), note] } : prev);
    }

    setNewNote("");
  };

  const handleTableAddNote = (taskId: string) => {
    if (!tableEditNoteText.trim()) {
      setEditingTableNoteId(null);
      return;
    }

    const note = {
      id: crypto.randomUUID(),
      content: tableEditNoteText,
      created_at: new Date().toISOString(),
      created_by: currentUser || "Me"
    };

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return {
          ...t,
          notes: [...(t.notes || []), note]
        };
      }
      return t;
    }));

    if (viewingTask && viewingTask.id === taskId) {
      setViewingTask(prev => prev ? { ...prev, notes: [...(prev.notes || []), note] } : prev);
    }

    setTableEditNoteText("");
    setEditingTableNoteId(null);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col bg-slate-50/50 p-6 overflow-hidden">
      {/* Dashboard Top Row */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Task Management</h1>
          <p className="text-sm text-slate-500">Track and manage your team's workflow</p>
        </div>
        <Button onClick={() => { setIsEditing(null); setShowCreateModal(true); }} className="gap-2">
          <Plus className="h-4 w-4" />
          Create Task
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-5 mb-6">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Total Tasks</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{totalTasks}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Pending</p>
          <p className="mt-2 text-3xl font-bold text-slate-700">{pendingTasks}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">In Progress</p>
          <p className="mt-2 text-3xl font-bold text-blue-600">{inProgressTasks}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Completed</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{completedTasks}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Overdue</p>
          <p className="mt-2 text-3xl font-bold text-red-600">{overdueTasks}</p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 rounded-xl border bg-white shadow-sm overflow-hidden flex flex-col">
        <div className="border-b px-4 py-3 flex justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("list")} className={`gap-2 ${currentView === "list" ? "text-primary font-semibold hover:text-primary hover:bg-transparent" : "text-muted-foreground"}`}>
            <List className="h-4 w-4" /> List View
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("individual")} className={`gap-2 ${currentView === "individual" ? "text-primary font-semibold hover:text-primary hover:bg-transparent" : "text-muted-foreground"}`}>
            <User className="h-4 w-4" /> Individual Tasks
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("group")} className={`gap-2 ${currentView === "group" ? "text-primary font-semibold hover:text-primary hover:bg-transparent" : "text-muted-foreground"}`}>
            <Users className="h-4 w-4" /> Group Tasks
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setCurrentView("calendar")} className={`gap-2 ${currentView === "calendar" ? "text-primary font-semibold hover:text-primary hover:bg-transparent" : "text-muted-foreground"}`}>
            <Calendar className="h-4 w-4" /> Calendar View
          </Button>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {(currentView === "list" || currentView === "group") && (
            <Table>
              <TableHeader>
                <TableRow className="bg-primary hover:bg-primary/90 [&_th]:text-primary-foreground">
                  <TableHead className="w-[100px]">Task ID</TableHead>
                  <TableHead>Task Name</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-slate-500">No tasks found.</TableCell>
                  </TableRow>
                ) : visibleTasks.filter(t => !t.parent_id && (currentView === "group" ? t.task_type === "Group" : true)).map((task) => {
                  const subTasks = visibleTasks.filter(st => st.parent_id === task.id);
                  return (
                    <React.Fragment key={task.id}>
                      <TableRow key={task.id} className={task.task_type === "Group" ? "bg-slate-50/50" : ""}>
                        <TableCell className="font-medium text-slate-500">#{getDisplayId(task)}</TableCell>
                        <TableCell className="font-semibold">{task.title}</TableCell>
                        <TableCell className="align-top min-w-[200px]">
                          <div className="mb-2 font-medium text-gray-800">{task.assigned_to || (task as any).assignee || "-"}</div>
                          <div className="pl-2.5 border-l-[3px] border-[#e8dfd5] py-0.5 flex flex-col gap-1.5">
                            <div className="flex flex-col gap-2.5 max-h-[54px] overflow-y-auto pr-1 custom-scrollbar">
                              {task.notes && task.notes.length > 0 && (
                                task.notes.slice().reverse().map((n: any, i: number) => (
                                  <div key={i} className="text-sm text-muted-foreground italic flex flex-wrap items-baseline gap-x-1.5 leading-tight">
                                    <span className="text-muted-foreground/60">•</span>
                                    <span className="text-muted-foreground">{n.content}</span>
                                    {n.created_at && (
                                      <span className="text-xs text-muted-foreground/60 not-italic ml-0.5">
                                        ({new Date(n.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).replace(',', '')})
                                      </span>
                                    )}
                                  </div>
                                ))
                              )}
                            </div>
                            <div className="mt-1">
                              {editingTableNoteId === task.id ? (
                                <div className="flex flex-col gap-2 mt-1">
                                  <textarea
                                    autoFocus
                                    value={tableEditNoteText}
                                    onChange={(e) => setTableEditNoteText(e.target.value)}
                                    className="w-full text-sm border border-input rounded-md px-2 py-1.5 min-h-[60px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Write a note..."
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleTableAddNote(task.id);
                                      } else if (e.key === "Escape") {
                                        setEditingTableNoteId(null);
                                        setTableEditNoteText("");
                                      }
                                    }}
                                  />
                                  <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="ghost" onClick={() => { setEditingTableNoteId(null); setTableEditNoteText(""); }} className="h-6 text-xs px-2">Cancel</Button>
                                    <Button size="sm" onClick={() => handleTableAddNote(task.id)} className="h-6 text-xs px-2">Save</Button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingTableNoteId(task.id);
                                    setTableEditNoteText("");
                                  }}
                                  className="text-sm text-blue-500 hover:text-blue-600 font-medium text-left whitespace-nowrap mt-1 pl-1"
                                >
                                  + Add Note
                                </button>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{task.customer_id || (task as any).lead || "-"}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={PRIORITY_COLORS[task.priority] || "bg-slate-100 text-slate-800"}>{task.priority}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={STATUS_COLORS[task.status] || "bg-slate-100 text-slate-800"}>{task.status}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                            <CalendarDays className="h-3.5 w-3.5" />
                            {(task.due_date || (task as any).dueDate)
                              ? new Date(task.due_date || (task as any).dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                              : "N/A"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {(() => {
                              const p = task.progress ?? (task.status === "Completed" || task.status === "Done" as any ? 100 : 0);
                              return (
                                <>
                                  <Progress value={p} className="h-2 w-16" />
                                  <span className="text-xs text-slate-500">{p}%</span>
                                </>
                              );
                            })()}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-1">
                            {isAdmin && (
                              <Button variant="ghost" size="icon" onClick={() => handleEditTask(task)}>
                                <Edit className="h-4 w-4 text-slate-500" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={() => setViewingTask(task)}>
                              <Eye className="h-4 w-4 text-slate-500" />
                            </Button>
                            {isAdmin && (
                              <Button variant="ghost" size="icon" onClick={() => handleCloneTask(task)}>
                                <Copy className="h-4 w-4 text-green-500" />
                              </Button>
                            )}
                            {isAdmin && (
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(task.id)}>
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                      {subTasks.length > 0 && subTasks.map((st) => (
                        <TableRow className="bg-slate-50/80" key={st.id}>
                          <TableCell className="font-medium text-slate-500 pl-8 relative"><div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-[1px] bg-slate-300"></div><div className="absolute left-3 top-0 bottom-1/2 w-[1px] bg-slate-300"></div>#{getDisplayId(st)}</TableCell>
                          <TableCell className="font-semibold">{st.title}</TableCell>
                          <TableCell className="align-top min-w-[200px]">
                            <div className="mb-2 font-medium text-gray-800">{st.assigned_to || (st as any).assignee || "-"}</div>
                            <div className="pl-2.5 border-l-[3px] border-[#e8dfd5] py-0.5 flex flex-col gap-1.5">
                              <div className="flex flex-col gap-2.5 max-h-[54px] overflow-y-auto pr-1 custom-scrollbar">
                                {st.notes && st.notes.length > 0 && (
                                  st.notes.slice().reverse().map((n: any, i: number) => (
                                    <div key={i} className="text-sm text-muted-foreground italic flex flex-wrap items-baseline gap-x-1.5 leading-tight">
                                      <span className="text-muted-foreground/60">•</span>
                                      <span className="text-muted-foreground">{n.content}</span>
                                      {n.created_at && (
                                        <span className="text-xs text-muted-foreground/60 not-italic ml-0.5">
                                          ({new Date(n.created_at).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).replace(',', '')})
                                        </span>
                                      )}
                                    </div>
                                  ))
                                )}
                              </div>
                              <div className="mt-1">
                                {editingTableNoteId === st.id ? (
                                  <div className="flex flex-col gap-2 mt-1">
                                    <textarea
                                      autoFocus
                                      value={tableEditNoteText}
                                      onChange={(e) => setTableEditNoteText(e.target.value)}
                                      className="w-full text-sm border border-input rounded-md px-2 py-1.5 min-h-[60px] bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                      placeholder="Write a note..."
                                      onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                          e.preventDefault();
                                          handleTableAddNote(st.id);
                                        } else if (e.key === "Escape") {
                                          setEditingTableNoteId(null);
                                          setTableEditNoteText("");
                                        }
                                      }}
                                    />
                                    <div className="flex justify-end gap-2">
                                      <Button size="sm" variant="ghost" onClick={() => { setEditingTableNoteId(null); setTableEditNoteText(""); }} className="h-6 text-xs px-2">Cancel</Button>
                                      <Button size="sm" onClick={() => handleTableAddNote(st.id)} className="h-6 text-xs px-2">Save</Button>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setEditingTableNoteId(st.id);
                                      setTableEditNoteText("");
                                    }}
                                    className="text-sm text-blue-500 hover:text-blue-600 font-medium text-left whitespace-nowrap mt-1 pl-1"
                                  >
                                    + Add Note
                                  </button>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{st.customer_id || (st as any).lead || "-"}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={PRIORITY_COLORS[st.priority] || "bg-slate-100 text-slate-800"}>{st.priority}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={STATUS_COLORS[st.status] || "bg-slate-100 text-slate-800"}>{st.status}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5 text-slate-600 text-sm">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {(st.due_date || (st as any).dueDate)
                                ? new Date(st.due_date || (st as any).dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                                : "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {(() => {
                                const p = st.progress ?? (st.status === "Completed" || st.status === "Done" as any ? 100 : 0);
                                return (
                                  <>
                                    <Progress value={p} className="h-2 w-16" />
                                    <span className="text-xs text-slate-500">{p}%</span>
                                  </>
                                );
                              })()}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end items-center gap-1">
                              {isAdmin && (
                                <Button variant="ghost" size="icon" onClick={() => handleEditTask(st)}>
                                  <Edit className="h-4 w-4 text-slate-500" />
                                </Button>
                              )}
                              <Button variant="ghost" size="icon" onClick={() => setViewingTask(st)}>
                                <Eye className="h-4 w-4 text-slate-500" />
                              </Button>
                              {isAdmin && (
                                <Button variant="ghost" size="icon" onClick={() => handleCloneTask(st)}>
                                  <Copy className="h-4 w-4 text-green-500" />
                                </Button>
                              )}
                              {isAdmin && (
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteTask(st.id)}>
                                  <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </React.Fragment>
                  )
                })}
              </TableBody>
            </Table>
          )}

          {currentView === "individual" && (
            <div className="p-6">
              {visibleTasks.length === 0 ? (
                <div className="text-center py-20 text-slate-500 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
                  <Users className="h-12 w-12 text-slate-300 mb-4" />
                  <h3 className="text-lg font-medium text-slate-900">No Tasks Found</h3>
                  <p className="max-w-sm mx-auto mt-2">There are currently no tasks assigned to any employees.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from(new Set(visibleTasks.map(t => t.assigned_to || (t as any).assignee || "Unassigned"))).map(assigneeName => {
                    const empTasks = visibleTasks.filter(t => (t.assigned_to || (t as any).assignee || "Unassigned") === assigneeName);
                    if (empTasks.length === 0) return null;
                    return (
                      <div key={assigneeName} className="rounded-xl border bg-slate-50 p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center font-bold text-brand uppercase">
                            {assigneeName.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-slate-900">{assigneeName}</h3>
                            <p className="text-xs text-slate-500">{empTasks.length} Assigned Tasks</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          {empTasks.map(t => (
                            <div key={t.id} className="group flex items-start gap-3 rounded-lg border bg-white p-3 shadow-sm hover:border-brand/50">
                              <div className="mt-0.5">
                                {t.status === "Completed" ? (
                                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                ) : (
                                  <Circle className="h-5 w-5 text-slate-300" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p onClick={() => setViewingTask(t)} className={`cursor-pointer text-sm font-medium ${t.status === "Completed" ? "text-slate-400 line-through" : "text-slate-900"}`}>
                                  {t.task_type === "Subtask" && <Badge variant="secondary" className="mr-2 text-[9px] px-1 py-0 h-4 bg-brand/10 text-brand border-brand/20">Sub-Task</Badge>}
                                  {t.title}
                                </p>
                                <div className="mt-1 flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="outline" className={`text-[10px] px-1 py-0 h-4 ${PRIORITY_COLORS[t.priority] || "bg-slate-100"}`}>{t.priority}</Badge>
                                    <span className="text-[10px] text-slate-500">
                                      {(t.due_date || (t as any).dueDate)
                                        ? new Date(t.due_date || (t as any).dueDate).toLocaleDateString()
                                        : "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex gap-1">
                                    {isAdmin && (
                                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleEditTask(t)}>
                                        <Edit className="h-3.5 w-3.5 text-slate-400" />
                                      </Button>
                                    )}
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setViewingTask(t)}>
                                      <Eye className="h-3.5 w-3.5 text-slate-400" />
                                    </Button>
                                    {isAdmin && (
                                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleCloneTask(t)}>
                                        <Copy className="h-3.5 w-3.5 text-green-400" />
                                      </Button>
                                    )}
                                    {isAdmin && (
                                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleDeleteTask(t.id)}>
                                        <Trash2 className="h-3.5 w-3.5 text-red-400" />
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}


          {currentView === "calendar" && (() => {
            const year = calendarDate.getFullYear();
            const month = calendarDate.getMonth();
            const firstDayOfMonth = new Date(year, month, 1);
            const startDay = firstDayOfMonth.getDay();
            const daysInMonth = new Date(year, month + 1, 0).getDate();
            const monthName = firstDayOfMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
            const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const daysArray = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

            return (
              <div className="bg-white rounded-xl border shadow-sm p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-brand" />
                    {monthName}
                  </h2>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCalendarDate(new Date(year, month - 1, 1))}>Prev</Button>
                    <Button variant="outline" size="sm" onClick={() => setCalendarDate(new Date())}>Today</Button>
                    <Button variant="outline" size="sm" onClick={() => setCalendarDate(new Date(year, month + 1, 1))}>Next</Button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-px bg-slate-200 border bg-slate-200 rounded-lg overflow-hidden">
                  {weekDays.map(day => (
                    <div key={day} className="bg-slate-50 p-3 text-center text-sm font-semibold text-slate-600">
                      {day}
                    </div>
                  ))}

                  {Array.from({ length: startDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="bg-white p-2 min-h-[120px]" />
                  ))}

                  {daysArray.map(date => {
                    const isToday = new Date().toDateString() === date.toDateString();
                    const dateStr = date.toISOString().split('T')[0];
                    const dayTasks = visibleTasks.filter(t => (t.due_date || (t as any).dueDate)?.startsWith(dateStr));

                    return (
                      <div key={date.toISOString()} className={`bg-white p-2 min-h-[120px] transition-colors hover:bg-slate-50/50 ${isToday ? 'bg-blue-50/30' : ''}`}>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-primary-foreground shadow-sm' : 'text-slate-700'}`}>
                            {date.getDate()}
                          </span>
                          {dayTasks.length > 0 && (
                            <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-slate-100">{dayTasks.length}</Badge>
                          )}
                        </div>
                        <div className="space-y-1.5 overflow-y-auto max-h-[80px] pr-1 scrollbar-thin">
                          {dayTasks.map(t => (
                            <div
                              key={t.id}
                              onClick={() => setViewingTask(t)}
                              className={`text-[10px] px-1.5 py-1 rounded truncate cursor-pointer hover:opacity-80 border ${t.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                                t.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                                  'bg-white text-slate-700 border-slate-200 shadow-sm'
                                }`}
                            >
                              {t.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Modals */}
      <Dialog open={showCreateModal} onOpenChange={(open) => {
        setShowCreateModal(open);
        if (!open) setIsEditing(null);
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Task" : "Create New Task"}</DialogTitle>
          </DialogHeader>

          {!isEditing && (
            <div className="flex bg-slate-100 p-1 rounded-lg w-fit mt-2">
              <button
                onClick={() => setTaskType("Individual")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${taskType === "Individual" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Individual Task
              </button>
              <button
                onClick={() => setTaskType("Group")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${taskType === "Group" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
              >
                Group Task
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">{taskType === "Group" ? "Main Task Name *" : "Task Name *"}</label>
              <Input placeholder="E.g., Dubai Visa Processing" value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} />
            </div>

            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea rows={3} placeholder="Task details..." value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} />
            </div>

            {taskType === "Individual" && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Assigned To</label>
                <Select value={formData.assigned_to} onValueChange={v => setFormData(f => ({ ...f, assigned_to: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select team member" /></SelectTrigger>
                  <SelectContent>
                    {employees.map(emp => (
                      <SelectItem key={emp.id} value={emp.name}>{emp.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">Customer (Optional)</label>
              <Input placeholder="E.g., Rahul Sharma" value={formData.customer_id} onChange={e => setFormData(f => ({ ...f, customer_id: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={formData.priority} onValueChange={(v: Priority) => setFormData(f => ({ ...f, priority: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map(p => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={formData.status} onValueChange={(v: TaskStatus) => setFormData(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {STATUSES.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input type="date" value={formData.start_date} onChange={e => setFormData(f => ({ ...f, start_date: e.target.value }))} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Due Date</label>
              <Input type="date" value={formData.due_date} onChange={e => setFormData(f => ({ ...f, due_date: e.target.value }))} />
            </div>

            {taskType === "Group" && !isEditing && (
              <div className="col-span-2 mt-4 space-y-4 rounded-lg border border-brand/20 bg-brand/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-brand">Sub-Tasks</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={() => setSubTasks([...subTasks, { title: "", assigned_to: "" }])}
                  >
                    <Plus className="h-3 w-3" /> Add Sub-Task
                  </Button>
                </div>

                {subTasks.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-2">No sub-tasks added yet.</p>
                ) : (
                  <div className="space-y-3">
                    {subTasks.map((st, idx) => (
                      <div key={idx} className="flex items-start gap-2 bg-white p-2 rounded border shadow-sm">
                        <div className="flex-1 space-y-2">
                          <Input
                            placeholder="Sub-task title..."
                            value={st.title}
                            onChange={(e) => {
                              const newSt = [...subTasks];
                              newSt[idx].title = e.target.value;
                              setSubTasks(newSt);
                            }}
                            className="h-8 text-sm"
                          />
                          <Select
                            value={st.assigned_to}
                            onValueChange={(v) => {
                              const newSt = [...subTasks];
                              newSt[idx].assigned_to = v;
                              setSubTasks(newSt);
                            }}
                          >
                            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Assign to..." /></SelectTrigger>
                            <SelectContent>
                              {employees.map(emp => (
                                <SelectItem key={emp.id} value={emp.name}>{emp.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-slate-400 hover:text-red-500 shrink-0"
                          onClick={() => {
                            setSubTasks(subTasks.filter((_, i) => i !== idx));
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="col-span-2 mt-2 space-y-3 rounded-lg border p-4 bg-slate-50">
              <p className="text-sm font-medium">Reminders & Attachments</p>
              <div className="flex gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox id="email-rem" />
                  <label htmlFor="email-rem" className="text-sm text-slate-600">Email Reminder</label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="wa-rem" />
                  <label htmlFor="wa-rem" className="text-sm text-slate-600">WhatsApp Reminder</label>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full border-dashed gap-2"
                onClick={() => document.getElementById('task-file-upload')?.click()}
              >
                <Paperclip className="h-4 w-4" /> Upload Files
              </Button>
              {selectedFiles.length > 0 && (
                <div className="flex flex-col gap-2 mt-3">
                  {selectedFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 text-xs bg-background border border-border rounded-lg shadow-sm">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <Paperclip className="h-3 w-3 shrink-0 text-muted-foreground" />
                        <span className="truncate font-medium text-slate-700">{file.name}</span>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <button
                        onClick={() => setSelectedFiles(prev => prev.filter((_, i) => i !== idx))}
                        className="text-slate-400 hover:text-red-500 shrink-0 p-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <input
                type="file"
                id="task-file-upload"
                className="hidden"
                multiple
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                  }
                  e.target.value = ""; // Reset input so same file can be selected again
                }}
              />
            </div>

          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setShowCreateModal(false); setIsEditing(null); }}>Cancel</Button>
            <Button onClick={handleSaveTask}>{isEditing ? "Save Changes" : "Save Task"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewingTask} onOpenChange={(open) => !open && setViewingTask(null)}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          {viewingTask && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between pr-4">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-sm font-normal">#{getDisplayId(viewingTask)}</span>
                    <span>Task Details</span>
                  </div>
                  <Badge variant="outline" className={STATUS_COLORS[viewingTask.status]}>{viewingTask.status}</Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="py-4 space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{viewingTask.title}</h2>
                  <p className="mt-2 text-sm text-slate-600">{viewingTask.description || "No description provided."}</p>
                </div>

                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div>
                    <p className="text-slate-500 font-medium">Assigned To</p>
                    <p className="font-semibold">{viewingTask.assigned_to || (viewingTask as any).assignee || "Unassigned"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Customer</p>
                    <p className="font-semibold">{viewingTask.customer_id || (viewingTask as any).lead || "-"}</p>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Priority</p>
                    <Badge variant="outline" className={`mt-1 ${PRIORITY_COLORS[viewingTask.priority] || "bg-slate-100"}`}>{viewingTask.priority}</Badge>
                  </div>
                  <div>
                    <p className="text-slate-500 font-medium">Due Date</p>
                    <div className="flex items-center gap-1.5 mt-1 font-semibold text-slate-700">
                      <CalendarDays className="h-4 w-4 text-slate-400" />
                      {(viewingTask.due_date || (viewingTask as any).dueDate)
                        ? new Date(viewingTask.due_date || (viewingTask as any).dueDate).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-700">Progress</span>
                    <span className="font-bold text-slate-900">{viewingTask.progress ?? ((viewingTask.status === "Completed" || viewingTask.status === "Done" as any) ? 100 : 0)}%</span>
                  </div>
                  <Progress value={viewingTask.progress ?? ((viewingTask.status === "Completed" || viewingTask.status === "Done" as any) ? 100 : 0)} className="h-2.5" />
                </div>

                <div className="pt-6 border-t flex items-center gap-3">
                  <Button
                    variant={viewingTask.status === "Pending" ? "default" : "outline"}
                    className="flex-1"
                    onClick={() => updateTaskStatus(viewingTask.id, "Pending")}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={viewingTask.status === "In Progress" ? "default" : "outline"}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    onClick={() => updateTaskStatus(viewingTask.id, "In Progress")}
                  >
                    In Progress
                  </Button>
                  <Button
                    variant={viewingTask.status === "Completed" ? "default" : "outline"}
                    className="flex-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                    onClick={() => updateTaskStatus(viewingTask.id, "Completed")}
                  >
                    Completed
                  </Button>
                </div>

                {viewingTask.attachments && viewingTask.attachments.length > 0 && (
                  <div className="pt-6 border-t mt-6">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <Paperclip className="h-4 w-4 text-slate-500" />
                      Attachments
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {viewingTask.attachments.map((file, idx) => (
                        <a
                          key={idx}
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border hover:border-brand/50 transition-colors"
                        >
                          <FileText className="h-5 w-5 text-brand" />
                          <span className="text-sm font-medium text-slate-700 truncate">{file.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes / Comments Section */}
                <div className="pt-6 border-t mt-6">
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-slate-500" />
                    Task Notes & Updates
                  </h3>

                  <div className="space-y-4 max-h-[200px] overflow-y-auto mb-4 pr-2">
                    {(!viewingTask.notes || viewingTask.notes.length === 0) ? (
                      <p className="text-sm text-slate-500 italic text-center py-4 bg-slate-50 rounded-lg">No notes yet. Be the first to add an update!</p>
                    ) : (
                      viewingTask.notes.map(note => (
                        <div key={note.id} className="bg-slate-50 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-semibold text-slate-700">{note.created_by}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(note.created_at).toLocaleDateString()} {new Date(note.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 whitespace-pre-wrap">{note.content}</p>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="flex gap-2 items-end">
                    <div className="flex-1">
                      <Textarea
                        placeholder="Type your note here..."
                        value={newNote}
                        onChange={(e) => setNewNote(e.target.value)}
                        className="min-h-[60px] text-sm resize-none"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAddNote(viewingTask.id);
                          }
                        }}
                      />
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleAddNote(viewingTask.id)}
                      disabled={!newNote.trim()}
                    >
                      Post
                    </Button>
                  </div>
                </div>

              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      
      <DeleteConfirmModal 
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={confirmDeleteTask}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
      />
    </div>
  );
}
