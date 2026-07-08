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
import { bookings, leads, formatINR } from "@/lib/mock-data";

export const Route = createFileRoute("/crm/reports")({ component: ReportsPage });

/* ─── Chart data ─── */
const revenueByMonth = [
  { month: "Jan", revenue: 18.2, bookings: 8 },
  { month: "Feb", revenue: 22.4, bookings: 11 },
  { month: "Mar", revenue: 26.1, bookings: 14 },
  { month: "Apr", revenue: 31.8, bookings: 17 },
  { month: "May", revenue: 28.4, bookings: 13 },
  { month: "Jun", revenue: 42.9, bookings: 21 },
];

const sourceData = [
  { name: "Website", value: 38 },
  { name: "Instagram", value: 26 },
  { name: "Referral", value: 20 },
  { name: "Google Ads", value: 10 },
  { name: "WhatsApp", value: 6 },
];

const destData = [
  { dest: "Bali", revenue: 15.6 },
  { dest: "Dubai", revenue: 12.9 },
  { dest: "Maldives", revenue: 28.5 },
  { dest: "Europe", revenue: 37.8 },
  { dest: "Thailand", revenue: 11.8 },
  { dest: "Singapore", revenue: 28.5 },
];

const leaderboard = [
  {
    name: "Riya Bansal",
    avatar: "https://i.pravatar.cc/80?img=8",
    deals: 31,
    revenue: 1840000,
    conversion: 74,
  },
  {
    name: "Rahul Gupta",
    avatar: "https://i.pravatar.cc/80?img=53",
    deals: 24,
    revenue: 1260000,
    conversion: 69,
  },
  {
    name: "Amit Shah",
    avatar: "https://i.pravatar.cc/80?img=60",
    deals: 19,
    revenue: 980000,
    conversion: 68,
  },
  {
    name: "Dev Mathur",
    avatar: "https://i.pravatar.cc/80?img=65",
    deals: 8,
    revenue: 420000,
    conversion: 53,
  },
];

const COLORS = ["var(--primary)", "#FF8A33", "#FFA666", "#FFC299", "#FFDEC0"];

const totalRevenue = bookings.reduce((s, b) => s + b.paid, 0);
const pendingAmount = bookings.reduce((s, b) => s + (b.amount - b.paid), 0);
const wonLeads = leads.filter((l) => l.status === "on conform" || l.status === "in process").length;

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
        <Button variant="outline" className="gap-2 rounded-xl">
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
          value={`${wonLeads} / ${leads.length}`}
          icon={<UserCheck className="h-4 w-4" />}
          sub="Conversion rate"
          color="bg-emerald-100 text-emerald-600"
        />
        <KpiCard
          label="Active Bookings"
          value={String(bookings.filter((b) => b.status !== "Cancelled").length)}
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
                      width: `${Math.round((c.revenue / leaderboard[0].revenue) * 100)}%`,
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
                const count = leads.filter((l) => l.status === stage).length;
                const pct = Math.round((count / leads.length) * 100);
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
