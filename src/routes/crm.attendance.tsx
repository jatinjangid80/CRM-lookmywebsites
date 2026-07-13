import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import {
  Clock,
  MapPin,
  Calendar,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  Play,
  Square,
  Building,
  Home,
  UserCheck,
  TrendingUp,
  AlertCircle,
  Clock3,
  FileText,
  Plus,
  Check,
  X,
  ClipboardList,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { getAuth } from "@/lib/auth";
import { ImportModal } from "@/components/ImportModal";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const calculateHours = (clockIn: string | null, clockOut: string | null) => {
  if (!clockIn || !clockOut) return "-";
  
  const parseTime = (timeStr: string) => {
    const parts = timeStr.split(':');
    if (parts.length < 2) return null;
    let hours = parseInt(parts[0], 10);
    let minutes = parseInt(parts[1].split(' ')[0], 10);
    if (timeStr.toLowerCase().includes('pm') && hours < 12) hours += 12;
    if (timeStr.toLowerCase().includes('am') && hours === 12) hours = 0;
    if (isNaN(hours) || isNaN(minutes)) return null;
    return hours * 60 + minutes;
  };

  const inMins = parseTime(clockIn);
  const outMins = parseTime(clockOut);
  
  if (inMins === null || outMins === null) return "-";
  
  let diff = outMins - inMins;
  if (diff < 0) diff += 24 * 60;
  
  const h = Math.floor(diff / 60);
  const m = diff % 60;
  
  if (h === 0 && m === 0) return "-";
  if (h === 0) return `${m}m`;
  return `${h}h ${m}m`;
};

export const Route = createFileRoute("/crm/attendance")({ component: AttendancePage });

function AttendancePage() {
  const auth = getAuth();
  const [attendance, setAttendance, isAttendanceLoaded] = useSupabaseTable<any[]>("attendance", []);
  const [employees] = useSupabaseTable<any[]>("employees", []);
  const [leaves, setLeaves] = useSupabaseTable<any[]>("leaves", []);

  const getShiftByTime = () => {
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 12) return "First Shift (Morning)";
    if (hour >= 12 && hour < 16) return "Second Shift (Afternoon)";
    return "Evening Shift";
  };

  const [punchLocation, setPunchLocation] = useState("JTM Mall Office");
  const [punchShift, setPunchShift] = useState(getShiftByTime());
  const [punchNote, setPunchNote] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Tab control: "my" | "team" | "employee_history" | "leaves"
  const [activeTab, setActiveTab] = useState<"my" | "team" | "employee_history" | "leaves">("my");
  const [teamSearch, setTeamSearch] = useState("");
  const [teamDateFilter, setTeamDateFilter] = useState(new Date().toISOString().slice(0, 10));
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [isImportOpen, setIsImportOpen] = useState(false);

  // Leave form and filter states
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("Casual Leave");
  const [leaveFrom, setLeaveFrom] = useState("");
  const [leaveTo, setLeaveTo] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveFilterStatus, setLeaveFilterStatus] = useState<"All" | "Pending" | "Approved" | "Rejected">("All");
  const [leaveSearch, setLeaveSearch] = useState("");

  // Update punch clock time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!auth) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">Please log in to view your attendance.</p>
      </div>
    );
  }

  const isAdminOrManager = auth.role === "admin" || auth.role === "manager";

  // Find corresponding employee record
  const curEmployee = useMemo(() => {
    return (
      employees.find(
        (e) =>
          (e.name && auth.name && e.name.toLowerCase() === auth.name.toLowerCase()) ||
          e.id === auth.empId,
      ) || { id: auth.empId || "EMP-01", name: auth.name, role: auth.role }
    );
  }, [employees, auth]);

  // Current user's attendance logs
  const myLogs = useMemo(() => {
    return attendance
      .filter((log) => log.empId === curEmployee.id)
      .map((log) => ({
        ...log,
        name: curEmployee.name,
        role: curEmployee.role,
        avatar: curEmployee.avatar,
      }))
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [attendance, curEmployee]);

  const todayStr = new Date().toISOString().slice(0, 10);
  const todayLogs = useMemo(() => {
    return myLogs.filter((r) => r.date === todayStr).sort((a, b) => b.id.localeCompare(a.id));
  }, [myLogs, todayStr]);

  const activePunch = useMemo(() => {
    return todayLogs.find((r) => !r.clockOut);
  }, [todayLogs]);

  const handlePunch = () => {
    const nowTime = new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (!activePunch) {
      // Clock In
      const newRecord = {
        id: `ATT-${Date.now()}`,
        empId: curEmployee.id,
        name: curEmployee.name,
        role: curEmployee.role,
        phone: curEmployee.phone || "",
        avatar: curEmployee.avatar || "",
        date: todayStr,
        clockIn: nowTime,
        clockOut: null,
        clockInLocation: `${punchLocation} - ${punchShift}`,
        note: punchNote || "Punch in via Attendance Dashboard",
        status: "Present",
      };
      setAttendance([newRecord, ...attendance]);
      setPunchNote("");
      toast.success(`Successfully Clocked In at ${nowTime}!`);
    } else {
      // Clock Out
      const updated = attendance.map((r) =>
        r.id === activePunch.id
          ? { ...r, clockOut: nowTime, clockOutLocation: `${punchLocation} - ${punchShift}` }
          : r,
      );
      setAttendance(updated);
      toast.success(`Successfully Clocked Out at ${nowTime}!`);
    }
  };

  // Team attendance stats and logs for filtered date
  const teamLogsForSelectedDate = useMemo(() => {
    return attendance
      .filter((log) => log.date === teamDateFilter)
      .map((log) => {
        const emp = employees.find((e) => e.id === log.empId) || {};
        return {
          ...log,
          name: emp.name || log.name || "Unknown",
          role: emp.role || log.role || "Staff",
          avatar: emp.avatar || log.avatar,
        };
      });
  }, [attendance, teamDateFilter, employees]);

  const filteredTeamLogs = useMemo(() => {
    return teamLogsForSelectedDate.filter((log) => {
      const q = teamSearch.toLowerCase();
      return (
        (log.name || "").toLowerCase().includes(q) ||
        (log.role || "").toLowerCase().includes(q) ||
        (log.clockInLocation || "").toLowerCase().includes(q)
      );
    });
  }, [teamLogsForSelectedDate, teamSearch]);

  // Employee history logs for selected employee
  const employeeLogs = useMemo(() => {
    if (!selectedEmployeeId) return [];
    return attendance
      .filter((log) => log.empId === selectedEmployeeId)
      .map((log) => {
        const emp = employees.find((e) => e.id === log.empId) || {};
        return {
          ...log,
          name: emp.name || log.name || "Unknown",
          role: emp.role || log.role || "Staff",
          avatar: emp.avatar || log.avatar,
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [attendance, selectedEmployeeId, employees]);

  // Calculations for Team Overview cards
  const teamStats = useMemo(() => {
    const activeStaffCount = employees.filter((e) => e.status === "Active").length || 1;
    const present = teamLogsForSelectedDate.filter((l) => l.status === "Present" || l.clockIn).length;
    const wfh = teamLogsForSelectedDate.filter((l) => l.clockInLocation === "Work from Home").length;
    const office = teamLogsForSelectedDate.filter((l) => l.clockInLocation === "JTM Mall Office").length;
    const pendingClockOut = teamLogsForSelectedDate.filter((l) => l.clockIn && !l.clockOut).length;

    return {
      totalActive: activeStaffCount,
      present,
      absent: Math.max(0, activeStaffCount - present),
      wfh,
      office,
      pendingClockOut,
      attendanceRate: Math.min(100, Math.round((present / activeStaffCount) * 100)) || 0,
    };
  }, [teamLogsForSelectedDate, employees]);

  // Leaves calculations
  const displayLeaves = useMemo(() => {
    return leaves.map((l) => {
      const emp = employees.find((e) => e.id === l.empId) || {};
      return {
        ...l,
        empName: emp.name || l.empName || "Unknown",
      };
    });
  }, [leaves, employees]);

  const myLeaves = useMemo(() => {
    return displayLeaves.filter((l) => l.empId === curEmployee.id || (l.empName && curEmployee.name && l.empName.toLowerCase() === curEmployee.name.toLowerCase()));
  }, [displayLeaves, curEmployee]);

  const leaveStats = useMemo(() => {
    const casualApproved = myLeaves.filter((l) => l.type === "Casual Leave" && l.status === "Approved").length;
    const sickApproved = myLeaves.filter((l) => l.type === "Sick Leave" && l.status === "Approved").length;
    const earnedApproved = myLeaves.filter((l) => l.type === "Earned Leave" && l.status === "Approved").length;

    return {
      casualApproved,
      sickApproved,
      earnedApproved,
      casualTotal: 12,
      sickTotal: 10,
      earnedTotal: 15,
      totalApplied: myLeaves.length,
      pendingCount: myLeaves.filter((l) => l.status === "Pending").length,
    };
  }, [myLeaves]);

  const getLeaveDays = (from: string, to: string) => {
    if (!from || !to) return 0;
    const f = new Date(from);
    const t = new Date(to);
    const diffTime = Math.abs(t.getTime() - f.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return isNaN(diffDays) ? 0 : diffDays;
  };

  const handleApproveLeave = (id: string) => {
    const updated = leaves.map((l) =>
      l.id === id ? { ...l, status: "Approved" } : l
    );
    setLeaves(updated);
    toast.success("Leave application approved!");
  };

  const handleRejectLeave = (id: string) => {
    const updated = leaves.map((l) =>
      l.id === id ? { ...l, status: "Rejected" } : l
    );
    setLeaves(updated);
    toast.error("Leave application rejected!");
  };

  const handleCancelLeave = (id: string) => {
    const updated = leaves.map((l) =>
      l.id === id ? { ...l, status: "Cancelled" } : l
    );
    setLeaves(updated);
    toast.success("Leave application cancelled.");
  };

  const handleImportData = (data: any[]) => {
    let maxId = attendance.reduce((acc, a) => {
      const num = parseInt((a.id || "").replace("ATT", ""));
      return !isNaN(num) && num > acc ? num : acc;
    }, 0);

    const newAttendance: any[] = [];
    for (const row of data) {
      const getVal = (possibleKeys: string[]) => {
        const key = Object.keys(row).find(k => possibleKeys.some(pk => k.toLowerCase().includes(pk)));
        return key ? String(row[key]) : "";
      };

      const empId = getVal(['emp id', 'employee id', 'id']);
      const date = getVal(['date']);
      if (!empId || !date) continue;

      maxId++;
      const newId = `ATT${String(maxId).padStart(4, "0")}`;

      newAttendance.push({
        id: newId,
        empId,
        date,
        clockIn: getVal(['clock in', 'in time', 'time in']),
        clockOut: getVal(['clock out', 'out time', 'time out']),
        clockInLocation: getVal(['location', 'place']) || "JTM Mall Office",
        status: getVal(['status']) || "Present",
        note: getVal(['note', 'remarks']),
      });
    }

    if (newAttendance.length > 0) {
      setAttendance([...newAttendance, ...attendance]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Punch clock, real-time check-ins, and shift management.
          </p>
        </div>

        <div className="flex bg-muted p-1 rounded-xl w-fit border border-border/80">
          <button
            onClick={() => setActiveTab("my")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "my"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            My Attendance
          </button>
          {isAdminOrManager && (
            <>
              <button
                onClick={() => setActiveTab("team")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "team"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Team Check-ins
              </button>
              <button
                onClick={() => setActiveTab("employee_history")}
                className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeTab === "employee_history"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Employee History
              </button>
            </>
          )}
          <button
            onClick={() => setActiveTab("leaves")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === "leaves"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {isAdminOrManager ? "Leave Applications" : "My Leaves"}
          </button>
        </div>
      </div>

      {activeTab === "my" ? (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Punch Card Column */}
          <div className="space-y-6">
            <div className="bg-card rounded-3xl border border-border p-6 shadow-sm space-y-5">
              <div className="text-center">
                <Clock className="h-10 w-10 text-emerald-500 mx-auto mb-2 animate-pulse" />
                <h3 className="font-semibold text-lg text-foreground">Shift Punch</h3>
                <p className="text-3xl font-bold tracking-tight mt-1 text-foreground font-mono">
                  {currentTime.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: true,
                  })}
                </p>
                <p className="text-xs text-muted-foreground mt-1 font-medium">
                  {currentTime.toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label htmlFor="work-loc" className="text-xs font-semibold text-muted-foreground">Work Location</Label>
                  <select
                    id="work-loc"
                    disabled={!!activePunch}
                    value={punchLocation}
                    onChange={(e) => setPunchLocation(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50"
                  >
                    <option>JTM Mall Office</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="shift" className="text-xs font-semibold text-muted-foreground">Shift / Break</Label>
                  <select
                    id="shift"
                    disabled={true}
                    value={punchShift}
                    onChange={(e) => setPunchShift(e.target.value)}
                    className="flex h-10 w-full rounded-xl border border-border bg-secondary/50 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-not-allowed text-foreground font-medium"
                  >
                    <option value={punchShift}>{punchShift}</option>
                  </select>
                </div>

                {!activePunch && (
                  <div className="space-y-1.5 animate-in fade-in duration-300">
                    <Label htmlFor="checkin-note" className="text-xs font-semibold text-muted-foreground">Shift Note / Focus</Label>
                    <Input
                      id="checkin-note"
                      placeholder="What is your focus for this shift?"
                      value={punchNote}
                      onChange={(e) => setPunchNote(e.target.value)}
                      className="rounded-xl h-10 text-sm border-border focus-visible:ring-primary/20"
                    />
                  </div>
                )}

                <div className="pt-2">
                  {!activePunch ? (
                    <Button
                      onClick={handlePunch}
                      className="w-full py-6 rounded-2xl font-bold gap-2 text-white shadow-md hover:shadow-lg transition-all bg-emerald-600 hover:bg-emerald-700 hover:scale-[1.01]"
                    >
                      <Play className="h-4 w-4 fill-white shrink-0" /> Clock In / Start Shift
                    </Button>
                  ) : (
                    <Button
                      onClick={handlePunch}
                      className="w-full py-6 rounded-2xl font-bold gap-2 text-white shadow-md hover:shadow-lg transition-all bg-rose-600 hover:bg-rose-700 hover:scale-[1.01]"
                    >
                      <Square className="h-4 w-4 fill-white shrink-0" /> Clock Out / End Shift
                    </Button>
                  )}
                </div>

                {todayLogs.length > 0 && (
                  <div className="mt-6 space-y-3 pt-4 border-t border-border">
                    <h4 className="text-sm font-bold text-foreground flex justify-between items-center">
                      <span>Today's Punches</span>
                      <span className="bg-secondary px-2 py-0.5 rounded-full text-[10px] text-muted-foreground">{todayLogs.length} Records</span>
                    </h4>
                    {todayLogs.map(log => (
                      <div key={log.id} className="rounded-2xl bg-secondary/30 border border-border/60 p-4 space-y-3 text-xs animate-in fade-in duration-300">
                        <div className="flex items-center justify-between border-b border-border/40 pb-2">
                          <span className="text-muted-foreground font-medium">{log.clockInLocation?.split(' - ')[1] || "Shift"}</span>
                          <span className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${!log.clockOut ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20' : 'text-slate-600 bg-slate-100 dark:bg-slate-800'}`}>
                            {!log.clockOut ? 'ACTIVE' : 'COMPLETED'}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-muted-foreground">Clocked In:</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            {log.clockIn} ({log.clockInLocation?.split(' - ')[0] || "Office"})
                          </span>
                        </div>
                        {log.clockOut && (
                          <div className="flex justify-between items-center pt-1 border-t border-border/40">
                            <span className="text-muted-foreground">Clocked Out:</span>
                            <span className="font-semibold text-red-600 dark:text-red-400">
                              {log.clockOut}
                            </span>
                          </div>
                        )}
                        {log.note && (
                          <div className="bg-background/80 p-2.5 rounded-xl border border-border/40 mt-2 text-[11px] text-muted-foreground italic">
                            "{log.note}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* History Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">My Attendance History</h3>
              <span className="text-xs text-muted-foreground font-medium">
                {myLogs.length} total shifts logged
              </span>
            </div>

            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/40 text-muted-foreground text-xs font-semibold uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="px-5 py-3.5">Date</th>
                      <th className="px-5 py-3.5">Clock In</th>
                      <th className="px-5 py-3.5">Clock Out</th>
                      <th className="px-5 py-3.5">Hours</th>
                      <th className="px-5 py-3.5">Location</th>
                      <th className="px-5 py-3.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/80">
                    {myLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-5 py-4 font-semibold text-foreground">
                          {new Date(log.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                          {log.clockIn}
                        </td>
                        <td className="px-5 py-4 font-bold text-rose-600 dark:text-rose-400">
                          {log.clockOut || (
                            <span className="text-amber-500 font-medium flex items-center gap-1">
                              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              Active
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-600">
                          {calculateHours(log.clockIn, log.clockOut)}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground text-xs font-medium">
                          <span className="inline-flex items-center gap-1 bg-secondary/40 px-2 py-1 rounded-lg">
                            {log.clockInLocation === "Work from Home" ? (
                              <Home className="h-3.5 w-3.5 text-blue-500" />
                            ) : (
                              <Building className="h-3.5 w-3.5 text-emerald-500" />
                            )}
                            {log.clockInLocation || "Office"}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span className="inline-block rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400 px-2.5 py-1 text-xs font-bold">
                            {log.status || "Present"}
                          </span>
                        </td>
                      </tr>
                    ))}

                    {!isAttendanceLoaded ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground">
                          <div className="flex justify-center items-center gap-2">
                            <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                            Loading logs...
                          </div>
                        </td>
                      </tr>
                    ) : myLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-5 py-12 text-center text-muted-foreground italic">
                          No attendance records found. Start your first shift above!
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === "employee_history" && isAdminOrManager ? (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="flex flex-col gap-1 w-full md:max-w-md">
              <Label className="text-xs font-semibold text-muted-foreground">Select Employee</Label>
              <select
                value={selectedEmployeeId}
                onChange={(e) => setSelectedEmployeeId(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option value="">-- Choose Employee --</option>
                {employees.map(emp => (
                  <option key={emp.id} value={emp.id}>{emp.name} ({emp.role})</option>
                ))}
              </select>
            </div>
            {selectedEmployeeId && (
              <div className="flex items-center gap-4 mt-4 md:mt-0">
                 <div className="bg-secondary/40 px-4 py-2 rounded-xl border border-border/60">
                   <p className="text-xs text-muted-foreground">Total Records</p>
                   <p className="text-lg font-bold">{employeeLogs.length}</p>
                 </div>
              </div>
            )}
          </div>
          
          {selectedEmployeeId ? (
            <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-secondary/40 text-muted-foreground text-xs font-semibold uppercase tracking-wider border-b border-border">
                    <tr>
                      <th className="px-5 py-3.5">Date</th>
                      <th className="px-5 py-3.5">Clock In</th>
                      <th className="px-5 py-3.5">Clock Out</th>
                      <th className="px-5 py-3.5">Hours</th>
                      <th className="px-5 py-3.5">Location</th>
                      <th className="px-5 py-3.5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/80">
                    {employeeLogs.length > 0 ? employeeLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                        <td className="px-5 py-4 font-semibold text-foreground">
                          {new Date(log.date).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="px-5 py-4 text-emerald-600 font-semibold">
                          {log.clockIn || "--:--"}
                        </td>
                        <td className="px-5 py-4 text-red-500 font-semibold">
                          {log.clockOut || "--:--"}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-600">
                          {calculateHours(log.clockIn, log.clockOut)}
                        </td>
                        <td className="px-5 py-4 text-muted-foreground text-xs">
                          {log.clockInLocation || "Office"}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                              log.status === "Present" || log.clockIn
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400"
                                : "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                            }`}
                          >
                            {log.status === "Present" || log.clockIn ? (
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5" />
                            )}
                            {log.status === "Present" || log.clockIn ? "Present" : "Absent"}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="text-center py-12 text-muted-foreground">
                          No attendance records found for this employee.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center rounded-3xl border border-dashed border-border bg-card/50 p-6 text-center">
              <div className="flex flex-col items-center gap-2">
                <Users className="h-10 w-10 text-muted-foreground/50" />
                <p className="text-sm font-medium text-muted-foreground">Select an employee to view their attendance history.</p>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === "team" ? (
        /* Team Attendance Dashboard (Admin/Manager view) */
        <div className="space-y-6">
          {/* Dashboard Stats Panel */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: "Present Today",
                value: `${teamStats.present} / ${teamStats.totalActive}`,
                sub: "Checked-in staff",
                icon: <UserCheck className="h-4 w-4" />,
                color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400",
              },
              {
                label: "Attendance Rate",
                value: `${teamStats.attendanceRate}%`,
                sub: "Active ratio",
                icon: <TrendingUp className="h-4 w-4" />,
                color: "bg-violet-50 text-violet-600 dark:bg-violet-950/20 dark:text-violet-400",
              },
              {
                label: "Office vs WFH",
                value: `${teamStats.office} in / ${teamStats.wfh} home`,
                sub: "Location distribution",
                icon: <Building className="h-4 w-4" />,
                color: "bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400",
              },
              {
                label: "Active Shifts",
                value: teamStats.pendingClockOut,
                sub: "Still on clock",
                icon: <Clock3 className="h-4 w-4" />,
                color: "bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400",
              },
            ].map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </p>
                  <span className={`grid h-8 w-8 place-items-center rounded-xl ${s.color}`}>
                    {s.icon}
                  </span>
                </div>
                <p className="mt-3 font-display text-2xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Filtering Panel */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="relative w-full md:max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={teamSearch}
                onChange={(e) => setTeamSearch(e.target.value)}
                placeholder="Search team member, role, or location..."
                className="pl-9 rounded-xl w-full h-10 border-border"
              />
            </div>
            <div className="flex items-center gap-2 text-sm w-full md:w-auto md:ml-auto">
              <Button variant="outline" size="sm" onClick={() => setIsImportOpen(true)} className="h-10 hidden sm:flex">
                <Download className="w-4 h-4 mr-2" /> Import
              </Button>
              <ImportModal 
                isOpen={isImportOpen} 
                onClose={() => setIsImportOpen(false)} 
                onImport={handleImportData} 
                title="Import Attendance" 
                subtitle="Strictly import attendance logs using the official template format."
                templateUrl="/Attendance_Import_Template.xlsx"
              />
              <span className="text-muted-foreground font-medium shrink-0">Selected Date:</span>
              <Input
                type="date"
                value={teamDateFilter}
                onChange={(e) => setTeamDateFilter(e.target.value)}
                className="h-10 rounded-xl border-border w-full md:w-auto font-semibold text-foreground"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/40 text-muted-foreground text-xs font-semibold uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="px-5 py-4">Employee</th>
                    <th className="px-5 py-4">Job Role</th>
                    <th className="px-5 py-4">Clock In</th>
                    <th className="px-5 py-4">Clock Out</th>
                    <th className="px-5 py-4">Hours</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Focus Note</th>
                    <th className="px-5 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/80">
                  {filteredTeamLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-secondary/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {log.avatar ? (
                            <img
                              src={log.avatar}
                              alt={log.name}
                              className="h-9 w-9 rounded-xl object-cover shrink-0 border border-border"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="h-9 w-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                              <span className="text-sm font-bold text-primary">
                                {(log.name || "?").charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="font-semibold leading-tight text-foreground">{log.name}</p>
                            <p className="text-[10px] text-muted-foreground font-mono mt-0.5">{log.empId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground font-medium text-xs">
                        {log.role}
                      </td>
                      <td className="px-5 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                        {log.clockIn}
                      </td>
                      <td className="px-5 py-4 font-bold text-rose-600 dark:text-rose-400">
                        {log.clockOut || (
                          <span className="text-amber-500 font-medium flex items-center gap-1 text-xs">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                            Clocked In
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-600">
                        {calculateHours(log.clockIn, log.clockOut)}
                      </td>
                      <td className="px-5 py-4 text-muted-foreground text-xs font-medium">
                        <span className="inline-flex items-center gap-1 bg-secondary/40 px-2 py-1 rounded-lg">
                          {log.clockInLocation === "Work from Home" ? (
                            <Home className="h-3.5 w-3.5 text-blue-500" />
                          ) : (
                            <Building className="h-3.5 w-3.5 text-emerald-500" />
                          )}
                          {log.clockInLocation || "Office"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted-foreground text-xs italic max-w-xs truncate" title={log.note}>
                        {log.note || "-"}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-block rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400 px-2.5 py-1 text-xs font-bold">
                          {log.status || "Present"}
                        </span>
                      </td>
                    </tr>
                  ))}

                  {filteredTeamLogs.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center text-muted-foreground italic bg-secondary/5">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <AlertCircle className="h-6 w-6 text-muted-foreground" />
                          <span>No team check-ins logged for this date.</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Leaves Management View */
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Stats Deck for Leaves */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-sans">Casual Leave Balance</p>
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/20 dark:text-blue-400">
                  <Calendar className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-foreground">
                {leaveStats.casualTotal - leaveStats.casualApproved} / {leaveStats.casualTotal}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Days remaining</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-sans">Sick Leave Balance</p>
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/20 dark:text-rose-400">
                  <AlertCircle className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-foreground">
                {leaveStats.sickTotal - leaveStats.sickApproved} / {leaveStats.sickTotal}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Days remaining</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-sans">Earned Leave Balance</p>
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400">
                  <UserCheck className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-foreground">
                {leaveStats.earnedTotal - leaveStats.earnedApproved} / {leaveStats.earnedTotal}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">Days remaining</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-sans">Pending Requests</p>
                <span className="grid h-8 w-8 place-items-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/20 dark:text-amber-400">
                  <Clock3 className="h-4 w-4" />
                </span>
              </div>
              <p className="mt-3 font-display text-2xl font-bold text-foreground">
                {leaveStats.pendingCount}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5 font-medium">Awaiting approval</p>
            </div>
          </div>

          {/* Leave actions: Apply Leave Button */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-sm">
            <div className="relative w-full sm:max-w-md flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={leaveSearch}
                onChange={(e) => setLeaveSearch(e.target.value)}
                placeholder="Search leaves by name or reason..."
                className="pl-9 rounded-xl w-full h-10 border-border"
              />
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <select
                value={leaveFilterStatus}
                onChange={(e: any) => setLeaveFilterStatus(e.target.value)}
                className="flex h-10 rounded-xl border border-border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer w-full sm:w-40 font-semibold"
              >
                <option value="All">All Statuses</option>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
              <Button
                onClick={() => setIsLeaveModalOpen(true)}
                className="bg-primary text-primary-foreground hover:bg-primary/95 font-bold rounded-xl h-10 px-4 shrink-0 shadow-sm flex items-center gap-1.5 w-full sm:w-auto cursor-pointer"
              >
                <Plus className="h-4 w-4" /> Apply Leave
              </Button>
            </div>
          </div>

          {/* Leave lists */}
          <div className="grid gap-6">
            {/* 1. Team Leaves Section (Only for Admin/Manager) */}
            {isAdminOrManager && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ClipboardList className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold text-lg text-foreground">Team Leave Applications</h3>
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">
                    {displayLeaves.filter(l => l.empId !== curEmployee.id).length} total team applications
                  </span>
                </div>

                <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                      <thead className="bg-secondary/40 text-muted-foreground text-xs font-semibold uppercase tracking-wider border-b border-border">
                        <tr>
                          <th className="px-5 py-3.5">Employee</th>
                          <th className="px-5 py-3.5">Leave Type</th>
                          <th className="px-5 py-3.5">Duration</th>
                          <th className="px-5 py-3.5">Days</th>
                          <th className="px-5 py-3.5">Reason</th>
                          <th className="px-5 py-3.5">Status</th>
                          <th className="px-5 py-3.5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/80">
                        {displayLeaves
                          .filter((l) => {
                            // Filter out current user's leaves from team list
                            const isMyOwn = l.empId === curEmployee.id;
                            if (isMyOwn) return false;

                            // Filter by search
                            const q = leaveSearch.toLowerCase();
                            const matchesSearch =
                              (l.empName || "").toLowerCase().includes(q) ||
                              (l.reason || "").toLowerCase().includes(q) ||
                              (l.type || "").toLowerCase().includes(q);

                            // Filter by status
                            const matchesStatus =
                              leaveFilterStatus === "All" || l.status === leaveFilterStatus;

                            return matchesSearch && matchesStatus;
                          })
                          .map((l) => {
                            const days = getLeaveDays(l.fromDate, l.toDate);
                            return (
                              <tr key={l.id} className="hover:bg-secondary/20 transition-colors">
                                <td className="px-5 py-4 font-semibold text-foreground">
                                  {l.empName || "Team Member"}
                                  <div className="text-[10px] text-muted-foreground font-mono mt-0.5">{l.empId}</div>
                                </td>
                                <td className="px-5 py-4 font-medium text-foreground">
                                  {l.type}
                                </td>
                                <td className="px-5 py-4 text-muted-foreground text-xs font-semibold">
                                  {l.fromDate ? new Date(l.fromDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' }) : ""} - {l.toDate ? new Date(l.toDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) : ""}
                                </td>
                                <td className="px-5 py-4 font-bold text-foreground">
                                  {days} {days === 1 ? 'day' : 'days'}
                                </td>
                                <td className="px-5 py-4 text-muted-foreground text-xs italic max-w-xs truncate" title={l.reason}>
                                  {l.reason}
                                </td>
                                <td className="px-5 py-4">
                                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${
                                    l.status === "Approved"
                                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400"
                                      : l.status === "Rejected"
                                      ? "bg-rose-50 text-rose-700 dark:bg-rose-950/25 dark:text-rose-400"
                                      : "bg-amber-50 text-amber-700 dark:bg-amber-950/25 dark:text-amber-400"
                                  }`}>
                                    {l.status || "Pending"}
                                  </span>
                                </td>
                                <td className="px-5 py-4 text-right">
                                  {l.status === "Pending" ? (
                                    <div className="flex justify-end gap-2">
                                      <Button
                                        onClick={() => handleApproveLeave(l.id)}
                                        size="sm"
                                        className="h-8 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 font-semibold text-xs flex items-center gap-1 shadow-sm cursor-pointer"
                                      >
                                        <Check className="h-3.5 w-3.5" /> Approve
                                      </Button>
                                      <Button
                                        onClick={() => handleRejectLeave(l.id)}
                                        size="sm"
                                        variant="outline"
                                        className="h-8 rounded-lg border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 px-2.5 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                                      >
                                        <X className="h-3.5 w-3.5" /> Reject
                                      </Button>
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">Reviewed</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}

                        {displayLeaves.filter(l => l.empId !== curEmployee.id).length === 0 && (
                          <tr>
                            <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground italic text-sm">
                              No team leave requests found.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. My Leaves Section (For Everyone) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-lg text-foreground">My Leave Applications</h3>
                </div>
                <span className="text-xs text-muted-foreground font-medium">
                  {myLeaves.length} applications total
                </span>
              </div>

              <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-secondary/40 text-muted-foreground text-xs font-semibold uppercase tracking-wider border-b border-border">
                      <tr>
                        <th className="px-5 py-3.5">Leave Type</th>
                        <th className="px-5 py-3.5">Duration</th>
                        <th className="px-5 py-3.5">Days</th>
                        <th className="px-5 py-3.5">Reason</th>
                        <th className="px-5 py-3.5">Applied On</th>
                        <th className="px-5 py-3.5">Status</th>
                        <th className="px-5 py-3.5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/80">
                      {myLeaves
                        .filter((l) => {
                          const q = leaveSearch.toLowerCase();
                          const matchesSearch =
                            (l.reason || "").toLowerCase().includes(q) ||
                            (l.type || "").toLowerCase().includes(q);

                          const matchesStatus =
                            leaveFilterStatus === "All" || l.status === leaveFilterStatus;

                          return matchesSearch && matchesStatus;
                        })
                        .map((l) => {
                          const days = getLeaveDays(l.fromDate, l.toDate);
                          return (
                            <tr key={l.id} className="hover:bg-secondary/20 transition-colors">
                              <td className="px-5 py-4 font-semibold text-foreground">
                                {l.type}
                              </td>
                              <td className="px-5 py-4 text-muted-foreground text-xs font-semibold">
                                {l.fromDate ? new Date(l.fromDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short' }) : ""} - {l.toDate ? new Date(l.toDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) : ""}
                              </td>
                              <td className="px-5 py-4 font-bold text-foreground">
                                {days} {days === 1 ? 'day' : 'days'}
                              </td>
                              <td className="px-5 py-4 text-muted-foreground text-xs italic max-w-xs truncate" title={l.reason}>
                                {l.reason}
                              </td>
                              <td className="px-5 py-4 text-muted-foreground text-xs font-medium">
                                {l.appliedDate ? new Date(l.appliedDate).toLocaleDateString("en-IN", { day: '2-digit', month: 'short', year: 'numeric' }) : "-"}
                              </td>
                              <td className="px-5 py-4">
                                <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${
                                  l.status === "Approved"
                                    ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400"
                                    : l.status === "Rejected"
                                    ? "bg-rose-50 text-rose-700 dark:bg-rose-950/25 dark:text-rose-400"
                                    : "bg-amber-50 text-amber-700 dark:bg-amber-950/25 dark:text-amber-400"
                                }`}>
                                  {l.status || "Pending"}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-right font-medium">
                                {l.status === "Pending" ? (
                                  <Button
                                    onClick={() => handleCancelLeave(l.id)}
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 rounded-lg text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-semibold text-xs cursor-pointer"
                                  >
                                    Cancel
                                  </Button>
                                ) : (
                                  <span className="text-xs text-muted-foreground">-</span>
                                )}
                              </td>
                            </tr>
                          );
                        })}

                      {myLeaves.length === 0 && (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center text-muted-foreground italic bg-secondary/5">
                            You haven't submitted any leave applications.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Apply Leave Dialog */}
      <Dialog open={isLeaveModalOpen} onOpenChange={setIsLeaveModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Apply for Leave</DialogTitle>
            <DialogDescription>
              Submit a leave request. Your manager will review it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="leave-type">Leave Type</Label>
              <select
                id="leave-type"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              >
                <option>Casual Leave</option>
                <option>Sick Leave</option>
                <option>Earned Leave</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="leave-from">From Date</Label>
                <Input
                  id="leave-from"
                  type="date"
                  value={leaveFrom}
                  onChange={(e) => setLeaveFrom(e.target.value)}
                  className="rounded-xl font-medium"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="leave-to">To Date</Label>
                <Input
                  id="leave-to"
                  type="date"
                  value={leaveTo}
                  onChange={(e) => setLeaveTo(e.target.value)}
                  className="rounded-xl font-medium"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="leave-reason">Reason</Label>
              <Input
                id="leave-reason"
                placeholder="Reason for leave..."
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                className="rounded-xl h-10 text-sm"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button variant="outline" className="rounded-xl font-bold cursor-pointer" onClick={() => setIsLeaveModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="rounded-xl font-bold cursor-pointer"
              onClick={() => {
                if (!leaveFrom || !leaveTo || !leaveReason) {
                  toast.error("Please fill in all fields");
                  return;
                }
                const newLeave = {
                  id: `LV-${Date.now()}`,
                  empId: curEmployee.id,
                  empName: curEmployee.name,
                  type: leaveType,
                  fromDate: leaveFrom,
                  toDate: leaveTo,
                  reason: leaveReason,
                  status: "Pending",
                  appliedDate: new Date().toISOString().slice(0, 10),
                };
                setLeaves([newLeave, ...leaves]);
                setIsLeaveModalOpen(false);
                setLeaveFrom("");
                setLeaveTo("");
                setLeaveReason("");
                toast.success("Leave request submitted successfully!");
              }}
            >
              Submit Application
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
