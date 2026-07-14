import { createFileRoute } from "@tanstack/react-router";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { IndianRupee, TrendingUp, UserCheck, CalendarCheck, Star, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/mock-data";
import { useSupabaseTable } from "@/hooks/useSupabaseTable";
import { INITIAL_EMPLOYEES } from "./crm.employees";

export const Route = createFileRoute("/crm/reports")({ component: ReportsPage });

const COLORS = ["var(--primary)", "#FF8A33", "#FFA666", "#FFC299", "#FFDEC0", "#FFC8A2"];

function KpiCard({
  label,
  value,
  icon,
  sub,
  color,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
  sub?: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${color}`}>{icon}</span>
      </div>
      <p className="mt-3 font-display text-2xl font-bold">{value}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h2 className="font-display text-lg font-bold">{title}</h2>
        <p className="text-sm text-muted-foreground">{sub}</p>
      </div>
    </div>
  );
}

function ReportsPage() {
  const [leadsList] = useSupabaseTable<any[]>("leads", []);
  const [bookingsList] = useSupabaseTable<any[]>("bookings", []);
  const [employeesList] = useSupabaseTable<any[]>("employees", INITIAL_EMPLOYEES);

  const totalRevenue = bookingsList.reduce((s, b) => s + (b.paid || 0), 0);
  const pendingAmount = bookingsList.reduce((s, b) => s + ((b.amount || 0) - (b.paid || 0)), 0);
  const wonLeads = leadsList.filter((l) => l.status === "on conform" || l.status === "in process" || l.status === "Confirmed").length;
  
  const exportCSV = () => {
    const rows = [
      ["Report Type", "Month/Dest/Name", "Metric 1", "Metric 2"],
      ["Revenue & Bookings Trend", "", "", ""],
      ...revenueByMonth.map((r) => ["Trend", r.month, `${r.revenue} Lakhs`, `${r.bookings} Bookings`]),
      [],
      ["Revenue by Destination", "", "", ""],
      ...destData.map((d) => ["Destination", d.dest, `${d.revenue} Lakhs`, ""]),
      [],
      ["Consultant Leaderboard", "", "", ""],
      ...leaderboard.map((l) => ["Consultant", l.name, `₹${l.revenue}`, `${l.deals} Deals`]),
    ];

    const csv = rows.map((row) => row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `reports-analytics-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(anchor); // Required for Safari/Firefox
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  // Compute revenueByMonth
  const revenueMap = new Map();
  bookingsList.forEach((b) => {
    if (!b.bookingDate) return;
    const date = new Date(b.bookingDate);
    const month = date.toLocaleString("default", { month: "short" });
    if (!revenueMap.has(month)) revenueMap.set(month, { revenue: 0, bookings: 0 });
    const data = revenueMap.get(month);
    data.revenue += (b.amount || 0) / 100000;
    data.bookings += 1;
  });
  const allMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const revenueByMonth = allMonths
    .map((month) => ({
      month,
      revenue: Number((revenueMap.get(month)?.revenue || 0).toFixed(2)),
      bookings: revenueMap.get(month)?.bookings || 0,
    }))
    .filter((m, i) => m.revenue > 0 || m.bookings > 0 || i <= new Date().getMonth());

  // Compute destData
  const destMap = new Map();
  bookingsList.forEach((b) => {
    const dest = b.details?.destination || b.destination || "Other";
    destMap.set(dest, (destMap.get(dest) || 0) + (b.amount || 0));
  });
  const destData = Array.from(destMap.entries())
    .map(([dest, amt]) => ({
      dest,
      revenue: Number((amt / 100000).toFixed(2)),
    }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  // Compute sourceData
  const sourceMap = new Map();
  leadsList.forEach((l) => {
    const s = l.source || "Other";
    sourceMap.set(s, (sourceMap.get(s) || 0) + 1);
  });
  const totalSources = leadsList.length || 1;
  const sourceData = Array.from(sourceMap.entries())
    .map(([name, count]) => ({
      name,
      value: Math.round((count / totalSources) * 100),
    }))
    .sort((a, b) => b.value - a.value);

  // Compute leaderboard
  const consultantMap = new Map();
  // Initialize map with all employees
  employeesList.forEach((e) => {
    consultantMap.set(e.name, { deals: 0, revenue: 0, leads: 0 });
  });

  bookingsList.forEach((b) => {
    const c = b.bookedBy || "Unknown";
    if (!consultantMap.has(c)) consultantMap.set(c, { deals: 0, revenue: 0, leads: 0 });
    consultantMap.get(c).deals += 1;
    consultantMap.get(c).revenue += b.amount || 0;
  });
  leadsList.forEach((l) => {
    const c = l.assignedTo;
    if (c) {
      if (!consultantMap.has(c)) consultantMap.set(c, { deals: 0, revenue: 0, leads: 0 });
      consultantMap.get(c).leads += 1;
    }
  });
  const leaderboard = Array.from(consultantMap.entries())
    .map(([name, data]) => {
      const conversion = data.leads ? Math.round((data.deals / data.leads) * 100) : 0;
      const emp = employeesList.find((e) => e.name === name);
      return {
        name,
        avatar: emp?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        deals: data.deals,
        revenue: data.revenue,
        conversion,
      };
    })
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5); // top 5

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Revenue, pipeline and consultant performance at a glance.
          </p>
        </div>
        <Button variant="outline" className="gap-2 rounded-xl" onClick={exportCSV}>
          <Download className="h-4 w-4" /> Export CSV
        </Button>
      </div>

      {/* KPI strip */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="MTD Revenue"
          value={formatINR(totalRevenue)}
          icon={<IndianRupee className="h-4 w-4" />}
          sub="Collected this month"
          color="bg-primary/15 text-primary"
        />
        <KpiCard
          label="Pending Amount"
          value={formatINR(pendingAmount)}
          icon={<TrendingUp className="h-4 w-4" />}
          sub="Awaiting collection"
          color="bg-amber-100 text-amber-600"
        />
        <KpiCard
          label="Won Leads"
          value={`${wonLeads} / ${leadsList.length}`}
          icon={<UserCheck className="h-4 w-4" />}
          sub="Conversion rate"
          color="bg-emerald-100 text-emerald-600"
        />
        <KpiCard
          label="Active Bookings"
          value={String(bookingsList.filter((b) => b.status !== "Cancelled").length)}
          icon={<CalendarCheck className="h-4 w-4" />}
          sub="Non-cancelled"
          color="bg-blue-100 text-blue-600"
        />
      </div>

      {/* Revenue + Bookings trend */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-card min-w-0">
        <SectionHeader
          title="Revenue & Bookings Trend"
          sub="Monthly figures (₹ lakhs) and total bookings"
        />
        <div className="mt-4 h-72">
          <ResponsiveContainer>
            <LineChart data={revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                name="Revenue (₹L)"
                stroke="var(--primary)"
                strokeWidth={3}
                dot={{ r: 5 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="bookings"
                name="Bookings"
                stroke="#6366f1"
                strokeWidth={2}
                dot={{ r: 4 }}
                strokeDasharray="5 5"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Destination revenue + Lead source */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card min-w-0">
          <SectionHeader title="Revenue by Destination" sub="₹ lakhs — current year" />
          <div className="mt-4 h-64">
            <ResponsiveContainer>
              <BarChart data={destData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="dest" type="category" tick={{ fontSize: 12 }} width={72} />
                <Tooltip formatter={(v) => [`₹${v}L`, "Revenue"]} />
                <Bar dataKey="revenue" radius={[0, 8, 8, 0]}>
                  {destData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-card min-w-0">
          <SectionHeader title="Lead Sources" sub="Where inquiries come from" />
          <div className="mt-4 flex items-center gap-6">
            <div className="h-56 w-56 shrink-0">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={sourceData}
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={88}
                    paddingAngle={3}
                    label={false}
                  >
                    {sourceData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {sourceData.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: COLORS[i] }}
                  />
                  <span className="flex-1 text-sm">{s.name}</span>
                  <span className="text-sm font-semibold">{s.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Consultant leaderboard */}
      <div className="rounded-2xl border border-border bg-card shadow-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-display text-lg font-bold">Consultant Leaderboard</h2>
          <p className="text-sm text-muted-foreground">
            Ranked by revenue generated — current year
          </p>
        </div>
        <div className="divide-y divide-border">
          {leaderboard.map((c, i) => (
            <div
              key={c.name}
              className="flex items-center gap-4 px-6 py-4 hover:bg-secondary/30 transition-colors"
            >
              {/* Rank */}
              <span
                className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl font-display text-sm font-bold ${
                  i === 0
                    ? "bg-amber-100 text-amber-700"
                    : i === 1
                      ? "bg-slate-100 text-slate-600"
                      : "bg-secondary text-muted-foreground"
                }`}
              >
                #{i + 1}
              </span>
              <img src={c.avatar} alt={c.name} className="h-10 w-10 rounded-full" />
              <div className="flex-1">
                <p className="font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.deals} deals closed</p>
              </div>
              {/* Conversion */}
              <div className="hidden text-center sm:block">
                <p className="font-semibold">{c.conversion}%</p>
                <p className="text-xs text-muted-foreground">Conversion</p>
              </div>
              {/* Revenue */}
              <div className="text-right">
                <p className="font-display text-lg font-bold text-primary">
                  {formatINR(c.revenue)}
                </p>
                <p className="text-xs text-muted-foreground">Revenue</p>
              </div>
              {/* Mini bar */}
              <div className="hidden w-24 sm:block">
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: leaderboard.length > 0 && leaderboard[0].revenue > 0 ? `${Math.round((c.revenue / leaderboard[0].revenue) * 100)}%` : '0%',
                      background: "var(--gradient-brand)",
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lead pipeline table */}
      <div className="rounded-2xl border border-border bg-card shadow-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-display text-lg font-bold">Lead Pipeline Summary</h2>
          <p className="text-sm text-muted-foreground">Stage-wise breakdown of all leads</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-6 py-3">Stage</th>
                <th className="px-6 py-3">Count</th>
                <th className="px-6 py-3">% of Total</th>
                <th className="px-6 py-3">Progress</th>
              </tr>
            </thead>
            <tbody>
              {(
                [
                  "New Lead",
                  "Contacted",
                  "Quotation Sent",
                  "Negotiation",
                  "Booked",
                  "Completed",
                  "Lost",
                ] as const
              ).map((stage) => {
                const count = leadsList.filter((l) => l.status === stage).length;
                const pct = leadsList.length ? Math.round((count / leadsList.length) * 100) : 0;
                return (
                  <tr key={stage} className="border-t border-border hover:bg-secondary/20">
                    <td className="px-6 py-3 font-medium">{stage}</td>
                    <td className="px-6 py-3">{count}</td>
                    <td className="px-6 py-3">{pct}%</td>
                    <td className="px-6 py-3 w-40">
                      <div className="h-1.5 overflow-hidden rounded-full bg-border">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
