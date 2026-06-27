import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Plus, Users, UserCheck, IndianRupee, CalendarCheck, TrendingUp, TrendingDown, AlertCircle, Award, ChevronRight, Sparkles, User } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { revenueByMonth, destinationPerformance, leads as seedLeads, bookings as seedBookings, customers as seedCustomers, formatINR } from "@/lib/mock-data";
import { getAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/lib/use-local-storage";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { INITIAL_EMPLOYEES } from "./crm.employees";
import { SEED_PACKAGES } from "./crm.packages";

export const Route = createFileRoute("/crm/")({
  component: Dashboard,
});

const COLORS = ["#FF6B00", "#FF8A33", "#FFA666", "#FFC299", "#FFD9BF", "#FFE9D9"];

const AVATARS = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

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
        <p className="font-display text-sm font-extrabold text-primary">
          {payload[0].value} Leads
        </p>
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

  
  // Read dynamic lists safely (read-only) from localStorage to prevent default-overwriting bugs
  const leadsList = getLocalStorageItem<any[]>("crm_leads_v2", []);
  const bookingsList = getLocalStorageItem<any[]>("crm_bookings", seedBookings);
  const customersList = getLocalStorageItem<any[]>("crm_customers_v2", []);
  const localEmployeesList = getLocalStorageItem<any[]>("crm_employees_v3", []);
  const employeesList = localEmployeesList?.length ? localEmployeesList : INITIAL_EMPLOYEES;
  const packagesList = getLocalStorageItem<any[]>("crm_packages", SEED_PACKAGES);

  const tagCounts: Record<string, number> = {};
  packagesList.forEach(p => {
    if (p.active) {
      tagCounts[p.tag] = (tagCounts[p.tag] || 0) + 1;
    }
  });
  const packagePerformance = Object.entries(tagCounts).map(([name, value]) => ({
    name,
    value
  })).sort((a, b) => b.value - a.value);

  const totalRevenue = bookingsList.reduce((s, b) => s + b.paid, 0);
  const pending = bookingsList.reduce((s, b) => s + (b.amount - b.paid), 0);

  // Aggregate staff statistics from dynamic leads list
  const staffStatsMap: Record<string, {
    name: string;
    role: string;
    totalLeads: number;
    convertedLeads: number;
    revenue: number;
    avatar: string;
  }> = {};

  // Seed standard employees if available
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

  // Populate from leads list
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
    if (lead.status === "Booked" || lead.status === "Completed") {
      staffStatsMap[name].convertedLeads += 1;
      staffStatsMap[name].revenue += lead.budget || 0;
    }
  });

  const staffStats = Object.values(staffStatsMap)
    .filter(staff => staff.totalLeads > 0 || (employeesList && employeesList.some(e => e.name === staff.name)))
    .sort((a, b) => b.revenue - a.revenue || b.totalLeads - a.totalLeads);

  const stats = [
    { label: "Total leads", value: leadsList.length, icon: UserCheck, trend: "+12%", bg: "bg-blue-50", color: "text-blue-600" },
    { label: "Total customers", value: customersList.length, icon: Users, trend: "+8%", bg: "bg-emerald-50", color: "text-emerald-600" },
    { label: "Revenue (MTD)", value: formatLakhs(totalRevenue), icon: IndianRupee, trend: "+18%", bg: "bg-amber-50", color: "text-amber-600" },
    { label: "Bookings", value: bookingsList.length, icon: CalendarCheck, trend: "+5%", bg: "bg-violet-50", color: "text-violet-600" },
    { label: "Pending payments", value: formatLakhs(pending), icon: AlertCircle, trend: "−3%", bg: "bg-rose-50", color: "text-rose-600" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Dynamic, modern premium banner */}
      <div className="relative overflow-hidden rounded-3xl border border-border p-6 sm:p-8 shadow-card" style={{ background: "linear-gradient(135deg, rgba(255, 107, 0, 0.06) 0%, rgba(255, 138, 51, 0.02) 100%)" }}>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
              <Sparkles className="h-3 w-3 animate-pulse" /> LookMyHolidays Workspace
            </span>
            <h1 className="font-display text-3xl font-extrabold tracking-tight">Welcome back, {user?.name || "Riya"} 👋</h1>
            <p className="mt-1.5 text-sm text-muted-foreground max-w-lg">
              Here is what's happening with your travel business today. Monitor inquiries, track agent leads performance, and manage bookings.
            </p>
          </div>
          <div className="flex gap-2.5">
            <Button variant="outline" className="gap-2 rounded-xl bg-background border-border hover:bg-secondary/40 shadow-sm" asChild>
              <Link to="/crm/leads">
                <Plus className="h-4 w-4" /> New Lead
              </Link>
            </Button>
            <Button style={{ background: "var(--gradient-brand)" }} className="gap-2 rounded-xl text-primary-foreground shadow-md hover:opacity-90 transition-opacity" asChild>
              <Link to="/crm/bookings">
                <CalendarCheck className="h-4 w-4" /> New Booking
              </Link>
            </Button>
          </div>
        </div>
        <div className="absolute right-0 bottom-0 top-0 w-1/3 bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      </div>

      {/* Grid Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-card hover:shadow-premium hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${s.bg} ${s.color}`}><s.icon className="h-5 w-5" /></span>
              <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                s.trend.startsWith('+') ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
              }`}>
                {s.trend.startsWith('+') ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )} {s.trend}
              </span>
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-black tracking-tight">{s.value}</p>
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        ))}
      </div>

      {/* Middle row: Chart + Staff Leads Performance */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card lg:col-span-2">
          <h3 className="font-display text-lg font-bold">Monthly revenue (₹ lakhs)</h3>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <LineChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="month" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip content={<RevenueTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke="#FF6B00" strokeWidth={3} dot={{ r: 5, fill: "#FF6B00", strokeWidth: 2 }} activeDot={{ r: 7 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Staff performance card */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-lg font-bold flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" /> Staff Performance
                </h3>
                <p className="text-xs text-muted-foreground">Leads conversion & pipeline won by agent</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {staffStats.slice(0, 5).map((staff, idx) => {
                const convRate = staff.totalLeads > 0 ? Math.round((staff.convertedLeads / staff.totalLeads) * 100) : 0;
                
                let progressColor = "bg-rose-500";
                if (convRate >= 50) progressColor = "bg-emerald-500";
                else if (convRate >= 25) progressColor = "bg-primary";
                else if (convRate > 0) progressColor = "bg-amber-500";

                return (
                  <div key={staff.name} className="flex items-center justify-between gap-4 p-2 rounded-xl hover:bg-secondary/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative">
                        {staff.avatar ? (
                          <img 
                            src={staff.avatar} 
                            alt={staff.name} 
                            className="h-10 w-10 rounded-xl object-cover border border-border"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                        {idx === 0 && (
                          <span className="absolute -top-1.5 -right-1.5 text-xs font-bold drop-shadow-sm">
                            🏆
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold truncate text-foreground">{staff.name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{staff.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end shrink-0 text-right min-w-[95px]">
                      <span className="text-sm font-bold text-primary">{formatINR(staff.revenue)}</span>
                      <div className="flex items-center gap-1.5 mt-1 w-20">
                        <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${convRate || 4}%` }} />
                        </div>
                        <span className="text-[10px] font-semibold text-muted-foreground w-6 text-right">{convRate}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-4 text-xs font-semibold rounded-xl text-primary hover:text-primary-foreground hover:bg-primary" asChild>
            <Link to="/crm/employees" className="flex items-center justify-center gap-1">
              View All Employees <ChevronRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Bottom row: Funnel, Bookings & Destinations */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lead Funnel — live data, click bar to go to Leads */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display text-lg font-bold">Lead funnel</h3>
            <Link
              to="/crm/leads"
              className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-0.5"
            >
              View all <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">Click a bar to see those leads</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart
                data={[
                  { stage: "New Lead",  count: leadsList.filter(l => l.status === "New Lead").length },
                  { stage: "Contacted", count: leadsList.filter(l => l.status === "Contacted").length },
                  { stage: "Quoted",    count: leadsList.filter(l => l.status === "Quotation Sent" || l.status === "Quoted").length },
                  { stage: "Negotiate", count: leadsList.filter(l => l.status === "Negotiation").length },
                  { stage: "Booked",    count: leadsList.filter(l => l.status === "Booked" || l.status === "Completed").length },
                ]}
                style={{ cursor: "pointer" }}
                onClick={() => navigate({ to: "/crm/leads" })}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" />
                <XAxis dataKey="stage" stroke="#888" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#888" fontSize={11} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip content={<FunnelTooltip />} cursor={{ fill: "rgba(255,107,0,0.07)" }} />
                <Bar dataKey="count" fill="#FF6B00" radius={[6, 6, 0, 0]}>
                  {[0,1,2,3,4].map((index) => (
                    <Cell key={`cell-${index}`} fill={index === 4 ? "#FF6B00" : "#FFA666"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-bold">Recent bookings</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Latest trip reservation statuses</p>
            <div className="mt-4 overflow-y-auto max-h-60 pr-1 space-y-3 scrollbar-thin">
              {bookingsList.slice(0, 8).map((b) => (
                <div key={b.id} className="flex items-center justify-between rounded-xl bg-secondary/40 hover:bg-secondary/70 p-3 transition-colors">
                  <div>
                    <p className="text-sm font-semibold text-foreground truncate max-w-[120px]">{b.customer}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[150px]">{b.package}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-primary">{formatINR(b.amount)}</p>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-bold mt-1 ${
                      b.status === "Confirmed" || b.status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {b.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-4 text-xs font-semibold rounded-xl text-primary hover:text-primary-foreground hover:bg-primary" asChild>
            <Link to="/crm/bookings" className="flex items-center justify-center gap-1">
              View All Bookings <ChevronRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>

        {/* Package Categories */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card flex flex-col justify-between">
          <div>
            <h3 className="font-display text-lg font-bold">Package types</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Active packages distribution</p>
            <div className="mt-4 h-56 relative flex items-center justify-center">
              {packagePerformance.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={packagePerformance} dataKey="value" nameKey="name" cx="50%" cy="40%" innerRadius={40} outerRadius={60} paddingAngle={2} labelLine={false} label={({ percent }) => `${(percent * 100).toFixed(0)}%`}>
                      {packagePerformance.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 10 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-xs text-muted-foreground">No active packages</p>
              )}
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-4 text-xs font-semibold rounded-xl text-primary hover:text-primary-foreground hover:bg-primary" asChild>
            <Link to="/crm/packages" className="flex items-center justify-center gap-1">
              View All Packages <ChevronRight className="h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
