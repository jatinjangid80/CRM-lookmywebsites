import React, { useMemo, useState } from "react";
import { InsuranceTable } from "./InsuranceTable";
import { AlertCircle, CalendarClock, History, CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";

interface RenewalsViewProps {
  policies: any[];
  companies: any[];
  vendors: any[];
  onRenew: (policy: any) => void;
  onEdit: (policy: any) => void;
  onDelete: (policy: any) => void;
}

export function RenewalsView({ policies, companies, vendors, onRenew, onEdit, onDelete }: RenewalsViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
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

    policies.forEach(p => {
      const days = getDaysUntilExpiry(p.expiry_date);
      if (days < 0 || p.status === 'Expired') expired.push(p);
      else if (days === 0) todayList.push(p);
      else if (days <= 7) next7Days.push(p);
      else if (days <= 15) next15Days.push(p);
      else if (days <= 30) next30Days.push(p);
    });

    return { expired, todayList, next7Days, next15Days, next30Days };
  }, [policies]);

  const policyDates = useMemo(() => {
    return policies.map(p => {
      if (!p.expiry_date) return null;
      const d = new Date(p.expiry_date);
      d.setHours(0,0,0,0);
      return d;
    }).filter(Boolean) as Date[];
  }, [policies]);

  const selectedDatePolicies = useMemo(() => {
    if (!selectedDate) return null;
    return policies.filter(p => {
      if (!p.expiry_date) return false;
      const expiry = new Date(p.expiry_date);
      return expiry.getDate() === selectedDate.getDate() &&
             expiry.getMonth() === selectedDate.getMonth() &&
             expiry.getFullYear() === selectedDate.getFullYear();
    });
  }, [policies, selectedDate]);

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

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">Upcoming Renewals</h2>
          <p className="text-sm text-muted-foreground">Manage and track policies that are expiring soon.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6">
        <div>
          {selectedDate ? (
            <div>
              <div className="flex items-center justify-between mb-4 bg-primary/5 border border-primary/20 p-4 rounded-xl">
                <div>
                  <h3 className="font-bold text-primary flex items-center gap-2">
                    <CalendarIcon className="w-5 h-5" /> 
                    Renewals for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">Found {selectedDatePolicies?.length || 0} policies expiring on this date.</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => setSelectedDate(undefined)}>
                  Clear Filter
                </Button>
              </div>
              
              {selectedDatePolicies && selectedDatePolicies.length > 0 ? (
                <InsuranceTable 
                  policies={selectedDatePolicies} 
                  companies={companies} 
                  vendors={vendors} 
                  onEdit={onEdit} 
                  onDuplicate={onRenew} 
                  onDelete={onDelete} 
                />
              ) : (
                <div className="py-12 text-center flex flex-col items-center justify-center text-muted-foreground bg-card border border-border rounded-2xl">
                  <CalendarClock className="w-12 h-12 opacity-20 mb-3" />
                  <p className="text-base font-semibold">No renewals on this date.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              {categorizedPolicies.todayList.length === 0 && 
               categorizedPolicies.next7Days.length === 0 && 
               categorizedPolicies.next15Days.length === 0 && 
               categorizedPolicies.next30Days.length === 0 && 
               categorizedPolicies.expired.length === 0 && (
                 <div className="py-20 text-center flex flex-col items-center justify-center text-muted-foreground bg-card border border-border rounded-2xl">
                    <CalendarClock className="w-16 h-16 opacity-20 mb-4" />
                    <p className="text-lg font-semibold">No upcoming renewals in the next 30 days.</p>
                    <p className="text-sm mt-1">You are all caught up!</p>
                 </div>
              )}

              {renderSection("Expiring Today", categorizedPolicies.todayList, <AlertCircle className="w-5 h-5" />, "bg-rose-50", "text-rose-700")}
              {renderSection("Next 7 Days", categorizedPolicies.next7Days, <CalendarClock className="w-5 h-5" />, "bg-amber-50", "text-amber-700")}
              {renderSection("Next 15 Days", categorizedPolicies.next15Days, <CalendarClock className="w-5 h-5" />, "bg-yellow-50", "text-yellow-700")}
              {renderSection("Next 30 Days", categorizedPolicies.next30Days, <CalendarClock className="w-5 h-5" />, "bg-blue-50", "text-blue-700")}
              {renderSection("Already Expired", categorizedPolicies.expired, <History className="w-5 h-5" />, "bg-slate-100", "text-slate-700")}
            </>
          )}
        </div>

        <div>
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm sticky top-6">
            <h3 className="font-semibold text-sm mb-3 px-2 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-primary" /> Select a Date
            </h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="flex justify-center w-full"
              modifiers={{ hasPolicy: policyDates }}
              modifiersClassNames={{ 
                hasPolicy: "font-bold text-primary bg-primary/10 rounded-full",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
