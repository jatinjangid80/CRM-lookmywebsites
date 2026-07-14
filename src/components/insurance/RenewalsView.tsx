import React, { useMemo } from "react";
import { InsuranceTable } from "./InsuranceTable";
import { AlertCircle, CalendarClock, History } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";

interface RenewalsViewProps {
  policies: any[];
  companies: any[];
  vendors: any[];
  onRenew: (policy: any) => void;
  onEdit: (policy: any) => void;
  onDelete: (policy: any) => void;
}

export function RenewalsView({ policies, companies, vendors, onRenew, onEdit, onDelete }: RenewalsViewProps) {
  
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
    const dateStr = date.toISOString().split('T')[0];
    return policies.filter(p => {
      if (!p.expiry_date) return false;
      return p.expiry_date.startsWith(dateStr);
    });
  }, [policies, date]);

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-display font-bold text-foreground">Upcoming Renewals</h2>
          <p className="text-sm text-muted-foreground">Manage and track policies that are expiring soon.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
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
        </div>

        <div className="xl:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-4 shadow-sm sticky top-6">
            <h3 className="font-bold mb-4">Renewal Calendar</h3>
            <div className="flex justify-center border-b border-border pb-4 mb-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
                modifiers={{
                  hasRenewal: (d) => {
                    const dStr = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0];
                    return policies.some(p => p.expiry_date && p.expiry_date.startsWith(dStr));
                  }
                }}
                modifiersStyles={{
                  hasRenewal: { fontWeight: 'bold', backgroundColor: '#ecfdf5', color: '#065f46' }
                }}
              />
            </div>
            
            <div>
              <h4 className="font-semibold text-sm mb-3">
                {date ? date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : 'Selected Date'}
              </h4>
              {selectedDatePolicies.length > 0 ? (
                <div className="space-y-3">
                  {selectedDatePolicies.map(p => {
                    const customerName = p.customer_id ? p.customer_id : "Unknown";
                    return (
                      <div key={p.id} className="p-3 bg-secondary/30 rounded-xl border border-border text-sm">
                        <div className="font-semibold">{p.policy_number || "No Policy #"}</div>
                        <div className="text-muted-foreground">{customerName}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No renewals on this date.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
