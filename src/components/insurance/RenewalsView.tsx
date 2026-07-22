import React, { useMemo } from "react";
import { InsuranceTable } from "./InsuranceTable";
import { AlertCircle, CalendarClock, History, List, Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface RenewalsViewProps {
  policies: any[];
  companies: any[];
  vendors: any[];
  onRenew: (policy: any) => void;
  onEdit: (policy: any) => void;
  onDelete: (policy: any) => void;
}

export function RenewalsView({ policies, companies, vendors, onRenew, onEdit, onDelete }: RenewalsViewProps) {
  const [currentView, setCurrentView] = React.useState<"list" | "calendar">("list");
  const [calendarDate, setCalendarDate] = React.useState<Date>(new Date());
  
  const today = new Date();
  today.setHours(0,0,0,0);

  const getDaysUntilExpiry = (expiryStr: string) => {
    if (!expiryStr) return 999;
    const expiry = new Date(expiryStr);
    expiry.setHours(0,0,0,0);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const categorizedPolicies = useMemo(() => {
    const expired: any[] = [];
    const todayList: any[] = [];
    const next7Days: any[] = [];
    const next15Days: any[] = [];
    const next30Days: any[] = [];
    const later: any[] = [];

    policies.forEach(p => {
      const days = getDaysUntilExpiry(p.expiry_date);
      if (days < 0 || p.status === 'Expired') expired.push(p);
      else if (days === 0) todayList.push(p);
      else if (days <= 7) next7Days.push(p);
      else if (days <= 15) next15Days.push(p);
      else if (days <= 30) next30Days.push(p);
      else later.push(p);
    });

    return { expired, todayList, next7Days, next15Days, next30Days, later };
  }, [policies]);

  const renderSection = (title: string, list: any[], icon: React.ReactNode, bgColor: string, textColor: string) => {
    if (list.length === 0) return null;
    return (
      <div className="mb-8">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-t-xl border-b-0 border border-border font-bold ${bgColor} ${textColor}`}>
          {icon} {title} ({list.length})
        </div>
        <InsuranceTable 
          policies={list} 
          companies={companies} 
          vendors={vendors} 
          onEdit={onEdit} 
          onDuplicate={onRenew} 
          onDelete={onDelete} 
        />
      </div>
    );
  };

  const [date, setDate] = React.useState<Date | undefined>(new Date());

  const selectedDatePolicies = useMemo(() => {
    if (!date) return [];
    const dateStr = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().split('T')[0];
    return policies.filter(p => {
      if (!p.expiry_date) return false;
      return p.expiry_date.startsWith(dateStr);
    });
  }, [policies, date]);

  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  const startDay = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = firstDayOfMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">Upcoming Renewals</h2>
          <p className="text-sm text-muted-foreground">Manage and track policies that are expiring soon.</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-6 overflow-hidden mt-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-brand" />
            {monthName}
          </h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCalendarDate(new Date(year, month - 1, 1))}>Prev</Button>
            <Button variant="outline" size="sm" onClick={() => setCalendarDate(new Date())}>Today</Button>
            <Button variant="outline" size="sm" onClick={() => setCalendarDate(new Date(year, month + 1, 1))}>Next</Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-muted/80 border bg-muted/80 rounded-lg overflow-hidden">
          {weekDays.map(day => (
            <div key={day} className="bg-muted p-3 text-center text-sm font-semibold text-muted-foreground">
              {day}
            </div>
          ))}

          {Array.from({ length: startDay }).map((_, i) => (
            <div key={`empty-${i}`} className="bg-card p-2 min-h-[120px]" />
          ))}

          {daysArray.map(dateObj => {
            const isToday = new Date().toDateString() === dateObj.toDateString();
            const dateStr = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000).toISOString().split('T')[0];
            const dayPolicies = policies.filter(p => p.expiry_date && p.expiry_date.startsWith(dateStr));

            return (
              <div key={dateObj.toISOString()} className={`bg-card p-2 min-h-[120px] transition-colors hover:bg-muted/30 ${isToday ? 'bg-blue-50/30' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-primary-foreground shadow-sm' : 'text-foreground'}`}>
                    {dateObj.getDate()}
                  </span>
                  {dayPolicies.length > 0 && (
                    <Badge variant="secondary" className="text-[10px] px-1.5 h-5 bg-muted">{dayPolicies.length}</Badge>
                  )}
                </div>
                <div className="space-y-1.5 overflow-y-auto max-h-[80px] pr-1 scrollbar-thin">
                  {dayPolicies.map(p => (
                    <div
                      key={p.id}
                      onClick={() => onEdit(p)}
                      className="text-[10px] px-1.5 py-1 rounded truncate cursor-pointer hover:opacity-80 border bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      title={`${p.customer_name || "Unknown"} (${p.policy_number || "Draft"})`}
                    >
                      {p.customer_name ? `${p.customer_name} - ${p.policy_number || "Draft"}` : (p.policy_number || "Renewal")}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
