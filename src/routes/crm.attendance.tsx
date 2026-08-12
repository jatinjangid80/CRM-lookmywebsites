import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
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

export const Route = createFileRoute("/crm/attendance")({
  component: AttendancePage,
});

function AttendancePage() {
  const auth = getAuth();
  const isAdmin = auth?.role === "admin" || auth?.role === "manager";

  const [time, setTime] = useState(new Date());
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
  
  const meInDb = employeesList.find((e: any) => e.name === user?.name);
  const myEmpId = user?.empId || (meInDb ? meInDb.id : "EMP001");
  
  const ceoInDb = employeesList.find((e: any) => e.name === "Manvendra Singhal");
  const ceoId = ceoInDb ? ceoInDb.id : myEmpId;
  
  // Get date in local timezone YYYY-MM-DD
  const todayStr = new Date(time.getTime() - time.getTimezoneOffset() * 60000).toISOString().split("T")[0];

  // Normalize EMP001 records to the actual CEO ID to merge history cards
  // Auto-checkout any active shifts from previous days to 10:00 PM (22:00)
  const attendance = rawAttendance.map(a => {
    let rec = a.employeeid === "EMP001" ? { ...a, employeeid: ceoId } : { ...a };
    if (!rec.checkout && rec.date < todayStr) {
      rec.checkout = "22:00";
      rec.status = "Present";
    }
    return rec;
  });

  const [leaves, setLeaves] = useSupabaseTable<any[]>("leaves", []);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("Casual");
  const [leaveStartDate, setLeaveStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [leaveEndDate, setLeaveEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [leaveReason, setLeaveReason] = useState("");
  const [kpiMonth, setKpiMonth] = useState("all");
  const myTodayRecords = [...attendance.filter(a => a.employeeid === myEmpId && a.date === todayStr)].sort((a, b) => (b.checkin || "").localeCompare(a.checkin || ""));
  const myCurrentSession = myTodayRecords.find(a => !a.checkout);

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
    setAttendance(attendance.filter(a => a.id !== id));
    toast.success("Attendance record removed!");
  };

  const handleToggleClock = () => {
    const formattedTimeStr = time.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" });
    if (isClockedIn && myCurrentSession) {
      setAttendance(
        attendance.map(a => a.id === myCurrentSession.id ? { ...a, checkout: formattedTimeStr, status: "Present" } : a)
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
      setAttendance([...attendance, newRecord]);
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
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatTime12Hour(record.checkin)} ({record.location})</span>
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
                  {[
                    { name: "Independence Day", date: "Aug 15, 2026", day: "Saturday", type: "National" },
                    { name: "Raksha Bandhan", date: "Aug 28, 2026", day: "Friday", type: "Restricted" },
                    { name: "Gandhi Jayanti", date: "Oct 2, 2026", day: "Friday", type: "National" },
                    { name: "Diwali", date: "Nov 8, 2026", day: "Sunday", type: "National" },
                  ].map((holiday, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors">
                      <div>
                        <p className="text-sm font-bold">{holiday.name}</p>
                        <p className="text-xs text-muted-foreground">{holiday.date} • {holiday.day}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${holiday.type === 'National' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400' : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                        {holiday.type}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {/* Top KPI Cards */}
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg text-foreground">Attendance Statistics</h3>
                <select
                  value={kpiMonth}
                  onChange={(e) => setKpiMonth(e.target.value)}
                  className="bg-transparent border border-border text-xs font-semibold rounded-md px-3 py-1.5 outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option value="all">All Time</option>
                  {Array.from(new Set(attendance.filter((r) => r.employeeid === myEmpId).map((r: any) => r.date.substring(0, 7)))).sort().reverse().map(m => {
                    const [year, month] = m.split('-');
                    const date = new Date(Number(year), Number(month) - 1, 1);
                    return <option key={m} value={m}>{date.toLocaleString('default', { month: 'long', year: 'numeric' })}</option>
                  })}
                </select>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
                {(() => {
                  const myAllRecords = attendance.filter((record) => record.employeeid === myEmpId);
                  const myRecords = kpiMonth === "all" ? myAllRecords : myAllRecords.filter((r: any) => r.date.startsWith(kpiMonth));
                  
                  // Group by date to get daily totals
                  const dailyTotals = Object.values(
                    myRecords.reduce((acc: any, record: any) => {
                      if (!acc[record.date]) {
                        acc[record.date] = { date: record.date, totalMinutes: 0, firstIn: record.checkin, isPresent: true };
                      }
                      if (record.checkin && record.checkout) {
                        const [inH, inM] = record.checkin.split(':').map(Number);
                        const [outH, outM] = record.checkout.split(':').map(Number);
                        let diff = (outH * 60 + outM) - (inH * 60 + inM);
                        if (diff < 0) diff += 24 * 60;
                        acc[record.date].totalMinutes += diff;
                      }
                      if (record.checkin && record.checkin < acc[record.date].firstIn) {
                        acc[record.date].firstIn = record.checkin;
                      }
                      return acc;
                    }, {})
                  );

                  const present = dailyTotals.length;
                  const absent = 0; // Mock or calculate based on working days
                  
                  let late = 0;
                  let overtimeMinutes = 0;
                  let halfDays = 0;
                  let totalWorkedMinutes = 0;

                  dailyTotals.forEach((day: any) => {
                     // Late if clocked in after 10:15 AM
                     if (day.firstIn) {
                        const [h, m] = day.firstIn.split(':').map(Number);
                        if (h > 10 || (h === 10 && m > 15)) late++;
                     }
                     const effMins = day.totalMinutes >= 240 ? day.totalMinutes - 45 : day.totalMinutes;
                     // Half day if worked less than 4 hours (240 mins)
                     if (effMins > 0 && effMins < 240) halfDays++;
                     // Overtime if worked more than 8 hours (480 mins)
                     if (effMins > 480) overtimeMinutes += (effMins - 480);
                     
                     totalWorkedMinutes += effMins;
                  });

                  const otHours = Math.floor(overtimeMinutes / 60);
                  const avgMins = present > 0 ? Math.floor(totalWorkedMinutes / present) : 0;
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

              <div className="flex items-center justify-between mt-2">
                <h3 className="font-semibold text-lg">{auth?.name ? `${auth.name}'s Attendance History` : "My Attendance History"}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-medium">
                    {attendance.filter((record) => record.employeeid === myEmpId).length} total shifts logged
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
                    const myRecords = attendance.filter((record) => record.employeeid === myEmpId);
                    
                    if (myRecords.length === 0) {
                      return (
                        <div className="bg-card rounded-3xl border border-border p-8 text-center text-muted-foreground shadow-sm">
                          No attendance history found.
                        </div>
                      );
                    }

                    // Group by date
                    const grouped = myRecords.reduce((acc: any, record: any) => {
                      if (!acc[record.date]) acc[record.date] = [];
                      acc[record.date].push(record);
                      return acc;
                    }, {});

                    return Object.entries(grouped)
                      .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                      .map(([date, records]: [string, any]) => {
                        const parsedDate = new Date(date);
                        const displayDate = parsedDate.toLocaleDateString("en-GB", { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' });
                        
                        // Calculate total hours
                        let totalMins = 0;
                        let firstIn = "23:59";
                        let lastOut = "00:00";
                        let isActive = false;
                        let dayRemark = "";

                        records.forEach((r: any) => {
                          if (r.remark) dayRemark = r.remark;
                          if (r.checkin && r.checkin < firstIn) firstIn = r.checkin;
                          if (r.checkout && r.checkout > lastOut) lastOut = r.checkout;
                          if (!r.checkout) isActive = true;

                          if (r.checkin && r.checkout) {
                            const [inH, inM] = r.checkin.split(':').map(Number);
                            const [outH, outM] = r.checkout.split(':').map(Number);
                            let diff = (outH * 60 + outM) - (inH * 60 + inM);
                            if (diff < 0) diff += 24 * 60;
                            totalMins += diff;
                          }
                        });

                        // Add active session
                        let currentSessionSecs = 0;
                        if (isActive) {
                           const activeRecord = records.find((r: any) => !r.checkout);
                           if (activeRecord && activeRecord.checkin) {
                             const [inH, inM] = activeRecord.checkin.split(':').map(Number);
                             // Use 'time' for active tick
                             let diff = (time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds()) - (inH * 3600 + inM * 60);
                             if (diff < 0) diff += 24 * 3600;
                             currentSessionSecs = diff;
                           }
                        }

                        let totalWorkedSecs = totalMins * 60 + currentSessionSecs;
                        let totalWorkedMins = Math.floor(totalWorkedSecs / 60);

                        // Calculate total elapsed
                        let elapsedMins = 0;
                        if (firstIn !== "23:59") {
                          const [inH, inM] = firstIn.split(':').map(Number);
                          let endH, endM;
                          if (isActive) {
                            endH = time.getHours();
                            endM = time.getMinutes();
                          } else if (lastOut !== "00:00") {
                            const [outH, outM] = lastOut.split(':').map(Number);
                            endH = outH; endM = outM;
                          } else {
                            endH = inH; endM = inM;
                          }
                          elapsedMins = (endH * 60 + endM) - (inH * 60 + inM);
                          if (elapsedMins < 0) elapsedMins += 24 * 60;
                        }

                        let breakMins = Math.max(0, Math.floor(elapsedMins - totalWorkedMins));
                        let effectiveSecs = totalWorkedSecs;

                        const workedH = Math.floor(effectiveSecs / 3600);
                        const workedM = Math.floor((effectiveSecs % 3600) / 60);
                        const workedS = effectiveSecs % 60;

                        // Determine status
                        let isLate = false;
                        if (firstIn !== "23:59") {
                           const [h, m] = firstIn.split(':').map(Number);
                           if (h > 10 || (h === 10 && m > 15)) isLate = true;
                        }
                        
                        const isHalfDay = totalWorkedMins > 0 && totalWorkedMins < 240 && !isActive;

                        // For visual timeline (assume 10 AM to 6 PM standard bounds for the bar width)
                        // 10 AM = 10 * 60 = 600
                        // 6 PM = 18 * 60 = 1080
                        // Total bounds = 480 mins
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
                                  <span className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-2.5 py-1 rounded-full text-xs font-bold">Present</span>
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
                                    {Math.floor(breakMins / 60) > 0 ? `${Math.floor(breakMins / 60)}h ` : ''}{breakMins % 60}m
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Total Time</p>
                                  <p className="font-bold text-blue-600 dark:text-blue-400">
                                    {Math.floor((effectiveSecs + breakMins * 60) / 3600)}h {Math.floor(((effectiveSecs + breakMins * 60) % 3600) / 60)}m
                                  </p>
                                </div>
                              </div>

                              {/* Timeline Visual */}
                              {records.length > 1 && (
                                <div className="mb-4 pt-4 border-t border-border/30">
                                  <p className="text-xs text-muted-foreground font-semibold mb-2">Check-in Segments ({records.length})</p>
                                  <div className="flex flex-wrap gap-2">
                                    {records.map((r: any, i: number) => (
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
                    
                    const myRecords = attendance.filter((record) => record.employeeid === myEmpId);
                    
                    // Group by date
                    const dailyTotals: any = Object.values(
                      myRecords.reduce((acc: any, record: any) => {
                        if (!acc[record.date]) {
                          acc[record.date] = { date: record.date, totalSeconds: 0, firstIn: record.checkin, lastOut: record.checkout, isPresent: true, records: [], hasActive: false };
                        }
                        acc[record.date].records.push(record);
                        if (record.checkin && record.checkout) {
                          const [inH, inM] = record.checkin.split(':').map(Number);
                          const [outH, outM] = record.checkout.split(':').map(Number);
                          let diff = (outH * 3600 + outM * 60) - (inH * 3600 + inM * 60);
                          if (diff < 0) diff += 24 * 3600;
                          acc[record.date].totalSeconds += diff;
                        }
                        if (record.checkin && (!acc[record.date].firstIn || record.checkin < acc[record.date].firstIn)) {
                          acc[record.date].firstIn = record.checkin;
                        }
                        if (record.checkout && (!acc[record.date].lastOut || record.checkout > acc[record.date].lastOut)) {
                          acc[record.date].lastOut = record.checkout;
                        }
                        if (!record.checkout) {
                          acc[record.date].hasActive = true;
                          if (record.checkin) {
                             const [inH, inM] = record.checkin.split(':').map(Number);
                             let diff = (time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds()) - (inH * 3600 + inM * 60);
                             if (diff < 0) diff += 24 * 3600;
                             acc[record.date].totalSeconds += diff;
                          }
                        }
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
                        const dateStr = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().split("T")[0];
                        const dayData = dailyTotals[dateStr];
                        const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;
                        
                        let status = "Absent";
                        let color = "text-rose-600 bg-rose-50 dark:bg-rose-950/30";
                        let displayStr = "🔴 Absent";
                        let tooltip = "No check-in recorded";

                        if (isWeekend) {
                             status = "Weekend"; color = "text-slate-500 bg-slate-100 dark:bg-slate-800"; displayStr = "⚪ Weekend"; tooltip = "Weekend";
                        }
                        
                        let isLate = false;
                        if (dayData) {
                            const effSecs = dayData.totalSeconds >= 240 * 60 ? dayData.totalSeconds - 45 * 60 : dayData.totalSeconds;
                            const workedH = Math.floor(effSecs / 3600);
                            const workedM = Math.floor((effSecs % 3600) / 60);
                            const isHalfDay = dayData.totalSeconds > 0 && dayData.totalSeconds < 240 * 60;
                            isLate = dayData.firstIn > "10:15";
                            
                            if (isHalfDay) {
                                status = "Half Day"; color = "text-amber-600 bg-amber-50 dark:bg-amber-950/30"; displayStr = `🟡 Half Day`; 
                            } else {
                                status = "Present"; color = "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30"; displayStr = `🟢 ${workedH}h ${workedM}m`;
                            }
                            tooltip = `Check In: ${dayData.firstIn ? formatTime12Hour(dayData.firstIn) : '--:--'}\nCheck Out: ${dayData.lastOut ? formatTime12Hour(dayData.lastOut) : 'Active'}\nWorked: ${workedH}h ${workedM}m`;
                        }

                        days.push(
                          <TooltipProvider key={d}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div 
                                  onClick={() => { setSelectedDayInfo(dayData ? { ...dayData, employeeid: myEmpId } : { date: dateStr, isAbsent: true, employeeid: myEmpId }); setIsDaySheetOpen(true); }} 
                                  className="h-28 p-2 border-r border-b border-border/50 hover:bg-secondary/20 cursor-pointer transition-all relative flex flex-col justify-between group"
                                >
                                  <div className="flex justify-between items-start">
                                    <span className={`text-sm font-semibold ${dayData ? 'text-foreground' : 'text-muted-foreground'}`}>{d}</span>
                                    {isLate && dayData && <span className="text-[9px] font-bold bg-amber-100 text-amber-700 px-1 rounded">LATE</span>}
                                  </div>
                                  <div className={`text-xs font-bold px-1.5 py-1 rounded-md text-center shadow-sm transition-transform group-hover:scale-105 ${color}`}>
                                      {displayStr}
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
                              <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-slate-400"></span> Weekend</span>
                            </div>
                        </div>
                    );
                  })()}
                </div>
              )}
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
                  <div className="text-2xl font-bold">{teamTodayRecords.length}<span className="text-muted-foreground text-lg"> / 7</span></div>
                  <p className="text-xs text-muted-foreground">Checked-in staff</p>
                </div>
                <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Attendance Rate</span>
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold">{Math.round((teamTodayRecords.length / 7) * 100) || 0}%</div>
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
                      
                      if (!record.checkout) {
                        empGroup.isActive = true;
                        empGroup.lastOut = "00:00";
                      } else if (record.checkout && !empGroup.isActive && record.checkout > empGroup.lastOut) {
                        empGroup.lastOut = record.checkout;
                      }

                      if (record.checkin && record.checkout) {
                        const [inH, inM] = record.checkin.split(':').map(Number);
                        const [outH, outM] = record.checkout.split(':').map(Number);
                        let diff = (outH * 3600 + outM * 60) - (inH * 3600 + inM * 60);
                        if (diff < 0) diff += 24 * 3600;
                        empGroup.totalSecs += diff;
                      } else if (!record.checkout && record.checkin) {
                        const [inH, inM] = record.checkin.split(':').map(Number);
                        let diff = (time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds()) - (inH * 3600 + inM * 60);
                        if (diff < 0) diff += 24 * 3600;
                        empGroup.totalSecs += diff;
                      }

                      if (record.note && !empGroup.notes.includes(record.note)) empGroup.notes.push(record.note);
                      if (record.location && !empGroup.locations.includes(record.location)) empGroup.locations.push(record.location);

                      return acc;
                    }, {})
                  ).map((empGroup: any) => {
                    const empDetails = getEmpDetails(empGroup.employeeid);
                    
                    let firstIn = empGroup.firstIn;
                    let lastOut = empGroup.lastOut;
                    let isActive = empGroup.isActive;
                    let totalSecs = empGroup.totalSecs;

                    let totalElapsedSecs = 0;
                    if (firstIn !== "23:59") {
                        const [fH, fM] = firstIn.split(':').map(Number);
                        let endH = 0, endM = 0, endS = 0;
                        if (lastOut !== "00:00") {
                             const [lH, lM] = lastOut.split(':').map(Number);
                             endH = lH; endM = lM; endS = 0;
                        } else if (isActive) {
                             const now = new Date();
                             endH = now.getHours(); endM = now.getMinutes(); endS = now.getSeconds();
                        }
                        
                        if (endH !== 0 || endM !== 0 || isActive) {
                           let diff = (endH * 3600 + endM * 60 + endS) - (fH * 3600 + fM * 60);
                           if (diff < 0) diff += 24 * 3600;
                           totalElapsedSecs = diff;
                        }
                    }
                    
                    const breakSecs = Math.max(0, totalElapsedSecs - totalSecs);
                    const breakH = Math.floor(breakSecs / 3600);
                    const breakM = Math.floor((breakSecs % 3600) / 60);

                    const workedH = Math.floor(totalSecs / 3600);
                    const workedM = Math.floor((totalSecs % 3600) / 60);
                    const workedS = totalSecs % 60;

                    let isLate = false;
                    if (firstIn !== "23:59") {
                        const [h, m] = firstIn.split(':').map(Number);
                        if (h > 10 || (h === 10 && m > 15)) isLate = true;
                    }
                    
                    const isHalfDay = totalSecs > 0 && totalSecs < 240 * 60 && !isActive;

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
                      <div key={empGroup.id} onClick={() => { setSelectedDayInfo({ ...empGroup, date: teamSelectedDateStr, hasActive: isActive, totalSeconds: totalSecs, isAbsent: false }); setIsDaySheetOpen(true); }} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer">
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
                              <span className="bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-2.5 py-1 rounded-full text-xs font-bold">Completed</span>
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
                                {breakH}h {breakM}m
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">Total Time</p>
                              <p className="font-bold text-blue-600 dark:text-blue-400">
                                {Math.floor(totalElapsedSecs / 3600)}h {Math.floor((totalElapsedSecs % 3600) / 60)}m
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
                                {empGroup.records.map((r: any, i: number) => (
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
                          acc[record.date] = { date: record.date, totalSeconds: 0, firstIn: record.checkin, lastOut: record.checkout, isPresent: true, records: [], hasActive: false, remark: record.remark || "" };
                        } else {
                          if (!acc[record.date].remark && record.remark) {
                            acc[record.date].remark = record.remark;
                          }
                        }
                        acc[record.date].records.push(record);
                        if (record.checkin && record.checkout) {
                          const [inH, inM] = record.checkin.split(':').map(Number);
                          const [outH, outM] = record.checkout.split(':').map(Number);
                          let diff = (outH * 3600 + outM * 60) - (inH * 3600 + inM * 60);
                          if (diff < 0) diff += 24 * 3600;
                          acc[record.date].totalSeconds += diff;
                        }
                        if (record.checkin && (!acc[record.date].firstIn || record.checkin < acc[record.date].firstIn)) {
                          acc[record.date].firstIn = record.checkin;
                        }
                        if (record.checkout && (!acc[record.date].lastOut || record.checkout > acc[record.date].lastOut)) {
                          acc[record.date].lastOut = record.checkout;
                        }
                        if (!record.checkout) {
                          acc[record.date].hasActive = true;
                          if (record.checkin) {
                             const [inH, inM] = record.checkin.split(':').map(Number);
                             let diff = (time.getHours() * 3600 + time.getMinutes() * 60 + time.getSeconds()) - (inH * 3600 + inM * 60);
                             if (diff < 0) diff += 24 * 3600;
                             acc[record.date].totalSeconds += diff;
                          }
                        }
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
                          {dailyTotals.map((day: any) => (
                            <div key={day.date} className="group flex items-start gap-3 rounded-xl border border-border/60 bg-background p-3 shadow-sm hover:border-primary/30 transition-colors">
                              <div className="mt-0.5">
                                {!day.hasActive ? (
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
                                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${!day.hasActive
                                      ? "bg-secondary text-muted-foreground"
                                      : "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
                                      }`}>
                                      {!day.hasActive ? "Completed" : "Active"}
                                    </span>
                                  </div>
                                </div>
                                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1 bg-secondary/50 px-1.5 py-0.5 rounded-md">
                                    <Clock className="h-3 w-3" />
                                    {day.firstIn ? formatTime12Hour(day.firstIn) : "--:--"} {!day.hasActive ? `- ${day.lastOut ? formatTime12Hour(day.lastOut) : "--:--"}` : ""}
                                  </span>
                                  <span className="flex items-center gap-1 bg-secondary/50 px-1.5 py-0.5 rounded-md truncate max-w-[120px]">
                                    <Building2 className="h-3 w-3 shrink-0" /> Office
                                  </span>
                                  {day.totalSeconds > 0 && (
                                    <span className="flex items-center gap-1 bg-primary/10 text-primary px-1.5 py-0.5 rounded-md text-[10px] font-bold">
                                      {Math.floor(day.totalSeconds / 3600)}h {Math.floor((day.totalSeconds % 3600) / 60)}m
                                      {day.hasActive && <span className="opacity-70 ml-0.5">{day.totalSeconds % 60}s</span>}
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
                          ))}
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
              <div className="text-2xl font-bold">12<span className="text-muted-foreground text-lg"> / 12</span></div>
              <p className="text-xs text-muted-foreground">Days remaining</p>
            </div>
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sick Leave Balance</span>
                <PlusCircle className="h-4 w-4 text-rose-500" />
              </div>
              <div className="text-2xl font-bold">10<span className="text-muted-foreground text-lg"> / 10</span></div>
              <p className="text-xs text-muted-foreground">Days remaining</p>
            </div>
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Earned Leave Balance</span>
                <Activity className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="text-2xl font-bold">15<span className="text-muted-foreground text-lg"> / 15</span></div>
              <p className="text-xs text-muted-foreground">Days remaining</p>
            </div>
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pending Requests</span>
                <Clock className="h-4 w-4 text-amber-500" />
              </div>
              <div className="text-2xl font-bold">{leaves.length}</div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input placeholder="Search leaves by name or reason..." className="flex h-10 w-full rounded-full border border-border bg-background px-9 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20" />
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
                <span className="text-xs text-muted-foreground font-medium">{leaves.length} total team applications</span>
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
                      {leaves.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-6 py-12 text-muted-foreground italic">
                            No team leave applications found.
                          </td>
                        </tr>
                      ) : leaves.map((leave: any) => {
                        const emp = getEmpDetails(leave.employeeid);
                        return (
                          <tr key={leave.id} className="hover:bg-secondary/20 transition-colors">
                            <td className="px-6 py-4 font-semibold">{emp.name}</td>
                            <td className="px-6 py-4 text-muted-foreground">{leave.type}</td>
                            <td className="px-6 py-4 text-muted-foreground">{leave.startdate}</td>
                            <td className="px-6 py-4 font-semibold">{leave.enddate}</td>
                            <td className="px-6 py-4 text-muted-foreground">{leave.reason}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${
                                leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                                leave.status === 'Declined' ? 'bg-rose-50 text-rose-700' :
                                'bg-amber-50 text-amber-700'
                              }`}>{leave.status}</span>
                            </td>
                            <td className="px-6 py-4 text-right">
                              {leave.status === 'Pending' ? (
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
                        )
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
              <span className="text-xs text-muted-foreground font-medium">{leaves.filter(l => l.employeeid === myEmpId).length} applications total</span>
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
                    {leaves.filter(l => l.employeeid === myEmpId).length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-sm text-muted-foreground italic">
                          You haven't submitted any leave applications.
                        </td>
                      </tr>
                    ) : leaves.filter(l => l.employeeid === myEmpId).map((leave: any) => (
                      <tr key={leave.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-6 py-4 font-semibold">{leave.type}</td>
                        <td className="px-6 py-4 text-muted-foreground">{leave.startdate}</td>
                        <td className="px-6 py-4 font-semibold">{leave.enddate}</td>
                        <td className="px-6 py-4 text-muted-foreground">{leave.reason}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-bold ${
                            leave.status === 'Approved' ? 'bg-emerald-50 text-emerald-700' :
                            leave.status === 'Declined' ? 'bg-rose-50 text-rose-700' :
                            'bg-amber-50 text-amber-700'
                          }`}>{leave.status}</span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => {
                            setLeaves(leaves.filter(l => l.id !== leave.id));
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
            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
              <div className="space-y-1.5">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Check In</span>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                  <p className="text-lg font-bold">{selectedDayInfo?.firstIn ? formatTime12Hour(selectedDayInfo.firstIn) : "--:--"}</p>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Check Out</span>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                  <p className="text-lg font-bold">{selectedDayInfo?.lastOut ? formatTime12Hour(selectedDayInfo.lastOut) : (selectedDayInfo?.hasActive ? "Active Shift" : "--:--")}</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Worked</span>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                  <p className="text-lg font-bold">
                    {selectedDayInfo?.totalSeconds ? (
                        (() => {
                           const eff = selectedDayInfo.totalSeconds >= 240 * 60 ? selectedDayInfo.totalSeconds - 45 * 60 : selectedDayInfo.totalSeconds;
                           const h = Math.floor(eff / 3600);
                           const m = Math.floor((eff % 3600) / 60);
                           const s = eff % 60;
                           return <>{h}h {m}m {selectedDayInfo.hasActive && <span className="text-muted-foreground/70 text-sm ml-1">{s}s</span>}</>;
                        })()
                    ) : "0h 0m"}
                  </p>
                </div>
              </div>
              
              <div className="space-y-1.5">
                <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Status</span>
                <p className="text-lg font-bold">
                  {selectedDayInfo?.isAbsent ? (
                    <span className="inline-flex items-center gap-1.5 bg-rose-100 text-rose-700 px-2 py-1 rounded-md text-sm"><span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span> Absent</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md text-sm">
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
    </main>
  );
}
