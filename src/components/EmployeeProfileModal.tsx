import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  MapPin,
  User,
  Mail,
  Phone,
  Calendar,
  Clock,
  Award,
  TrendingUp,
  CheckCircle,
  FileText,
  ChevronDown,
  ChevronUp,
  Plus,
  Edit,
  Download,
  Send,
  CheckSquare,
  GraduationCap,
  Users,
  Trash2,
  Check,
  X,
  Key,
  Eye,
  EyeOff,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import {
  INITIAL_EMPLOYEE_DETAILS,
  createDefaultEmployeeDetails,
  type EmployeeDetails,
  type CareerItem,
  type AcademicItem,
  type FamilyItem,
} from "@/lib/employee-profile-defaults";

export function EmployeeProfileModal(props: {
  employee: any;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onEmployeeUpdated?: () => void;
  onAssignTask?: (employeeName: string) => void;
  onApproveLeave?: () => void;
  initialScrollToId?: string | null;
}) {
  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      {props.employee && <EmployeeProfileModalInner {...props} />}
    </Dialog>
  );
}

function safeFormatDate(dateVal: any, locale = "en-IN", options?: Intl.DateTimeFormatOptions) {
  if (!dateVal) return "NA";
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return "NA";
  return d.toLocaleDateString(locale, options);
}

function EmployeeProfileModalInner({
  employee,
  open,
  onOpenChange,
  onEmployeeUpdated,
  onAssignTask,
  onApproveLeave,
  initialScrollToId,
}: {
  employee: any;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onEmployeeUpdated?: () => void;
  onAssignTask?: (employeeName: string) => void;
  onApproveLeave?: () => void;
  initialScrollToId?: string | null;
}) {
  // Load profile details or generate default
  const defaults =
    INITIAL_EMPLOYEE_DETAILS[employee.id] ||
    createDefaultEmployeeDetails(
      employee.id,
      employee.name,
      employee.role,
      employee.email,
      employee.phone,
    );
  const empDetails: EmployeeDetails = {
    ...defaults,
    ...(employee.profile_details || {}),
  };

  // Editing state
  const [isEditing, setIsEditing] = useState(false);
  const [editDetails, setEditDetails] = useState<EmployeeDetails | null>(null);
  const [editAvatar, setEditAvatar] = useState<string | null>(null);
  const [editCore, setEditCore] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    status: "",
    joinDate: "",
    department: "",
    accessRole: "",
  });

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // States for Employee Records loaded from Supabase
  const [leaves, setLeaves] = useSupabaseTable<any[]>("leaves", []);
  const [attendance, setAttendance] = useSupabaseTable<any[]>("attendance", []);
  const [reviews, setReviews] = useSupabaseTable<any[]>("reviews", [
    {
      id: "REV-01",
      empId: "LMH-02",
      period: "Q1 2026",
      rating: 4.5,
      feedback: "Excellent sales performance, exceeded targets.",
      reviewer: "Manvendra Singhal",
      date: "2026-04-05",
    },
    {
      id: "REV-02",
      empId: "LMH-03",
      period: "Q1 2026",
      rating: 4.8,
      feedback: "Great coordination and support on tour bookings.",
      reviewer: "Manvendra Singhal",
      date: "2026-04-06",
    },
  ]);
  const [hrFiles, setHrFiles] = useSupabaseTable<any[]>("hr_files", [
    {
      id: "file-1",
      name: "Employee_Handbook_2026.pdf",
      size: "1.2 MB",
      date: "2026-01-10",
      uploader: "Manvendra Singhal",
    },
    {
      id: "file-2",
      name: "Travel_Expense_Guidelines.pdf",
      size: "840 KB",
      date: "2026-02-15",
      uploader: "Manvendra Singhal",
    },
    {
      id: "file-3",
      name: "Leave_Policy_Manual.pdf",
      size: "620 KB",
      date: "2026-03-01",
      uploader: "Manvendra Singhal",
    },
    {
      id: "file-4",
      name: "Company_Holidays_2026.pdf",
      size: "450 KB",
      date: "2026-01-05",
      uploader: "Manvendra Singhal",
    },
  ]);
  const [payroll, setPayroll] = useSupabaseTable<any[]>("payroll", [
    {
      id: "PAY-01",
      empId: "LMH-02",
      month: "May 2026",
      salary: 35000,
      status: "Paid",
      txId: "TXN1029384",
      date: "2026-06-01",
    },
    {
      id: "PAY-02",
      empId: "LMH-03",
      month: "May 2026",
      salary: 32000,
      status: "Paid",
      txId: "TXN1029385",
      date: "2026-06-01",
    },
    {
      id: "PAY-03",
      empId: "LMH-04",
      month: "May 2026",
      salary: 45000,
      status: "Paid",
      txId: "TXN1029386",
      date: "2026-06-01",
    },
  ]);
  const [assets, setAssets] = useSupabaseTable<any[]>("assets", [
    {
      id: "AST-01",
      empId: "LMH-02",
      name: "Dell Latitude 5420 Laptop",
      serial: "CN-0V2H3Y-1234",
      type: "Laptop",
      value: 65000,
      date: "2023-03-10",
    },
    {
      id: "AST-02",
      empId: "LMH-03",
      name: "HP ProBook 440 G8 Laptop",
      serial: "CN-0V2H3Y-5678",
      type: "Laptop",
      value: 58000,
      date: "2022-06-25",
    },
    {
      id: "AST-03",
      empId: "LMH-04",
      name: "MacBook Air M1",
      serial: "FVFCX123QY7",
      type: "Laptop",
      value: 85000,
      date: "2021-11-05",
    },
    {
      id: "AST-04",
      empId: "LMH-05",
      name: "Lenovo ThinkPad L14",
      serial: "CN-0V2H3Y-9012",
      type: "Laptop",
      value: 55000,
      date: "2023-08-12",
    },
  ]);
  const [certificates, setCertificates] = useSupabaseTable<any[]>("certificates", [
    {
      id: "CRT-01",
      empId: "LMH-02",
      name: "Destination Expert - Middle East",
      issuer: "Tourism Board",
      date: "2024-05-15",
      url: "#",
    },
    {
      id: "CRT-02",
      empId: "LMH-03",
      name: "IATA Foundation Course",
      issuer: "IATA",
      date: "2023-11-20",
      url: "#",
    },
    {
      id: "CRT-03",
      empId: "LMH-05",
      name: "Visa Regulations & Compliance",
      issuer: "VFS Global Academy",
      date: "2024-02-18",
      url: "#",
    },
  ]);

  // Scroll to section when modal opens
  useEffect(() => {
    if (open && initialScrollToId) {
      // Small timeout to allow DOM to render inside the dialog
      setTimeout(() => {
        const el = document.getElementById(initialScrollToId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    }
  }, [open, initialScrollToId]);

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

  // Login credentials state
  const [credUsername, setCredUsername] = useState("");
  const [credPassword, setCredPassword] = useState("");
  const [credConfirm, setCredConfirm] = useState("");
  const [showCredPass, setShowCredPass] = useState(false);
  const [credSaved, setCredSaved] = useState(false);
  const [credError, setCredError] = useState("");
  const [showCredModal, setShowCredModal] = useState(false);

  // Reset editing mode when modal opens/closes or employee changes
  useEffect(() => {
    setIsEditing(false);
    setEditDetails(null);
    setExpandedSection(null);
    // Load existing credentials for this employee
    try {
      const username = employee.profile_details?.username || "";
      const password = employee.profile_details?.password || "";
      setCredUsername(username);
      setCredPassword(password);
      setCredConfirm(password);
    } catch {
      setCredUsername("");
      setCredPassword("");
      setCredConfirm("");
    }
    setCredSaved(false);
    setCredError("");
    setShowCredModal(false);
  }, [employee.id, open, employee.profile_details]);

  const handleStartEdit = () => {
    setEditCore({
      name: employee.name,
      role: employee.role,
      email: employee.email,
      phone: employee.phone,
      status: employee.status,
      joinDate: employee.joinDate,
      department: employee.department || "Sales",
      accessRole: employee.accessRole || "Employee",
    });
    setEditAvatar(null); // reset to current
    setEditDetails(JSON.parse(JSON.stringify(empDetails))); // deep clone
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditDetails(null);
  };

  const handleSaveCredentials = async () => {
    setCredError("");
    if (!credUsername.trim()) {
      setCredError("Username is required.");
      return;
    }
    if (credPassword.length < 4) {
      setCredError("Password must be at least 4 characters.");
      return;
    }
    if (credPassword !== credConfirm) {
      setCredError("Passwords do not match.");
      return;
    }
    try {
      const newProfileDetails = {
        ...employee.profile_details,
        username: credUsername.trim(),
        password: credPassword,
      };

      const { error } = await supabase
        .from("employees")
        .update({ profile_details: newProfileDetails })
        .eq("id", employee.id);

      if (error) throw error;
      
      setCredSaved(true);
      setTimeout(() => setCredSaved(false), 3000);
    } catch (err) {
      console.error(err);
      setCredError("Failed to save credentials.");
    }
  };

  const handleSave = () => {
    if (!editDetails) return;

    // Sync to Supabase directly so realtime catches it
    try {
      const supabasePayload = {
        name: editCore.name,
        role: editCore.role,
        email: editCore.email,
        phone: editCore.phone,
        status: editCore.status,
        description: JSON.stringify({
          _isMeta: true,
          text: editDetails.bio || "",
          profile_details: editDetails
        })
      };
      supabase.from("employees").update(supabasePayload).eq("id", employee.id).then(({ error }) => {
        if (error) console.error("Error updating employee profile in Supabase:", error);
        else if (onEmployeeUpdated) onEmployeeUpdated();
      });


      // Also update avatar in crm_auth_v1 if current user
      const authStored = localStorage.getItem("crm_auth_v1");
      if (authStored) {
        const authObj = JSON.parse(authStored);
        if (authObj.empId === employee.id) {
          if (editAvatar) authObj.avatar = editAvatar;
          localStorage.setItem("crm_auth_v1", JSON.stringify(authObj));
        }
      }

      // Also write back to crm_auth if the logged in user changed their own profile
      const authStored2 = localStorage.getItem("crm_auth");
      if (authStored2) {
        try {
          const authObj2 = JSON.parse(authStored2);
          if (
            authObj2.empId === employee.id ||
            authObj2.name?.toLowerCase() === employee.name.toLowerCase()
          ) {
            authObj2.name = editCore.name;
            authObj2.role = editCore.role;
            authObj2.email = editCore.email;
            if (editAvatar) authObj2.avatar = editAvatar;
            localStorage.setItem("crm_auth", JSON.stringify(authObj2));
          }
        } catch {
          // Ignore malformed auth data
        }
      }
    } catch (err) {
      console.error("Error updating employee list", err);
    }

    setIsEditing(false);
    if (onEmployeeUpdated) {
      onEmployeeUpdated();
    }
  };

  // Helper row management functions
  const updateCareer = (index: number, field: keyof CareerItem, value: string) => {
    if (!editDetails) return;
    const history = [...editDetails.careerHistory];
    history[index] = { ...history[index], [field]: value };
    setEditDetails({ ...editDetails, careerHistory: history });
  };

  const addCareer = () => {
    if (!editDetails) return;
    setEditDetails({
      ...editDetails,
      careerHistory: [
        ...editDetails.careerHistory,
        {
          company: "",
          position: "",
          startDate: "",
          endDate: "",
          responsibilities: "",
          achievement: "",
        },
      ],
    });
  };

  const deleteCareer = (index: number) => {
    if (!editDetails) return;
    setEditDetails({
      ...editDetails,
      careerHistory: editDetails.careerHistory.filter((_, i) => i !== index),
    });
  };

  const updateAcademic = (index: number, field: keyof AcademicItem, value: string) => {
    if (!editDetails) return;
    const background = [...editDetails.academicBackground];
    background[index] = { ...background[index], [field]: value };
    setEditDetails({ ...editDetails, academicBackground: background });
  };

  const addAcademic = () => {
    if (!editDetails) return;
    setEditDetails({
      ...editDetails,
      academicBackground: [
        ...editDetails.academicBackground,
        { institution: "", qualification: "", specialization: "", year: "", grade: "" },
      ],
    });
  };

  const deleteAcademic = (index: number) => {
    if (!editDetails) return;
    setEditDetails({
      ...editDetails,
      academicBackground: editDetails.academicBackground.filter((_, i) => i !== index),
    });
  };

  const updateFamily = (index: number, field: keyof FamilyItem, value: string) => {
    if (!editDetails) return;
    const info = [...editDetails.familyInformation];
    info[index] = { ...info[index], [field]: value };
    setEditDetails({ ...editDetails, familyInformation: info });
  };

  const addFamily = () => {
    if (!editDetails) return;
    setEditDetails({
      ...editDetails,
      familyInformation: [
        ...editDetails.familyInformation,
        { name: "", relationship: "", dob: "", contactNumber: "" },
      ],
    });
  };

  const deleteFamily = (index: number) => {
    if (!editDetails) return;
    setEditDetails({
      ...editDetails,
      familyInformation: editDetails.familyInformation.filter((_, i) => i !== index),
    });
  };

  const STATUS_COLOR = {
    Active: "bg-emerald-100 text-emerald-800 border-emerald-200",
    "On Leave": "bg-amber-100 text-amber-800 border-amber-200",
    Inactive: "bg-slate-100 text-slate-800 border-slate-200",
  };

  // Mock performance/project data (keep read-only, calculated dynamically)
  const mockPerf = {
    kpiScore: employee.rating ? Math.round(employee.rating * 20) : 92,
    attendancePct: 98.4,
    projectsCompleted: employee.closedDeals || 12,
    monthlyRating: employee.rating || 4.8,
    activeProjects: [
      {
        name: "Maldives Luxury Group Travel",
        status: "In Progress",
        deadline: "2026-06-30",
        progress: 75,
      },
      {
        name: "Europe Summer Itinerary Prep",
        status: "Planning",
        deadline: "2026-07-15",
        progress: 40,
      },
    ],
    activityTimeline: [
      { title: "Logged In", desc: "Clocked in from JTM Mall Office", time: "Today, 09:30 AM" },
      {
        title: "Task Completed",
        desc: "Updated Maldives package prices",
        time: "Yesterday, 04:15 PM",
      },
      { title: "Profile Updated", desc: "Modified emergency contact info", time: "18-Jun-2026" },
    ],
    documents: [
      { name: "Resume_Updated.pdf", type: "Resume", size: "1.2 MB" },
      { name: "Offer_Letter_LMH.pdf", type: "Offer Letter", size: "840 KB" },
      { name: "Aadhaar_Card_Masked.pdf", type: "ID Proof", size: "620 KB" },
    ],
  };

  return (
    <>
        <DialogContent className="max-w-5xl h-[92vh] overflow-y-auto p-0 gap-0 bg-[#F9FAFB] text-[#111827]">
          <DialogTitle className="sr-only">Company CRM Employee Profile</DialogTitle>
          <DialogDescription className="sr-only">
            Redesigned modern Company CRM Employee Profile for {employee.name}.
          </DialogDescription>

          {/* Main Content Area */}
          <div className="p-6 md:p-8 space-y-6">
            {/* Top Info Banner / Profile Overview */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center gap-5 w-full md:w-auto">
                {/* Profile photo — clickable upload when editing */}
                <div className="relative shrink-0 group">
                  {editAvatar ? (
                    <img
                      src={editAvatar}
                      alt={employee.name || "Employee"}
                      className="h-20 w-20 rounded-2xl object-cover border border-gray-200 ring-4 ring-primary/10"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 ring-4 ring-primary/10">
                      <span className="text-4xl font-bold text-primary">
                        {(employee.name || "?").charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  {isEditing && (
                    <label
                      htmlFor={`avatar-upload-${employee.id}`}
                      className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                    >
                      <Camera className="h-6 w-6 text-white" />
                      <span className="text-[10px] text-white font-bold mt-1">Change</span>
                      <input
                        id={`avatar-upload-${employee.id}`}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            setEditAvatar(ev.target?.result as string);
                          };
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  )}
                </div>

                {isEditing && editDetails ? (
                  <div className="space-y-3 w-full md:max-w-md">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Full Name
                        </label>
                        <Input
                          value={editCore.name}
                          onChange={(e) => setEditCore({ ...editCore, name: e.target.value })}
                          className="h-8 text-xs focus-visible:ring-[#FF6B00]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Job Title / Role
                        </label>
                        <Input
                          value={editCore.role}
                          onChange={(e) => setEditCore({ ...editCore, role: e.target.value })}
                          className="h-8 text-xs focus-visible:ring-[#FF6B00]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="space-y-1 col-span-2">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Work Email
                        </label>
                        <Input
                          value={editCore.email}
                          onChange={(e) => setEditCore({ ...editCore, email: e.target.value })}
                          className="h-8 text-xs focus-visible:ring-[#FF6B00]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase">
                          Status
                        </label>
                        <select
                          value={editCore.status}
                          onChange={(e) => setEditCore({ ...editCore, status: e.target.value })}
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
                      <h2 className="text-2xl font-bold font-display text-gray-900">
                        {employee.name}
                      </h2>
                      <span
                        className={`rounded-full border px-2.5 py-0.5 text-xs font-semibold ${STATUS_COLOR[employee.status as keyof typeof STATUS_COLOR] || "bg-slate-100"}`}
                      >
                        {employee.status}
                      </span>
                    </div>
                    <p className="text-[#FF6B00] font-semibold text-sm">
                      {employee.role} • {empDetails.department}
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5" /> {employee.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> {employee.phone}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Stats inside Banner */}
              <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-xl p-3.5 px-5">
                <div className="text-center pr-4 border-r border-gray-200">
                  <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Employee ID
                  </p>
                  <p className="text-sm font-bold text-gray-800 mt-0.5">{employee.id}</p>
                </div>
                <div className="text-center pl-1">
                  <p className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                    Joining Date
                  </p>
                  {isEditing && editDetails ? (
                    <input
                      type="date"
                      value={editCore.joinDate}
                      onChange={(e) => setEditCore({ ...editCore, joinDate: e.target.value })}
                      className="text-xs bg-white border border-gray-200 rounded px-1.5 py-0.5 mt-0.5 focus:outline-none focus:ring-1 focus:ring-[#FF6B00]"
                    />
                  ) : (
                    <p className="text-sm font-bold text-gray-800 mt-0.5">
                      {safeFormatDate(employee.joinDate, "en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* LEFT COLUMN */}
              <div className="space-y-6 md:col-span-1">

                {/* Quick Actions Card */}
                <Card title={isEditing ? "Actions" : "Quick Actions"}>
                  {isEditing ? (
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
                          const printWindow = window.open("", "_blank");
                          if (printWindow) {
                            printWindow.document.write(`
                            <html>
                              <head>
                                <title>Employee Profile - ${employee.name}</title>
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
                                <h1>${employee.name}</h1>
                                <div class="subtitle">${employee.role} • ${empDetails.department} (${employee.id})</div>
                                
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
                                    <div class="field"><div class="label">Work Phone</div><div class="value">${employee.phone}</div></div>
                                    <div class="field"><div class="label">Personal Phone</div><div class="value">${empDetails.personalPhone}</div></div>
                                    <div class="field"><div class="label">Work Email</div><div class="value">${employee.email}</div></div>
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
                    </div>
                  )}
                </Card>


                {/* ── Login Credentials Card (always visible) ── */}
                <Card title="Login Credentials">
                  <div className="space-y-3 pt-1">
                    {/* Current credentials display */}
                    {credUsername ? (
                      <div className="rounded-xl bg-purple-50 border border-purple-100 px-3 py-2.5 flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider">
                            Current Login
                          </p>
                          <p className="text-xs font-mono font-semibold text-gray-800 mt-0.5">
                            {credUsername} / {"•".repeat(Math.min(credPassword.length, 8))}
                          </p>
                        </div>
                        <CheckCircle className="h-4 w-4 text-purple-400 shrink-0" />
                      </div>
                    ) : (
                      <div className="rounded-xl bg-amber-50 border border-amber-100 px-3 py-2.5">
                        <p className="text-[11px] text-amber-700 font-medium">
                          No credentials set yet.
                        </p>
                      </div>
                    )}

                    {/* Username */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <User className="h-3 w-3" /> Username
                      </label>
                      <Input
                        value={credUsername}
                        onChange={(e) => setCredUsername(e.target.value)}
                        placeholder="e.g. jatin"
                        className="h-8 text-xs focus-visible:ring-purple-500"
                      />
                    </div>

                    {/* Password */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Key className="h-3 w-3" /> Password
                      </label>
                      <div className="relative">
                        <Input
                          type={showCredPass ? "text" : "password"}
                          value={credPassword}
                          onChange={(e) => setCredPassword(e.target.value)}
                          placeholder="Min. 4 characters"
                          className="h-8 text-xs pr-8 focus-visible:ring-purple-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCredPass(!showCredPass)}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700"
                        >
                          {showCredPass ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                        <Key className="h-3 w-3" /> Confirm Password
                      </label>
                      <Input
                        type={showCredPass ? "text" : "password"}
                        value={credConfirm}
                        onChange={(e) => setCredConfirm(e.target.value)}
                        placeholder="Re-enter password"
                        className="h-8 text-xs focus-visible:ring-purple-500"
                      />
                    </div>

                    {/* Error */}
                    {credError && (
                      <p className="text-[11px] text-red-600 bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5">
                        {credError}
                      </p>
                    )}

                    {/* Success */}
                    {credSaved && (
                      <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-lg px-2.5 py-1.5 flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5" /> Saved! Employee can now log in.
                      </p>
                    )}

                    {/* Save button */}
                    <Button
                      onClick={handleSaveCredentials}
                      className="w-full justify-center gap-2 text-xs h-8 bg-purple-600 hover:bg-purple-700 text-white font-bold"
                    >
                      <Check className="h-3.5 w-3.5" /> Save Credentials
                    </Button>
                  </div>
                </Card>

                {/* Reporting Structure */}
                <Card title="Reporting Structure">
                  {isEditing && editDetails ? (
                    <div className="space-y-3">
                      <EditField
                        label="Reporting Manager"
                        value={editDetails.reportingManager}
                        onChange={(v) => setEditDetails({ ...editDetails, reportingManager: v })}
                      />
                      <EditField
                        label="Team Lead"
                        value={editDetails.teamLead}
                        onChange={(v) => setEditDetails({ ...editDetails, teamLead: v })}
                      />
                      <EditField
                        label="Direct Reports (Comma-separated)"
                        value={editDetails.directReports.join(", ")}
                        onChange={(v) =>
                          setEditDetails({
                            ...editDetails,
                            directReports: v
                              .split(",")
                              .map((item) => item.trim())
                              .filter(Boolean),
                          })
                        }
                      />
                    </div>
                  ) : (
                    <div className="space-y-3.5 text-sm">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">
                          Reporting Manager
                        </p>
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
                            <span
                              key={i}
                              className="text-xs bg-gray-100 font-semibold px-2 py-0.5 rounded-md text-gray-700"
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Verification Details */}
                <Card title="Verification Details">
                  {isEditing && editDetails ? (
                    <div className="space-y-3">
                      <EditField
                        label="PAN Number"
                        value={editDetails.panNumber}
                        onChange={(v) => setEditDetails({ ...editDetails, panNumber: v })}
                      />
                      <EditField
                        label="Aadhaar Number"
                        value={editDetails.aadhaarNumber}
                        onChange={(v) => setEditDetails({ ...editDetails, aadhaarNumber: v })}
                      />
                      <EditField
                        label="Passport Number"
                        value={editDetails.passportNumber}
                        onChange={(v) => setEditDetails({ ...editDetails, passportNumber: v })}
                      />
                      <EditSelect
                        label="Verification Status"
                        value={editDetails.verificationStatus}
                        options={["Verified", "Pending", "Unverified"]}
                        onChange={(v) => setEditDetails({ ...editDetails, verificationStatus: v })}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                        <span className="text-muted-foreground text-xs font-medium">
                          Employee Code
                        </span>
                        <span className="font-semibold text-gray-800">{employee.id}</span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                        <span className="text-muted-foreground text-xs font-medium">
                          PAN Number
                        </span>
                        <span className="font-semibold text-gray-800 tracking-wider">
                          {empDetails.panNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                        <span className="text-muted-foreground text-xs font-medium">
                          Aadhaar Number
                        </span>
                        <span className="font-semibold text-gray-800">
                          {empDetails.aadhaarNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 border-b border-gray-100">
                        <span className="text-muted-foreground text-xs font-medium">
                          Passport Number
                        </span>
                        <span className="font-semibold text-gray-800">
                          {empDetails.passportNumber}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-1.5 pt-1.5">
                        <span className="text-muted-foreground text-xs font-medium">
                          Verification Status
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full border ${
                            empDetails.verificationStatus === "Verified"
                              ? "text-emerald-600 bg-emerald-50 border-emerald-200"
                              : "text-amber-600 bg-amber-50 border-amber-200"
                          }`}
                        >
                          <CheckCircle className="h-3 w-3" /> {empDetails.verificationStatus}
                        </span>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Documents Center */}
                <Card title="Documents Center">
                  <div className="space-y-2 pt-1">
                    {mockPerf.documents.map((doc, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between p-2 border border-gray-100 bg-gray-50/50 hover:bg-orange-50/20 rounded-xl transition-colors text-xs"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="h-4 w-4 text-orange-500 shrink-0" />
                          <div className="truncate">
                            <p className="font-semibold text-gray-800 truncate" title={doc.name}>
                              {doc.name}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {doc.type} • {doc.size}
                            </p>
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
                </Card>
              </div>

              {/* RIGHT COLUMN */}
              <div className="space-y-6 md:col-span-2">
                {/* Performance Summary (Calculated, keep static) */}
                <Card title="Performance Summary">
                  <div className="grid gap-4 sm:grid-cols-4 pt-1">
                    {[
                      {
                        label: "KPI Score",
                        value: `${mockPerf.kpiScore}%`,
                        icon: <Award className="h-4 w-4" />,
                        color: "bg-orange-50 text-[#FF6B00] border-orange-100",
                      },
                      {
                        label: "Attendance %",
                        value: `${mockPerf.attendancePct}%`,
                        icon: <Clock className="h-4 w-4" />,
                        color: "bg-emerald-50 text-emerald-600 border-emerald-100",
                      },
                      {
                        label: "Projects Completed",
                        value: mockPerf.projectsCompleted,
                        icon: <CheckCircle className="h-4 w-4" />,
                        color: "bg-blue-50 text-blue-600 border-blue-100",
                      },
                      {
                        label: "Monthly Rating",
                        value: `${mockPerf.monthlyRating} / 5`,
                        icon: <TrendingUp className="h-4 w-4" />,
                        color: "bg-purple-50 text-purple-600 border-purple-100",
                      },
                    ].map((stat) => (
                      <div
                        key={stat.label}
                        className={`rounded-xl border p-4 text-center ${stat.color} flex flex-col items-center justify-center`}
                      >
                        <span className="p-1.5 bg-white/80 rounded-lg shadow-sm border border-inherit mb-2 shrink-0">
                          {stat.icon}
                        </span>
                        <p className="text-xl font-bold">{stat.value}</p>
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-1.5">
                          {stat.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Employment Details */}
                <Card title="Employment Details">
                  {isEditing && editDetails ? (
                    <div className="grid gap-4 sm:grid-cols-2 text-xs">
                      <div className="space-y-2.5">
                        <EditField
                          label="Department"
                          value={editDetails.department}
                          onChange={(v) => setEditDetails({ ...editDetails, department: v })}
                        />
                        <EditField
                          label="Designation"
                          value={editDetails.designation}
                          onChange={(v) => setEditDetails({ ...editDetails, designation: v })}
                        />
                        <EditSelect
                          label="Employment Type"
                          value={editDetails.employmentType}
                          options={["Permanent", "Contract", "Intern", "Part-time"]}
                          onChange={(v) => setEditDetails({ ...editDetails, employmentType: v })}
                        />
                        <EditField
                          label="Work Location"
                          value={editDetails.workLocation}
                          onChange={(v) => setEditDetails({ ...editDetails, workLocation: v })}
                        />
                        <EditField
                          label="Reporting Manager"
                          value={editDetails.manager}
                          onChange={(v) => setEditDetails({ ...editDetails, manager: v })}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <EditField
                          label="Assigned Team"
                          value={editDetails.team}
                          onChange={(v) => setEditDetails({ ...editDetails, team: v })}
                        />
                        <EditField
                          label="Total Experience"
                          value={editDetails.experience}
                          onChange={(v) => setEditDetails({ ...editDetails, experience: v })}
                        />
                        <EditField
                          label="Employee Level"
                          value={editDetails.level}
                          onChange={(v) => setEditDetails({ ...editDetails, level: v })}
                        />
                        <EditField
                          label="Skills (Comma-separated)"
                          value={(editDetails.skills || []).join(", ")}
                          onChange={(v) =>
                            setEditDetails({
                              ...editDetails,
                              skills: v
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                        <EditField
                          label="Certifications (Comma-separated)"
                          value={(editDetails.certifications || []).join(", ")}
                          onChange={(v) =>
                            setEditDetails({
                              ...editDetails,
                              certifications: v
                                .split(",")
                                .map((c) => c.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 text-sm">
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                          <span className="text-muted-foreground text-xs font-medium">
                            Department
                          </span>
                          <span className="col-span-2 font-semibold text-gray-800">
                            {empDetails.department}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                          <span className="text-muted-foreground text-xs font-medium">
                            Designation
                          </span>
                          <span className="col-span-2 font-semibold text-gray-800">
                            {empDetails.designation}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                          <span className="text-muted-foreground text-xs font-medium">
                            Employment Type
                          </span>
                          <span className="col-span-2 font-semibold text-gray-800">
                            {empDetails.employmentType}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                          <span className="text-muted-foreground text-xs font-medium">
                            Work Location
                          </span>
                          <span className="col-span-2 font-semibold text-gray-800">
                            {empDetails.workLocation}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 py-1.5">
                          <span className="text-muted-foreground text-xs font-medium">
                            Reporting Manager
                          </span>
                          <span className="col-span-2 font-semibold text-gray-800">
                            {empDetails.manager}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                          <span className="text-muted-foreground text-xs font-medium">
                            Assigned Team
                          </span>
                          <span className="col-span-2 font-semibold text-gray-800">
                            {empDetails.team}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                          <span className="text-muted-foreground text-xs font-medium">
                            Total Experience
                          </span>
                          <span className="col-span-2 font-semibold text-gray-800">
                            {empDetails.experience}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                          <span className="text-muted-foreground text-xs font-medium">
                            Employee Level
                          </span>
                          <span className="col-span-2 font-semibold text-gray-800">
                            {empDetails.level}
                          </span>
                        </div>

                        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                          <span className="text-muted-foreground text-xs font-medium">Skills</span>
                          <div className="col-span-2 flex flex-wrap gap-1">
                            {(empDetails.skills || []).map((s, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-bold bg-orange-50 text-[#FF6B00] border border-orange-100 px-1.5 py-0.5 rounded"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 py-1.5">
                          <span className="text-muted-foreground text-xs font-medium">
                            Certifications
                          </span>
                          <div className="col-span-2 flex flex-wrap gap-1">
                            {(empDetails.certifications || []).map((c, i) => (
                              <span
                                key={i}
                                className="text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100 px-1.5 py-0.5 rounded"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Personal Profile */}
                <Card title="Personal Profile">
                  {isEditing && editDetails ? (
                    <div className="grid gap-4 sm:grid-cols-2 text-xs">
                      <div className="space-y-2.5">
                        <EditField
                          label="Date of Birth"
                          value={editDetails.dob}
                          onChange={(v) => setEditDetails({ ...editDetails, dob: v })}
                        />
                        <EditSelect
                          label="Gender"
                          value={editDetails.gender}
                          options={["Female", "Male", "Other"]}
                          onChange={(v) => setEditDetails({ ...editDetails, gender: v })}
                        />
                        <EditField
                          label="Nationality"
                          value={editDetails.nationality}
                          onChange={(v) => setEditDetails({ ...editDetails, nationality: v })}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <EditSelect
                          label="Marital Status"
                          value={editDetails.maritalStatus}
                          options={["Single", "Married", "Divorced", "Widowed"]}
                          onChange={(v) => setEditDetails({ ...editDetails, maritalStatus: v })}
                        />
                        <EditField
                          label="Languages (Comma-separated)"
                          value={(editDetails.languages || []).join(", ")}
                          onChange={(v) =>
                            setEditDetails({
                              ...editDetails,
                              languages: v
                                .split(",")
                                .map((l) => l.trim())
                                .filter(Boolean),
                            })
                          }
                        />
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                            About / Bio
                          </label>
                          <textarea
                            value={editDetails.bio || ""}
                            onChange={(e) =>
                              setEditDetails({ ...editDetails, bio: e.target.value })
                            }
                            className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 text-sm">
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                          <span className="text-muted-foreground text-xs font-medium">
                            Date of Birth
                          </span>
                          <span className="col-span-2 font-semibold text-gray-800">
                            {safeFormatDate(empDetails.dob, "en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                          <span className="text-muted-foreground text-xs font-medium">Gender</span>
                          <span className="col-span-2 font-semibold text-gray-800">
                            {empDetails.gender}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 py-1.5">
                          <span className="text-muted-foreground text-xs font-medium">
                            Nationality
                          </span>
                          <span className="col-span-2 font-semibold text-gray-800">
                            {empDetails.nationality}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                          <span className="text-muted-foreground text-xs font-medium">
                            Marital Status
                          </span>
                          <span className="col-span-2 font-semibold text-gray-800">
                            {empDetails.maritalStatus}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                          <span className="text-muted-foreground text-xs font-medium">
                            Languages
                          </span>
                          <span className="col-span-2 font-semibold text-gray-800">
                            {(empDetails.languages || []).join(", ")}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 py-1.5">
                          <span className="text-muted-foreground text-xs font-medium">
                            About / Bio
                          </span>
                          <span className="col-span-2 text-gray-700 leading-relaxed font-medium">
                            {employee.description || "Active system user."}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Contact Information */}
                <Card title="Contact Information">
                  {isEditing && editDetails ? (
                    <div className="grid gap-4 sm:grid-cols-2 text-xs">
                      <div className="space-y-2.5">
                        <EditSelect
                          label="Status"
                          value={editCore.status}
                          onChange={(v) => setEditCore({ ...editCore, status: v })}
                          options={["Active", "On Leave", "Inactive"]}
                        />
                        <EditSelect
                          label="Access Role"
                          value={editCore.accessRole}
                          onChange={(v) => setEditCore({ ...editCore, accessRole: v })}
                          options={["Admin", "Manager", "Employee"]}
                        />
                        <EditSelect
                          label="Department"
                          value={editCore.department}
                          onChange={(v) => setEditCore({ ...editCore, department: v })}
                          options={["Sales", "Operations", "HR & Admin", "Accounts", "Visa"]}
                        />
                        <EditField
                          label="Work Phone"
                          value={editCore.phone}
                          onChange={(v) => setEditCore({ ...editCore, phone: v })}
                        />
                        <EditField
                          label="Personal Phone"
                          value={editDetails.personalPhone}
                          onChange={(v) => setEditDetails({ ...editDetails, personalPhone: v })}
                        />
                        <EditField
                          label="Work Email"
                          value={editCore.email}
                          onChange={(v) => setEditCore({ ...editCore, email: v })}
                        />
                        <EditField
                          label="Personal Email"
                          value={editDetails.personalEmail}
                          onChange={(v) => setEditDetails({ ...editDetails, personalEmail: v })}
                        />
                      </div>
                      <div className="space-y-2.5">
                        <EditField
                          label="Current Address"
                          value={editDetails.currentAddress}
                          onChange={(v) => setEditDetails({ ...editDetails, currentAddress: v })}
                        />
                        <EditField
                          label="Permanent Address"
                          value={editDetails.permanentAddress}
                          onChange={(v) => setEditDetails({ ...editDetails, permanentAddress: v })}
                        />
                        <EditField
                          label="Emergency Contact"
                          value={editDetails.emergencyContact}
                          onChange={(v) => setEditDetails({ ...editDetails, emergencyContact: v })}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="grid gap-4 sm:grid-cols-2 text-sm">
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                          <span className="text-muted-foreground text-xs font-medium">
                            Work Phone
                          </span>
                          <span className="col-span-2 font-semibold text-gray-800">
                            {employee.phone}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                          <span className="text-muted-foreground text-xs font-medium">
                            Personal Phone
                          </span>
                          <span className="col-span-2 font-semibold text-gray-800">
                            {empDetails.personalPhone}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                          <span className="text-muted-foreground text-xs font-medium">
                            Work Email
                          </span>
                          <span className="col-span-2 font-semibold text-gray-800">
                            {employee.email}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 py-1.5">
                          <span className="text-muted-foreground text-xs font-medium">
                            Personal Email
                          </span>
                          <span className="col-span-2 font-semibold text-gray-800">
                            {empDetails.personalEmail}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                          <span className="text-muted-foreground text-xs font-medium">
                            Current Address
                          </span>
                          <span className="col-span-2 text-xs font-medium text-gray-800 leading-relaxed">
                            {empDetails.currentAddress}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-gray-100">
                          <span className="text-muted-foreground text-xs font-medium">
                            Permanent Address
                          </span>
                          <span className="col-span-2 text-xs font-medium text-gray-800 leading-relaxed">
                            {empDetails.permanentAddress}
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-2 py-1.5">
                          <span className="text-muted-foreground text-xs font-medium">
                            Emergency Contact
                          </span>
                          <span className="col-span-2 font-semibold text-gray-800 text-xs">
                            {empDetails.emergencyContact}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>

            {/* FULL WIDTH BOTTOM SECTIONS */}
            <div className="space-y-6">
              {/* Career History */}
              <Card title="Career History">
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
                        {isEditing && <th className="px-4 py-3 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 bg-white">
                      {isEditing && editDetails ? (
                        editDetails.careerHistory.map((h, i) => (
                          <tr key={i} className="hover:bg-orange-50/10 transition-colors">
                            <td className="px-2 py-1.5">
                              <Input
                                className="h-7 text-xs"
                                value={h.company}
                                onChange={(e) => updateCareer(i, "company", e.target.value)}
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <Input
                                className="h-7 text-xs"
                                value={h.position}
                                onChange={(e) => updateCareer(i, "position", e.target.value)}
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <Input
                                className="h-7 text-xs"
                                type="date"
                                value={h.startDate}
                                onChange={(e) => updateCareer(i, "startDate", e.target.value)}
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <Input
                                className="h-7 text-xs"
                                type="date"
                                value={h.endDate}
                                onChange={(e) => updateCareer(i, "endDate", e.target.value)}
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <Input
                                className="h-7 text-xs"
                                value={h.responsibilities}
                                onChange={(e) =>
                                  updateCareer(i, "responsibilities", e.target.value)
                                }
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <Input
                                className="h-7 text-xs"
                                value={h.achievement}
                                onChange={(e) => updateCareer(i, "achievement", e.target.value)}
                              />
                            </td>
                            <td className="px-2 py-1.5 text-right">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => deleteCareer(i)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : empDetails.careerHistory.length === 0 ? (
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-8 text-center text-xs text-muted-foreground"
                          >
                            No career history records logged.
                          </td>
                        </tr>
                      ) : (
                        empDetails.careerHistory.map((h, i) => (
                          <tr key={i} className="hover:bg-orange-50/10 transition-colors">
                            <td className="px-4 py-3.5 font-semibold text-gray-800">{h.company}</td>
                            <td className="px-4 py-3.5 text-xs">{h.position}</td>
                            <td className="px-4 py-3.5 text-xs text-muted-foreground">
                              {h.startDate
                                ? safeFormatDate(h.startDate, "en-IN", {
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "N/A"}
                            </td>
                            <td className="px-4 py-3.5 text-xs text-muted-foreground">
                              {h.endDate
                                ? safeFormatDate(h.endDate, "en-IN", {
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "Present"}
                            </td>
                            <td
                              className="px-4 py-3.5 text-xs max-w-xs truncate"
                              title={h.responsibilities}
                            >
                              {h.responsibilities}
                            </td>
                            <td className="px-4 py-3.5 text-xs font-medium text-emerald-700">
                              {h.achievement}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {isEditing && (
                  <div className="pt-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[#FF6B00] border-[#FF6B00]/30 hover:bg-orange-50 text-xs"
                      onClick={addCareer}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Experience Row
                    </Button>
                  </div>
                )}
              </Card>

              {/* Academic Background */}
              <Card title="Academic Background">
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-orange-50/50 text-[#FF6B00] text-xs font-bold border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3">Institution</th>
                        <th className="px-4 py-3">Qualification</th>
                        <th className="px-4 py-3">Specialization</th>
                        <th className="px-4 py-3">Year</th>
                        <th className="px-4 py-3">Grade</th>
                        {isEditing && <th className="px-4 py-3 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 bg-white">
                      {isEditing && editDetails ? (
                        editDetails.academicBackground.map((a, i) => (
                          <tr key={i} className="hover:bg-orange-50/10 transition-colors">
                            <td className="px-2 py-1.5">
                              <Input
                                className="h-7 text-xs"
                                value={a.institution}
                                onChange={(e) => updateAcademic(i, "institution", e.target.value)}
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <Input
                                className="h-7 text-xs"
                                value={a.qualification}
                                onChange={(e) => updateAcademic(i, "qualification", e.target.value)}
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <Input
                                className="h-7 text-xs"
                                value={a.specialization}
                                onChange={(e) =>
                                  updateAcademic(i, "specialization", e.target.value)
                                }
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <Input
                                className="h-7 text-xs"
                                value={a.year}
                                onChange={(e) => updateAcademic(i, "year", e.target.value)}
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <Input
                                className="h-7 text-xs"
                                value={a.grade}
                                onChange={(e) => updateAcademic(i, "grade", e.target.value)}
                              />
                            </td>
                            <td className="px-2 py-1.5 text-right">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => deleteAcademic(i)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : empDetails.academicBackground.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-xs text-muted-foreground"
                          >
                            No academic records logged.
                          </td>
                        </tr>
                      ) : (
                        empDetails.academicBackground.map((a, i) => (
                          <tr key={i} className="hover:bg-orange-50/10 transition-colors">
                            <td className="px-4 py-3.5 font-semibold text-gray-800">
                              {a.institution}
                            </td>
                            <td className="px-4 py-3.5 text-xs">{a.qualification}</td>
                            <td className="px-4 py-3.5 text-xs text-muted-foreground">
                              {a.specialization}
                            </td>
                            <td className="px-4 py-3.5 text-xs text-muted-foreground">{a.year}</td>
                            <td className="px-4 py-3.5 text-xs font-semibold text-gray-800">
                              {a.grade}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {isEditing && (
                  <div className="pt-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[#FF6B00] border-[#FF6B00]/30 hover:bg-orange-50 text-xs"
                      onClick={addAcademic}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Qualification Row
                    </Button>
                  </div>
                )}
              </Card>

              {/* Family Information */}
              <Card title="Family Information">
                <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-orange-50/50 text-[#FF6B00] text-xs font-bold border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Relationship</th>
                        <th className="px-4 py-3">Date of Birth</th>
                        <th className="px-4 py-3">Contact Number</th>
                        {isEditing && <th className="px-4 py-3 text-right">Actions</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700 bg-white">
                      {isEditing && editDetails ? (
                        editDetails.familyInformation.map((f, i) => (
                          <tr key={i} className="hover:bg-orange-50/10 transition-colors">
                            <td className="px-2 py-1.5">
                              <Input
                                className="h-7 text-xs"
                                value={f.name}
                                onChange={(e) => updateFamily(i, "name", e.target.value)}
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <Input
                                className="h-7 text-xs"
                                value={f.relationship}
                                onChange={(e) => updateFamily(i, "relationship", e.target.value)}
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <Input
                                className="h-7 text-xs"
                                type="date"
                                value={f.dob}
                                onChange={(e) => updateFamily(i, "dob", e.target.value)}
                              />
                            </td>
                            <td className="px-2 py-1.5">
                              <Input
                                className="h-7 text-xs"
                                value={f.contactNumber}
                                onChange={(e) => updateFamily(i, "contactNumber", e.target.value)}
                              />
                            </td>
                            <td className="px-2 py-1.5 text-right">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={() => deleteFamily(i)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : empDetails.familyInformation.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-8 text-center text-xs text-muted-foreground"
                          >
                            No dependent records logged.
                          </td>
                        </tr>
                      ) : (
                        empDetails.familyInformation.map((f, i) => (
                          <tr key={i} className="hover:bg-orange-50/10 transition-colors">
                            <td className="px-4 py-3.5 font-semibold text-gray-800">{f.name}</td>
                            <td className="px-4 py-3.5 text-xs text-muted-foreground">
                              {f.relationship}
                            </td>
                            <td className="px-4 py-3.5 text-xs text-muted-foreground">
                              {f.dob
                                ? safeFormatDate(f.dob, "en-IN", {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "N/A"}
                            </td>
                            <td className="px-4 py-3.5 text-xs text-gray-800 font-medium">
                              {f.contactNumber}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {isEditing && (
                  <div className="pt-2 text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[#FF6B00] border-[#FF6B00]/30 hover:bg-orange-50 text-xs"
                      onClick={addFamily}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Add Dependent Row
                    </Button>
                  </div>
                )}
              </Card>

              {/* Employee Records (Accordion-style) */}
              <Card title="Employee Records">
                <div className="divide-y divide-gray-200 rounded-xl border border-gray-200 overflow-hidden bg-white">
                  {[
                    "Leave Requests",
                    "Attendance History",
                    "Performance Reviews",
                    "Documents",
                    "Payroll Records",
                    "Company Assets",
                    "Training Certificates",
                  ].map((rec) => {
                    const isExpanded = expandedSection === rec;
                    return (
                      <div key={rec} className="border-b last:border-b-0 border-gray-100">
                        <div
                          onClick={() => setExpandedSection(isExpanded ? null : rec)}
                          className="flex items-center justify-between px-4 py-3.5 hover:bg-orange-50/20 cursor-pointer group transition-colors"
                        >
                          <span className="font-semibold text-sm text-gray-700 group-hover:text-[#FF6B00] transition-colors">
                            {rec}
                          </span>
                          <div className="flex items-center gap-2 text-muted-foreground">
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4 text-[#FF6B00]" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="bg-gray-50/50 p-4 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-1 duration-150">
                            {/* LEAVE REQUESTS */}
                            {rec === "Leave Requests" &&
                              (() => {
                                const empLeaves = leaves.filter((l) => l.empId === employee.id);
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
                                          {empLeaves.map((l) => (
                                            <tr key={l.id} className="hover:bg-gray-50">
                                              <td className="p-2.5 font-medium">{l.type}</td>
                                              <td className="p-2.5 text-muted-foreground">
                                                {l.fromDate} to {l.toDate}
                                              </td>
                                              <td
                                                className="p-2.5 text-muted-foreground max-w-[150px] truncate"
                                                title={l.reason}
                                              >
                                                {l.reason}
                                              </td>
                                              <td className="p-2.5">
                                                <span
                                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    l.status === "Approved"
                                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                                      : l.status === "Rejected"
                                                        ? "bg-red-50 text-red-700 border border-red-100"
                                                        : "bg-amber-50 text-amber-700 border border-amber-100"
                                                  }`}
                                                >
                                                  {l.status}
                                                </span>
                                              </td>
                                              <td className="p-2.5 text-right">
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                  onClick={() =>
                                                    setLeaves(
                                                      leaves.filter((item) => item.id !== l.id),
                                                    )
                                                  }
                                                >
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                              </td>
                                            </tr>
                                          ))}
                                          {empLeaves.length === 0 && (
                                            <tr>
                                              <td
                                                colSpan={5}
                                                className="p-4 text-center text-muted-foreground"
                                              >
                                                No leave records.
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>

                                    {/* Add Form */}
                                    <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5">
                                      <p className="text-xs font-bold text-gray-800">
                                        Apply / Log Leave
                                      </p>
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
                                            if (!addLeaveFrom || !addLeaveTo || !addLeaveReason)
                                              return alert("Please fill dates and reason");
                                            const newL = {
                                              id: `LV-${Date.now()}`,
                                              empId: employee.id,
                                              empName: employee.name,
                                              type: addLeaveType,
                                              fromDate: addLeaveFrom,
                                              toDate: addLeaveTo,
                                              reason: addLeaveReason,
                                              status: "Pending",
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
                            {rec === "Attendance History" &&
                              (() => {
                                const empAtt = attendance.filter((a) => a.empId === employee.id);
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
                                          {empAtt.map((a) => (
                                            <tr key={a.id} className="hover:bg-gray-50">
                                              <td className="p-2.5 font-medium">{a.date}</td>
                                              <td className="p-2.5 text-emerald-600 font-semibold">
                                                {a.clockIn || "--"}
                                              </td>
                                              <td className="p-2.5 text-amber-600 font-semibold">
                                                {a.clockOut || "--"}
                                              </td>
                                              <td className="p-2.5 text-muted-foreground">
                                                {a.clockInLocation || "Office"}
                                              </td>
                                              <td className="p-2.5">
                                                <span
                                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                                    a.status === "Present"
                                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                                      : "bg-red-50 text-red-700 border border-red-100"
                                                  }`}
                                                >
                                                  {a.status}
                                                </span>
                                              </td>
                                              <td className="p-2.5 text-right">
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                  onClick={() =>
                                                    setAttendance(
                                                      attendance.filter((item) => item.id !== a.id),
                                                    )
                                                  }
                                                >
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                              </td>
                                            </tr>
                                          ))}
                                          {empAtt.length === 0 && (
                                            <tr>
                                              <td
                                                colSpan={6}
                                                className="p-4 text-center text-muted-foreground"
                                              >
                                                No attendance history logged.
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>

                                    <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5">
                                      <p className="text-xs font-bold text-gray-800">
                                        Add Attendance Entry
                                      </p>
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
                                            if (!addAttDate || !addAttIn)
                                              return alert("Please fill date and clock-in time");
                                            const newA = {
                                              id: `ATT-${Date.now()}`,
                                              empId: employee.id,
                                              name: employee.name,
                                              role: employee.role,
                                              phone: employee.phone,
                                              avatar: employee.avatar,
                                              date: addAttDate,
                                              clockIn: addAttIn,
                                              clockOut: addAttOut || null,
                                              clockInLocation: addAttLoc,
                                              status: "Present",
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
                            {rec === "Performance Reviews" &&
                              (() => {
                                const empRev = reviews.filter((r) => r.empId === employee.id);
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
                                          {empRev.map((r) => (
                                            <tr key={r.id} className="hover:bg-gray-50">
                                              <td className="p-2.5 font-medium">{r.period}</td>
                                              <td className="p-2.5 text-orange-500 font-semibold">
                                                {r.rating} / 5.0
                                              </td>
                                              <td className="p-2.5">{r.reviewer}</td>
                                              <td
                                                className="p-2.5 text-muted-foreground max-w-[200px] truncate"
                                                title={r.feedback}
                                              >
                                                {r.feedback}
                                              </td>
                                              <td className="p-2.5 text-muted-foreground">
                                                {r.date}
                                              </td>
                                              <td className="p-2.5 text-right">
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                  onClick={() =>
                                                    setReviews(
                                                      reviews.filter((item) => item.id !== r.id),
                                                    )
                                                  }
                                                >
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                              </td>
                                            </tr>
                                          ))}
                                          {empRev.length === 0 && (
                                            <tr>
                                              <td
                                                colSpan={6}
                                                className="p-4 text-center text-muted-foreground"
                                              >
                                                No performance reviews.
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>

                                    <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5">
                                      <p className="text-xs font-bold text-gray-800">
                                        Add Performance Review
                                      </p>
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
                                            if (!addReviewPeriod || !addReviewFeedback)
                                              return alert(
                                                "Please fill review period and feedback",
                                              );
                                            const newRev = {
                                              id: `REV-${Date.now()}`,
                                              empId: employee.id,
                                              period: addReviewPeriod,
                                              rating: parseFloat(addReviewRating),
                                              feedback: addReviewFeedback,
                                              reviewer: "Manvendra Singhal",
                                              date: new Date().toISOString().slice(0, 10),
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
                            {rec === "Documents" &&
                              (() => {
                                const empDocs = hrFiles.filter(
                                  (d) => d.empId === employee.id || !d.empId,
                                ); // General handbook or user files
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
                                          {empDocs.map((d) => (
                                            <tr key={d.id} className="hover:bg-gray-50">
                                              <td className="p-2.5 font-medium flex items-center gap-1.5">
                                                <FileText className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                                                <span className="truncate max-w-[150px]">
                                                  {d.name}
                                                </span>
                                              </td>
                                              <td className="p-2.5 text-muted-foreground">
                                                {d.type || "Document"}
                                              </td>
                                              <td className="p-2.5 text-muted-foreground">
                                                {d.size}
                                              </td>
                                              <td className="p-2.5 text-muted-foreground">
                                                {d.date}
                                              </td>
                                              <td className="p-2.5 text-right">
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                  onClick={() =>
                                                    setHrFiles(
                                                      hrFiles.filter((item) => item.id !== d.id),
                                                    )
                                                  }
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
                                      <p className="text-xs font-bold text-gray-800">
                                        Upload / Add Document Record
                                      </p>
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
                                              empId: employee.id,
                                              name: addDocName,
                                              type: addDocType,
                                              size: addDocSize,
                                              date: new Date().toISOString().slice(0, 10),
                                              uploader: "Manvendra Singhal",
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
                            {rec === "Payroll Records" &&
                              (() => {
                                const empPay = payroll.filter((p) => p.empId === employee.id);
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
                                          {empPay.map((p) => (
                                            <tr key={p.id} className="hover:bg-gray-50">
                                              <td className="p-2.5 font-medium">{p.month}</td>
                                              <td className="p-2.5 text-gray-800 font-bold">
                                                ₹{p.salary.toLocaleString("en-IN")}
                                              </td>
                                              <td className="p-2.5 text-muted-foreground">
                                                {p.txId}
                                              </td>
                                              <td className="p-2.5 text-muted-foreground">
                                                {p.date}
                                              </td>
                                              <td className="p-2.5">
                                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                                  {p.status}
                                                </span>
                                              </td>
                                              <td className="p-2.5 text-right">
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                  onClick={() =>
                                                    setPayroll(
                                                      payroll.filter((item) => item.id !== p.id),
                                                    )
                                                  }
                                                >
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                              </td>
                                            </tr>
                                          ))}
                                          {empPay.length === 0 && (
                                            <tr>
                                              <td
                                                colSpan={6}
                                                className="p-4 text-center text-muted-foreground"
                                              >
                                                No payroll slips logged.
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>

                                    <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5">
                                      <p className="text-xs font-bold text-gray-800">
                                        Record Salary Disbursal
                                      </p>
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
                                            if (!addPayMonth || !addPaySalary)
                                              return alert("Please fill month and amount");
                                            const newP = {
                                              id: `PAY-${Date.now()}`,
                                              empId: employee.id,
                                              month: addPayMonth,
                                              salary: parseInt(addPaySalary),
                                              status: addPayStatus,
                                              txId: `TXN${Math.floor(100000 + Math.random() * 900000)}`,
                                              date: new Date().toISOString().slice(0, 10),
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
                            {rec === "Company Assets" &&
                              (() => {
                                const empAssets = assets.filter((a) => a.empId === employee.id);
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
                                          {empAssets.map((a) => (
                                            <tr key={a.id} className="hover:bg-gray-50">
                                              <td className="p-2.5 font-medium">{a.name}</td>
                                              <td className="p-2.5 text-muted-foreground">
                                                {a.type}
                                              </td>
                                              <td className="p-2.5 text-muted-foreground font-mono">
                                                {a.serial}
                                              </td>
                                              <td className="p-2.5 text-muted-foreground">
                                                {a.date}
                                              </td>
                                              <td className="p-2.5 text-right">
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                  onClick={() =>
                                                    setAssets(
                                                      assets.filter((item) => item.id !== a.id),
                                                    )
                                                  }
                                                >
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                              </td>
                                            </tr>
                                          ))}
                                          {empAssets.length === 0 && (
                                            <tr>
                                              <td
                                                colSpan={5}
                                                className="p-4 text-center text-muted-foreground"
                                              >
                                                No assets assigned.
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>

                                    <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5">
                                      <p className="text-xs font-bold text-gray-800">
                                        Assign Company Asset
                                      </p>
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
                                            if (!addAssetName || !addAssetSerial)
                                              return alert(
                                                "Please fill asset name and serial number",
                                              );
                                            const newAst = {
                                              id: `AST-${Date.now()}`,
                                              empId: employee.id,
                                              name: addAssetName,
                                              serial: addAssetSerial,
                                              type: addAssetType,
                                              value: 30000,
                                              date: new Date().toISOString().slice(0, 10),
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
                            {rec === "Training Certificates" &&
                              (() => {
                                const empCerts = certificates.filter(
                                  (c) => c.empId === employee.id,
                                );
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
                                          {empCerts.map((c) => (
                                            <tr key={c.id} className="hover:bg-gray-50">
                                              <td className="p-2.5 font-medium flex items-center gap-1.5">
                                                <Award className="h-3.5 w-3.5 text-[#FF6B00]" />
                                                <span>{c.name}</span>
                                              </td>
                                              <td className="p-2.5 text-muted-foreground">
                                                {c.issuer}
                                              </td>
                                              <td className="p-2.5 text-muted-foreground">
                                                {c.date}
                                              </td>
                                              <td className="p-2.5 text-right">
                                                <Button
                                                  variant="ghost"
                                                  size="icon"
                                                  className="h-7 w-7 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                  onClick={() =>
                                                    setCertificates(
                                                      certificates.filter(
                                                        (item) => item.id !== c.id,
                                                      ),
                                                    )
                                                  }
                                                >
                                                  <Trash2 className="h-3.5 w-3.5" />
                                                </Button>
                                              </td>
                                            </tr>
                                          ))}
                                          {empCerts.length === 0 && (
                                            <tr>
                                              <td
                                                colSpan={4}
                                                className="p-4 text-center text-muted-foreground"
                                              >
                                                No certificates logged.
                                              </td>
                                            </tr>
                                          )}
                                        </tbody>
                                      </table>
                                    </div>

                                    <div className="bg-white p-3.5 rounded-lg border border-gray-200 space-y-2.5">
                                      <p className="text-xs font-bold text-gray-800">
                                        Add Training Certificate
                                      </p>
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
                                            if (!addCertName || !addCertIssuer)
                                              return alert(
                                                "Please fill certificate name and issuer",
                                              );
                                            const newCert = {
                                              id: `CRT-${Date.now()}`,
                                              empId: employee.id,
                                              name: addCertName,
                                              issuer: addCertIssuer,
                                              date: new Date().toISOString().slice(0, 10),
                                              url: "#",
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
              </Card>


            </div>
          </div>
        </DialogContent>

      {/* ── Login Credentials Modal ── */}
      {showCredModal && (
        <Dialog open={showCredModal} onOpenChange={setShowCredModal}>
          <DialogContent className="max-w-sm" aria-describedby="cred-modal-desc">
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <Key className="h-4 w-4 text-purple-600" />
              Set Login Credentials
            </DialogTitle>
            <DialogDescription id="cred-modal-desc" className="text-xs text-muted-foreground">
              Assign a username and password so{" "}
              <span className="font-semibold text-gray-800">{employee.name}</span> can log in to the
              CRM portal.
            </DialogDescription>
            <div className="mt-2 space-y-4">
              {/* Username */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Username
                </label>
                <Input
                  value={credUsername}
                  onChange={(e) => setCredUsername(e.target.value)}
                  placeholder="e.g. nikita"
                  className="h-9 text-sm focus-visible:ring-purple-500"
                />
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5" /> Password
                </label>
                <div className="relative">
                  <Input
                    type={showCredPass ? "text" : "password"}
                    value={credPassword}
                    onChange={(e) => setCredPassword(e.target.value)}
                    placeholder="Min. 4 characters"
                    className="h-9 text-sm pr-10 focus-visible:ring-purple-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCredPass(!showCredPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-gray-700"
                  >
                    {showCredPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5" /> Confirm Password
                </label>
                <Input
                  type={showCredPass ? "text" : "password"}
                  value={credConfirm}
                  onChange={(e) => setCredConfirm(e.target.value)}
                  placeholder="Re-enter password"
                  className="h-9 text-sm focus-visible:ring-purple-500"
                />
              </div>

              {/* Error */}
              {credError && (
                <p className="text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {credError}
                </p>
              )}

              {/* Success */}
              {credSaved && (
                <p className="text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 flex items-center gap-2">
                  <Check className="h-4 w-4" /> Credentials saved! Employee can now log in.
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Button
                  onClick={handleSaveCredentials}
                  className="flex-1 gap-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold h-9"
                >
                  <Check className="h-4 w-4" /> Save Credentials
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCredModal(false)}
                  className="flex-1 text-xs h-9"
                >
                  <X className="h-4 w-4 mr-1" /> Cancel
                </Button>
              </div>

              <p className="text-[10px] text-muted-foreground text-center pt-1 border-t border-gray-100">
                Employee ID: <span className="font-mono font-semibold">{employee.id}</span> · Role:{" "}
                <span className="font-semibold">{employee.role}</span>
              </p>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div id={title} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm space-y-4">
      <h3 className="font-bold text-base text-gray-900 border-b border-gray-100 pb-2">{title}</h3>
      <div>{children}</div>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
        {label}
      </label>
      <Input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-xs focus-visible:ring-[#FF6B00]"
      />
    </div>
  );
}

function EditSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex h-8 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
