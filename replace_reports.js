const fs = require('fs');

const path = '/Users/jatinjangid/Downloads/crm-lookmywebsites/src/routes/crm.reports.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add imports
content = content.replace(
  'import { createFileRoute } from "@tanstack/react-router";',
  'import React, { useMemo } from "react";\nimport { createFileRoute } from "@tanstack/react-router";\nimport { useSupabaseTable } from "@/hooks/useSupabaseTable";\nimport { useLeadsManager } from "@/hooks/useLeadsManager";'
);

content = content.replace(
  'import { bookings, leads, formatINR } from "@/lib/mock-data";',
  'import { formatINR } from "@/lib/mock-data";'
);

// 2. Remove static arrays and variables
content = content.replace(/\/\* ─── Chart data ─── \*\/(.|\n)*?function KpiCard/g, 'const COLORS = ["var(--primary)", "#FF8A33", "#FFA666", "#FFC299", "#FFDEC0"];\n\nfunction KpiCard');

// 3. Update ReportsPage to use hooks and useMemo
const reportsPageReplacement = `function ReportsPage() {
  const [bookings] = useSupabaseTable<any[]>("bookings", []);
  const [leads] = useLeadsManager();
  const [employees] = useSupabaseTable<any[]>("employees", []);

  const {
    totalRevenue,
    pendingAmount,
    wonLeads,
    activeBookingsCount,
    revenueByMonth,
    sourceData,
    destData,
    leaderboard
  } = useMemo(() => {
    const rev = bookings.reduce((s, b) => s + (Number(b.paid_amount) || 0), 0);
    const pending = bookings.reduce((s, b) => s + (Number(b.remaining_amount) || 0), 0);
    const won = leads.filter(l => l.status === "Booked" || l.status === "Completed").length;
    const active = bookings.filter(b => b.booking_status !== "Cancelled" && b.booking_status !== "Completed").length;

    const monthlyMap: Record<string, { revenue: number; bookings: number }> = {
      "Jan": { revenue: 0, bookings: 0 }, "Feb": { revenue: 0, bookings: 0 },
      "Mar": { revenue: 0, bookings: 0 }, "Apr": { revenue: 0, bookings: 0 },
      "May": { revenue: 0, bookings: 0 }, "Jun": { revenue: 0, bookings: 0 },
      "Jul": { revenue: 0, bookings: 0 }, "Aug": { revenue: 0, bookings: 0 },
      "Sep": { revenue: 0, bookings: 0 }, "Oct": { revenue: 0, bookings: 0 },
      "Nov": { revenue: 0, bookings: 0 }, "Dec": { revenue: 0, bookings: 0 },
    };
    
    bookings.forEach(b => {
      if (b.created_at) {
        const d = new Date(b.created_at);
        const m = d.toLocaleString('en-US', { month: 'short' });
        if (monthlyMap[m]) {
          monthlyMap[m].bookings += 1;
          monthlyMap[m].revenue += (Number(b.paid_amount) || 0) / 100000;
        }
      }
    });
    
    const revByMonthArr = Object.entries(monthlyMap)
      .map(([month, data]) => ({ month, revenue: Number(data.revenue.toFixed(2)), bookings: data.bookings }))
      .filter(x => x.revenue > 0 || x.bookings > 0);

    const finalRevByMonth = revByMonthArr.length > 0 ? revByMonthArr : [
      { month: "Jan", revenue: 0, bookings: 0 },
      { month: "Feb", revenue: 0, bookings: 0 }
    ];

    const destMap: Record<string, number> = {};
    bookings.forEach(b => {
      const lead = leads.find(l => l.id === b.lead_id);
      if (lead && lead.destination) {
        destMap[lead.destination] = (destMap[lead.destination] || 0) + (Number(b.paid_amount) || 0);
      }
    });
    const finalDestData = Object.entries(destMap).map(([dest, rev]) => ({
      dest,
      revenue: Number((rev / 100000).toFixed(2))
    })).sort((a, b) => b.revenue - a.revenue).slice(0, 6);

    const sourceMap: Record<string, number> = {};
    leads.forEach(l => {
      const src = l.source || "Other";
      sourceMap[src] = (sourceMap[src] || 0) + 1;
    });
    const totalSources = Object.values(sourceMap).reduce((a,b) => a+b, 0);
    const finalSourceData = Object.entries(sourceMap).map(([name, val]) => ({
      name,
      value: totalSources > 0 ? Math.round((val / totalSources) * 100) : 0
    })).sort((a, b) => b.value - a.value).slice(0, 5);

    const empData = employees.map(emp => {
      return {
        name: emp.name || "Unknown",
        avatar: emp.avatar || \`https://ui-avatars.com/api/?name=\${encodeURIComponent(emp.name || "U")}&background=random\`,
        deals: emp.closedDeals || 0,
        revenue: emp.revenue || 0,
        conversion: emp.leads > 0 ? Math.round(((emp.closedDeals || 0) / emp.leads) * 100) : 0,
      };
    }).sort((a, b) => b.revenue - a.revenue).slice(0, 4);

    return {
      totalRevenue: rev,
      pendingAmount: pending,
      wonLeads: won,
      activeBookingsCount: active,
      revenueByMonth: finalRevByMonth,
      sourceData: finalSourceData.length > 0 ? finalSourceData : [{name: "No Data", value: 100}],
      destData: finalDestData.length > 0 ? finalDestData : [{dest: "No Data", revenue: 0}],
      leaderboard: empData
    };
  }, [bookings, leads, employees]);
`;
content = content.replace('function ReportsPage() {', reportsPageReplacement);

// 4. Fix Active Bookings KPI value binding
content = content.replace(
  'value={String(bookings.filter((b) => b.status !== "Cancelled").length)}',
  'value={String(activeBookingsCount)}'
);

// 5. Fix Leaderboard revenue binding check for 0 division
content = content.replace(
  'width: `${Math.round((c.revenue / leaderboard[0].revenue) * 100)}%`,',
  'width: `${leaderboard.length > 0 && leaderboard[0].revenue > 0 ? Math.round((c.revenue / leaderboard[0].revenue) * 100) : 0}%`,'
);


fs.writeFileSync(path, content, 'utf8');
console.log('Done');
