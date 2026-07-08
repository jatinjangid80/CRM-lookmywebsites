import React, { useMemo } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Plus,
  Users,
  UserCheck,
  IndianRupee,
  CalendarCheck,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Award,
  ChevronRight,
  Sparkles,
  User,
  Plane,
  Star,
  ListChecks,
  CheckCircle2,
  Circle,
  Phone,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  revenueByMonth,
  destinationPerformance,
  leads as seedLeads,
  bookings as seedBookings,
  customers as seedCustomers,
  formatINR,
} from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { INITIAL_EMPLOYEES } from "./crm.employees";
import { SEED_PACKAGES } from "./crm.packages";

export const Route = createFileRoute("/crm/")({
  component: Dashboard,
});

const COLORS = ["var(--primary)", "#FF8A33", "#FFA666", "#FFC299", "#FFD9BF", "#FFE9D9"];

const SOURCE_HEX_COLORS: Record<string, string> = {
  Instagram: "#ec4899", // pink-500
  Facebook: "#2563eb", // blue-600
  WhatsApp: "#047857", // emerald-700
  "Walk-in": "#fde047", // yellow-300
  Website: "var(--primary)",
  Referral: "#d8b4fe", // purple-300
  Ads: "#e5e7eb", // gray-200
  "DD Pharma": "#bbf7d0", // green-200
  Other: "#fbcfe8", // pink-200
  "Old Ref": "#93c5fd", // blue-300
  "BNI INC": "#4ade80", // green-400
  BNI: "#22c55e", // green-500
};

const FUNNEL_COLORS = [
  "#3b82f6", // 0: New Lead (blue)
  "#f59e0b", // 1: Contacted (amber)
  "#06b6d4", // 2: Quotation (cyan)
  "#a855f7", // 3: Negotiate (purple)
  "#14b8a6", // 4: Confirmed (teal)
];

const AVATARS = ["", "", "", "", "", "", ""];

const LEADS_INIT = seedLeads.map((l, i) => ({
  ...l,
  avatar: AVATARS[i % AVATARS.length],
  notes: "",
}));

// Custom Recharts tooltip components for visual excellence
const RevenueTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-3 shadow-premium text-xs">
        <p className="font-bold text-muted-foreground mb-1">{label}</p>
        <p className="font-display text-sm font-extrabold text-primary">
          ₹{payload[0].value} Lakhs
        </p>
      </div>
    );
  }
  return null;
};

const FunnelTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-border bg-card p-3 shadow-premium text-xs">
        <p className="font-bold text-muted-foreground mb-1">{label}</p>
        <p className="font-display text-sm font-extrabold text-primary">{payload[0].value} Leads</p>
      </div>
    );
  }
  return null;
};

function getLocalStorageItem<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function formatLakhs(amount: number) {
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakhs`;
  }
  return formatINR(amount);
}

function Dashboard() {
  const user = getAuth();
  const navigate = useNavigate();

  // Read dynamic lists from Supabase
  const [leadsList] = useSupabaseTable<any[]>("leads", LEADS_INIT);
  const [bookingsList] = useSupabaseTable<any[]>("bookings", seedBookings);
  const [customersList] = useSupabaseTable<any[]>("customers", seedCustomers);
  const [employeesList] = useSupabaseTable<any[]>("employees", INITIAL_EMPLOYEES);
  const [packagesList] = useSupabaseTable<any[]>("packages", SEED_PACKAGES);
  const [tasksList, setTasksList] = useSupabaseTable<any[]>("tasks", []);

  const todayStr = new Date().toISOString().slice(0, 10);

  // 1. Calculate KPI Metrics
  const todayLeadsCount = leadsList.filter(
    (l) => l.createdAt && l.createdAt.slice(0, 10) === todayStr,
  ).length;
  const todaySalesAmount = bookingsList
    .filter((b) => b.bookingDate && b.bookingDate.slice(0, 10) === todayStr)
    .reduce((sum, b) => sum + (b.amount || 0), 0);
  const activeBookingsCount = bookingsList.filter(
    (b) => b.status === "Confirmed" || b.status === "Pending",
  ).length;
  const pendingPaymentsAmount = bookingsList.reduce(
    (sum, b) => sum + ((b.amount || 0) - (b.paid || 0)),
    0,
  );
  const followupsTodayCount = leadsList.filter(
    (l) => l.nextFollowUp && l.nextFollowUp.slice(0, 10) === todayStr,
  ).length;

  const upcomingDeparturesCount = bookingsList.filter((b) => {
    if (!b.travelDate) return false;
    const diff = (new Date(b.travelDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  }).length;

  const convertedLeadsList = leadsList.filter(
    (l) => l.status === "Booked" || l.status === "Travel Completed" || l.status === "Completed"
  );
  const conversionRate = leadsList.length > 0 ? ((convertedLeadsList.length / leadsList.length) * 100).toFixed(1) : "0.0";
  const convertedNames = convertedLeadsList.length > 0 ? convertedLeadsList.map((l) => l.name).join(", ") : "No conversions yet";
  const monthlyRevenueTotal = bookingsList.reduce((sum, b) => sum + (b.paid || 0), 0);

  // 2. Chart data aggregations
  // Lead Source Distribution
  const sourceCounts: Record<string, number> = {};
  leadsList.forEach((l) => {
    const src = l.source || "Other";
    sourceCounts[src] = (sourceCounts[src] || 0) + 1;
  });
  const sourceData = Object.entries(sourceCounts).map(([name, value]) => ({ name, value }));

  // Destination-wise Sales
  const destSalesMap: Record<string, number> = {};
  bookingsList.forEach((b) => {
    const dest = b.details?.destination || b.package?.split(" ")[0] || "Other";
    destSalesMap[dest] = (destSalesMap[dest] || 0) + b.amount;
  });
  const destinationSalesData = Object.entries(destSalesMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Staff/Agent Performance Aggregation
  const staffStatsMap: Record<
    string,
    {
      name: string;
      role: string;
      totalLeads: number;
      convertedLeads: number;
      revenue: number;
      avatar: string;
    }
  > = {};

  if (employeesList && employeesList.length > 0) {
    employeesList.forEach((emp) => {
      staffStatsMap[emp.name] = {
        name: emp.name,
        role: emp.role,
        totalLeads: 0,
        convertedLeads: 0,
        revenue: 0,
        avatar: emp.avatar,
      };
    });
  }

  leadsList.forEach((lead) => {
    const name = lead.assignedTo || "Unassigned";
    if (!staffStatsMap[name]) {
      staffStatsMap[name] = {
        name,
        role: "Travel Consultant",
        totalLeads: 0,
        convertedLeads: 0,
        revenue: 0,
        avatar: lead.avatar || `https://i.pravatar.cc/80?img=${Math.floor(Math.random() * 70)}`,
      };
    }
    staffStatsMap[name].totalLeads += 1;
    if (
      lead.status === "Booked" ||
      lead.status === "Travel Completed" ||
      lead.status === "Completed"
    ) {
      staffStatsMap[name].convertedLeads += 1;
      staffStatsMap[name].revenue += lead.budget || 0;
    }
  });

  const staffStats = Object.values(staffStatsMap)
    .filter(
      (staff) =>
        staff.totalLeads > 0 || (employeesList && employeesList.some((e) => e.name === staff.name)),
    )
    .sort((a, b) => b.revenue - a.revenue || b.totalLeads - a.totalLeads);

  // Employee Task Performance Aggregation
  const employeeTaskStats = (employeesList || INITIAL_EMPLOYEES)
    .map((emp) => {
      const empTasks = (tasksList || []).filter((t) => t.assignee === emp.name);
      const completedTasks = empTasks.filter(
        (t) => t.status === "Done" || t.status === "Completed",
      ).length;
      const totalTasks = empTasks.length;

      const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      return {
        ...emp,
        completedTasks,
        totalTasks,
        completionRate,
      };
    })
    .sort((a, b) => b.completionRate - a.completionRate || b.totalTasks - a.totalTasks);

  // Booking Trend
  const bookingTrendData = useMemo(() => {
    const monthlyRev: Record<string, { bookings: number; revenue: number }> = {};
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Initialize with all months in order or just empty?
    // Let's just track months that exist or last 6 months. For simplicity, we just aggregate what exists and sort by month index, or keep it simple.
    const monthOrder: string[] = [];

    (bookingsList || []).forEach((b: any) => {
      if (b.status === "Cancelled" || b.status === "Refunded") return;

      const dateStr = b.bookingDate || b.travelDate || "";
      const monthMatch = dateStr.match(/^\d{4}-(\d{2})-\d{2}$/);

      if (monthMatch) {
        const monthIdx = parseInt(monthMatch[1], 10) - 1;
        const month = monthNames[monthIdx];

        if (!monthlyRev[month]) {
          monthlyRev[month] = { bookings: 0, revenue: 0 };
        }
        monthlyRev[month].bookings += 1;
        monthlyRev[month].revenue += b.amount || 0;
      }
    });

    // Extract existing months and sort them by standard calendar order
    const sortedMonths = Object.keys(monthlyRev).sort(
      (a, b) => monthNames.indexOf(a) - monthNames.indexOf(b),
    );

    // If no data, return a default empty chart or 0 for current month
    if (sortedMonths.length === 0) {
      return [{ month: monthNames[new Date().getMonth()], bookings: 0, revenue: 0 }];
    }

    return sortedMonths.map((month) => ({
      month,
      bookings: monthlyRev[month].bookings,
      revenue: parseFloat((monthlyRev[month].revenue / 100000).toFixed(2)), // in Lakhs
    }));
  }, [bookingsList]);

  // User Action Items (Row 4)
  const myPendingTasks = tasksList
    .filter(
      (t) =>
        (user?.user?.role === "admin" || t.assignee === user?.user?.name) && t.status !== "Done",
    )
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 5);

  const handleToggleTask = (id: string) => {
    setTasksList((prev: any[]) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: t.status === "Done" ? "Pending" : "Done" } : t,
      ),
    );
  };

  const upcomingFollowups = leadsList
    .filter((l) => l.nextFollowUp && l.nextFollowUp >= todayStr)
    .sort((a, b) => new Date(a.nextFollowUp).getTime() - new Date(b.nextFollowUp).getTime())
    .slice(0, 5);

  const kpis = [
    {
      label: "Today's Leads",
      value: todayLeadsCount,
      icon: Users,
      trend: "+5 today",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      color: "text-blue-600",
    },
    {
      label: "Today's Sales",
      value: formatINR(todaySalesAmount),
      icon: IndianRupee,
      trend: "confirmed",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
      color: "text-emerald-600",
    },
    {
      label: "Active Bookings",
      value: activeBookingsCount,
      icon: CalendarCheck,
      trend: "in progress",
      bg: "bg-violet-500/10",
      border: "border-violet-500/20",
      color: "text-violet-600",
    },
    {
      label: "Pending Payments",
      value: formatINR(pendingPaymentsAmount),
      icon: AlertCircle,
      trend: "requires follow-up",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20",
      color: "text-rose-600",
    },
    {
      label: "Follow-ups Today",
      value: followupsTodayCount,
      icon: UserCheck,
      trend: "scheduled calls",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      color: "text-amber-600",
    },
    {
      label: "Upcoming Departures",
      value: upcomingDeparturesCount,
      icon: Plane,
      trend: "next 7 days",
      bg: "bg-cyan-500/10",
      border: "border-cyan-500/20",
      color: "text-cyan-600",
    },
    {
      label: "Conversion Rate",
      value: `${conversionRate}%`,
      icon: TrendingUp,
      trend: "overall",
      bg: "bg-pink-500/10",
      border: "border-pink-500/20",
      color: "text-pink-600",
      tooltip: convertedNames,
    },
    {
      label: "Monthly Revenue",
      value: formatLakhs(monthlyRevenueTotal),
      icon: TrendingUp,
      trend: "MTD ledger",
      bg: "bg-primary/100/10",
      border: "border-orange-500/20",
      color: "text-orange-600",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* 8 KPI Cards Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {kpis.map((s) => (
          <div
            key={s.label}
            title={s.tooltip}
            className={`group relative overflow-hidden rounded-2xl border ${s.border} bg-card p-5 shadow-card hover:shadow-premium hover:-translate-y-0.5 transition-all duration-300`}
          >
            <div className="flex items-center justify-between">
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${s.bg} ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </span>
              <span className="text-[10px] font-bold text-muted-foreground capitalize bg-secondary/80 px-2 py-0.5 rounded-md">
                {s.trend}
              </span>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-1 font-display text-2xl font-black tracking-tight truncate">
              {s.value}
            </p>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* Row 1: Revenue Graph (Line) & Lead Source (Pie) */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card min-w-0 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display text-lg font-bold">Monthly Revenue Trend</h3>
              <p className="text-xs text-muted-foreground">
                Cumulative monthly revenue from completed booking invoices
              </p>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={bookingTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                <XAxis
                  dataKey="month"
                  stroke="#888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<RevenueTooltip />} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ r: 5, fill: "var(--primary)", strokeWidth: 2 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Source Pie Chart */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card min-w-0 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-bold">Lead Source Share</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Distribution of channels acquiring current leads
            </p>
            <div className="h-64 relative flex items-center justify-center">
              {sourceData.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={sourceData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="42%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={3}
                      labelLine={false}
                      label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {sourceData.map((entry, i) => (
                        <Cell key={i} fill={SOURCE_HEX_COLORS[entry.name] || COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend
                      verticalAlign="bottom"
                      height={40}
                      iconType="circle"
                      wrapperStyle={{ fontSize: 10, paddingTop: "20px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-muted-foreground">No leads source details logged</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Destination-wise Sales (Bar) & Employee Task Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Destination performance */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card min-w-0">
          <div>
            <h3 className="font-display text-lg font-bold">Destination Sales Ledger</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Total booking billing values segmented by destinations
            </p>
          </div>
          <div className="h-72">
            <ResponsiveContainer>
              <BarChart data={destinationSalesData.slice(0, 6)}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                <XAxis
                  dataKey="name"
                  stroke="#888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: "rgba(255,107,0,0.05)" }} />
                <Bar dataKey="value" fill="var(--primary)" radius={[6, 6, 0, 0]}>
                  {destinationSalesData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Employee Task Performance */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                  <ListChecks className="h-5 w-5 text-primary" /> Employee Task Performance
                </h3>
                <p className="text-xs text-muted-foreground">
                  Task completion rates and metrics by consultant
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {employeeTaskStats.slice(0, 4).map((staff, idx) => {
                const rate = staff.completionRate;
                let badgeColor = "text-rose-600 bg-rose-50 border-rose-200";
                let badgeText = "Needs Focus";
                let progressColor = "bg-rose-500";

                if (rate >= 80) {
                  badgeColor = "text-emerald-600 bg-emerald-50 border-emerald-200";
                  badgeText = "Outstanding";
                  progressColor = "bg-emerald-500";
                } else if (rate >= 70) {
                  badgeColor = "text-blue-600 bg-blue-50 border-blue-200";
                  badgeText = "Good";
                  progressColor = "bg-blue-500";
                } else if (rate >= 50) {
                  badgeColor = "text-amber-600 bg-amber-50 border-amber-200";
                  badgeText = "Average";
                  progressColor = "bg-amber-500";
                }

                return (
                  <div
                    key={staff.name}
                    className="flex items-center justify-between gap-4 p-2.5 rounded-xl hover:bg-secondary/40 transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        {staff.avatar ? (
                          <img
                            src={staff.avatar}
                            alt={staff.name}
                            className="h-10 w-10 rounded-xl object-cover border border-border"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-xl bg-gray-100 border border-border flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-foreground">
                          {staff.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate">{staff.role}</p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end shrink-0 text-right min-w-[120px]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          {staff.completedTasks}/{staff.totalTasks} Tasks
                        </span>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${badgeColor}`}
                        >
                          {badgeText}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 mt-1 w-24">
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${progressColor}`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-[10px] font-semibold text-muted-foreground w-6 text-right">
                          {rate}%
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full mt-4 text-xs font-semibold rounded-xl text-primary hover:text-primary-foreground hover:bg-primary"
            asChild
          >
            <Link to="/crm/tasks" className="flex items-center justify-center gap-1">
              Manage Tasks <ChevronRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Row 3: Booking Volume Trend (Bar) & Lead Funnel (Bar) */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Booking Volume Trend */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card min-w-0">
          <h3 className="font-display text-lg font-bold">Monthly Booking Trend</h3>
          <p className="text-xs text-muted-foreground mb-4">
            Total booking reservations confirmed per month
          </p>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={bookingTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                <XAxis
                  dataKey="month"
                  stroke="#888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip cursor={{ fill: "rgba(255,107,0,0.05)" }} />
                <Bar dataKey="bookings" fill="#FF8A33" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Funnel */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-display text-lg font-bold">Active Lead Funnel</h3>
              <Link
                to="/crm/leads"
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5"
              >
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Lead counts segmented by current pipeline status
            </p>
            <div className="h-60">
              <ResponsiveContainer>
                <BarChart
                  data={[
                    {
                      stage: "New Lead",
                      count: leadsList.filter((l) => l.status === "New Lead").length,
                    },
                    {
                      stage: "Contacted",
                      count: leadsList.filter((l) => l.status === "Contacted").length,
                    },
                    {
                      stage: "Quotation",
                      count: leadsList.filter((l) => l.status === "Quotation Sent").length,
                    },
                    {
                      stage: "Negotiate",
                      count: leadsList.filter((l) => l.status === "Negotiation").length,
                    },
                    {
                      stage: "Confirmed",
                      count: leadsList.filter(
                        (l) => l.status === "Confirmed" || l.status === "Booked",
                      ).length,
                    },
                  ]}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate({ to: "/crm/leads" })}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                  <XAxis
                    dataKey="stage"
                    stroke="#888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#888"
                    fontSize={11}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip cursor={{ fill: "rgba(255,107,0,0.05)" }} />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {[0, 1, 2, 3, 4].map((index) => (
                      <Cell key={`cell-${index}`} fill={FUNNEL_COLORS[index]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Row 4: My Pending Tasks & Upcoming Follow-ups */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* My Pending Tasks */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary" /> My Pending Tasks
                </h3>
                <p className="text-xs text-muted-foreground">Action items assigned to you</p>
              </div>
            </div>

            <div className="space-y-3">
              {myPendingTasks.length > 0 ? (
                myPendingTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-xl border border-border hover:bg-secondary/40 transition-colors"
                  >
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="mt-0.5 shrink-0 transition-transform hover:scale-110 active:scale-95 text-muted-foreground hover:text-primary"
                      aria-label="Mark as done"
                    >
                      <Circle className="h-5 w-5" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate text-foreground">{task.title}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-2">
                        <span className="font-medium text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                          {task.priority}
                        </span>
                        <span>Due: {task.dueDate}</span>
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-secondary/20 rounded-xl border border-dashed border-border">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-foreground">You're all caught up!</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    No pending tasks found for you.
                  </p>
                </div>
              )}
            </div>
          </div>
          {myPendingTasks.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-4 text-xs font-semibold rounded-xl text-primary hover:text-primary-foreground hover:bg-primary"
              asChild
            >
              <Link to="/crm/tasks" className="flex items-center justify-center gap-1">
                View all tasks <ChevronRight className="h-3 w-3" />
              </Link>
            </Button>
          )}
        </div>

        {/* Upcoming Follow-ups */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                  <Phone className="h-5 w-5 text-primary" /> Upcoming Follow-ups
                </h3>
                <p className="text-xs text-muted-foreground">
                  Scheduled client calls and follow-ups
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {upcomingFollowups.length > 0 ? (
                upcomingFollowups.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-border hover:bg-secondary/40 transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate text-foreground">{lead.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-2">
                        <span className="font-medium text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                          {lead.destination || "General"}
                        </span>
                        <span>{lead.phone}</span>
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-[10px] font-semibold text-foreground bg-secondary px-2 py-1 rounded-md">
                        {new Date(lead.nextFollowUp).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-8 text-center bg-secondary/20 rounded-xl border border-dashed border-border">
                  <Phone className="h-8 w-8 text-muted-foreground mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-semibold text-foreground">No upcoming follow-ups</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your schedule is clear for now.
                  </p>
                </div>
              )}
            </div>
          </div>
          {upcomingFollowups.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="w-full mt-4 text-xs font-semibold rounded-xl text-primary hover:text-primary-foreground hover:bg-primary"
              asChild
            >
              <Link to="/crm/leads" className="flex items-center justify-center gap-1">
                View all leads <ChevronRight className="h-3 w-3" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
