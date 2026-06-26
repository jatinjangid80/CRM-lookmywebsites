import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  UserCog, Phone, Mail, Plus, Search,
  TrendingUp, Star, CalendarCheck, UserCheck, Shield, X, Info,
  Clock, CheckCircle2, AlertCircle, Calendar, MapPin, ClipboardList,
  Sparkles, FileText, ChevronDown, ChevronUp, Check, Play, Square, FileSignature, Download, Trash2, Heart, MessageSquare
} from "lucide-react";
import { Edit, CheckSquare, Send, CheckCircle, Award, Upload, User } from "lucide-react";

function EditField({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{label}</label>
      <Input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-xs focus-visible:ring-[#FF6B00]"
      />
    </div>
  );
}

function EditSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useLocalStorage } from "@/lib/use-local-storage";
import { EmployeeProfileModal } from "@/components/EmployeeProfileModal";
import { getAuth } from "@/lib/auth";
import {
  INITIAL_EMPLOYEE_DETAILS,
  createDefaultEmployeeDetails,
  type EmployeeDetails,
  type CareerItem,
  type AcademicItem,
  type FamilyItem
} from "@/lib/employee-profile-defaults";

export const Route = createFileRoute("/crm/employees")({ component: EmployeesPage });

/* ─── Types ─── */
type Role = "Operations Manager" | "Travel Consultant" | "Visa Executive" | "Accounts" | "Marketing" | "Sales Executive" | "Executive" | "HR & Admin Manager" | "Accounts Manager";
type Status = "Active" | "On Leave" | "Inactive";

interface Employee {
  id: string;
  name: string;
  avatar: string;
  role: Role;
  email: string;
  phone: string;
  joinDate: string;
  status: Status;
  leads: number;
  closedDeals: number;
  revenue: number;
  rating: number;
  recentActivity: string;
  description: string;
}

/* ─── Mock data ─── */
export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "LMH-01", name: "Manvendra Singhal", avatar: "/avatars/manvendra.png",
    role: "HR & Admin Manager", email: "insurancesolutions58@gmail.com", phone: "+91 9887155570",
    joinDate: "2022-01-15", status: "Active",
    leads: 0, closedDeals: 0, revenue: 0, rating: 5.0,
    recentActivity: "Updated company HR policies.",
    description: "Oversees Human Resources and Administrative operations.",
  },
  {
    id: "LMH-02", name: "Nikita Bairwa", avatar: "/avatars/nikita.jpeg",
    role: "Sales Executive", email: "info.insurance58@gmail.com", phone: "+91 9783395483",
    joinDate: "2023-03-10", status: "Active",
    leads: 45, closedDeals: 20, revenue: 1200000, rating: 4.6,
    recentActivity: "Closed package for Dubai",
    description: "Driving sales and client acquisition.",
  },
  {
    id: "LMH-03", name: "Pushplata Kriplani", avatar: "/avatars/pushplata.png",
    role: "Executive", email: "resv@lookmyholidays.in", phone: "+91 9928795483",
    joinDate: "2022-06-25", status: "Active",
    leads: 30, closedDeals: 15, revenue: 850000, rating: 4.8,
    recentActivity: "Confirmed reservation for Manali trip",
    description: "Handles reservations and customer support.",
  },
  {
    id: "LMH-04", name: "AMAN SHARMA", avatar: "/avatars/aman.jpeg",
    role: "Accounts Manager", email: "accounts@lookmyholidays.in", phone: "+91 9660095483",
    joinDate: "2021-11-05", status: "Active",
    leads: 0, closedDeals: 0, revenue: 0, rating: 4.9,
    recentActivity: "Cleared monthly invoices",
    description: "Manages financial transactions and payroll.",
  },
  {
    id: "LMH-05", name: "Deepak Kumar", avatar: "/avatars/deepak.jpeg",
    role: "Visa Executive", email: "visa@lookmyholidays.in", phone: "+91 9636305562",
    joinDate: "2023-08-12", status: "Active",
    leads: 0, closedDeals: 0, revenue: 0, rating: 4.7,
    recentActivity: "Submitted Schengen visa files",
    description: "Specializes in international visa processing.",
  },
];

const ROLE_COLOR: Record<Role, string> = {
  "Operations Manager": "bg-primary/15 text-primary",
  "Travel Consultant": "bg-blue-100 text-blue-700",
  "Visa Executive": "bg-violet-100 text-violet-700",
  "Accounts": "bg-amber-100 text-amber-700",
  "Marketing": "bg-pink-100 text-pink-700",
  "Sales Executive": "bg-indigo-100 text-indigo-700",
  "Executive": "bg-teal-100 text-teal-700",
  "HR & Admin Manager": "bg-rose-100 text-rose-700",
  "Accounts Manager": "bg-amber-100 text-amber-700",
};

const STATUS_COLOR: Record<Status, string> = {
  Active: "bg-emerald-100 text-emerald-700",
  "On Leave": "bg-amber-100 text-amber-700",
  Inactive: "bg-slate-100 text-slate-500",
};

const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={`h-3 w-3 ${i <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-border"}`} />
      ))}
      <span className="ml-1 text-xs font-semibold">{rating.toFixed(1)}</span>
    </div>
  );
}

/* ─── HRMS Mock Constants ─── */
const DEFAULT_LEAVES = [
  { id: "LV-01", empId: "LMH-02", empName: "Nikita Bairwa", type: "Sick Leave", fromDate: "2026-06-25", toDate: "2026-06-26", reason: "Fever and high body temp", status: "Pending" },
  { id: "LV-02", empId: "LMH-03", empName: "Pushplata Kriplani", type: "Casual Leave", fromDate: "2026-07-02", toDate: "2026-07-03", reason: "Attending cousin's wedding", status: "Approved" },
  { id: "LV-03", empId: "LMH-04", empName: "AMAN SHARMA", type: "Earned Leave", fromDate: "2026-07-10", toDate: "2026-07-15", reason: "Summer vacation with family", status: "Pending" }
];

const DEFAULT_FEEDS = [
  {
    id: "feed-1",
    user: "Manvendra Singhal",
    avatar: "/avatars/manvendra.png",
    role: "HR & Admin Manager",
    content: "📣 Welcome to our new HRMS dashboard! Now you can clock in/out, view your profile details, apply for leaves, and track tasks directly inside the Employees portal.",
    date: "2026-06-19T10:00:00.000Z",
    likes: 5,
    likedBy: []
  },
  {
    id: "feed-2",
    user: "Nikita Bairwa",
    avatar: "/avatars/nikita.jpeg",
    role: "Sales Executive",
    content: "🎉 Closed a customized package for Dubai (4 Pax, 5 Nights)! Big thanks to the team for support.",
    date: "2026-06-18T14:30:00.000Z",
    likes: 8,
    likedBy: []
  },
  {
    id: "feed-3",
    user: "Deepak Kumar",
    avatar: "/avatars/deepak.jpeg",
    role: "Visa Executive",
    content: "🚀 Submitted Schengen visa files for our premium group travelers today! Fingers crossed.",
    date: "2026-06-17T09:15:00.000Z",
    likes: 4,
    likedBy: []
  }
];

const DEFAULT_FILES = [
  { id: "file-1", name: "Employee_Handbook_2026.pdf", size: "1.2 MB", date: "2026-01-10", uploader: "Manvendra Singhal" },
  { id: "file-2", name: "Travel_Expense_Guidelines.pdf", size: "840 KB", date: "2026-02-15", uploader: "Manvendra Singhal" },
  { id: "file-3", name: "Leave_Policy_Manual.pdf", size: "620 KB", date: "2026-03-01", uploader: "Manvendra Singhal" },
  { id: "file-4", name: "Company_Holidays_2026.pdf", size: "450 KB", date: "2026-01-05", uploader: "Manvendra Singhal" }
];

const DEFAULT_TIMELOGS = [
  { id: "log-1", project: "Grand Journeys Itinerary", task: "Dubai Hotel & Flight selection", hours: 4, date: "2026-06-19", employee: "Nikita Bairwa" },
  { id: "log-2", project: "Visa Processing", task: "Schengen Documents Review", hours: 3.5, date: "2026-06-19", employee: "Deepak Kumar" },
  { id: "log-3", project: "Accounts Reconciliation", task: "GST filings & payroll prep", hours: 6, date: "2026-06-19", employee: "AMAN SHARMA" }
];

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

function EmployeeTaskCard({ task, isAdmin, onToggle, onEditNote }: { task: any; isAdmin: boolean; onToggle: (id: string) => void; onEditNote: (id: string, note: string) => void }) {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [editNoteText, setEditNoteText] = useState("");

  const isOverdue = task.dueDate < new Date().toISOString().slice(0, 10);
  const isDone = task.status === "Done";

  const allNotes = [task.note, ...(task.notes || [])].filter(Boolean);

  return (
    <div className={`bg-card border border-border rounded-xl p-4 shadow-sm transition-shadow flex items-start gap-3 ${isDone ? "opacity-75 hover:opacity-100" : "hover:shadow"}`}>
      <button onClick={() => onToggle(task.id)} className={`mt-0.5 cursor-pointer transition-colors ${isDone ? "text-emerald-600" : "text-muted-foreground hover:text-primary"}`}>
        {isDone ? <CheckCircle2 className="h-5 w-5 fill-emerald-100" /> : <span className="block h-5 w-5 rounded-full border border-muted-foreground flex items-center justify-center hover:border-primary"></span>}
      </button>
      <div className="flex-1 space-y-1 min-w-0">
        <p className={`font-medium text-sm text-foreground/90 ${isDone ? "line-through text-muted-foreground" : ""}`}>{task.title}</p>

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

        {/* Note Inline Edit */}
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
              <Button size="sm" className="h-7 text-xs rounded-full px-4 text-white hover:opacity-90 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 border-0" onClick={() => { if (editNoteText.trim()) { onEditNote(task.id, editNoteText.trim()); } setIsEditingNote(false); setEditNoteText(""); }}>Add</Button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => { setEditNoteText(""); setIsEditingNote(true); }}
            className="text-[10px] text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-1.5"
          >
            <Plus className="h-3 w-3" /> Add Note
          </button>
        )}

        <div className="flex flex-wrap items-center gap-2 pt-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          <span className="bg-secondary px-2 py-0.5 rounded-md">{task.type}</span>
          {!isDone && (
            <span className={`px-2 py-0.5 rounded-md ${task.priority === "High" ? "bg-red-50 text-red-600" :
              task.priority === "Medium" ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
              }`}>{task.priority}</span>
          )}
          {isDone && <span>Completed</span>}
          {isAdmin && !isDone && <span>Assignee: {task.assignee}</span>}
          {!isDone && <span className={isOverdue ? "text-red-600" : ""}>Due: {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</span>}
        </div>
      </div>
    </div>
  );
}

function EmployeesPage() {
  const [localEmployees, setEmployees] = useLocalStorage<Employee[]>("crm_employees_v3", INITIAL_EMPLOYEES);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const employees = localEmployees?.length ? localEmployees : INITIAL_EMPLOYEES;
  const [employeesDetails, setEmployeesDetails] = useLocalStorage<Record<string, EmployeeDetails>>(
    "crm_employee_details_v3",
    INITIAL_EMPLOYEE_DETAILS
  );

  // Profile inline edit states
  const [profileIsEditing, setProfileIsEditing] = useState(false);
  const [profileEditDetails, setProfileEditDetails] = useState<EmployeeDetails | null>(null);
  const [profileEditCore, setProfileEditCore] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    status: "",
    joinDate: ""
  });

  // Helpers to update array list rows inside Profile inline tabs
  const updateProfileCareer = (index: number, field: keyof CareerItem, value: string) => {
    if (!profileEditDetails) return;
    const history = [...profileEditDetails.careerHistory];
    history[index] = { ...history[index], [field]: value };
    setProfileEditDetails({ ...profileEditDetails, careerHistory: history });
  };
  const addProfileCareer = () => {
    if (!profileEditDetails) return;
    setProfileEditDetails({
      ...profileEditDetails,
      careerHistory: [
        ...profileEditDetails.careerHistory,
        { company: "", position: "", startDate: "", endDate: "", responsibilities: "", achievement: "" }
      ]
    });
  };
  const deleteProfileCareer = (index: number) => {
    if (!profileEditDetails) return;
    setProfileEditDetails({
      ...profileEditDetails,
      careerHistory: profileEditDetails.careerHistory.filter((_, i) => i !== index)
    });
  };

  const updateProfileAcademic = (index: number, field: keyof AcademicItem, value: string) => {
    if (!profileEditDetails) return;
    const background = [...profileEditDetails.academicBackground];
    background[index] = { ...background[index], [field]: value };
    setProfileEditDetails({ ...profileEditDetails, academicBackground: background });
  };
  const addProfileAcademic = () => {
    if (!profileEditDetails) return;
    setProfileEditDetails({
      ...profileEditDetails,
      academicBackground: [
        ...profileEditDetails.academicBackground,
        { institution: "", qualification: "", specialization: "", year: "", grade: "" }
      ]
    });
  };
  const deleteProfileAcademic = (index: number) => {
    if (!profileEditDetails) return;
    setProfileEditDetails({
      ...profileEditDetails,
      academicBackground: profileEditDetails.academicBackground.filter((_, i) => i !== index)
    });
  };

  const updateProfileFamily = (index: number, field: keyof FamilyItem, value: string) => {
    if (!profileEditDetails) return;
    const info = [...profileEditDetails.familyInformation];
    info[index] = { ...info[index], [field]: value };
    setProfileEditDetails({ ...profileEditDetails, familyInformation: info });
  };
  const addProfileFamily = () => {
    if (!profileEditDetails) return;
    setProfileEditDetails({
      ...profileEditDetails,
      familyInformation: [
        ...profileEditDetails.familyInformation,
        { name: "", relationship: "", dob: "", contactNumber: "" }
      ]
    });
  };
  const deleteProfileFamily = (index: number) => {
    if (!profileEditDetails) return;
    setProfileEditDetails({
      ...profileEditDetails,
      familyInformation: profileEditDetails.familyInformation.filter((_, i) => i !== index)
    });
  };

  const [tasks, setTasks] = useLocalStorage<any[]>("crm_tasks_v1", []);

  const auth = getAuth();
  const isAdmin = auth?.role === "admin";
  const [leaves, setLeaves] = useLocalStorage<any[]>("crm_leaves_v1", DEFAULT_LEAVES);
  const [attendance, setAttendance] = useLocalStorage<any[]>("crm_attendance_v2", []);
  const [feeds, setFeeds] = useLocalStorage<any[]>("crm_feeds_v1", DEFAULT_FEEDS);
  const [timeLogs, setTimeLogs] = useLocalStorage<any[]>("crm_timelogs_v1", DEFAULT_TIMELOGS);
  const [hrFiles, setHrFiles] = useLocalStorage<any[]>("crm_hr_files_v1", DEFAULT_FILES);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const [reviews, setReviews] = useLocalStorage<any[]>("crm_reviews_v1", [
    { id: "REV-01", empId: "LMH-02", period: "Q1 2026", rating: 4.5, feedback: "Excellent sales performance, exceeded targets.", reviewer: "Manvendra Singhal", date: "2026-04-05" },
    { id: "REV-02", empId: "LMH-03", period: "Q1 2026", rating: 4.8, feedback: "Great coordination and support on tour bookings.", reviewer: "Manvendra Singhal", date: "2026-04-06" }
  ]);
  const [payroll, setPayroll] = useLocalStorage<any[]>("crm_payroll_v1", [
    { id: "PAY-01", empId: "LMH-02", month: "May 2026", salary: 35000, status: "Paid", txId: "TXN1029384", date: "2026-06-01" },
    { id: "PAY-02", empId: "LMH-03", month: "May 2026", salary: 32000, status: "Paid", txId: "TXN1029385", date: "2026-06-01" },
    { id: "PAY-03", empId: "LMH-04", month: "May 2026", salary: 45000, status: "Paid", txId: "TXN1029386", date: "2026-06-01" }
  ]);
  const [assets, setAssets] = useLocalStorage<any[]>("crm_assets_v1", [
    { id: "AST-01", empId: "LMH-02", name: "Dell Latitude 5420 Laptop", serial: "CN-0V2H3Y-1234", type: "Laptop", value: 65000, date: "2023-03-10" },
    { id: "AST-02", empId: "LMH-03", name: "HP ProBook 440 G8 Laptop", serial: "CN-0V2H3Y-5678", type: "Laptop", value: 58000, date: "2022-06-25" },
    { id: "AST-03", empId: "LMH-04", name: "MacBook Air M1", serial: "FVFCX123QY7", type: "Laptop", value: 85000, date: "2021-11-05" },
    { id: "AST-04", empId: "LMH-05", name: "Lenovo ThinkPad L14", serial: "CN-0V2H3Y-9012", type: "Laptop", value: 55000, date: "2023-08-12" }
  ]);
  const [certificates, setCertificates] = useLocalStorage<any[]>("crm_certificates_v1", [
    { id: "CRT-01", empId: "LMH-02", name: "Destination Expert - Middle East", issuer: "Tourism Board", date: "2024-05-15", url: "#" },
    { id: "CRT-02", empId: "LMH-03", name: "IATA Foundation Course", issuer: "IATA", date: "2023-11-20", url: "#" },
    { id: "CRT-03", empId: "LMH-05", name: "Visa Regulations & Compliance", issuer: "VFS Global Academy", date: "2024-02-18", url: "#" }
  ]);

  // Form states for adding new records in the details section
  const [addLeaveType, setAddLeaveType] = useState("Casual Leave");
  const [addLeaveFrom, setAddLeaveFrom] = useState("");
  const [addLeaveTo, setAddLeaveTo] = useState("");
  const [addLeaveReason, setAddLeaveReason] = useState("");

  const [addAttDate, setAddAttDate] = useState("");
  const [addAttIn, setAddAttIn] = useState("09:30");
  const [addAttOut, setAddAttOut] = useState("18:30");
  const [addAttLoc, setAddAttLoc] = useState("JTM Mall Office");

  const [addReviewPeriod, setAddReviewPeriod] = useState("");
  const [addReviewRating, setAddReviewRating] = useState("5.0");
  const [addReviewFeedback, setAddReviewFeedback] = useState("");

  const [addDocName, setAddDocName] = useState("");
  const [addDocType, setAddDocType] = useState("Resume");
  const [addDocSize, setAddDocSize] = useState("1.0 MB");

  const [addPayMonth, setAddPayMonth] = useState("");
  const [addPaySalary, setAddPaySalary] = useState("");
  const [addPayStatus, setAddPayStatus] = useState("Paid");

  const [addAssetName, setAddAssetName] = useState("");
  const [addAssetSerial, setAddAssetSerial] = useState("");
  const [addAssetType, setAddAssetType] = useState("Laptop");

  const [addCertName, setAddCertName] = useState("");
  const [addCertIssuer, setAddCertIssuer] = useState("");

  // States for interactive forms
  // 1. Leave form
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [leaveReason, setLeaveReason] = useState("");

  // 2. Attendance punch
  const [punchLocation, setPunchLocation] = useState("JTM Mall Office");
  const [punchNote, setPunchNote] = useState("");

  // 3. Feeds post
  const [feedText, setFeedText] = useState("");

  // 4. File upload
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [newFileSize, setNewFileSize] = useState("");

  // 5. Time log modal
  const [isTimeLogModalOpen, setIsTimeLogModalOpen] = useState(false);
  const [logProject, setLogProject] = useState("");
  const [logTask, setLogTask] = useState("");
  const [logHours, setLogHours] = useState("");
  const [logDate, setLogDate] = useState(new Date().toISOString().slice(0, 10));

  // 6. Task Modal (for admin to add tasks)
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskType, setTaskType] = useState("Call");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskAssignee, setTaskAssignee] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskNote, setTaskNote] = useState("");
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "All">("All");
  const allRoles: Role[] = ["Operations Manager", "Travel Consultant", "Visa Executive", "Accounts", "Marketing", "Sales Executive", "Executive", "HR & Admin Manager", "Accounts Manager"];

  const [activeTab, setActiveTab] = useState(isAdmin ? "Employees" : "Profile");
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    role: "Travel Consultant" as Role,
    status: "Active" as Status,
    description: "",
    username: "",
    password: "emp123"
  });

  // Pre-generate credentials and ID when modal is opened
  useEffect(() => {
    if (isAddOpen) {
      // Find a safe next sequential ID
      let maxNum = 5; // Default starts at 5 (LMH-05)
      employees.forEach(emp => {
        if (emp.id.startsWith("LMH-")) {
          const num = parseInt(emp.id.replace("LMH-", ""), 10);
          if (!isNaN(num) && num > maxNum) {
            maxNum = num;
          }
        }
      });
      const nextId = `LMH-${String(maxNum + 1).padStart(2, "0")}`;
      setNewEmployee({
        id: nextId,
        name: "",
        email: "",
        phone: "",
        role: "Travel Consultant" as Role,
        status: "Active" as Status,
        description: "",
        username: "",
        password: "emp123"
      });
    }
  }, [isAddOpen, employees]);

  const handleNameChange = (name: string) => {
    const parts = name.trim().toLowerCase().split(/\s+/);
    const generatedUsername = parts.length ? parts[0] : "";
    setNewEmployee(prev => ({
      ...prev,
      name,
      username: prev.username ? prev.username : generatedUsername
    }));
  };

  const filtered = employees.filter(
    (e) =>
      (roleFilter === "All" || e.role === roleFilter) &&
      (q === "" || e.name.toLowerCase().includes(q.toLowerCase()) || e.email.toLowerCase().includes(q.toLowerCase()))
  );

  const totalRevenue = employees.reduce((s, e) => s + e.revenue, 0);

  const handleDeleteEmployee = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setDeleteConfirmId(id);
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmployee.name || !newEmployee.email || !newEmployee.id || !newEmployee.username || !newEmployee.password) return;

    const employee: Employee = {
      id: newEmployee.id,
      name: newEmployee.name,
      avatar: "",
      role: newEmployee.role,
      email: newEmployee.email,
      phone: newEmployee.phone,
      joinDate: new Date().toISOString().slice(0, 10),
      status: newEmployee.status,
      leads: 0,
      closedDeals: 0,
      revenue: 0,
      rating: 0,
      recentActivity: "Newly added to the team",
      description: newEmployee.description || "No description provided.",
      username: newEmployee.username,
      password: newEmployee.password,
    } as any;

    setEmployees([employee, ...employees]);
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Employees</h1>
          <p className="mt-1 text-sm text-muted-foreground">Team directory, roles, and performance overview.</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 rounded-xl" style={{ background: "var(--gradient-brand)" }}>
              <Plus className="h-4 w-4" /> Add Employee
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Employee</DialogTitle>
              <DialogDescription>
                Enter the details of the new team member. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddEmployee} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="id">Employee ID</Label>
                  <Input
                    id="id"
                    required
                    placeholder="e.g. LMH-06"
                    value={newEmployee.id}
                    onChange={(e) => setNewEmployee({ ...newEmployee, id: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    required
                    placeholder="e.g. John Doe"
                    value={newEmployee.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="e.g. john@lmh.in"
                    value={newEmployee.email}
                    onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={newEmployee.phone}
                    onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Login Username</Label>
                  <Input
                    id="username"
                    required
                    placeholder="e.g. john"
                    value={newEmployee.username}
                    onChange={(e) => setNewEmployee({ ...newEmployee, username: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Login Password</Label>
                  <Input
                    id="password"
                    required
                    placeholder="e.g. emp123"
                    value={newEmployee.password}
                    onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <select
                    id="role"
                    value={newEmployee.role}
                    onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value as Role })}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {allRoles.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={newEmployee.status}
                    onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value as Status })}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="Active">Active</option>
                    <option value="On Leave">On Leave</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="Brief bio or description..."
                    value={newEmployee.description}
                    onChange={(e) => setNewEmployee({ ...newEmployee, description: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                <Button type="submit">Save Employee</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Zoho-style Navigation Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-border pb-px scrollbar-hide">
        {[
          "Profile", "Jobs", "Employees"
        ].filter(tab => {
          if (!isAdmin && tab === "Employees") return false;
          return true;
        }).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-4 py-2.5 text-sm font-medium transition-colors border-b-2 ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Employees" && isAdmin ? (
        <>

          {/* Top stats */}
          <div className="grid gap-4 sm:grid-cols-4">
            {[
              { label: "Total Staff", value: employees.length, icon: <UserCog className="h-4 w-4" />, color: "bg-blue-100 text-blue-600" },
              { label: "Active", value: employees.filter(e => e.status === "Active").length, icon: <UserCheck className="h-4 w-4" />, color: "bg-emerald-100 text-emerald-600" },
              { label: "Total Bookings", value: employees.reduce((s, e) => s + e.closedDeals, 0), icon: <CalendarCheck className="h-4 w-4" />, color: "bg-violet-100 text-violet-600" },
              { label: "Team Revenue", value: formatINR(totalRevenue), icon: <TrendingUp className="h-4 w-4" />, color: "bg-amber-100 text-amber-600" },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  <span className={`grid h-8 w-8 place-items-center rounded-xl ${s.color}`}>{s.icon}</span>
                </div>
                <p className="mt-3 font-display text-2xl font-bold">{s.value}</p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-card">
            <div className="relative max-w-xs flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or email..." className="pl-9 rounded-xl" />
            </div>
            <div className="flex flex-wrap gap-1.5">
              <button onClick={() => setRoleFilter("All")} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${roleFilter === "All" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>All</button>
              {allRoles.map((r) => (
                <button key={r} onClick={() => setRoleFilter(r)} className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-all ${roleFilter === r ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-secondary/80"}`}>{r}</button>
              ))}
            </div>
          </div>

          {/* Employee cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((emp) => (
              <div
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className="group relative rounded-2xl border border-border bg-card p-5 shadow-card transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                {isAdmin && (
                  <button
                    onClick={(e) => handleDeleteEmployee(e, emp.id)}
                    className="absolute right-3 top-3 rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 z-10"
                    title="Delete Employee"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
                {/* Top section */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {emp.avatar ? (
                      <img src={emp.avatar} alt={emp.name} className="h-12 w-12 rounded-2xl object-cover shrink-0" />
                    ) : (
                      <div className="h-12 w-12 rounded-2xl bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-semibold leading-tight">{emp.name}</p>
                      <p className="text-xs text-muted-foreground">{emp.id}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_COLOR[emp.status]}`}>
                    {emp.status}
                  </span>
                </div>

                {/* Role */}
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${ROLE_COLOR[emp.role]}`}>
                    <Shield className="h-3 w-3" /> {emp.role}
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                  {emp.description}
                </p>

                {/* Contact */}
                <div className="mt-3 space-y-1 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5"><Mail className="h-3 w-3" /> {emp.email}</p>
                  <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {emp.phone}</p>
                </div>

                {/* Stats (only for consultants) */}
                {emp.revenue > 0 && (
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-secondary/50 p-3">
                    <div className="text-center">
                      <p className="font-display text-lg font-bold text-primary">{emp.leads}</p>
                      <p className="text-xs text-muted-foreground">Leads</p>
                    </div>
                    <div className="text-center">
                      <p className="font-display text-lg font-bold text-primary">{emp.closedDeals}</p>
                      <p className="text-xs text-muted-foreground">Deals</p>
                    </div>
                    <div className="text-center">
                      <p className="font-display text-lg font-bold text-primary">{Math.round(emp.revenue / 100000)}L</p>
                      <p className="text-xs text-muted-foreground">Revenue</p>
                    </div>
                  </div>
                )}

                {/* Tasks */}
                {(() => {
                  const empTasks = tasks.filter(t => t.assignee === emp.name);
                  const pendingCount = empTasks.filter(t => t.status === "Pending").length;
                  return (
                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                          Tasks
                          {empTasks.length > 0 && (
                            <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded-md">
                              {pendingCount} pending / {empTasks.length} total
                            </span>
                          )}
                        </p>
                        <button
                          onClick={(e) => { e.stopPropagation(); setTaskAssignee(emp.name); setIsTaskModalOpen(true); }}
                          className="gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-md px-3 py-1.5 text-[10px] font-semibold flex items-center transition-all hover:shadow-lg hover:-translate-y-0.5"
                        >
                          <Plus className="h-3 w-3" /> Add Task
                        </button>
                      </div>
                      {empTasks.length > 0 ? (
                        <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin">
                          {empTasks.map((task: any) => {
                            const isOverdue = task.status === "Pending" && task.dueDate < new Date().toISOString().slice(0, 10);
                            const isDone = task.status === "Done";
                            return (
                              <div key={task.id} className={`text-xs bg-secondary/40 p-2.5 rounded-lg border border-border/50 transition-colors flex items-center justify-between gap-2 ${isDone ? "opacity-60 bg-secondary/10" : ""}`}>
                                <div className="min-w-0 flex-1">
                                  <p className={`font-medium truncate text-foreground/90 ${isDone ? "line-through text-muted-foreground" : ""}`} title={task.title}>{task.title}</p>
                                  <div className="flex items-center gap-2 mt-1 text-[9px] uppercase tracking-wide font-semibold text-muted-foreground">
                                    <span className="bg-background px-1.5 py-0.5 rounded-md border border-border/50">{task.type}</span>
                                    {!isDone && (
                                      <span className={isOverdue ? "text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md border border-red-100" : "text-muted-foreground"}>
                                        Due: {new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                {isDone ? (
                                  <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100 shrink-0">Done</span>
                                ) : isOverdue ? (
                                  <span className="text-[10px] font-semibold text-red-600 bg-red-50 px-1.5 py-0.5 rounded-md border border-red-100 shrink-0">Overdue</span>
                                ) : (
                                  <span className="text-[10px] font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md border border-amber-100 shrink-0">Active</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-xs text-muted-foreground italic">No tasks assigned.</p>
                      )}
                    </div>
                  );
                })()}

                {/* Rating & Activity */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-2">
                    <StarRating rating={emp.rating} />
                    <p className="text-xs text-muted-foreground">Joined {new Date(emp.joinDate).getFullYear()}</p>
                  </div>
                  <p className="text-xs text-muted-foreground italic truncate">
                    "{emp.recentActivity}"
                  </p>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-full py-8 text-center text-muted-foreground">
                No employees found matching the current filters.
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="space-y-6">
          {/* Sub-tab rendering block */}
          {activeTab === "Profile" && (() => {
            const cur = employees.find(e => e.name.toLowerCase() === auth?.name?.toLowerCase() || e.id === auth?.empId) || employees[0];
            const empDetails = employeesDetails[cur.id] || createDefaultEmployeeDetails(
              cur.id,
              cur.name,
              cur.role,
              cur.email,
              cur.phone
            );

            const handleStartEdit = () => {
              setProfileEditCore({
                name: cur.name,
                role: cur.role,
                email: cur.email,
                phone: cur.phone,
                status: cur.status,
                joinDate: cur.joinDate
              });
              setProfileEditDetails(JSON.parse(JSON.stringify(empDetails))); // deep clone
              setProfileIsEditing(true);
            };

            const handleCancelEdit = () => {
              setProfileIsEditing(false);
              setProfileEditDetails(null);
            };

            const handleSave = () => {
              if (!profileEditDetails) return;

              // 1. Save details
              const updatedDetails = {
                ...employeesDetails,
                [cur.id]: profileEditDetails
              };
              setEmployeesDetails(updatedDetails);

              // 2. Sync core
              const updatedList = employees.map((e) => {
                if (e.id === cur.id) {
                  return {
                    ...e,
                    name: profileEditCore.name,
                    role: profileEditCore.role as Role,
                    email: profileEditCore.email,
                    phone: profileEditCore.phone,
                    status: profileEditCore.status as Status,
                    joinDate: profileEditCore.joinDate,
                    description: profileEditDetails.bio
                  };
                }
                return e;
              });
              setEmployees(updatedList);

              // 3. Update auth if modifying current user
              const authStored = localStorage.getItem("crm_auth");
              if (authStored) {
                const authObj = JSON.parse(authStored);
                if (authObj.empId === cur.id || authObj.name.toLowerCase() === profileEditCore.name.toLowerCase()) {
                  authObj.name = profileEditCore.name;
                  authObj.role = profileEditCore.role;
                  authObj.email = profileEditCore.email;
                  localStorage.setItem("crm_auth", JSON.stringify(authObj));
                }
              }

              setProfileIsEditing(false);
            };

            // Calculated parameters (keep read-only)
            const mockPerf = {
              kpiScore: cur.rating ? Math.round(cur.rating * 20) : 92,
              attendancePct: 98.4,
              projectsCompleted: cur.closedDeals || 12,
              monthlyRating: cur.rating || 4.8,
              activeProjects: [
                { name: "Maldives Luxury Group Travel", status: "In Progress", deadline: "2026-06-30", progress: 75 },
                { name: "Europe Summer Itinerary Prep", status: "Planning", deadline: "2026-07-15", progress: 40 },
              ],
              activityTimeline: [
                { title: "Logged In", desc: "Clocked in from JTM Mall Office", time: "Today, 09:30 AM" },
                { title: "Task Completed", desc: "Updated Maldives package prices", time: "Yesterday, 04:15 PM" },
                { title: "Profile Updated", desc: "Modified emergency contact info", time: "18-Jun-2026" }
              ],
              documents: [
                { name: "Resume_Updated.pdf", type: "Resume", size: "1.2 MB" },
                { name: "Offer_Letter_LMH.pdf", type: "Offer Letter", size: "840 KB" },
                { name: "Aadhaar_Card_Masked.pdf", type: "ID Proof", size: "620 KB" }
              ]
            };

            return (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                {/* Top Info Banner / Profile Overview */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="flex flex-col md:flex-row items-center gap-5 w-full md:w-auto">
                    <img
                      src={cur.avatar}
                      alt={cur.name}
                      className="h-20 w-20 rounded-2xl object-cover border border-gray-200 ring-4 ring-[#FF6B00]/10 shrink-0"
                    />

                    {profileIsEditing && profileEditDetails ? (
                      <div className="space-y-3 w-full md:max-w-md">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Full Name</label>
                            <Input
                              value={profileEditCore.name}
                              onChange={(e) => setProfileEditCore({ ...profileEditCore, name: e.target.value })}
                              className="h-8 text-xs focus-visible:ring-[#FF6B00]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Job Title / Role</label>
                            <Input
                              value={profileEditCore.role}
                              onChange={(e) => setProfileEditCore({ ...profileEditCore, role: e.target.value })}
                              className="h-8 text-xs focus-visible:ring-[#FF6B00]"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="space-y-1 col-span-2">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Work Email</label>
                            <Input
                              value={profileEditCore.email}
                              onChange={(e) => setProfileEditCore({ ...profileEditCore, email: e.target.value })}
                              className="h-8 text-xs focus-visible:ring-[#FF6B00]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase">Status</label>
                            <select
                              value={profileEditCore.status}
                              onChange={(e) => setProfileEditCore({ ...profileEditCore, status: e.target.value })}
                              className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                            >
                              <option value="Active">Active</option>
                              <option value="On Leave">On Leave</option>
                              <option value="Inactive">Inactive</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center md:text-left space-y-1">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                          <h2 className="text-2xl font-bold font-display text-gray-900">{cur.name}</h2>
                          <span className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLOR[cur.status as keyof typeof STATUS_COLOR] || "bg-slate-100"}`}>
                            {cur.status}
                          </span>
                        </div>
                        <p className="text-[#FF6B00] font-semibold text-sm">{cur.role} • {empDetails.department}</p>
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                          <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {cur.email}</span>
                          <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {cur.phone}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Quick Stats inside Banner */}
                  <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl p-3.5 px-5">
                    <div className="text-center pr-4 border-r border-gray-200">
                      <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Employee ID</p>
                      <p className="text-sm font-bold text-gray-800 mt-0.5">{cur.id}</p>
                    </div>
                    <div className="text-center pl-1">
                      <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">Joining Date</p>
                      {profileIsEditing && profileEditDetails ? (
                        <input
                          type="date"
                          value={profileEditCore.joinDate}
                          onChange={(e) => setProfileEditCore({ ...profileEditCore, joinDate: e.target.value })}
                          className="text-xs bg-white border border-gray-200 rounded px-1.5 py-0.5 mt-0.5 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
                        />
                      ) : (
                        <p className="text-sm font-bold text-gray-800 mt-0.5">
                          {new Date(cur.joinDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {/* LEFT COLUMN */}
                  <div className="space-y-6 md:col-span-1">

                    {/* Quick Actions Card */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                      <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2">
                        {profileIsEditing ? "Actions" : "Quick Actions"}
                      </h3>
                      {profileIsEditing ? (
                        <div className="space-y-2.5 pt-1">
                          <Button
                            onClick={handleSave}
                            className="w-full justify-center gap-2 text-xs h-9 bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
                          >
                            <Check className="h-4 w-4" /> Save Details
                          </Button>
                          <Button
                            variant="outline"
                            onClick={handleCancelEdit}
                            className="w-full justify-center gap-2 text-xs h-9 hover:bg-slate-100 transition-colors"
                          >
                            <X className="h-4 w-4" /> Cancel Edit
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2.5 pt-1">
                          <Button
                            variant="outline"
                            onClick={handleStartEdit}
                            className="w-full justify-start gap-2 text-xs h-9 hover:text-[#FF6B00] hover:bg-orange-50/50 hover:border-[#FF6B00]/40 transition-colors"
                          >
                            <Edit className="h-4 w-4" /> Edit Profile Details
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setTaskAssignee(cur.name);
                              setIsTaskModalOpen(true);
                            }}
                            className="w-full justify-start gap-2 text-xs h-9 hover:text-[#FF6B00] hover:bg-orange-50/50 hover:border-[#FF6B00]/40 transition-colors"
                          >
                            <Plus className="h-4 w-4" /> Assign Task
                          </Button>

                          <Button
                            variant="outline"
                            onClick={() => {
                              const printWindow = window.open('', '_blank');
                              if (printWindow) {
                                printWindow.document.write(`
                                  <html>
                                    <head>
                                      <title>Employee Profile - ${cur.name}</title>
                                      <style>
                                        body { font-family: sans-serif; padding: 40px; color: #333; }
                                        h1 { color: #FF6B00; margin-bottom: 5px; }
                                        .subtitle { color: #666; margin-bottom: 30px; font-weight: bold; }
                                        .section { margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px; }
                                        .section-title { font-size: 18px; color: #FF6B00; margin-bottom: 10px; }
                                        .grid { display: grid; grid-template-cols: 1fr 1fr; gap: 15px; }
                                        .field { margin-bottom: 8px; }
                                        .label { font-size: 11px; text-transform: uppercase; color: #888; font-weight: bold; }
                                        .value { font-size: 14px; font-weight: 500; margin-top: 2px; }
                                      </style>
                                    </head>
                                    <body>
                                      <h1>${cur.name}</h1>
                                      <div class="subtitle">${cur.role} • ${empDetails.department} (${cur.id})</div>
                                      
                                      <div class="section">
                                        <div class="section-title">Employment Details</div>
                                        <div class="grid">
                                          <div class="field"><div class="label">Designation</div><div class="value">${empDetails.designation}</div></div>
                                          <div class="field"><div class="label">Employment Type</div><div class="value">${empDetails.employmentType}</div></div>
                                          <div class="field"><div class="label">Work Location</div><div class="value">${empDetails.workLocation}</div></div>
                                          <div class="field"><div class="label">Reporting Manager</div><div class="value">${empDetails.manager}</div></div>
                                        </div>
                                      </div>

                                      <div class="section">
                                        <div class="section-title">Contact Information</div>
                                        <div class="grid">
                                          <div class="field"><div class="label">Work Phone</div><div class="value">${cur.phone}</div></div>
                                          <div class="field"><div class="label">Personal Phone</div><div class="value">${empDetails.personalPhone}</div></div>
                                          <div class="field"><div class="label">Work Email</div><div class="value">${cur.email}</div></div>
                                          <div class="field"><div class="label">Personal Email</div><div class="value">${empDetails.personalEmail}</div></div>
                                        </div>
                                      </div>
                                      
                                      <script>
                                        window.onload = function() {
                                          window.print();
                                          window.close();
                                        };
                                      </script>
                                    </body>
                                  </html>
                                `);
                                printWindow.document.close();
                              }
                            }}
                            className="w-full justify-start gap-2 text-xs h-9 hover:text-[#FF6B00] hover:bg-orange-50/50 hover:border-[#FF6B00]/40 transition-colors"
                          >
                            <Download className="h-4 w-4" /> Download Profile
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              window.location.href = `mailto:${cur.email}?subject=Regarding CRM Employee Profile`;
                            }}
                            className="w-full justify-start gap-2 text-xs h-9 hover:text-[#FF6B00] hover:bg-orange-50/50 hover:border-[#FF6B00]/40 transition-colors"
                          >
                            <Send className="h-4 w-4" /> Send Email
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Reporting Structure */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                      <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2">Reporting Structure</h3>
                      {profileIsEditing && profileEditDetails ? (
                        <div className="space-y-3">
                          <EditField
                            label="Reporting Manager"
                            value={profileEditDetails.reportingManager}
                            onChange={(v) => setProfileEditDetails({ ...profileEditDetails, reportingManager: v })}
                          />
                          <EditField
                            label="Team Lead"
                            value={profileEditDetails.teamLead}
                            onChange={(v) => setProfileEditDetails({ ...profileEditDetails, teamLead: v })}
                          />
                          <EditField
                            label="Direct Reports (Comma-separated)"
                            value={profileEditDetails.directReports.join(", ")}
                            onChange={(v) => setProfileEditDetails({
                              ...profileEditDetails,
                              directReports: v.split(",").map(item => item.trim()).filter(Boolean)
                            })}
                          />
                        </div>
                      ) : (
                        <div className="space-y-3.5 text-sm">
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground font-medium">Reporting Manager</p>
                            <p className="font-semibold text-gray-800">{empDetails.reportingManager}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground font-medium">Team Lead</p>
                            <p className="font-semibold text-gray-800">{empDetails.teamLead}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-xs text-muted-foreground font-medium">Direct Reports</p>
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {empDetails.directReports.map((r, i) => (
                                <span key={i} className="text-xs bg-gray-100 font-semibold px-2 py-0.5 rounded-md text-gray-700">
                                  {r}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Verification Details */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                      <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2">Verification Details</h3>
                      {profileIsEditing && profileEditDetails ? (
                        <div className="space-y-3">
                          <EditField
                            label="PAN Number"
                            value={profileEditDetails.panNumber}
                            onChange={(v) => setProfileEditDetails({ ...profileEditDetails, panNumber: v })}
                          />
                          <EditField
                            label="Aadhaar Number"
                            value={profileEditDetails.aadhaarNumber}
                            onChange={(v) => setProfileEditDetails({ ...profileEditDetails, aadhaarNumber: v })}
                          />
                          <EditField
                            label="Passport Number"
                            value={profileEditDetails.passportNumber}
                            onChange={(v) => setProfileEditDetails({ ...profileEditDetails, passportNumber: v })}
                          />
                          <EditSelect
                            label="Verification Status"
                            value={profileEditDetails.verificationStatus}
                            options={["Verified", "Pending", "Unverified"]}
                            onChange={(v) => setProfileEditDetails({ ...profileEditDetails, verificationStatus: v })}
                          />
                        </div>
                      ) : (
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                            <span className="text-muted-foreground text-xs font-medium">Employee Code</span>
                            <span className="font-semibold text-gray-800">{cur.id}</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                            <span className="text-muted-foreground text-xs font-medium">PAN Number</span>
                            <span className="font-semibold text-gray-800 tracking-wider">{empDetails.panNumber}</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                            <span className="text-muted-foreground text-xs font-medium">Aadhaar Number</span>
                            <span className="font-semibold text-gray-800">{empDetails.aadhaarNumber}</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                            <span className="text-muted-foreground text-xs font-medium">Passport Number</span>
                            <span className="font-semibold text-gray-800">{empDetails.passportNumber}</span>
                          </div>
                          <div className="flex justify-between items-center py-1.5 pt-1.5">
                            <span className="text-muted-foreground text-xs font-medium">Verification Status</span>
                            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${empDetails.verificationStatus === "Verified" ? "text-emerald-600 bg-emerald-50 border-emerald-200" : "text-amber-600 bg-amber-50 border-amber-200"
                              }`}>
                              <CheckCircle className="h-3 w-3" /> {empDetails.verificationStatus}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Documents Center */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                      <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2">Documents Center</h3>
                      <div className="space-y-2 pt-1">
                        {mockPerf.documents.map((doc, i) => (
                          <div key={i} className="flex items-center justify-between p-2 border border-gray-100 bg-gray-50/50 hover:bg-orange-50/20 rounded-xl transition-colors text-xs">
                            <div className="flex items-center gap-2 truncate">
                              <FileText className="h-4 w-4 text-orange-500 shrink-0" />
                              <div className="truncate">
                                <p className="font-semibold text-gray-800 truncate" title={doc.name}>{doc.name}</p>
                                <p className="text-[10px] text-muted-foreground">{doc.type} • {doc.size}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => alert(`Downloading ${doc.name}...`)}
                              className="p-1.5 rounded-lg border border-gray-200 text-muted-foreground hover:text-[#FF6B00] hover:bg-white hover:border-[#FF6B00]/40 transition-colors cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="space-y-6 md:col-span-2">

                    {/* Performance Summary */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                      <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2">Performance Summary</h3>
                      <div className="grid gap-4 sm:grid-cols-4 pt-1">
                        {[
                          { label: "KPI Score", value: `${mockPerf.kpiScore}%`, icon: <Award className="h-4 w-4" />, color: "bg-orange-50 text-[#FF6B00] border-orange-100" },
                          { label: "Attendance %", value: `${mockPerf.attendancePct}%`, icon: <Clock className="h-4 w-4" />, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
                          { label: "Projects Completed", value: mockPerf.projectsCompleted, icon: <CheckCircle className="h-4 w-4" />, color: "bg-blue-50 text-blue-600 border-blue-100" },
                          { label: "Monthly Rating", value: `${mockPerf.monthlyRating} / 5`, icon: <TrendingUp className="h-4 w-4" />, color: "bg-purple-50 text-purple-600 border-purple-100" },
                        ].map((stat) => (
                          <div key={stat.label} className={`rounded-xl border p-4 text-center ${stat.color} flex flex-col items-center justify-center`}>
                            <span className="p-1.5 bg-white/80 rounded-lg shadow-sm border border-inherit mb-2 shrink-0">{stat.icon}</span>
                            <p className="text-xl font-bold">{stat.value}</p>
                            <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-1.5">{stat.label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Active Projects */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                      <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2">Active Projects</h3>
                      <div className="space-y-4 pt-1">
                        {mockPerf.activeProjects.map((p, i) => (
                          <div key={i} className="space-y-2 border border-gray-100 rounded-xl p-3.5 bg-gray-50/50">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-semibold text-sm text-gray-800">{p.name}</p>
                                <p className="text-[11px] text-muted-foreground">Deadline: {new Date(p.deadline).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                              </div>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${p.status === "In Progress" ? "bg-orange-50 border-orange-200 text-[#FF6B00]" : "bg-blue-50 border-blue-200 text-blue-600"
                                }`}>{p.status}</span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex justify-between text-[10px] font-semibold">
                                <span className="text-muted-foreground">Progress</span>
                                <span className="text-gray-700">{p.progress}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-[#FF6B00] rounded-full transition-all duration-500"
                                  style={{ width: `${p.progress}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Employment Details */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                      <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2">Employment Details</h3>
                      {profileIsEditing && profileEditDetails ? (
                        <div className="grid gap-4 sm:grid-cols-2 text-xs">
                          <div className="space-y-2.5">
                            <EditField
                              label="Department"
                              value={profileEditDetails.department}
                              onChange={(v) => setProfileEditDetails({ ...profileEditDetails, department: v })}
                            />
                            <EditField
                              label="Designation"
                              value={profileEditDetails.designation}
                              onChange={(v) => setProfileEditDetails({ ...profileEditDetails, designation: v })}
                            />
                            <EditSelect
                              label="Employment Type"
                              value={profileEditDetails.employmentType}
                              options={["Permanent", "Contract", "Intern", "Part-time"]}
                              onChange={(v) => setProfileEditDetails({ ...profileEditDetails, employmentType: v })}
                            />
                            <EditField
                              label="Work Location"
                              value={profileEditDetails.workLocation}
                              onChange={(v) => setProfileEditDetails({ ...profileEditDetails, workLocation: v })}
                            />
                            <EditField
                              label="Reporting Manager"
                              value={profileEditDetails.manager}
                              onChange={(v) => setProfileEditDetails({ ...profileEditDetails, manager: v })}
                            />
                          </div>
                          <div className="space-y-2.5">
                            <EditField
                              label="Assigned Team"
                              value={profileEditDetails.team}
                              onChange={(v) => setProfileEditDetails({ ...profileEditDetails, team: v })}
                            />
                            <EditField
                              label="Total Experience"
                              value={profileEditDetails.experience}
                              onChange={(v) => setProfileEditDetails({ ...profileEditDetails, experience: v })}
                            />
                            <EditField
                              label="Employee Level"
                              value={profileEditDetails.level}
                              onChange={(v) => setProfileEditDetails({ ...profileEditDetails, level: v })}
                            />
                            <EditField
                              label="Skills (Comma-separated)"
                              value={profileEditDetails.skills.join(", ")}
                              onChange={(v) => setProfileEditDetails({
                                ...profileEditDetails,
                                skills: v.split(",").map(s => s.trim()).filter(Boolean)
                              })}
                            />
                            <EditField
                              label="Certifications (Comma-separated)"
                              value={profileEditDetails.certifications.join(", ")}
                              onChange={(v) => setProfileEditDetails({
                                ...profileEditDetails,
                                certifications: v.split(",").map(c => c.trim()).filter(Boolean)
                              })}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid gap-4 sm:grid-cols-2 text-sm">
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100"><span className="text-muted-foreground text-xs font-medium">Department</span><span className="col-span-2 font-semibold text-gray-800">{empDetails.department}</span></div>
                            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100"><span className="text-muted-foreground text-xs font-medium">Designation</span><span className="col-span-2 font-semibold text-gray-800">{empDetails.designation}</span></div>
                            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100"><span className="text-muted-foreground text-xs font-medium">Employment Type</span><span className="col-span-2 font-semibold text-gray-800">{empDetails.employmentType}</span></div>
                            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100"><span className="text-muted-foreground text-xs font-medium">Work Location</span><span className="col-span-2 font-semibold text-gray-800">{empDetails.workLocation}</span></div>
                            <div className="grid grid-cols-3 gap-2 py-1.5"><span className="text-muted-foreground text-xs font-medium">Reporting Manager</span><span className="col-span-2 font-semibold text-gray-800">{empDetails.manager}</span></div>
                          </div>

                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100"><span className="text-muted-foreground text-xs font-medium">Assigned Team</span><span className="col-span-2 font-semibold text-gray-800">{empDetails.team}</span></div>
                            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100"><span className="text-muted-foreground text-xs font-medium">Total Experience</span><span className="col-span-2 font-semibold text-gray-800">{empDetails.experience}</span></div>
                            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100"><span className="text-muted-foreground text-xs font-medium">Employee Level</span><span className="col-span-2 font-semibold text-gray-800">{empDetails.level}</span></div>

                            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                              <span className="text-muted-foreground text-xs font-medium">Skills</span>
                              <div className="col-span-2 flex flex-wrap gap-1">
                                {empDetails.skills.map((s, i) => (
                                  <span key={i} className="text-[10px] font-bold bg-orange-50 text-[#FF6B00] border border-orange-100 px-1.5 py-0.5 rounded">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 py-1.5">
                              <span className="text-muted-foreground text-xs font-medium">Certifications</span>
                              <div className="col-span-2 flex flex-wrap gap-1">
                                {empDetails.certifications.map((c, i) => (
                                  <span key={i} className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded">
                                    {c}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Personal Profile */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                      <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2">Personal Profile</h3>
                      {profileIsEditing && profileEditDetails ? (
                        <div className="grid gap-4 sm:grid-cols-2 text-xs">
                          <div className="space-y-2.5">
                            <EditField
                              label="Date of Birth"
                              value={profileEditDetails.dob}
                              onChange={(v) => setProfileEditDetails({ ...profileEditDetails, dob: v })}
                            />
                            <EditSelect
                              label="Gender"
                              value={profileEditDetails.gender}
                              options={["Female", "Male", "Other"]}
                              onChange={(v) => setProfileEditDetails({ ...profileEditDetails, gender: v })}
                            />
                            <EditField
                              label="Nationality"
                              value={profileEditDetails.nationality}
                              onChange={(v) => setProfileEditDetails({ ...profileEditDetails, nationality: v })}
                            />
                          </div>
                          <div className="space-y-2.5">
                            <EditSelect
                              label="Marital Status"
                              value={profileEditDetails.maritalStatus}
                              options={["Single", "Married", "Divorced", "Widowed"]}
                              onChange={(v) => setProfileEditDetails({ ...profileEditDetails, maritalStatus: v })}
                            />
                            <EditField
                              label="Languages (Comma-separated)"
                              value={profileEditDetails.languages.join(", ")}
                              onChange={(v) => setProfileEditDetails({
                                ...profileEditDetails,
                                languages: v.split(",").map(l => l.trim()).filter(Boolean)
                              })}
                            />
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">About / Bio</label>
                              <textarea
                                value={profileEditDetails.bio || ""}
                                onChange={(e) => setProfileEditDetails({ ...profileEditDetails, bio: e.target.value })}
                                className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="grid gap-4 sm:grid-cols-2 text-sm">
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100"><span className="text-muted-foreground text-xs font-medium">Date of Birth</span><span className="col-span-2 font-semibold text-gray-800">{new Date(empDetails.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
                            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100"><span className="text-muted-foreground text-xs font-medium">Gender</span><span className="col-span-2 font-semibold text-gray-800">{empDetails.gender}</span></div>
                            <div className="grid grid-cols-3 gap-2 py-1.5"><span className="text-muted-foreground text-xs font-medium">Nationality</span><span className="col-span-2 font-semibold text-gray-800">{empDetails.nationality}</span></div>
                          </div>
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100"><span className="text-muted-foreground text-xs font-medium">Marital Status</span><span className="col-span-2 font-semibold text-gray-800">{empDetails.maritalStatus}</span></div>
                            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                              <span className="text-muted-foreground text-xs font-medium">Languages</span>
                              <span className="col-span-2 font-semibold text-gray-800">{empDetails.languages.join(", ")}</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 py-1.5"><span className="text-muted-foreground text-xs font-medium">About / Bio</span><span className="col-span-2 text-gray-700 leading-relaxed font-medium">{cur.description || "Active system user."}</span></div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Contact Information */}
                    <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                      <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2">Contact Information</h3>
                      {profileIsEditing && profileEditDetails ? (
                        <div className="grid gap-4 sm:grid-cols-2 text-xs">
                          <div className="space-y-2.5">
                            <EditField
                              label="Work Phone"
                              value={profileEditCore.phone}
                              onChange={(v) => setProfileEditCore({ ...profileEditCore, phone: v })}
                            />
                            <EditField
                              label="Personal Phone"
                              value={profileEditDetails.personalPhone}
                              onChange={(v) => setProfileEditDetails({ ...profileEditDetails, personalPhone: v })}
                            />
                            <EditField
                              label="Work Email"
                              value={profileEditCore.email}
                              onChange={(v) => setProfileEditCore({ ...profileEditCore, email: v })}
                            />
                            <EditField
                              label="Personal Email"
                              value={profileEditDetails.personalEmail}
                              onChange={(v) => setProfileEditDetails({ ...profileEditDetails, personalEmail: v })}
                            />
                          </div>
                          <div className="space-y-2.5">
                            <EditField
                              label="Current Address"
                              value={profileEditDetails.currentAddress}
                              onChange={(v) => setProfileEditDetails({ ...profileEditDetails, currentAddress: v })}
                            />
                            <EditField
                              label="Permanent Address"
                              value={profileEditDetails.permanentAddress}
                              onChange={(v) => setProfileEditDetails({ ...profileEditDetails, permanentAddress: v })}
                            />
                            <EditField
                              label="Emergency Contact"
                              value={profileEditDetails.emergencyContact}
                              onChange={(v) => setProfileEditDetails({ ...profileEditDetails, emergencyContact: v })}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="grid gap-4 sm:grid-cols-2 text-sm">
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100"><span className="text-muted-foreground text-xs font-medium">Work Phone</span><span className="col-span-2 font-semibold text-gray-800">{cur.phone}</span></div>
                            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100"><span className="text-muted-foreground text-xs font-medium">Personal Phone</span><span className="col-span-2 font-semibold text-gray-800">{empDetails.personalPhone}</span></div>
                            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100"><span className="text-muted-foreground text-xs font-medium">Work Email</span><span className="col-span-2 font-semibold text-gray-800">{cur.email}</span></div>
                            <div className="grid grid-cols-3 gap-2 py-1.5"><span className="text-muted-foreground text-xs font-medium">Personal Email</span><span className="col-span-2 font-semibold text-gray-800">{empDetails.personalEmail}</span></div>
                          </div>
                          <div className="space-y-2">
                            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100"><span className="text-muted-foreground text-xs font-medium">Current Address</span><span className="col-span-2 text-xs font-medium text-gray-800 leading-relaxed">{empDetails.currentAddress}</span></div>
                            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100"><span className="text-muted-foreground text-xs font-medium">Permanent Address</span><span className="col-span-2 text-xs font-medium text-gray-800 leading-relaxed">{empDetails.permanentAddress}</span></div>
                            <div className="grid grid-cols-3 gap-2 py-1.5"><span className="text-muted-foreground text-xs font-medium">Emergency Contact</span><span className="col-span-2 font-semibold text-gray-800 text-xs">{empDetails.emergencyContact}</span></div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>

                {/* FULL WIDTH BOTTOM SECTIONS */}
                <div className="space-y-6">

                  {/* Career History */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2">Career History</h3>
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-orange-50/50 text-[#FF6B00] text-xs font-bold border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3">Company</th>
                            <th className="px-4 py-3">Position</th>
                            <th className="px-4 py-3">Start Date</th>
                            <th className="px-4 py-3">End Date</th>
                            <th className="px-4 py-3">Responsibilities</th>
                            <th className="px-4 py-3">Achievement</th>
                            {profileIsEditing && <th className="px-4 py-3 text-right">Actions</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700 bg-white">
                          {profileIsEditing && profileEditDetails ? (
                            profileEditDetails.careerHistory.map((h, i) => (
                              <tr key={i} className="hover:bg-orange-50/10 transition-colors">
                                <td className="px-2 py-1.5"><Input className="h-7 text-xs" value={h.company} onChange={(e) => updateProfileCareer(i, "company", e.target.value)} /></td>
                                <td className="px-2 py-1.5"><Input className="h-7 text-xs" value={h.position} onChange={(e) => updateProfileCareer(i, "position", e.target.value)} /></td>
                                <td className="px-2 py-1.5"><Input className="h-7 text-xs" type="date" value={h.startDate} onChange={(e) => updateProfileCareer(i, "startDate", e.target.value)} /></td>
                                <td className="px-2 py-1.5"><Input className="h-7 text-xs" type="date" value={h.endDate} onChange={(e) => updateProfileCareer(i, "endDate", e.target.value)} /></td>
                                <td className="px-2 py-1.5"><Input className="h-7 text-xs" value={h.responsibilities} onChange={(e) => updateProfileCareer(i, "responsibilities", e.target.value)} /></td>
                                <td className="px-2 py-1.5"><Input className="h-7 text-xs" value={h.achievement} onChange={(e) => updateProfileCareer(i, "achievement", e.target.value)} /></td>
                                <td className="px-2 py-1.5 text-right">
                                  <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => deleteProfileCareer(i)}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            empDetails.careerHistory.length === 0 ? (
                              <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-xs text-muted-foreground">No career history records logged.</td>
                              </tr>
                            ) : (
                              empDetails.careerHistory.map((h, i) => (
                                <tr key={i} className="hover:bg-orange-50/10 transition-colors">
                                  <td className="px-4 py-3.5 font-semibold text-gray-800">{h.company}</td>
                                  <td className="px-4 py-3.5 text-xs">{h.position}</td>
                                  <td className="px-4 py-3.5 text-xs text-muted-foreground">
                                    {h.startDate ? new Date(h.startDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "N/A"}
                                  </td>
                                  <td className="px-4 py-3.5 text-xs text-muted-foreground">
                                    {h.endDate ? new Date(h.endDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : "Present"}
                                  </td>
                                  <td className="px-4 py-3.5 text-xs max-w-xs truncate" title={h.responsibilities}>{h.responsibilities}</td>
                                  <td className="px-4 py-3.5 text-xs font-medium text-emerald-700">{h.achievement}</td>
                                </tr>
                              ))
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                    {profileIsEditing && (
                      <div className="pt-2 text-right">
                        <Button variant="outline" size="sm" className="text-[#FF6B00] border-[#FF6B00]/30 hover:bg-orange-50 text-xs" onClick={addProfileCareer}>
                          <Plus className="h-3 w-3 mr-1" /> Add Experience Row
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Academic Background */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2">Academic Background</h3>
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-orange-50/50 text-[#FF6B00] text-xs font-bold border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3">Institution</th>
                            <th className="px-4 py-3">Qualification</th>
                            <th className="px-4 py-3">Specialization</th>
                            <th className="px-4 py-3">Year</th>
                            <th className="px-4 py-3">Grade</th>
                            {profileIsEditing && <th className="px-4 py-3 text-right">Actions</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700 bg-white">
                          {profileIsEditing && profileEditDetails ? (
                            profileEditDetails.academicBackground.map((a, i) => (
                              <tr key={i} className="hover:bg-orange-50/10 transition-colors">
                                <td className="px-2 py-1.5"><Input className="h-7 text-xs" value={a.institution} onChange={(e) => updateProfileAcademic(i, "institution", e.target.value)} /></td>
                                <td className="px-2 py-1.5"><Input className="h-7 text-xs" value={a.qualification} onChange={(e) => updateProfileAcademic(i, "qualification", e.target.value)} /></td>
                                <td className="px-2 py-1.5"><Input className="h-7 text-xs" value={a.specialization} onChange={(e) => updateProfileAcademic(i, "specialization", e.target.value)} /></td>
                                <td className="px-2 py-1.5"><Input className="h-7 text-xs" value={a.year} onChange={(e) => updateProfileAcademic(i, "year", e.target.value)} /></td>
                                <td className="px-2 py-1.5"><Input className="h-7 text-xs" value={a.grade} onChange={(e) => updateProfileAcademic(i, "grade", e.target.value)} /></td>
                                <td className="px-2 py-1.5 text-right">
                                  <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => deleteProfileAcademic(i)}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            empDetails.academicBackground.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-xs text-muted-foreground">No academic records logged.</td>
                              </tr>
                            ) : (
                              empDetails.academicBackground.map((a, i) => (
                                <tr key={i} className="hover:bg-orange-50/10 transition-colors">
                                  <td className="px-4 py-3.5 font-semibold text-gray-800">{a.institution}</td>
                                  <td className="px-4 py-3.5 text-xs">{a.qualification}</td>
                                  <td className="px-4 py-3.5 text-xs text-muted-foreground">{a.specialization}</td>
                                  <td className="px-4 py-3.5 text-xs text-muted-foreground">{a.year}</td>
                                  <td className="px-4 py-3.5 text-xs font-semibold text-gray-800">{a.grade}</td>
                                </tr>
                              ))
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                    {profileIsEditing && (
                      <div className="pt-2 text-right">
                        <Button variant="outline" size="sm" className="text-[#FF6B00] border-[#FF6B00]/30 hover:bg-orange-50 text-xs" onClick={addProfileAcademic}>
                          <Plus className="h-3 w-3 mr-1" /> Add Qualification Row
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Family Information */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2">Family Information</h3>
                    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-orange-50/50 text-[#FF6B00] text-xs font-bold border-b border-gray-200">
                          <tr>
                            <th className="px-4 py-3">Name</th>
                            <th className="px-4 py-3">Relationship</th>
                            <th className="px-4 py-3">Date of Birth</th>
                            <th className="px-4 py-3">Contact Number</th>
                            {profileIsEditing && <th className="px-4 py-3 text-right">Actions</th>}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700 bg-white">
                          {profileIsEditing && profileEditDetails ? (
                            profileEditDetails.familyInformation.map((f, i) => (
                              <tr key={i} className="hover:bg-orange-50/10 transition-colors">
                                <td className="px-2 py-1.5"><Input className="h-7 text-xs" value={f.name} onChange={(e) => updateProfileFamily(i, "name", e.target.value)} /></td>
                                <td className="px-2 py-1.5"><Input className="h-7 text-xs" value={f.relationship} onChange={(e) => updateProfileFamily(i, "relationship", e.target.value)} /></td>
                                <td className="px-2 py-1.5"><Input className="h-7 text-xs" type="date" value={f.dob} onChange={(e) => updateProfileFamily(i, "dob", e.target.value)} /></td>
                                <td className="px-2 py-1.5"><Input className="h-7 text-xs" value={f.contactNumber} onChange={(e) => updateProfileFamily(i, "contactNumber", e.target.value)} /></td>
                                <td className="px-2 py-1.5 text-right">
                                  <Button size="icon" variant="ghost" className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => deleteProfileFamily(i)}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            empDetails.familyInformation.length === 0 ? (
                              <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-xs text-muted-foreground">No dependent records logged.</td>
                              </tr>
                            ) : (
                              empDetails.familyInformation.map((f, i) => (
                                <tr key={i} className="hover:bg-orange-50/10 transition-colors">
                                  <td className="px-4 py-3.5 font-semibold text-gray-800">{f.name}</td>
                                  <td className="px-4 py-3.5 text-xs text-muted-foreground">{f.relationship}</td>
                                  <td className="px-4 py-3.5 text-xs text-muted-foreground">
                                    {f.dob ? new Date(f.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : "N/A"}
                                  </td>
                                  <td className="px-4 py-3.5 text-xs text-gray-800 font-medium">{f.contactNumber}</td>
                                </tr>
                              ))
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                    {profileIsEditing && (
                      <div className="pt-2 text-right">
                        <Button variant="outline" size="sm" className="text-[#FF6B00] border-[#FF6B00]/30 hover:bg-orange-50 text-xs" onClick={addProfileFamily}>
                          <Plus className="h-3 w-3 mr-1" /> Add Dependent Row
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Employee Records (Accordion-style) */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2">Employee Records</h3>
                    <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 overflow-hidden bg-white">
                      {[
                        "Leave Requests", "Attendance History", "Performance Reviews",
                        "Documents", "Payroll Records", "Company Assets", "Training Certificates"
                      ].map((rec) => {
                        const isExpanded = expandedSection === rec;
                        return (
                          <div key={rec} className="border-b last:border-b-0 border-gray-100">
                            <div
                              onClick={() => setExpandedSection(isExpanded ? null : rec)}
                              className="flex items-center justify-between px-4 py-3.5 hover:bg-orange-50/20 cursor-pointer group transition-colors"
                            >
                              <span className="font-semibold text-sm text-gray-700 group-hover:text-[#FF6B00] transition-colors">{rec}</span>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                {isExpanded ? <ChevronUp className="h-4 w-4 text-[#FF6B00]" /> : <ChevronDown className="h-4 w-4" />}
                              </div>
                            </div>

                            {isExpanded && (
                              <div className="bg-gray-50/50 p-4 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-1 duration-150">
                                {/* LEAVE REQUESTS */}
                                {rec === "Leave Requests" && (() => {
                                  const empLeaves = leaves.filter(l => l.empId === cur.id);
                                  return (
                                    <div className="space-y-3">
                                      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
                                        <table className="w-full text-left text-xs">
                                          <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                            <tr>
                                              <th className="p-2.5">Type</th>
                                              <th className="p-2.5">Dates</th>
                                              <th className="p-2.5">Reason</th>
                                              <th className="p-2.5">Status</th>
                                              <th className="p-2.5 text-right">Action</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                            {empLeaves.map(l => (
                                              <tr key={l.id} className="hover:bg-gray-50">
                                                <td className="p-2.5 font-medium">{l.type}</td>
                                                <td className="p-2.5 text-muted-foreground">{l.fromDate} to {l.toDate}</td>
                                                <td className="p-2.5 text-muted-foreground max-w-[150px] truncate" title={l.reason}>{l.reason}</td>
                                                <td className="p-2.5">
                                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${l.status === "Approved" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" :
                                                    l.status === "Rejected" ? "bg-red-50 text-red-700 border border-red-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                                                    }`}>{l.status}</span>
                                                </td>
                                                <td className="p-2.5 text-right">
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => setLeaves(leaves.filter(item => item.id !== l.id))}
                                                  >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                  </Button>
                                                </td>
                                              </tr>
                                            ))}
                                            {empLeaves.length === 0 && (
                                              <tr>
                                                <td colSpan={5} className="p-4 text-center text-muted-foreground">No leave records.</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>

                                      {/* Add Form */}
                                      <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5">
                                        <p className="text-xs font-bold text-gray-800">Apply / Log Leave</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                          <select
                                            value={addLeaveType}
                                            onChange={(e) => setAddLeaveType(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs focus:ring-1 focus:ring-[#FF6B00] outline-none"
                                          >
                                            <option>Sick Leave</option>
                                            <option>Casual Leave</option>
                                            <option>Earned Leave</option>
                                          </select>
                                          <input
                                            type="date"
                                            value={addLeaveFrom}
                                            onChange={(e) => setAddLeaveFrom(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          />
                                          <input
                                            type="date"
                                            value={addLeaveTo}
                                            onChange={(e) => setAddLeaveTo(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          />
                                          <input
                                            type="text"
                                            placeholder="Reason"
                                            value={addLeaveReason}
                                            onChange={(e) => setAddLeaveReason(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none col-span-1 md:col-span-1"
                                          />
                                        </div>
                                        <div className="text-right">
                                          <Button
                                            onClick={() => {
                                              if (!addLeaveFrom || !addLeaveTo || !addLeaveReason) return alert("Please fill dates and reason");
                                              const newL = {
                                                id: `LV-${Date.now()}`,
                                                empId: cur.id,
                                                empName: cur.name,
                                                type: addLeaveType,
                                                fromDate: addLeaveFrom,
                                                toDate: addLeaveTo,
                                                reason: addLeaveReason,
                                                status: "Pending"
                                              };
                                              setLeaves([...leaves, newL]);
                                              setAddLeaveFrom("");
                                              setAddLeaveTo("");
                                              setAddLeaveReason("");
                                            }}
                                            className="h-7 text-[11px] px-3 bg-[#FF6B00] text-white hover:bg-[#E05E00]"
                                          >
                                            Apply Leave
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}

                                {/* ATTENDANCE HISTORY */}
                                {rec === "Attendance History" && (() => {
                                  const empAtt = attendance.filter(a => a.empId === cur.id);
                                  return (
                                    <div className="space-y-3">
                                      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
                                        <table className="w-full text-left text-xs">
                                          <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                            <tr>
                                              <th className="p-2.5">Date</th>
                                              <th className="p-2.5">Clock In</th>
                                              <th className="p-2.5">Clock Out</th>
                                              <th className="p-2.5">Location</th>
                                              <th className="p-2.5">Status</th>
                                              <th className="p-2.5 text-right">Action</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                            {empAtt.map(a => (
                                              <tr key={a.id} className="hover:bg-gray-50">
                                                <td className="p-2.5 font-medium">{a.date}</td>
                                                <td className="p-2.5 text-emerald-600 font-semibold">{a.clockIn || "--"}</td>
                                                <td className="p-2.5 text-amber-600 font-semibold">{a.clockOut || "--"}</td>
                                                <td className="p-2.5 text-muted-foreground">{a.clockInLocation || "Office"}</td>
                                                <td className="p-2.5">
                                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.status === "Present" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-red-50 text-red-700 border border-red-100"
                                                    }`}>{a.status}</span>
                                                </td>
                                                <td className="p-2.5 text-right">
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => setAttendance(attendance.filter(item => item.id !== a.id))}
                                                  >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                  </Button>
                                                </td>
                                              </tr>
                                            ))}
                                            {empAtt.length === 0 && (
                                              <tr>
                                                <td colSpan={6} className="p-4 text-center text-muted-foreground">No attendance history logged.</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>

                                      <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5">
                                        <p className="text-xs font-bold text-gray-800">Add Attendance Entry</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                          <input
                                            type="date"
                                            value={addAttDate}
                                            onChange={(e) => setAddAttDate(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          />
                                          <input
                                            type="text"
                                            placeholder="Clock In Time"
                                            value={addAttIn}
                                            onChange={(e) => setAddAttIn(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          />
                                          <input
                                            type="text"
                                            placeholder="Clock Out Time"
                                            value={addAttOut}
                                            onChange={(e) => setAddAttOut(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          />
                                          <select
                                            value={addAttLoc}
                                            onChange={(e) => setAddAttLoc(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          >
                                            <option>JTM Mall Office</option>
                                            <option>Work from Home</option>
                                            <option>On-site Client Visit</option>
                                          </select>
                                        </div>
                                        <div className="text-right">
                                          <Button
                                            onClick={() => {
                                              if (!addAttDate || !addAttIn) return alert("Please fill date and clock-in time");
                                              const newA = {
                                                id: `ATT-${Date.now()}`,
                                                empId: cur.id,
                                                name: cur.name,
                                                role: cur.role,
                                                phone: cur.phone,
                                                avatar: cur.avatar,
                                                date: addAttDate,
                                                clockIn: addAttIn,
                                                clockOut: addAttOut || null,
                                                clockInLocation: addAttLoc,
                                                status: "Present"
                                              };
                                              setAttendance([newA, ...attendance]);
                                              setAddAttDate("");
                                            }}
                                            className="h-7 text-[11px] px-3 bg-[#FF6B00] text-white hover:bg-[#E05E00]"
                                          >
                                            Add Record
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}

                                {/* PERFORMANCE REVIEWS */}
                                {rec === "Performance Reviews" && (() => {
                                  const empRev = reviews.filter(r => r.empId === cur.id);
                                  return (
                                    <div className="space-y-3">
                                      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
                                        <table className="w-full text-left text-xs">
                                          <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                            <tr>
                                              <th className="p-2.5">Period</th>
                                              <th className="p-2.5">Rating</th>
                                              <th className="p-2.5">Reviewer</th>
                                              <th className="p-2.5">Feedback</th>
                                              <th className="p-2.5">Date</th>
                                              <th className="p-2.5 text-right">Action</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                            {empRev.map(r => (
                                              <tr key={r.id} className="hover:bg-gray-50">
                                                <td className="p-2.5 font-medium">{r.period}</td>
                                                <td className="p-2.5 text-orange-500 font-semibold">{r.rating} / 5.0</td>
                                                <td className="p-2.5">{r.reviewer}</td>
                                                <td className="p-2.5 text-muted-foreground max-w-[200px] truncate" title={r.feedback}>{r.feedback}</td>
                                                <td className="p-2.5 text-muted-foreground">{r.date}</td>
                                                <td className="p-2.5 text-right">
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => setReviews(reviews.filter(item => item.id !== r.id))}
                                                  >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                  </Button>
                                                </td>
                                              </tr>
                                            ))}
                                            {empRev.length === 0 && (
                                              <tr>
                                                <td colSpan={6} className="p-4 text-center text-muted-foreground">No performance reviews.</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>

                                      <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5">
                                        <p className="text-xs font-bold text-gray-800">Add Performance Review</p>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                          <input
                                            type="text"
                                            placeholder="Period (e.g. Q2 2026)"
                                            value={addReviewPeriod}
                                            onChange={(e) => setAddReviewPeriod(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          />
                                          <select
                                            value={addReviewRating}
                                            onChange={(e) => setAddReviewRating(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          >
                                            <option>5.0</option>
                                            <option>4.5</option>
                                            <option>4.0</option>
                                            <option>3.5</option>
                                            <option>3.0</option>
                                          </select>
                                          <input
                                            type="text"
                                            placeholder="Feedback Comments"
                                            value={addReviewFeedback}
                                            onChange={(e) => setAddReviewFeedback(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none col-span-2"
                                          />
                                        </div>
                                        <div className="text-right">
                                          <Button
                                            onClick={() => {
                                              if (!addReviewPeriod || !addReviewFeedback) return alert("Please fill review period and feedback");
                                              const newRev = {
                                                id: `REV-${Date.now()}`,
                                                empId: cur.id,
                                                period: addReviewPeriod,
                                                rating: parseFloat(addReviewRating),
                                                feedback: addReviewFeedback,
                                                reviewer: "Manvendra Singhal",
                                                date: new Date().toISOString().slice(0, 10)
                                              };
                                              setReviews([...reviews, newRev]);
                                              setAddReviewPeriod("");
                                              setAddReviewFeedback("");
                                            }}
                                            className="h-7 text-[11px] px-3 bg-[#FF6B00] text-white hover:bg-[#E05E00]"
                                          >
                                            Save Review
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}

                                {/* DOCUMENTS */}
                                {rec === "Documents" && (() => {
                                  const empDocs = hrFiles.filter(d => d.empId === cur.id || !d.empId);
                                  return (
                                    <div className="space-y-3">
                                      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
                                        <table className="w-full text-left text-xs">
                                          <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                            <tr>
                                              <th className="p-2.5">Doc Name</th>
                                              <th className="p-2.5">Type</th>
                                              <th className="p-2.5">Size</th>
                                              <th className="p-2.5">Upload Date</th>
                                              <th className="p-2.5 text-right">Action</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                            {empDocs.map(d => (
                                              <tr key={d.id} className="hover:bg-gray-50">
                                                <td className="p-2.5 font-medium flex items-center gap-1.5">
                                                  <FileText className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                                                  <span className="truncate max-w-[150px]">{d.name}</span>
                                                </td>
                                                <td className="p-2.5 text-muted-foreground">{d.type || "Document"}</td>
                                                <td className="p-2.5 text-muted-foreground">{d.size}</td>
                                                <td className="p-2.5 text-muted-foreground">{d.date}</td>
                                                <td className="p-2.5 text-right">
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => setHrFiles(hrFiles.filter(item => item.id !== d.id))}
                                                  >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                  </Button>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>

                                      <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5">
                                        <p className="text-xs font-bold text-gray-800">Upload / Add Document Record</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                          <input
                                            type="text"
                                            placeholder="File Name (e.g. Passport.pdf)"
                                            value={addDocName}
                                            onChange={(e) => setAddDocName(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          />
                                          <select
                                            value={addDocType}
                                            onChange={(e) => setAddDocType(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          >
                                            <option>Resume</option>
                                            <option>Offer Letter</option>
                                            <option>ID Proof</option>
                                            <option>Other</option>
                                          </select>
                                          <input
                                            type="text"
                                            placeholder="File Size (e.g. 500 KB)"
                                            value={addDocSize}
                                            onChange={(e) => setAddDocSize(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          />
                                        </div>
                                        <div className="text-right">
                                          <Button
                                            onClick={() => {
                                              if (!addDocName) return alert("Please fill file name");
                                              const newD = {
                                                id: `DOC-${Date.now()}`,
                                                empId: cur.id,
                                                name: addDocName,
                                                type: addDocType,
                                                size: addDocSize,
                                                date: new Date().toISOString().slice(0, 10),
                                                uploader: "Manvendra Singhal"
                                              };
                                              setHrFiles([...hrFiles, newD]);
                                              setAddDocName("");
                                            }}
                                            className="h-7 text-[11px] px-3 bg-[#FF6B00] text-white hover:bg-[#E05E00]"
                                          >
                                            Log Document
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}

                                {/* PAYROLL RECORDS */}
                                {rec === "Payroll Records" && (() => {
                                  const empPay = payroll.filter(p => p.empId === cur.id);
                                  return (
                                    <div className="space-y-3">
                                      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
                                        <table className="w-full text-left text-xs">
                                          <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                            <tr>
                                              <th className="p-2.5">Month</th>
                                              <th className="p-2.5">Net Salary</th>
                                              <th className="p-2.5">Tx ID</th>
                                              <th className="p-2.5">Paid Date</th>
                                              <th className="p-2.5">Status</th>
                                              <th className="p-2.5 text-right">Action</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                            {empPay.map(p => (
                                              <tr key={p.id} className="hover:bg-gray-50">
                                                <td className="p-2.5 font-medium">{p.month}</td>
                                                <td className="p-2.5 text-gray-800 font-bold">₹{p.salary.toLocaleString("en-IN")}</td>
                                                <td className="p-2.5 text-muted-foreground">{p.txId}</td>
                                                <td className="p-2.5 text-muted-foreground">{p.date}</td>
                                                <td className="p-2.5">
                                                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">{p.status}</span>
                                                </td>
                                                <td className="p-2.5 text-right">
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => setPayroll(payroll.filter(item => item.id !== p.id))}
                                                  >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                  </Button>
                                                </td>
                                              </tr>
                                            ))}
                                            {empPay.length === 0 && (
                                              <tr>
                                                <td colSpan={6} className="p-4 text-center text-muted-foreground">No payroll slips logged.</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>

                                      <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5">
                                        <p className="text-xs font-bold text-gray-800">Record Salary Disbursal</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                          <input
                                            type="text"
                                            placeholder="Month (e.g. June 2026)"
                                            value={addPayMonth}
                                            onChange={(e) => setAddPayMonth(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          />
                                          <input
                                            type="number"
                                            placeholder="Amount (INR)"
                                            value={addPaySalary}
                                            onChange={(e) => setAddPaySalary(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          />
                                          <select
                                            value={addPayStatus}
                                            onChange={(e) => setAddPayStatus(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          >
                                            <option>Paid</option>
                                            <option>Processing</option>
                                          </select>
                                        </div>
                                        <div className="text-right">
                                          <Button
                                            onClick={() => {
                                              if (!addPayMonth || !addPaySalary) return alert("Please fill month and amount");
                                              const newP = {
                                                id: `PAY-${Date.now()}`,
                                                empId: cur.id,
                                                month: addPayMonth,
                                                salary: parseInt(addPaySalary),
                                                status: addPayStatus,
                                                txId: `TXN${Math.floor(100000 + Math.random() * 900000)}`,
                                                date: new Date().toISOString().slice(0, 10)
                                              };
                                              setPayroll([...payroll, newP]);
                                              setAddPayMonth("");
                                              setAddPaySalary("");
                                            }}
                                            className="h-7 text-[11px] px-3 bg-[#FF6B00] text-white hover:bg-[#E05E00]"
                                          >
                                            Disburse Salary
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}

                                {/* COMPANY ASSETS */}
                                {rec === "Company Assets" && (() => {
                                  const empAssets = assets.filter(a => a.empId === cur.id);
                                  return (
                                    <div className="space-y-3">
                                      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
                                        <table className="w-full text-left text-xs">
                                          <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                            <tr>
                                              <th className="p-2.5">Asset Name</th>
                                              <th className="p-2.5">Type</th>
                                              <th className="p-2.5">Serial No</th>
                                              <th className="p-2.5">Assigned Date</th>
                                              <th className="p-2.5 text-right">Action</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                            {empAssets.map(a => (
                                              <tr key={a.id} className="hover:bg-gray-50">
                                                <td className="p-2.5 font-medium">{a.name}</td>
                                                <td className="p-2.5 text-muted-foreground">{a.type}</td>
                                                <td className="p-2.5 text-muted-foreground font-mono">{a.serial}</td>
                                                <td className="p-2.5 text-muted-foreground">{a.date}</td>
                                                <td className="p-2.5 text-right">
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => setAssets(assets.filter(item => item.id !== a.id))}
                                                  >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                  </Button>
                                                </td>
                                              </tr>
                                            ))}
                                            {empAssets.length === 0 && (
                                              <tr>
                                                <td colSpan={5} className="p-4 text-center text-muted-foreground">No assets assigned.</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>

                                      <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5">
                                        <p className="text-xs font-bold text-gray-800">Assign Company Asset</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                          <input
                                            type="text"
                                            placeholder="Asset Name (e.g. iPhone 13)"
                                            value={addAssetName}
                                            onChange={(e) => setAddAssetName(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          />
                                          <input
                                            type="text"
                                            placeholder="Serial / Tag Number"
                                            value={addAssetSerial}
                                            onChange={(e) => setAddAssetSerial(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          />
                                          <select
                                            value={addAssetType}
                                            onChange={(e) => setAddAssetType(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          >
                                            <option>Laptop</option>
                                            <option>Mobile Phone</option>
                                            <option>Accessories</option>
                                            <option>Other</option>
                                          </select>
                                        </div>
                                        <div className="text-right">
                                          <Button
                                            onClick={() => {
                                              if (!addAssetName || !addAssetSerial) return alert("Please fill asset name and serial number");
                                              const newAst = {
                                                id: `AST-${Date.now()}`,
                                                empId: cur.id,
                                                name: addAssetName,
                                                serial: addAssetSerial,
                                                type: addAssetType,
                                                value: 30000,
                                                date: new Date().toISOString().slice(0, 10)
                                              };
                                              setAssets([...assets, newAst]);
                                              setAddAssetName("");
                                              setAddAssetSerial("");
                                            }}
                                            className="h-7 text-[11px] px-3 bg-[#FF6B00] text-white hover:bg-[#E05E00]"
                                          >
                                            Assign Asset
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}

                                {/* TRAINING CERTIFICATES */}
                                {rec === "Training Certificates" && (() => {
                                  const empCerts = certificates.filter(c => c.empId === cur.id);
                                  return (
                                    <div className="space-y-3">
                                      <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white">
                                        <table className="w-full text-left text-xs">
                                          <thead className="bg-gray-50 text-gray-700 font-bold border-b border-gray-200">
                                            <tr>
                                              <th className="p-2.5">Certificate Name</th>
                                              <th className="p-2.5">Issuer</th>
                                              <th className="p-2.5">Completion Date</th>
                                              <th className="p-2.5 text-right">Action</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-gray-100">
                                            {empCerts.map(c => (
                                              <tr key={c.id} className="hover:bg-gray-50">
                                                <td className="p-2.5 font-medium flex items-center gap-1.5">
                                                  <Award className="h-3.5 w-3.5 text-[#FF6B00]" />
                                                  <span>{c.name}</span>
                                                </td>
                                                <td className="p-2.5 text-muted-foreground">{c.issuer}</td>
                                                <td className="p-2.5 text-muted-foreground">{c.date}</td>
                                                <td className="p-2.5 text-right">
                                                  <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => setCertificates(certificates.filter(item => item.id !== c.id))}
                                                  >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                  </Button>
                                                </td>
                                              </tr>
                                            ))}
                                            {empCerts.length === 0 && (
                                              <tr>
                                                <td colSpan={4} className="p-4 text-center text-muted-foreground">No certificates logged.</td>
                                              </tr>
                                            )}
                                          </tbody>
                                        </table>
                                      </div>

                                      <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5">
                                        <p className="text-xs font-bold text-gray-800">Add Training Certificate</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                          <input
                                            type="text"
                                            placeholder="Certificate Name"
                                            value={addCertName}
                                            onChange={(e) => setAddCertName(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          />
                                          <input
                                            type="text"
                                            placeholder="Issuing Authority (e.g. Udemy)"
                                            value={addCertIssuer}
                                            onChange={(e) => setAddCertIssuer(e.target.value)}
                                            className="h-8 rounded border border-gray-200 bg-white px-2 text-xs outline-none"
                                          />
                                        </div>
                                        <div className="text-right">
                                          <Button
                                            onClick={() => {
                                              if (!addCertName || !addCertIssuer) return alert("Please fill certificate name and issuer");
                                              const newCert = {
                                                id: `CRT-${Date.now()}`,
                                                empId: cur.id,
                                                name: addCertName,
                                                issuer: addCertIssuer,
                                                date: new Date().toISOString().slice(0, 10),
                                                url: "#"
                                              };
                                              setCertificates([...certificates, newCert]);
                                              setAddCertName("");
                                              setAddCertIssuer("");
                                            }}
                                            className="h-7 text-[11px] px-3 bg-[#FF6B00] text-white hover:bg-[#E05E00]"
                                          >
                                            Log Certificate
                                          </Button>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Activity Timeline */}
                  <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
                    <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2">Activity Timeline</h3>
                    <div className="p-4 space-y-4">
                      <div className="relative border-l-2 border-orange-100 pl-6 ml-3 space-y-5">
                        {mockPerf.activityTimeline.map((item, i) => (
                          <div key={i} className="relative">
                            <span className="absolute -left-[31px] top-1 bg-white border-2 border-[#FF6B00] h-3.5 w-3.5 rounded-full flex items-center justify-center shadow-sm"></span>
                            <div>
                              <p className="font-bold text-xs text-gray-800">{item.title}</p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
                              <p className="text-[10px] font-semibold text-orange-500 mt-1">{item.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            );
          })()}

          {activeTab === "Leave" && (() => {
            const cur = employees.find(e => e.name.toLowerCase() === auth?.name?.toLowerCase() || e.id === auth?.empId) || employees[0];
            const myLeaves = leaves.filter(l => l.empId === cur.id || l.empName === cur.name);
            return (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                {/* Leave Balance Stats */}
                <div className="grid gap-4 grid-cols-3">
                  {[
                    { label: "Casual Leave", total: 8, booked: myLeaves.filter(l => l.type === "Casual Leave" && l.status === "Approved").length, color: "border-l-emerald-500 bg-emerald-500/5 text-emerald-700" },
                    { label: "Sick Leave", total: 5, booked: myLeaves.filter(l => l.type === "Sick Leave" && l.status === "Approved").length, color: "border-l-blue-500 bg-blue-500/5 text-blue-700" },
                    { label: "Earned Leave", total: 10, booked: myLeaves.filter(l => l.type === "Earned Leave" && l.status === "Approved").length, color: "border-l-amber-500 bg-amber-500/5 text-amber-700" },
                  ].map((s) => (
                    <div key={s.label} className={`rounded-xl border border-border border-l-4 p-4 shadow-sm ${s.color}`}>
                      <p className="text-xs font-semibold uppercase tracking-wider opacity-80">{s.label}</p>
                      <div className="mt-2 flex items-baseline justify-between">
                        <p className="text-2xl font-bold">{s.total - s.booked} <span className="text-xs font-normal opacity-70">Avail</span></p>
                        <p className="text-xs font-medium">Booked: {s.booked} / {s.total}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid gap-6 md:grid-cols-3">
                  {/* Left Side: Leaves List */}
                  <div className="md:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-lg">My Leave Applications</h3>
                      <Button onClick={() => setIsLeaveModalOpen(true)} className="gap-1.5 rounded-xl text-xs h-9">
                        <Plus className="h-4 w-4" /> Apply Leave
                      </Button>
                    </div>

                    <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/40 text-muted-foreground text-xs font-medium border-b border-border">
                          <tr>
                            <th className="px-4 py-3">Leave Type</th>
                            <th className="px-4 py-3">Dates</th>
                            <th className="px-4 py-3">Reason</th>
                            <th className="px-4 py-3 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {myLeaves.map(l => (
                            <tr key={l.id} className="hover:bg-secondary/20">
                              <td className="px-4 py-3.5 font-medium">{l.type}</td>
                              <td className="px-4 py-3.5 text-muted-foreground">
                                {new Date(l.fromDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} - {new Date(l.toDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                              </td>
                              <td className="px-4 py-3.5 text-muted-foreground max-w-xs truncate" title={l.reason}>{l.reason}</td>
                              <td className="px-4 py-3.5 text-right">
                                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${l.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                                  l.status === "Rejected" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                                  }`}>
                                  {l.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                          {myLeaves.length === 0 && (
                            <tr>
                              <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No leave requests found.</td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Right Side: Holidays Calendar */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Upcoming Holidays</h3>
                    <div className="bg-card rounded-xl border border-border shadow-sm p-4 divide-y divide-border">
                      {[
                        { name: "Raksha Bandhan", date: "2026-08-28", day: "Friday", color: "bg-red-500" },
                        { name: "Independence Day", date: "2026-08-15", day: "Saturday", color: "bg-orange-500" },
                        { name: "Dussehra", date: "2026-10-20", day: "Tuesday", color: "bg-amber-500" },
                        { name: "Diwali", date: "2026-11-09", day: "Monday", color: "bg-yellow-500" },
                        { name: "Christmas", date: "2026-12-25", day: "Friday", color: "bg-emerald-500" }
                      ].map((h) => (
                        <div key={h.name} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-sm">{h.name}</p>
                            <p className="text-xs text-muted-foreground">{h.day}</p>
                          </div>
                          <span className="text-xs font-semibold bg-secondary px-2.5 py-1 rounded-lg text-muted-foreground">
                            {new Date(h.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {activeTab === "Attendance" && (() => {
            const cur = employees.find(e => e.name.toLowerCase() === auth?.name?.toLowerCase() || e.id === auth?.empId) || employees[0];
            const myLogs = attendance.filter(r => r.empId === cur.id);
            const todayStr = new Date().toISOString().slice(0, 10);
            const todayLog = myLogs.find(r => r.date === todayStr);

            const handlePunch = () => {
              const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
              if (!todayLog) {
                // Clock In
                const newRecord = {
                  id: `ATT-${Date.now()}`,
                  empId: cur.id,
                  name: cur.name,
                  role: cur.role,
                  phone: cur.phone,
                  avatar: cur.avatar,
                  date: todayStr,
                  clockIn: nowTime,
                  clockOut: null,
                  clockInLocation: punchLocation,
                  note: punchNote || "Punch in via dashboard",
                  status: "Present"
                };
                setAttendance([newRecord, ...attendance]);
                setPunchNote("");
              } else if (!todayLog.clockOut) {
                // Clock Out
                const updated = attendance.map(r => r.id === todayLog.id ? { ...r, clockOut: nowTime, clockOutLocation: punchLocation } : r);
                setAttendance(updated);
              }
            };

            return (
              <div className="grid gap-6 md:grid-cols-3 animate-in fade-in-50 duration-200">
                {/* Punch Board */}
                <div className="bg-card rounded-2xl border border-border p-6 shadow-card space-y-5">
                  <div className="text-center">
                    <Clock className="h-10 w-10 text-primary mx-auto mb-2 animate-pulse" />
                    <h3 className="font-semibold text-lg">Punch Clock</h3>
                    <p className="text-2xl font-bold tracking-tight mt-1">
                      {new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1.5">
                      <Label htmlFor="p-loc">Work Location</Label>
                      <select
                        id="p-loc"
                        disabled={!!todayLog?.clockOut}
                        value={punchLocation}
                        onChange={(e) => setPunchLocation(e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-xs"
                      >
                        <option>JTM Mall Office</option>
                        <option>Work from Home</option>
                        <option>On-site Client Visit</option>
                      </select>
                    </div>

                    {!todayLog && (
                      <div className="space-y-1.5">
                        <Label htmlFor="p-note">Daily Check-in Note</Label>
                        <Input
                          id="p-note"
                          placeholder="What is your plan for today?"
                          value={punchNote}
                          onChange={(e) => setPunchNote(e.target.value)}
                          className="h-8 text-xs"
                        />
                      </div>
                    )}
                  </div>

                  {todayLog?.clockIn && (
                    <div className="rounded-xl bg-secondary/50 p-3 space-y-1.5 text-xs">
                      <p className="flex justify-between"><span>Clocked In:</span> <span className="font-semibold text-emerald-600">{todayLog.clockIn} ({todayLog.clockInLocation || "Office"})</span></p>
                      {todayLog.clockOut && (
                        <p className="flex justify-between"><span>Clocked Out:</span> <span className="font-semibold text-red-600">{todayLog.clockOut}</span></p>
                      )}
                      {todayLog.note && <p className="text-[11px] text-muted-foreground italic mt-1 border-t pt-1">"{todayLog.note}"</p>}
                    </div>
                  )}

                  {!todayLog?.clockOut ? (
                    <Button
                      onClick={handlePunch}
                      className={`w-full py-5 rounded-xl font-bold gap-2 ${!todayLog ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-red-600 hover:bg-red-700 text-white"}`}
                    >
                      {!todayLog ? (
                        <><Play className="h-4 w-4 fill-white" /> Clock In</>
                      ) : (
                        <><Square className="h-4 w-4 fill-white" /> Clock Out</>
                      )}
                    </Button>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-3 text-center text-xs font-semibold">
                      🎉 Shift Completed Successfully!
                    </div>
                  )}
                </div>

                {/* History Table */}
                <div className="md:col-span-2 space-y-4">
                  <h3 className="font-semibold text-lg">My Attendance Logs</h3>
                  <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-secondary/40 text-muted-foreground text-xs font-medium border-b border-border">
                        <tr>
                          <th className="px-4 py-3">Date</th>
                          <th className="px-4 py-3">Clock In</th>
                          <th className="px-4 py-3">Clock Out</th>
                          <th className="px-4 py-3">Location</th>
                          <th className="px-4 py-3 text-right">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {myLogs.map(log => (
                          <tr key={log.id} className="hover:bg-secondary/20">
                            <td className="px-4 py-3.5 font-medium">
                              {new Date(log.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="px-4 py-3.5 font-semibold text-emerald-600">{log.clockIn}</td>
                            <td className="px-4 py-3.5 font-semibold text-red-600">{log.clockOut || "-"}</td>
                            <td className="px-4 py-3.5 text-muted-foreground text-xs">{log.clockInLocation || "Office"}</td>
                            <td className="px-4 py-3.5 text-right">
                              <span className="inline-block rounded-full bg-emerald-100 text-emerald-700 px-2 py-0.5 text-xs font-semibold">
                                {log.status || "Present"}
                              </span>
                            </td>
                          </tr>
                        ))}
                        {myLogs.length === 0 && (
                          <tr>
                            <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No attendance records clocked.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            );
          })()}

          {activeTab === "Jobs" && (() => {
            const myTasks = isAdmin ? tasks : tasks.filter(t => t.assignee === auth?.name);
            const pendingTasks = myTasks.filter(t => t.status === "Pending");
            const completedTasks = myTasks.filter(t => t.status === "Done");

            const handleToggleTask = (id: string) => {
              const updated = tasks.map(t => t.id === id ? { ...t, status: t.status === "Pending" ? "Done" : "Pending" } : t);
              setTasks(updated);
            };

            return (
              <div className="space-y-6 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Task Management</h3>
                    <p className="text-xs text-muted-foreground">Track assignments and action items.</p>
                  </div>
                  {true && (
                    <Button onClick={() => setIsTaskModalOpen(true)} className="gap-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white border-0 shadow-md">
                      <Plus className="h-4 w-4" /> Add Task
                    </Button>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Pending Tasks */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center justify-between text-amber-600 bg-amber-50 px-3 py-2 rounded-xl">
                      <span>Pending Tasks</span>
                      <span className="bg-amber-100 px-2 py-0.5 rounded-md text-xs">{pendingTasks.length}</span>
                    </h4>
                    <div className="space-y-3 overflow-y-auto max-h-[400px]">
                      {pendingTasks.map(task => (
                        <EmployeeTaskCard
                          key={task.id}
                          task={task}
                          isAdmin={isAdmin}
                          onToggle={handleToggleTask}
                          onEditNote={(id, note) => {
                            const updated = tasks.map(t => {
                              if (t.id === id) {
                                const currentNotes = t.notes || [];
                                return {
                                  ...t,
                                  notes: [...currentNotes, { text: note, createdAt: new Date().toISOString() }]
                                };
                              }
                              return t;
                            });
                            setTasks(updated);
                          }}
                        />
                      ))}
                      {pendingTasks.length === 0 && (
                        <p className="text-center text-muted-foreground text-sm py-8">🎉 All caught up! No pending tasks.</p>
                      )}
                    </div>
                  </div>

                  {/* Completed Tasks */}
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm flex items-center justify-between text-emerald-600 bg-emerald-50 px-3 py-2 rounded-xl">
                      <span>Completed Tasks</span>
                      <span className="bg-emerald-100 px-2 py-0.5 rounded-md text-xs">{completedTasks.length}</span>
                    </h4>
                    <div className="space-y-3 overflow-y-auto max-h-[400px]">
                      {completedTasks.map(task => (
                        <EmployeeTaskCard
                          key={task.id}
                          task={task}
                          isAdmin={isAdmin}
                          onToggle={handleToggleTask}
                          onEditNote={(id, note) => {
                            const updated = tasks.map(t => {
                              if (t.id === id) {
                                const currentNotes = t.notes || [];
                                return {
                                  ...t,
                                  notes: [...currentNotes, { text: note, createdAt: new Date().toISOString() }]
                                };
                              }
                              return t;
                            });
                            setTasks(updated);
                          }}
                        />
                      ))}
                      {completedTasks.length === 0 && (
                        <p className="text-center text-muted-foreground text-sm py-8">No tasks completed yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}


          {activeTab === "Feeds" && (() => {
            const handlePost = (e: React.FormEvent) => {
              e.preventDefault();
              if (!feedText.trim()) return;
              const newPost = {
                id: `feed-${Date.now()}`,
                user: auth?.name || "Manvendra Singhal",
                avatar: auth?.avatar || "/avatars/manvendra.png",
                role: isAdmin ? "HR & Admin Manager" : "Team Member",
                content: feedText,
                date: new Date().toISOString(),
                likes: 0,
                likedBy: []
              };
              setFeeds([newPost, ...feeds]);
              setFeedText("");
            };

            const handleLike = (id: string) => {
              const updated = feeds.map(post => {
                if (post.id === id) {
                  const likedBy = post.likedBy || [];
                  const userKey = auth?.name || "anonymous";
                  const alreadyLiked = likedBy.includes(userKey);
                  return {
                    ...post,
                    likes: alreadyLiked ? post.likes - 1 : post.likes + 1,
                    likedBy: alreadyLiked ? likedBy.filter((u: string) => u !== userKey) : [...likedBy, userKey]
                  };
                }
                return post;
              });
              setFeeds(updated);
            };

            return (
              <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-50 duration-200">
                {/* Create Post */}
                <form onSubmit={handlePost} className="bg-card border border-border rounded-2xl p-4 shadow-sm space-y-3">
                  <textarea
                    placeholder="Share an announcement, update, or thought..."
                    value={feedText}
                    onChange={(e) => setFeedText(e.target.value)}
                    className="w-full min-h-[80px] text-sm bg-secondary/20 focus:bg-background border border-transparent focus:border-border rounded-xl p-3 resize-none focus:outline-none transition-colors"
                  />
                  <div className="flex justify-end">
                    <Button type="submit" disabled={!feedText.trim()} className="rounded-xl h-9 text-xs px-4">
                      Share Post
                    </Button>
                  </div>
                </form>

                {/* Posts List */}
                <div className="space-y-4">
                  {feeds.map(post => {
                    const userKey = auth?.name || "anonymous";
                    const isLiked = (post.likedBy || []).includes(userKey);
                    return (
                      <div key={post.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm space-y-3 hover:border-border/80 transition-colors">
                        <div className="flex items-center gap-3">
                          <img src={post.avatar || "https://i.pravatar.cc/80"} alt={post.user} className="h-10 w-10 rounded-full object-cover border" />
                          <div>
                            <p className="font-semibold text-sm leading-tight">{post.user}</p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{post.role} • {new Date(post.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground/90 whitespace-pre-line leading-relaxed">{post.content}</p>
                        <div className="flex items-center gap-4 pt-2 border-t text-xs">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-1.5 font-semibold py-1 px-3 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer ${isLiked ? "text-rose-600" : "text-muted-foreground"}`}
                          >
                            <Heart className={`h-4 w-4 ${isLiked ? "fill-rose-600 text-rose-600" : ""}`} />
                            <span>{post.likes}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {activeTab === "Files" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Document Vault</h3>
                  <p className="text-xs text-muted-foreground">Access policies, handbooks, and documents.</p>
                </div>
                {isAdmin && (
                  <Button onClick={() => setIsFileModalOpen(true)} className="gap-1.5 rounded-xl text-xs h-9">
                    <Upload className="h-4 w-4" /> Upload Document
                  </Button>
                )}
              </div>

              <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/40 text-muted-foreground text-xs font-medium border-b border-border">
                    <tr>
                      <th className="px-4 py-3">Document Name</th>
                      <th className="px-4 py-3">Size</th>
                      <th className="px-4 py-3">Upload Date</th>
                      <th className="px-4 py-3">Uploader</th>
                      <th className="px-4 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {hrFiles.map(file => (
                      <tr key={file.id} className="hover:bg-secondary/20">
                        <td className="px-4 py-3.5 flex items-center gap-2 font-medium">
                          <FileText className="h-4 w-4 text-primary shrink-0" />
                          <span>{file.name}</span>
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground text-xs">{file.size}</td>
                        <td className="px-4 py-3.5 text-muted-foreground text-xs">
                          {new Date(file.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        <td className="px-4 py-3.5 text-muted-foreground text-xs">{file.uploader}</td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => alert(`Simulated download for ${file.name} triggered successfully!`)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors cursor-pointer"
                          >
                            <Download className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "Time Logs" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">Time Tracker</h3>
                  <p className="text-xs text-muted-foreground">Log hours worked on client itineraries and operations.</p>
                </div>
                <Button onClick={() => setIsTimeLogModalOpen(true)} className="gap-1.5 rounded-xl text-xs h-9">
                  <Clock className="h-4 w-4" /> Log Hours
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-card rounded-2xl border border-border p-5 shadow-card text-center flex flex-col justify-center">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Logged This Week</p>
                  <p className="text-3xl font-bold mt-2 text-primary">
                    {timeLogs.reduce((s, l) => s + l.hours, 0)} hrs
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Goal: 40 hrs</p>
                </div>

                <div className="md:col-span-2 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/40 text-muted-foreground text-xs font-medium border-b border-border">
                      <tr>
                        <th className="px-4 py-3">Employee</th>
                        <th className="px-4 py-3">Project</th>
                        <th className="px-4 py-3">Task Description</th>
                        <th className="px-4 py-3">Hours</th>
                        <th className="px-4 py-3 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {timeLogs.map(log => (
                        <tr key={log.id} className="hover:bg-secondary/20">
                          <td className="px-4 py-3.5 font-medium">{log.employee}</td>
                          <td className="px-4 py-3.5 text-xs text-primary font-semibold">{log.project}</td>
                          <td className="px-4 py-3.5 text-muted-foreground text-xs max-w-xs truncate" title={log.task}>{log.task}</td>
                          <td className="px-4 py-3.5 font-bold">{log.hours}</td>
                          <td className="px-4 py-3.5 text-right text-muted-foreground text-xs">
                            {new Date(log.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Activities" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <h3 className="font-semibold text-lg">Activity Logs</h3>
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="relative border-l-2 border-border pl-6 ml-3 space-y-6">
                  {[
                    { title: "Checked in for the day", desc: "Work mode: JTM Mall Office", date: "2026-06-19T09:30:00Z", user: "Suman Yadav" },
                    { title: "Submitted Maldives Package proposal", desc: "Itinerary sent to Mr. Gupta", date: "2026-06-19T11:45:00Z", user: "Nikita Bairwa" },
                    { title: "Leave request approved", desc: "Pushplata Kriplani: Casual Leave approved", date: "2026-06-18T16:00:00Z", user: "Suman Yadav" },
                    { title: "Schengen Visa processed", desc: "Deepak Kumar completed submittals", date: "2026-06-17T12:00:00Z", user: "Deepak Kumar" }
                  ].map((act, i) => (
                    <div key={i} className="relative">
                      <span className="absolute -left-[31px] top-0.5 bg-background border-2 border-primary h-4 w-4 rounded-full flex items-center justify-center"></span>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{act.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{act.desc} • By {act.user}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">
                          {new Date(act.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Career History" && (
            <div className="space-y-6 animate-in fade-in-50 duration-200">
              <h3 className="font-semibold text-lg">Career Milestones</h3>
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <div className="relative border-l-2 border-border pl-6 ml-3 space-y-6">
                  {[
                    { role: "Promoted to HR & Admin Manager", dept: "HR & Operations", date: "2025-06-01", desc: "Overseeing all talent and administrative functions at LookMyHolidays." },
                    { role: "Senior Operations Coordinator", dept: "Operations", date: "2023-03-15", desc: "Managed end-to-end travel reservations and vendors." },
                    { role: "Joined as Operations Associate", dept: "Operations", date: "2022-01-15", desc: "Coordinated local sightseeing itineraries and bookings." }
                  ].map((job, i) => (
                    <div key={i} className="relative">
                      <span className="absolute -left-[31px] top-0.5 bg-background border-2 border-emerald-500 h-4 w-4 rounded-full flex items-center justify-center"></span>
                      <div>
                        <p className="font-semibold text-sm text-foreground">{job.role}</p>
                        <p className="text-xs text-primary font-medium mt-0.5">{job.dept}</p>
                        <p className="text-xs text-muted-foreground mt-1">{job.desc}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">Effective: {new Date(job.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "Related Data" && (
            <div className="grid gap-6 md:grid-cols-2 animate-in fade-in-50 duration-200">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Exit & Transition Forms</h3>
                <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground text-sm">
                  <FileSignature className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p>No active exit processes initiated.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Travel Requests & Expense Forms</h3>
                <div className="bg-card border border-border rounded-xl p-6 text-center text-muted-foreground text-sm">
                  <Plus className="h-10 w-10 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p>No travel requests filed this quarter.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Apply Leave Modal */}
      <Dialog open={isLeaveModalOpen} onOpenChange={setIsLeaveModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogDescription>Submit a leave request. Your manager will review it.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="leave-type">Leave Type</Label>
              <select
                id="leave-type"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option>Casual Leave</option>
                <option>Sick Leave</option>
                <option>Earned Leave</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leave-from">From Date</Label>
                <Input
                  id="leave-from"
                  type="date"
                  value={leaveFrom}
                  onChange={(e) => setLeaveFrom(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="leave-to">To Date</Label>
                <Input
                  id="leave-to"
                  type="date"
                  value={leaveTo}
                  onChange={(e) => setLeaveTo(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="leave-reason">Reason</Label>
              <Input
                id="leave-reason"
                placeholder="Reason for leave..."
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsLeaveModalOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              if (!leaveFrom || !leaveTo || !leaveReason) return;
              const newLeave = {
                id: `LV-${Math.floor(100 + Math.random() * 900)}`,
                empId: auth?.empId || "LMH-01",
                empName: auth?.name || "Manvendra Singhal",
                type: leaveType,
                fromDate: leaveFrom,
                toDate: leaveTo,
                reason: leaveReason,
                status: "Pending"
              };
              setLeaves([newLeave, ...leaves]);
              setIsLeaveModalOpen(false);
              setLeaveFrom("");
              setLeaveTo("");
              setLeaveReason("");
            }}>Submit Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload File Modal */}
      <Dialog open={isFileModalOpen} onOpenChange={setIsFileModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Upload HR Document</DialogTitle>
            <DialogDescription>Add a new document to the company files directory.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file-name">Document Name</Label>
              <Input
                id="file-name"
                placeholder="e.g. Code_of_Conduct_2026.pdf"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-size">File Size</Label>
              <Input
                id="file-size"
                placeholder="e.g. 1.5 MB"
                value={newFileSize}
                onChange={(e) => setNewFileSize(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFileModalOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              if (!newFileName || !newFileSize) return;
              const newFile = {
                id: `file-${Date.now()}`,
                name: newFileName,
                size: newFileSize,
                date: new Date().toISOString().slice(0, 10),
                uploader: auth?.name || "Manvendra Singhal"
              };
              setHrFiles([newFile, ...hrFiles]);
              setIsFileModalOpen(false);
              setNewFileName("");
              setNewFileSize("");
            }}>Upload</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Log Time Modal */}
      <Dialog open={isTimeLogModalOpen} onOpenChange={setIsTimeLogModalOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Log Work Hours</DialogTitle>
            <DialogDescription>Submit your timesheet details for today.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="log-proj">Project Name</Label>
              <select
                id="log-proj"
                value={logProject}
                onChange={(e) => setLogProject(e.target.value)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">Select Project</option>
                <option>Grand Journeys Itinerary</option>
                <option>Visa Processing</option>
                <option>Accounts Reconciliation</option>
                <option>Marketing Campaigns</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="log-task">Task Description</Label>
              <Input
                id="log-task"
                placeholder="What did you work on?"
                value={logTask}
                onChange={(e) => setLogTask(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="log-hrs">Hours Spent</Label>
                <Input
                  id="log-hrs"
                  type="number"
                  step="0.5"
                  placeholder="e.g. 4.5"
                  value={logHours}
                  onChange={(e) => setLogHours(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="log-dt">Date</Label>
                <Input
                  id="log-dt"
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTimeLogModalOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              if (!logProject || !logTask || !logHours) return;
              const newLog = {
                id: `log-${Date.now()}`,
                project: logProject,
                task: logTask,
                hours: parseFloat(logHours),
                date: logDate,
                employee: auth?.name || "Manvendra Singhal"
              };
              setTimeLogs([newLog, ...timeLogs]);
              setIsTimeLogModalOpen(false);
              setLogProject("");
              setLogTask("");
              setLogHours("");
            }}>Log Time</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Task Modal */}
      <Dialog open={isTaskModalOpen} onOpenChange={setIsTaskModalOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
            <DialogDescription>Assign a task to an employee.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="t-title">Task Title</Label>
              <Input
                id="t-title"
                placeholder="e.g. Call client about Maldives package"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="t-type">Type</Label>
                <select
                  id="t-type"
                  value={taskType}
                  onChange={(e) => setTaskType(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option>Call</option>
                  <option>Email</option>
                  <option>Payment</option>
                  <option>Document</option>
                  <option>Follow-up</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-pri">Priority</Label>
                <select
                  id="t-pri"
                  value={taskPriority}
                  onChange={(e) => setTaskPriority(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option>High</option>
                  <option>Medium</option>
                  <option>Low</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="t-assignee">Assignee</Label>
                <select
                  id="t-assignee"
                  value={taskAssignee}
                  onChange={(e) => setTaskAssignee(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Select Employee</option>
                  {employees.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="t-date">Due Date</Label>
                <Input
                  id="t-date"
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="t-note">Note / Description</Label>
              <textarea
                id="t-note"
                placeholder="Optional task details..."
                value={taskNote}
                onChange={(e) => setTaskNote(e.target.value)}
                rows={3}
                className="flex w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsTaskModalOpen(false)}>Cancel</Button>
            <Button onClick={() => {
              if (!taskTitle || !taskAssignee || !taskDueDate) return;
              const newTask = {
                id: `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
                title: taskTitle,
                type: taskType,
                priority: taskPriority,
                assignee: taskAssignee,
                dueDate: taskDueDate,
                status: "Pending",
                note: taskNote
              };
              setTasks([newTask, ...tasks]);
              setIsTaskModalOpen(false);
              setTaskTitle("");
              setTaskAssignee("");
              setTaskDueDate("");
              setTaskNote("");
            }}>Create Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EmployeeProfileModal
        employee={selectedEmployee}
        open={!!selectedEmployee}
        onOpenChange={(open) => !open && setSelectedEmployee(null)}
        onEmployeeUpdated={() => {
          const stored = localStorage.getItem("crm_employees_v3");
          if (stored) {
            setEmployees(JSON.parse(stored));
          }
        }}
        onAssignTask={(name) => {
          setTaskAssignee(name);
          setIsTaskModalOpen(true);
          setSelectedEmployee(null);
        }}
        onApproveLeave={() => {
          setActiveTab("Approvals");
          setSelectedEmployee(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in p-4">
          <div className="w-full max-w-sm rounded-2xl bg-card p-6 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-xl font-bold font-display text-foreground">Delete Employee?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Are you sure you want to delete this employee? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setDeleteConfirmId(null)} className="rounded-xl">
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setEmployees(employees.filter(emp => emp.id !== deleteConfirmId));
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
    </div>
  );
}

