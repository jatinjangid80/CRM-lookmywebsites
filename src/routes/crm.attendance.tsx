import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Clock, Play, Building2, Square, Users, TrendingUp, Download, Calendar as CalendarIcon, Activity, PlusCircle, Search, FileText, Smartphone, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { getAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
export const Route = createFileRoute("/crm/attendance")({
  component: AttendancePage,
});

function AttendancePage() {
  const [time, setTime] = useState(new Date());
  const [shiftNote, setShiftNote] = useState("");
  const [selectedHistoryEmpId, setSelectedHistoryEmpId] = useState<string>("");

  const [attendance, setAttendance] = useSupabaseTable<any[]>("attendance", []);
  const [employeesList] = useSupabaseTable<any[]>("employees", []);

  const [leaves, setLeaves] = useSupabaseTable<any[]>("leaves", []);
  const [isApplyLeaveOpen, setIsApplyLeaveOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("Casual");
  const [leaveStartDate, setLeaveStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [leaveEndDate, setLeaveEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [leaveReason, setLeaveReason] = useState("");

  const user = getAuth();
  const myEmpId = user?.empId || "EMP001";
  // Get date in local timezone YYYY-MM-DD
  const todayStr = new Date(time.getTime() - time.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  const myTodayRecords = attendance.filter(a => a.employeeid === myEmpId && a.date === todayStr);
  const myCurrentSession = myTodayRecords.find(a => !a.checkout);

  const [teamSelectedDate, setTeamSelectedDate] = useState<Date>(new Date());
  const teamSelectedDateStr = new Date(teamSelectedDate.getTime() - teamSelectedDate.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  const teamTodayRecords = attendance.filter(a => a.date === teamSelectedDateStr);
  const getEmpDetails = (empId: string) => {
    const emp = employeesList.find((e: any) => e.id === empId || e.empId === empId);
    if (emp) return { name: emp.name, role: emp.role || "Employee", initials: emp.name?.charAt(0) || "U", id: emp.id };

    if (empId === myEmpId && user) return { name: user.name, role: user.role, initials: user.name?.charAt(0) || "U", id: myEmpId };
    if (empId === "EMP001") return { name: "Current User", role: "Employee", initials: "CU", id: "EMP001" };
    return { name: "Unknown Employee", role: "Unknown", initials: "U", id: empId };
  };
  const isClockedIn = !!myCurrentSession;

  const uniqueEmpIds = Array.from(new Set(attendance.map((a: any) => a.employeeid)));
  const displayEmpIds = Array.from(new Set([...employeesList.map((e: any) => e.id), ...uniqueEmpIds]));

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
            <TabsTrigger value="team" className="px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground">Team Check-ins</TabsTrigger>
            <TabsTrigger value="history" className="px-4 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm text-muted-foreground hover:text-foreground">Employee History</TabsTrigger>
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
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{record.checkin} ({record.location})</span>
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
            </div>
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">My Attendance History</h3>
                <span className="text-xs text-muted-foreground font-medium">
                  {attendance.filter((record) => record.employeeid === myEmpId).length} total shifts logged
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
                        <th className="px-5 py-3.5">Note</th>
                        <th className="px-5 py-3.5 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/80">
                      {attendance
                        .filter((record) => record.employeeid === myEmpId)
                        .reverse()
                        .map((record, i) => (
                          <tr key={record.id || i} className="hover:bg-secondary/20 transition-colors">
                            <td className="px-5 py-4 font-semibold text-foreground">{record.date}</td>
                            <td className="px-5 py-4 font-bold text-emerald-600 dark:text-emerald-400">{record.checkin}</td>
                            <td className="px-5 py-4 font-bold text-rose-600 dark:text-rose-400">
                              {record.checkout ? (
                                record.checkout
                              ) : (
                                <span className="text-amber-500 font-medium flex items-center gap-1">
                                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                                  Active
                                </span>
                              )}
                            </td>
                            <td className="px-5 py-4 font-semibold text-slate-600">-</td>
                            <td className="px-5 py-4 text-muted-foreground text-xs font-medium">
                              <span className="inline-flex items-center gap-1 bg-secondary/40 px-2 py-1 rounded-lg">
                                <Building2 className="h-3.5 w-3.5 text-emerald-500" />{record.location || "Office"}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-muted-foreground text-xs italic">{record.note || "-"}</td>
                            <td className="px-5 py-4 text-right">
                              <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${record.checkout
                                  ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                                  : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400'
                                }`}>
                                {record.checkout ? 'Completed' : 'Present'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      {attendance.filter((record) => record.employeeid === myEmpId).length === 0 && (
                        <tr>
                          <td colSpan={7} className="text-center py-6 text-muted-foreground text-sm">
                            No attendance history found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="team" className="m-0 border-none p-0 outline-none space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
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
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Office</span>
                <Smartphone className="h-4 w-4 text-blue-500" />
              </div>
              <div className="text-2xl font-bold">{teamTodayRecords.filter(r => r.location === "Office").length} in / {teamTodayRecords.filter(r => r.location === "Remote").length} home</div>
              <p className="text-xs text-muted-foreground">Location distribution</p>
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
          <div className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-secondary/40 text-muted-foreground text-xs font-semibold uppercase tracking-wider border-b border-border">
                  <tr>
                    <th className="px-6 py-4">Employee</th>
                    <th className="px-6 py-4">Job Role</th>
                    <th className="px-6 py-4">Clock In</th>
                    <th className="px-6 py-4">Clock Out</th>
                    <th className="px-6 py-4">Hours</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Focus Note</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/80">
                  {teamTodayRecords.length > 0 ? (
                    teamTodayRecords.map((record) => {
                      const empDetails = getEmpDetails(record.employeeid);
                      return (
                        <tr key={record.id} className="hover:bg-secondary/20 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">{empDetails.initials || "U"}</div>
                              <div>
                                <p className="font-semibold text-foreground">{empDetails.name}</p>
                                <p className="text-xs text-muted-foreground">{empDetails.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground font-medium">{empDetails.role}</td>
                          <td className="px-6 py-4 font-bold text-emerald-600">{record.checkin}</td>
                          <td className="px-6 py-4 font-semibold text-amber-500">
                            {record.checkout ? (
                              <span className="text-foreground">{record.checkout}</span>
                            ) : (
                              "• Clocked In"
                            )}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground font-medium">
                            {record.checkout ? (() => {
                              const [inH, inM] = record.checkin.split(':').map(Number);
                              const [outH, outM] = record.checkout.split(':').map(Number);
                              let diff = (outH * 60 + outM) - (inH * 60 + inM);
                              if (diff < 0) diff += 24 * 60;
                              const h = Math.floor(diff / 60);
                              const m = diff % 60;
                              return `${h}h ${m}m`;
                            })() : "-"}
                          </td>
                          <td className="px-6 py-4 text-muted-foreground text-xs font-medium">
                            <span className="inline-flex items-center gap-1 bg-secondary/40 px-2 py-1 rounded-lg">
                              <Building2 className="h-3.5 w-3.5 text-emerald-500" />{record.location}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-muted-foreground">{record.note || "-"}</td>
                          <td className="px-6 py-4 text-right">
                            <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${record.checkout
                                ? "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/25 dark:text-emerald-400"
                              }`}>
                              {record.checkout ? "Completed" : "Present"}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                        No team check-ins today.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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

                return (
                  <div key={empId as string} className="rounded-2xl border border-border bg-card shadow-sm p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="h-10 w-10 rounded-full bg-emerald-600/10 flex items-center justify-center font-bold text-emerald-700 uppercase">
                        {details.initials || details.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-foreground">{details.name}</h3>
                        <p className="text-xs text-muted-foreground">{empRecords.length} Attendance Records</p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {empRecords.map((record: any) => (
                        <div key={record.id} className="group flex items-start gap-3 rounded-xl border border-border/60 bg-background p-3 shadow-sm hover:border-emerald-500/30 transition-colors">
                          <div className="mt-0.5">
                            {record.checkout ? (
                              <Square className="h-4 w-4 text-emerald-500" />
                            ) : (
                              <Play className="h-4 w-4 text-emerald-600 fill-emerald-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-semibold truncate text-foreground">
                                {record.date}
                              </p>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${record.checkout
                                    ? "bg-secondary text-muted-foreground"
                                    : "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                                  }`}>
                                  {record.checkout ? "Completed" : "Active"}
                                </span>
                                <button
                                  onClick={() => handleDeleteRecord(record.id)}
                                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all"
                                  title="Remove Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1 bg-secondary/50 px-1.5 py-0.5 rounded-md">
                                <Clock className="h-3 w-3" />
                                {record.checkin} {record.checkout ? `- ${record.checkout}` : ""}
                              </span>
                              <span className="flex items-center gap-1 bg-secondary/50 px-1.5 py-0.5 rounded-md truncate max-w-[120px]">
                                <Building2 className="h-3 w-3 shrink-0" /> Office
                              </span>
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
                className="inline-flex items-center justify-center text-sm font-semibold h-10 px-5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white transition-colors"
              >
                + Apply Leave
              </button>
            </div>
          </div>

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
                            <span className="inline-block rounded-full bg-amber-50 text-amber-700 px-2.5 py-1 text-[11px] font-bold">{leave.status}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => {
                              setLeaves(leaves.filter(l => l.id !== leave.id));
                              toast.success("Leave request removed");
                            }} className="text-rose-500 hover:underline text-xs font-medium">Remove</button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

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
                          <span className="inline-block rounded-full bg-amber-50 text-amber-700 px-2.5 py-1 text-[11px] font-bold">{leave.status}</span>
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
            <Button onClick={handleApplyLeave} className="bg-emerald-600 hover:bg-emerald-700 text-white">Submit Application</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
