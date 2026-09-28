import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect, useMemo, useCallback } from "react";
import { getUpcomingHolidays, MASTER_HOLIDAYS } from "@/lib/holidays";
import { Clock, Play, Building2, Square, Users, TrendingUp, Download, Calendar as CalendarIcon, Activity, PlusCircle, Search, FileText, Smartphone, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { getAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";
function formatTime12Hour(timeStr?: string) {
  if (!timeStr) return "";
  const parts = timeStr.split(':');
  if (parts.length < 2) return timeStr;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return timeStr;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

function computeDayAttendance(
  records: any[],
  dateStr: string,
  todayStr: string,
  currentTime: Date
) {
  const isToday = dateStr === todayStr;
  const currentNowSec = currentTime.getHours() * 3600 + currentTime.getMinutes() * 60 + currentTime.getSeconds();

  let hasActive = false;
  const rawIntervals: Array<{ start: number; end: number; isRecActive: boolean; rawCheckin: string; rawCheckout?: string }> = [];

  for (const r of records) {
    if (!r.checkin) continue;
    const [inH, inM] = r.checkin.split(':').map(Number);
    if (isNaN(inH) || isNaN(inM)) continue;
    const startSec = inH * 3600 + inM * 60;

    let endSec = startSec;
    let isRecActive = false;

    if (r.checkout) {
      const [outH, outM] = r.checkout.split(':').map(Number);
      if (!isNaN(outH) && !isNaN(outM)) {
        endSec = Math.max(startSec, outH * 3600 + outM * 60);
      }
    } else if (isToday) {
      isRecActive = true;
      hasActive = true;
      endSec = Math.max(startSec, currentNowSec);
    } else {
      endSec = startSec;
    }

    rawIntervals.push({
      start: startSec,
      end: endSec,
      isRecActive,
      rawCheckin: r.checkin,
      rawCheckout: r.checkout,
    });
  }

  if (rawIntervals.length === 0) {
    return {
      firstIn: "23:59",
      lastOut: "00:00",
      isActive: false,
      workedSecs: 0,
      breakSecs: 0,
      totalSecs: 0,
      workedH: 0,
      workedM: 0,
      workedS: 0,
      breakH: 0,
      breakM: 0,
      totalH: 0,
      totalM: 0,
      isLate: false,
      isHalfDay: false,
      mergedIntervals: [],
    };
  }

  // Sort raw intervals by start ascending, then by duration / end descending
  rawIntervals.sort((a, b) => {
    if (a.start !== b.start) return a.start - b.start;
    return b.end - a.end;
  });

  // Merge overlapping or adjacent intervals
  const merged: Array<{ start: number; end: number; isRecActive: boolean }> = [];
  for (const interval of rawIntervals) {
    if (merged.length === 0) {
      merged.push({ ...interval });
    } else {
      const prev = merged[merged.length - 1];
      if (interval.start <= prev.end) {
        prev.end = Math.max(prev.end, interval.end);
        prev.isRecActive = prev.isRecActive || interval.isRecActive;
      } else {
        merged.push({ ...interval });
      }
    }
  }

  // Calculate worked seconds
  let workedSecs = 0;
  for (const m of merged) {
    workedSecs += Math.max(0, m.end - m.start);
  }

  // Calculate break seconds as sum of gaps between consecutive working periods
  let breakSecs = 0;
  for (let i = 0; i < merged.length - 1; i++) {
    const gap = merged[i + 1].start - merged[i].end;
    if (gap > 0) breakSecs += gap;
  }

  const totalElapsedSecs = workedSecs + breakSecs;

  // Format firstIn & lastOut strings
  const firstInStr = rawIntervals.reduce((minStr, cur) => (cur.rawCheckin < minStr ? cur.rawCheckin : minStr), rawIntervals[0].rawCheckin);

  let lastOutStr = "00:00";
  if (!hasActive) {
    const completedCheckouts = rawIntervals.filter(r => r.rawCheckout).map(r => r.rawCheckout!);
    if (completedCheckouts.length > 0) {
      lastOutStr = [...completedCheckouts].sort().reverse()[0];
    } else {
      lastOutStr = firstInStr;
    }
  }

  const [fH, fM] = firstInStr.split(':').map(Number);
  const isLate = fH > 10 || (fH === 10 && fM > 15);
  const isHalfDay = workedSecs > 0 && workedSecs < 240 * 60 && !hasActive;

  return {
    firstIn: firstInStr,
    lastOut: lastOutStr,
    isActive: hasActive,
    workedSecs,
    breakSecs,
    totalSecs: totalElapsedSecs,
    workedH: Math.floor(workedSecs / 3600),
    workedM: Math.floor((workedSecs % 3600) / 60),
    workedS: workedSecs % 60,
    breakH: Math.floor(breakSecs / 3600),
    breakM: Math.floor((breakSecs % 3600) / 60),
    totalH: Math.floor(totalElapsedSecs / 3600),
    totalM: Math.floor((totalElapsedSecs % 3600) / 60),
    isLate,
    isHalfDay,
    mergedIntervals: merged,
  };
}

export const Route = createFileRoute("/crm/attendance")({
  component: AttendancePage,
});

function AttendancePage() {
  const auth = getAuth();
  const isAdmin = auth?.role === "admin" || auth?.role === "manager";

  const [time, setTime] = useState(new Date());
  const upcomingHolidays = useMemo(() => getUpcomingHolidays(4, time), [time]);
  const [shiftNote, setShiftNote] = useState("");
  const [selectedHistoryEmpId, setSelectedHistoryEmpId] = useState<string>("");
  const [myViewMode, setMyViewMode] = useState<"table" | "calendar">("table");
  const [calendarMonth, setCalendarMonth] = useState(new Date(time.getFullYear(), time.getMonth(), 1));
  const [selectedDayInfo, setSelectedDayInfo] = useState<any>(null);
  const [isDaySheetOpen, setIsDaySheetOpen] = useState(false);

  const [remarkDialogOpen, setRemarkDialogOpen] = useState(false);
  const [remarkDraft, setRemarkDraft] = useState("");
  const [remarkTarget, setRemarkTarget] = useState<{ empId: string, date: string, currentRemark: string } | null>(null);

  const [rawAttendance, setAttendance] = useSupabaseTable<any[]>("attendance", []);
  const [employeesList] = useSupabaseTable<any[]>("employees", []);

  const user = getAuth();
  
  const meInDb = employeesList.find((e: any) => e.name?.toLowerCase().trim() === user?.name?.toLowerCase().trim());
  const myEmpId = user?.empId || (meInDb ? meInDb.id : (user?.name ? `EMP-${user.name.replace(/\s+/g, "").toUpperCase()}` : "EMP001"));
  
  const ceoInDb = employeesList.find((e: any) => e.name === "Manvendra Singhal");
  const ceoId = ceoInDb ? ceoInDb.id : "EMP001";
  
  // Get date in local timezone YYYY-MM-DD
  const todayStr = new Date(time.getTime() - time.getTimezoneOffset() * 60000).toISOString().split("T")[0];

  // Normalize EMP001 records to the actual CEO ID to merge history cards
  // Auto-checkout any active shifts from previous days, or today if past 7:30 PM
  const attendance = rawAttendance.map(a => {
    let rec = (a.employeeid === "EMP001" && myEmpId !== "EMP001") ? { ...a, employeeid: ceoId } : { ...a };
    
    if (!rec.checkout) {
      const isPastDay = rec.date < todayStr;
      const isTodayPastCheckoutTime = rec.date === todayStr && 
        (time.getHours() > 19 || (time.getHours() === 19 && time.getMinutes() >= 30));
        
      if (isPastDay || isTodayPastCheckoutTime) {
        if (rec.checkin && rec.checkin >= "19:30") {
          rec.checkout = rec.checkin;
        } else {
          rec.checkout = "19:30";
        }
        rec.status = "Present";
      }
    }
    return rec;
  });

  const [leaves, setLeaves] = useSupabaseTable<any[]>("leaves", []);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("Casual");
  const [leaveStartDate, setLeaveStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [leaveEndDate, setLeaveEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveSearch, setLeaveSearch] = useState("");
  const currentMonthStr = todayStr.substring(0, 7);
  const [kpiMonth, setKpiMonth] = useState(currentMonthStr);
  const myTodayRecords = [...attendance.filter(a => a.employeeid === myEmpId && a.date === todayStr)].sort((a, b) => (b.checkin || "").localeCompare(a.checkin || ""));
  const myCurrentSession = myTodayRecords.find(a => !a.checkout);

  const isMatchingEmpLeave = useCallback((l: any, empId: string) => {
    if (!l) return false;
    const lEmpId = l.employeeid || l.employee_id || "";
    const lEmpName = l.employee_name || l.name || "";
    if (lEmpId === empId) return true;
    const empRec = employeesList.find((e: any) => e.id === empId || e.empId === empId);
    if (empRec) {
      if (lEmpId === empRec.id || lEmpId === empRec.empId) return true;
      if (empRec.name && lEmpName && empRec.name.toLowerCase().trim() === lEmpName.toLowerCase().trim()) return true;
      if (empRec.name && lEmpId && empRec.name.toLowerCase().trim() === lEmpId.toLowerCase().trim()) return true;
    }
    if (empId === myEmpId && user?.name) {
      if (lEmpName && user.name.toLowerCase().trim() === lEmpName.toLowerCase().trim()) return true;
      if (lEmpId && user.name.toLowerCase().trim() === lEmpId.toLowerCase().trim()) return true;
    }
    return false;
  }, [employeesList, myEmpId, user]);

  const getLeaveDaysCount = (l: any) => {
    const start = l.start_date || l.startdate;
    const end = l.end_date || l.enddate;
    if (!start) return 1;
    if (!end || start === end) return 1;
    const s = new Date(start);
    const e = new Date(end);
    const diffDays = Math.round((e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, isNaN(diffDays) ? 1 : diffDays);
  };

  const myLeaves = useMemo(() => {
    return (leaves || []).filter(l => isMatchingEmpLeave(l, myEmpId));
  }, [leaves, myEmpId, isMatchingEmpLeave]);

  const myApprovedLeaves = useMemo(() => {
    return myLeaves.filter(l => (l.status || "").toLowerCase() === "approved");
  }, [myLeaves]);

  const myPendingLeaves = useMemo(() => {
    return myLeaves.filter(l => (l.status || "").toLowerCase() === "pending" || !l.status);
  }, [myLeaves]);

  const teamPendingLeaves = useMemo(() => {
    return (leaves || []).filter(l => (l.status || "").toLowerCase() === "pending" || !l.status);
  }, [leaves]);

  const casualUsed = useMemo(() => {
    return myApprovedLeaves
      .filter(l => (l.type || "").toLowerCase().includes("casual"))
      .reduce((acc, l) => acc + getLeaveDaysCount(l), 0);
  }, [myApprovedLeaves]);

  const sickUsed = useMemo(() => {
    return myApprovedLeaves
      .filter(l => (l.type || "").toLowerCase().includes("sick"))
      .reduce((acc, l) => acc + getLeaveDaysCount(l), 0);
  }, [myApprovedLeaves]);

  const earnedUsed = useMemo(() => {
    return myApprovedLeaves
      .filter(l => (l.type || "").toLowerCase().includes("earned"))
      .reduce((acc, l) => acc + getLeaveDaysCount(l), 0);
  }, [myApprovedLeaves]);

  const casualBalance = Math.max(0, 12 - casualUsed);
  const sickBalance = Math.max(0, 10 - sickUsed);
  const earnedBalance = Math.max(0, 15 - earnedUsed);

  // Export State
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [exportStartDate, setExportStartDate] = useState("");
  const [exportEndDate, setExportEndDate] = useState("");

  const handleExportCSV = () => {
    const exportableRecords = rawAttendance.filter(a => {
      const d = a.date || "";
      const matchStart = exportStartDate && d ? d >= exportStartDate : true;
      const matchEnd = exportEndDate && d ? d <= exportEndDate : true;
      return matchStart && matchEnd;
    });

    const csvRows = [
      ["Employee ID", "Date", "Check-in", "Check-out", "Status", "Remark"]
    ];

    exportableRecords.forEach(a => {
      csvRows.push([
        `"${a.employeeid}"`,
        `"${a.date}"`,
        `"${a.checkin}"`,
        `"${a.checkout || ""}"`,
        `"${a.status}"`,
        `"${a.remark || ""}"`
      ]);
    });

    const csvContent = csvRows.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `attendance_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsExportOpen(false);
  };

  const [teamSelectedDate, setTeamSelectedDate] = useState<Date>(new Date());
  const teamSelectedDateStr = new Date(teamSelectedDate.getTime() - teamSelectedDate.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  const teamTodayRecords = [...attendance.filter(a => a.date === teamSelectedDateStr)].sort((a, b) => (b.checkin || "").localeCompare(a.checkin || ""));
  const getEmpDetails = (empId: string) => {
    const emp = employeesList.find((e: any) => e.id === empId || e.empId === empId);
    if (emp) return { name: emp.name, role: emp.role || "Employee", initials: emp.name?.charAt(0) || "U", id: emp.id };

    if (empId === myEmpId && user) return { name: user.name, role: user.role, initials: user.name?.charAt(0) || "U", id: myEmpId };
    if (empId === "EMP001") return { name: "Manvendra Singhal", role: "CEO & Founder", initials: "MS", id: "EMP001" };
    return { name: "Unknown Employee", role: "Unknown", initials: "U", id: empId };
  };
  const isClockedIn = !!myCurrentSession;

  const filteredTeamLeaves = useMemo(() => {
    return (leaves || []).filter((leave: any) => {
      if (!leaveSearch.trim()) return true;
      const q = leaveSearch.toLowerCase();
      const emp = getEmpDetails(leave.employeeid || leave.employee_id);
      return (
        (emp.name && emp.name.toLowerCase().includes(q)) ||
        (leave.type && leave.type.toLowerCase().includes(q)) ||
        (leave.reason && leave.reason.toLowerCase().includes(q)) ||
        (leave.status && leave.status.toLowerCase().includes(q)) ||
        (leave.startdate && leave.startdate.includes(q)) ||
        (leave.enddate && leave.enddate.includes(q))
      );
    });
  }, [leaves, leaveSearch, employeesList, user, myEmpId]);

  const filteredMyLeaves = useMemo(() => {
    return myLeaves.filter((leave: any) => {
      if (!leaveSearch.trim()) return true;
      const q = leaveSearch.toLowerCase();
      return (
        (leave.type && leave.type.toLowerCase().includes(q)) ||
        (leave.reason && leave.reason.toLowerCase().includes(q)) ||
        (leave.status && leave.status.toLowerCase().includes(q)) ||
        (leave.startdate && leave.startdate.includes(q)) ||
        (leave.enddate && leave.enddate.includes(q))
      );
    });
  }, [myLeaves, leaveSearch]);

  const uniqueEmpIds = Array.from(new Set(attendance.map((a: any) => a.employeeid)));
  const displayEmpIds = Array.from(new Set([...employeesList.map((e: any) => e.id), ...uniqueEmpIds]));

  const canEditRemarks = isAdmin || user?.name?.toLowerCase().includes("suman");

  const handleSaveRemark = () => {
    if (!remarkTarget) return;
    const updated = rawAttendance.map(a => {
        if (a.employeeid === remarkTarget.empId && a.date === remarkTarget.date) {
            return { ...a, remark: remarkDraft };
        }
        return a;
    });
    setAttendance(updated);
    toast.success("Remark saved successfully!");
    setRemarkDialogOpen(false);
  };

  const handleApplyLeave = () => {
    if (!leaveStartDate || !leaveEndDate || !leaveReason) {
      toast.error("Please fill in all fields");
      return;
    }

    const newLeave = {
      id: crypto.randomUUID(),
      employeeid: myEmpId,
      employee_name: user?.name || meInDb?.name || "Employee",
      type: leaveType,
      startdate: leaveStartDate,
      enddate: leaveEndDate,
      reason: leaveReason,
      status: "Pending",
    };

    setLeaves([newLeave, ...leaves]);
    toast.success("Leave applied successfully!");
    setIsApplyLeaveOpen(false);
    setLeaveType("Casual");
    setLeaveStartDate(new Date().toISOString().split("T")[0]);
    setLeaveEndDate(new Date().toISOString().split("T")[0]);
    setLeaveReason("");
  };

  const handleDeleteRecord = (id: string) => {
    setAttendance(rawAttendance.filter(a => a.id !== id));
    toast.success("Attendance record removed!");
  };

  const handleToggleClock = () => {
    const formattedTimeStr = time.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
    if (isClockedIn && myCurrentSession) {
      setAttendance(
        rawAttendance.map(a => (a.employeeid === myEmpId && a.date === todayStr && !a.checkout) ? { ...a, checkout: formattedTimeStr, status: "Present" } : a)
      );
      toast.success(`Successfully Clocked Out at ${formattedTimeStr}!`);
    } else {
      const newRecord = {
        id: crypto.randomUUID(),
        employeeid: myEmpId,
        date: todayStr,
        checkin: formattedTimeStr,
        checkout: "",
        status: "Active"
      };
      setAttendance([...rawAttendance, newRecord]);
      setShiftNote("");
      toast.success(`Successfully Clocked In at ${formattedTimeStr}!`);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString("en-US", {
    hour12: true,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  // Custom format: Monday, 13 Jul 2026
  const formattedDate = time.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });



  return (
    <main className="flex-1 p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Tabs defaultValue="my-attendance" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight">Attendance</h1>
            <p className="mt-1 text-sm text-muted-foreground">Punch clock, real-time check-ins, and shift management.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsExportOpen(true)} className="gap-2 rounded-xl">
              <Download className="h-4 w-4" /> Export
            </Button>
            <TabsList className="flex bg-muted p-1 rounded-xl w-fit border border-border/80 h-auto">
              <TabsTrigger value="my-attendance" className="px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground">My Attendance</TabsTrigger>
              {isAdmin && (
                <>
                  <TabsTrigger value="team" className="px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground">Team Check-ins</TabsTrigger>
                  <TabsTrigger value="history" className="px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground">Employee History</TabsTrigger>
                </>
              )}
              <TabsTrigger value="leave" className="px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground">Leave Applications</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="my-attendance" className="m-0 border-none p-0 outline-none">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="space-y-6">
              <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-5">
                <div className="text-center">
                  <Clock className="h-10 w-10 text-emerald-500 mx-auto mb-2 animate-pulse" />
                  <h3 className="font-semibold text-lg text-foreground">Shift Punch</h3>
                  <p className="text-3xl font-bold tracking-tight mt-1 text-foreground font-mono">{formattedTime}</p>
                  <p className="text-xs text-muted-foreground mt-1 font-medium">{formattedDate}</p>
                </div>
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs font-semibold text-muted-foreground" htmlFor="work-loc">Work Location</label>
                    <select id="work-loc" className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50" disabled>
                      <option>JTM Mall Office</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs font-semibold text-muted-foreground" htmlFor="shift">Shift / Break</label>
                    <select id="shift" disabled className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-not-allowed text-foreground font-medium">
                      <option value={time.getHours() < 12 ? "Morning Shift" : time.getHours() < 17 ? "Afternoon Shift" : "Evening Shift"}>
                        {time.getHours() < 12 ? "Morning Shift" : time.getHours() < 17 ? "Afternoon Shift" : "Evening Shift"}
                      </option>
                    </select>
                  </div>
                  <div className="space-y-1.5 animate-in fade-in duration-300">
                    <label className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-xs font-semibold text-muted-foreground" htmlFor="checkin-note">Shift Note / Focus</label>
                    <input
                      className="flex w-full border bg-transparent px-3 py-1 shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-xl h-10 text-sm border-border focus-visible:ring-primary/20"
                      id="checkin-note"
                      placeholder="What is your focus for this shift?"
                      value={shiftNote}
                      onChange={(e) => setShiftNote(e.target.value)}
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={handleToggleClock}
                      className={`inline-flex items-center justify-center whitespace-nowrap text-sm cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 px-4 w-full py-6 rounded-2xl font-bold gap-2 text-white shadow-md hover:shadow-lg transition-all hover:scale-[1.01] ${isClockedIn ? "bg-rose-600 hover:bg-rose-700" : "bg-emerald-600 hover:bg-emerald-700"
                        }`}
                    >
                      {isClockedIn ? (
                        <>
                          <Square className="h-4 w-4 fill-white shrink-0" /> Clock Out / End Shift
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 fill-white shrink-0" /> Clock In / Start Shift
                        </>
                      )}
                    </button>
                  </div>
                  <div className="mt-6 space-y-3 pt-4 border-t border-border">
                    <h4 className="text-sm font-bold text-foreground flex justify-between items-center"><span>Today's Punches</span><span className="bg-secondary px-2 py-0.5 rounded-full text-[10px] text-muted-foreground">{myTodayRecords.length} Records</span></h4>
                    {myTodayRecords.map((record) => (
                      <div key={record.id} className="rounded-2xl bg-card border border-border/80 p-4 space-y-3 text-xs animate-in fade-in duration-300 shadow-sm">
                        <div className="flex items-center justify-between border-b border-border/40 pb-2">
                          <span className="text-muted-foreground font-medium">
                            {parseInt(record.checkin.split(':')[0] || "12") < 12 ? "Morning Shift" : parseInt(record.checkin.split(':')[0] || "12") < 17 ? "Afternoon Shift" : "Evening Shift"}
                          </span>
                          <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${record.checkout ? 'text-slate-600 bg-slate-100 dark:bg-slate-800' : 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20'}`}>{record.checkout ? 'COMPLETED' : record.status.toUpperCase()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Clocked In:</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatTime12Hour(record.checkin)} ({record.location || "Office"})</span>
                        </div>
                        {record.checkout && (
                          <div className="flex justify-between items-center pt-1 border-t border-border/40">
                            <span className="text-muted-foreground">Clocked Out:</span>
                            <span className="font-semibold text-red-600 dark:text-red-400">{record.checkout}</span>
                          </div>
                        )}
                        {record.note && (
                          <div className="pt-2 text-center text-muted-foreground italic">"{record.note}"</div>
                        )}
                      </div>
                    ))}
                    {myTodayRecords.length === 0 && (
                      <div className="text-center py-4 text-muted-foreground text-xs">No punches today</div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-indigo-500" />
                    <h3 className="font-semibold text-lg text-foreground">Upcoming Holidays</h3>
                  </div>
                </div>
                <div className="space-y-3">
                  {upcomingHolidays.map((holiday, i) => (
                    <div key={holiday.name + holiday.isoDate} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors">
                      <div>
                        <p className="text-sm font-bold">{holiday.name}</p>
                        <p className="text-xs text-muted-foreground">{holiday.date} • {holiday.day}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${holiday.type === 'National' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                        {holiday.type}
                      </span>
                    </div>
                  ))}
                  {upcomingHolidays.length === 0 && (
                    <div className="text-center py-4 text-xs text-muted-foreground">No upcoming holidays</div>
                  )}
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {(() => {
                const currentHistoryEmpId = (isAdmin && selectedHistoryEmpId) ? selectedHistoryEmpId : myEmpId;
                const currentHistoryEmp = employeesList.find((e: any) => e.id === currentHistoryEmpId) || (currentHistoryEmpId === myEmpId ? (meInDb || { name: auth?.name || "My" }) : null);

                return (
                  <>
                    {/* Top KPI Cards */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg text-foreground">Attendance Statistics</h3>
                        {currentHistoryEmp && (
                          <span className="text-xs bg-primary/10 text-primary font-semibold px-2 py-0.5 rounded-full">
                            {currentHistoryEmp.name || currentHistoryEmpId}
                          </span>
                        )}
                      </div>
                      <select
                        value={kpiMonth}
                        onChange={(e) => setKpiMonth(e.target.value)}
                        className="bg-transparent border border-border text-xs font-semibold rounded-md px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                      >
                        <option value={currentMonthStr}>This Month ({time.toLocaleString('default', { month: 'long', year: 'numeric' })})</option>
                        <option value="all">All Time</option>
                        {Array.from(new Set(attendance.filter((r) => r.employeeid === currentHistoryEmpId).map((r: any) => r.date ? r.date.substring(0, 7) : "")))
                          .filter(m => Boolean(m) && m !== currentMonthStr)
                          .sort()
                          .reverse()
                          .map(m => {
                            const [year, month] = m.split('-');
                            const date = new Date(Number(year), Number(month) - 1, 1);
                            return <option key={m} value={m}>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</option>
                          })}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                      {(() => {
                        const myAllRecords = attendance.filter((record) => record.employeeid === currentHistoryEmpId);
                        const myRecords = kpiMonth === "all" ? myAllRecords : myAllRecords.filter((r: any) => r.date && r.date.startsWith(kpiMonth));
                        
                        // Group by date
                        const dailyGroup = myRecords.reduce((acc: any, record: any) => {
                          if (!record.date) return acc;
                          if (!acc[record.date]) acc[record.date] = [];
                          acc[record.date].push(record);
                          return acc;
                        }, {} as Record<string, any[]>);

                        let present = 0;
                        let late = 0;
                        let overtimeMinutes = 0;
                        let halfDays = 0;
                        let totalWorkedMinutes = 0;

                        Object.entries(dailyGroup).forEach(([dStr, recs]: [string, any]) => {
                          const stats = computeDayAttendance(recs as any[], dStr, todayStr, time);
                          if (stats.isHalfDay) {
                            halfDays++;
                          } else {
                            present++;
                          }
                          if (stats.isLate) late++;
                          const workedMins = Math.floor(stats.workedSecs / 60);
                          if (workedMins > 480) overtimeMinutes += (workedMins - 480);
                          totalWorkedMinutes += workedMins;
                        });

                        // Calculate absent days (past weekdays in range with no attendance, excluding holidays & approved leaves)
                        let absent = 0;
                        const monthsToScan = kpiMonth === "all" 
                          ? Array.from(new Set(myAllRecords.map((r: any) => r.date ? r.date.substring(0, 7) : ""))).filter(Boolean)
                          : [kpiMonth];

                        if (monthsToScan.length === 0) monthsToScan.push(currentMonthStr);

                        monthsToScan.forEach((mStrFull) => {
                          const [yStr, mStr] = mStrFull.split("-");
                          const yNum = Number(yStr);
                          const mNum = Number(mStr) - 1;
                          const totalDays = new Date(yNum, mNum + 1, 0).getDate();
                          for (let d = 1; d <= totalDays; d++) {
                            const dDate = new Date(yNum, mNum, d);
                            const dStr = `${yNum}-${String(mNum + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                            if (dStr > todayStr) continue; // skip future
                            const isWk = dDate.getDay() === 0; // Only Sunday is weekend off (Saturday is a working day)
                            if (isWk) continue;
                            const isHol = MASTER_HOLIDAYS.some(h => h.isoDate === dStr);
                            if (isHol) continue;
                            const isLve = (leaves || []).some((l: any) => 
                              isMatchingEmpLeave(l, currentHistoryEmpId) &&
                              (l.status === 'Approved' || l.status === 'approved') &&
                              dStr >= (l.start_date || l.startdate || '') &&
                              dStr <= (l.end_date || l.enddate || '')
                            );
                            if (isLve) continue;
                            if (!dailyGroup[dStr]) absent++;
                          }
                        });

                        const otHours = Math.floor(overtimeMinutes / 60);
                        const totalActiveDays = present + halfDays;
                        const avgMins = totalActiveDays > 0 ? Math.floor(totalWorkedMinutes / totalActiveDays) : 0;
                        const avgHours = Math.floor(avgMins / 60);
                        const avgM = avgMins % 60;

                        return (
                          <>
                            <div className="bg-card rounded-2xl border border-border p-4 shadow-sm flex flex-col justify-between">
                              <span className="text-xs font-semibold text-muted-foreground uppercase">Present</span>
                              <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">{present}</div>
                            </div>
                            <div className="bg-card rounded-2xl border border-border p-4 shadow-sm flex flex-col justify-between">
                              <span className="text-xs font-semibold text-muted-foreground uppercase">Absent</span>
                              <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-2">{absent}</div>
                            </div>
                            <div className="bg-card rounded-2xl border border-border p-4 shadow-sm flex flex-col justify-between">
                              <span className="text-xs font-semibold text-muted-foreground uppercase">Late</span>
                              <div className="text-2xl font-bold text-amber-500 mt-2">{late}</div>
                            </div>
                            <div className="bg-card rounded-2xl border border-border p-4 shadow-sm flex flex-col justify-between">
                              <span className="text-xs font-semibold text-muted-foreground uppercase">Half Day</span>
                              <div className="text-2xl font-bold text-indigo-500 mt-2">{halfDays}</div>
                            </div>
                            <div className="bg-card rounded-2xl border border-border p-4 shadow-sm flex flex-col justify-between">
                              <span className="text-xs font-semibold text-muted-foreground uppercase">Overtime</span>
                              <div className="text-2xl font-bold text-purple-500 mt-2">{otHours}h</div>
                            </div>
                            <div className="bg-card rounded-2xl border border-border p-4 shadow-sm flex flex-col justify-between">
                              <span className="text-xs font-semibold text-muted-foreground uppercase">Avg Hours</span>
                              <div className="text-2xl font-bold text-blue-500 mt-2">{avgHours}h {avgM}m</div>
                            </div>
                          </>
                        );
                      })()}
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-semibold text-lg">
                          {currentHistoryEmpId === myEmpId ? (auth?.name ? `${auth.name}'s Attendance` : "My Attendance") : `${currentHistoryEmp?.name || currentHistoryEmpId}'s Attendance`}
                        </h3>
                        {isAdmin && (
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground font-medium">Viewing:</span>
                            <select
                              value={selectedHistoryEmpId || myEmpId}
                              onChange={(e) => setSelectedHistoryEmpId(e.target.value === myEmpId ? "" : e.target.value)}
                              className="bg-secondary border border-border text-xs font-semibold rounded-lg px-2.5 py-1 text-foreground outline-none focus:ring-1 focus:ring-primary cursor-pointer max-w-[200px]"
                            >
                              <option value={myEmpId}>👤 My Records ({auth?.name || "Me"})</option>
                              {employeesList
                                .filter((e: any) => e.id !== myEmpId)
                                .map((e: any) => (
                                  <option key={e.id} value={e.id}>
                                    {e.name} ({e.designation || e.role || e.id})
                                  </option>
                                ))}
                            </select>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground font-medium">
                          {attendance.filter((record) => record.employeeid === currentHistoryEmpId).length} total shifts logged
                        </span>
                        <div className="flex items-center bg-secondary p-1 rounded-lg">
                          <button
                            onClick={() => setMyViewMode("table")}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${myViewMode === "table" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                          >
                            Table
                          </button>
                          <button
                            onClick={() => setMyViewMode("calendar")}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${myViewMode === "calendar" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                          >
                            Calendar
                          </button>
                        </div>
                      </div>
                    </div>

                    {myViewMode === "table" ? (
                      <div className="space-y-4">
                        {(() => {
                          const myRecords = attendance.filter((record) => record.employeeid === currentHistoryEmpId);
                          
                          if (myRecords.length === 0) {
                            return (
                              <div className="bg-card rounded-3xl border border-border p-8 text-center text-muted-foreground shadow-sm">
                                No attendance history found for this employee.
                              </div>
                            );
                          }

                          // Group by date
                          const grouped = myRecords.reduce((acc: any, record: any) => {
                            if (!record.date) return acc;
                            if (!acc[record.date]) acc[record.date] = [];
                            acc[record.date].push(record);
                            return acc;
                          }, {});

                          return Object.entries(grouped)
                            .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                            .map(([date, records]: [string, any]) => {
                              const parsedDate = new Date(date + "T00:00:00");
                              const displayDate = parsedDate.toLocaleDateString("en-GB", { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
                              
                              let dayRemark = "";
                              records.forEach((r: any) => {
                                if (r.remark) dayRemark = r.remark;
                              });

                              const stats = computeDayAttendance(records, date, todayStr, time);
                              const { firstIn, lastOut, isActive, isLate, isHalfDay, workedH, workedM, workedS, breakH, breakM, totalH, totalM } = stats;

                              // For visual timeline (assume 10 AM to 6 PM standard bounds for the bar width)
                              const getPercent = (timeStr: string | null, isOutActive: boolean = false) => {
                                if (!timeStr) {
                                   if (isOutActive) {
                                      const now = new Date();
                                      const currentMin = (now.getHours() * 60) + now.getMinutes();
                                      return Math.max(0, Math.min(100, ((currentMin - 600) / 480) * 100));
                                   }
                                   return 100;
                                }
                                const [h, m] = timeStr.split(':').map(Number);
                                const tMin = (h * 60) + m;
                                return Math.max(0, Math.min(100, ((tMin - 600) / 480) * 100));
                              };

                              return (
                                <div key={date} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                  {/* Card Header */}
                                  <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-secondary/20">
                                    <div className="flex items-center gap-3">
                                      <div className="h-10 w-10 rounded-xl bg-primary/10 flex flex-col items-center justify-center text-primary">
                                        <span className="text-[10px] font-bold uppercase leading-none">{parsedDate.toLocaleDateString('en-GB', { month: 'short' })}</span>
                                        <span className="text-lg font-black leading-none">{parsedDate.getDate()}</span>
                                      </div>
                                      <div>
                                        <h4 className="font-bold text-foreground">{displayDate}</h4>
                                        <p className="text-xs text-muted-foreground">{records.length} punch{records.length > 1 ? 'es' : ''} logged</p>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      {isHalfDay && <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2.5 py-1 rounded-full text-xs font-bold">Half Day</span>}
                                      {isLate && <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold">Late</span>}
                                      {isActive ? (
                                        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>Active
                                        </span>
                                      ) : (
                                        <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Present
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  
                                  {/* Card Body */}
                                  <div className="p-6">
                                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
                                      <div>
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">First In</p>
                                        <p className="font-bold text-emerald-600 dark:text-emerald-400">{firstIn !== "23:59" ? formatTime12Hour(firstIn) : "--:--"}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Last Out</p>
                                        <p className="font-bold text-rose-600 dark:text-rose-400">{lastOut !== "00:00" ? formatTime12Hour(lastOut) : (isActive ? "Active Shift" : "--:--")}</p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Hours Worked</p>
                                        <p className="font-bold text-foreground">
                                          {workedH}h {workedM}m {isActive && <span className="text-muted-foreground/70 text-xs ml-0.5">{workedS}s</span>}
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Break Time</p>
                                        <p className="font-bold text-amber-600 dark:text-amber-400">
                                          {breakH > 0 ? `${breakH}h ` : ''}{breakM}m
                                        </p>
                                      </div>
                                      <div>
                                        <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Total Time</p>
                                        <p className="font-bold text-blue-600 dark:text-blue-400">
                                          {totalH}h {totalM}m
                                        </p>
                                      </div>
                                    </div>

                                    {/* Timeline Visual */}
                                    {records.length > 1 && (
                                      <div className="mb-4 pt-4 border-t border-border/30">
                                        <p className="text-xs text-muted-foreground font-semibold mb-2">Check-in Segments ({records.length})</p>
                                        <div className="flex flex-wrap gap-2">
                                          {[...records].sort((a: any, b: any) => (a.checkin || "").localeCompare(b.checkin || "")).map((r: any, i: number) => (
                                            <span key={r.id || i} className="text-xs bg-secondary px-2 py-1 rounded-md text-foreground shadow-sm">
                                              {r.checkin ? formatTime12Hour(r.checkin) : '--'} - {r.checkout ? formatTime12Hour(r.checkout) : 'Active'}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {dayRemark && (
                                      <div className="mb-4 pt-4 border-t border-border/30">
                                        <p className="text-xs text-muted-foreground font-semibold mb-1 uppercase tracking-wider">Admin Remark</p>
                                        <p className="font-medium text-slate-700 dark:text-slate-300 text-sm">
                                          {dayRemark}
                                        </p>
                                      </div>
                                    )}

                                    <div className="mt-4 pt-4 border-t border-border/60">
                                      <div className="flex justify-between text-[10px] text-muted-foreground font-semibold mb-1.5 px-1">
                                        <span>10:00 AM</span>
                                        <span>06:00 PM</span>
                                      </div>
                                      <div className="h-3 w-full bg-secondary rounded-full overflow-hidden relative">
                                        <TooltipProvider>
                                          {records.map((r: any, idx: number) => {
                                            const sPct = getPercent(r.checkin);
                                            const isRecActive = !r.checkout;
                                            const ePct = getPercent(r.checkout, isRecActive);
                                            const wPct = Math.max(0.5, ePct - sPct);
                                            const tooltipText = `${r.checkin ? formatTime12Hour(r.checkin) : '--'} - ${r.checkout ? formatTime12Hour(r.checkout) : 'Active'}`;
                                            return (
                                              <Tooltip key={idx}>
                                                <TooltipTrigger asChild>
                                                  <div 
                                                    className={`absolute top-0 bottom-0 ${isRecActive ? 'bg-primary/80 animate-pulse' : 'bg-primary'} rounded-full transition-all duration-1000 cursor-pointer hover:opacity-80`}
                                                    style={{ left: `${sPct}%`, width: `${wPct}%` }}
                                                  />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                  <p className="font-semibold text-xs">{tooltipText}</p>
                                                </TooltipContent>
                                              </Tooltip>
                                            );
                                          })}
                                        </TooltipProvider>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            });
                        })()}
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {(() => {
                          const year = calendarMonth.getFullYear();
                          const month = calendarMonth.getMonth();
                          const firstDay = new Date(year, month, 1).getDay();
                          const daysInMonth = new Date(year, month + 1, 0).getDate();
                          
                          const viewRecords = attendance.filter((record) => record.employeeid === currentHistoryEmpId);
                          
                          // Group by date
                          const dailyTotals: any = Object.values(
                            viewRecords.reduce((acc: any, record: any) => {
                              if (!record.date) return acc;
                              if (!acc[record.date]) {
                                acc[record.date] = { date: record.date, records: [], remark: record.remark || "" };
                              } else if (!acc[record.date].remark && record.remark) {
                                acc[record.date].remark = record.remark;
                              }
                              acc[record.date].records.push(record);
                              return acc;
                            }, {} as Record<string, any>)
                          ).reduce((acc: any, day: any) => {
                             acc[day.date] = day;
                             return acc;
                          }, {} as any);

                          const days = [];
                          for (let i = 0; i < firstDay; i++) {
                              days.push(<div key={`pad-${i}`} className="h-28 bg-secondary/10 border-r border-b border-border/50"></div>);
                          }
                          for (let d = 1; d <= daysInMonth; d++) {
                              const dateObj = new Date(year, month, d);
                              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
                              const dayData = dailyTotals[dateStr];
                              const isWeekend = dateObj.getDay() === 0; // Only Sunday is weekend off (Saturday is a working day)
                              const isFuture = dateStr > todayStr;
                              const holiday = MASTER_HOLIDAYS.find(h => h.isoDate === dateStr);
                              
                              // Check approved leave
                              const employeeLeaves = (leaves || []).filter((l: any) => 
                                isMatchingEmpLeave(l, currentHistoryEmpId) &&
                                (l.status === 'Approved' || l.status === 'approved') &&
                                dateStr >= (l.start_date || l.startdate || '') &&
                                dateStr <= (l.end_date || l.enddate || '')
                              );
                              const hasLeave = employeeLeaves.length > 0;
                              
                              let status = "Absent";
                              let color = "text-rose-600 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40";
                              let displayStr = "🔴 Absent";
                              let tooltip = "No check-in recorded";

                              if (dayData) {
                                  const dayStats = computeDayAttendance(dayData.records, dateStr, todayStr, time);
                                  const { firstIn, lastOut, isHalfDay: dayHalf, isLate: dayLate, workedH, workedM, breakH, breakM, totalH, totalM, isActive } = dayStats;
                                  
                                  if (dayHalf) {
                                      status = "Half Day"; color = "text-amber-600 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40"; displayStr = `🟡 Half Day`; 
                                  } else {
                                      status = "Present"; color = "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40"; displayStr = `🟢 ${totalH}h ${totalM}m`;
                                  }
                                  tooltip = `Clock In: ${firstIn !== "23:59" ? formatTime12Hour(firstIn) : '--:--'}\nClock Out: ${lastOut !== "00:00" ? formatTime12Hour(lastOut) : (isActive ? 'Active Shift' : '--:--')}\nHours Worked: ${workedH}h ${workedM}m\nBreak Time: ${breakH > 0 ? `${breakH}h ` : ''}${breakM}m\nTotal Time: ${totalH}h ${totalM}m`;
                              } else if (hasLeave) {
                                  status = "Leave"; color = "text-blue-600 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40"; displayStr = "🟣 Leave"; tooltip = `Approved Leave: ${employeeLeaves[0]?.reason || employeeLeaves[0]?.type || 'Leave'}`;
                              } else if (holiday) {
                                  status = "Holiday"; color = "text-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-900/40"; displayStr = `🎉 ${holiday.name}`; tooltip = `Official Holiday: ${holiday.name} (${holiday.type})`;
                              } else if (isWeekend) {
                                  status = "Weekend"; color = "text-slate-500 bg-slate-100 dark:bg-slate-800/60"; displayStr = "⚪ Weekend"; tooltip = "Weekend";
                              } else if (isFuture) {
                                  status = "Upcoming"; color = "text-muted-foreground/60 bg-secondary/10 border border-dashed border-border/40"; displayStr = "—"; tooltip = "Upcoming Working Day";
                              }

                              let dayStats: any = null;
                              let isLate = false;
                              if (dayData) {
                                dayStats = computeDayAttendance(dayData.records, dateStr, todayStr, time);
                                isLate = dayStats.isLate;
                              }

                              days.push(
                                <TooltipProvider key={d}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <div 
                                        onClick={() => { 
                                          setSelectedDayInfo(dayData ? { ...dayData, ...dayStats, employeeid: currentHistoryEmpId } : { 
                                            date: dateStr, 
                                            isAbsent: !isWeekend && !isFuture && !holiday && !hasLeave,
                                            isWeekend,
                                            isFuture,
                                            holiday: holiday?.name,
                                            hasLeave,
                                            leaveDetails: employeeLeaves[0],
                                            employeeid: currentHistoryEmpId 
                                          }); 
                                          setIsDaySheetOpen(true); 
                                        }} 
                                        className="h-28 p-2 border-r border-b border-border/50 hover:bg-secondary/20 cursor-pointer transition-all relative flex flex-col justify-between group overflow-hidden"
                                      >
                                        <div className="flex justify-between items-start">
                                          <span className={`text-sm font-semibold ${dayData ? 'text-foreground' : 'text-muted-foreground'}`}>{d}</span>
                                          {isLate && dayData && <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1 rounded">LATE</span>}
                                          {holiday && !dayData && <span className="text-[8px] font-bold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 px-1 py-0.5 rounded uppercase">HOLIDAY</span>}
                                        </div>
                                        <div className={`text-[11px] font-bold px-1.5 py-1 rounded-md text-center shadow-sm transition-transform group-hover:scale-105 flex items-center justify-center min-w-0 overflow-hidden ${color}`}>
                                          <span className="truncate whitespace-nowrap block max-w-full">{displayStr}</span>
                                        </div>
                                      </div>
                                    </TooltipTrigger>
                                    <TooltipContent className="whitespace-pre-line text-xs">
                                      {tooltip}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              );
                          }

                          return (
                              <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300">
                                  <div className="flex items-center justify-between p-4 border-b border-border/60 bg-secondary/10">
                                      <Button variant="outline" size="sm" onClick={() => setCalendarMonth(new Date(year, month - 1, 1))}>&lt; Prev</Button>
                                      <div className="text-center">
                                        <h3 className="font-bold text-xl tracking-tight">{calendarMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h3>
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={() => setCalendarMonth(new Date(time.getFullYear(), time.getMonth(), 1))}>Today</Button>
                                        <Button variant="outline" size="sm" onClick={() => setCalendarMonth(new Date(year, month + 1, 1))}>Next &gt;</Button>
                                      </div>
                                  </div>
                                  <div className="grid grid-cols-7 bg-secondary/30 border-b border-border/60">
                                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                          <div key={day} className="py-3 text-center text-xs font-bold uppercase tracking-wider text-muted-foreground">{day}</div>
                                      ))}
                                  </div>
                                  <div className="grid grid-cols-7 border-l border-t border-border/50 bg-background">
                                     {days}
                                  </div>
                                  <div className="p-4 border-t border-border/60 bg-secondary/10 flex flex-wrap gap-4 items-center justify-center text-xs font-medium text-muted-foreground">
                                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Present</span>
                                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-rose-500"></span> Absent</span>
                                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-amber-500"></span> Half Day</span>
                                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span> Leave</span>
                                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-indigo-500"></span> Holiday</span>
                                    <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-400"></span> Weekend</span>
                                  </div>
                              </div>
                          );
                        })()}
                      </div>
                    )}
                  </>
                );
              })()}
            </div>
          </div>
        </TabsContent>

        {isAdmin && (
          <>
            <TabsContent value="team" className="m-0 border-none p-0 outline-none space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Present Today</span>
                    <Users className="h-4 w-4 text-emerald-500" />
                  </div>
                  <div className="text-2xl font-bold">{teamTodayRecords.length}<span className="text-muted-foreground text-lg"> / {employeesList.length}</span></div>
                  <p className="text-xs text-muted-foreground">Checked-in staff</p>
                </div>
                <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attendance Rate</span>
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold">{Math.round((teamTodayRecords.length / (employeesList.length || 1)) * 100) || 0}%</div>
                  <p className="text-xs text-muted-foreground">Active ratio</p>
                </div>
                <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Active Shifts</span>
                    <Clock className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="text-2xl font-bold">{teamTodayRecords.filter(r => !r.checkout).length}</div>
                  <p className="text-xs text-muted-foreground">Still on clock</p>
                </div>
              </div>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="relative w-full md:w-96">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input placeholder="Search team member, role, or location..." className="flex h-10 w-full rounded-full border border-border bg-background px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="flex items-center gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className="flex items-center text-sm font-medium border border-border rounded-full h-10 px-4 bg-background hover:bg-secondary/50 transition-colors">
                        Selected Date: {format(teamSelectedDate, "dd/MM/yyyy")} <CalendarIcon className="h-4 w-4 ml-2 text-muted-foreground" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        mode="single"
                        selected={teamSelectedDate}
                        onSelect={(date) => date && setTeamSelectedDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-4">
                {teamTodayRecords.length > 0 ? (
                  Object.values(
                    teamTodayRecords.reduce((acc: any, record: any) => {
                      if (!acc[record.employeeid]) {
                        acc[record.employeeid] = {
                          employeeid: record.employeeid,
                          id: record.id,
                          records: [],
                          firstIn: record.checkin || "23:59",
                          lastOut: record.checkout || "00:00",
                          isActive: false,
                          totalSecs: 0,
                          notes: [],
                          locations: [],
                          remark: record.remark || "",
                        };
                      } else {
                        if (!acc[record.employeeid].remark && record.remark) {
                          acc[record.employeeid].remark = record.remark;
                        }
                      }
                      
                      const empGroup = acc[record.employeeid];
                      empGroup.records.push(record);
                      
                      if (record.checkin && record.checkin < empGroup.firstIn) {
                        empGroup.firstIn = record.checkin;
                      }
                      
                      if (record.checkout && record.checkout > empGroup.lastOut) {
                        empGroup.lastOut = record.checkout;
                      }
                      if (record.checkin && record.checkin > empGroup.lastOut) {
                        empGroup.lastOut = record.checkin;
                      }
                      if (!record.checkout) {
                        empGroup.isActive = true;
                      }

                      if (record.checkin && record.checkout) {
                        const [inH, inM] = record.checkin.split(':').map(Number);
                        const [outH, outM] = record.checkout.split(':').map(Number);
                        let diff = (outH * 3600 + outM * 60) - (inH * 3600 + inM * 60);
                        if (diff > 0) empGroup.totalSecs += diff;
                      } else if (!record.checkout && record.checkin && teamSelectedDateStr === todayStr) {
                        const [inH, inM] = record.checkin.split(':').map(Number);
                        let diff = (time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds()) - (inH * 3600 + inM * 60);
                        if (diff > 0) empGroup.totalSecs += diff;
                      }

                      if (record.note && !empGroup.notes.includes(record.note)) empGroup.notes.push(record.note);
                      if (record.location && !empGroup.locations.includes(record.location)) empGroup.locations.push(record.location);

                      return acc;
                    }, {})
                  ).map((empGroup: any) => {
                    const empDetails = getEmpDetails(empGroup.employeeid);
                    const stats = computeDayAttendance(empGroup.records, teamSelectedDateStr, todayStr, time);
                    const { firstIn, lastOut, isActive, isLate, isHalfDay, workedH, workedM, workedS, breakH, breakM, totalH, totalM, workedSecs } = stats;

                    const getPercent = (timeStr: string | null, isOutActive: boolean = false) => {
                      if (!timeStr) {
                         if (isOutActive) {
                            const now = new Date();
                            const currentMin = (now.getHours() * 60) + now.getMinutes();
                            return Math.max(0, Math.min(100, ((currentMin - 600) / 480) * 100));
                         }
                         return 100;
                      }
                      const [h, m] = timeStr.split(':').map(Number);
                      const tMin = (h * 60) + m;
                      return Math.max(0, Math.min(100, ((tMin - 600) / 480) * 100));
                    };

                    return (
                      <div key={empGroup.id} onClick={() => { setSelectedDayInfo({ ...empGroup, ...stats, date: teamSelectedDateStr, hasActive: isActive, totalSeconds: workedSecs, isAbsent: false }); setIsDaySheetOpen(true); }} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-border/60 bg-secondary/20">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                              {empDetails.initials || "U"}
                            </div>
                            <div>
                              <h4 className="font-bold text-foreground">{empDetails.name}</h4>
                              <p className="text-xs text-muted-foreground">{empDetails.role} • {empGroup.locations.join(", ") || "Office"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isHalfDay && <span className="bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400 px-2.5 py-1 rounded-full text-xs font-bold">Half Day</span>}
                            {isLate && <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-1 rounded-full text-xs font-bold">Late</span>}
                            {isActive ? (
                              <span className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></span>Active
                              </span>
                            ) : (
                              <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>Present
                              </span>
                            )}
                          </div>
                        </div>
                        
                        <div className="p-6">
                          <div className="grid grid-cols-2 sm:grid-cols-7 gap-4 mb-6">
                            <div>
                              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Clock In</p>
                              <p className="font-bold text-primary dark:text-primary">{firstIn !== "23:59" ? formatTime12Hour(firstIn) : "--:--"}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Clock Out</p>
                              <p className="font-bold text-rose-600 dark:text-rose-400">{lastOut !== "00:00" ? formatTime12Hour(lastOut) : (isActive ? "Active Shift" : "--:--")}</p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Hours Worked</p>
                              <p className="font-bold text-foreground">
                                {workedH}h {workedM}m {isActive && <span className="text-muted-foreground/70 text-xs ml-0.5">{workedS}s</span>}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Break Time</p>
                              <p className="font-bold text-amber-600 dark:text-amber-400">
                                {breakH > 0 ? `${breakH}h ` : ''}{breakM}m
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Total Time</p>
                              <p className="font-bold text-blue-600 dark:text-blue-400">
                                {totalH}h {totalM}m
                              </p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Focus Note</p>
                              <p className="font-medium text-slate-600 dark:text-slate-400 italic">"{empGroup.notes.join(" | ") || "No note provided"}"</p>
                            </div>
                            {(empGroup.remark || canEditRemarks) && (
                              <div className="col-span-2">
                                <div className="flex items-center justify-between mb-1">
                                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Admin Remark</p>
                                  {canEditRemarks && (
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="h-6 px-3 text-xs bg-orange-100 hover:bg-orange-200 text-orange-900 rounded-full font-semibold"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setRemarkTarget({ empId: empGroup.employeeid, date: teamSelectedDateStr, currentRemark: empGroup.remark || "" });
                                        setRemarkDraft(empGroup.remark || "");
                                        setRemarkDialogOpen(true);
                                      }}
                                    >
                                      {empGroup.remark ? "Edit" : "Add"}
                                    </Button>
                                  )}
                                </div>
                                <p className="font-medium text-slate-600 dark:text-slate-400 text-sm">{empGroup.remark || "--"}</p>
                              </div>
                            )}
                          </div>

                          {empGroup.records.length > 1 && (
                            <div className="mb-4 pt-4 border-t border-border/30">
                              <p className="text-xs text-muted-foreground font-semibold mb-2">Check-in Segments ({empGroup.records.length})</p>
                              <div className="flex flex-wrap gap-2">
                                {([...empGroup.records] as any[]).sort((a: any, b: any) => (a.checkin || "").localeCompare(b.checkin || "")).map((r: any, i: number) => (
                                  <span key={r.id || i} className="text-xs bg-secondary px-2 py-1 rounded-md text-foreground shadow-sm">
                                    {r.checkin ? formatTime12Hour(r.checkin) : '--'} - {r.checkout ? formatTime12Hour(r.checkout) : 'Active'}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="mt-4 pt-4 border-t border-border/60">
                            <div className="flex justify-between text-[10px] text-muted-foreground font-semibold mb-1.5 px-1">
                              <span>10:00 AM</span>
                              <span>06:00 PM</span>
                            </div>
                            <div className="h-3 w-full bg-secondary rounded-full overflow-hidden relative">
                              <TooltipProvider>
                                {empGroup.records.map((r: any, idx: number) => {
                                  const sPct = getPercent(r.checkin);
                                  const isRecActive = !r.checkout;
                                  const ePct = getPercent(r.checkout, isRecActive);
                                  const wPct = Math.max(0.5, ePct - sPct);
                                  const tooltipText = `${r.checkin ? formatTime12Hour(r.checkin) : '--'} - ${r.checkout ? formatTime12Hour(r.checkout) : 'Active'}`;
                                  return (
                                    <Tooltip key={idx}>
                                      <TooltipTrigger asChild>
                                        <div 
                                          className={`absolute top-0 bottom-0 ${isRecActive ? 'bg-emerald-400 animate-pulse' : 'bg-primary'} rounded-full transition-all duration-1000 cursor-pointer hover:opacity-80`}
                                          style={{ left: `${sPct}%`, width: `${wPct}%` }}
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p className="font-semibold text-xs">{tooltipText}</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  );
                                })}
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="bg-card rounded-3xl border border-border p-8 text-center text-muted-foreground shadow-sm">
                    No team check-ins today.
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="history" className="m-0 border-none p-0 outline-none space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayEmpIds.length === 0 ? (
                  <div className="col-span-full rounded-3xl border border-border border-dashed bg-secondary/30 p-24 text-center">
                    <Users className="h-10 w-10 text-muted-foreground/40 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">No attendance history found across any employees.</p>
                  </div>
                ) : (
                  displayEmpIds.map(empId => {
                    const details = getEmpDetails(empId as string);
                    const empRecords = attendance.filter((a: any) => a.employeeid === empId).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    const dailyTotals = Object.values(
                      empRecords.reduce((acc: any, record: any) => {
                        if (!acc[record.date]) {
                          acc[record.date] = { date: record.date, records: [], remark: record.remark || "" };
                        } else {
                          if (!acc[record.date].remark && record.remark) {
                            acc[record.date].remark = record.remark;
                          }
                        }
                        acc[record.date].records.push(record);
                        return acc;
                      }, {})
                    ).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());

                    return (
                      <div key={empId as string} className="rounded-2xl border border-border bg-card shadow-sm p-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary uppercase">
                            {details.initials || details.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground">{details.name}</h3>
                            <p className="text-xs text-muted-foreground">{dailyTotals.length} Days Logged</p>
                          </div>
                        </div>
                        <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2 custom-scrollbar">
                          {dailyTotals.map((day: any) => {
                            const stats = computeDayAttendance(day.records, day.date, todayStr, time);
                            const { firstIn, lastOut, isActive, workedH, workedM, workedS, workedSecs } = stats;

                            return (
                              <div key={day.date} className="group flex items-start gap-3 rounded-xl border border-border/60 bg-background p-3 shadow-sm hover:border-primary/30 transition-colors">
                                <div className="mt-0.5">
                                  {!isActive ? (
                                    <Square className="h-4 w-4 text-primary" />
                                  ) : (
                                    <Play className="h-4 w-4 text-primary fill-primary" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className="text-sm font-semibold truncate text-foreground">
                                      {day.date}
                                    </p>
                                    <div className="flex items-center gap-2 shrink-0">
                                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${!isActive
                                        ? "bg-secondary text-muted-foreground"
                                        : "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                                        }`}>
                                        {!isActive ? "Completed" : "Active"}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1 bg-secondary/50 px-1.5 py-0.5 rounded-md">
                                      <Clock className="h-3 w-3" />
                                      {firstIn !== "23:59" ? formatTime12Hour(firstIn) : "--:--"} {!isActive ? `- ${lastOut !== "00:00" ? formatTime12Hour(lastOut) : "--:--"}` : ""}
                                    </span>
                                    <span className="flex items-center gap-1 bg-secondary/50 px-1.5 py-0.5 rounded-md truncate max-w-[120px]">
                                      <Building2 className="h-3 w-3 shrink-0" /> Office
                                    </span>
                                    {workedSecs > 0 && (
                                      <span className="flex items-center gap-1 bg-primary/10 text-primary px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                                        {workedH}h {workedM}m
                                        {isActive && <span className="opacity-70 ml-0.5">{workedS}s</span>}
                                      </span>
                                    )}
                                  {canEditRemarks && (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setRemarkTarget({ empId: empId as string, date: day.date, currentRemark: day.remark || "" });
                                        setRemarkDraft(day.remark || "");
                                        setRemarkDialogOpen(true);
                                      }}
                                      className="ml-auto text-[10px] bg-orange-100 hover:bg-orange-200 text-orange-900 px-2 py-0.5 rounded-full font-semibold transition-colors"
                                    >
                                      {day.remark ? "Edit Remark" : "Add Remark"}
                                    </button>
                                  )}
                                  {day.remark && (
                                    <div className="w-full mt-1.5 border-t border-dashed border-border/50 pt-1.5">
                                      <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium italic">
                                        <span className="font-semibold text-primary not-italic mr-1">Admin:</span>{day.remark}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </TabsContent>
          </>
        )}

        <TabsContent value="leave" className="m-0 border-none p-0 outline-none space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Casual Leave Balance</span>
                <CalendarIcon className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{casualBalance}<span className="text-muted-foreground text-lg"> / 12</span></div>
              <p className="text-xs text-muted-foreground">{casualUsed > 0 ? `${casualUsed} day${casualUsed > 1 ? 's' : ''} used` : 'Days remaining'}</p>
            </div>
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sick Leave Balance</span>
                <PlusCircle className="h-4 w-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold">{sickBalance}<span className="text-muted-foreground text-lg"> / 10</span></div>
              <p className="text-xs text-muted-foreground">{sickUsed > 0 ? `${sickUsed} day${sickUsed > 1 ? 's' : ''} used` : 'Days remaining'}</p>
            </div>
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Earned Leave Balance</span>
                <Activity className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold">{earnedBalance}<span className="text-muted-foreground text-lg"> / 15</span></div>
              <p className="text-xs text-muted-foreground">{earnedUsed > 0 ? `${earnedUsed} day${earnedUsed > 1 ? 's' : ''} used` : 'Days remaining'}</p>
            </div>
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Requests</span>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold">{isAdmin ? teamPendingLeaves.length : myPendingLeaves.length}</div>
              <p className="text-xs text-muted-foreground">{isAdmin ? 'Team awaiting approval' : 'Awaiting approval'}</p>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={leaveSearch}
                onChange={(e) => setLeaveSearch(e.target.value)}
                placeholder="Search leaves by employee, reason, or status..."
                className="flex h-10 w-full rounded-full border border-border bg-background px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsApplyLeaveOpen(true)}
                className="inline-flex items-center justify-center text-sm font-semibold h-10 px-5 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors"
              >
                + Apply Leave
              </button>
            </div>
          </div>

          {auth?.role === "admin" && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold flex items-center gap-2"><FileText className="h-5 w-5 text-emerald-600" /> Team Leave Applications</h3>
                <span className="text-xs text-muted-foreground font-medium">{filteredTeamLeaves.length} total team applications</span>
              </div>
              <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/40 text-muted-foreground text-xs font-semibold uppercase tracking-wider border-b border-border">
                      <tr>
                        <th className="px-6 py-4 text-center">Employee</th>
                        <th className="px-6 py-4 text-center">Leave Type</th>
                        <th className="px-6 py-4 text-center">Start Date</th>
                        <th className="px-6 py-4 text-center">End Date</th>
                        <th className="px-6 py-4 text-center">Reason</th>
                        <th className="px-6 py-4 text-center">Status</th>
                        <th className="px-6 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/80 text-center">
                      {filteredTeamLeaves.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-muted-foreground italic">
                            {leaveSearch.trim() ? "No team leave applications matched your search." : "No team leave applications found."}
                          </td>
                        </tr>
                      ) : filteredTeamLeaves.map((leave: any) => {
                        const emp = getEmpDetails(leave.employeeid || leave.employee_id);
                        return (
                          <tr key={leave.id} className="hover:bg-secondary/20 transition-colors">
                            <td className="px-6 py-4 font-semibold">{emp.name}</td>
                            <td className="px-6 py-4 text-muted-foreground">{leave.type || "Casual"}</td>
                            <td className="px-6 py-4 text-muted-foreground">{leave.startdate || leave.start_date}</td>
                            <td className="px-6 py-4 font-semibold">{leave.enddate || leave.end_date}</td>
                            <td className="px-6 py-4 text-muted-foreground">{leave.reason || "—"}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                (leave.status || "").toLowerCase() === 'approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                                (leave.status || "").toLowerCase() === 'declined' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' :
                                'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                              }`}>{leave.status || "Pending"}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {(leave.status || "").toLowerCase() === 'pending' || !leave.status ? (
                                <div className="flex items-center justify-end gap-2">
                                  <button onClick={() => {
                                    setLeaves(leaves.map((l: any) => l.id === leave.id ? { ...l, status: 'Approved' } : l));
                                    toast.success("Leave approved");
                                  }} className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors uppercase tracking-wider">Approve</button>
                                  <button onClick={() => {
                                    setLeaves(leaves.map((l: any) => l.id === leave.id ? { ...l, status: 'Declined' } : l));
                                    toast.success("Leave declined");
                                  }} className="bg-rose-100 hover:bg-rose-200 text-rose-700 px-3 py-1.5 rounded-lg text-[10px] font-bold transition-colors uppercase tracking-wider">Decline</button>
                                </div>
                              ) : (
                                <button onClick={() => {
                                  setLeaves(leaves.filter((l: any) => l.id !== leave.id));
                                  toast.success("Leave request removed");
                                }} className="text-muted-foreground hover:text-rose-500 hover:underline text-xs font-medium transition-colors">Remove</button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold flex items-center gap-2"><FileText className="h-5 w-5 text-emerald-600" /> My Leave Applications</h3>
              <span className="text-xs text-muted-foreground font-medium">{filteredMyLeaves.length} applications total</span>
            </div>
            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/40 text-muted-foreground text-xs font-semibold uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="px-6 py-4 text-center">Leave Type</th>
                      <th className="px-6 py-4 text-center">Start Date</th>
                      <th className="px-6 py-4 text-center">End Date</th>
                      <th className="px-6 py-4 text-center">Reason</th>
                      <th className="px-6 py-4 text-center">Status</th>
                      <th className="px-6 py-4 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/80 text-center">
                    {filteredMyLeaves.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-sm text-muted-foreground italic">
                          {leaveSearch.trim() ? "No leave applications matched your search." : "You haven't submitted any leave applications."}
                        </td>
                      </tr>
                    ) : filteredMyLeaves.map((leave: any) => (
                      <tr key={leave.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4 font-semibold">{leave.type || "Casual"}</td>
                        <td className="px-6 py-4 text-muted-foreground">{leave.startdate || leave.start_date}</td>
                        <td className="px-6 py-4 font-semibold">{leave.enddate || leave.end_date}</td>
                        <td className="px-6 py-4 text-muted-foreground">{leave.reason || "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            (leave.status || "").toLowerCase() === 'approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' :
                            (leave.status || "").toLowerCase() === 'declined' ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400' :
                            'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400'
                          }`}>{leave.status || "Pending"}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => {
                            setLeaves(leaves.filter((l: any) => l.id !== leave.id));
                            toast.success("Leave request removed");
                          }} className="text-rose-500 hover:underline text-xs font-medium">Cancel</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </TabsContent>
      </Tabs>

      <Dialog open={isApplyLeaveOpen} onOpenChange={setIsApplyLeaveOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Applicant</Label>
              <Input value={user ? user.name : "Current User"} disabled />
            </div>
            <div className="space-y-2">
              <Label>Leave Type</Label>
              <Select value={leaveType} onValueChange={setLeaveType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Casual">Casual Leave</SelectItem>
                  <SelectItem value="Sick">Sick Leave</SelectItem>
                  <SelectItem value="Earned">Earned Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input type="date" value={leaveStartDate} onChange={(e) => setLeaveStartDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input type="date" value={leaveEndDate} onChange={(e) => setLeaveEndDate(e.target.value)} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Input value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} placeholder="e.g. Medical appointment" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsApplyLeaveOpen(false)}>Cancel</Button>
            <Button onClick={handleApplyLeave}>Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Dialog open={isDaySheetOpen} onOpenChange={setIsDaySheetOpen}>
        <DialogContent className="sm:max-w-md overflow-y-auto max-h-[90vh] rounded-3xl p-6">
          {selectedDayInfo && (
            <>
              <DialogHeader className="border-b border-border pb-4 mb-4">
                <DialogTitle className="text-2xl font-bold">
                  {selectedDayInfo?.date ? format(new Date(selectedDayInfo.date), "EEEE, dd MMM yyyy") : "Date Details"}
                </DialogTitle>
                <DialogDescription>
                  Attendance records and shift details for this day.
                </DialogDescription>
              </DialogHeader>
              
          <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-4">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clock In</span>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">{selectedDayInfo?.firstIn && selectedDayInfo.firstIn !== "23:59" ? formatTime12Hour(selectedDayInfo.firstIn) : "--:--"}</p>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Clock Out</span>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                  <p className="text-base font-bold text-rose-600 dark:text-rose-400">{selectedDayInfo?.lastOut && selectedDayInfo.lastOut !== "00:00" ? formatTime12Hour(selectedDayInfo.lastOut) : (selectedDayInfo?.hasActive ? "Active Shift" : "--:--")}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Hours Worked</span>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <p className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedDayInfo?.workedH !== undefined ? `${selectedDayInfo.workedH}h ${selectedDayInfo.workedM}m` : (selectedDayInfo?.totalSeconds ? `${Math.floor(selectedDayInfo.totalSeconds / 3600)}h ${Math.floor((selectedDayInfo.totalSeconds % 3600) / 60)}m` : "0h 0m")}
                    {selectedDayInfo?.hasActive && <span className="text-muted-foreground/70 text-xs ml-1">{selectedDayInfo?.workedS || 0}s</span>}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Break Time</span>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  <p className="text-base font-bold text-amber-600 dark:text-amber-400">
                    {selectedDayInfo?.breakH !== undefined ? (selectedDayInfo.breakH > 0 ? `${selectedDayInfo.breakH}h ` : "") + `${selectedDayInfo.breakM}m` : "0m"}
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Time</span>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  <p className="text-base font-bold text-blue-600 dark:text-blue-400">
                    {selectedDayInfo?.totalH !== undefined ? `${selectedDayInfo.totalH}h ${selectedDayInfo.totalM}m` : (selectedDayInfo?.totalSeconds ? `${Math.floor(selectedDayInfo.totalSeconds / 3600)}h ${Math.floor((selectedDayInfo.totalSeconds % 3600) / 60)}m` : "0h 0m")}
                  </p>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
                <p className="text-base font-bold">
                  {selectedDayInfo?.holiday ? (
                    <span className="inline-flex items-center gap-1.5 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded-md text-xs">
                      🎉 {selectedDayInfo.holiday}
                    </span>
                  ) : selectedDayInfo?.hasLeave ? (
                    <span className="inline-flex items-center gap-1.5 bg-blue-100 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md text-xs">
                      🟣 {selectedDayInfo.leaveDetails?.reason || selectedDayInfo.leaveDetails?.type || "Approved Leave"}
                    </span>
                  ) : selectedDayInfo?.isWeekend ? (
                    <span className="inline-flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md text-xs">
                      ⚪ Weekend
                    </span>
                  ) : selectedDayInfo?.isFuture ? (
                    <span className="inline-flex items-center gap-1.5 bg-secondary text-muted-foreground px-2 py-0.5 rounded-md text-xs">
                      📅 Upcoming
                    </span>
                  ) : selectedDayInfo?.isAbsent ? (
                    <span className="inline-flex items-center gap-1.5 bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-md text-xs">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span> Absent
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md text-xs">
                        <span className={`h-1.5 w-1.5 rounded-full ${selectedDayInfo?.hasActive ? "bg-emerald-500 animate-pulse" : "bg-emerald-500"}`}></span> 
                        {selectedDayInfo?.hasActive ? "Active" : "Present"}
                    </span>
                  )}
                </p>
              </div>

              {(selectedDayInfo?.remark || canEditRemarks) && !selectedDayInfo?.isAbsent && (
                <div className="col-span-2 space-y-2 mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Admin Remark</span>
                    {canEditRemarks && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setRemarkTarget({ empId: selectedDayInfo.employeeid || myEmpId, date: selectedDayInfo.date, currentRemark: selectedDayInfo.remark || "" });
                          setRemarkDraft(selectedDayInfo.remark || "");
                          setRemarkDialogOpen(true);
                        }}
                        className="h-6 px-3 text-xs bg-orange-100 hover:bg-orange-200 text-orange-900 rounded-full font-semibold transition-colors"
                      >
                        {selectedDayInfo.remark ? "Edit" : "Add"}
                      </button>
                    )}
                  </div>
                  <p className="font-medium text-slate-600 dark:text-slate-400">
                    {selectedDayInfo?.remark || "--"}
                  </p>
                </div>
              )}
            </div>
            
            {selectedDayInfo?.firstIn && selectedDayInfo.firstIn > "10:15" && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3 mt-6">
                <div className="bg-amber-100 text-amber-700 p-2 rounded-full shrink-0">⚠️</div>
                <div>
                  <h4 className="font-semibold text-amber-900">Late Arrival</h4>
                  <p className="text-sm text-amber-700">Check-in was after the expected 10:15 AM threshold.</p>
                </div>
              </div>
            )}

            {selectedDayInfo?.records && selectedDayInfo.records.length > 0 && (
              <div className="mt-8">
                <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b border-border pb-2">
                  All Punches Today ({selectedDayInfo.records.length})
                </h4>
                <div className="space-y-3">
                   {selectedDayInfo.records.map((r: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center p-4 bg-secondary/20 rounded-xl border border-border/50">
                        <div className="flex items-center gap-4">
                           <div className="w-1 h-10 bg-primary/40 rounded-full"></div>
                           <div>
                              <p className="font-bold text-foreground text-base">{r.checkin ? formatTime12Hour(r.checkin) : "--:--"}</p>
                              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Clock In</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-rose-600 dark:text-rose-400 text-base">{r.checkout ? formatTime12Hour(r.checkout) : "Active Shift"}</p>
                           <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Clock Out</p>
                        </div>
                      </div>
                   ))}
                </div>
              </div>
            )}
          </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={remarkDialogOpen} onOpenChange={setRemarkDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Admin Remark</DialogTitle>
            <DialogDescription>
              Add or edit a remark for this attendance record. Only visible to Admins and HR.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="remark">Remark</Label>
              <Input
                id="remark"
                value={remarkDraft}
                onChange={(e) => setRemarkDraft(e.target.value)}
                placeholder="Enter a remark or note..."
                autoFocus
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRemarkDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveRemark}>Save Remark</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Modal */}
      <Dialog open={isExportOpen} onOpenChange={setIsExportOpen}>
        <DialogContent className="rounded-3xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Export Attendance</DialogTitle>
            <DialogDescription>
              Filter attendance by date before downloading as CSV.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4 mt-2 mb-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                className="rounded-xl"
                value={exportStartDate}
                onChange={(e) => setExportStartDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                className="rounded-xl"
                value={exportEndDate}
                onChange={(e) => setExportEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" className="rounded-xl px-6" onClick={() => setIsExportOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExportCSV} className="rounded-xl px-6 bg-emerald-600 hover:bg-emerald-700 text-white">
              <Download className="h-4 w-4 mr-2" /> Download CSV
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
